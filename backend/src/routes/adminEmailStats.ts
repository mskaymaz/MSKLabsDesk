/**
 * MSKLabsDesk — Giden E-Posta Kota ve Denetim İstatistikleri (COM-OUTBOUND-002)
 * File: backend/src/routes/adminEmailStats.ts
 */

import { AuthEnv, verifyAuthToken } from '../utils/auth';

export async function handleAdminGetEmailStats(
  request: Request,
  env: { DB: D1Database } & AuthEnv
): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const today = new Date().toISOString().slice(0, 10);
  const currentMonth = today.slice(0, 7); // 'YYYY-MM'

  try {
    // 1. Bugünün istatistikleri
    const todayRow = await env.DB.prepare(
      'SELECT * FROM email_daily_stats WHERE stat_date = ?'
    ).bind(today).first<any>();

    // 2. Bu ayın toplamları
    const monthRow = await env.DB.prepare(`
      SELECT 
        COALESCE(SUM(resend_count), 0) AS resend_month,
        COALESCE(SUM(brevo_count), 0) AS brevo_month,
        COALESCE(SUM(total_count), 0) AS total_month
      FROM email_daily_stats
      WHERE stat_date LIKE ?
    `).bind(`${currentMonth}%`).first<any>();

    // 3. Son 30 gönderim denetim günlüğü
    const { results: recentLogs } = await env.DB.prepare(`
      SELECT id, email_type, recipient_masked, subject, provider, status_code, is_success, error_message, created_at
      FROM email_outbound_logs
      ORDER BY created_at DESC
      LIMIT 30
    `).all();

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          today: {
            date: today,
            resend_count: todayRow?.resend_count || 0,
            resend_limit: 100,
            brevo_count: todayRow?.brevo_count || 0,
            brevo_limit: 300,
            total_count: todayRow?.total_count || 0,
          },
          month: {
            month: currentMonth,
            resend_total: monthRow?.resend_month || 0,
            resend_limit: 3000,
            brevo_total: monthRow?.brevo_month || 0,
            total: monthRow?.total_month || 0,
          },
          recent_logs: recentLogs || [],
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[ADMIN EMAIL STATS ERROR]', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'İstatistikler alınamadı.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
