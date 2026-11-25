/**
 * MSKLabsDesk — Melez Hızlı Dağıtım & İndirme Sayacı Testleri (DIST-CDN-001)
 * File: backend/tests/apiDownloadProxy.test.ts
 */

import {
  handleDownloadProxy,
  handleAdminGetDownloadsSummary,
  resetDownloadProxyCaches,
  shouldCountDownload,
  CatalogAppEntry,
} from '../src/routes/downloadProxy';
import { createSessionToken } from '../src/utils/auth';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

class MockDownloadDB {
  public stats = new Map<string, { app_slug: string; version: string; tier: string; download_count: number; last_downloaded_at: string }>();

  prepare(sql: string) {
    const db = this;
    return {
      _args: [] as any[],
      bind(...args: any[]) {
        this._args = args;
        return this;
      },
      async run() {
        if (sql.includes('INSERT INTO download_stats')) {
          const [appSlug, version, tier] = this._args;
          const key = `${appSlug}:${version}`;
          const existing = db.stats.get(key);
          if (existing) {
            existing.download_count += 1;
            existing.tier = tier;
            existing.last_downloaded_at = '2026-11-25T10:00:00Z';
          } else {
            db.stats.set(key, {
              app_slug: appSlug,
              version,
              tier,
              download_count: 1,
              last_downloaded_at: '2026-11-25T10:00:00Z',
            });
          }
        }
        return { success: true };
      },
      async all() {
        return { results: Array.from(db.stats.values()) };
      },
    };
  }
}

function createMockCtx() {
  const promises: Promise<any>[] = [];
  return {
    ctx: {
      waitUntil(p: Promise<any>) {
        promises.push(p);
      },
      passThroughOnException() {},
    } as unknown as ExecutionContext,
    flush: async () => {
      await Promise.all(promises);
    },
  };
}

