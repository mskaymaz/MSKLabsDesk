/**
 * MSKLabsDesk — Headless Admin Kurumsal Sayfalar (CMS) API Rotası
 * File: cmsPages.ts
 */

import { verifyAuthToken } from '../utils/auth';
import { translatePostWithAI, translateBlocksWithAI } from '../utils/ai';

export async function handleCmsPages(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method;

  // Güvenli Yönetici Doğrulaması
  const user = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. POST /api/admin/pages/translate — AI Çeviri & Özet Desteği
  if (url.pathname.endsWith('/translate') && method === 'POST') {
    const body = (await request.json()) as any;
    const { title_tr, content_tr, summary_tr, blocks } = body;

    // A. Blok tabanlı çeviri modu (Sayfa Stüdyosu Canlı Çeviri)
    if (blocks && Array.isArray(blocks) && blocks.length > 0) {
      const translatedBlocks = await translateBlocksWithAI(blocks, env);
      return new Response(JSON.stringify({ success: true, blocks: translatedBlocks }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // B. Klasik sayfa/metin çeviri modu
    if (!title_tr || !content_tr) {
      return new Response(JSON.stringify({ error: 'title_tr ve content_tr zorunludur' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const translated = await translatePostWithAI({ title_tr, content_tr, summary_tr }, env);
    if (!translated) {
      return new Response(JSON.stringify({ error: 'AI çeviri başarısız oldu' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, translation: translated }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. GET /api/admin/pages — Tüm Kurumsal Sayfaları Listele
  if (method === 'GET' && (url.pathname === '/api/admin/pages' || url.pathname === '/api/v1/admin/pages')) {
    const status = url.searchParams.get('status');
    let query = `SELECT * FROM site_pages`;
    const params: any[] = [];

    if (status) {
      query += ` WHERE status = ?`;
      params.push(status);
    }
    query += ` ORDER BY display_order ASC, created_at DESC`;

    const { results } = await env.DB.prepare(query).bind(...params).all();

    return new Response(JSON.stringify({ success: true, pages: results || [] }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. GET /api/admin/pages/:id — Tekil Sayfa Detayı
  if (method === 'GET') {
    const pageId = url.pathname.split('/').pop();
    const page = await env.DB.prepare(`SELECT * FROM site_pages WHERE id = ? OR slug = ?`).bind(pageId, pageId).first();

    if (!page) {
      return new Response(JSON.stringify({ error: 'Sayfa bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, page }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. POST /api/admin/pages — Yeni Kurumsal Sayfa Ekle
  if (method === 'POST') {
    const body = (await request.json()) as any;
    const {
      slug,
      title_tr,
      title_en,
      title_ar,
      summary_tr,
      summary_en,
      summary_ar,
      content_tr,
      content_en,
      content_ar,
      hero_image,
      meta_json,
      status,
      display_order,
    } = body;

    if (!slug || !title_tr || !content_tr) {
      return new Response(JSON.stringify({ error: 'slug, title_tr ve content_tr alanları zorunludur' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');

    // Slug benzersizlik denetimi
    const existing = await env.DB.prepare(`SELECT id FROM site_pages WHERE slug = ?`).bind(cleanSlug).first();
    if (existing) {
      return new Response(JSON.stringify({ error: `"${cleanSlug}" adresi (slug) zaten başka bir sayfada kullanılıyor.` }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    await env.DB.prepare(
      `INSERT INTO site_pages (
        id, slug, title_tr, title_en, title_ar,
        summary_tr, summary_en, summary_ar,
        content_tr, content_en, content_ar,
        hero_image, meta_json, status, display_order, is_system
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
    ).bind(
      id,
      cleanSlug,
      title_tr,
      title_en || null,
      title_ar || null,
      summary_tr || null,
      summary_en || null,
      summary_ar || null,
      content_tr,
      content_en || null,
      content_ar || null,
      hero_image || null,
      meta_json ? (typeof meta_json === 'string' ? meta_json : JSON.stringify(meta_json)) : null,
      status || 'published',
      display_order || 0
    ).run();

    return new Response(JSON.stringify({ success: true, pageId: id, slug: cleanSlug }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 5. PUT /api/admin/pages/:id — Kurumsal Sayfayı Güncelle
  if (method === 'PUT') {
    const pageId = url.pathname.split('/').pop();
    const body = (await request.json()) as any;

    const existing = await env.DB.prepare(`SELECT * FROM site_pages WHERE id = ?`).bind(pageId).first() as any;
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Güncellenecek sayfa bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Yalnızca status güncellemesi (hızlı durum değiştirici)
    if (body.status && Object.keys(body).length <= 2) {
      await env.DB.prepare(`UPDATE site_pages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(body.status, pageId).run();
      return new Response(JSON.stringify({ success: true, status: body.status }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const {
      slug,
      title_tr,
      title_en,
      title_ar,
      summary_tr,
      summary_en,
      summary_ar,
      content_tr,
      content_en,
      content_ar,
      hero_image,
      meta_json,
      status,
      display_order,
    } = body;

    // Sistem sayfalarında slug korunur
    const finalSlug = existing.is_system ? existing.slug : (slug ? slug.toLowerCase().trim() : existing.slug);

    await env.DB.prepare(
      `UPDATE site_pages SET
        slug = ?,
        title_tr = ?, title_en = ?, title_ar = ?,
        summary_tr = ?, summary_en = ?, summary_ar = ?,
        content_tr = ?, content_en = ?, content_ar = ?,
        hero_image = ?, meta_json = ?, status = ?, display_order = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(
      finalSlug,
      title_tr ?? existing.title_tr,
      title_en ?? existing.title_en,
      title_ar ?? existing.title_ar,
      summary_tr ?? existing.summary_tr,
      summary_en ?? existing.summary_en,
      summary_ar ?? existing.summary_ar,
      content_tr ?? existing.content_tr,
      content_en ?? existing.content_en,
      content_ar ?? existing.content_ar,
      hero_image ?? existing.hero_image,
      meta_json ? (typeof meta_json === 'string' ? meta_json : JSON.stringify(meta_json)) : existing.meta_json,
      status ?? existing.status,
      display_order ?? existing.display_order,
      pageId
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 6. DELETE /api/admin/pages/:id — Sayfayı Sil (Sistem Sayfaları Korunur)
  if (method === 'DELETE') {
    const pageId = url.pathname.split('/').pop();

    const existing = await env.DB.prepare(`SELECT id, is_system, title_tr FROM site_pages WHERE id = ?`).bind(pageId).first() as any;
    if (!existing) {
      return new Response(JSON.stringify({ error: 'Silinecek sayfa bulunamadı' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (existing.is_system) {
      return new Response(JSON.stringify({
        error: `"${existing.title_tr}" sistem sayfasıdır ve silinemez. Dilerseniz durumunu "Taslak" yapabilir veya içeriğini düzenleyebilirsiniz.`
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await env.DB.prepare(`DELETE FROM site_pages WHERE id = ?`).bind(pageId).run();

    return new Response(JSON.stringify({ success: true, message: 'Sayfa başarıyla silindi.' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
