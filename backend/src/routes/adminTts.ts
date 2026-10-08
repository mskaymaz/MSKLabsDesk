/**
 * MSKLabsDesk — Admin TTS & Audio Management API (API-TTS-001)
 * Stage 2: Server-side TTS + Asynchronous Production Infrastructure
 *
 * Routes:
 * - POST /api/v1/admin/tts/generate
 * - GET  /api/v1/admin/tts/status/:postId
 * - POST /api/v1/admin/tts/approve
 * - POST /api/v1/admin/tts/unpublish
 * - POST /api/v1/admin/tts/regenerate
 */

import { AuthEnv, verifyAuthToken } from '../utils/auth';

export interface TTSEnv extends AuthEnv {
  DB: D1Database;
  MEDIA: R2Bucket;
  TTS_QUEUE?: { send: (msg: any) => Promise<void> };
  TTS_API_KEY?: string;
  TTS_PROVIDER?: string;
  TTS_MODEL?: string;
}

const ALLOWED_LANGUAGES = ['TR', 'EN', 'AR'];
const MAX_TTS_GENERATE_PER_MIN = 10;

/**
 * TODO (Stage 3 - Public Audio Delivery Note):
 * Mobile HTTP Range streaming (Accept-Ranges: bytes, 206 Partial Content, audio/mpeg)
 * will be served by a separate public audio delivery route (/api/v1/public/audio/:audioId)
 * once server-side TTS provider & Cloudflare Queue generation is completed.
 */

/**
 * 10 TTS Generation / Minute Rate Limit Denetimi
 */
async function checkTTSRateLimit(env: TTSEnv, identifier: string): Promise<boolean> {
  const windowSec = 60;
  const maxReqs = MAX_TTS_GENERATE_PER_MIN;
  const now = Math.floor(Date.now() / 1000);

  try {
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        reset_at INTEGER NOT NULL
      )
    `).run().catch(() => {});

    const rateKey = `tts_rl_${identifier}`;
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
 * DB Tablo ve Audit Log Hazırlığı
 */
async function ensureTables(env: TTSEnv): Promise<void> {
  await env.DB.prepare(`
    CREATE TABLE IF NOT EXISTS post_audio_assets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      language TEXT NOT NULL CHECK(language IN ('TR', 'EN', 'AR')),
      article_version INTEGER NOT NULL DEFAULT 1,
      audio_version INTEGER NOT NULL DEFAULT 1,
      provider TEXT NOT NULL DEFAULT 'DEFAULT',
      model TEXT NOT NULL DEFAULT 'DEFAULT',
      r2_object_key TEXT NOT NULL UNIQUE,
      file_size INTEGER NOT NULL DEFAULT 0,
      duration_seconds INTEGER NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'DRAFT' CHECK(status IN ('GENERATING', 'DRAFT', 'APPROVED', 'FAILED', 'STALE')),
      validation_result_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, language, audio_version)
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
 * Makale Revizyon Numarası Sorgulama
 */
async function getArticleVersion(env: TTSEnv, postId: number): Promise<number> {
  try {
    const revRow = await env.DB.prepare(
      'SELECT MAX(revision_number) as cur_rev FROM post_revisions WHERE post_id = ?'
    ).bind(postId).first<{ cur_rev: number }>();
    return revRow?.cur_rev || 1;
  } catch {
    return 1;
  }
}

/**
 * POST /api/v1/admin/tts/generate — TTS Ses Üretimi Tetikleme
 */
