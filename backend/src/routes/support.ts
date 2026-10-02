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
    const payload = await request.json() as SupportTicketPayload;

    if (!payload.sender_name || !payload.sender_email || !payload.subject || !payload.content) {
      return new Response(
        JSON.stringify({ error: 'Lütfen tüm zorunlu alanları (ad, e-posta, konu, içerik) doldurun.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.sender_email.trim())) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz e-posta adresi biçimi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const ticketId = generateTicketId();
    const category = payload.category || 'general';

    // 1. D1 Veritabanına Kayıt
    await env.DB.prepare(`
      INSERT INTO messages (id, sender_name, sender_email, subject, content, category, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'open', CURRENT_TIMESTAMP)
    `).bind(
      ticketId,
      payload.sender_name.trim(),
      payload.sender_email.trim().toLowerCase(),
      payload.subject.trim(),
      payload.content.trim(),
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
      sender_name: payload.sender_name.trim(),
      subject: payload.subject.trim(),
      content: payload.content.trim(),
      category
    }, env).then(async (analysis) => {
      if (analysis) {
        const newStatus = analysis.is_spam ? 'spam' : 'open';
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
        <h2>Merhaba ${payload.sender_name},</h2>
        <p>Destek talebiniz başarıyla kayıtlarımıza alınmıştır.</p>
        <p><strong>Bilet Numarası:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${ticketId}</code></p>
        <p><strong>Konu:</strong> ${payload.subject}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0;" />
        <p>Talebiniz ekibimiz tarafından incelenip en kısa sürede bu e-posta adresi üzerinden yanıtlanacaktır.</p>
        <p>Teşekkür ederiz,<br /><strong>MSK Labs Destek Ekibi</strong></p>
      </div>
    `;

    sendEmail({
      to: payload.sender_email.trim(),
      toName: payload.sender_name.trim(),
      subject: emailSubject,
      html: emailHtml,
      emailType: 'ticket_confirmation'
    }, env).catch(err => console.error('E-Posta gönderim hatası:', err));

    return new Response(
      JSON.stringify({
        success: true,
        ticket_id: ticketId,
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
