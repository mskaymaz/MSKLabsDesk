/**
 * MSKLabsDesk — Public Audio Delivery Route (HTTP Range / 206 Partial Content)
 */

import { TTSEnv } from '../utils/ttsShared';

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
