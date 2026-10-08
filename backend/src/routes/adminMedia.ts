/**
 * MSKLabsDesk — Admin Media Management API (API-010)
 * POST /api/v1/admin/media/upload — Medya Yükleme
 * DELETE /api/v1/admin/media/* — Medya Silme
 */

import { AuthEnv, verifyAuthToken } from '../utils/auth';

export interface MediaEnv extends AuthEnv {
  DB: D1Database;
  MEDIA: R2Bucket;
  CDN_BASE_URL?: string;
}

const ALLOWED_MIME_TYPES = [
  'image/webp',
  'image/png',
  'image/jpeg',
  'image/svg+xml'
];

const FORBIDDEN_EXTENSIONS = ['.exe', '.php', '.js', '.sh', '.bat', '.cmd', '.py', '.pl', '.phar', '.phtml'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Magic Bytes / Dosya İmzası Doğrulaması
 */
export function getValidatedMimeType(buffer: Uint8Array): string | null {
  if (buffer.length < 12) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
    buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A
  ) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return 'image/jpeg';
  }

  // WEBP: 'RIFF' .... 'WEBP'
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return 'image/webp';
  }

  // SVG: Metin içerisinde <svg etiket doğrulaması (ve script injection koruması)
  const textHead = new TextDecoder().decode(buffer.subarray(0, 1024)).toLowerCase();
  if (textHead.includes('<svg')) {
    if (textHead.includes('<script') || textHead.includes('javascript:')) {
      return null;
    }
    return 'image/svg+xml';
  }

  return null;
}

/**
 * 20 req/min Rate Limit Denetimi
 */
