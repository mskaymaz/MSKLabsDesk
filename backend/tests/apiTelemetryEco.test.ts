/**
 * MSKLabsDesk — Ekosistem Telemetri & Yaşam Döngüsü Testleri (TELEMETRY-ECO-001)
 * File: backend/tests/apiTelemetryEco.test.ts
 */

import {
  handleTelemetryHeartbeat,
  handleAdminGetTelemetryOverview,
  resetTelemetryCaches,
} from '../src/routes/telemetry';
import { handleSupportSubmission } from '../src/routes/support';
import { createSessionToken } from '../src/utils/auth';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

class MockTelemetryDB {
  public deviceApps = new Map<string, any>();
  public crashReports = new Map<string, any>();
  public messages: any[] = [];

  prepare(sql: string) {
    const db = this;
    return {
      _args: [] as any[],
      bind(...args: any[]) {
        this._args = args;
        return this;
      },
      async run() {
        if (sql.includes('INSERT INTO device_apps')) {
          const [deviceId, appId, appVersion, installSource, platform, osName, osRelease, country, city, launchCount, usageSec, reinstallCount] = this._args;
          const key = `${deviceId}:${appId}`;
          const existing = db.deviceApps.get(key);
          if (existing) {
            existing.app_version = appVersion;
            existing.last_seen_at = '2026-11-25T11:00:00Z';
            existing.launch_count += launchCount;
            existing.total_usage_seconds += usageSec;
            existing.reinstall_count += reinstallCount;
          } else {
            db.deviceApps.set(key, {
              eco_device_id: deviceId,
              app_id: appId,
              app_version: appVersion,
              install_source: installSource,
              platform,
              os_name: osName,
              os_release: osRelease,
              country,
              city,
              first_seen_at: '2026-11-18T11:00:00Z',
              last_seen_at: '2026-11-25T11:00:00Z',
              launch_count: launchCount,
              total_usage_seconds: usageSec,
              reinstall_count: reinstallCount,
            });
          }
        } else if (sql.includes('INSERT INTO crash_reports')) {
          const [fp, appId, appVersion, platform, msg, snippet] = this._args;
          const key = `${fp}:${appId}:${appVersion}`;
          const existing = db.crashReports.get(key);
          if (existing) {
            existing.occurrence_count += 1;
          } else {
            db.crashReports.set(key, {
              fingerprint: fp,
              app_id: appId,
              app_version: appVersion,
              platform,
              error_message: msg,
              stack_trace_snippet: snippet,
              occurrence_count: 1,
              is_resolved: 0,
            });
          }
        } else if (sql.includes('INSERT INTO messages') || sql.includes('INSERT OR IGNORE INTO messages')) {
          db.messages.push({ sql, args: this._args });
        }
        return { success: true };
      },
      async first() {
        if (sql.includes('FROM crash_reports')) {
          const [fp, appId, appVersion] = this._args;
          return db.crashReports.get(`${fp}:${appId}:${appVersion}`) || null;
        }
        return null;
      },
      async all() {
        if (sql.includes('FROM device_apps')) {
          return { results: Array.from(db.deviceApps.values()) };
        }
        if (sql.includes('FROM crash_reports')) {
          return { results: [{ total_crashes: db.crashReports.size }] };
        }
        return { results: [] };
      },
    };
  }
}

