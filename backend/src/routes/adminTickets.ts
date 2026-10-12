/**
 * MSKLabsDesk — Admin Destek & Talep Yönetimi Endpoints
 */

import { AuthEnv, verifyAuthToken } from '../utils/auth';
import { EmailEnv, sendEmail } from '../utils/email';
import { AIEnv, analyzeSupportTicketWithAI, translateTicketToTurkishWithAI } from '../utils/ai';

/**
 * GET /api/admin/tickets — Mesaj Listeleme
 */
export async function handleAdminGetTickets(request: Request, env: { DB: D1Database } & AuthEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const category = url.searchParams.get('category');

  let query = 'SELECT * FROM messages WHERE 1=1';
  const params: any[] = [];

  if (status) {
    if (status === 'new') {
      query += ' AND (status = ? OR status = ?)';
      params.push('new', 'open');
    } else {
      query += ' AND status = ?';
      params.push(status);
    }
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  query += ' ORDER BY created_at DESC LIMIT 100';

  const stmt = env.DB.prepare(query);
  const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

  const formattedTickets = (results || []).map((t: any) => ({
    ...t,
    message_content: t.content || t.message_content || '',
    ai_suggested_reply: t.ai_draft || t.ai_suggested_reply || null,
  }));

  return new Response(JSON.stringify({ success: true, tickets: formattedTickets }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * GET /api/admin/tickets/:id — Detay Gör
 */
export async function handleAdminGetTicketDetail(ticketId: string, request: Request, env: { DB: D1Database } & AuthEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const ticket = await env.DB.prepare('SELECT * FROM messages WHERE id = ?').bind(ticketId).first();
  if (!ticket) {
    return new Response(JSON.stringify({ error: 'Bilet bulunamadı.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  const formattedTicket = {
    ...ticket,
    message_content: (ticket as any).content || (ticket as any).message_content || '',
    ai_suggested_reply: (ticket as any).ai_draft || (ticket as any).ai_suggested_reply || null,
  };

  const { results: events } = await env.DB.prepare('SELECT * FROM message_events WHERE message_id = ? ORDER BY created_at ASC').bind(ticketId).all();
  const { results: replies } = await env.DB.prepare('SELECT * FROM replies WHERE message_id = ? ORDER BY sent_at ASC').bind(ticketId).all();

  return new Response(JSON.stringify({
    success: true,
    ticket: formattedTicket,
    events: events || [],
    replies: replies || [],
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * POST /api/admin/tickets/:id/reply — Cevap Gönder
 */
export async function handleAdminReplyTicket(ticketId: string, request: Request, env: { DB: D1Database } & AuthEnv & EmailEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const body = await request.json() as { reply_content?: string };
  if (!body.reply_content || !body.reply_content.trim()) {
    return new Response(JSON.stringify({ error: 'Cevap içeriği boş olamaz.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const ticket = await env.DB.prepare('SELECT * FROM messages WHERE id = ?').bind(ticketId).first<{ sender_email: string; sender_name: string; subject: string }>();
  if (!ticket) {
    return new Response(JSON.stringify({ error: 'Bilet bulunamadı.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  const replyId = `rpl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const replyContent = body.reply_content.trim();

  // 1. Reply Kaydet
  await env.DB.prepare(`
    INSERT INTO replies (id, message_id, admin_name, reply_content, sent_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(replyId, ticketId, admin.name, replyContent).run();

  // 2. Durum Güncelle
  await env.DB.prepare("UPDATE messages SET status = 'resolved', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(ticketId).run();

  // 3. Audit Log
  await env.DB.prepare(`
    INSERT INTO message_events (message_id, actor, action, details)
    VALUES (?, 'admin', 'reply_sent', ?)
  `).bind(ticketId, `${admin.name} yanıt iletti.`).run();

  // 4. Kullanıcıya Yanıt E-Postası Gönder
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2>Merhaba ${ticket.sender_name},</h2>
      <p><strong>[${ticketId}]</strong> numaralı destek talebinize yanıt verildi:</p>
      <div style="background: #f8fafc; border-left: 4px solid #0284c7; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        ${replyContent.replace(/\n/g, '<br />')}
      </div>
      <p>Bizi tercih ettiğiniz için teşekkür ederiz,<br /><strong>MSK Labs Ekibi</strong></p>
    </div>
  `;

  sendEmail({
    to: ticket.sender_email,
    toName: ticket.sender_name,
    subject: `Re: [${ticketId}] ${ticket.subject}`,
    html: emailHtml,
    emailType: 'reply'
  }, env).catch(err => console.error('Yanıt e-posta hatası:', err));

  return new Response(JSON.stringify({ success: true, message: 'Yanıt kullanıcıya iletildi ve bilet çözüldü olarak işaretlendi.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * POST /api/admin/tickets/:id/status — Durum Güncelle (Onayla / Reddet / Spam)
 */
export async function handleAdminUpdateTicketStatus(ticketId: string, request: Request, env: { DB: D1Database } & AuthEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const body = await request.json() as { status?: string };
  if (!body.status) {
    return new Response(JSON.stringify({ error: 'Durum bilgisi gereklidir.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  await env.DB.prepare('UPDATE messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(body.status, ticketId).run();
  await env.DB.prepare('INSERT INTO message_events (message_id, actor, action, details) VALUES (?, ?, "status_changed", ?)').bind(ticketId, admin.name, `Durum '${body.status}' olarak güncellendi.`).run();

  return new Response(JSON.stringify({ success: true, message: 'Bilet durumu güncellendi.' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * POST /api/admin/tickets/:id/analyze — Bilet İçin Yapay Zeka Analizi Çalıştır
 */
export async function handleAdminAnalyzeTicket(ticketId: string, request: Request, env: { DB: D1Database } & AuthEnv & AIEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const ticket = await env.DB.prepare('SELECT * FROM messages WHERE id = ?').bind(ticketId).first<any>();
  if (!ticket) {
    return new Response(JSON.stringify({ error: 'Bilet bulunamadı.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  const analysis = await analyzeSupportTicketWithAI({
    id: ticket.id,
    sender_name: ticket.sender_name,
    subject: ticket.subject,
    content: ticket.content,
    category: ticket.category
  }, env);

  if (analysis) {
    await env.DB.prepare(`
      UPDATE messages 
      SET urgency = ?, ai_summary = ?, ai_draft = ?
      WHERE id = ?
    `).bind(
      analysis.urgency || 'medium',
      analysis.summary || null,
      analysis.draft_response || null,
      ticketId
    ).run();

    await env.DB.prepare(`
      INSERT INTO message_events (message_id, actor, action, details)
      VALUES (?, 'admin', 'ai_analyzed_manual', ?)
    `).bind(ticketId, `${admin.name} yapay zeka analizini çalıştırdı.`).run();
  }

  return new Response(JSON.stringify({ success: true, analysis }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * POST /api/admin/tickets/analyze-all — Tüm Bekleyen Mesajları AI ile Analiz Et
 */
export async function handleAdminAnalyzeAllTickets(request: Request, env: { DB: D1Database } & AuthEnv & AIEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const { results } = await env.DB.prepare("SELECT * FROM messages WHERE ai_summary IS NULL LIMIT 50").all<any>();
  const ticketsToAnalyze = results || [];

  let count = 0;
  for (const t of ticketsToAnalyze) {
    const analysis = await analyzeSupportTicketWithAI({
      id: t.id,
      sender_name: t.sender_name,
      subject: t.subject,
      content: t.content,
      category: t.category
    }, env);

    if (analysis) {
      await env.DB.prepare(`
        UPDATE messages 
        SET urgency = ?, ai_summary = ?, ai_draft = ?
        WHERE id = ?
      `).bind(
        analysis.urgency || 'medium',
        analysis.summary || null,
        analysis.draft_response || null,
        t.id
      ).run();
      count++;
    }
  }

  return new Response(JSON.stringify({ success: true, count, message: `${count} bilet yapay zeka ile analiz edildi.` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * POST /api/admin/tickets/:id/translate — Yabancı Dildeki Bilet İçeriğini Türkçe'ye Çevir
 */
export async function handleAdminTranslateTicket(ticketId: string, request: Request, env: { DB: D1Database } & AuthEnv & AIEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const ticket = await env.DB.prepare('SELECT * FROM messages WHERE id = ?').bind(ticketId).first<any>();
  if (!ticket) {
    return new Response(JSON.stringify({ error: 'Bilet bulunamadı.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  const translation = await translateTicketToTurkishWithAI({
    subject: ticket.subject,
    content: ticket.content
  }, env);

  return new Response(JSON.stringify({
    success: true,
    ticket_id: ticketId,
    original_subject: ticket.subject,
    original_content: ticket.content,
    detected_language: translation.detected_language,
    translated_subject: translation.translated_subject,
    translated_content: translation.translated_content
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

