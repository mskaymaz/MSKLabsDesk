/**
 * MSKLabsDesk — API-010 Admin Media R2 API Entegrasyon Test Modülü
 */

import { handleAdminMediaUpload, handleAdminMediaDelete } from '../src/routes/adminMedia';
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

    if (sql.includes('SELECT r2_key, public_url, size_bytes, mime_type FROM media_assets WHERE sha256 = ?')) {
      const sha256 = this.params[0];
      const match = Array.from(this.db.tables.media_assets.values()).find((m: any) => m.sha256 === sha256);
      return { results: match ? [match] : [] };
    }

    if (sql.includes('SELECT r2_key FROM media_assets WHERE r2_key = ?')) {
      const key = this.params[0];
      const match = this.db.tables.media_assets.get(key);
      return { results: match ? [match] : [] };
    }

    return { results: [] };
  }

  async run(): Promise<{ success: boolean }> {
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

    if (sql.includes('INSERT INTO media_assets')) {
      const [filename, r2_key, mime_type, size_bytes, public_url, sha256] = this.params;
      this.db.tables.media_assets.set(r2_key, { filename, r2_key, mime_type, size_bytes, public_url, sha256 });
      return { success: true };
    }

    if (sql.includes('DELETE FROM media_assets WHERE r2_key = ?')) {
      const key = this.params[0];
      this.db.tables.media_assets.delete(key);
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
    media_assets: new Map<string, any>(),
    rate_limits: new Map<string, any>(),
    audit_logs: [] as any[]
  };

  prepare(sql: string) {
    return new MockD1PreparedStatement(sql, [], this);
  }
}

class MockR2Bucket {
  objects = new Map<string, ArrayBuffer>();

  async put(key: string, value: ArrayBuffer) {
    this.objects.set(key, value);
    return null;
  }

  async delete(key: string) {
    this.objects.delete(key);
    return null;
  }
}

