/**
 * MSKLabsDesk — Melez Hızlı Dağıtım Proxy & İndirme Sayacı (DIST-CDN-001)
 * File: backend/src/routes/downloadProxy.ts
 * IST-016: Aktif R2 (302 Redirect) + Arşiv Sürümler (512 MB Worker Cache Proxy) + D1 Sayaç
 */

import { AuthEnv, verifyAuthToken } from '../utils/auth';

export interface DownloadProxyEnv extends AuthEnv {
  DB: D1Database;
  RELEASES_BASE_URL?: string;
  APP_CATALOG_URL?: string;
}

export interface CatalogVersionEntry {
  version: string;
  tier?: 'r2' | 'archive_proxy';
  r2_url?: string;
  archive_url?: string;
  filename?: string;
}

export interface CatalogAppEntry {
  app_id: string;
  name?: string;
  latest_version?: string;
  download_url?: string;
  r2_keep_versions?: number;
  versions?: CatalogVersionEntry[];
}

interface ResolvedAsset {
  appId: string;
  version: string;
  tier: 'r2' | 'archive_proxy';
  targetUrl: string;
  filename: string;
}

const DEFAULT_RELEASES_BASE = 'https://releases.msklabs.org';
const DEFAULT_CATALOG_URL = 'https://raw.githubusercontent.com/mskaymaz/MSKLabsApps/main/app_catalog.json';
const CATALOG_TTL_MS = 5 * 60 * 1000;
const SUMMARY_TTL_MS = 5 * 60 * 1000;

// Bilinen aktif R2 varlıkları (katalogda versions[] henüz yoksa fallback olarak kullanılır)
const KNOWN_R2_ASSETS: Record<string, { appId: string; filename: string; activeVersions: string[]; archiveRepo?: string }> = {
  haydi_namaza: {
    appId: 'haydi_namaza',
    filename: 'HaydiNamaza.apk',
    activeVersions: ['v1.0.5', '1.0.5'],
    archiveRepo: 'https://github.com/mskaymaz/MSKLabsApps/releases/download',
  },
  rekatsay: {
    appId: 'rekatsay',
    filename: 'RekatSay-v1.3.2.apk',
    activeVersions: ['v1.3.2', '1.3.2', 'v1.3.1', '1.3.1'],
    archiveRepo: 'https://github.com/mskaymaz/MSKLabsApps/releases/download',
  },
  date_counter: {
    appId: 'date_counter',
    filename: 'DateCounter.exe',
    activeVersions: ['v1.1.0', '1.1.0'],
    archiveRepo: 'https://github.com/mskaymaz/D_DateCounter/releases/download',
  },
};

const SLUG_ALIASES: Record<string, string> = {
  haydinamaza: 'haydi_namaza',
  'haydi-namaza': 'haydi_namaza',
  haydi_namaza: 'haydi_namaza',
  rekatsay: 'rekatsay',
  'rekat-say': 'rekatsay',
  datecounter: 'date_counter',
  'date-counter': 'date_counter',
  date_counter: 'date_counter',
};

let catalogCache: { timestamp: number; apps: CatalogAppEntry[] } | null = null;
const summaryCache = new Map<string, { timestamp: number; data: any }>();

export function normalizeSlug(rawSlug: string): string {
  const clean = rawSlug.trim().toLowerCase();
  return SLUG_ALIASES[clean] || clean.replace(/-/g, '_');
}

export function normalizeVersion(rawVersion: string): string {
  const clean = rawVersion.trim();
  if (!clean) return '';
  return clean.startsWith('v') ? clean : `v${clean}`;
}

/**
 * IDM/çoklu parça ve HEAD isteklerinin sayacı yapay şişirmesini önler.
 */
export function shouldCountDownload(request: Request): boolean {
  if (request.method !== 'GET') return false;
  const range = request.headers.get('Range') || request.headers.get('range');
  if (!range) return true;
  return /^bytes=0-/i.test(range.trim());
}

async function fetchCatalogApps(env: DownloadProxyEnv, customFetch?: typeof fetch): Promise<CatalogAppEntry[]> {
  const now = Date.now();
  if (catalogCache && now - catalogCache.timestamp < CATALOG_TTL_MS) {
    return catalogCache.apps;
  }

  const fetcher = customFetch || fetch;
  const url = env.APP_CATALOG_URL || DEFAULT_CATALOG_URL;

  try {
    const res = await fetcher(url, { headers: { 'User-Agent': 'MSKLabsDesk-Worker/1.0' } });
    if (res.ok) {
      const json = (await res.json()) as { apps?: CatalogAppEntry[] };
      if (Array.isArray(json.apps)) {
        catalogCache = { timestamp: now, apps: json.apps };
        return json.apps;
      }
    }
  } catch {
    // Katalog erişilemezse bilinen R2 varlıklarına fallback yapılır
  }

  return catalogCache?.apps || [];
}

