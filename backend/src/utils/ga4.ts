/**
 * MSKLabsDesk — Google Analytics 4 (GA4) Data API Entegrasyonu
 * File: backend/src/utils/ga4.ts
 * Cloudflare Edge & WebCrypto RS256 Uyumlu (Harici Bağımlılıksız)
 */

import { AnalyticsBreakdownItem, AnalyticsSummaryResponse } from '../routes/adminAnalytics';

interface ServiceAccountKey {
  type?: string;
  project_id?: string;
  private_key_id?: string;
  private_key: string;
  client_email: string;
}

interface GA4Env {
  GA4_PROPERTY_ID?: string;
  GA4_SERVICE_ACCOUNT_KEY?: string;
}

// Bellek içi erişim belirteci (token) önbelleği
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Base64URL Kodlama Yardımcısı
 */
function base64url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * PEM formatındaki PKCS#8 özel anahtarını ArrayBuffer'a dönüştürür
 */
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const cleanPem = pem
    .replace(/-----BEGIN (?:RSA )?PRIVATE KEY-----/, '')
    .replace(/-----END (?:RSA )?PRIVATE KEY-----/, '')
    .replace(/\s+/g, '');
  const binary = atob(cleanPem);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    buffer[i] = binary.charCodeAt(i);
  }
  return buffer.buffer;
}

/**
 * Service Account ile Google OAuth2 RS256 Erişim Belirteci Üretir
 */
