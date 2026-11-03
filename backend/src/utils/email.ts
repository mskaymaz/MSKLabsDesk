/**
 * MSKLabsDesk — E-Posta Gönderim Modülü
 * Resend API (Birincil) & Brevo API (Hacim Yedeği) Çift Kademeli Mimari (COM-OUTBOUND-002)
 */

export interface EmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text?: string;
  emailType: 'ticket_confirmation' | 'reply' | 'newsletter' | 'coupon' | 'verification';
}

export interface EmailEnv {
  EMAIL_FROM?: string;
  GMAIL_USER?: string; // msklabs.org@gmail.com
  GMAIL_APP_PASSWORD?: string; // App Password
  RESEND_API_KEY?: string; // Birincil API key (100/gün, 3000/ay)
  BREVO_API_KEY?: string; // Hacim Yedeği API key (300/gün)
  DB?: D1Database; // Gönderim denetim günlüğü ve kota takibi
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  provider: 'RESEND' | 'BREVO' | 'MOCK';
  error?: string;
}

/**
 * XSS ve HTML Injection önleme süzgeci
 */
export function escapeHtml(str?: string | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * E-posta adresini gizlilik ve KVKK uyumu için maskeler (örn: a***@domain.com)
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***@***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

/**
 * Gönderim günlüğü ve günlük kota sayacını D1'e kaydeder
 */
async function recordEmailAudit(
  env: EmailEnv,
  options: EmailOptions,
  provider: 'RESEND' | 'BREVO' | 'MOCK',
  statusCode: number,
  isSuccess: boolean,
  errorMessage?: string
): Promise<void> {
  if (!env.DB) return;
  try {
    const today = new Date().toISOString().slice(0, 10);
    const logId = `eml_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const masked = maskEmail(options.to);

    // 1. Ayrıntılı denetim günlüğü
    await env.DB.prepare(`
      INSERT INTO email_outbound_logs (id, email_type, recipient_masked, subject, provider, status_code, is_success, error_message, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      logId,
      options.emailType,
      masked,
      options.subject,
      provider,
      statusCode,
      isSuccess ? 1 : 0,
      errorMessage || null
    ).run();

    // 2. Günlük kümülatif kota sayacı
    if (isSuccess && provider !== 'MOCK') {
      const resendInc = provider === 'RESEND' ? 1 : 0;
      const brevoInc = provider === 'BREVO' ? 1 : 0;
      await env.DB.prepare(`
        INSERT INTO email_daily_stats (stat_date, resend_count, brevo_count, total_count, updated_at)
        VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
        ON CONFLICT(stat_date) DO UPDATE SET
          resend_count = email_daily_stats.resend_count + excluded.resend_count,
          brevo_count = email_daily_stats.brevo_count + excluded.brevo_count,
          total_count = email_daily_stats.total_count + 1,
          updated_at = CURRENT_TIMESTAMP
      `).bind(today, resendInc, brevoInc).run();
    }
  } catch (err) {
    console.warn('[EMAIL AUDIT ERROR] Failed to record email stats:', err);
  }
}

/**
 * Brevo REST API ile e-posta gönderimi (Yedek Hat)
 */
async function sendViaBrevo(
  options: EmailOptions,
  env: EmailEnv,
  fromName: string,
  fromAddress: string
): Promise<{ success: boolean; messageId?: string; statusCode: number; error?: string }> {
  try {
    const payload: Record<string, any> = {
      sender: { name: fromName, email: fromAddress },
      to: [{ email: options.to, name: options.toName || options.to }],
      subject: options.subject,
      htmlContent: options.html,
    };
    if (options.text) {
      payload.textContent = options.text;
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': env.BREVO_API_KEY!,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({})) as { messageId?: string };
      return { success: true, messageId: data.messageId || 'brevo_ok', statusCode: res.status };
    } else {
      const errText = await res.text().catch(() => '');
      return { success: false, statusCode: res.status, error: `Brevo error (${res.status}): ${errText}` };
    }
  } catch (err: any) {
    return { success: false, statusCode: 500, error: `Brevo network error: ${err.message}` };
  }
}

/**
 * E-Posta gönderim fonksiyonu (Çift Kademeli Akış)
 * 1. Resend API denenir.
 * 2. Kota aşımı (HTTP 429) veya bağlantı hatasında Brevo API'ye devredilir.
 * 3. Anahtar tanımlı değilse güvenli Simülasyon moduna geçer.
 */
export async function sendEmail(options: EmailOptions, env: EmailEnv): Promise<EmailSendResult> {
  let fromAddress = 'destek@msklabs.org';
  let fromName = 'MSK Labs Destek';
  if (options.emailType === 'verification' || options.emailType === 'newsletter' || options.emailType === 'coupon') {
    fromAddress = env.EMAIL_FROM || 'bildirim@msklabs.org';
    fromName = 'MSK Labs Bildirim';
  } else if (env.EMAIL_FROM && env.EMAIL_FROM.includes('@msklabs.org')) {
    fromAddress = env.EMAIL_FROM;
  }

  // 1. Resend API Entegrasyonu (Birincil Sağlayıcı)
  if (env.RESEND_API_KEY) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${fromName} <${fromAddress}>`,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      if (res.ok) {
        const data = await res.json() as { id: string };
        await recordEmailAudit(env, options, 'RESEND', res.status, true);
        return { success: true, messageId: data.id, provider: 'RESEND' };
      }

      const errText = await res.text().catch(() => '');
      console.warn(`[RESEND API WARN] Status: ${res.status}. Body: ${errText}`);

      // Kota Aşımı (429) veya Sunucu Hatası (5xx) durumunda Brevo yedeğine devir
      if ((res.status === 429 || res.status >= 500) && env.BREVO_API_KEY) {
        console.info(`[EMAIL FAILOVER] Resend returned ${res.status}. Switching to Brevo fallback adapter...`);
        const brevoRes = await sendViaBrevo(options, env, fromName, fromAddress);
        await recordEmailAudit(env, options, 'BREVO', brevoRes.statusCode, brevoRes.success, brevoRes.error);
        if (brevoRes.success) {
          return { success: true, messageId: brevoRes.messageId, provider: 'BREVO' };
        }
        return {
          success: false,
          provider: 'BREVO',
          error: `Primary (Resend: ${res.status}) and Fallback (Brevo: ${brevoRes.error}) both failed.`,
        };
      }

      await recordEmailAudit(env, options, 'RESEND', res.status, false, errText);
      return { success: false, provider: 'RESEND', error: `Resend error (${res.status}): ${errText}` };
    } catch (resendNetErr: any) {
      console.warn('[RESEND NETWORK ERROR]', resendNetErr);
      if (env.BREVO_API_KEY) {
        console.info('[EMAIL FAILOVER] Resend network error. Switching to Brevo fallback adapter...');
        const brevoRes = await sendViaBrevo(options, env, fromName, fromAddress);
        await recordEmailAudit(env, options, 'BREVO', brevoRes.statusCode, brevoRes.success, brevoRes.error);
        if (brevoRes.success) {
          return { success: true, messageId: brevoRes.messageId, provider: 'BREVO' };
        }
      }
      await recordEmailAudit(env, options, 'RESEND', 500, false, resendNetErr.message);
      return { success: false, provider: 'RESEND', error: resendNetErr.message };
    }
  }

  // 2. Yalnızca Brevo Anahtarı Mevcutsa
  if (env.BREVO_API_KEY) {
    const brevoRes = await sendViaBrevo(options, env, fromName, fromAddress);
    await recordEmailAudit(env, options, 'BREVO', brevoRes.statusCode, brevoRes.success, brevoRes.error);
    return {
      success: brevoRes.success,
      messageId: brevoRes.messageId,
      provider: 'BREVO',
      error: brevoRes.error,
    };
  }

  // 3. Geliştirme / Simülasyon Modu (Local / Dev)
  console.log(`[EMAIL SIMULATION] Provider: MOCK | To: ${maskEmail(options.to)} | Subject: ${options.subject}`);
  await recordEmailAudit(env, options, 'MOCK', 200, true);
  return { success: true, messageId: `sim_${Date.now()}`, provider: 'MOCK' };
}
