# MSK Labs — Kurumsal E-Posta ve Routing Mimarisi Kılavuzu (KURUMSAL_EPOSTA_VE_ROUTING_MIMARISI.md)
> **Tarih:** 31 Ekim 2026 - 13:45  
> **Hedef Kitle:** Gelecekte projede çalışacak tüm AI Kod Ajanları ve Sistem Mühendisleri  
> **Durum:** Canlıda Aktif & Doğrulanmış (Production Ready)

---

## 📌 1. Temel Mimari Felsefe ve Stratejik Amaç

1. **Destek Masası Birincildir (`destek.html`):** MSK Labs ekosisteminde kullanıcı iletişimi, hata bildirimleri ve özellik talepleri e-posta kutularına değil; takip numaralı, kayıt altına alınabilir **Canlı Destek Masasına** (`msklabs.org/destek.html`) yönlendirilir.
2. **E-Postaların Rolü (Meşruiyet ve Onay Kalkanı):** Kurumsal e-posta adresleri, operasyonel sohbet için değil; **Google Ads, Google AdSense, Arama Motoru SEO Şemaları (JSON-LD) ve Resmi Yayıncı Doğrulamalarında** meşruiyet sağlamak ve spam filtrelerine takılmamak amacıyla kurgulanmıştır.
3. **Vitrinde `@gmail.com` Yasağı:** Kullanıcıya görünen hiçbir arayüzde (HTML, JS, CSS, JSON-LD, Footer) şahsi veya kurumsal `@gmail.com` adresi sergilenemez. Yalnızca resmi `@msklabs.org` adresleri kullanılır.

---

## 📬 2. Cloudflare Email Routing Tablosu (Gelen / Inbound)

Tüm kurumsal adresler Cloudflare DNS üzerinde MX (`route1/2/3.mx.cloudflare.net`) ve SPF ile korunmakta olup, gelen tüm iletiler tek bir doğrulanmış yönetim merkezine yönlendirilir:

| Kurumsal E-Posta | Dil / Rol | Yönlendirme Hedefi | Birincil Kullanım Alanı |
| :--- | :--- | :--- | :--- |
| **`iletisim@msklabs.org`** | TR / Kurumsal | `msklabs.org@gmail.com` | Vitrin, `config.js`, Genel İletişim, AdSense, Yasal Bildirimler, KVKK |
| **`contact@msklabs.org`** | EN / Corporate | `msklabs.org@gmail.com` | İngilizce / Uluslararası kurumsal temas ve SEO şemaları |
| **`destek@msklabs.org`** | TR / Destek | `msklabs.org@gmail.com` | Destek Masası doğrulama adresi, bilet köprüsü |
| **`support@msklabs.org`** | EN / Support | `msklabs.org@gmail.com` | Uluslararası teknik destek meşruiyet adresi |
| **`admin@msklabs.org`** | Sistem / Teknik | `msklabs.org@gmail.com` | Domain Whois, DNS, SSL uyarıları, teknik altyapı bildirimleri |
| **`bildirim@msklabs.org`** | TR / Sistemik | `msklabs.org@gmail.com` | Blog yorum onayı, çift onay (double opt-in), bilet alındı teyitleri |
| **`noreply@msklabs.org`** | EN / Systemic | `msklabs.org@gmail.com` | Otomatik giden bildirimlerin evrensel yanıtlanamaz kalkanı |
| **`bilgi@msklabs.org`** | TR / Danışma | `msklabs.org@gmail.com` | Genel danışma ve akademik/teknik bilgi talepleri |
| **`info@msklabs.org`** | EN / Inquiries | `msklabs.org@gmail.com` | Uluslararası bilgi talepleri |
| **`*@msklabs.org` (Catch-All)** | Yedek Havuz | `msklabs.org@gmail.com` | Yanlış yazılan veya bilinmeyen tüm `@msklabs.org` postaları kayıpsız toplanır |

---

## 🚀 3. Giden E-Posta Mimarisi (Outbound / Resend API)

* **Sağlayıcı:** Resend API (`backend/src/utils/email.ts`).
* **Doğrulanmış Alan Adı (Verified Domain):** `msklabs.org` (DKIM: `resend._domainkey.msklabs.org`).
* **Kredi Kartı / Maliyet:** $0 / Ay (Sıfır Maliyet İlkesi — Kural 0).
* **Kotası:** Aylık 3.000 e-posta, günlük azami 100 e-posta (Tam beyaz etiket, reklamsız).
* **Gönderici Kimlik Mantığı:**
  - `options.emailType === 'verification' || 'newsletter' || 'coupon'` -> Gönderici: `MSK Labs Bildirim <bildirim@msklabs.org>`
  - `options.emailType === 'ticket_confirmation' || 'reply'` -> Gönderici: `MSK Labs Destek <destek@msklabs.org>`
* **Yüksek Hacim Yedeği (`COM-OUTBOUND-002`):**
  - Eğer blog yorumları veya destek talepleri günlük 100 kotasını aşarsa, ilgili modül doğrudan **Brevo API** (günlük 300 mail, kartsız) yedeğine geçirilir.

---

## 🛠️ 4. AI Kod Ajanları İçin Kesin Kurallar (Do's and Don'ts)

### ❌ KESİNLİKLE YAPILMAYACAKLAR:
1. **Asla Vitrine Gmail Yazma:** `webMSKLabs` altındaki hiçbir `.html` veya `.js` dosyasına `msklabs.org@gmail.com` veya şahsi Gmail adresleri yazılamaz.
2. **Asla `.com` Kalıntısı Bırakma:** Proje domaini `msklabs.org`'dur; kodlarda veya testlerde `msklabs.com` kullanılamaz.
3. **Ayrı `kvkk@` Posta Kutusu Açma:** Yasal ve KVKK süreçleri `iletisim@msklabs.org` üzerinden yürütülür; şemalara ayrı adres eklenemez.
4. **Harici E-Posta Sunucusu Dayatma:** Ücretli IMAP/POP3 veya GSuite satın alma önerilemez; Cloudflare Routing + Resend $0 yapısı korunur.

###  DAİMA UYGULANACAKLAR:
1. **Merkezi Konfigürasyona Bağlan:** Tüm yeni web sayfalarında e-posta gerektiğinde `window.SITE_CONFIG.contactEmail` (`iletisim@msklabs.org`) kullanılmalıdır.
2. **Kullanıcıyı Destek Masasına Yönlendir:** Sayfalardaki iletişim butonları e-posta `mailto:` linki yerine doğrudan `destek.html` sayfasına gitmelidir.
3. **Gizli Bilgileri Kasada Tut:** Resend API anahtarları ve Cloudflare secret'ları asla commitlenmez; `CREDENTIALS.enc` kasasında şifrelenir.