async function getGoogleAccessToken(saKeyRaw: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Önbellekte geçerli token var mı (5 dakikalık tolerans payı ile)?
  if (cachedToken && cachedToken.expiresAt > now + 300) {
    return cachedToken.token;
  }

  // JSON veya Base64 ayrıştırma
  let sa: ServiceAccountKey;
  try {
    const trimmed = saKeyRaw.trim();
    if (trimmed.startsWith('{')) {
      sa = JSON.parse(trimmed);
    } else {
      sa = JSON.parse(atob(trimmed));
    }
  } catch (err: any) {
    throw new Error(`GA4 Service Account anahtarı ayrıştırılamadı: ${err.message}`);
  }

  if (!sa.client_email || !sa.private_key) {
    throw new Error('GA4 Service Account anahtarında client_email veya private_key eksik.');
  }

  // JWT Header & Payload
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const textEncoder = new TextEncoder();
  const encodedHeader = base64url(textEncoder.encode(JSON.stringify(header)));
  const encodedPayload = base64url(textEncoder.encode(JSON.stringify(payload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  // WebCrypto RSASSA-PKCS1-v1_5 anahtar yükleme ve imzalama
  const keyBuffer = pemToArrayBuffer(sa.private_key);
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBuffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    textEncoder.encode(signingInput)
  );

  const assertion = `${signingInput}.${base64url(signatureBuffer)}`;

  // Google OAuth2 Token uç noktasına istek
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${assertion}`,
  });

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text();
    throw new Error(`Google OAuth2 belirteç hatası (${tokenResponse.status}): ${errorBody}`);
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: tokenData.access_token,
    expiresAt: now + (tokenData.expires_in || 3600),
  };

  return cachedToken.token;
}

/**
 * GA4 API Raporunu Çeker ve Analitik Özet Formatına Dönüştürür
 */
export async function fetchGA4Analytics(
  env: GA4Env,
  period: 'realtime' | 'today' | '7d' | '30d'
): Promise<Omit<AnalyticsSummaryResponse, 'success' | 'source' | 'lastUpdated'> | null> {
  const propertyId = env.GA4_PROPERTY_ID;
  const saKeyRaw = env.GA4_SERVICE_ACCOUNT_KEY;

  if (!propertyId || !saKeyRaw) {
    return null;
  }

  try {
    const accessToken = await getGoogleAccessToken(saKeyRaw);

    if (period === 'realtime') {
      // 1. Gerçek Zamanlı Rapor (Son 30 Dakika)
      const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runRealtimeReport`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: [{ name: 'activeUsers' }],
          dimensions: [{ name: 'country' }, { name: 'city' }],
        }),
      });

      if (!res.ok) {
        console.warn(`[GA4 REALTIME ERROR] HTTP ${res.status}: ${await res.text()}`);
        return null;
      }

      const data = (await res.json()) as any;
      const rows = data.rows || [];

      let totalUsers = 0;
      const countryMap = new Map<string, number>();
      const cityMap = new Map<string, number>();

      for (const row of rows) {
        const country = row.dimensionValues?.[0]?.value || 'Diğer';
        const city = row.dimensionValues?.[1]?.value || 'Bilinmiyor';
        const count = parseInt(row.metricValues?.[0]?.value || '0', 10);
        totalUsers += count;

        countryMap.set(country, (countryMap.get(country) || 0) + count);
        cityMap.set(`${city} (${country})`, (cityMap.get(`${city} (${country})`) || 0) + count);
      }

      const countries: AnalyticsBreakdownItem[] = Array.from(countryMap.entries())
        .map(([name, users]) => ({
          name,
          users,
          percentage: totalUsers > 0 ? Math.round((users / totalUsers) * 100) : 0,
        }))
        .sort((a, b) => b.users - a.users);

      const cities: AnalyticsBreakdownItem[] = Array.from(cityMap.entries())
        .map(([name, users]) => ({
          name,
          users,
          percentage: totalUsers > 0 ? Math.round((users / totalUsers) * 100) : 0,
        }))
        .sort((a, b) => b.users - a.users);

      return {
        period: 'realtime',
        activeUsers: totalUsers,
        pageViews: Math.round(totalUsers * 1.5),
        sessions: totalUsers,
        totalCountries: countries.length,
        totalCities: cities.length,
        countries,
        cities,
      };
    } else {
      // 2. Standart Tarih Aralıklı Rapor (Bugün, 7 Gün, 30 Gün)
      let startDate = 'today';
      if (period === '7d') startDate = '7daysAgo';
      if (period === '30d') startDate = '30daysAgo';

      const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate, endDate: 'today' }],
          metrics: [
            { name: 'activeUsers' },
            { name: 'screenPageViews' },
            { name: 'sessions' },
          ],
          dimensions: [{ name: 'country' }, { name: 'city' }],
        }),
      });

      if (!res.ok) {
        console.warn(`[GA4 REPORT ERROR] HTTP ${res.status}: ${await res.text()}`);
        return null;
      }

      const data = (await res.json()) as any;
      const rows = data.rows || [];

      let totalUsers = 0;
      let totalPageViews = 0;
      let totalSessions = 0;

      const countryMap = new Map<string, number>();
      const cityMap = new Map<string, number>();

      for (const row of rows) {
        const country = row.dimensionValues?.[0]?.value || 'Diğer';
        const city = row.dimensionValues?.[1]?.value || 'Bilinmiyor';
        const users = parseInt(row.metricValues?.[0]?.value || '0', 10);
        const pviews = parseInt(row.metricValues?.[1]?.value || '0', 10);
        const sess = parseInt(row.metricValues?.[2]?.value || '0', 10);

        totalUsers += users;
        totalPageViews += pviews;
        totalSessions += sess;

        countryMap.set(country, (countryMap.get(country) || 0) + users);
        cityMap.set(`${city} (${country})`, (cityMap.get(`${city} (${country})`) || 0) + users);
      }

      const countries: AnalyticsBreakdownItem[] = Array.from(countryMap.entries())
        .map(([name, users]) => ({
          name,
          users,
          percentage: totalUsers > 0 ? Math.round((users / totalUsers) * 100) : 0,
        }))
        .sort((a, b) => b.users - a.users);

      const cities: AnalyticsBreakdownItem[] = Array.from(cityMap.entries())
        .map(([name, users]) => ({
          name,
          users,
          percentage: totalUsers > 0 ? Math.round((users / totalUsers) * 100) : 0,
        }))
        .sort((a, b) => b.users - a.users);

      return {
        period,
        activeUsers: totalUsers,
        pageViews: totalPageViews,
        sessions: totalSessions,
        totalCountries: countries.length,
        totalCities: cities.length,
        countries,
        cities,
      };
    }
  } catch (err: any) {
    console.error('[GA4 FETCH EXCEPTION]', err.message);
    return null;
  }
}
