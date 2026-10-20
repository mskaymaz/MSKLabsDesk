/**
 * MSKLabsDesk — Admin TTS Üretim & Yeniden Üretim Rotaları
 */

import { verifyAuthToken } from '../utils/auth';
import {
  TTSEnv,
  ALLOWED_LANGUAGES,
  checkTTSRateLimit,
  getArticleVersion,
} from '../utils/ttsShared';

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

    if (!language || !ALLOWED_LANGUAGES.includes(language as any)) {
      return new Response(
        JSON.stringify({ success: false, error: "language parametresi 'TR', 'EN' veya 'AR' olmalıdır." }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

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

    const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const r2Key = `audio/posts/${uuid}.mp3`;

    let initialStatus = 'GENERATING';
    let validationNote = 'TTS generation requested.';

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
      } catch {
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

    if (!language || !ALLOWED_LANGUAGES.includes(language as any)) {
      return new Response(
        JSON.stringify({ success: false, error: "language parametresi 'TR', 'EN' veya 'AR' olmalıdır." }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

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
      JSON.stringify({ success: false, error: 'TTS yeniden üretim isteği işlenirken sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
