/**
 * MSKLabsDesk — Ekosistem Telemetri & Kaba Yaşam Döngüsü API (TELEMETRY-ECO-001 / IST-013)
 * File: backend/src/routes/telemetry.ts
 * Kapanış isteksiz, +7 gün doğal dağılımlı, PII içermeyen anonim telemetri motoru
 */

import { AuthEnv, verifyAuthToken } from '../utils/auth';

export interface TelemetryEnv extends AuthEnv {
  DB: D1Database;
}

interface CrashInput {
  error_fingerprint: string;
  error_message: string;
  stack_trace_snippet?: string;
}

interface HeartbeatPayload {
  eco_device_id: string;
  app_id: string;
  app_version: string;
  install_source?: string;
  platform: string;
  os_name?: string;
  os_release?: string;
  launch_count?: number;
  total_usage_seconds?: number;
  reinstall_count?: number;
  crashes?: CrashInput[];
}

const OVERVIEW_TTL_MS = 5 * 60 * 1000;
const RATE_WINDOW_MS = 60 * 1000;
const MAX_REQ_PER_MIN = 30;
const CRASH_TICKET_THRESHOLD = 50;

const ipRateMap = new Map<string, { count: number; resetAt: number }>();
const overviewCache = new Map<string, { timestamp: number; data: any }>();

const DEVICE_ID_REGEX = /^eco_[a-zA-Z0-9_-]{8,64}$/;
const APP_ID_REGEX = /^[a-z0-9_-]{2,48}$/;
const ALLOWED_PLATFORMS = new Set(['windows', 'macos', 'linux', 'android', 'ios', 'web']);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    ipRateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_REQ_PER_MIN;
}

function clampInt(val: unknown, min: number, max: number, fallback: number): number {
  const n = Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.trunc(n)));
}

/**
 * POST /api/v1/telemetry/heartbeat
 */