async function runApi010Tests() {
  console.log('=== API-010 ENTEGRASYON TESTLERİ BAŞLIYOR ===');
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

  const secret = 'test_jwt_secret_2026';
  const db = new MockD1Database() as any;
  const media = new MockR2Bucket() as any;
  const env = { DB: db, MEDIA: media, ADMIN_JWT_SECRET: secret, CDN_BASE_URL: 'https://cdn.msklabs.com' };

  const validAdminToken = await createSessionToken({ id: 'adm_1', email: 'admin@msklabs.com', name: 'Super Admin', role: 'superadmin' }, secret);
  const guestToken = await createSessionToken({ id: 'gst_1', email: 'guest@msklabs.com', name: 'Guest User', role: 'GUEST' }, secret);

  const resetRl = () => db.tables.rate_limits.clear();

  // Test 1: Yetkisiz Erişim (401)
  {
    const req = new Request('http://localhost/api/v1/admin/media/upload', { method: 'POST' });
    const res = await handleAdminMediaUpload(req, env);
    assert(res.status === 401, 'Yetkisiz erişimde HTTP 401 dönmeli');
  }

  // Test 2: Yetkisiz Rol (403)
  {
    const req = new Request('http://localhost/api/v1/admin/media/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${guestToken}` }
    });
    const res = await handleAdminMediaUpload(req, env);
    assert(res.status === 403, 'GUEST rolüne HTTP 403 Forbidden dönmeli');
  }

  // Test 3: .exe / .php Zararlı Dosya Reddi (400)
  {
    resetRl();
    const formData = new FormData();
    const badFile = new File(['echo "bad"'], 'script.php', { type: 'image/png' });
    formData.append('file', badFile);

    const req = new Request('http://localhost/api/v1/admin/media/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}` },
      body: formData
    });
    const res = await handleAdminMediaUpload(req, env);
    await assertRes(res, 400, '.php uzantılı zararlı dosya reddedilmeli (400)');
  }

  // Test 4: > 5 MB Dosya Boyutu Sınırı (400)
  {
    resetRl();
    const formData = new FormData();
    const bigBuffer = new Uint8Array(5.5 * 1024 * 1024);
    const bigFile = new File([bigBuffer], 'huge.png', { type: 'image/png' });
    formData.append('file', bigFile);

    const req = new Request('http://localhost/api/v1/admin/media/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}` },
      body: formData
    });
    const res = await handleAdminMediaUpload(req, env);
    await assertRes(res, 400, '>5MB dosya boyutu reddedilmeli (400)');
  }

  // Test 5: Sahte Magic Bytes Reddi (400)
  {
    resetRl();
    const formData = new FormData();
    const fakePng = new File(['Not a real PNG header content'], 'fake.png', { type: 'image/png' });
    formData.append('file', fakePng);

    const req = new Request('http://localhost/api/v1/admin/media/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}` },
      body: formData
    });
    const res = await handleAdminMediaUpload(req, env);
    await assertRes(res, 400, 'Geçersiz Magic Bytes içeren dosya reddedilmeli (400)');
  }

  // Test 6: Geçerli PNG Görsel Yüklemesi (201)
  let uploadedKey = '';
  {
    resetRl();
    const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0, 0, 0, 0, 0]);
    const validPng = new File([pngHeader], 'sample.png', { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', validPng);
    formData.append('altText', 'Örnek Görsel');

    const req = new Request('http://localhost/api/v1/admin/media/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}` },
      body: formData
    });
    const res = await handleAdminMediaUpload(req, env);
    const ok = await assertRes(res, 201, 'Geçerli PNG görseli 201 Created döndürmeli');
    if (ok) {
      const json = await res.json() as any;
      assert(json.success === true, 'Response success: true olmalı');
      assert(json.data && typeof json.data.key === 'string', 'Yüklenen görselin key bilgisi dönmeli');
      uploadedKey = json.data?.key;

      assert(db.tables.media_assets.has(uploadedKey), 'D1 media_assets tablosuna metadata yazılmalı');
      assert(media.objects.has(uploadedKey), 'R2 Bucket nesnesi oluşturulmalı');
      assert(db.tables.audit_logs.some((l: any) => l.action === 'MEDIA_UPLOADED'), 'MEDIA_UPLOADED audit log kaydedilmeli');
    }
  }

  // Test 7: SHA-256 Çakışma Kontrolü (200)
  {
    resetRl();
    const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0, 0, 0, 0, 0]);
    const duplicatePng = new File([pngHeader], 'sample_copy.png', { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', duplicatePng);

    const req = new Request('http://localhost/api/v1/admin/media/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${validAdminToken}` },
      body: formData
    });
    const res = await handleAdminMediaUpload(req, env);
    const ok = await assertRes(res, 200, 'Aynı SHA-256 içerik çakışmasında HTTP 200 dönmeli');
    if (ok) {
      const json = await res.json() as any;
      assert(json.data && json.data.key === uploadedKey, 'Çakışan içerikte aynı R2 key dönmeli');
    }
  }

  // Test 8: Medya Silme (200)
  {
    const req = new Request(`http://localhost/api/v1/admin/media/${encodeURIComponent(uploadedKey)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${validAdminToken}` }
    });
    const res = await handleAdminMediaDelete(uploadedKey, req, env);
    assert(res.status === 200, 'Medya silme HTTP 200 döndürmeli');
    assert(!db.tables.media_assets.has(uploadedKey), 'D1 veritabanından kaydı silinmeli');
    assert(!media.objects.has(uploadedKey), 'R2 bucket nesnesi silinmeli');
    assert(db.tables.audit_logs.some((l: any) => l.action === 'MEDIA_DELETED'), 'MEDIA_DELETED audit log kaydedilmeli');
  }

  // Test 9: Olmayan Medya Silme Denemesi (404)
  {
    const req = new Request('http://localhost/api/v1/admin/media/non_existent_key', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${validAdminToken}` }
    });
    const res = await handleAdminMediaDelete('non_existent_key', req, env);
    assert(res.status === 404, 'Bulunamayan medya silme talebi HTTP 404 döndürmeli');
  }

  // Test 10: Rate Limit Sınırı Aşımı (429)
  {
    db.tables.rate_limits.clear();
    let hitLimit = false;
    const pngHeader = new Uint8Array([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0, 0, 0, 0, 0]);

    for (let i = 0; i < 22; i++) {
      const formData = new FormData();
      formData.append('file', new File([pngHeader], `test_${i}.png`, { type: 'image/png' }));
      const req = new Request('http://localhost/api/v1/admin/media/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${validAdminToken}`, 'cf-connecting-ip': '1.2.3.4' },
        body: formData
      });
      const res = await handleAdminMediaUpload(req, env);
      if (res.status === 429) {
        hitLimit = true;
        break;
      }
    }
    assert(hitLimit, '20 req/min aşımında HTTP 429 Too Many Requests dönmeli');
  }

  console.log(`\n=== TEST SONUÇLARI: ${passed} PASS, ${failed} FAIL ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runApi010Tests().catch(err => {
  console.error('Test FAILED with exception:', err);
  process.exit(1);
});
