/**
 * MSKLabsDesk — Yönetici Kimlik Doğrulama & Token Yardımcısı
 */

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthEnv {
  ADMIN_JWT_SECRET?: string;
}

/**
 * SHA-256 Parola Özeti Oluşturucu
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Basit Güvenli Token Üretici & Doğrulayıcı (Cloudflare Edge Uyumlu)
 */
export async function createSessionToken(admin: AdminUser, secret: string = 'msklabs_default_secret_2026'): Promise<string> {
  const payload = {
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 Günlük Oturum
  };

  const payloadStr = btoa(JSON.stringify(payload));
  const signature = await hashPassword(`${payloadStr}.${secret}`);
  return `${payloadStr}.${signature}`;
}

/**
 * Authorization Header Doğrulama
 */
export async function verifyAuthToken(request: Request, secret: string = 'msklabs_default_secret_2026'): Promise<AdminUser | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadStr, signature] = parts;
  const expectedSignature = await hashPassword(`${payloadStr}.${secret}`);
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(atob(payloadStr));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