export async function handleTelemetryHeartbeat(request: Request, env: TelemetryEnv): Promise<Response> {
  const clientIp = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (isRateLimited(clientIp)) {
    return new Response(JSON.stringify({ error: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  let body: HeartbeatPayload;
  try {
    body = (await request.json()) as HeartbeatPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'Geçersiz JSON gövdesi.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const deviceId = typeof body?.eco_device_id === 'string' ? body.eco_device_id.trim() : '';
  const appId = typeof body?.app_id === 'string' ? body.app_id.trim().toLowerCase() : '';
  const appVersion = typeof body?.app_version === 'string' ? body.app_version.trim().slice(0, 32) : '';
  const platform = typeof body?.platform === 'string' ? body.platform.trim().toLowerCase() : '';

  if (!DEVICE_ID_REGEX.test(deviceId) || !APP_ID_REGEX.test(appId) || !appVersion || !ALLOWED_PLATFORMS.has(platform)) {
    return new Response(JSON.stringify({ error: 'Zorunlu telemetri alanları geçersiz (eco_device_id, app_id, app_version, platform).' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const installSource = typeof body.install_source === 'string' ? body.install_source.trim().slice(0, 32) : 'direct';
  const osName = typeof body.os_name === 'string' ? body.os_name.trim().slice(0, 32) : null;
  const osRelease = typeof body.os_release === 'string' ? body.os_release.trim().slice(0, 32) : null;
  const launchCount = clampInt(body.launch_count, 1, 50000, 1);
  const usageSeconds = clampInt(body.total_usage_seconds, 0, 2592000, 0);
  const reinstallCount = clampInt(body.reinstall_count, 0, 100, 0);

  // IP adresi asla saklanmaz; yalnızca Cloudflare coğrafya başlığı okunur
  const cf = (request as any).cf;
  const country = typeof cf?.country === 'string' ? cf.country : null;
  const city = typeof cf?.city === 'string' ? cf.city : null;

  try {
    await env.DB.prepare(
      `INSERT INTO device_apps (
         eco_device_id, app_id, app_version, install_source, platform,
         os_name, os_release, country, city,
         first_seen_at, last_seen_at, launch_count, total_usage_seconds, reinstall_count
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?)
       ON CONFLICT(eco_device_id, app_id) DO UPDATE SET
         app_version = excluded.app_version,
         install_source = excluded.install_source,
         platform = excluded.platform,
         os_name = COALESCE(excluded.os_name, device_apps.os_name),
         os_release = COALESCE(excluded.os_release, device_apps.os_release),
         country = COALESCE(excluded.country, device_apps.country),
         city = COALESCE(excluded.city, device_apps.city),
         last_seen_at = CURRENT_TIMESTAMP,
         launch_count = device_apps.launch_count + excluded.launch_count,
         total_usage_seconds = device_apps.total_usage_seconds + excluded.total_usage_seconds,
         reinstall_count = device_apps.reinstall_count + excluded.reinstall_count`
    )
      .bind(
        deviceId,
        appId,
        appVersion,
        installSource,
        platform,
        osName,
        osRelease,
        country,
        city,
        launchCount,
        usageSeconds,
        reinstallCount
      )
      .run();

    // Opsiyonel çökme raporları (max 10 öğe)
    if (Array.isArray(body.crashes) && body.crashes.length > 0) {
      const safeCrashes = body.crashes.slice(0, 10);
      for (const c of safeCrashes) {
        const fp = typeof c?.error_fingerprint === 'string' ? c.error_fingerprint.trim().slice(0, 64) : '';
        const msg = typeof c?.error_message === 'string' ? c.error_message.trim().slice(0, 300) : '';
        const snippet = typeof c?.stack_trace_snippet === 'string' ? c.stack_trace_snippet.trim().slice(0, 400) : '';
        if (!fp || !msg) continue;

        await env.DB.prepare(
          `INSERT INTO crash_reports (fingerprint, app_id, app_version, platform, error_message, stack_trace_snippet, first_seen, last_seen, occurrence_count)
           VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1)
           ON CONFLICT(fingerprint, app_id, app_version) DO UPDATE SET
             last_seen = CURRENT_TIMESTAMP,
             occurrence_count = crash_reports.occurrence_count + 1`
        )
          .bind(fp, appId, appVersion, platform, msg, snippet)
          .run();

        const crashRow = await env.DB.prepare(
          'SELECT occurrence_count FROM crash_reports WHERE fingerprint = ? AND app_id = ? AND app_version = ?'
        )
          .bind(fp, appId, appVersion)
          .first<{ occurrence_count: number }>();

        if (crashRow && crashRow.occurrence_count === CRASH_TICKET_THRESHOLD) {
          const sysTicketId = `SYS-${appId.toUpperCase().slice(0, 6)}-${fp.slice(0, 6)}`;
          await env.DB.prepare(
            `INSERT OR IGNORE INTO messages (id, sender_name, sender_email, subject, content, category, status, email_status, eco_device_id, app_version, created_at)
             VALUES (?, 'Eco-Telemetry Nöbetçisi (Sistem)', 'system-telemetry@msklabs.internal', ?, ?, 'hata', 'new', 'valid', ?, ?, CURRENT_TIMESTAMP)`
          )
            .bind(
              sysTicketId,
              `[KRİTİK ÇÖKME] ${appId} ${appVersion} (${CRASH_TICKET_THRESHOLD}+ Olay)`,
              `Parmak İzi: ${fp}\nPlatform: ${platform}\nHata: ${msg}\nKonum: ${snippet}`,
              deviceId,
              appVersion
            )
            .run();
        }
      }
    }

    return new Response(
      JSON.stringify({
        status: 'ok',
        force_update: false,
        latest_version: appVersion,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      }
    );
  } catch (err) {
    console.error('[TELEMETRY HEARTBEAT ERROR]', err);
    return new Response(JSON.stringify({ error: 'Telemetri kaydedilirken sunucu hatası oluştu.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}

/**
 * GET /api/admin/telemetry/overview
 */
export async function handleAdminGetTelemetryOverview(request: Request, env: TelemetryEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get('refresh') === '1';
  const cacheKey = 'telemetry_overview';
  const now = Date.now();

  if (!forceRefresh) {
    const cached = overviewCache.get(cacheKey);
    if (cached && now - cached.timestamp < OVERVIEW_TTL_MS) {
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'HIT' },
      });
    }
  }

  try {
    const { results: deviceRows } = await env.DB.prepare(
      `SELECT eco_device_id, app_id, app_version, platform, first_seen_at, last_seen_at, launch_count, reinstall_count
       FROM device_apps`
    ).all<{
      eco_device_id: string;
      app_id: string;
      app_version: string;
      platform: string;
      first_seen_at: string;
      last_seen_at: string;
      launch_count: number;
      reinstall_count: number;
    }>();

    const { results: crashRows } = await env.DB.prepare(
      `SELECT COUNT(*) as total_crashes FROM crash_reports WHERE is_resolved = 0`
    ).all<{ total_crashes: number }>();

    const rows = deviceRows || [];
    const uniqueDevices = new Set<string>();
    const deviceToApps = new Map<string, Set<string>>();
    const appMap = new Map<
      string,
      { appId: string; deviceCount: number; totalLaunches: number; reinstallCount: number; retentionDaysSum: number }
    >();

    let totalLaunches = 0;

    for (const r of rows) {
      uniqueDevices.add(r.eco_device_id);
      if (!deviceToApps.has(r.eco_device_id)) {
        deviceToApps.set(r.eco_device_id, new Set());
      }
      deviceToApps.get(r.eco_device_id)!.add(r.app_id);

      const launches = Number(r.launch_count || 0);
      const reinstalls = Number(r.reinstall_count || 0);
      totalLaunches += launches;

      const firstMs = Date.parse(r.first_seen_at || '') || now;
      const lastMs = Date.parse(r.last_seen_at || '') || firstMs;
      const retentionDays = Math.max(0, (lastMs - firstMs) / (1000 * 60 * 60 * 24));

      const agg = appMap.get(r.app_id) || {
        appId: r.app_id,
        deviceCount: 0,
        totalLaunches: 0,
        reinstallCount: 0,
        retentionDaysSum: 0,
      };
      agg.deviceCount += 1;
      agg.totalLaunches += launches;
      agg.reinstallCount += reinstalls;
      agg.retentionDaysSum += retentionDays;
      appMap.set(r.app_id, agg);
    }

    const appLeague = Array.from(appMap.values())
      .map((a) => ({
        appId: a.appId,
        deviceCount: a.deviceCount,
        totalLaunches: a.totalLaunches,
        avgLaunchesPerDevice: a.deviceCount > 0 ? Number((a.totalLaunches / a.deviceCount).toFixed(1)) : 0,
        avgRetentionDays: a.deviceCount > 0 ? Number((a.retentionDaysSum / a.deviceCount).toFixed(1)) : 0,
        reinstallCount: a.reinstallCount,
      }))
      .sort((a, b) => b.deviceCount - a.deviceCount);

    // Çapraz Uygulama Kümeleri & Korelasyon
    let twoPlus = 0;
    let threePlus = 0;
    let fivePlus = 0;
    const comboCounts = new Map<string, { apps: string[]; deviceCount: number }>();
    const coOccurrence = new Map<string, Map<string, number>>();

    for (const appsSet of deviceToApps.values()) {
      const sorted = Array.from(appsSet).sort();
      if (sorted.length >= 2) twoPlus += 1;
      if (sorted.length >= 3) threePlus += 1;
      if (sorted.length >= 5) fivePlus += 1;

      if (sorted.length >= 2) {
        const key = sorted.join(' + ');
        const existingCombo = comboCounts.get(key);
        if (existingCombo) existingCombo.deviceCount += 1;
        else comboCounts.set(key, { apps: sorted, deviceCount: 1 });

        for (const a of sorted) {
          if (!coOccurrence.has(a)) coOccurrence.set(a, new Map());
          const inner = coOccurrence.get(a)!;
          for (const b of sorted) {
            if (a === b) continue;
            inner.set(b, (inner.get(b) || 0) + 1);
          }
        }
      }
    }

    const appCorrelations: Record<string, { coAppId: string; sharedDevices: number; percentage: number }[]> = {};
    for (const appItem of appLeague) {
      const inner = coOccurrence.get(appItem.appId);
      if (!inner || appItem.deviceCount === 0) {
        appCorrelations[appItem.appId] = [];
        continue;
      }
      appCorrelations[appItem.appId] = Array.from(inner.entries())
        .map(([coAppId, sharedDevices]) => ({
          coAppId,
          sharedDevices,
          percentage: Math.round((sharedDevices / appItem.deviceCount) * 100),
        }))
        .sort((a, b) => b.sharedDevices - a.sharedDevices);
    }

    const topCombinations = Array.from(comboCounts.values())
      .sort((a, b) => b.deviceCount - a.deviceCount)
      .slice(0, 10);

    const payload = {
      success: true,
      totals: {
        totalDevices: uniqueDevices.size,
        totalInstallations: rows.length,
        totalLaunches,
        unresolvedCrashes: Number(crashRows?.[0]?.total_crashes || 0),
      },
      appLeague,
      crossApp: {
        multiAppBuckets: { twoPlus, threePlus, fivePlus },
        appCorrelations,
        topCombinations,
      },
      lastUpdated: new Date().toISOString(),
    };

    overviewCache.set(cacheKey, { timestamp: now, data: payload });

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'MISS' },
    });
  } catch (err) {
    console.error('[ADMIN TELEMETRY OVERVIEW ERROR]', err);
    return new Response(JSON.stringify({ error: 'Telemetri özeti alınırken sunucu hatası oluştu.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}

export function resetTelemetryCaches(): void {
  ipRateMap.clear();
  overviewCache.clear();
}
