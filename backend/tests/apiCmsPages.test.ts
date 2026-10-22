/**
 * MSKLabsDesk — Kurumsal Sayfalar CMS API Entegrasyon Test Modülü
 * File: apiCmsPages.test.ts
 */

import { handleCmsPages } from '../src/routes/cmsPages';
import { handleCmsPublic } from '../src/routes/cmsPublic';
import { createSessionToken } from '../src/utils/auth';

class MockD1PreparedStatement {
  constructor(private sql: string, private params: any[], private db: MockD1Database) {}

  bind(...params: any[]) {
    return new MockD1PreparedStatement(this.sql, params, this.db);
  }

  async first<T = any>(): Promise<T | null> {
    const res = await this.all<T>();
    return res.results[0] || null;
  }

  async all<T = any>(): Promise<{ results: T[] }> {
    const sql = this.sql.trim();

    if (sql.includes('SELECT * FROM site_pages WHERE id = ? OR slug = ?')) {
      const [idOrSlug] = this.params;
      const match = Array.from(this.db.tables.site_pages.values()).find(
        (p: any) => p.id === idOrSlug || p.slug === idOrSlug
      );
      return { results: match ? [match] : [] };
    }

    if (sql.includes('SELECT * FROM site_pages WHERE id = ?')) {
      const [id] = this.params;
      const match = this.db.tables.site_pages.get(id);
      return { results: match ? [match] : [] };
    }

    if (sql.includes('SELECT id FROM site_pages WHERE slug = ?')) {
      const [slug] = this.params;
      const match = Array.from(this.db.tables.site_pages.values()).find((p: any) => p.slug === slug);
      return { results: match ? [match] : [] };
    }

    if (sql.includes('SELECT id, is_system, title_tr FROM site_pages WHERE id = ?')) {
      const [id] = this.params;
      const match = this.db.tables.site_pages.get(id);
      return { results: match ? [{ id: match.id, is_system: match.is_system, title_tr: match.title_tr }] : [] };
    }

    if (sql.includes('SELECT * FROM site_pages WHERE slug = ? AND status = \'published\'')) {
      const [slug] = this.params;
      const match = Array.from(this.db.tables.site_pages.values()).find(
        (p: any) => p.slug === slug && p.status === 'published'
      );
      return { results: match ? [match] : [] };
    }

    if (sql.includes('FROM site_pages') && sql.includes('ORDER BY display_order ASC')) {
      const matches = Array.from(this.db.tables.site_pages.values()).filter((p: any) => p.status === 'published');
      return { results: matches };
    }

    if (sql.includes('SELECT slug, updated_at FROM site_pages WHERE status = \'published\'')) {
      const matches = Array.from(this.db.tables.site_pages.values()).filter((p: any) => p.status === 'published');
      return { results: matches };
    }

    if (sql.includes('SELECT slug, published_at FROM blog_posts WHERE status = \'published\'')) {
      return { results: [] };
    }

    if (sql.includes('SELECT * FROM site_pages')) {
      return { results: Array.from(this.db.tables.site_pages.values()) };
    }

    return { results: [] };
  }

