/**
 * MSKLabsDesk — Admin Giriş API Endpoint (POST /api/admin/login)
 * Güvenli PBKDF2 / Salt + Rate Limiting Korumalı
 */

import { AuthEnv, createSessionToken, verifyPassword, hashPasswordWithSalt, createBridgeToken, verifyBridgeToken, verifyAuthToken } from '../utils/auth';

export async function handleAdminLogin(request: Request, env: { DB: D1Database } & AuthEnv): Promise<Response> {
  try {
    const body = await request.json() as { email?: string; username?: string; password?: string };
    const identifier = (body.email || body.username || '').trim().toLowerCase();
    const passwordInput = body.password;

    if (!identifier || !passwordInput) {
      return new Response(
        JSON.stringify({ error: 'Kullanıcı adı/e-posta ve şifre zorunludur.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 1. Rate Limiting Denetimi (IP bazlı dakikada azami 5 deneme)
    const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'local';
    const rateKey = `login_rl_${clientIp}`;
    const now = Math.floor(Date.now() / 1000);
    const windowSec = 60;
    const maxAttempts = 5;

    const rlRecord = await env.DB.prepare('SELECT count, reset_at FROM rate_limits WHERE key = ?')
      .bind(rateKey)
      .first<{ count: number; reset_at: number }>();

    if (rlRecord && rlRecord.reset_at >= now && rlRecord.count >= maxAttempts) {
      return new Response(
        JSON.stringify({ error: 'Çok fazla başarısız deneme. Lütfen 1 dakika sonra tekrar deneyin.' }),
        { status: 429, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 2. Hesabı Kullanıcı Adı/E-Posta İle Sorgula
    const admin = await env.DB.prepare(`
      SELECT id, email, password_hash, name, role FROM admins
      WHERE (email = ? OR (id = 'admin_primary' AND ? IN ('admin', 'mskaymaz', 'msklabs.org@gmail.com', 'mustafasalihkaymaz@gmail.com')))
    `).bind(identifier, identifier).first<{ id: string; email: string; password_hash: string; name: string; role: string }>();

    const isPasswordValid = admin ? await verifyPassword(passwordInput, admin.password_hash) : false;

    if (!admin || !isPasswordValid) {
      // Başarısız deneme: Rate limit sayacını artır
      if (!rlRecord || rlRecord.reset_at < now) {
        await env.DB.prepare('INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, 1, ?)')
          .bind(rateKey, now + windowSec)
          .run();
      } else {
        await env.DB.prepare('UPDATE rate_limits SET count = count + 1 WHERE key = ?')
          .bind(rateKey)
          .run();
      }

      return new Response(
        JSON.stringify({ error: 'Hatalı e-posta veya şifre.' }),
        { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // Başarılı giriş: Başarısız deneme sayacını sıfırla
    await env.DB.prepare('DELETE FROM rate_limits WHERE key = ?').bind(rateKey).run().catch(() => {});

    // 3. Parola Eski SHA-256 İse PBKDF2'ye Otomatik Yükselt (Re-hash on login)
    if (!admin.password_hash.startsWith('pbkdf2$')) {
      const newPbkdf2Hash = await hashPasswordWithSalt(passwordInput);
      await env.DB.prepare('UPDATE admins SET password_hash = ? WHERE id = ?')
        .bind(newPbkdf2Hash, admin.id)
        .run()
        .catch(() => {});
    }

    // 4. Oturum Token'ı Üret
    const secret = env.ADMIN_JWT_SECRET;
    if (!secret) {
      return new Response(
        JSON.stringify({ error: 'Sunucu yapılandırma hatası: ADMIN_JWT_SECRET tanımlanmamış.' }),
        { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }
    const token = await createSessionToken(admin, secret);

    return new Response(
      JSON.stringify({
        success: true,
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
        user: {
          id: admin.id,
          email: admin.email,
          username: admin.email.split('@')[0],
          name: admin.name,
          role: admin.role,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[ADMIN LOGIN ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Giriş işlemi sırasında sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}

/**
 * Minyatür İstasyon ve Harici Girişler İçin Şifresiz Geçiş Bileti Üretir (POST /api/admin/auth/bridge-ticket)
 */
export async function handleCreateBridgeTicket(request: Request, env: { DB: D1Database } & AuthEnv): Promise<Response> {
  try {
    const secret = env.ADMIN_JWT_SECRET;
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Sunucu hatası: ADMIN_JWT_SECRET eksik.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    const admin = await verifyAuthToken(request, secret);
    if (!admin) {
      return new Response(JSON.stringify({ error: 'Yetkisiz erişim. Geçerli oturum gereklidir.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    const body = (await request.json().catch(() => ({}))) as { targetTab?: string; targetParams?: Record<string, any> };
    const bridgeToken = await createBridgeToken(admin, secret, body.targetTab, body.targetParams);

    const hostHeader = request.headers.get('host') || '';
    const protocol = hostHeader.includes('localhost') || hostHeader.includes('127.0.0.1') ? 'http' : 'https';
    const baseUrl = hostHeader ? `${protocol}://${hostHeader}` : 'https://panel.msklabs.org';
    const bridgeUrl = `${baseUrl}/admin/?bridge_token=${encodeURIComponent(bridgeToken)}`;

    return new Response(
      JSON.stringify({
        success: true,
        bridge_token: bridgeToken,
        bridge_url: bridgeUrl,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[BRIDGE TICKET CREATE ERROR]', err);
    return new Response(JSON.stringify({ error: 'Köprü bileti üretilemedi.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}

/**
 * Şifresiz Geçiş Biletini Tam Yetkili Yönetici Oturumuna Çevirir (POST /api/admin/auth/exchange-bridge)
 */
export async function handleExchangeBridgeTicket(request: Request, env: { DB: D1Database } & AuthEnv): Promise<Response> {
  try {
    const secret = env.ADMIN_JWT_SECRET;
    if (!secret) {
      return new Response(JSON.stringify({ error: 'Sunucu hatası: ADMIN_JWT_SECRET eksik.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    const body = (await request.json().catch(() => ({}))) as { bridge_token?: string };
    const bridgeToken = (body.bridge_token || '').trim();
    if (!bridgeToken) {
      return new Response(JSON.stringify({ error: 'bridge_token parametresi zorunludur.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    const bridgeData = await verifyBridgeToken(bridgeToken, secret);
    if (!bridgeData) {
      return new Response(JSON.stringify({ error: 'Geçersiz veya süresi dolmuş köprü bileti.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    // Veritabanından yöneticiyi doğrula
    const admin = await env.DB.prepare('SELECT id, email, name, role FROM admins WHERE id = ?')
      .bind(bridgeData.admin.id)
      .first<{ id: string; email: string; name: string; role: string }>();

    if (!admin) {
      return new Response(JSON.stringify({ error: 'Yönetici hesabı bulunamadı.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    // 30 günlük tam oturum üret
    const sessionToken = await createSessionToken(admin, secret);

    return new Response(
      JSON.stringify({
        success: true,
        token: sessionToken,
        admin,
        user: {
          id: admin.id,
          email: admin.email,
          username: admin.email.split('@')[0],
          name: admin.name,
          role: admin.role,
        },
        targetTab: bridgeData.targetTab,
        targetParams: bridgeData.targetParams,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[BRIDGE TICKET EXCHANGE ERROR]', err);
    return new Response(JSON.stringify({ error: 'Köprü bileti doğrulanamadı.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
}
