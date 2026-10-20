/**
 * MSKLabsDesk — TTS & Audio Paylaşılan Tipler ve Yardımcı Fonksiyonlar
 */

import { AuthEnv } from './auth';

export interface TTSEnv extends AuthEnv {
  DB: D1Database;
  MEDIA: R2Bucket;
  TTS_QUEUE?: { send: (msg: any) => Promise<void> };
  TTS_API_KEY?: string;
  TTS_PROVIDER?: string;
  TTS_MODEL?: string;
}

export const ALLOWED_LANGUAGES = ['TR', 'EN', 'AR'] as const;
export const MAX_TTS_GENERATE_PER_MIN = 10;

/**
 * 10 TTS Generation / Minute Rate Limit Denetimi
 */
export async function checkTTSRateLimit(env: TTSEnv, identifier: string): Promise<boolean> {
  const windowSec = 60;
  const maxReqs = MAX_TTS_GENERATE_PER_MIN;
  const now = Math.floor(Date.now() / 1000);

  try {
    const rateKey = `tts_rl_${identifier}`;
    const record = await env.DB.prepare('SELECT count, reset_at FROM rate_limits WHERE key = ?')
      .bind(rateKey)
      .first<{ count: number; reset_at: number }>();

    if (!record || record.reset_at < now) {
      await env.DB.prepare('INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)')
        .bind(rateKey, now + windowSec)
        .run();
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
 * Makale Revizyon Numarası Sorgulama
 */
export async function getArticleVersion(env: TTSEnv, postId: number): Promise<number> {
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
 * Hata İşleyici: Provider / Queue Üretim Başarısızlığı
 */
export async function handleTTSProductionFailure(env: TTSEnv, audioId: number, errorMessage: string): Promise<void> {
  try {
    const safeError = JSON.stringify({ status: 'FAILED', error: errorMessage.replace(/key=[^&]+/gi, 'key=***') });
    await env.DB.prepare(
      "UPDATE post_audio_assets SET status = 'FAILED', validation_result_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(safeError, audioId).run();
  } catch (err) {
    console.error('[TTS PRODUCTION FAILURE HANDLER ERROR]', err);
  }
}
