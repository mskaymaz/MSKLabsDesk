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

import { verifyAuthToken } from '../utils/auth';
import { TTSEnv } from '../utils/ttsShared';

export type { TTSEnv } from '../utils/ttsShared';
export { handleTTSProductionFailure } from '../utils/ttsShared';
export { handleAdminTTSGenerate, handleAdminTTSRegenerate } from './adminTtsGenerate';
export { handlePublicAudioDelivery } from './publicAudio';

/**
 * GET /api/v1/admin/tts/status/:postId — Makale TTS Durum Sorgulama
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

    const { results } = await env.DB.prepare(
      'SELECT * FROM post_audio_assets WHERE post_id = ? ORDER BY language ASC, audio_version DESC'
    ).bind(postId).all();

    const assets = (results || []).map((row: any) => {
      let validation = null;
      try {
        validation = row.validation_result_json ? JSON.parse(row.validation_result_json) : null;
      } catch {
        validation = { raw: row.validation_result_json };
      }

      return {
        id: row.id,
        postId: row.post_id,
        language: row.language,
        articleVersion: row.article_version,
        audioVersion: row.audio_version,
        provider: row.provider,
        model: row.model,
        r2Key: row.r2_object_key,
        fileSize: row.file_size,
        durationSeconds: row.duration_seconds,
        status: row.status,
        validation,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    });

    return new Response(
      JSON.stringify({ success: true, postId, assets }),
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

    const asset = await env.DB.prepare('SELECT id, post_id, language FROM post_audio_assets WHERE id = ?')
      .bind(audioId)
      .first<{ id: number; post_id: number; language: string }>();

    if (!asset) {
      return new Response(
        JSON.stringify({ success: false, error: 'Ses kaydı bulunamadı.' }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await env.DB.prepare(
      "UPDATE post_audio_assets SET status = 'APPROVED', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(audioId).run();

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

    const asset = await env.DB.prepare('SELECT id, post_id, language FROM post_audio_assets WHERE id = ?')
      .bind(audioId)
      .first<{ id: number; post_id: number; language: string }>();

    if (!asset) {
      return new Response(
        JSON.stringify({ success: false, error: 'Ses kaydı bulunamadı.' }),
        { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    await env.DB.prepare(
      "UPDATE post_audio_assets SET status = 'DRAFT', updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(audioId).run();

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
