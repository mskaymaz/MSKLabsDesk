/**
 * MSKLabsDesk — API-TTS-001 Stage 2 Admin TTS API Entegrasyon Test Modülü
 */

import {
  handleAdminTTSGenerate,
  handleAdminTTSRegenerate,
  handleAdminTTSStatus,
  handleAdminTTSApprove,
  handleAdminTTSUnpublish,
  handleTTSProductionFailure,
  handlePublicAudioDelivery
} from '../src/routes/adminTts';
import { createSessionToken } from '../src/utils/auth';

class MockD1PreparedStatement {
  constructor(private sql: string, private params: any[], private db: MockD1Database) {}

  bind(...params: any[]) {
    return new MockD1PreparedStatement(this.sql, params, this.db);
  }

  async first<T = any>(): Promise<T | null> {
    const res = await this.all<T>();
    return res.results[0] || null;
  }

  async all<T = any>(): Promise<{ results: T[] }> {
    const sql = this.sql.trim();

    if (sql.includes('SELECT count, reset_at FROM rate_limits')) {
      const key = this.params[0];
      const rec = this.db.tables.rate_limits.get(key);
      return { results: rec ? [rec as any] : [] };
    }

    if (sql.includes('SELECT id FROM post_audio_assets WHERE post_id = ? AND language = ? AND status = \'GENERATING\'')) {
      const [postId, lang] = this.params;
      const match = Array.from(this.db.tables.post_audio_assets.values()).find(
        (a: any) => a.post_id === postId && a.language === lang && a.status === 'GENERATING'
      );
      return { results: match ? [match] : [] };
    }

    if (sql.includes('SELECT * FROM post_audio_assets WHERE post_id = ?')) {
      const postId = this.params[0];
      const match = Array.from(this.db.tables.post_audio_assets.values()).filter((a: any) => a.post_id === postId);
      return { results: match };
    }

    if (sql.includes('SELECT id, post_id, language FROM post_audio_assets WHERE id = ?') || sql.includes('SELECT id, post_id, language, r2_object_key, status, file_size FROM post_audio_assets WHERE id = ?')) {
      const id = this.params[0];
      const match = Array.from(this.db.tables.post_audio_assets.values()).find((a: any) => a.id === id);
      return { results: match ? [match] : [] };
    }

    if (sql.includes('SELECT id, post_id, language, r2_object_key, status, file_size FROM post_audio_assets WHERE post_id = ? AND language = ?')) {
      const [postId, lang] = this.params;
      const matches = Array.from(this.db.tables.post_audio_assets.values()).filter(
        (a: any) => a.post_id === postId && a.language === lang && a.status === 'APPROVED'
      );
      return { results: matches };
    }

    if (sql.includes('SELECT MAX(audio_version) as max_v FROM post_audio_assets')) {
      const [postId, lang] = this.params;
      const matches = Array.from(this.db.tables.post_audio_assets.values()).filter((a: any) => a.post_id === postId && a.language === lang);
      const maxV = matches.reduce((max: number, a: any) => Math.max(max, a.audio_version || 0), 0);
      return { results: [{ max_v: maxV }] as any };
    }

    if (sql.includes('SELECT MAX(revision_number) as cur_rev FROM post_revisions')) {
      return { results: [{ cur_rev: 2 }] as any };
    }

    return { results: [] };
  }

