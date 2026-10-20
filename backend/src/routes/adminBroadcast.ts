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
export async function handleAdminBroadcastNewsletter(
  request: Request,
  env: { DB: D1Database } & AuthEnv & EmailEnv,
  ctx?: ExecutionContext
): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const rawBody = await request.json() as any;
  const subject = (rawBody.subject || rawBody.title || '').trim();
  const content_html = (rawBody.content_html || rawBody.content || '').trim();
  const targetCategory = rawBody.category || rawBody.target_preference || 'all';

  if (!subject || !content_html) {
    return new Response(JSON.stringify({ error: 'Konu (subject) ve HTML içeriği (content_html) gereklidir.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    });
  }

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

  // 2. D1 Batch ile E-Posta Kuyruğuna Tek Seferde Ekle
  if (targetList.length > 0) {
    const batchStmts = targetList.map((email) =>
      env.DB.prepare(`
        INSERT INTO email_queue (recipient_email, subject, body_html, email_type, status, scheduled_at)
        VALUES (?, ?, ?, 'newsletter', 'pending', CURRENT_TIMESTAMP)
      `).bind(email, subject, content_html)
    );
    await env.DB.batch(batchStmts);
  }

  // 3. Arka Plan İletimini Başlat (Workers subrequest kotasını aşmamak için ilk 10 alıcı)
  if (targetList.length > 0 && ctx) {
    const sendBatchPromise = (async () => {
      const immediateList = targetList.slice(0, 10);
      for (const email of immediateList) {
        try {
          const res = await sendEmail({
            to: email,
            subject,
            html: content_html,
            emailType: 'newsletter'
          }, env);
          if (res.success) {
            await env.DB.prepare(
              "UPDATE email_queue SET status = 'sent', sent_at = CURRENT_TIMESTAMP WHERE recipient_email = ? AND subject = ? AND status = 'pending'"
            ).bind(email, subject).run();
          }
        } catch (err) {
          console.error(`Bülten iletim hatası (${email}):`, err);
        }
      }
    })();
    ctx.waitUntil(sendBatchPromise);
  }

  return new Response(JSON.stringify({
    success: true,
    recipient_count: targetList.length,
    message: `${targetList.length} aboneye bülten kuyruğa alındı ve gönderim başlatıldı.`,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
