import { verifyAuthToken } from '../utils/auth';

export async function handleCmsTemplates(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;

  // Güvenli Yönetici Doğrulaması
  const user = await verifyAuthToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 1. GET /api/admin/templates — Tüm şablon ve reklam alanlarını getir
  if (method === 'GET') {
    const { results } = await env.DB.prepare(`SELECT * FROM site_templates`).all();
    return new Response(JSON.stringify({ templates: results || [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. PUT /api/admin/templates — Şablon veya Reklam Kodunu Güncelle / Kaydet
  if (method === 'PUT' || method === 'POST') {
    const body = await request.json() as any;
    const { key_name, content_tr, content_en, content_ar, meta_json, is_active } = body;

    if (!key_name) {
      return new Response(JSON.stringify({ error: 'key_name zorunludur' }), { status: 400 });
    }

    const id = `tpl_${key_name}`;

    await env.DB.prepare(
      `INSERT INTO site_templates (id, key_name, content_tr, content_en, content_ar, meta_json, is_active, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key_name) DO UPDATE SET
        content_tr = excluded.content_tr,
        content_en = excluded.content_en,
        content_ar = excluded.content_ar,
        meta_json = excluded.meta_json,
        is_active = excluded.is_active,
        updated_at = CURRENT_TIMESTAMP`
    ).bind(
      id, key_name,
      content_tr || null, content_en || null, content_ar || null,
      meta_json ? JSON.stringify(meta_json) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ).run();

    return new Response(JSON.stringify({ success: true }));
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