  async run(): Promise<{ success: boolean; meta?: any }> {
    const sql = this.sql.trim();

    if (sql.startsWith('CREATE TABLE')) {
      return { success: true };
    }

    if (sql.includes('INSERT OR REPLACE INTO rate_limits')) {
      const [key, count, reset_at] = this.params;
      this.db.tables.rate_limits.set(key, { key, count, reset_at });
      return { success: true };
    }

    if (sql.includes('UPDATE rate_limits SET count = count + 1')) {
      const key = this.params[0];
      const rec = this.db.tables.rate_limits.get(key);
      if (rec) rec.count++;
      return { success: true };
    }

    if (sql.includes('INSERT INTO post_audio_assets')) {
      const id = this.db.tables.post_audio_assets.size + 1;
      const [post_id, language, article_version, audio_version, provider, model, r2_object_key, initialStatus, validation_result_json] = this.params;
      this.db.tables.post_audio_assets.set(id, {
        id, post_id, language, article_version, audio_version, provider, model, r2_object_key,
        status: initialStatus || 'GENERATING', validation_result_json
      });
      return { success: true, meta: { last_row_id: id } };
    }

    if (sql.includes("UPDATE post_audio_assets SET status = 'STALE'")) {
      const [postId, lang] = this.params;
      for (const asset of this.db.tables.post_audio_assets.values()) {
        if (asset.post_id === postId && asset.language === lang) {
          asset.status = 'STALE';
        }
      }
      return { success: true };
    }

    if (sql.includes("UPDATE post_audio_assets SET status = 'FAILED'")) {
      const [valJson, id] = this.params;
      const asset = this.db.tables.post_audio_assets.get(id);
      if (asset) {
        asset.status = 'FAILED';
        asset.validation_result_json = valJson;
      }
      return { success: true };
    }

    if (sql.includes("UPDATE post_audio_assets SET status = 'APPROVED'")) {
      const id = this.params[0];
      const asset = this.db.tables.post_audio_assets.get(id);
      if (asset) asset.status = 'APPROVED';
      return { success: true };
    }

    if (sql.includes("UPDATE post_audio_assets SET status = 'DRAFT'")) {
      const id = this.params[0];
      const asset = this.db.tables.post_audio_assets.get(id);
      if (asset) asset.status = 'DRAFT';
      return { success: true };
    }

    if (sql.includes('INSERT INTO audit_logs')) {
      const [action, actor, details] = this.params;
      this.db.tables.audit_logs.push({ action, actor, details });
      return { success: true };
    }

    return { success: true };
  }
}

class MockD1Database {
  tables = {
    post_audio_assets: new Map<number, any>(),
    rate_limits: new Map<string, any>(),
    audit_logs: [] as any[]
  };

  prepare(sql: string) {
    return new MockD1PreparedStatement(sql, [], this);
  }
}

class MockR2Bucket {
  objects = new Map<string, ArrayBuffer>();
}

