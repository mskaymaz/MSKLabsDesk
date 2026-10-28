/**
 * MSKLabsDesk — Güvenli Kimlik Bilgileri Kasası (AES-256-GCM)
 *
 * Amaç: CREDENTIALS.local.md dosyasını şifreleyerek CREDENTIALS.enc olarak
 * uzak GitHub deposuna güvenle göndermek ve yetkili ekip üyeleriyle paylaşmak.
 *
 * Kullanım:
 *   Şifrele (Lock):   node scripts/vault.js lock [parola]
 *   Çöz (Unlock):     node scripts/vault.js unlock [parola]
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_FILE = path.join(ROOT_DIR, 'CREDENTIALS.local.md');
const TARGET_FILE = path.join(ROOT_DIR, 'CREDENTIALS.enc');

const action = process.argv[2];
const password = process.argv[3] || process.env.VAULT_PASS || 'Msk.571';

if (!action || (action !== 'lock' && action !== 'unlock')) {
  console.log('Kullanım: node scripts/vault.js [lock|unlock] [parola]');
  process.exit(1);
}

if (action === 'lock') {
  if (!fs.existsSync(SOURCE_FILE)) {
    console.error(`Hata: ${SOURCE_FILE} bulunamadı!`);
    process.exit(1);
  }

  const plaintext = fs.readFileSync(SOURCE_FILE, 'utf8');
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(password, salt, 32);

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  const payload = Buffer.concat([salt, iv, tag, encrypted]);
  fs.writeFileSync(TARGET_FILE, payload);

  console.log(`[BAŞARILI] ${SOURCE_FILE} başarıyla şifrelendi -> ${TARGET_FILE}`);
  console.log(`[BİLGİ] Boyut: ${payload.length} bayt (AES-256-GCM). GitHub'a güvenle gönderilebilir.`);
} else if (action === 'unlock') {
  if (!fs.existsSync(TARGET_FILE)) {
    console.error(`Hata: ${TARGET_FILE} bulunamadı!`);
    process.exit(1);
  }

  try {
    const payload = fs.readFileSync(TARGET_FILE);
    const salt = payload.subarray(0, 16);
    const iv = payload.subarray(16, 28);
    const tag = payload.subarray(28, 44);
    const encrypted = payload.subarray(44);

    const key = crypto.scryptSync(password, salt, 32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
    fs.writeFileSync(SOURCE_FILE, decrypted, 'utf8');

    console.log(`[BAŞARILI] ${TARGET_FILE} çözüldü -> ${SOURCE_FILE}`);
  } catch (err) {
    console.error(`[HATA] Şifre çözülemedi! Parola hatalı veya dosya bozulmuş: ${err.message}`);
    process.exit(1);
  }
}
