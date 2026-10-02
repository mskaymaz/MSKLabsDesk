/**
 * MSKLabsDesk — Admin E-Bülten Toplu Yayın Endpoints
 */

import { AuthEnv, verifyAuthToken } from '../utils/auth';
import { EmailEnv, sendEmail } from '../utils/email';

/**
 * GET /api/admin/subscribers — Abone Listesi ve İstatistikler
 */
export async function handleAdminGetSubscribers(request: Request, env: { DB: D1Database } & AuthEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const { results: subscribers } = await env.DB.prepare('SELECT id, email, status, source, created_at FROM subscribers ORDER BY created_at DESC LIMIT 200').all();
  const totalSubscribers = await env.DB.prepare("SELECT COUNT(*) as count FROM subscribers WHERE status = 'active'").first<{ count: number }>();

  return new Response(JSON.stringify({
    success: true,
    total_active: totalSubscribers?.count || 0,
    subscribers: subscribers || [],
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * POST /api/admin/broadcast — Segmentasyon Bazlı Toplu Bülten Gönderimi
 */
export async function handleAdminBroadcastNewsletter(request: Request, env: { DB: D1Database } & AuthEnv & EmailEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const body = await request.json() as { category?: string; subject?: string; content_html?: string };
  if (!body.subject || !body.content_html) {
    return new Response(JSON.stringify({ error: 'Konu ve HTML içeriği gereklidir.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const targetCategory = body.category || 'all';

  // 1. İlgili Kategoriye Abone Olmuş Aktif Kullanıcıları Sorgula
  let query = `
    SELECT DISTINCT s.email 
    FROM subscribers s
    JOIN subscriber_preferences p ON s.id = p.subscriber_id
    WHERE s.status = 'active' AND p.is_subscribed = 1
  `;
  
  if (targetCategory !== 'all') {
    query += " AND (p.category = ? OR p.category = 'all')";
  }

  const stmt = env.DB.prepare(query);
  const { results } = targetCategory !== 'all' ? await stmt.bind(targetCategory).all() : await stmt.all();

  const targetList = (results || []).map(r => r.email as string);

  // 2. E-Posta Kuyruğuna Ekle
  for (const email of targetList) {
    await env.DB.prepare(`
      INSERT INTO email_queue (recipient_email, subject, body_html, email_type, status, scheduled_at)
      VALUES (?, ?, ?, 'newsletter', 'pending', CURRENT_TIMESTAMP)
    `).bind(email, body.subject, body.content_html).run();

    // Arka plan simülasyon gönderimi
    sendEmail({
      to: email,
      subject: body.subject,
      html: body.content_html,
      emailType: 'newsletter'
    }, env).catch(err => console.error('Bülten iletim hatası:', err));
  }

  return new Response(JSON.stringify({
    success: true,
    recipient_count: targetList.length,
    message: `${targetList.length} aboneye bülten gönderimi başlatıldı.`,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
