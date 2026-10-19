import { verifyAuthToken } from '../utils/auth';

export async function handleCmsApps(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;

  // Güvenli Yönetici Doğrulaması
  const user = await verifyAuthToken(request);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 1. GET /api/v1/admin/apps — Tüm uygulamaları ve sürümlerini getir
  if (method === 'GET' && !path.includes('/versions')) {
    const { results: apps } = await env.DB.prepare(
      `SELECT * FROM apps ORDER BY display_order ASC, created_at DESC`
    ).all();

    const { results: versions } = await env.DB.prepare(
      `SELECT * FROM app_versions ORDER BY released_at DESC`
    ).all();

    // Sürümleri uygulamalara grupla ve en son sürümü iliştir
    const appsWithVersions = (apps || []).map((app: any) => {
      const appVersions = (versions || []).filter((v: any) => v.app_id === app.id);
      const latestVer = appVersions[0] || null;
      let storeLinks = {};
      try {
        storeLinks = typeof app.store_links_json === 'string' ? JSON.parse(app.store_links_json || '{}') : app.store_links_json || {};
      } catch {
        storeLinks = {};
      }

      let featureCards = [];
      try {
        featureCards = typeof app.feature_cards_json === 'string' ? JSON.parse(app.feature_cards_json || '[]') : (app.feature_cards_json || []);
      } catch {
        featureCards = [];
      }

      return {
        ...app,
        store_links: storeLinks,
        feature_cards: featureCards,
        latest_version: latestVer ? latestVer.version_name : '1.0.0',
        latest_download_url: latestVer ? latestVer.download_url : '',
        versions: appVersions,
      };
    });

    return new Response(JSON.stringify({ apps: appsWithVersions }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. POST /api/v1/admin/apps — Yeni Uygulama Ekle
  if (method === 'POST' && !path.includes('/versions')) {
    const body = await request.json() as any;
    const {
      app_id, name_tr, name_en, name_ar,
      summary_tr, summary_en, summary_ar,
      description_tr, description_en, description_ar,
      features_tr, features_en, features_ar,
      icon_url, cover_url, category, platform, display_order,
      store_links_json, screenshots_json, feature_cards_json, feature_cards
    } = body;

    if (!app_id || !name_tr || !description_tr) {
      return new Response(JSON.stringify({ error: 'app_id, name_tr ve description_tr zorunludur' }), { status: 400 });
    }

    const id = `app_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const storeLinks = typeof store_links_json === 'object' ? JSON.stringify(store_links_json) : (store_links_json || '{}');
    const screenshots = typeof screenshots_json === 'object' ? JSON.stringify(screenshots_json) : (screenshots_json || '[]');
    const cardsSource = feature_cards !== undefined ? feature_cards : feature_cards_json;
    const featureCards = typeof cardsSource === 'object' ? JSON.stringify(cardsSource) : (cardsSource || '[]');

    await env.DB.prepare(
      `INSERT INTO apps (
        id, app_id, name_tr, name_en, name_ar,
        summary_tr, summary_en, summary_ar,
        description_tr, description_en, description_ar,
        features_tr, features_en, features_ar,
        icon_url, cover_url, category, platform, display_order,
        store_links_json, screenshots_json, feature_cards_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id, app_id.toLowerCase().trim(),
      name_tr, name_en || null, name_ar || null,
      summary_tr || null, summary_en || null, summary_ar || null,
      description_tr, description_en || null, description_ar || null,
      features_tr || null, features_en || null, features_ar || null,
      icon_url || null, cover_url || null,
      category || 'utility', platform || 'all', display_order || 0,
      storeLinks, screenshots, featureCards
    ).run();

    return new Response(JSON.stringify({ success: true, id }), { status: 201 });
  }

  // 3. POST /api/v1/admin/apps/:id/versions — Yeni Sürüm Yayınla
  if (method === 'POST' && path.includes('/versions')) {
    const parts = path.split('/');
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

  // 4. PUT /api/v1/admin/apps/:id — Uygulama Bilgilerini Güncelle
  if (method === 'PUT' && !path.includes('/versions')) {
    const appId = path.split('/').pop();
    const body = await request.json() as any;

    const existing: any = await env.DB.prepare(`SELECT * FROM apps WHERE id = ?`).bind(appId).first();
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Uygulama bulunamadı' }), { status: 404 });
    }

    const {
      app_id, name_tr, name_en, name_ar,
      summary_tr, summary_en, summary_ar,
      description_tr, description_en, description_ar,
      features_tr, features_en, features_ar,
      icon_url, cover_url, category, platform, display_order, is_active,
      store_links_json, screenshots_json, feature_cards_json, feature_cards
    } = body;

    const finalAppId = app_id !== undefined ? app_id.toLowerCase().trim() : existing.app_id;
    const finalNameTr = name_tr !== undefined ? name_tr : existing.name_tr;
    const finalNameEn = name_en !== undefined ? name_en : existing.name_en;
    const finalNameAr = name_ar !== undefined ? name_ar : existing.name_ar;

    const finalSummaryTr = summary_tr !== undefined ? summary_tr : existing.summary_tr;
    const finalSummaryEn = summary_en !== undefined ? summary_en : existing.summary_en;
    const finalSummaryAr = summary_ar !== undefined ? summary_ar : existing.summary_ar;

    const finalDescTr = description_tr !== undefined ? description_tr : existing.description_tr;
    const finalDescEn = description_en !== undefined ? description_en : existing.description_en;
    const finalDescAr = description_ar !== undefined ? description_ar : existing.description_ar;

    const finalFeaturesTr = features_tr !== undefined ? features_tr : existing.features_tr;
    const finalFeaturesEn = features_en !== undefined ? features_en : existing.features_en;
    const finalFeaturesAr = features_ar !== undefined ? features_ar : existing.features_ar;

    const finalIcon = icon_url !== undefined ? icon_url : existing.icon_url;
    const finalCover = cover_url !== undefined ? cover_url : existing.cover_url;
    const finalCategory = category !== undefined ? category : existing.category;
    const finalPlatform = platform !== undefined ? platform : existing.platform;
    const finalDisplayOrder = display_order !== undefined ? Number(display_order) : existing.display_order;
    const finalIsActive = is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active;

    let finalStoreLinks = existing.store_links_json || '{}';
    if (store_links_json !== undefined) {
      finalStoreLinks = typeof store_links_json === 'object' ? JSON.stringify(store_links_json) : store_links_json;
    }

    let finalScreenshots = existing.screenshots_json || '[]';
    if (screenshots_json !== undefined) {
      finalScreenshots = typeof screenshots_json === 'object' ? JSON.stringify(screenshots_json) : screenshots_json;
    }

    let finalFeatureCards = existing.feature_cards_json || '[]';
    const cardsSource = feature_cards !== undefined ? feature_cards : feature_cards_json;
    if (cardsSource !== undefined) {
      finalFeatureCards = typeof cardsSource === 'object' ? JSON.stringify(cardsSource) : cardsSource;
    }

    await env.DB.prepare(
      `UPDATE apps SET
        app_id = ?, name_tr = ?, name_en = ?, name_ar = ?,
        summary_tr = ?, summary_en = ?, summary_ar = ?,
        description_tr = ?, description_en = ?, description_ar = ?,
        features_tr = ?, features_en = ?, features_ar = ?,
        icon_url = ?, cover_url = ?, category = ?, platform = ?, display_order = ?, is_active = ?,
        store_links_json = ?, screenshots_json = ?, feature_cards_json = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      finalAppId, finalNameTr, finalNameEn, finalNameAr,
      finalSummaryTr, finalSummaryEn, finalSummaryAr,
      finalDescTr, finalDescEn, finalDescAr,
      finalFeaturesTr, finalFeaturesEn, finalFeaturesAr,
      finalIcon, finalCover, finalCategory, finalPlatform,
      finalDisplayOrder, finalIsActive,
      finalStoreLinks, finalScreenshots, finalFeatureCards, appId
    ).run();

    return new Response(JSON.stringify({ success: true }));
  }

  // 5. DELETE /api/v1/admin/apps/:id/versions/:versionId — Sürüm Sil
  if (method === 'DELETE' && path.includes('/versions/')) {
    const versionId = path.split('/').pop();
    await env.DB.prepare(`DELETE FROM app_versions WHERE id = ?`).bind(versionId).run();
    return new Response(JSON.stringify({ success: true }));
  }

  // 6. DELETE /api/v1/admin/apps/:id — Uygulamayı ve Bağlı Sürümlerini Sil
  if (method === 'DELETE') {
    const appId = path.split('/').pop();
    await env.DB.prepare(`DELETE FROM app_versions WHERE app_id = ?`).bind(appId).run();
    await env.DB.prepare(`DELETE FROM apps WHERE id = ?`).bind(appId).run();
    return new Response(JSON.stringify({ success: true }));
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
