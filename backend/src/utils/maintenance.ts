/**
 * MSKLabsDesk — Bakım Modu ve Rota Güvenlik Motoru (Maintenance Engine)
 * Cloudflare Edge & D1 In-Memory Önbellekleme Uyumlu
 */

import { verifyAuthToken } from './auth';

export interface MaintenanceRoute {
  path: string;
  title: string;
  enabled: boolean;
}

export interface MaintenanceConfig {
  global: boolean;
  message: string;
  eta: string;
  routes: MaintenanceRoute[];
  allowed_ips: string[];
}

export const DEFAULT_MAINTENANCE_ROUTES: MaintenanceRoute[] = [
  { path: '/', title: 'Ana Sayfa (Portal)', enabled: false },
  { path: '/apps.html', title: 'Uygulamalar Kataloğu', enabled: false },
  { path: '/blog', title: 'Blog & Fikir Platformu', enabled: false },
  { path: '/destek.html', title: 'Destek Masası', enabled: false },
  { path: '/about.html', title: 'Hakkımızda', enabled: false },
  { path: '/contact.html', title: 'İletişim & Kurumsal', enabled: false },
  { path: '/faq.html', title: 'Sıkça Sorulan Sorular (SSS)', enabled: false },
  { path: '/cookies.html', title: 'Çerez Politikası', enabled: false },
  { path: '/privacy.html', title: 'Gizlilik Politikası', enabled: false },
  { path: '/terms.html', title: 'Kullanım Koşulları', enabled: false },
  { path: '/kvkk.html', title: 'KVKK Aydınlatma Metni', enabled: false },
];

export const DEFAULT_MAINTENANCE_CONFIG: MaintenanceConfig = {
  global: false,
  message: 'Sistemimiz şu anda planlı bakım ve iyileştirme çalışmaları nedeniyle geçici olarak hizmet verememektedir.',
  eta: '',
  routes: DEFAULT_MAINTENANCE_ROUTES,
  allowed_ips: [],
};

// Edge In-Memory Önbellek (D1 Kota Koruması - 30sn TTL)
let cachedMaintenance: { config: MaintenanceConfig; expiresAt: number } | null = null;

export async function getMaintenanceConfig(db: any, forceFresh = false): Promise<MaintenanceConfig> {
  const now = Date.now();
  if (!forceFresh && cachedMaintenance && cachedMaintenance.expiresAt > now) {
    return cachedMaintenance.config;
  }

  try {
    const row = await db.prepare("SELECT meta_json FROM site_templates WHERE key_name = 'site_settings'").first();
    if (row && (row as any).meta_json) {
      const raw = (row as any).meta_json;
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const m = parsed.maintenance || {};

      const config: MaintenanceConfig = {
        global: typeof m.global === 'boolean' ? m.global : !!parsed.maintenanceMode,
        message: m.message || DEFAULT_MAINTENANCE_CONFIG.message,
        eta: m.eta || '',
        routes: Array.isArray(m.routes) && m.routes.length > 0 ? m.routes : DEFAULT_MAINTENANCE_ROUTES,
        allowed_ips: Array.isArray(m.allowed_ips) ? m.allowed_ips : [],
      };

      cachedMaintenance = { config, expiresAt: now + 30000 };
      return config;
    }
  } catch (err) {
    console.warn('[Maintenance] Config okunamadı, varsayılan dönülüyor:', err);
  }

  return DEFAULT_MAINTENANCE_CONFIG;
}

export function invalidateMaintenanceCache(): void {
  cachedMaintenance = null;
}

/**
 * Belirli bir pathname'in bakımda olup olmadığını kontrol eder.
 */
export function checkPathMaintenance(
  pathname: string,
  config: MaintenanceConfig
): { inMaintenance: boolean; routeTitle?: string; message?: string; eta?: string } {
  if (config.global) {
    return {
      inMaintenance: true,
      routeTitle: 'MSK Labs',
      message: config.message,
      eta: config.eta,
    };
  }

  // Normalizasyon (Örn: /blog/yazi-1 -> /blog ile eşleşmeli)
  const normalizedPath = pathname.toLowerCase();
  const matched = config.routes.find((r) => {
    if (!r.enabled) return false;
    const rPath = r.path.toLowerCase();
    if (rPath === '/') return normalizedPath === '/' || normalizedPath === '/index.html';
    return normalizedPath === rPath || normalizedPath.startsWith(rPath + '/') || normalizedPath === `${rPath}.html`;
  });

  if (matched) {
    return {
      inMaintenance: true,
      routeTitle: matched.title,
      message: config.message,
      eta: config.eta,
    };
  }

  return { inMaintenance: false };
}

/**
 * Yönetici Oturumu Doğrulaması (Admin Bypass Kontrolü)
 * Authorization Bearer Header ve Cookie üzerinden JWT doğrulaması yapar.
 */
export async function checkAdminBypass(request: Request, secret?: string): Promise<boolean> {
  // 1. Authorization Header Kontrolü
  const authUser = await verifyAuthToken(request, secret);
  if (authUser) return true;

  // 2. Cookie Kontrolü (admin_token veya auth_token)
  const cookieHeader = request.headers.get('Cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, v.join('=')];
      })
    );
    const token = cookies.admin_token || cookies.auth_token;
    if (token) {
      const dummyReq = new Request('http://localhost', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cookieUser = await verifyAuthToken(dummyReq, secret);
      if (cookieUser) return true;
    }
  }

  return false;
}

/**
 * SEO Uyumlu HTTP 503 Service Unavailable Yanıtı Üretici
 */
export function generateMaintenance503Response(
  routeTitle: string,
  message: string,
  eta?: string
): Response {
  const etaHtml = eta && eta.trim() !== ''
    ? `<div style="margin-top:14px;padding:8px 14px;border-radius:8px;background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);display:inline-block;font-size:0.85rem;color:#38bdf8;"><strong>Tahmini Tamamlanma:</strong> ${eta}</div>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bakım Çalışması — ${routeTitle}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 20px;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #090d16;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .card {
      width: 100%;
      max-width: 520px;
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 36px 28px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(245, 158, 11, 0.12);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 {
      font-size: 1.35rem;
      font-weight: 700;
      margin: 0 0 12px 0;
      color: #f1f5f9;
      line-height: 1.3;
    }
    p {
      color: #94a3b8;
      font-size: 0.92rem;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }
    .actions {
      margin-top: 24px;
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 9px 18px;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.15s ease;
      cursor: pointer;
    }
    .btn-primary {
      background: #0284c7;
      color: #ffffff;
      border: 1px solid #0284c7;
    }
    .btn-primary:hover {
      background: #0369a1;
    }
    .btn-outline {
      background: transparent;
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.25);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">⚙️ Planlı Bakım Modu</div>
    <h1>${routeTitle}</h1>
    <p>${message}</p>
    ${etaHtml}
    <div class="actions">
      <a href="/" class="btn btn-primary">Ana Sayfa</a>
      <a href="javascript:location.reload()" class="btn btn-outline">Tekrar Dene</a>
    </div>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Retry-After': '3600',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  });
}