async function checkUploadRateLimit(env: MediaEnv, identifier: string): Promise<boolean> {
  const windowSec = 60;
  const maxReqs = 20;
  const now = Math.floor(Date.now() / 1000);

  try {
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        reset_at INTEGER NOT NULL
      )
    `).run().catch(() => {});

    const rateKey = `upload_rl_${identifier}`;
    const record = await env.DB.prepare('SELECT count, reset_at FROM rate_limits WHERE key = ?').bind(rateKey).first<{ count: number; reset_at: number }>();

    if (!record || record.reset_at < now) {
      await env.DB.prepare('INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)').bind(rateKey, now + windowSec).run();
      return true;
    }

    if (record.count >= maxReqs) {
      return false;
    }

    await env.DB.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?').bind(rateKey).run();
    return true;
  } catch {
    return true;
  }
}

/**
 * Tablo ve Audit Hazırlığı
 */
async function ensureTables(env: MediaEnv): Promise<void> {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS media_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      r2_key TEXT NOT NULL UNIQUE,
      mime_type TEXT NOT NULL,
      size_bytes INTEGER NOT NULL,
      public_url TEXT NOT NULL,
      sha256 TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run().catch(() => {});

  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      actor TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run().catch(() => {});
}

/**
 * POST /api/v1/admin/media/upload — Medya Yükleme Handler
 */
export async function handleAdminMediaUpload(request: Request, env: MediaEnv): Promise<Response> {
  try {
    // 1. Yetkilendirme Kontrolü (401 / 403)
    const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Yetkisiz erişim.' }),
        { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    if (admin.role && admin.role === 'GUEST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Erişim engellendi.' }),
        { status: 403, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 2. Upload Rate Limit Kontrolü (20 req/min)
    const clientIp = request.headers.get('cf-connecting-ip') || admin.email || 'global';
    const rateLimitOk = await checkUploadRateLimit(env, clientIp);
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ success: false, error: 'Dakikada maksimum 20 medya yükleme sınırı aşıldı.' }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 3. Content-Type multipart/form-data Kontrolü
    const contentType = request.headers.get('content-type') || '';
    if (contentType && !contentType.includes('multipart/form-data') && !contentType.includes('form-data')) {
      return new Response(
        JSON.stringify({ success: false, error: 'İstek formatı multipart/form-data olmalıdır.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 4. Form verilerini ayrıştır
    const formData = await request.formData();
    const rawFile = formData.get('file');
    const altText = formData.get('altText')?.toString() || '';

    if (!rawFile || typeof rawFile === 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Yüklenecek dosya ("file") zorunludur.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const file = rawFile as File;

    // 5. Zararlı Uzantı Engelleme (.exe, .php vb.)
    const lowerName = file.name.toLowerCase();
    if (FORBIDDEN_EXTENSIONS.some(ext => lowerName.endsWith(ext))) {
      return new Response(
        JSON.stringify({ success: false, error: 'Güvenlik nedeni ile bu dosya uzantısı reddedildi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 6. Dosya Boyutu Sınırı Denetimi (≤ 5 MB)
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ success: false, error: 'Dosya boyutu 5 MB sınırını aşamaz.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 7. Buffer Okuma ve Magic Bytes Doğrulaması
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const validatedMime = getValidatedMimeType(buffer);

    if (!validatedMime || !ALLOWED_MIME_TYPES.includes(validatedMime)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Geçersiz veya desteklenmeyen dosya türü/içeriği.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await ensureTables(env);

    // 8. SHA-256 Hash Hesaplama ve Çakışma Denetimi
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256Hex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const existing = await env.DB.prepare(
      'SELECT r2_key, public_url, size_bytes, mime_type FROM media_assets WHERE sha256 = ?'
    ).bind(sha256Hex).first<{ r2_key: string; public_url: string; size_bytes: number; mime_type: string }>();

    if (existing) {
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            key: existing.r2_key,
            url: existing.public_url,
            size: existing.size_bytes,
            mimeType: existing.mime_type,
          }
        }),
        { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 9. Benzersiz R2 Key Üretimi (timestamp + random slug)
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    const randomSlug = Math.random().toString(36).substring(2, 8);
    const ext = validatedMime === 'image/webp' ? 'webp' : validatedMime === 'image/png' ? 'png' : validatedMime === 'image/jpeg' ? 'jpg' : 'svg';
    const key = `blog/${year}/${timestamp}_${randomSlug}.${ext}`;

    const cdnBase = env.CDN_BASE_URL || 'https://cdn.msklabs.com';
    const publicUrl = `${cdnBase}/${key}`;

    // 10. R2 Yükleme ve D1 Kaydı (Güvenli Rollback)
    await env.MEDIA.put(key, arrayBuffer, {
      httpMetadata: { contentType: validatedMime },
      customMetadata: { altText, sha256: sha256Hex }
    });

    try {
      await env.DB.prepare(`
        INSERT INTO media_assets (filename, r2_key, mime_type, size_bytes, public_url, sha256, created_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(file.name, key, validatedMime, file.size, publicUrl, sha256Hex).run();
    } catch (dbErr) {
      await env.MEDIA.delete(key).catch(r2Err => console.error('[R2 ROLLBACK ERROR]', r2Err));
      throw dbErr;
    }

    // 11. MEDIA_UPLOADED Audit Log
    await env.DB.prepare(`
      INSERT INTO audit_logs (action, actor, details)
      VALUES (?, ?, ?)
    `).bind('MEDIA_UPLOADED', admin.email || admin.name || 'ADMIN', JSON.stringify({ key, size: file.size, mimeType: validatedMime })).run().catch(() => {});

    // 12. Başarılı Yanıt (201 Created)
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          key,
          url: publicUrl,
          size: file.size,
          mimeType: validatedMime,
        }
      }),
      { status: 201, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );

  } catch (err: any) {
    console.error('[MEDIA UPLOAD ERROR]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Medya yüklenirken sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * DELETE /api/v1/admin/media/* — Medya Silme Handler
 */
export async function handleAdminMediaDelete(keyParam: string, request: Request, env: MediaEnv): Promise<Response> {
  try {
    // 1. Yetkilendirme Kontrolü (401 / 403)
    const admin = await verifyAuthToken(request, env.ADMIN_JWT_SECRET);
    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, error: 'Yetkisiz erişim.' }),
        { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    if (admin.role && admin.role === 'GUEST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Erişim engellendi.' }),
        { status: 403, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const key = decodeURIComponent(keyParam);
    if (!key || key.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, error: 'Silinecek medya anahtarı ("key") zorunludur.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await ensureTables(env);

    // 2. D1 Metadata Kontrolü
    const existing = await env.DB.prepare('SELECT r2_key FROM media_assets WHERE r2_key = ?').bind(key).first();
    if (!existing) {
      return new Response(
        JSON.stringify({ success: false, error: 'Medya bulunamadı.' }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 3. R2 Nesne Silme
    await env.MEDIA.delete(key);

    // 4. D1 Metadata Silme
    await env.DB.prepare('DELETE FROM media_assets WHERE r2_key = ?').bind(key).run();

    // 5. MEDIA_DELETED Audit Log Kaydı
    await env.DB.prepare(`
      INSERT INTO audit_logs (action, actor, details)
      VALUES (?, ?, ?)
    `).bind('MEDIA_DELETED', admin.email || admin.name || 'ADMIN', JSON.stringify({ key })).run().catch(() => {});

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Medya ve metadata kaydı başarıyla silindi.',
        data: { key }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );

  } catch (err: any) {
    console.error('[MEDIA DELETE ERROR]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Medya silinirken sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
