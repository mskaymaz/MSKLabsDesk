export async function handleCmsPublic(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;

  if (method !== 'GET' && method !== 'HEAD') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  // CORS Headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=60, s-maxage=300',
  };

  // 1. GET /api/v1/channels — Aktif Blog Kanalları
  if (path === '/api/v1/channels') {
    const { results } = await env.DB.prepare(
      `SELECT slug, name_tr, name_en, name_ar, description_tr, description_en, description_ar, icon, display_order 
       FROM blog_channels 
       WHERE is_active = 1 
       ORDER BY display_order ASC`
    ).all();

    return new Response(JSON.stringify({ channels: results || [] }), { headers });
  }

  // 2. GET /api/v1/posts — Yayındaki Blog Yazıları (+ Kanal Filtresi + Dil)
  if (path === '/api/v1/posts') {
    const channelSlug = url.searchParams.get('channel');
    const lang = url.searchParams.get('lang') || 'tr';
    const limit = parseInt(url.searchParams.get('limit') || '20');

    let query = `
      SELECT p.id, p.slug, p.cover_image, p.author_name, p.published_at, p.views_count, p.video_url,
             p.title_tr, p.title_en, p.title_ar,
             p.summary_tr, p.summary_en, p.summary_ar,
             p.content_tr, p.content_en, p.content_ar,
             c.slug as channel_slug, c.name_tr as channel_name_tr, c.name_en as channel_name_en, c.name_ar as channel_name_ar,
             CASE WHEN ? = 'en' AND p.title_en IS NOT NULL THEN p.title_en
                  WHEN ? = 'ar' AND p.title_ar IS NOT NULL THEN p.title_ar
                  ELSE p.title_tr END as title,
             CASE WHEN ? = 'en' AND p.summary_en IS NOT NULL THEN p.summary_en
                  WHEN ? = 'ar' AND p.summary_ar IS NOT NULL THEN p.summary_ar
                  ELSE p.summary_tr END as summary,
             CASE WHEN ? = 'en' AND p.content_en IS NOT NULL THEN p.content_en
                  WHEN ? = 'ar' AND p.content_ar IS NOT NULL THEN p.content_ar
                  ELSE p.content_tr END as content
      FROM blog_posts p
      JOIN blog_channels c ON p.channel_id = c.id
      WHERE p.status = 'published' AND c.is_active = 1
    `;
    const params: any[] = [lang, lang, lang, lang, lang, lang];

    if (channelSlug) {
      query += ` AND c.slug = ?`;
      params.push(channelSlug);
    }

    query += ` ORDER BY p.published_at DESC LIMIT ?`;
    params.push(limit);

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({ posts: results || [] }), { headers });
  }

  // 3. GET /api/v1/posts/:slug — Tekil Blog Detayı & Okunma Sayacı
  if (path.startsWith('/api/v1/posts/')) {
    const slug = path.split('/').pop();

    // Okunma sayısını 1 artır
    await env.DB.prepare(`UPDATE blog_posts SET views_count = views_count + 1 WHERE slug = ?`).bind(slug).run();

    const post = await env.DB.prepare(
      `SELECT p.*, c.slug as channel_slug, c.name_tr as channel_name 
       FROM blog_posts p
       JOIN blog_channels c ON p.channel_id = c.id
       WHERE p.slug = ? AND p.status = 'published'`
    ).bind(slug).first();

    if (!post) {
      return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404, headers });
    }

    return new Response(JSON.stringify({ post }), { headers });
  }

  // 4. GET /api/v1/apps — Aktif Uygulama Kataloğu (`app_catalog.json` Canlı Karşılığı)
  if (path === '/api/v1/apps') {
    const { results: apps } = await env.DB.prepare(
      `SELECT * FROM apps WHERE is_active = 1 ORDER BY display_order ASC`
    ).all();

    const { results: versions } = await env.DB.prepare(
      `SELECT * FROM app_versions ORDER BY released_at DESC`
    ).all();

    const result = (apps || []).map((app: any) => {
      const appVers = (versions || []).filter((v: any) => v.app_id === app.id);
      const latestVer = appVers[0];
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
        latest_download_url: latestVer ? latestVer.download_url : '#',
        permanent_download_url: `/api/v1/apps/${app.app_id}/download`,
        versions: appVers,
      };
    });

    return new Response(JSON.stringify({ apps: result }), { headers });
  }

  // 4b. GET /api/v1/apps/:slug/download — En Son Sürüme Sabit İndirme Yönlendirmesi (Permanent Latest Redirect)
  if (path.startsWith('/api/v1/apps/') && path.endsWith('/download')) {
    const parts = path.split('/');
    const slug = parts[parts.length - 2];

    const app = await env.DB.prepare(
      `SELECT id, app_id FROM apps WHERE (app_id = ? OR id = ?) AND is_active = 1`
    ).bind(slug, slug).first();

    if (!app) {
      return new Response(JSON.stringify({ error: 'Uygulama bulunamadı' }), { status: 404, headers });
    }

    const latestVer = await env.DB.prepare(
      `SELECT download_url FROM app_versions WHERE app_id = ? ORDER BY released_at DESC LIMIT 1`
    ).bind(app.id).first();

    if (!latestVer || !latestVer.download_url) {
      return new Response(JSON.stringify({ error: 'İndirme bağlantısı bulunamadı' }), { status: 404, headers });
    }

    // İndirme sayacını artır
    await env.DB.prepare(`UPDATE apps SET downloads_count = downloads_count + 1 WHERE id = ?`).bind(app.id).run();

    const rawUrl = latestVer.download_url as string;
    const targetUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? rawUrl
      : new URL(rawUrl, request.url).toString();

    return Response.redirect(targetUrl, 302);
  }

  // 4c. GET /api/v1/apps/:slug — Tekil Uygulama Detayı & Sürümleri
  if (path.startsWith('/api/v1/apps/') && path !== '/api/v1/apps') {
    const slug = path.split('/').pop();

    const app = await env.DB.prepare(
      `SELECT * FROM apps WHERE (app_id = ? OR id = ?)`
    ).bind(slug, slug).first();

    if (!app) {
      return new Response(JSON.stringify({ error: 'Uygulama bulunamadı' }), { status: 404, headers });
    }

    const { results: versions } = await env.DB.prepare(
      `SELECT * FROM app_versions WHERE app_id = ? ORDER BY released_at DESC`
    ).bind(app.id).all();

    let storeLinks = {};
    try {
      storeLinks = typeof app.store_links_json === 'string' ? JSON.parse(app.store_links_json || '{}') : app.store_links_json || {};
    } catch {
      storeLinks = {};
    }

    let screenshots = [];
    try {
      screenshots = typeof app.screenshots_json === 'string' ? JSON.parse(app.screenshots_json || '[]') : app.screenshots_json || [];
    } catch {
      screenshots = [];
    }

    let featureCards = [];
    try {
      featureCards = typeof app.feature_cards_json === 'string' ? JSON.parse(app.feature_cards_json || '[]') : (app.feature_cards_json || []);
    } catch {
      featureCards = [];
    }

    const latestVer = (versions || [])[0] || null;

    return new Response(JSON.stringify({
      app: {
        ...app,
        store_links: storeLinks,
        feature_cards: featureCards,
        screenshots,
        latest_version: latestVer ? latestVer.version_name : '1.0.0',
        latest_download_url: latestVer ? latestVer.download_url : '#',
        permanent_download_url: `/api/v1/apps/${app.app_id}/download`,
        versions: versions || [],
      }
    }), { headers });
  }

  // 5. GET /api/v1/ads — Kamusal Aktif Reklam Ayarları
  if (path === '/api/v1/ads') {
    const { results } = await env.DB.prepare(
      `SELECT key_name, content_tr, meta_json FROM site_templates WHERE key_name LIKE 'ad_%' AND is_active = 1`
    ).all();

    const ads = (results || []).map((row: any) => {
      let meta: any = {};
      try {
        if (row.meta_json) meta = JSON.parse(row.meta_json);
      } catch (_) {}
      return {
        slot_key: row.key_name,
        title: row.content_tr,
        ...meta,
        is_enabled: true,
      };
    }).filter((a: any) => !a.is_deleted && a.slot_key !== 'ad_header_top');

    return new Response(JSON.stringify({ success: true, ads }), { headers });
  }

  // 6. GET /api/v1/templates — Duyuru ve Şablonlar
  if (path === '/api/v1/templates') {
    const { results } = await env.DB.prepare(
      `SELECT key_name, content_tr, content_en, content_ar, meta_json FROM site_templates WHERE is_active = 1`
    ).all();
    return new Response(JSON.stringify({ success: true, templates: results || [] }), { headers });
  }

  // 6. GET /api/v1/sitemap.xml — Otomatik XML Sitemap
  if (path === '/api/v1/sitemap.xml') {
    const { results: posts } = await env.DB.prepare(
      `SELECT slug, published_at FROM blog_posts WHERE status = 'published'`
    ).all();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += `  <url><loc>https://msklabs.org/</loc><priority>1.0</priority></url>\n`;

    (posts || []).forEach((p: any) => {
      xml += `  <url><loc>https://msklabs.org/blog/${p.slug}</loc><lastmod>${p.published_at ? p.published_at.split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod><priority>0.8</priority></url>\n`;
    });

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404, headers });
}