export async function handleAdminTTSGenerate(request: Request, env: TTSEnv): Promise<Response> {
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

    // 2. X-Idempotency-Key Zorunluluk Kontrolü
    const idempotencyKey = request.headers.get('X-Idempotency-Key') || request.headers.get('x-idempotency-key');
    if (!idempotencyKey || !idempotencyKey.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'X-Idempotency-Key başlığı zorunludur.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 3. Rate Limit Kontrolü (10 req/min)
    const clientIp = request.headers.get('cf-connecting-ip') || admin.email || 'global';
    const rateLimitOk = await checkTTSRateLimit(env, clientIp);
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ success: false, error: 'Dakikada maksimum 10 TTS üretimi sınırı aşıldı.' }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 4. Girdi Doğrulaması
    const body = await request.json() as { postId?: number; language?: string; provider?: string };
    const postId = body.postId;
    const language = body.language?.toUpperCase();
    const provider = body.provider || env.TTS_PROVIDER || 'DEFAULT';
    const model = env.TTS_MODEL || 'DEFAULT';

    if (!postId || typeof postId !== 'number' || postId <= 0 || !Number.isInteger(postId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'postId pozitif bir tamsayı olmalıdır.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    if (!language || !ALLOWED_LANGUAGES.includes(language)) {
      return new Response(
        JSON.stringify({ success: false, error: "language parametresi 'TR', 'EN' veya 'AR' olmalıdır." }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await ensureTables(env);

    // 5. Aktif Üretim Kontrolü (409 Conflict)
    const activeGen = await env.DB.prepare(
      "SELECT id FROM post_audio_assets WHERE post_id = ? AND language = ? AND status = 'GENERATING'"
    ).bind(postId, language).first();

    if (activeGen) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bu makale ve dil için devam eden aktif ses üretimi zaten var.' }),
        { status: 409, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 6. Revizyon & Versiyon Senkronizasyonu
    const articleVersion = await getArticleVersion(env, postId);
    const audioVersion = articleVersion;

    // Tahmin Edilemez R2 Object Key (/audio/posts/[uuid].mp3)
    const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const r2Key = `audio/posts/${uuid}.mp3`;

    let initialStatus = 'GENERATING';
    let validationNote = 'TTS generation requested.';

    // Queue / Provider Varlık Kontrolü
    const hasQueue = !!env.TTS_QUEUE;
    const hasApiKey = !!env.TTS_API_KEY;

    if (!hasQueue || !hasApiKey) {
      validationNote = 'TTS Provider API Key (TTS_API_KEY) or Queue Binding (TTS_QUEUE) is missing in environment.';
    }

    const validationResult = JSON.stringify({
      status: hasQueue && hasApiKey ? 'QUEUED' : 'PENDING_INTEGRATION',
      note: validationNote,
      hasQueue,
      hasApiKey
    });

    const res = await env.DB.prepare(`
      INSERT INTO post_audio_assets (
        post_id, language, article_version, audio_version, provider, model,
        r2_object_key, file_size, duration_seconds, status, validation_result_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, CURRENT_TIMESTAMP)
    `).bind(postId, language, articleVersion, audioVersion, provider, model, r2Key, initialStatus, validationResult).run();

    const audioId = res.meta?.last_row_id || 1;

    // Producer Queue Gönderim Denemesi
    if (env.TTS_QUEUE && typeof env.TTS_QUEUE.send === 'function') {
      try {
        await env.TTS_QUEUE.send({ audioId, postId, language, r2Key, articleVersion, audioVersion, provider });
      } catch (qErr: any) {
        // Queue üretici hatasında DB kaydını FAILED olarak güncelle
        await env.DB.prepare(
          "UPDATE post_audio_assets SET status = 'FAILED', validation_result_json = ? WHERE id = ?"
        ).bind(JSON.stringify({ status: 'FAILED', error: 'Queue producer send failed.' }), audioId).run().catch(() => {});

        return new Response(
          JSON.stringify({ success: false, error: 'TTS asenkron kuyruk emisyon hatası.' }),
          { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
        );
      }
    }

    // Audit Log: TTS_GENERATED
    await env.DB.prepare(`
      INSERT INTO audit_logs (action, actor, details)
      VALUES (?, ?, ?)
    `).bind('TTS_GENERATED', admin.email || admin.name || 'ADMIN', JSON.stringify({ audioId, postId, language, status: 'GENERATING' })).run().catch(() => {});

    // 7. Başarılı HTTP 202 Response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          audioId,
          status: 'GENERATING',
          articleVersion,
          audioVersion,
          r2Key,
          note: validationNote
        }
      }),
      { status: 202, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );

  } catch (err: any) {
    console.error('[TTS GENERATE ERROR]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'TTS isteği işlenirken sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * POST /api/v1/admin/tts/regenerate — Yeniden TTS Ses Üretimi
 */
export async function handleAdminTTSRegenerate(request: Request, env: TTSEnv): Promise<Response> {
  try {
    // 1. Yetkilendirme Kontrolü
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

    // 2. X-Idempotency-Key Kontrolü
    const idempotencyKey = request.headers.get('X-Idempotency-Key') || request.headers.get('x-idempotency-key');
    if (!idempotencyKey || !idempotencyKey.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: 'X-Idempotency-Key başlığı zorunludur.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 3. Rate Limit Kontrolü (10 req/min)
    const clientIp = request.headers.get('cf-connecting-ip') || admin.email || 'global';
    const rateLimitOk = await checkTTSRateLimit(env, clientIp);
    if (!rateLimitOk) {
      return new Response(
        JSON.stringify({ success: false, error: 'Dakikada maksimum 10 TTS üretimi sınırı aşıldı.' }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 4. Girdi Doğrulaması
    const body = await request.json() as { postId?: number; language?: string; provider?: string };
    const postId = body.postId;
    const language = body.language?.toUpperCase();
    const provider = body.provider || env.TTS_PROVIDER || 'DEFAULT';
    const model = env.TTS_MODEL || 'DEFAULT';

    if (!postId || typeof postId !== 'number' || postId <= 0 || !Number.isInteger(postId)) {
      return new Response(
        JSON.stringify({ success: false, error: 'postId pozitif bir tamsayı olmalıdır.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    if (!language || !ALLOWED_LANGUAGES.includes(language)) {
      return new Response(
        JSON.stringify({ success: false, error: "language parametresi 'TR', 'EN' veya 'AR' olmalıdır." }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await ensureTables(env);

    // 5. Eski Sürümleri STALE Yap
    await env.DB.prepare(
      "UPDATE post_audio_assets SET status = 'STALE', updated_at = CURRENT_TIMESTAMP WHERE post_id = ? AND language = ?"
    ).bind(postId, language).run();

    // 6. Audio Version Hesapla ve Kaydet
    const articleVersion = await getArticleVersion(env, postId);
    const lastAsset = await env.DB.prepare(
      'SELECT MAX(audio_version) as max_v FROM post_audio_assets WHERE post_id = ? AND language = ?'
    ).bind(postId, language).first<{ max_v: number }>();

    const nextAudioVersion = Math.max((lastAsset?.max_v || 0) + 1, articleVersion);
    const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const r2Key = `audio/posts/${uuid}.mp3`;

    const validationResult = JSON.stringify({
      status: 'REGENERATE_PENDING',
      note: 'TTS Regenerate requested. Provider & Queue integration pending Stage 2 credentials.'
    });

    const res = await env.DB.prepare(`
      INSERT INTO post_audio_assets (
        post_id, language, article_version, audio_version, provider, model,
        r2_object_key, file_size, duration_seconds, status, validation_result_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, 'GENERATING', ?, CURRENT_TIMESTAMP)
    `).bind(postId, language, articleVersion, nextAudioVersion, provider, model, r2Key, validationResult).run();

    const audioId = res.meta?.last_row_id || 1;

    // Audit Log: TTS_STALE_MARKED ve TTS_GENERATED
    await env.DB.prepare(`
      INSERT INTO audit_logs (action, actor, details)
      VALUES (?, ?, ?)
    `).bind('TTS_STALE_MARKED', admin.email || admin.name || 'ADMIN', JSON.stringify({ postId, language, nextAudioVersion })).run().catch(() => {});

    await env.DB.prepare(`
      INSERT INTO audit_logs (action, actor, details)
      VALUES (?, ?, ?)
    `).bind('TTS_GENERATED', admin.email || admin.name || 'ADMIN', JSON.stringify({ audioId, postId, language, status: 'GENERATING' })).run().catch(() => {});

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          audioId,
          postId,
          language,
          status: 'GENERATING',
          articleVersion,
          audioVersion: nextAudioVersion,
          r2Key,
          note: 'TTS regenerate request accepted.'
        }
      }),
      { status: 202, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );

  } catch (err: any) {
    console.error('[TTS REGENERATE ERROR]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'TTS yenileme isteği işlenirken sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * GET /api/v1/admin/tts/status/:postId — Ses Durumu Sorgulama
 */
export async function handleAdminTTSStatus(postIdParam: string, request: Request, env: TTSEnv): Promise<Response> {
  try {
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

    const postId = parseInt(postIdParam, 10);
    if (isNaN(postId) || postId <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Geçersiz postId parametresi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await ensureTables(env);

    const { results } = await env.DB.prepare(
      'SELECT * FROM post_audio_assets WHERE post_id = ? ORDER BY audio_version DESC'
    ).bind(postId).all();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          postId,
          audioAssets: results || []
        }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );

  } catch (err: any) {
    console.error('[TTS STATUS ERROR]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'TTS durum sorgusu çalışırken sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * POST /api/v1/admin/tts/approve — Ses Onaylama
 */
export async function handleAdminTTSApprove(request: Request, env: TTSEnv): Promise<Response> {
  try {
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

    const body = await request.json() as { audioId?: number };
    const audioId = body.audioId;

    if (!audioId || typeof audioId !== 'number' || audioId <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'audioId pozitif tamsayı olmalıdır.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await ensureTables(env);

    const asset = await env.DB.prepare('SELECT id, post_id, language FROM post_audio_assets WHERE id = ?').bind(audioId).first<{ id: number; post_id: number; language: string }>();
    if (!asset) {
      return new Response(
        JSON.stringify({ success: false, error: 'Ses kaydı bulunamadı.' }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await env.DB.prepare(
      "UPDATE post_audio_assets SET status = 'APPROVED', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(audioId).run();

    // Audit Log: TTS_APPROVED
    await env.DB.prepare(`
      INSERT INTO audit_logs (action, actor, details)
      VALUES (?, ?, ?)
    `).bind('TTS_APPROVED', admin.email || admin.name || 'ADMIN', JSON.stringify({ audioId, postId: asset.post_id, language: asset.language })).run().catch(() => {});

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Ses kaydı başarıyla onaylandı.',
        data: { audioId, status: 'APPROVED' }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );

  } catch (err: any) {
    console.error('[TTS APPROVE ERROR]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Ses onaylanırken sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * POST /api/v1/admin/tts/unpublish — Ses Yayından Kaldırma
 */
export async function handleAdminTTSUnpublish(request: Request, env: TTSEnv): Promise<Response> {
  try {
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

    const body = await request.json() as { audioId?: number };
    const audioId = body.audioId;

    if (!audioId || typeof audioId !== 'number' || audioId <= 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'audioId pozitif tamsayı olmalıdır.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await ensureTables(env);

    const asset = await env.DB.prepare('SELECT id, post_id, language FROM post_audio_assets WHERE id = ?').bind(audioId).first<{ id: number; post_id: number; language: string }>();
    if (!asset) {
      return new Response(
        JSON.stringify({ success: false, error: 'Ses kaydı bulunamadı.' }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await env.DB.prepare(
      "UPDATE post_audio_assets SET status = 'DRAFT', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(audioId).run();

    // Audit Log: TTS_UNPUBLISHED
    await env.DB.prepare(`
      INSERT INTO audit_logs (action, actor, details)
      VALUES (?, ?, ?)
    `).bind('TTS_UNPUBLISHED', admin.email || admin.name || 'ADMIN', JSON.stringify({ audioId, postId: asset.post_id, language: asset.language })).run().catch(() => {});

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Ses kaydı yayından kaldırıldı (DRAFT moduna çekildi).',
        data: { audioId, status: 'DRAFT' }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );

  } catch (err: any) {
    console.error('[TTS UNPUBLISH ERROR]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Ses yayından kaldırılırken sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * Hata İşleyici: Provider / Queue Üretim Başarısızlığı
 */
export async function handleTTSProductionFailure(env: TTSEnv, audioId: number, errorMessage: string): Promise<void> {
  try {
    await ensureTables(env);
    const safeError = JSON.stringify({ status: 'FAILED', error: errorMessage.replace(/key=[^&]+/gi, 'key=***') });
    await env.DB.prepare(
      "UPDATE post_audio_assets SET status = 'FAILED', validation_result_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(safeError, audioId).run();
  } catch (err) {
    console.error('[TTS PRODUCTION FAILURE HANDLER ERROR]', err);
  }
}

/**
 * GET /api/v1/public/audio/:postId/:language or GET /api/v1/public/audio/:audioId
 * Public MP3 Delivery Handler with Mobile HTTP Range Support (206 Partial Content)
 */
export async function handlePublicAudioDelivery(
  request: Request,
  env: TTSEnv,
  params: { postId?: number; language?: string; audioId?: number }
): Promise<Response> {
  try {
    await ensureTables(env);

    let asset: { id: number; post_id: number; language: string; r2_object_key: string; status: string; file_size: number } | null = null;

    if (params.audioId && params.audioId > 0) {
      asset = await env.DB.prepare(
        "SELECT id, post_id, language, r2_object_key, status, file_size FROM post_audio_assets WHERE id = ? AND status = 'APPROVED'"
      ).bind(params.audioId).first();
    } else if (params.postId && params.postId > 0 && params.language) {
      asset = await env.DB.prepare(
        "SELECT id, post_id, language, r2_object_key, status, file_size FROM post_audio_assets WHERE post_id = ? AND language = ? AND status = 'APPROVED' ORDER BY audio_version DESC"
      ).bind(params.postId, params.language.toUpperCase()).first();
    }

    // STALE, DRAFT, FAILED veya bulunamayan kayıtlar public olarak servis edilmez (404)
    if (!asset || asset.status !== 'APPROVED') {
      return new Response(
        JSON.stringify({ success: false, error: 'Onaylanmış kamuya açık ses kaydı bulunamadı.' }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const r2Key = asset.r2_object_key;

    // R2 Object Fetch (Path Traversal Engellenmiş - Yalnızca DB'deki r2_object_key Kullanılır)
    const r2Object = await env.MEDIA.get(r2Key);
    if (!r2Object) {
      return new Response(
        JSON.stringify({ success: false, error: 'Ses dosyası nesne depolamada bulunamadı.' }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    const arrayBuffer = await r2Object.arrayBuffer();
    const totalSize = arrayBuffer.byteLength;

    const baseHeaders = {
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000, immutable'
    };

    // Range Header Handling
    const rangeHeader = request.headers.get('range') || request.headers.get('Range');

    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const parts = rangeHeader.replace('bytes=', '').split('-');
      const start = parseInt(parts[0], 10);
      let end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (isNaN(start) || start < 0 || start >= totalSize || (!isNaN(end) && end < start)) {
        return new Response(null, {
          status: 416,
          headers: {
            ...baseHeaders,
            'Content-Range': `bytes */${totalSize}`
          }
        });
      }

      if (isNaN(end) || end >= totalSize) {
        end = totalSize - 1;
      }

      const chunkSize = end - start + 1;
      const chunk = arrayBuffer.slice(start, end + 1);

      return new Response(chunk, {
        status: 206,
        headers: {
          ...baseHeaders,
          'Content-Range': `bytes ${start}-${end}/${totalSize}`,
          'Content-Length': chunkSize.toString()
        }
      });
    }

    // Standard HTTP 200 Full Response
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        ...baseHeaders,
        'Content-Length': totalSize.toString()
      }
    });

  } catch (err: any) {
    console.error('[PUBLIC AUDIO DELIVERY ERROR]', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Public audio akışında sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
