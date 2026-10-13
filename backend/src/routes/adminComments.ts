/**
 * MSKLabsDesk — Admin Blog Yorum Moderasyonu Endpoints
 */

import { AuthEnv, verifyAuthToken } from '../utils/auth';

/**
 * GET /api/admin/comments — Yorumları Listele
 */
export async function handleAdminGetComments(request: Request, env: { DB: D1Database } & AuthEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get('status');

  let query = 'SELECT * FROM comments WHERE 1=1';
  const params: any[] = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT 200';

  const stmt = env.DB.prepare(query);
  const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();

  return new Response(JSON.stringify({ success: true, comments: results || [] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/**
 * POST /api/admin/comments/:id/moderate — Yorum Onayla / Reddet / Spam İşaretle
 */
export async function handleAdminModerateComment(commentId: string, request: Request, env: { DB: D1Database } & AuthEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const body = await request.json() as { status?: 'approved' | 'rejected' | 'spam' };
  if (!body.status) {
    return new Response(JSON.stringify({ error: 'Geçerli bir moderasyon statüsü girin.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  await env.DB.prepare('UPDATE comments SET status = ? WHERE id = ?').bind(body.status, commentId).run();

  return new Response(JSON.stringify({ success: true, message: `Yorum '${body.status}' olarak güncellendi.` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
