/**
 * MSKLabsDesk — Admin Giriş API Endpoint (POST /api/admin/login)
 */

import { AuthEnv, createSessionToken, hashPassword } from '../utils/auth';

export async function handleAdminLogin(request: Request, env: { DB: D1Database } & AuthEnv): Promise<Response> {
  try {
    const body = await request.json() as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'E-posta ve şifre zorunludur.' }),
        { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 1. Yönetici Hesabı Yoksa Varsayılan Oluştur (Auto-Seed)
    const adminCount = await env.DB.prepare('SELECT COUNT(*) as count FROM admins').first<{ count: number }>();
    if (!adminCount || adminCount.count === 0) {
      const defaultHash = await hashPassword('MskLabs2026!');
      await env.DB.prepare(`
        INSERT INTO admins (id, email, password_hash, name, role, created_at)
        VALUES ('admin_primary', 'msklabs.org@gmail.com', ?, 'MSK Labs Yönetici', 'superadmin', CURRENT_TIMESTAMP)
      `).bind(defaultHash).run();
    }

    // 2. Hesabı Sorgula
    const hashedPassword = await hashPassword(password);
    const admin = await env.DB.prepare(`
      SELECT id, email, name, role FROM admins WHERE email = ? AND password_hash = ?
    `).bind(email, hashedPassword).first<{ id: string; email: string; name: string; role: string }>();

    if (!admin) {
      return new Response(
        JSON.stringify({ error: 'Hatalı e-posta veya şifre.' }),
        { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
      );
    }

    // 3. Oturum Token'ı Üret
    const secret = env.ADMIN_JWT_SECRET || 'msklabs_default_secret_2026';
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
      }),
      { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  } catch (err: any) {
    console.error('[ADMIN LOGIN ERROR]', err);
    return new Response(
      JSON.stringify({ error: 'Sunucu hatası oluştu.' }),
      { status: 500, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
    );
  }
}
