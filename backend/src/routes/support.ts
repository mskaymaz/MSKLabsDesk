/**
 * MSKLabsDesk — Destek & Talep Formu API Endpoint (POST /api/support)
 */

import { EmailEnv, sendEmail } from '../utils/email';
import { AIEnv, analyzeSupportTicketWithAI } from '../utils/ai';

export interface SupportTicketPayload {
  sender_name: string;
  sender_email: string;
  subject: string;
  content: string;
  category?: 'general' | 'bug' | 'feature' | 'billing';
}

/**
 * Benzersiz Bilet Numarası Üretici (Örn: MSK-2026-X8F2)
 */
export function generateTicketId(): string {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `MSK-${year}-${randomPart}`;
}

/**
 * POST /api/support İşleyicisi
 */
export async function handleSupportSubmission(request: Request, env: { DB: D1Database } & EmailEnv & AIEnv): Promise<Response> {
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

    const ticketId = generateTicketId();
    const category = rawPayload.category || 'general';

    // 1. D1 Veritabanına Kayıt
    await env.DB.prepare(`
      INSERT INTO messages (id, sender_name, sender_email, subject, content, category, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP)
    `).bind(
      ticketId,
      sender_name,
      sender_email,
      subject,
      content,
      category
    ).run();

    // 2. Message Event Log Kaydı
    await env.DB.prepare(`
      INSERT INTO message_events (message_id, actor, action, details)
      VALUES (?, 'user', 'created', 'Kullanıcı destek talebi oluşturdu.')
    `).bind(ticketId).run();

    // 3. Yapay Zeka (Gemini API) Otomatik Analizi
    analyzeSupportTicketWithAI({
      id: ticketId,
      sender_name,
      subject,
      content,
      category
    }, env).then(async (analysis) => {
      if (analysis) {
        const newStatus = analysis.is_spam ? 'spam' : 'new';
        await env.DB.prepare(`
          UPDATE messages 
          SET category = ?, urgency = ?, ai_summary = ?, ai_draft = ?, status = ?
          WHERE id = ?
        `).bind(
          analysis.category || category,
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

    // 4. Otomatik E-Posta Gönderimi
    const emailSubject = `[${ticketId}] Destek Talebiniz Alındı — MSK Labs`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Merhaba ${sender_name},</h2>
        <p>Destek talebiniz başarıyla kayıtlarımıza alınmıştır.</p>
        <p><strong>Bilet Numarası:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${ticketId}</code></p>
        <p><strong>Konu:</strong> ${subject}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0;" />
        <p>Talebiniz ekibimiz tarafından incelenip en kısa sürede bu e-posta adresi üzerinden yanıtlanacaktır.</p>
        <p>Teşekkür ederiz,<br /><strong>MSK Labs Destek Ekibi</strong></p>
      </div>
    `;

    sendEmail({
      to: sender_email,
      toName: sender_name,
      subject: emailSubject,
      html: emailHtml,
      emailType: 'ticket_confirmation'
    }, env).catch(err => console.error('E-Posta gönderim hatası:', err));

    return new Response(
      JSON.stringify({
        success: true,
        ticket_id: ticketId,
        ticketId: ticketId,
        message: 'Destek talebiniz başarıyla alındı. Onay e-postası iletildi.',
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