async function runTests() {
  console.log('--- DIST-CDN-001 DOWNLOAD PROXY & SUMMARY TESTLERİ BAŞLIYOR ---');
  resetDownloadProxyCaches();

  const secret = 'test_secret_msklabs_dist_cdn_2026';
  const mockDb = new MockDownloadDB();
  const env = { DB: mockDb as any, ADMIN_JWT_SECRET: secret };
  const mockCatalog: CatalogAppEntry[] = [
    {
      app_id: 'haydi_namaza',
      versions: [
        { version: 'v1.0.5', tier: 'r2', filename: 'HaydiNamaza.apk' },
        { version: 'v1.0.2', tier: 'archive_proxy', filename: 'HaydiNamaza.apk', archive_url: 'https://github.com/mskaymaz/MSKLabsApps/releases/download/v1.0.2/HaydiNamaza.apk' },
      ],
    },
  ];

  // 1. Bilinmeyen uygulama -> 404
  {
    const { ctx } = createMockCtx();
    const res = await handleDownloadProxy(new Request('http://localhost:8787/dl/bilinmeyen_app/v1.0.0'), env, ctx, { catalogApps: mockCatalog });
    assert(res.status === 404, 'Bilinmeyen appSlug için HTTP 404 dönmeli');
  }

  // 2. Aktif R2 sürümü -> 302 Redirect + D1 sayaç +1
  {
    const { ctx, flush } = createMockCtx();
    const res = await handleDownloadProxy(new Request('http://localhost:8787/dl/haydinamaza/1.0.5'), env, ctx, { catalogApps: mockCatalog });
    await flush();
    assert(res.status === 302, 'Aktif R2 sürümünde HTTP 302 dönmeli');
    assert(res.headers.get('Location') === 'https://releases.msklabs.org/haydi_namaza/v1.0.5/HaydiNamaza.apk', 'Location R2 custom domain olmalı');
    assert(mockDb.stats.get('haydi_namaza:v1.0.5')?.download_count === 1, 'D1 download_count 1 olmalı');
  }

  // 3. HEAD ve çoklu Range istekleri sayacı artırmamalı; bytes=0- artırmalı
  {
    assert(shouldCountDownload(new Request('http://localhost/dl/a/v1.0.0', { method: 'HEAD' })) === false, 'HEAD isteği sayılmamalı');
    assert(shouldCountDownload(new Request('http://localhost/dl/a/v1.0.0', { headers: { Range: 'bytes=1024-2048' } })) === false, 'Orta Range parçası sayılmamalı');
    assert(shouldCountDownload(new Request('http://localhost/dl/a/v1.0.0', { headers: { Range: 'bytes=0-1023' } })) === true, 'İlk Range (bytes=0-) sayılmalı');

    const { ctx, flush } = createMockCtx();
    const headRes = await handleDownloadProxy(new Request('http://localhost:8787/dl/haydi_namaza/v1.0.5', { method: 'HEAD' }), env, ctx, { catalogApps: mockCatalog });
    await flush();
    assert(headRes.status === 302, 'HEAD isteği 302 dönmeli');
    assert(mockDb.stats.get('haydi_namaza:v1.0.5')?.download_count === 1, 'HEAD sonrası sayaç hala 1 kalmalı');
  }

  // 4. Arşiv sürümü -> Worker Archive Proxy 200 OK + D1 sayaç +1
  {
    const { ctx, flush } = createMockCtx();
    const mockFetcher = async () => new Response('fake-apk-binary', { status: 200, headers: { 'Content-Type': 'application/vnd.android.package-archive' } });
    const res = await handleDownloadProxy(new Request('http://localhost:8787/dl/haydi_namaza/v1.0.2'), env, ctx, {
      catalogApps: mockCatalog,
      fetcher: mockFetcher as any,
    });
    await flush();
    assert(res.status === 200, 'Arşiv sürümünde HTTP 200 dönmeli');
    assert(res.headers.get('X-Dist-Tier') === 'archive_proxy', 'X-Dist-Tier archive_proxy olmalı');
    assert(mockDb.stats.get('haydi_namaza:v1.0.2')?.download_count === 1, 'Arşiv indirme sayacı 1 olmalı');
  }

  // 5. Admin Downloads Summary API: 401 + 200 + X-Cache HIT/MISS
  {
    const unauth = await handleAdminGetDownloadsSummary(new Request('http://localhost:8787/api/admin/downloads/summary'), env);
    assert(unauth.status === 401, 'Yetkisiz summary isteği 401 dönmeli');

    const token = await createSessionToken({ id: 'admin_1', email: 'iletisim@msklabs.org', name: 'MSK', role: 'super_admin' }, secret);
    const res1 = await handleAdminGetDownloadsSummary(
      new Request('http://localhost:8787/api/admin/downloads/summary', { headers: { Authorization: `Bearer ${token}` } }),
      env
    );
    assert(res1.status === 200, 'Yetkili summary isteği 200 dönmeli');
    assert(res1.headers.get('X-Cache') === 'MISS', 'İlk istekte X-Cache: MISS olmalı');
    const data1 = (await res1.json()) as any;
    assert(data1.totalDownloads === 2, 'Toplam indirme sayısı 2 olmalı');
    assert(data1.apps.length === 1 && data1.apps[0].appSlug === 'haydi_namaza', 'Uygulama toplamı doğru gruplanmalı');

    const res2 = await handleAdminGetDownloadsSummary(
      new Request('http://localhost:8787/api/admin/downloads/summary', { headers: { Authorization: `Bearer ${token}` } }),
      env
    );
    assert(res2.headers.get('X-Cache') === 'HIT', 'İkinci istekte X-Cache: HIT olmalı');

    const resRefresh = await handleAdminGetDownloadsSummary(
      new Request('http://localhost:8787/api/admin/downloads/summary?refresh=1', { headers: { Authorization: `Bearer ${token}` } }),
      env
    );
    assert(resRefresh.headers.get('X-Cache') === 'MISS', 'refresh=1 ile X-Cache: MISS olmalı');
  }

  console.log('🎉 TÜM DIST-CDN-001 TESTLERİ BAŞARIYLA GEÇTİ!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