async function runTests() {
  console.log('--- TELEMETRY-ECO-001 TESTLERİ BAŞLIYOR ---');
  resetTelemetryCaches();

  const secret = 'test_secret_telemetry_eco_2026';
  const mockDb = new MockTelemetryDB();
  const env = { DB: mockDb as any, ADMIN_JWT_SECRET: secret };

  // 1. Geçersiz eco_device_id -> 400
  {
    const res = await handleTelemetryHeartbeat(
      new Request('http://localhost:8787/api/v1/telemetry/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eco_device_id: 'bad_id', app_id: 'haydi_namaza', app_version: '1.0.5', platform: 'android' }),
      }),
      env
    );
    assert(res.status === 400, 'Geçersiz eco_device_id HTTP 400 dönmeli');
  }

  // 2. Geçerli Heartbeat Upsert + delta launch_count + reinstall_count + çoklu uygulama
  const dev1 = 'eco_d4a1b89c-3e2f-4c5a-90ab-123456789abc';
  const dev2 = 'eco_e5b2c90d-4f3a-5d6b-01bc-234567890def';
  {
    const r1 = await handleTelemetryHeartbeat(
      new Request('http://localhost:8787/api/v1/telemetry/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '1.2.3.4' },
        body: JSON.stringify({ eco_device_id: dev1, app_id: 'haydi_namaza', app_version: '1.0.5', platform: 'android', launch_count: 10 }),
      }),
      env
    );
    assert(r1.status === 200, 'İlk heartbeat HTTP 200 dönmeli');

    // Aynı cihaz + aynı uygulama tekrar açılış (delta +5, reinstall +1)
    await handleTelemetryHeartbeat(
      new Request('http://localhost:8787/api/v1/telemetry/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '1.2.3.4' },
        body: JSON.stringify({ eco_device_id: dev1, app_id: 'haydi_namaza', app_version: '1.0.6', platform: 'android', launch_count: 5, reinstall_count: 1 }),
      }),
      env
    );

    const stored = mockDb.deviceApps.get(`${dev1}:haydi_namaza`);
    assert(stored?.launch_count === 15, 'launch_count delta olarak 15 olmalı');
    assert(stored?.reinstall_count === 1, 'reinstall_count 1 olmalı');

    // Aynı cihazda 2. uygulama + 2. cihazda 1. uygulama
    await handleTelemetryHeartbeat(
      new Request('http://localhost:8787/api/v1/telemetry/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '1.2.3.5' },
        body: JSON.stringify({ eco_device_id: dev1, app_id: 'rekatsay', app_version: '1.3.1', platform: 'android', launch_count: 4 }),
      }),
      env
    );
    await handleTelemetryHeartbeat(
      new Request('http://localhost:8787/api/v1/telemetry/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'CF-Connecting-IP': '1.2.3.6' },
        body: JSON.stringify({ eco_device_id: dev2, app_id: 'haydi_namaza', app_version: '1.0.5', platform: 'android', launch_count: 2 }),
      }),
      env
    );
  }

  // 3. Admin Telemetry Overview: 401 + 200 + Korelasyon + X-Cache HIT/MISS
  {
    const unauth = await handleAdminGetTelemetryOverview(new Request('http://localhost:8787/api/admin/telemetry/overview'), env);
    assert(unauth.status === 401, 'Yetkisiz overview isteği 401 dönmeli');

    const token = await createSessionToken({ id: 'admin_1', email: 'iletisim@msklabs.org', name: 'MSK', role: 'super_admin' }, secret);
    const res1 = await handleAdminGetTelemetryOverview(
      new Request('http://localhost:8787/api/admin/telemetry/overview', { headers: { Authorization: `Bearer ${token}` } }),
      env
    );
    assert(res1.status === 200, 'Yetkili overview isteği 200 dönmeli');
    assert(res1.headers.get('X-Cache') === 'MISS', 'İlk overview isteği X-Cache: MISS olmalı');
    const data = (await res1.json()) as any;
    assert(data.totals.totalDevices === 2, 'Toplam tekil cihaz 2 olmalı');
    assert(data.totals.totalLaunches === 21, 'Toplam açılış 21 olmalı');
    assert(data.crossApp.multiAppBuckets.twoPlus === 1, '2+ uygulamalı cihaz sayısı 1 olmalı');
    assert(data.crossApp.appCorrelations.haydi_namaza[0]?.coAppId === 'rekatsay', 'HaydiNamaza korelasyonunda rekatsay görünmeli');
    assert(data.crossApp.appCorrelations.haydi_namaza[0]?.percentage === 50, 'HaydiNamaza cihazlarının %50 sinde rekatsay olmalı');

    const res2 = await handleAdminGetTelemetryOverview(
      new Request('http://localhost:8787/api/admin/telemetry/overview', { headers: { Authorization: `Bearer ${token}` } }),
      env
    );
    assert(res2.headers.get('X-Cache') === 'HIT', 'İkinci overview isteği X-Cache: HIT olmalı');
  }

  // 4. Support Formu eco_device_id & app_version kaydı
  {
    const supRes = await handleSupportSubmission(
      new Request('http://localhost:8787/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: 'Test Kullanıcı',
          sender_email: 'iletisim@msklabs.org',
          subject: 'Uygulama Desteği',
          content: 'Merhaba test mesajı',
          eco_device_id: dev1,
          app_version: '1.0.6',
        }),
      }),
      env as any
    );
    assert(supRes.status === 200 || supRes.status === 201, 'Support isteği başarılı dönmeli');
    const lastMsg = mockDb.messages[mockDb.messages.length - 1];
    assert(lastMsg?.args?.includes(dev1), 'Support kaydında eco_device_id yer almalı');
    assert(lastMsg?.args?.includes('1.0.6'), 'Support kaydında app_version yer almalı');
  }

  console.log('🎉 TÜM TELEMETRY-ECO-001 TESTLERİ BAŞARIYLA GEÇTİ!');
}

runTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
