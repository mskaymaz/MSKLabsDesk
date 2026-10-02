import { verifyAuthToken } from '../utils/auth';
import { translatePostWithAI } from '../utils/ai';

export async function handleCmsPosts(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;

  // Güvenli Yönetici Doğrulaması
  const user = await verifyAuthToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. POST /api/admin/translate — Gemini AI ile Çevir & SEO Özeti Üret
  if (url.pathname === '/api/admin/translate' && method === 'POST') {
    const body = await request.json() as any;
    const { title_tr, content_tr, summary_tr } = body;

    if (!title_tr || !content_tr) {
      return new Response(JSON.stringify({ error: 'title_tr ve content_tr zorunludur' }), { status: 400 });
    }

    const translated = await translatePostWithAI({ title_tr, content_tr, summary_tr }, env);
    if (!translated) {
      return new Response(JSON.stringify({ error: 'AI çeviri başarısız oldu' }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, translation: translated }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. GET /api/admin/posts — Tüm blog yazılarını getir (Kanal filtresi opsiyonel)
  if (method === 'GET') {
    const channelId = url.searchParams.get('channel_id');
    let query = `
      SELECT p.*, c.name_tr as channel_name, c.slug as channel_slug 
      FROM blog_posts p
      JOIN blog_channels c ON p.channel_id = c.id
    `;
    const params: any[] = [];

    if (channelId) {
      query += ` WHERE p.channel_id = ?`;
      params.push(channelId);
    }
    query += ` ORDER BY p.created_at DESC`;

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({ posts: results || [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. POST /api/admin/posts — Yeni Blog Yazısı Ekle (3 Dilli + Taslak/Yayın)
  if (method === 'POST') {
    const body = await request.json() as any;
    const {
      channel_id,
      slug,
      title_tr, title_en, title_ar,
      content_tr, content_en, content_ar,
      summary_tr, summary_en, summary_ar,
      cover_image, meta_keywords, status, author_name
    } = body;

    if (!channel_id || !slug || !title_tr || !content_tr) {
      return new Response(JSON.stringify({ error: 'channel_id, slug, title_tr ve content_tr zorunludur' }), { status: 400 });
    }

    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    await env.DB.prepare(
      `INSERT INTO blog_posts (
        id, channel_id, slug,
        title_tr, title_en, title_ar,
        content_tr, content_en, content_ar,
        summary_tr, summary_en, summary_ar,
        cover_image, meta_keywords, author_name, status, published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, channel_id, slug.toLowerCase().trim(),
      title_tr, title_en || null, title_ar || null,
      content_tr, content_en || null, content_ar || null,
      summary_tr || null, summary_en || null, summary_ar || null,
      cover_image || null, meta_keywords || null, author_name || user.name || 'MSK Labs',
      status || 'draft', publishedAt
    ).run();

    return new Response(JSON.stringify({ success: true, postId: id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. PUT /api/admin/posts/:id — Blog Yazısını Güncelle
  if (method === 'PUT') {
    const postId = url.pathname.split('/').pop();
    const body = await request.json() as any;

    const {
      channel_id, slug,
      title_tr, title_en, title_ar,
      content_tr, content_en, content_ar,
      summary_tr, summary_en, summary_ar,
      cover_image, meta_keywords, status, author_name
    } = body;

    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    await env.DB.prepare(
      `UPDATE blog_posts SET
        channel_id = ?, slug = ?,
        title_tr = ?, title_en = ?, title_ar = ?,
        content_tr = ?, content_en = ?, content_ar = ?,
        summary_tr = ?, summary_en = ?, summary_ar = ?,
        cover_image = ?, meta_keywords = ?, author_name = ?, status = ?,
        published_at = COALESCE(published_at, ?), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      channel_id, slug,
      title_tr, title_en || null, title_ar || null,
      content_tr, content_en || null, content_ar || null,
      summary_tr || null, summary_en || null, summary_ar || null,
      cover_image || null, meta_keywords || null, author_name || 'MSK Labs', status || 'draft',
      publishedAt, postId
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 5. DELETE /api/admin/posts/:id — Blog Yazısını Sil
  if (method === 'DELETE') {
    const postId = url.pathname.split('/').pop();
    await env.DB.prepare(`DELETE FROM blog_posts WHERE id = ?`).bind(postId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
