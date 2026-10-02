import { verifyAuthToken } from '../utils/auth';

export async function handleCmsChannels(request: Request, env: any): Promise<Response> {
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

  // 1. GET /api/admin/channels — Tüm blog kanallarını getir
  if (method === 'GET') {
    const { results } = await env.DB.prepare(
      `SELECT * FROM blog_channels ORDER BY display_order ASC, created_at DESC`
    ).all();

    return new Response(JSON.stringify({ channels: results || [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. POST /api/admin/channels — Yeni Dinamik Blog Kanalı Oluştur (Örn: Hikayeler, Şiirler)
  if (method === 'POST') {
    const body = await request.json() as any;
    const { slug, name_tr, name_en, name_ar, description_tr, description_en, description_ar, icon, display_order } = body;

    if (!slug || !name_tr) {
      return new Response(JSON.stringify({ error: 'slug ve name_tr zorunludur' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = `ch_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    await env.DB.prepare(
      `INSERT INTO blog_channels (id, slug, name_tr, name_en, name_ar, description_tr, description_en, description_ar, icon, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      slug.toLowerCase().trim(),
      name_tr,
      name_en || null,
      name_ar || null,
      description_tr || null,
      description_en || null,
      description_ar || null,
      icon || 'book-open',
      display_order || 0
    ).run();

    return new Response(JSON.stringify({ success: true, channelId: id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. PUT /api/admin/channels/:id — Blog Kanalını Güncelle
  if (method === 'PUT') {
    const channelId = url.pathname.split('/').pop();
    const body = await request.json() as any;

    const { slug, name_tr, name_en, name_ar, description_tr, description_en, description_ar, icon, display_order, is_active } = body;

    await env.DB.prepare(
      `UPDATE blog_channels 
       SET slug = ?, name_tr = ?, name_en = ?, name_ar = ?, description_tr = ?, description_en = ?, description_ar = ?, icon = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      slug,
      name_tr,
      name_en || null,
      name_ar || null,
      description_tr || null,
      description_en || null,
      description_ar || null,
      icon || 'book-open',
      display_order || 0,
      is_active !== undefined ? (is_active ? 1 : 0) : 1,
      channelId
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. DELETE /api/admin/channels/:id — Blog Kanalını Sil
  if (method === 'DELETE') {
    const channelId = url.pathname.split('/').pop();
    await env.DB.prepare(`DELETE FROM blog_channels WHERE id = ?`).bind(channelId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
