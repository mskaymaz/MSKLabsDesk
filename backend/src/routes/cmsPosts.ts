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
      cover_image, meta_keywords, status, author_name, video_url
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
        cover_image, meta_keywords, author_name, status, published_at, video_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, channel_id, slug.toLowerCase().trim(),
      title_tr, title_en || null, title_ar || null,
      content_tr, content_en || null, content_ar || null,
      summary_tr || null, summary_en || null, summary_ar || null,
      cover_image || null, meta_keywords || null, author_name || user.name || 'MSK Labs',
      status || 'draft', publishedAt, video_url || null
    ).run();

    return new Response(JSON.stringify({ success: true, postId: id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. PUT /api/admin/posts/:id — Blog Yazısını Güncelle veya Durum Değiştir
  if (method === 'PUT') {
    const postId = url.pathname.split('/').pop();
    const body = await request.json() as any;

    // Sadece status güncellemesi gönderildiyse (kısmi güncelleme / yaşam döngüsü)
    if (body.status && Object.keys(body).length <= 2) {
      const { status } = body;
      const publishedAt = status === 'published' ? new Date().toISOString() : null;
      await env.DB.prepare(
        `UPDATE blog_posts SET
          status = ?,
          published_at = CASE WHEN ? = 'published' THEN COALESCE(published_at, ?) ELSE published_at END,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      ).bind(status, status, publishedAt, postId).run();

      return new Response(JSON.stringify({ success: true, status }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const {
      channel_id, slug,
      title_tr, title_en, title_ar,
      content_tr, content_en, content_ar,
      summary_tr, summary_en, summary_ar,
      cover_image, meta_keywords, status, author_name, video_url
    } = body;

    const publishedAt = status === 'published' ? new Date().toISOString() : null;

    await env.DB.prepare(
      `UPDATE blog_posts SET
        channel_id = ?, slug = ?,
        title_tr = ?, title_en = ?, title_ar = ?,
        content_tr = ?, content_en = ?, content_ar = ?,
        summary_tr = ?, summary_en = ?, summary_ar = ?,
        cover_image = ?, meta_keywords = ?, author_name = ?, status = ?,
        video_url = ?, published_at = COALESCE(published_at, ?), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      channel_id, slug,
      title_tr, title_en || null, title_ar || null,
      content_tr, content_en || null, content_ar || null,
      summary_tr || null, summary_en || null, summary_ar || null,
      cover_image || null, meta_keywords || null, author_name || 'MSK Labs', status || 'draft',
      video_url || null, publishedAt, postId
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 5. DELETE /api/admin/posts/:id — 3 Aşamalı Yaşam Döngüsü Koruması
  if (method === 'DELETE') {
    const postId = url.pathname.split('/').pop();
    const isPermanent = url.searchParams.get('permanent') === 'true';

    // Önce makalenin mevcut durumunu sorgula
    const currentPost = await env.DB.prepare(
      `SELECT id, status, title_tr FROM blog_posts WHERE id = ?`
    ).bind(postId).first() as any;

    if (!currentPost) {
      return new Response(JSON.stringify({ error: 'Makale bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Kural 1: Yayındaki makale ASLA doğrudan silinemez
    if (currentPost.status === 'published') {
      return new Response(JSON.stringify({
        error: 'Yayındaki bir makale doğrudan silinemez! Güvenlik için önce makaleyi yayından kaldırmalısınız.'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Kural 2: Zaten çöp kutusunda ise VEYA permanent=true ise kalıcı sil (Hard Delete)
    if (currentPost.status === 'trash' || isPermanent) {
      await env.DB.prepare(`DELETE FROM blog_posts WHERE id = ?`).bind(postId).run();
      return new Response(JSON.stringify({ success: true, action: 'permanent_deleted', message: 'Makale kalıcı olarak silindi.' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Kural 3: Yayından kalkmış veya taslak makaleyi çöp kutusuna taşı (Soft Delete)
    await env.DB.prepare(
      `UPDATE blog_posts SET status = 'trash', updated_at = CURRENT_TIMESTAMP WHERE id = ?`
    ).bind(postId).run();

    return new Response(JSON.stringify({ success: true, action: 'moved_to_trash', message: 'Makale çöp kutusuna taşındı.' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