export function resolveAssetFromCatalog(
  appSlug: string,
  rawVersion: string,
  catalogApps: CatalogAppEntry[],
  releasesBaseUrl: string
): ResolvedAsset | null {
  const appId = normalizeSlug(appSlug);
  const ver = normalizeVersion(rawVersion);
  if (!appId || !ver || !/^[a-z0-9_]+$/.test(appId) || !/^v[0-9]+\.[0-9]+\.[0-9]+([.-][a-zA-Z0-9]+)?$/.test(ver)) {
    return null;
  }

  const base = releasesBaseUrl.replace(/\/+$/, '');
  const appEntry = catalogApps.find((a) => normalizeSlug(a.app_id) === appId);

  if (appEntry?.versions && appEntry.versions.length > 0) {
    const match = appEntry.versions.find((v) => normalizeVersion(v.version) === ver);
    if (match) {
      const filename = match.filename || KNOWN_R2_ASSETS[appId]?.filename || `${appId}.bin`;
      if (match.tier === 'archive_proxy' && match.archive_url) {
        return { appId, version: ver, tier: 'archive_proxy', targetUrl: match.archive_url, filename };
      }
      const r2Url = match.r2_url || `${base}/${appId}/${ver}/${filename}`;
      return { appId, version: ver, tier: 'r2', targetUrl: r2Url, filename };
    }
  }

  const known = KNOWN_R2_ASSETS[appId];
  if (!known) return null;

  const isR2 = known.activeVersions.some((v) => normalizeVersion(v) === ver);
  if (isR2) {
    return {
      appId,
      version: ver,
      tier: 'r2',
      targetUrl: `${base}/${appId}/${ver}/${known.filename}`,
      filename: known.filename,
    };
  }

  if (known.archiveRepo) {
    const tag = appId === 'date_counter' ? ver : `${appId}-${ver}`;
    return {
      appId,
      version: ver,
      tier: 'archive_proxy',
      targetUrl: `${known.archiveRepo}/${tag}/${known.filename}`,
      filename: known.filename,
    };
  }

  return null;
}

async function incrementDownloadCount(db: D1Database, appSlug: string, version: string, tier: 'r2' | 'archive_proxy'): Promise<void> {
  try {
    await db
      .prepare(
        `INSERT INTO download_stats (app_slug, version, tier, download_count, last_downloaded_at)
         VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(app_slug, version) DO UPDATE SET
           download_count = download_count + 1,
           tier = excluded.tier,
           last_downloaded_at = CURRENT_TIMESTAMP`
      )
      .bind(appSlug, version, tier)
      .run();
  } catch (err) {
    console.error('[DOWNLOAD STATS INCREMENT ERROR]', err);
  }
}

/**
 * GET / HEAD /dl/:appSlug/:version
 */
