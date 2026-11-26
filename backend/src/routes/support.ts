/**
 * MSKLabsDesk — Destek & Talep Formu API Endpoint (POST /api/support)
 */

import { EmailEnv, sendEmail } from '../utils/email';
import { AIEnv, analyzeSupportTicketWithAI } from '../utils/ai';
import { validateEmailAddress } from '../utils/emailValidation';
import { getTicketConfirmationEmail, Language } from '../utils/emailTemplates';

export interface SupportTicketPayload {
  sender_name: string;
  sender_email: string;
  subject: string;
  content: string;
  category?: 'general' | 'bug' | 'feature' | 'billing' | 'idea' | 'thanks' | 'muhtelif' | 'other' | string;
}

/**
 * Benzersiz Bilet Numarası Üretici (Örn: MSK-2026-X8F2K9)
 */
export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MSK-${year}-${randomPart}`;
}

/**
 * POST /api/support İşleyicisi
 */
export async function handleSupportSubmission(
  request: Request,
  env: { DB: D1Database } & EmailEnv & AIEnv,
  ctx?: ExecutionContext
): Promise<Response> {
  try {
    const rawPayload = await request.json() as any;

    // 1. Honeypot Bot Koruması (Gizli alan doldurulmuşsa sessizce geçiştir)
    if (rawPayload.hp_company_field || rawPayload.supportHoneypot || rawPayload.website) {
      return new Response(JSON.stringify({ success: true, ticketId: generateTicketId() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    // 2. Matematik / İnsan Doğrulaması Kontrolü (Formdan gönderilmişse)
    if (rawPayload.captcha_expected !== undefined && rawPayload.captcha_answer !== undefined) {
      const expected = Number(rawPayload.captcha_expected);
      const answer = Number(rawPayload.captcha_answer);
      if (isNaN(answer) || answer !== expected) {
        return new Response(
          JSON.stringify({ error: 'Güvenlik doğrulaması (robot testi) hatalı yanıtlandı. Lütfen tekrar deneyin.' }),
          { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
      }
    }

    const sender_name = (rawPayload.sender_name || rawPayload.name || rawPayload.senderName || (rawPayload.app ? `${rawPayload.app} Kullanıcısı` : 'Web Ziyaretçisi')).trim();
    const sender_email = (rawPayload.sender_email || rawPayload.email || rawPayload.senderEmail || '').trim().toLowerCase();
    const subject = (rawPayload.subject || '').trim();
    const content = (rawPayload.content || rawPayload.message || rawPayload.description || '').trim();

    if (!sender_email || !subject || !content) {
      return new Response(
        JSON.stringify({ error: 'Lütfen tüm zorunlu alanları (e-posta, konu, içerik) doldurun.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sender_email)) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz e-posta adresi biçimi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const emailValidation = await validateEmailAddress(sender_email);
    const isEmailValid = emailValidation.valid;
    const emailStatus = isEmailValid ? 'valid' : 'invalid';

    const ticketId = generateTicketId();
    const category = rawPayload.category || 'general';
    const ecoDeviceId = typeof rawPayload.eco_device_id === 'string' && /^eco_[a-zA-Z0-9_-]{8,64}$/.test(rawPayload.eco_device_id.trim())
      ? rawPayload.eco_device_id.trim()
      : null;
    const appVersionRaw = rawPayload.app_version ?? rawPayload.ver;
    const appVersion = typeof appVersionRaw === 'string' && appVersionRaw.trim()
      ? appVersionRaw.trim().slice(0, 32)
      : null;
    const appSource = typeof rawPayload.app === 'string' && rawPayload.app.trim() ? rawPayload.app.trim().slice(0, 64) : 'Genel';
    const osSource = typeof rawPayload.os === 'string' && rawPayload.os.trim() ? rawPayload.os.trim().slice(0, 32) : '-';
    const requiresVerification = isEmailValid && sender_email !== 'destek@msklabs.org';
    const initialStatus = requiresVerification ? 'unverified' : 'new';
    const verificationToken = requiresVerification ? crypto.randomUUID() : null;

    // 1. D1 Veritabanına Kayıt
    await env.DB.prepare(`
      INSERT INTO messages (id, sender_name, sender_email, subject, content, category, status, email_status, eco_device_id, app_version, app_name, os_name, verification_token, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      ticketId,
      sender_name,
      sender_email,
      subject,
      content,
      category,
      initialStatus,
      emailStatus,
      ecoDeviceId,
      appVersion,
      appSource,
      osSource,
      verificationToken
    ).run();

    // 2. Message Event Log Kaydı
    const metaNote = `[Uygulama: ${appSource}, OS: ${osSource}, Sürüm: ${appVersion || '-'}]`;
    const eventDetails = isEmailValid
      ? `Kullanıcı destek talebi oluşturdu. ${metaNote}`
      : `Kullanıcı destek talebi oluşturdu. ${metaNote} (E-posta doğrulanamadı: ${emailValidation.reason || 'invalid_domain'})`;

    await env.DB.prepare(`
      INSERT INTO message_events (message_id, actor, action, details)
      VALUES (?, 'user', 'created', ?)
    `).bind(ticketId, eventDetails).run();

    // 3. Yapay Zeka (Gemini API) Otomatik Analizi
    const aiPromise = analyzeSupportTicketWithAI({
      id: ticketId,
      sender_name,
      subject,
      content,
      category
    }, env).then(async (analysis) => {
      if (analysis) {
        const newStatus = analysis.is_spam ? 'spam' : initialStatus;
        const preserveCategory = category && category !== 'general' ? category : (analysis.category || category);
        await env.DB.prepare(`
          UPDATE messages 
          SET category = ?, urgency = ?, ai_summary = ?, ai_draft = ?, status = ?
          WHERE id = ?
        `).bind(
          preserveCategory,
          analysis.urgency || 'medium',
          analysis.summary || null,
          analysis.draft_response || null,
          newStatus,
          ticketId
        ).run();

        await env.DB.prepare(`
          INSERT INTO message_events (message_id, actor, action, details)
          VALUES (?, 'system', 'ai_analyzed', ?)
        `).bind(ticketId, `Gemini AI analizi tamamlandı. Urgency: ${analysis.urgency}`).run();
      }
    }).catch(err => console.error('AI Analiz Hatası:', err));

    if (ctx) {
      ctx.waitUntil(aiPromise);
    }

    // 4. Otomatik E-Posta Gönderimi (Yalnızca e-posta geçerliyse)
    if (isEmailValid) {
      const userLang = (rawPayload.lang === 'en' || rawPayload.lang === 'ar') ? (rawPayload.lang as Language) : 'tr';
      const origin = new URL(request.url).origin;
      const verifyLinks = verificationToken
        ? {
            confirmUrl: `${origin}/api/support/verify?token=${verificationToken}&action=confirm`,
            cancelUrl: `${origin}/api/support/verify?token=${verificationToken}&action=cancel`,
          }
        : undefined;
      const emailData = getTicketConfirmationEmail(ticketId, sender_name, userLang, verifyLinks);

      const emailPromise = sendEmail({
        to: sender_email,
        toName: sender_name,
        subject: emailData.subject,
        html: emailData.html,
        emailType: 'ticket_confirmation'
      }, env).catch(err => console.error('E-Posta gönderim hatası:', err));

      if (ctx) {
        ctx.waitUntil(emailPromise);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        ticket_id: ticketId,
        ticketId: ticketId,
        email_valid: isEmailValid,
        email_status: emailStatus,
        email_reason: emailValidation.reason,
        message: isEmailValid
          ? 'Destek talebiniz başarıyla alındı. Onay e-postası iletildi.'
          : 'Destek talebiniz alındı ancak girdiğiniz e-posta adresi doğrulanamadı.',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[SUPPORT API ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Sunucu hatası oluştu. Lütfen tekrar deneyin.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * GET /api/support/verify?token=...&action=confirm|cancel
 * Kullanıcı e-posta onay / iptal uç noktası
 */
export async function handleSupportVerify(request: Request, env: { DB: D1Database }): Promise<Response> {
  const url = new URL(request.url);
  const token = (url.searchParams.get('token') || '').trim();
  const action = (url.searchParams.get('action') || 'confirm').trim().toLowerCase();

  const renderHtml = (icon: string, title: string, desc: string, ok: boolean) => {
    const color = ok ? '#16a34a' : '#dc2626';
    const html = `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — MSK Labs</title></head><body style="font-family:'Segoe UI',system-ui,sans-serif;background:#f8fafc;color:#0f172a;margin:0;padding:40px 16px;display:flex;justify-content:center;"><div style="max-width:480px;width:100%;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:32px;text-align:center;box-shadow:0 4px 12px rgba(15,23,42,0.06);"><div style="font-size:40px;margin-bottom:12px;">${icon}</div><h1 style="margin:0 0 12px;font-size:20px;color:${color};">${title}</h1><p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#334155;">${desc}</p><a href="https://msklabs.org" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600;font-size:14px;">MSK Labs Ana Sayfa</a></div></body></html>`;
    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  };

  if (!token) {
    return renderHtml('⚠️', 'Geçersiz Bağlantı', 'Doğrulama belirteci bulunamadı. Lütfen e-postanızdaki bağlantıyı eksiksiz açın.', false);
  }

  if (action === 'cancel') {
    const res = await env.DB.prepare("UPDATE messages SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE verification_token = ? AND status = 'unverified'").bind(token).run();
    if (res.meta?.changes && res.meta.changes > 0) {
      return renderHtml('❌', 'Talep İptal Edildi', 'Destek talebiniz isteğiniz üzerine iptal edilmiştir.', true);
    }
    return renderHtml('ℹ️', 'İşlem Zaten Tamamlanmış', 'Bu talep daha önce onaylanmış veya iptal edilmiş görünüyor.', true);
  }

  const row = await env.DB.prepare('SELECT id, status FROM messages WHERE verification_token = ?').bind(token).first<{ id: string; status: string }>();
  if (!row) {
    return renderHtml('⚠️', 'Bağlantı Bulunamadı', 'Doğrulama bağlantısı geçersiz veya süresi dolmuş.', false);
  }
  if (row.status === 'unverified') {
    await env.DB.prepare("UPDATE messages SET status = 'new', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(row.id).run();
    await env.DB.prepare("INSERT INTO message_events (message_id, actor, action, details) VALUES (?, 'user', 'email_verified', 'Kullanıcı e-posta doğrulamasını tamamladı.')").bind(row.id).run();
    return renderHtml('✅', 'Talebiniz Onaylandı!', `Biletiniz (${row.id}) başarıyla onaylandı ve destek ekibimize iletildi. Teşekkür ederiz.`, true);
  }
  return renderHtml('✅', 'Talebiniz Zaten Onaylı', `Biletiniz (${row.id}) daha önce doğrulanmış ve inceleme kuyruğundadır.`, true);
}
