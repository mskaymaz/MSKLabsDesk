/**
 * MSKLabsDesk — Yönetici Kimlik Doğrulama & Token Yardımcısı
 * Cloudflare Edge & WebCrypto HMAC-SHA256 / PBKDF2 Uyumlu
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
 * Sabit Zamanlı (Timing-Safe) Eşitlik Kontrolü
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * SHA-256 Parola Özeti Oluşturucu (Eski Kayıtlar ve Legacy Token Uyumu İçin)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * PBKDF2 ile Güvenli Parola Hash'leme (100.000 iterasyon, 16-byte tuz)
 * Format: pbkdf2$iterations$salt_hex$hash_hex
 */
export async function hashPasswordWithSalt(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const iterations = 100000;

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );

  const hashHex = Array.from(new Uint8Array(derivedKey)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2$${iterations}$${saltHex}$${hashHex}`;
}

/**
 * Parola Doğrulama (PBKDF2 ve geriye dönük SHA-256 desteği)
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) return false;

  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;
    const iterations = parseInt(parts[1], 10);
    const saltHex = parts[2];
    const expectedHashHex = parts[3];

    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    const encoder = new TextEncoder();

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );

    const derivedKey = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt,
        iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );

    const hashHex = Array.from(new Uint8Array(derivedKey)).map(b => b.toString(16).padStart(2, '0')).join('');
    return timingSafeEqual(hashHex, expectedHashHex);
  } else {
    // Eski SHA-256 hash'leri için geçiş desteği
    const legacyHash = await hashPassword(password);
    return timingSafeEqual(legacyHash, storedHash);
  }
}

/**
 * WebCrypto HMAC-SHA256 İmzası Üretici
 */
async function signHmacSha256(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Edge Uyumlu Güvenli Oturum Token'ı Üretici (HMAC-SHA256)
 */
export async function createSessionToken(admin: AdminUser, secret: string): Promise<string> {
  if (!secret || secret.trim() === '') {
    throw new Error('ADMIN_JWT_SECRET tanımlı değil veya boş.');
  }

  const payload = {
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 Günlük Oturum
  };

  const payloadStr = btoa(JSON.stringify(payload));
  const signature = await signHmacSha256(payloadStr, secret);
  return `${payloadStr}.${signature}`;
}

/**
 * Authorization Header Doğrulama (HMAC-SHA256 & Geriye Dönük Legacy Token Uyumu)
 */
export async function verifyAuthToken(request: Request, secret?: string): Promise<AdminUser | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;

  const token = authHeader.substring(7);
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadStr, signature] = parts;
  let isValid = false;

  // 1. Yeni Standart: HMAC-SHA256 İmzası Doğrulama
  if (secret && secret.trim() !== '') {
    const expectedSignature = await signHmacSha256(payloadStr, secret);
    isValid = timingSafeEqual(signature, expectedSignature);
  }

  // 2. Geriye Dönük Uyumluluk (Tarayıcıda aktif olan eski oturumların düşmemesi için)
  if (!isValid) {
    if (secret) {
      const legacyWithSecret = await hashPassword(`${payloadStr}.${secret}`);
      if (timingSafeEqual(signature, legacyWithSecret)) {
        isValid = true;
      }
    }
    if (!isValid) {
      const legacyDefault = await hashPassword(`${payloadStr}.msklabs_default_secret_2026`);
      if (timingSafeEqual(signature, legacyDefault)) {
        isValid = true;
      }
    }
  }

  if (!isValid) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(payloadStr));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

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