export async function handleDownloadProxy(
  request: Request,
  env: DownloadProxyEnv,
  ctx: ExecutionContext,
  options?: { catalogApps?: CatalogAppEntry[]; fetcher?: typeof fetch }
): Promise<Response> {
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  // Beklenen format: /dl/:appSlug/:version
  if (parts.length !== 3 || parts[0] !== 'dl') {
    return new Response(JSON.stringify({ error: 'Geçersiz indirme yolu. Kullanım: /dl/<app-slug>/<version>' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(JSON.stringify({ error: 'Yalnızca GET ve HEAD desteklenir.' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const [, rawSlug, rawVersion] = parts;
  const catalogApps = options?.catalogApps ?? (await fetchCatalogApps(env, options?.fetcher));
  const resolved = resolveAssetFromCatalog(
    rawSlug,
    rawVersion,
    catalogApps,
    env.RELEASES_BASE_URL || DEFAULT_RELEASES_BASE
  );

  if (!resolved) {
    return new Response(JSON.stringify({ error: 'Uygulama veya sürüm bulunamadı.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const countIt = shouldCountDownload(request);

  // 1. Katman: Aktif R2 -> 0 ms gecikmeli D1 sayaç + 302 Redirect
  if (resolved.tier === 'r2') {
    if (countIt) {
      ctx.waitUntil(incrementDownloadCount(env.DB, resolved.appId, resolved.version, 'r2'));
    }
    return new Response(null, {
      status: 302,
      headers: {
        Location: resolved.targetUrl,
        'Cache-Control': 'no-store',
        'X-Dist-Tier': 'r2',
      },
    });
  }

  // 2. Katman: Arşiv Sürüm -> Cloudflare Cache API (512 MB limitli CDN Cache Proxy)
  const fetcher = options?.fetcher || fetch;
  const cacheStorage = (typeof caches !== 'undefined' ? (caches as any).default : null) as Cache | null;
  const cacheKey = new Request(resolved.targetUrl, { method: 'GET' });

  if (cacheStorage && request.method === 'GET') {
    const cached = await cacheStorage.match(cacheKey);
    if (cached) {
      if (countIt) {
        ctx.waitUntil(incrementDownloadCount(env.DB, resolved.appId, resolved.version, 'archive_proxy'));
      }
      const hitHeaders = new Headers(cached.headers);
      hitHeaders.set('X-Dist-Tier', 'archive_proxy');
      hitHeaders.set('X-Cache', 'HIT');
      return new Response(cached.body, { status: cached.status, headers: hitHeaders });
    }
  }

  const upstream = await fetcher(resolved.targetUrl, {
    method: request.method,
    redirect: 'follow',
    headers: { 'User-Agent': 'MSKLabsDesk-ArchiveProxy/1.0' },
  });

  if (!upstream.ok) {
    return new Response(JSON.stringify({ error: 'Arşiv dosyası kaynaktan alınamadı.' }), {
      status: upstream.status === 404 ? 404 : 502,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  if (countIt) {
    ctx.waitUntil(incrementDownloadCount(env.DB, resolved.appId, resolved.version, 'archive_proxy'));
  }

  const resHeaders = new Headers(upstream.headers);
  resHeaders.set('Cache-Control', 'public, max-age=86400');
  resHeaders.set('Content-Disposition', `attachment; filename="${resolved.filename}"`);
  resHeaders.set('X-Dist-Tier', 'archive_proxy');
  resHeaders.set('X-Cache', 'MISS');

  const response = new Response(upstream.body, {
    status: 200,
    headers: resHeaders,
  });

  if (cacheStorage && request.method === 'GET') {
    ctx.waitUntil(cacheStorage.put(cacheKey, response.clone()));
  }

  return response;
}

/**
 * GET /api/admin/downloads/summary
 */
export async function handleAdminGetDownloadsSummary(request: Request, env: DownloadProxyEnv): Promise<Response> {
  const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
  if (!admin) {
    return new Response(JSON.stringify({ error: 'Yetkisiz erişim.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }

  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get('refresh') === '1';
  const cacheKey = 'downloads_summary';
  const now = Date.now();

  if (!forceRefresh) {
    const cached = summaryCache.get(cacheKey);
    if (cached && now - cached.timestamp < SUMMARY_TTL_MS) {
      return new Response(JSON.stringify(cached.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'HIT' },
      });
    }
  }

  try {
    const { results } = await env.DB.prepare(
      `SELECT app_slug, version, download_count, last_downloaded_at
       FROM download_stats
       ORDER BY download_count DESC, last_downloaded_at DESC`
    ).all<{ app_slug: string; version: string; download_count: number; last_downloaded_at: string }>();

    const rows = results || [];
    const appTotalsMap = new Map<string, { appSlug: string; totalDownloads: number; lastDownloadedAt: string }>();
    let totalDownloads = 0;

    for (const row of rows) {
      const count = Number(row.download_count || 0);
      totalDownloads += count;
      const existing = appTotalsMap.get(row.app_slug);
      if (!existing) {
        appTotalsMap.set(row.app_slug, {
          appSlug: row.app_slug,
          totalDownloads: count,
          lastDownloadedAt: row.last_downloaded_at,
        });
      } else {
        existing.totalDownloads += count;
        if (row.last_downloaded_at > existing.lastDownloadedAt) {
          existing.lastDownloadedAt = row.last_downloaded_at;
        }
      }
    }

    const payload = {
      success: true,
      totalDownloads,
      apps: Array.from(appTotalsMap.values()).sort((a, b) => b.totalDownloads - a.totalDownloads),
      versions: rows.map((r) => ({
        appSlug: r.app_slug,
        version: r.version,
        downloadCount: Number(r.download_count || 0),
        lastDownloadedAt: r.last_downloaded_at,
      })),
      lastUpdated: new Date().toISOString(),
    };

    summaryCache.set(cacheKey, { timestamp: now, data: payload });

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Cache': 'MISS' },
    });
  } catch (err) {
    console.error('[ADMIN DOWNLOADS SUMMARY ERROR]', err);
    return new Response(JSON.stringify({ error: 'İndirme özetleri alınırken hata oluştu.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}

export function resetDownloadProxyCaches(): void {
  catalogCache = null;
  summaryCache.clear();
}
