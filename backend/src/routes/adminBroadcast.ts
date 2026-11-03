/**
 * MSKLabsDesk — Admin E-Bülten Toplu Yayın ve İstatistik Endpoints
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

  const { results: subscribers } = await env.DB.prepare('SELECT id, email, status, source, created_at, verified_at FROM subscribers ORDER BY created_at DESC LIMIT 200').all();
  const totalSubscribers = await env.DB.prepare("SELECT COUNT(*) as count FROM subscribers WHERE status = 'active'").first<{ count: number }>();

  const mappedSubscribers = (subscribers || []).map((s: any) => ({
    id: s.id,
    email: s.email,
    status: s.status,
    is_verified: s.status === 'active' || !!s.verified_at,
    unsubscribed_at: s.status === 'unsubscribed' ? s.created_at : undefined,
    kvkk_consent: true,
    source: s.source,
    created_at: s.created_at,
    verified_at: s.verified_at,
  }));

  return new Response(JSON.stringify({
    success: true,
    total_active: totalSubscribers?.count || 0,
    subscribers: mappedSubscribers,
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
  const campaignId = `cmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  // 2. Bülten Kampanya Kaydını D1'e Oluştur
  try {
    await env.DB.prepare(`
      INSERT INTO newsletter_campaigns (id, subject, target_category, total_recipients, sent_count, failed_count, status, created_at)
      VALUES (?, ?, ?, ?, 0, 0, ?, CURRENT_TIMESTAMP)
    `).bind(
      campaignId,
      subject,
      targetCategory,
      targetList.length,
      targetList.length === 0 ? 'completed' : 'sending'
    ).run();
  } catch (err) {
    console.warn('newsletter_campaigns kaydı oluşturulamadı:', err);
  }

  // 3. D1 Batch ile E-Posta Kuyruğuna Tek Seferde Ekle
  if (targetList.length > 0) {
    const batchStmts = targetList.map((email) =>
      env.DB.prepare(`
        INSERT INTO email_queue (recipient_email, subject, body_html, email_type, status, scheduled_at)
        VALUES (?, ?, ?, 'newsletter', 'pending', CURRENT_TIMESTAMP)
      `).bind(email, subject, content_html)
    );
    await env.DB.batch(batchStmts);
  }

  // 4. Arka Plan İletimini Başlat (Workers subrequest kotasını aşmamak için ilk 10 alıcı)
  if (targetList.length > 0 && ctx) {
    const sendBatchPromise = (async () => {
      const immediateList = targetList.slice(0, 10);
      let sentCount = 0;
      let failedCount = 0;

      for (const email of immediateList) {
        try {
          const res = await sendEmail({
            to: email,
            subject,
            html: content_html,
            emailType: 'newsletter'
          }, env);
          if (res.success) {
            sentCount++;
            await env.DB.prepare(
              "UPDATE email_queue SET status = 'sent', sent_at = CURRENT_TIMESTAMP WHERE recipient_email = ? AND subject = ? AND status = 'pending'"
            ).bind(email, subject).run();
          } else {
            failedCount++;
          }
        } catch (err) {
          failedCount++;
          console.error(`Bülten iletim hatası (${email}):`, err);
        }
      }

      // Kampanya sayaçlarını güncelle
      try {
        await env.DB.prepare(`
          UPDATE newsletter_campaigns
          SET sent_count = sent_count + ?, failed_count = failed_count + ?, status = 'completed', completed_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(sentCount, failedCount, campaignId).run();
      } catch (err) {
        console.warn('newsletter_campaigns güncellenemedi:', err);
      }
    })();
    ctx.waitUntil(sendBatchPromise);
  }

  return new Response(JSON.stringify({
    success: true,
    campaign_id: campaignId,
    recipient_count: targetList.length,
    message: `${targetList.length} aboneye bülten kuyruğa alındı ve gönderim başlatıldı.`,
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * GET /api/admin/broadcast/history — Geçmiş Bülten Gönderimleri ve İstatistikleri
 */
export async function handleAdminGetBroadcastHistory(
  request: Request,
  env: { DB: D1Database } & AuthEnv
): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { results } = await env.DB.prepare(`
      SELECT id, subject, target_category, total_recipients, sent_count, failed_count, status, created_at, completed_at
      FROM newsletter_campaigns
      ORDER BY created_at DESC
      LIMIT 50
    `).all();

    const campaigns = (results || []).map((c: any) => {
      const total = c.total_recipients || 0;
      const sent = c.sent_count || 0;
      const rate = total > 0 ? Math.round((sent / total) * 100) : 100;
      return {
        ...c,
        delivery_rate: rate,
      };
    });

    return new Response(JSON.stringify({
      success: true,
      campaigns,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  } catch {
    // Tablo henüz yoksa veya hata olursa boş liste dön
    return new Response(JSON.stringify({
      success: true,
      campaigns: [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
