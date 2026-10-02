/**
 * MSKLabsDesk — Blog Yorum API Endpoints (POST & GET /api/comments)
 */

export interface CommentPayload {
  post_type: 'bizce' | 'aniltilar' | 'guncel';
  post_slug: string;
  author_name: string;
  author_email: string;
  content: string;
}

/**
 * POST /api/comments — Yeni Yorum Gönderme
 */
export async function handleCommentSubmission(request: Request, env: { DB: D1Database }): Promise<Response> {
  try {
    const payload = await request.json() as CommentPayload;

    if (!payload.post_type || !payload.post_slug || !payload.author_name || !payload.author_email || !payload.content) {
      return new Response(
        JSON.stringify({ error: 'Lütfen tüm alanları eksiksiz doldurun.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.author_email.trim())) {
      return new Response(
        JSON.stringify({ error: 'Geçersiz e-posta adresi biçimi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const commentId = `cmt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const ipAddress = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || '127.0.0.1';
    const userAgent = request.headers.get('User-Agent') || 'Unknown';

    await env.DB.prepare(`
      INSERT INTO comments (id, post_type, post_slug, author_name, author_email, content, status, ip_address, user_agent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, CURRENT_TIMESTAMP)
    `).bind(
      commentId,
      payload.post_type,
      payload.post_slug.trim(),
      payload.author_name.trim(),
      payload.author_email.trim().toLowerCase(),
      payload.content.trim(),
      ipAddress,
      userAgent
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        comment_id: commentId,
        message: 'Yorumunuz alındı. Yönetici onayından sonra yayınlanacaktır.',
      }),
      { status: 201, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[COMMENT POST ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * GET /api/comments?post_slug=... — Onaylanmış Yorumları Listeleme
 */
export async function handleGetApprovedComments(request: Request, env: { DB: D1Database }): Promise<Response> {
  try {
    const url = new URL(request.url);
    const postSlug = url.searchParams.get('post_slug');

    if (!postSlug) {
      return new Response(
        JSON.stringify({ error: 'post_slug parametresi gereklidir.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const { results } = await env.DB.prepare(`
      SELECT id, post_type, post_slug, author_name, content, created_at
      FROM comments
      WHERE post_slug = ? AND status = 'approved'
      ORDER BY created_at ASC
    `).bind(postSlug.trim()).all();

    return new Response(
      JSON.stringify({ success: true, comments: results || [] }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[COMMENT GET ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