  async run(): Promise<{ success: boolean }> {
    const sql = this.sql.trim();

    if (sql.includes('INSERT INTO site_pages')) {
      const [
        id, slug, title_tr, title_en, title_ar,
        summary_tr, summary_en, summary_ar,
        content_tr, content_en, content_ar,
        hero_image, meta_json, status, display_order, is_system
      ] = this.params;

      this.db.tables.site_pages.set(id, {
        id, slug, title_tr, title_en, title_ar,
        summary_tr, summary_en, summary_ar,
        content_tr, content_en, content_ar,
        hero_image, meta_json, status, display_order, is_system,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      return { success: true };
    }

    if (sql.includes('UPDATE site_pages SET status = ?')) {
      const [status, id] = this.params;
      const rec = this.db.tables.site_pages.get(id);
      if (rec) {
        rec.status = status;
        rec.updated_at = new Date().toISOString();
      }
      return { success: true };
    }

    if (sql.includes('UPDATE site_pages SET')) {
      const [
        finalSlug, title_tr, title_en, title_ar,
        summary_tr, summary_en, summary_ar,
        content_tr, content_en, content_ar,
        hero_image, meta_json, status, display_order,
        pageId
      ] = this.params;

      const rec = this.db.tables.site_pages.get(pageId);
      if (rec) {
        rec.slug = finalSlug;
        rec.title_tr = title_tr;
        rec.title_en = title_en;
        rec.title_ar = title_ar;
        rec.summary_tr = summary_tr;
        rec.summary_en = summary_en;
        rec.summary_ar = summary_ar;
        rec.content_tr = content_tr;
        rec.content_en = content_en;
        rec.content_ar = content_ar;
        rec.hero_image = hero_image;
        rec.meta_json = meta_json;
        rec.status = status;
        rec.display_order = display_order;
        rec.updated_at = new Date().toISOString();
      }
      return { success: true };
    }

    if (sql.includes('DELETE FROM site_pages WHERE id = ?')) {
      const [id] = this.params;
      this.db.tables.site_pages.delete(id);
      return { success: true };
    }

    return { success: true };
  }
}

class MockD1Database {
  tables = {
    site_pages: new Map<string, any>(),
  };

  prepare(sql: string) {
    return new MockD1PreparedStatement(sql, [], this);
  }
}

async function runTests() {
  console.log('=== KURUMSAL SAYFALAR (CMS) API ENTEGRASYON TESTLERİ BAŞLIYOR ===');
  let passCount = 0;
  let failCount = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  [PASS] ${msg}`);
      passCount++;
    } else {
      console.error(`  [FAIL] ${msg}`);
      failCount++;
    }
  }

  const mockDb = new MockD1Database();
  const env: any = {
    DB: mockDb,
    ADMIN_JWT_SECRET: 'test_secret_key_1234567890123456',
  };

  // Seed system page (about)
  mockDb.tables.site_pages.set('page_about', {
    id: 'page_about',
    slug: 'about',
    title_tr: 'Hakkımızda & Biz Kimiz',
    title_en: 'About Us',
    title_ar: 'من نحن',
    summary_tr: 'MSK Labs vizyonu',
    content_tr: '<p>Vizyonumuz...</p>',
    content_en: '<p>Our vision...</p>',
    content_ar: '<p>رؤيتنا...</p>',
    status: 'published',
    display_order: 1,
    is_system: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const validToken = await createSessionToken({ id: 'admin1', username: 'admin', role: 'SUPER_ADMIN' }, env.ADMIN_JWT_SECRET);

  // Test 1: Auth check
  const unauthorizedReq = new Request('http://localhost/api/admin/pages', { method: 'GET' });
  const unauthRes = await handleCmsPages(unauthorizedReq, env);
  assert(unauthRes.status === 401, 'Yetkisiz erişimde HTTP 401 dönmeli');

  // Test 2: GET /api/admin/pages
  const getPagesReq = new Request('http://localhost/api/admin/pages', {
    headers: { Authorization: `Bearer ${validToken}` },
  });
  const getPagesRes = await handleCmsPages(getPagesReq, env);
  assert(getPagesRes.status === 200, 'GET /api/admin/pages HTTP 200 dönmeli');
  const getPagesData = await getPagesRes.json() as any;
  assert(getPagesData.pages.length === 1, 'Başlangıçta 1 sistem sayfası dönmeli');
  assert(getPagesData.pages[0].slug === 'about', 'Dönen sayfa slug: about olmalı');

  // Test 3: POST /api/admin/pages — Yeni sayfa ekle
  const createReq = new Request('http://localhost/api/admin/pages', {
    method: 'POST',
    headers: { Authorization: `Bearer ${validToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'kariyer',
      title_tr: 'Kariyer & İletişim',
      title_en: 'Careers',
      content_tr: '<p>Açık pozisyonlar...</p>',
      content_en: '<p>Open positions...</p>',
      status: 'published',
    }),
  });
  const createRes = await handleCmsPages(createReq, env);
  assert(createRes.status === 201, 'POST /api/admin/pages HTTP 201 Created dönmeli');
  const createData = await createRes.json() as any;
  assert(createData.slug === 'kariyer', 'Oluşturulan sayfa slug: kariyer olmalı');
  assert(mockDb.tables.site_pages.size === 2, 'Veritabanında 2 sayfa olmalı');

  // Test 4: Çakışan slug reddedilmeli
  const duplicateReq = new Request('http://localhost/api/admin/pages', {
    method: 'POST',
    headers: { Authorization: `Bearer ${validToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: 'kariyer',
      title_tr: 'Kariyer 2',
      content_tr: '<p>test</p>',
    }),
  });
  const duplicateRes = await handleCmsPages(duplicateReq, env);
  assert(duplicateRes.status === 409, 'Aynı slug ile ikinci kayıt HTTP 409 Conflict dönmeli');

  // Test 5: PUT /api/admin/pages/:id — Güncelleme
  const updateReq = new Request(`http://localhost/api/admin/pages/${createData.pageId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${validToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title_tr: 'Kariyer Olanakları Güncel',
      content_tr: '<p>Güncellenmiş içerik</p>',
    }),
  });
  const updateRes = await handleCmsPages(updateReq, env);
  assert(updateRes.status === 200, 'PUT /api/admin/pages/:id HTTP 200 dönmeli');
  const updatedPage = mockDb.tables.site_pages.get(createData.pageId);
  assert(updatedPage.title_tr === 'Kariyer Olanakları Güncel', 'Sayfa başlığı güncellenmiş olmalı');

  // Test 6: Sistem sayfası silme koruması
  const deleteSystemReq = new Request('http://localhost/api/admin/pages/page_about', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${validToken}` },
  });
  const deleteSystemRes = await handleCmsPages(deleteSystemReq, env);
  assert(deleteSystemRes.status === 400, 'Sistem sayfası silinmek istendiğinde HTTP 400 dönmeli');
  assert(mockDb.tables.site_pages.has('page_about'), 'Sistem sayfası veritabanından silinmemiş olmalı');

  // Test 7: Özel sayfa silme
  const deleteCustomReq = new Request(`http://localhost/api/admin/pages/${createData.pageId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${validToken}` },
  });
  const deleteCustomRes = await handleCmsPages(deleteCustomReq, env);
  assert(deleteCustomRes.status === 200, 'Özel sayfa silme HTTP 200 dönmeli');
  assert(!mockDb.tables.site_pages.has(createData.pageId), 'Özel sayfa veritabanından silinmiş olmalı');

  // Test 8: Kamusal Public API GET /api/v1/pages
  const pubListReq = new Request('http://localhost/api/v1/pages', { method: 'GET' });
  const pubListRes = await handleCmsPublic(pubListReq, env);
  assert(pubListRes.status === 200, 'GET /api/v1/pages HTTP 200 dönmeli');
  const pubListData = await pubListRes.json() as any;
  assert(pubListData.pages.length === 1, 'Kamusal API yayındaki 1 sayfayı döndürmeli');

  // Test 9: Kamusal Public API GET /api/v1/pages/about
  const pubDetailReq = new Request('http://localhost/api/v1/pages/about', { method: 'GET' });
  const pubDetailRes = await handleCmsPublic(pubDetailReq, env);
  assert(pubDetailRes.status === 200, 'GET /api/v1/pages/about HTTP 200 dönmeli');
  const pubDetailData = await pubDetailRes.json() as any;
  assert(pubDetailData.page.slug === 'about', 'Sayfa detayı slug: about dönmeli');

  // Test 10: Kamusal Public API GET /api/v1/sitemap.xml
  const sitemapReq = new Request('http://localhost/api/v1/sitemap.xml', { method: 'GET' });
  const sitemapRes = await handleCmsPublic(sitemapReq, env);
  assert(sitemapRes.status === 200, 'GET /api/v1/sitemap.xml HTTP 200 dönmeli');
  const sitemapXml = await sitemapRes.text();
  assert(sitemapXml.includes('https://msklabs.org/about'), 'Sitemap içinde https://msklabs.org/about yer almalı');

  // Test 11: POST /api/admin/pages/translate (Blok Çeviri Desteği)
  const translateBlocksReq = new Request('http://localhost/api/admin/pages/translate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${validToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      blocks: [
        {
          id: 'blk_test_1',
          type: 'hero',
          title_tr: 'Yapay Zeka Çözümleri',
          subtitle_tr: 'Geleceğe hazır olun',
          btn_primary_text: 'Keşfet',
          items: [{ id: 'it_1', title: 'Hızlı Entegrasyon', text: 'Dakikalar içinde entegre olun' }],
        },
      ],
    }),
  });
  const translateBlocksRes = await handleCmsPages(translateBlocksReq, env);
  assert(translateBlocksRes.status === 200, 'POST /api/admin/pages/translate (blocks) HTTP 200 dönmeli');
  const translateBlocksData = (await translateBlocksRes.json()) as any;
  assert(translateBlocksData.success === true, 'Blok çeviri success: true olmalı');
  assert(translateBlocksData.blocks[0].title_en.includes('Yapay Zeka Çözümleri'), 'Blok title_en doldurulmalı');
  assert(translateBlocksData.blocks[0].title_ar.includes('Yapay Zeka Çözümleri'), 'Blok title_ar doldurulmalı');
  assert(translateBlocksData.blocks[0].items[0].title_en.includes('Hızlı Entegrasyon'), 'Madde title_en doldurulmalı');

  console.log(`=== TEST SONUÇLARI: ${passCount} PASS, ${failCount} FAIL ===`);
  if (failCount > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test hatası:', err);
  process.exit(1);
});
