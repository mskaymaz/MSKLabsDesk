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
    const raw = await request.json() as any;

    const postType = (raw.post_type || raw.postType || 'bizce').trim();
    const postSlug = (raw.post_slug || raw.postSlug || '').trim();
    const authorName = (raw.author_name || raw.authorName || '').trim();
    const authorEmail = (raw.author_email || raw.authorEmail || '').trim().toLowerCase();
    const content = (raw.content || raw.comment_text || '').trim();

    if (!postSlug || !authorName || !authorEmail || !content) {
      return new Response(
        JSON.stringify({ error: 'Lütfen tüm alanları (isim, e-posta, yorum) eksiksiz doldurun.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(authorEmail)) {
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
      postType,
      postSlug,
      authorName,
      authorEmail,
      content,
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
    const postSlug = (url.searchParams.get('post_slug') || url.searchParams.get('postSlug') || '').trim();

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
    `).bind(postSlug).all();

    return new Response(
      JSON.stringify({ success: true, comments: results || [], data: results || [] }),
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
