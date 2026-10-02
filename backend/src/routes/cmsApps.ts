import { verifyAuthToken } from '../utils/auth';

export async function handleCmsApps(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;

  // Güvenli Yönetici Doğrulaması
  const user = await verifyAuthToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 1. GET /api/admin/apps — Tüm uygulamaları ve sürümlerini getir
  if (method === 'GET' && !url.pathname.includes('/versions')) {
    const { results: apps } = await env.DB.prepare(
      `SELECT * FROM apps ORDER BY display_order ASC, created_at DESC`
    ).all();

    const { results: versions } = await env.DB.prepare(
      `SELECT * FROM app_versions ORDER BY released_at DESC`
    ).all();

    // Sürümleri uygulamalara grupla
    const appsWithVersions = (apps || []).map((app: any) => ({
      ...app,
      versions: (versions || []).filter((v: any) => v.app_id === app.id),
    }));

    return new Response(JSON.stringify({ apps: appsWithVersions }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. POST /api/admin/apps — Yeni Uygulama Ekle
  if (method === 'POST' && !url.pathname.includes('/versions')) {
    const body = await request.json() as any;
    const { app_id, name_tr, name_en, name_ar, description_tr, description_en, description_ar, icon_url, cover_url, category, platform, display_order } = body;

    if (!app_id || !name_tr || !description_tr) {
      return new Response(JSON.stringify({ error: 'app_id, name_tr ve description_tr zorunludur' }), { status: 400 });
    }

    const id = `app_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    await env.DB.prepare(
      `INSERT INTO apps (id, app_id, name_tr, name_en, name_ar, description_tr, description_en, description_ar, icon_url, cover_url, category, platform, display_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, app_id.toLowerCase().trim(),
      name_tr, name_en || null, name_ar || null,
      description_tr, description_en || null, description_ar || null,
      icon_url || null, cover_url || null,
      category || 'utility', platform || 'all', display_order || 0
    ).run();

    return new Response(JSON.stringify({ success: true, id }), { status: 201 });
  }

  // 3. POST /api/admin/apps/:id/versions — Yeni Sürüm Yayınla
  if (method === 'POST' && url.pathname.includes('/versions')) {
    const parts = url.pathname.split('/');
    const appIdIndex = parts.indexOf('apps') + 1;
    const appId = parts[appIdIndex];

    const body = await request.json() as any;
    const { version_name, version_code, changelog_tr, changelog_en, changelog_ar, download_url, platform, file_size_mb, is_mandatory } = body;

    if (!version_name || !download_url) {
      return new Response(JSON.stringify({ error: 'version_name ve download_url zorunludur' }), { status: 400 });
    }

    const versionId = `ver_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

    await env.DB.prepare(
      `INSERT INTO app_versions (id, app_id, version_name, version_code, changelog_tr, changelog_en, changelog_ar, download_url, platform, file_size_mb, is_mandatory)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      versionId, appId, version_name, version_code || 1,
      changelog_tr || null, changelog_en || null, changelog_ar || null,
      download_url, platform || 'android', file_size_mb || 0, is_mandatory ? 1 : 0
    ).run();

    return new Response(JSON.stringify({ success: true, versionId }), { status: 201 });
  }

  // 4. PUT /api/admin/apps/:id — Uygulama Bilgilerini Güncelle
  if (method === 'PUT') {
    const appId = url.pathname.split('/').pop();
    const body = await request.json() as any;

    const { app_id, name_tr, name_en, name_ar, description_tr, description_en, description_ar, icon_url, cover_url, category, platform, display_order, is_active } = body;

    await env.DB.prepare(
      `UPDATE apps SET
        app_id = ?, name_tr = ?, name_en = ?, name_ar = ?,
        description_tr = ?, description_en = ?, description_ar = ?,
        icon_url = ?, cover_url = ?, category = ?, platform = ?, display_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      app_id, name_tr, name_en || null, name_ar || null,
      description_tr, description_en || null, description_ar || null,
      icon_url || null, cover_url || null, category || 'utility', platform || 'all', display_order || 0, is_active ? 1 : 0, appId
    ).run();

    return new Response(JSON.stringify({ success: true }));
  }

  // 5. DELETE /api/admin/apps/:id — Uygulayı Sil
  if (method === 'DELETE') {
    const appId = url.pathname.split('/').pop();
    await env.DB.prepare(`DELETE FROM apps WHERE id = ?`).bind(appId).run();
    return new Response(JSON.stringify({ success: true }));
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
