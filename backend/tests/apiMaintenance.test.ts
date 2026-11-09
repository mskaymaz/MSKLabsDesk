/**
 * SYS-SETTINGS-001 — Bakım Modu ve Rota Kalkanı Entegrasyon Testleri
 */

import {
  checkPathMaintenance,
  checkAdminBypass,
  generateMaintenance503Response,
  getMaintenanceConfig,
  invalidateMaintenanceCache,
  DEFAULT_MAINTENANCE_CONFIG,
  DEFAULT_MAINTENANCE_ROUTES,
  type MaintenanceConfig,
} from '../src/utils/maintenance';
import { createSessionToken } from '../src/utils/auth';

console.log('--- SYS-SETTINGS-001 BAKIM MODU & ROTA KALKANI TESTLERİ BAŞLIYOR ---');

function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${msg}`);
}

async function runTests() {
  const secret = 'test_jwt_secret_msk_2026';

  // 1. Rota bazlı kontrol testleri
  const testConfig: MaintenanceConfig = {
    global: false,
    message: 'Özel bakım mesajı',
    eta: '18:30',
    routes: [
      { path: '/', title: 'Ana Sayfa', enabled: false },
      { path: '/apps.html', title: 'Uygulamalar Kataloğu', enabled: true },
      { path: '/blog', title: 'Blog', enabled: true },
      { path: '/destek.html', title: 'Destek Masası', enabled: false },
    ],
    allowed_ips: [],
  };

  const checkHome = checkPathMaintenance('/', testConfig);
  assert(!checkHome.inMaintenance, 'Devre dışı rota (/): inMaintenance false olmalı');

  const checkApps = checkPathMaintenance('/apps.html', testConfig);
  assert(checkApps.inMaintenance, 'Aktif rota (/apps.html): inMaintenance true olmalı');
  assert(checkApps.routeTitle === 'Uygulamalar Kataloğu', 'Rota başlığı Uygulamalar Kataloğu olmalı');
  assert(checkApps.eta === '18:30', 'ETA bilgisi dönmeli');

  const checkBlogSub = checkPathMaintenance('/blog/yeni-makale', testConfig);
  assert(checkBlogSub.inMaintenance, 'Alt rota (/blog/yeni-makale): ana rota eşleşmesiyle true olmalı');

  // 2. Global bakım modu testi
  const globalConfig: MaintenanceConfig = {
    ...testConfig,
    global: true,
  };
  const checkAnyGlobal = checkPathMaintenance('/hakkimizda', globalConfig);
  assert(checkAnyGlobal.inMaintenance, 'Global bakım açıkken her rota inMaintenance true olmalı');
  assert(checkAnyGlobal.routeTitle === 'MSK Labs', 'Global başlık MSK Labs olmalı');

  // 3. Admin Bypass Testleri
  const normalReq = new Request('https://msklabs.org/apps.html');
  const normalBypass = await checkAdminBypass(normalReq, secret);
  assert(!normalBypass, 'Normal ziyaretçi bypass alamamalı');

  const adminToken = await createSessionToken({
    id: 'adm_1',
    name: 'Admin',
    email: 'admin@msklabs.org',
    role: 'super_admin',
  }, secret);

  const authHeaderReq = new Request('https://msklabs.org/apps.html', {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const headerBypass = await checkAdminBypass(authHeaderReq, secret);
  assert(headerBypass, 'Geçerli Authorization token taşıyan yönetici bypass almalı');

  const cookieReq = new Request('https://msklabs.org/apps.html', {
    headers: { Cookie: `admin_token=${adminToken}; theme=dark` },
  });
  const cookieBypass = await checkAdminBypass(cookieReq, secret);
  assert(cookieBypass, 'Geçerli admin_token çerezi taşıyan yönetici bypass almalı');

  // 4. HTTP 503 Yanıt Testi
  const res503 = generateMaintenance503Response('Uygulamalar', 'Veritabanı bakımı', '19:00');
  assert(res503.status === 503, 'Yanıt HTTP 503 Service Unavailable olmalı');
  assert(res503.headers.get('Retry-After') === '3600', 'Retry-After: 3600 başlığı bulunmalı');
  const bodyText = await res503.text();
  assert(bodyText.includes('Uygulamalar'), 'HTML gövdesinde modül adı yer almalı');
  assert(bodyText.includes('19:00'), 'HTML gövdesinde ETA yer almalı');

  // 5. In-Memory Önbellek Testi
  let fetchCount = 0;
  const mockDb = {
    prepare: () => ({
      first: async () => {
        fetchCount++;
        return {
          meta_json: JSON.stringify({
            maintenance: { global: false, message: 'D1 Mesaj', eta: '20:00', routes: [] },
          }),
        };
      },
    }),
  };

  invalidateMaintenanceCache();
  const c1 = await getMaintenanceConfig(mockDb);
  assert(fetchCount === 1, 'İlk okumada veritabanına sorgu atılmalı');
  assert(c1.message === 'D1 Mesaj', 'D1 verisi başarıyla parse edilmeli');

  const c2 = await getMaintenanceConfig(mockDb);
  assert(fetchCount === 1, 'İkinci okumada bellek önbelleği devreye girmeli (D1 sorgusu artmamalı)');

  invalidateMaintenanceCache();
  const c3 = await getMaintenanceConfig(mockDb);
  assert(fetchCount === 2, 'Önbellek geçersiz kılındıktan sonra tekrar D1 sorgusu atılmalı');

  console.log('--- SYS-SETTINGS-001 BAKIM MODU TESTLERİ BAŞARIYLA TAMAMLANDI ---');
}

runTests().catch((err) => {
  console.error('Test hatası:', err);
  process.exit(1);
});
