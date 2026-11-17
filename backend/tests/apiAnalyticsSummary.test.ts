/**
 * MSKLabsDesk — Ziyaretçi & Coğrafi Analitik API Testleri
 * File: backend/tests/apiAnalyticsSummary.test.ts
 */

import { handleAdminGetAnalyticsSummary } from '../src/routes/adminAnalytics';
import { createSessionToken } from '../src/utils/auth';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

class MockD1Database {
  prepare() {
    return {
      bind: () => this,
      first: async () => null,
      all: async () => ({ results: [] }),
      run: async () => ({ success: true }),
    };
  }
}

async function runTests() {
  console.log('--- DASHBOARD ANALYTICS SUMMARY API TESTLERİ BAŞLIYOR ---');

  const secret = 'test_secret_msklabs_analytics_2026_xyz';
  const mockDb = new MockD1Database() as any;
  const env = { DB: mockDb, ADMIN_JWT_SECRET: secret };

  const primaryAdmin = {
    id: 'admin_primary',
    email: 'iletisim@msklabs.org',
    name: 'Mustafa Salih Kaymaz',
    role: 'super_admin',
  };
  const validSessionToken = await createSessionToken(primaryAdmin, secret);

  // 1. Yetkisiz istek (Token yok)
  const unauthReq = new Request('http://localhost:8787/api/v1/admin/analytics/summary', {
    method: 'GET',
  });
  const unauthRes = await handleAdminGetAnalyticsSummary(unauthReq, env);
  assert(unauthRes.status === 401, 'Yetkisiz erişimde HTTP 401 dönmeli');

  // 2. Yetkili istek - Varsayılan (today)
  const todayReq = new Request('http://localhost:8787/api/v1/admin/analytics/summary', {
    method: 'GET',
    headers: { Authorization: `Bearer ${validSessionToken}` },
  });
  const todayRes = await handleAdminGetAnalyticsSummary(todayReq, env);
  assert(todayRes.status === 200, 'Yetkili istekte HTTP 200 dönmeli');
  const todayData = await todayRes.json() as any;
  assert(todayData.success === true, 'Response success: true olmalı');
  assert(todayData.period === 'today', 'Varsayılan periyot today olmalı');
  assert(todayData.activeUsers > 0, 'Aktif kullanıcı sayısı > 0 olmalı');
  assert(todayData.pageViews >= todayData.activeUsers, 'Sayfa görüntüleme sayısı kullanıcıdan büyük veya eşit olmalı');
  assert(todayData.totalCountries > 0, 'Toplam ülke sayısı > 0 olmalı');
  assert(todayData.totalCities > 0, 'Toplam şehir sayısı > 0 olmalı');
  assert(Array.isArray(todayData.countries), 'countries dizi olmalı');
  assert(Array.isArray(todayData.cities), 'cities dizi olmalı');
  assert(todayData.countries[0].name === 'Türkiye', 'En yüksek oranlı ülke Türkiye olmalı');
  assert(typeof todayData.lastUpdated === 'string', 'lastUpdated zaman damgası dönmeli');

  // 3. Anlık (realtime) periyodu testi
  const realtimeReq = new Request('http://localhost:8787/api/v1/admin/analytics/summary?period=realtime', {
    method: 'GET',
    headers: { Authorization: `Bearer ${validSessionToken}` },
  });
  const realtimeRes = await handleAdminGetAnalyticsSummary(realtimeReq, env);
  assert(realtimeRes.status === 200, 'Realtime istekte HTTP 200 dönmeli');
  const realtimeData = await realtimeRes.json() as any;
  assert(realtimeData.period === 'realtime', 'Periyot realtime olmalı');
  assert(realtimeData.activeUsers >= 3, 'Realtime aktif kullanıcı sayısı makul olmalı');

  // 4. Haftalık (7d) ve Aylık (30d) testi
  const weekReq = new Request('http://localhost:8787/api/v1/admin/analytics/summary?period=7d', {
    method: 'GET',
    headers: { Authorization: `Bearer ${validSessionToken}` },
  });
  const weekRes = await handleAdminGetAnalyticsSummary(weekReq, env);
  const weekData = await weekRes.json() as any;
  assert(weekData.period === '7d', 'Periyot 7d olmalı');
  assert(weekData.activeUsers > todayData.activeUsers, 'Haftalık kullanıcı günlükten fazla olmalı');

  // 5. Önbellek testi (İkinci çağrıda X-Cache: HIT)
  const cachedReq = new Request('http://localhost:8787/api/v1/admin/analytics/summary?period=today', {
    method: 'GET',
    headers: { Authorization: `Bearer ${validSessionToken}` },
  });
  const cachedRes = await handleAdminGetAnalyticsSummary(cachedReq, env);
  assert(cachedRes.headers.get('X-Cache') === 'HIT', 'İkinci sorguda X-Cache: HIT olmalı');

  // 6. Zorunlu yenileme testi (refresh=1 ile X-Cache: MISS)
  const refreshReq = new Request('http://localhost:8787/api/v1/admin/analytics/summary?period=today&refresh=1', {
    method: 'GET',
    headers: { Authorization: `Bearer ${validSessionToken}` },
  });
  const refreshRes = await handleAdminGetAnalyticsSummary(refreshReq, env);
  assert(refreshRes.headers.get('X-Cache') === 'MISS', 'refresh=1 ile X-Cache: MISS dönmeli');

  // 7. GA4 yapılandırması & Fallback dayanıklılık testi
  const ga4Env = {
    ...env,
    GA4_PROPERTY_ID: '536224806',
    GA4_SERVICE_ACCOUNT_KEY: 'gecersiz_veya_bozuk_anahtar',
  };
  const fallbackReq = new Request('http://localhost:8787/api/v1/admin/analytics/summary?period=realtime&refresh=1', {
    method: 'GET',
    headers: { Authorization: `Bearer ${validSessionToken}` },
  });
  const fallbackRes = await handleAdminGetAnalyticsSummary(fallbackReq, ga4Env);
  assert(fallbackRes.status === 200, 'Bozuk GA4 anahtarında API çökmeyip HTTP 200 dönmeli');
  const fallbackData = await fallbackRes.json() as any;
  assert(fallbackData.source === 'telemetry', 'Hatalı GA4 anahtarında source telemetry fallback olmalı');
  assert(fallbackData.activeUsers > 0, 'Fallback aktif kullanıcı sayısı üretilmeli');

  // 8. Canlı GA4 Entegrasyon Testi (Varsa .dev.vars içerisinden okur)
  try {
    const fs = await import('fs');
    const path = await import('path');
    const devVarsPath = path.resolve(__dirname, '../.dev.vars');
    if (fs.existsSync(devVarsPath)) {
      const devVarsContent = fs.readFileSync(devVarsPath, 'utf8');
      const keyMatch = devVarsContent.match(/GA4_SERVICE_ACCOUNT_KEY=(.+)/);
      const propMatch = devVarsContent.match(/GA4_PROPERTY_ID=(.+)/);
      if (keyMatch && propMatch) {
        const liveEnv = {
          ...env,
          GA4_PROPERTY_ID: propMatch[1].trim(),
          GA4_SERVICE_ACCOUNT_KEY: keyMatch[1].trim(),
        };
        const liveReq = new Request('http://localhost:8787/api/v1/admin/analytics/summary?period=today&refresh=1', {
          method: 'GET',
          headers: { Authorization: `Bearer ${validSessionToken}` },
        });
        const liveRes = await handleAdminGetAnalyticsSummary(liveReq, liveEnv);
        assert(liveRes.status === 200, 'Canlı GA4 isteğinde HTTP 200 dönmeli');
        const liveData = await liveRes.json() as any;
        assert(liveData.source === 'ga4', 'Canlı bağlantıda source: ga4 olmalı');
        console.log(`✅ PASS: Canlı GA4 verisi başarıyla alındı! (source: ${liveData.source}, users: ${liveData.activeUsers})`);
      }
    }
  } catch (err: any) {
    console.warn('Canlı GA4 testi atlandı veya hata verdi:', err.message);
  }

  console.log('--- DASHBOARD ANALYTICS SUMMARY API TESTLERİ BAŞARIYLA TAMAMLANDI ---');
}

runTests().catch(err => {
  console.error('Test hatası:', err);
  process.exit(1);
});
