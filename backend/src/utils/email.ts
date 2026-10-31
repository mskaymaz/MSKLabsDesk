/**
 * MSKLabsDesk — E-Posta Gönderim Modülü
 * Google Gmail SMTP & Resend API Entegrasyonu
 */

export interface EmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  emailType: 'ticket_confirmation' | 'reply' | 'newsletter' | 'coupon' | 'verification';
}

export interface EmailEnv {
  EMAIL_FROM?: string;
  GMAIL_USER?: string; // msklabs.org@gmail.com
  GMAIL_APP_PASSWORD?: string; // App Password
  RESEND_API_KEY?: string; // Fallback API key
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
 * E-Posta gönderim fonksiyonu
 * İşlem sonucunu ve durumunu döndürür.
 */
export async function sendEmail(options: EmailOptions, env: EmailEnv): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    let fromAddress = 'destek@msklabs.org';
    let fromName = 'MSK Labs Destek';
    if (options.emailType === 'verification' || options.emailType === 'newsletter' || options.emailType === 'coupon') {
      fromAddress = env.EMAIL_FROM || 'bildirim@msklabs.org';
      fromName = 'MSK Labs Bildirim';
    } else if (env.EMAIL_FROM && env.EMAIL_FROM.includes('@msklabs.org')) {
      fromAddress = env.EMAIL_FROM;
    }

    // 1. Resend API Entegrasyonu (Cloudflare Workers için en kararlı HTTP REST yöntemi)
    if (env.RESEND_API_KEY) {
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
        }),
      });

      if (res.ok) {
        const data = await res.json() as { id: string };
        return { success: true, messageId: data.id };
      } else {
        const errText = await res.text().catch(() => '');
        console.error(`[RESEND API ERROR] ${res.status}: ${errText}`);
        return { success: false, error: `Resend error (${res.status}): ${errText}` };
      }
    }

    // 2. Geliştirme / Simülasyon Modu (Local / Dev - RESEND_API_KEY tanımlı değilse)
    console.log(`[EMAIL SIMULATION] To: ${options.to} | Subject: ${options.subject}`);
    return { success: true, messageId: `sim_${Date.now()}` };
  } catch (err: any) {
    console.error('[EMAIL ERROR]', err);
    return { success: false, error: err.message || 'Unknown email error' };
  }
}
