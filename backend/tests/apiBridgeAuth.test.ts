/**
 * MSKLabsDesk — Magic Auth Bridge & Şifresiz Panel Girişi Testleri
 * File: backend/tests/apiBridgeAuth.test.ts
 */

import { handleCreateBridgeTicket, handleExchangeBridgeTicket } from '../src/routes/adminAuth';
import { createSessionToken, createBridgeToken, verifyBridgeToken } from '../src/utils/auth';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: ${msg}`);
  }
}

class MockD1PreparedStatement {
  constructor(private sql: string, private params: any[], private tables: any) {}

  bind(...params: any[]) {
    return new MockD1PreparedStatement(this.sql, params, this.tables);
  }

  async first<T = any>(): Promise<T | null> {
    const s = this.sql.trim();
    if (s.includes('FROM admins WHERE id = ?')) {
      const id = this.params[0];
      return (this.tables.admins.find((a: any) => a.id === id) || null) as T;
    }
    return null;
  }

  async run(): Promise<{ success: boolean }> {
    return { success: true };
  }
}

class MockD1Database {
  public tables = {
    admins: [
      {
        id: 'admin_primary',
        email: 'iletisim@msklabs.org',
        name: 'Mustafa Salih Kaymaz',
        role: 'super_admin',
        password_hash: 'pbkdf2$mock$salt$hash',
      },
    ],
  };

  prepare(sql: string) {
    return new MockD1PreparedStatement(sql, [], this.tables);
  }
}

async function runTests() {
  console.log('--- MAGIC AUTH BRIDGE API TESTLERİ BAŞLIYOR ---');

  const secret = 'test_secret_msklabs_bridge_2026_xyz';
  const mockDb = new MockD1Database() as any;
  const env = { DB: mockDb, ADMIN_JWT_SECRET: secret };

  const primaryAdmin = mockDb.tables.admins[0];
  const validSessionToken = await createSessionToken(primaryAdmin, secret);

  // 1. Yetkisiz create bridge ticket isteği
  const unauthReq = new Request('http://localhost:8787/api/admin/auth/bridge-ticket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetTab: 'comments' }),
  });
  const unauthRes = await handleCreateBridgeTicket(unauthReq, env);
  assert(unauthRes.status === 401, 'Yetkisiz create-bridge isteğinde HTTP 401 dönmeli');

  // 2. Yetkili create bridge ticket isteği
  const authReq = new Request('http://localhost:8787/api/admin/auth/bridge-ticket', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${validSessionToken}`,
    },
    body: JSON.stringify({
      targetTab: 'comments',
      targetParams: { channel: 'bizce', status: 'pending' },
    }),
  });
  const authRes = await handleCreateBridgeTicket(authReq, env);
  assert(authRes.status === 200, 'Yetkili create-bridge isteğinde HTTP 200 dönmeli');
  const authData = await authRes.json() as any;
  assert(authData.success === true, 'Response success: true olmalı');
  assert(typeof authData.bridge_token === 'string', 'bridge_token string olmalı');
  assert(typeof authData.bridge_url === 'string', 'bridge_url string olmalı');
  assert(authData.bridge_url.includes('bridge_token='), 'bridge_url token parametresini içermeli');

  // 3. Geçerli bilet ile exchange-bridge testi
  const exchangeReq = new Request('http://localhost:8787/api/admin/auth/exchange-bridge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bridge_token: authData.bridge_token }),
  });
  const exchangeRes = await handleExchangeBridgeTicket(exchangeReq, env);
  assert(exchangeRes.status === 200, 'Geçerli bilet ile HTTP 200 dönmeli');
  const exchangeData = await exchangeRes.json() as any;
  assert(exchangeData.success === true, 'Exchange success true olmalı');
  assert(typeof exchangeData.token === 'string', '30 günlük session token dönmeli');
  assert(exchangeData.user.email === primaryAdmin.email, 'Kullanıcı email eşleşmeli');
  assert(exchangeData.targetTab === 'comments', 'Hedef sekme comments olmalı');
  assert(exchangeData.targetParams.channel === 'bizce', 'Hedef parametre kanal bizce olmalı');

  // 4. Değiştirilmiş / Sahte token ile deneme
  const tamperedToken = authData.bridge_token.slice(0, -4) + 'abcd';
  const tamperReq = new Request('http://localhost:8787/api/admin/auth/exchange-bridge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bridge_token: tamperedToken }),
  });
  const tamperRes = await handleExchangeBridgeTicket(tamperReq, env);
  assert(tamperRes.status === 401, 'Sahte / bozulmuş bilette HTTP 401 dönmeli');

  // 5. Boş parametre ile deneme
  const emptyReq = new Request('http://localhost:8787/api/admin/auth/exchange-bridge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const emptyRes = await handleExchangeBridgeTicket(emptyReq, env);
  assert(emptyRes.status === 400, 'Parametre eksikliğinde HTTP 400 dönmeli');

  console.log('--- MAGIC AUTH BRIDGE API TESTLERİ BAŞARIYLA TAMAMLANDI ---');
}

runTests().catch(err => {
  console.error('Test hatası:', err);
  process.exit(1);
});
