/**
 * MSKLabsDesk — E-Posta Geçerlilik & MX Sunucu Doğrulama Yardımcısı
 */

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'guerrillamail.com', '10minutemail.com',
  'yopmail.com', 'trashmail.com', 'dispostable.com', 'fakeinbox.com',
  'sharklasers.com', 'getairmail.com', 'temp-mail.org', 'throwawaymail.com',
  'mohmal.com', 'crazymailing.com', 'nada.ltd', 'inboxkitten.com'
]);

export interface EmailValidationResult {
  valid: boolean;
  reason?: 'syntax' | 'disposable' | 'nxdomain' | 'no_mx';
}

/**
 * E-Posta adresinin formatını ve DNS MX posta sunucusu kayıtlarını doğrular
 */
export async function validateEmailAddress(email: string): Promise<EmailValidationResult> {
  const cleanEmail = (email || '').trim().toLowerCase();
  
  // 1. Temel Sözdizimi Kontrolü
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regex.test(cleanEmail)) {
    return { valid: false, reason: 'syntax' };
  }

  const parts = cleanEmail.split('@');
  if (parts.length !== 2) return { valid: false, reason: 'syntax' };
  const domain = parts[1].trim();

  // 2. Geçici / Tek Kullanımlık Alan Adı Kontrolü
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false, reason: 'disposable' };
  }

  // 3. Cloudflare DNS-over-HTTPS (DoH) ile MX Kayıt Kontrolü
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`https://1.1.1.1/dns-query?name=${encodeURIComponent(domain)}&type=MX`, {
      headers: { 'Accept': 'application/dns-json' },
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!res.ok) {
      return { valid: true }; // Ağ hatasında kullanıcıyı mağdur etmemek için fail-open
    }

    const data = await res.json() as any;

    // NXDOMAIN (Alan adı dünyada mevcut değil)
    if (data.Status === 3) {
      return { valid: false, reason: 'nxdomain' };
    }

    // MX (type 15) veya A (type 1) kaydı var mı?
    const hasMx = Array.isArray(data.Answer) && data.Answer.some((ans: any) => ans.type === 15);
    if (!hasMx) {
      const hasA = Array.isArray(data.Answer) && data.Answer.some((ans: any) => ans.type === 1);
      if (!hasA) {
        return { valid: false, reason: 'no_mx' };
      }
    }

    return { valid: true };
  } catch (err) {
    console.warn('[DNS MX Check Fallback]', err);
    return { valid: true }; // Zaman aşımı/hata durumunda fail-open
  }
}