async function runApiTts001Tests() {
  console.log('=== API-TTS-001 STAGE 2 ENTEGRASYON TESTLERİ BAŞLIYOR ===');
  let passed = 0;
  let failed = 0;

  async function assertRes(res: Response, expectedStatus: number, msg: string) {
    const text = await res.clone().text();
    if (res.status === expectedStatus) {
      console.log(`  [PASS] ${msg}`);
      passed++;
      return true;
    } else {
      console.error(`  [FAIL] ${msg} -> Got status ${res.status}, body: ${text}`);
      failed++;
      return false;
    }
  }

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  [PASS] ${msg}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${msg}`);
      failed++;
    }
  }

  const secret = 'test_jwt_secret_tts_stage2';
  const db = new MockD1Database() as any;
  const media = new MockR2Bucket() as any;
  const env = { DB: db, MEDIA: media, ADMIN_JWT_SECRET: secret };

  const validAdminToken = await createSessionToken({ id: 'adm_1', email: 'admin@msklabs.com', name: 'Super Admin', role: 'superadmin' }, secret);
  const guestToken = await createSessionToken({ id: 'gst_1', email: 'guest@msklabs.com', name: 'Guest User', role: 'GUEST' }, secret);

  const resetRl = () => db.tables.rate_limits.clear();

  // Test 1: 401 Unauthenticated
  {
    const req = new Request('http://localhost/api/v1/admin/tts/generate', {
      method: 'POST',
      headers: { 'X-Idempotency-Key': 'key-1' },
      body: JSON.stringify({ postId: 1, language: 'TR' })
    });
    const res = await handleAdminTTSGenerate(req, env);
    await assertRes(res, 401, 'Token olmadan 401 Unauthorized dönmeli');
  }

  // Test 2: 403 Unauthorized (GUEST Role)
  {
    const req = new Request('http://localhost/api/v1/admin/tts/generate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${guestToken}`, 'X-Idempotency-Key': 'key-2' },
      body: JSON.stringify({ postId: 1, language: 'TR' })
    });
    const res = await handleAdminTTSGenerate(req, env);
    await assertRes(res, 403, 'GUEST rolünde 403 Forbidden dönmeli');
  }

  // Test 3: Missing X-Idempotency-Key (400)
  {
    const req = new Request('http://localhost/api/v1/admin/tts/generate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}` },
      body: JSON.stringify({ postId: 1, language: 'TR' })
    });
    const res = await handleAdminTTSGenerate(req, env);
    await assertRes(res, 400, 'X-Idempotency-Key eksikliğinde 400 Bad Request dönmeli');
  }

  // Test 4: Invalid postId (400)
  {
    resetRl();
    const req = new Request('http://localhost/api/v1/admin/tts/generate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}`, 'X-Idempotency-Key': 'key-4' },
      body: JSON.stringify({ postId: -5, language: 'TR' })
    });
    const res = await handleAdminTTSGenerate(req, env);
    await assertRes(res, 400, 'Geçersiz postId (-5) durumunda 400 Bad Request dönmeli');
  }

  // Test 5: Invalid Language (400)
  {
    resetRl();
    const req = new Request('http://localhost/api/v1/admin/tts/generate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}`, 'X-Idempotency-Key': 'key-5' },
      body: JSON.stringify({ postId: 1, language: 'FR' })
    });
    const res = await handleAdminTTSGenerate(req, env);
    await assertRes(res, 400, "Desteklenmeyen dil ('FR') durumunda 400 Bad Request dönmeli");
  }

  // Test 6: Valid Generate Request (202 Accepted, GENERATING record, Article/Audio version match)
  let generatedAudioId = 0;
  {
    resetRl();
    const req = new Request('http://localhost/api/v1/admin/tts/generate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}`, 'X-Idempotency-Key': 'key-6' },
      body: JSON.stringify({ postId: 42, language: 'TR' })
    });
    const res = await handleAdminTTSGenerate(req, env);
    const ok = await assertRes(res, 202, 'Geçerli generate isteğinde 202 Accepted dönmeli');
    if (ok) {
      const json = await res.json() as any;
      assert(json.success === true, 'Response success: true olmalı');
      assert(json.data.status === 'GENERATING', 'Status GENERATING olmalı');
      assert(typeof json.data.articleVersion === 'number' && json.data.articleVersion === json.data.audioVersion, 'articleVersion ve audioVersion eşleşmeli');
      assert(json.data.r2Key.startsWith('audio/posts/'), 'R2 key unpredictable /audio/posts/ biçiminde olmalı');
      generatedAudioId = json.data.audioId;

      const record = db.tables.post_audio_assets.get(generatedAudioId);
      assert(record && record.status === 'GENERATING', 'DB kaydı GENERATING statüsünde oluşturulmalı');
      assert(record.r2_object_key.startsWith('audio/posts/'), 'DB r2_object_key doğru biçimde saklanmalı');
    }
  }

  // Test 7: Duplicate Idempotency / Active Generation Conflict (409)
  {
    resetRl();
    const req = new Request('http://localhost/api/v1/admin/tts/generate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}`, 'X-Idempotency-Key': 'key-6' },
      body: JSON.stringify({ postId: 42, language: 'TR' })
    });
    const res = await handleAdminTTSGenerate(req, env);
    await assertRes(res, 409, 'Devam eden aktif ses üretiminde (aynı postId & language) 409 Conflict dönmeli');
  }

  // Test 8: Provider / Queue Missing -> Verify No Fake Success or Fake R2 Object
  {
    assert(media.objects.size === 0, 'Gerçek TTS provider/queue olmadan R2 bucket nesnesi sahte oluşturulmamalı');
    const record = db.tables.post_audio_assets.get(generatedAudioId);
    const valObj = JSON.parse(record.validation_result_json || '{}');
    assert(valObj.hasQueue === false && valObj.hasApiKey === false, 'Kuyruk ve API Key eksikliği validation_result_json içinde izlenmeli');
  }

  // Test 9: Provider Failure Handler -> FAILED Status
  {
    await handleTTSProductionFailure(env, generatedAudioId, 'Simulated TTS provider connection timeout secret_key=12345');
    const record = db.tables.post_audio_assets.get(generatedAudioId);
    assert(record.status === 'FAILED', 'Provider hatası durumunda DB kaydı FAILED statüsüne çekilmeli');
    const valObj = JSON.parse(record.validation_result_json || '{}');
    assert(!valObj.error.includes('12345'), 'Hata detayında secret/API key dışarı sızdırılmamalı');
  }

  // Test 10: Status Query (200)
  {
    const req = new Request('http://localhost/api/v1/admin/tts/status/42', {
      method: 'GET',
      headers: { Authorization: `Bearer ${validAdminToken}` }
    });
    const res = await handleAdminTTSStatus('42', req, env);
    const ok = await assertRes(res, 200, 'Status sorgusunda 200 OK dönmeli');
    if (ok) {
      const json = await res.json() as any;
      assert(json.data.audioAssets.length > 0, 'Status yanıtı ses kayıtlarını döndürmeli');
    }
  }

  // Test 11: Approve Audio (200)
  {
    const req = new Request('http://localhost/api/v1/admin/tts/approve', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}` },
      body: JSON.stringify({ audioId: generatedAudioId })
    });
    const res = await handleAdminTTSApprove(req, env);
    await assertRes(res, 200, 'Approve isteği 200 OK dönmeli');
    assert(db.tables.audit_logs.some((l: any) => l.action === 'TTS_APPROVED'), 'TTS_APPROVED audit log kaydedilmeli');
  }

  // Test 12: Unpublish Audio (200)
  {
    const req = new Request('http://localhost/api/v1/admin/tts/unpublish', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}` },
      body: JSON.stringify({ audioId: generatedAudioId })
    });
    const res = await handleAdminTTSUnpublish(req, env);
    await assertRes(res, 200, 'Unpublish isteği 200 OK dönmeli');
    assert(db.tables.audit_logs.some((l: any) => l.action === 'TTS_UNPUBLISHED'), 'TTS_UNPUBLISHED audit log kaydedilmeli');
  }

  // Test 13: Regenerate Audio (202 Accepted & STALE marking)
  {
    resetRl();
    const req = new Request('http://localhost/api/v1/admin/tts/regenerate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}`, 'X-Idempotency-Key': 'key-13' },
      body: JSON.stringify({ postId: 42, language: 'TR' })
    });
    const res = await handleAdminTTSRegenerate(req, env);
    await assertRes(res, 202, 'Regenerate isteği 202 Accepted dönmeli');
    assert(db.tables.audit_logs.some((l: any) => l.action === 'TTS_STALE_MARKED'), 'TTS_STALE_MARKED audit log kaydedilmeli');
  }

  // --- STAGE 3: Public MP3 Delivery & HTTP Range Tests ---

  // Test 14: DRAFT Audio Public Delivery -> 404
  {
    const req = new Request('http://localhost/api/v1/public/audio/42/TR', { method: 'GET' });
    const res = await handlePublicAudioDelivery(req, env, { postId: 42, language: 'TR' });
    await assertRes(res, 404, 'DRAFT / STALE ses kaydı public olarak servis edilmemeli (404)');
  }

  // Test 15: APPROVED Audio Public Delivery without R2 Object -> 404
  {
    const pubAssetId = 99;
    db.tables.post_audio_assets.set(pubAssetId, {
      id: pubAssetId, post_id: 100, language: 'TR', article_version: 1, audio_version: 1,
      r2_object_key: 'audio/posts/missing.mp3', status: 'APPROVED'
    });
    const req = new Request('http://localhost/api/v1/public/audio/100/TR', { method: 'GET' });
    const res = await handlePublicAudioDelivery(req, env, { postId: 100, language: 'TR' });
    await assertRes(res, 404, 'R2 nesnesi bulunamayan APPROVED ses kaydı 404 dönmeli');
  }

  // Test 16: APPROVED Audio Public Delivery (200 OK + Full Headers)
  const mockAudioData = new Uint8Array(500); // 500-byte fake MP3 stream buffer
  for (let i = 0; i < 500; i++) mockAudioData[i] = i % 256;
  const mockR2Key = 'audio/posts/valid_approved_test.mp3';
  media.objects.set(mockR2Key, mockAudioData.buffer);

  const approvedAssetId = 101;
  db.tables.post_audio_assets.set(approvedAssetId, {
    id: approvedAssetId, post_id: 200, language: 'TR', article_version: 1, audio_version: 1,
    r2_object_key: mockR2Key, status: 'APPROVED'
  });

  {
    const req = new Request('http://localhost/api/v1/public/audio/200/TR', { method: 'GET' });
    const res = await handlePublicAudioDelivery(req, env, { postId: 200, language: 'TR' });
    const ok = await assertRes(res, 200, 'APPROVED ses kaydı public delivery 200 OK dönmeli');
    if (ok) {
      assert(res.headers.get('content-type') === 'audio/mpeg', 'Content-Type: audio/mpeg olmalı');
      assert(res.headers.get('accept-ranges') === 'bytes', 'Accept-Ranges: bytes olmalı');
      assert(res.headers.get('cache-control') === 'public, max-age=31536000, immutable', 'Cache-Control header doğru olmalı');
      assert(res.headers.get('content-length') === '500', 'Content-Length: 500 olmalı');
    }
  }

  // Test 17: HTTP Range Request (206 Partial Content)
  {
    const req = new Request('http://localhost/api/v1/public/audio/200/TR', {
      method: 'GET',
      headers: { Range: 'bytes=0-99' }
    });
    const res = await handlePublicAudioDelivery(req, env, { postId: 200, language: 'TR' });
    const ok = await assertRes(res, 206, 'Valid Range isteği (bytes=0-99) HTTP 206 Partial Content dönmeli');
    if (ok) {
      assert(res.headers.get('content-range') === 'bytes 0-99/500', 'Content-Range: bytes 0-99/500 olmalı');
      assert(res.headers.get('content-length') === '100', 'Range Content-Length: 100 olmalı');
    }
  }

  // Test 18: Invalid Range Request (416 Range Not Satisfiable)
  {
    const req = new Request('http://localhost/api/v1/public/audio/200/TR', {
      method: 'GET',
      headers: { Range: 'bytes=600-700' }
    });
    const res = await handlePublicAudioDelivery(req, env, { postId: 200, language: 'TR' });
    const ok = await assertRes(res, 416, 'Geçersiz Range isteği (bytes=600-700) HTTP 416 dönmeli');
    if (ok) {
      assert(res.headers.get('content-range') === 'bytes */500', '416 yanıtında Content-Range: bytes */500 olmalı');
    }
  }

  // Test 19: STALE Audio Public Delivery -> 404
  {
    const staleAssetId = 102;
    db.tables.post_audio_assets.set(staleAssetId, {
      id: staleAssetId, post_id: 300, language: 'TR', article_version: 1, audio_version: 1,
      r2_object_key: mockR2Key, status: 'STALE'
    });
    const req = new Request('http://localhost/api/v1/public/audio/300/TR', { method: 'GET' });
    const res = await handlePublicAudioDelivery(req, env, { postId: 300, language: 'TR' });
    await assertRes(res, 404, 'STALE ses kaydı public olarak servis edilmemeli (404)');
  }

  console.log(`\n=== API-TTS-001 STAGE 3 TEST SONUÇLARI: ${passed} PASS, ${failed} FAIL ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runApiTts001Tests().catch(err => {
  console.error('API-TTS-001 Stage 3 Test FAILED with exception:', err);
  process.exit(1);
});
