# MSKLabsDesk — Destek, Talep, Yorum ve Bülten Yönetim Sistemi
## Proje Görev ve Uygulama Planı (tasks.md)

---

### 📌 Proje ve Repo Bilgileri
* **Yerel Dizin:** `d:\Code\mskaymaz\MSKLabsDesk`
* **Uzak GitHub Reposu:** `https://github.com/mskaymaz/MSKLabsDesk` (Private)
* **Backend:** Cloudflare Workers (TypeScript)
* **Veritabanı:** Cloudflare D1 (Serverless SQLite / 5 GB Depolama)
* **Hosting / Frontend:** Cloudflare Pages (PWA - Masaüstü & Mobil Responsive)
* **Yapay Zeka:** Google Gemini API (Free Tier - Mesaj Sınıflandırma, Özet & Cevap Taslağı)
* **E-Posta Servisi:** Google Gmail SMTP (`msklabs.org@gmail.com`) + Resend Fallback
* **Gönderici Kimliği:** `MSK Labs <msklabs.org@gmail.com>`
* **Bildirimler:** Web Push Notifications (VAPID)

---

### 🚨 Geliştirme Kuralları ve Kısıtlamalar (Zorunlu)
1. **Dosya Boyutu Sınırı:** Kod içeren hiçbir dosya **400 - 450 satırı geçmeyecektir**. Kodlar küçük, temiz ve modüler parçalara bölünecektir.
2. **Kapsam Odaklılık (Cerrahi Müdahale):** Yalnızca belirtilen ve istenen nokta/dosya üzerinde işlem yapılacak, ilgili olmayan kodlara kesinlikle dokunulmayacaktır.
3. **Onaysız Tarama / İşlem Yasağı:** Kullanıcının açık talimatı ve onayı olmadan tüm repo genelinde tarama/gezinme yapılmayacak, geniş kapsamlı değişiklik başlatılmayacaktır.

---

## 🛠️ Görev Listesi

> 🔍 **Denetim [04.10.2026 - 23:50]:** İşaretler kodla karşılaştırılarak düzeltildi. ⚠️ notlu maddeler Aşama 10.5 / 10.6 / 10.7'de kapatılacak.

### 1. Hazırlık ve Altyapı Kurulumu
- [x] Backend projesi kurulumu (`backend/` - Cloudflare Workers + TypeScript + Wrangler)
- [x] Frontend projesi kurulumu (`frontend/` - Vite + React / PWA konfigürasyonu)
- [ ] Cloudflare D1 veritabanı oluşturulması ve `wrangler.toml` bağlantısı ⚠️ *`database_id` hâlâ dummy → 10.5*
- [ ] E-posta servis entegrasyonu konfigürasyonu ⚠️ *Gmail SMTP Workers'ta yok; Resend + alan adı → 10.6*

---

### 2. Veritabanı Şeması Tasarımı (D1 SQL Migrations)
- [x] `messages` tablosu (Destek & talep kayıtları, bilet no, kategori, durum, AI özet/taslak)
- [x] `message_events` tablosu (Mesaj durum değişiklikleri ve audit logları)
- [x] `replies` tablosu (Yöneticilerin mesajlara verdiği yanıtlar)
- [x] `comments` tablosu (Blog yazıları altına gelen yorumlar, onay durumları)
- [x] `subscribers` tablosu (E-posta bülten aboneleri ve doğrulama tokenları)
- [x] `subscriber_preferences` tablosu (Kullanıcı abonelik tercihleri: Blog, Uygulama, Sürüm vb.)
- [x] `email_queue` tablosu (Toplu bülten gönderimleri için akıllı e-posta kuyruğu)
- [x] `coupons` tablosu (Değerli hata bildirimi/öneri yapan kullanıcılar için hediye/kupon kodları)
- [x] `admins` tablosu (Yönetici hesapları ve yetki rolleri)

---

### 3. Backend API Geliştirmesi (Cloudflare Workers)
- [x] **Destek API:** Destek/talep formu kabul endpoint'i (`POST /api/support`), Bilet No üretici (`MSK-YYYY-XXXX`)
- [x] **Blog Yorum API:** Blog yorum kabul endpoint'i (`POST /api/comments` & `GET /api/comments`)
- [x] **Abonelik API:** Bültene abone olma (`POST /api/subscribe`) ve Abonelikten çıkma/tercih güncelleme (`POST /api/unsubscribe`)
- [x] **Admin Auth API:** Güvenli yönetici girişi ve JWT/Session yönetimi
- [x] **Admin Mesaj İşlemleri API:** Mesaj listeleme, detay görme, onaylama, reddetme, cevaplama
- [x] **Admin Yorum İşlemleri API:** Yorum onaylama/reddetme
- [x] **Admin E-Posta / Duyuru API:** Toplu bülten oluşturma ve kuyruğa ekleme (`POST /api/admin/broadcast`)
- [ ] **Kupon Üretim API:** Özel kupon/teşekkür kodu oluşturma ve e-posta ile iletme ⚠️ *→ 10.6*

---

### 4. Yapay Zeka Entegrasyonu (Google Gemini API)
- [x] Gemini API istemcisinin kurulması
- [x] Gelen destek mesajını otomatik analiz etme (Spam kontrolü, aciliyet, kategori belirleme)
- [x] Mesaj özeti çıkarma ve yönetici için önerilen cevap taslağı (`ai_draft`) üretme
- [x] Prompt injection koruması (Kullanıcı mesajının sistem talimatlarını bozmasını engelleme)

---

### 5. Akıllı E-Posta Gönderim & Kuyruk Motoru
- [ ] ~~Gmail SMTP (`msklabs.org@gmail.com`) gönderici modülünün yazılması~~ ⚠️ *İptal: Resend + doğrulanmış alan adı → 10.6*
- [ ] Otomatik E-posta Şablonları (HTML):
  - [x] Bilet Alındı Onay E-postası (Kullanıcıya)
  - [x] Destek Cevap E-postası (Kullanıcıya)
  - [ ] Kupon / Teşekkür E-postası (Kullanıcıya) ⚠️ *→ 10.6*
  - [ ] Bülten / Duyuru E-postası (Abonelere - Tercih bazlı + Unsubscribe linkli) ⚠️ *→ 10.6*
- [ ] `email_queue` işleyici (Günlük kotalara takılmadan mailleri kontrollü ve spamsız gönderme) ⚠️ *`scheduled()` cron yok → 10.6*

---

### 6. PWA Yönetim Paneli Arayüzü (Masaüstü & Mobil Responsive)
- [x] **Giriş Ekranı:** Güvenli yönetici oturum açma sayfası
- [x] **Dashboard (Özet Ekranı):** Bekleyen biletler, yeni yorumlar, abone sayısı ve istatistikler
- [x] **Destek & Talep Yönetimi Ekranı:**
  - [x] Mesaj listesi (Filtreleme, arama, durum rozetleri)
  - [x] Mesaj detay kartı (AI özeti, işlem geçmişi, bilet numarası)
  - [x] Cevap yazma ve AI cevabını tek tıkla aktarma
  - [x] Onayla / Reddet / Durum Güncelle düğmeleri
  - [x] "Kupon Tanımla & Teşekkür Et" düğmesi ve modalı
- [x] **Blog Yorum Yönetimi Ekranı:**
  - [x] Bekleyen yorumlar akışı
  - [x] Yorumu Onayla (Sitede yayınla) / Reddet (Spam) düğmeleri
- [x] **Bülten & E-Posta Yayın Ekranı:**
  - [x] Toplu duyuru/bülten oluşturma formu
  - [x] Hedef kitle tercihi seçimi (Blog yazıları, Yeni uygulamalar, Güncellemeler)
  - [x] Canlı gönderim ilerleme çubuğu (%15 gönderildi...)
- [x] **Abonelik Yönetim Ekranı:** Abone listesi, aktiflik durumları
- [x] **Ayarlar Ekranı:** Gönderici adı (`MSK Labs`), E-posta şablonları, Web Push bildirim izinleri

---

### 7. Anlık Bildirimler (Web Push Notifications)
- [ ] Service Worker VAPID altyapısının PWA'ya eklenmesi (`SettingsView.tsx` & `vite-plugin-pwa`) ⚠️ *Sadece izin isteği var → 10.6*
- [ ] Yeni destek mesajı veya yorum geldiğinde yöneticiye anlık push notification altyapısı hazırlanması ⚠️ *Sunucu gönderimi yok → 10.6*

---

### 8. Web Sitesi Entegrasyonu (`webMSKLabs`) & Testler
- [ ] `webMSKLabs` destek formunun yeni Cloudflare API'ye bağlanması (`msklabs-desk-embed.js`) ⏳ *Henüz başlanmadı: webMSKLabs'a hiçbir şey uygulanmadı, entegrasyon sonraki aşama (Aşama 15)*
- [ ] `webMSKLabs` blog detay sayfasına bülten abonelik kutusu ve yorum formunun eklenmesi ⏳ *Henüz başlanmadı: yalnızca rehber doküman hazır (`webMSKLabs_integration_guide.md`)*
- [x] Google Sheets'teki mevcut verilerin D1 SQLite veritabanına aktarım betiği (`scripts/import_google_sheets.js`)
- [ ] Uçtan uca mobil & masaüstü testleri ⏳ *Canlı ortam yok → Aşama 14*

---

### 9. Çoklu Dil (TR, EN, AR) Entegrasyonu & i18n Altyapısı
- [x] **PWA Panel i18n Kurulumu:** `frontend/src/i18n/translations.ts` ve `I18nContext.tsx` dil motorunun kurulması (TR, EN, AR sözlük dosyaları)
- [ ] **i18n'in tüm ekranlara uygulanması** ⚠️ *`t()` sadece `Sidebar.tsx`'te; 11 ekran sabit Türkçe → 10.6*
- [x] **Dil Seçici Bileşeni:** `Sidebar.tsx` içerisine 🇹🇷 TR / 🇬🇧 EN / 🇸🇦 AR bayrak seçicinin eklenmesi ve dinamik çeviri entegrasyonu
- [x] **Arapça (AR) RTL Desteği:** `index.css` ve `App.tsx` içerisine Cairo yazı tipi, `<html dir="rtl">` ve Arapça hizalama/düzen desteği
- [x] **Embed Form Dil Algılama:** `msklabs-desk-embed.js` scriptinin çağrıldığı sayfanın lang etiketine göre (TR/EN/AR) otomatik form dili yüklemesi
- [x] **3 Dilli E-Posta Şablonları:** `backend/src/utils/emailTemplates.ts` modülünün TR, EN ve AR dil ve RTL destekli olarak hazırlanması


---

### 10. Dynamic Headless Admin CMS (Blog, Uygulamalar, Medya, Şablonlar & SEO)

#### 10.1 Cloudflare D1 Veritabanı Şemaları & Migration (`backend/migrations/0002_cms_schema.sql`)
- [x] `blog_channels` tablosu (Dinamik Blog Kanalları: Hikayeler, Şiirler vb. - slug, name_tr/en/ar, description_tr/en/ar, icon, order, is_active)
- [x] `blog_posts` tablosu (Makaleler: channel_id, slug, title_tr/en/ar, content_tr/en/ar, summary_tr/en/ar, cover_image, status [draft/scheduled/published], views_count, published_at)
- [x] `apps` tablosu (Uygulamalar: app_id, name_tr/en/ar, description_tr/en/ar, icon_url, cover_url, category, platform, order, is_active)
- [x] `app_versions` tablosu (Sürümler: app_id, version_name, version_code, changelog_tr/en/ar, download_url, file_size, platform, is_mandatory, released_at)
- [x] `site_templates` tablosu (Şablonlar & Reklamlar: key [announcement_bar, footer_links, ad_banner_top, etc.], content_tr/en/ar, is_active)
- [x] `media_assets` tablosu (Medya Kütüphanesi: filename, url, file_size, mime_type, alt_text_tr/en/ar)
- [x] `comments` tablosu güncellemesi (`post_id` ilişkisinin kurulması)


#### 10.2 Backend Headless CMS API (Cloudflare Workers TypeScript)
- [x] **Kanal Yönetim API:** `GET/POST/PUT/DELETE /api/admin/channels` (`cmsChannels.ts` - Blog Kanalı Ekleme/Düzenleme/Sıralama)
- [x] **Blog Yazıları API:** `GET/POST/PUT/DELETE /api/admin/posts` (`cmsPosts.ts` - Yazı Ekleme, Taslak/Yayın Durumu, Görsel Bağlama)
- [x] **Gemini AI Çeviri & SEO API:** `POST /api/admin/translate` (`ai.ts` & `cmsPosts.ts` - Türkçe başlık ve içeriği Gemini ile EN ve AR'ye çevirme, SEO özet üretme)
- [x] **Uygulama Kataloğu API:** `GET/POST/PUT/DELETE /api/admin/apps` (`cmsApps.ts` - Uygulama Bilgileri ve İndirme Linkleri)
- [x] **Sürüm Güncelleme API:** `POST /api/admin/apps/:id/versions` (`cmsApps.ts` - Yeni APK/Sürüm Yayınlama)
- [x] **Şablon & Reklam API:** `GET/PUT /api/admin/templates` (`cmsTemplates.ts` - Header Duyurusu, Reklam Kodları, Footer Linkleri)
- [x] **Public (Public/Ziyaretçi) API Endpoint'leri (webMSKLabs İçin):**
  - [x] `GET /api/v1/channels` (Aktif Blog Kanalları)
  - [x] `GET /api/v1/posts` (Blog Yazıları + Kanal Filtresi + Dil Seçeneği + Sayfalama)
  - [x] `GET /api/v1/posts/:slug` (Tekil Blog Detayı + Okuma Sayısı Artırma)
  - [x] `GET /api/v1/apps` (Aktif Uygulama Kataloğu - `app_catalog.json` canlı karşılığı)
  - [x] `GET /api/v1/templates` (Duyuru Barları, Reklamlar ve Şablonlar)
  - [x] `GET /api/v1/sitemap.xml` (Otomatik XML Sitemap Üretimi)


#### 10.3 PWA Yönetim Paneli Ekranları (Frontend React + TypeScript)
- [x] **Blog Kanal Yönetim Ekranı (`ChannelsView.tsx`):** Sıfırdan dinamik yeni blog türü tanımlama (Hikaye, Şiir, Teknoloji vb.) ve TR/EN/AR isim/ikon girme
- [x] **Blog Yazıları Liste Ekranı (`PostsView.tsx`):** Kanal ve yayın durumu filtreli tablo, okunma sayıları, hızlı silme/taslağa alma
- [x] **3 Dilli Gelişmiş Blog Editörü (`PostsView.tsx Modal`):**
  - [x] Zengin Metin Editörü (Markdown / HTML desteği)
  - [x] TR / EN / AR Sekmeli İçerik ve Başlık Girişi
  - [x] **"✨ AI ile Diğer Dillere Çevir & SEO Özeti Üret"** düğmesi
  - [x] Kapak Resmi Seçici ve Otomatik Slug Üretici
  - [x] Taslak Kaydet / Canlıya Al Seçenekleri
- [x] **Uygulama Kataloğu Yönetim Ekranı (`AppsCMSView.tsx`):**
  - [x] Uygulama Kartları, Platform Simgeleri ve İndirme Linkleri Yönetimi
  - [x] Sürüm / APK Güncelleme Modalı (`app_catalog.json` canlı yönetimi)
- [x] **Şablon & Reklam Yönetim Ekranı (`TemplatesView.tsx`):**
  - [x] Header Duyuru Bandı (Metin, Renk, Link, Aktif/Pasif)
  - [x] Reklam Alanları Yönetimi (AdSense Kodları / Sponsor Banners)

#### 10.4 Veri Taşıma & Entegrasyon Betikleri
- [x] `app_catalog.json` dosyasındaki mevcut uygulamaları D1 DB'ye aktaran betik (`scripts/import_apps_catalog.js`)
- [x] `webMSKLabs` sitesinin bu yeni Public API'leri tüketmesi için Entegrasyon Dokümanı (`webMSKLabs_cms_integration.md`)

---

> 📌 **Çalışma Sırası:** 10.5 → 10.6 → 10.7 → (11 · 12 · 13) → 14. Her madde = tek dosya, tek iş. `✔` = kabul kriteri (bitti tanımı).
> 🧭 **Varsayılan kararlar (onay bekliyor):** E-posta = Resend + kendi alan adı · Editör = TipTap · Çeviri GPT-4o = opsiyonel Faz C.

### 10.5 Canlıya Hazırlık & Güvenlik Sağlamlaştırma

#### 10.5.1 Cloudflare Kurulumu
- [ ] `wrangler d1 create msklabsdesk_db` → gerçek ID `backend/wrangler.toml`'a · ✔ `wrangler d1 list` ID'yi gösterir
- [ ] `0001` ve `0002` migration'larının uzak D1'e uygulanması · ✔ `sqlite_master` 15 tablo döner
- [ ] `backend/.dev.vars.example` (yeni): Tüm secret adları (değersiz) · ✔ README'de referans
- [ ] `DEPLOY.md` (yeni): Worker + Pages + D1 + secret kurulum adımları

#### 10.5.2 Kimlik Doğrulama (`backend/src/utils/auth.ts`)
- [ ] Varsayılan secret fallback'ini kaldır; secret yoksa 500 dön · ✔ secret'sız login başarısız
- [ ] `hashPassword` → PBKDF2 (WebCrypto, 100k iterasyon, rastgele salt) · ✔ aynı parola iki farklı hash
- [ ] Mevcut admin parolası için tek seferlik yeniden hash/sıfırlama notu (`DEPLOY.md`)
- [ ] Token imzası → HMAC-SHA256 (`crypto.subtle.sign`) · ✔ değiştirilmiş payload reddedilir
- [ ] Oturum süresi 30 gün → 7 gün · ✔ süresi dolan token 401

#### 10.5.3 İstek Güvenliği
- [ ] `index.ts`: CORS'u `ALLOWED_ORIGINS` env listesine bağla · ✔ yabancı origin'e header dönmez
- [ ] `utils/rateLimit.ts` (yeni): D1 tabanlı IP+rota sayacı · ✔ limit aşımında 429
- [ ] `adminAuth.ts`: Login'e rate-limit (5 deneme / 15 dk)
- [ ] `support.ts`: Rate-limit uygula
- [ ] `comments.ts`: Rate-limit uygula
- [ ] `subscribe.ts`: Rate-limit uygula
- [ ] `utils/turnstile.ts` (yeni): Cloudflare Turnstile doğrulama · ✔ geçersiz token 403
- [ ] `support.ts` · `comments.ts` · `subscribe.ts`: Turnstile kontrolü (dosya başına 1 iş)
- [ ] `utils/sanitize.ts` (yeni): İzinli etiket listesiyle HTML temizleyici · ✔ `<script>`, `on*=` silinir
- [ ] `cmsPosts.ts`: Kayıtta `content_tr/en/ar` alanlarını sanitize et

---

### 10.6 Eksik Özelliklerin Kapanışı

#### 10.6.1 E-Posta (Resend + Doğrulanmış Alan Adı)
- [ ] Resend'de alan adı doğrulama (SPF/DKIM) + gönderici `noreply@<alanadı>` · ✔ Resend panelinde "Verified"
- [ ] `utils/email.ts`: Anahtar yoksa `success:false` dön; simülasyon sadece `ENV=dev` · ✔ prod'da sahte başarı yok
- [ ] `utils/email.ts`: Gönderici adresini `EMAIL_FROM` env'den oku
- [ ] `utils/emailQueue.ts` (yeni): `processQueue(env, limit=20)` → pending gönder, durum/hata yaz
- [ ] `index.ts`: `scheduled()` handler → `processQueue` çağır
- [ ] `wrangler.toml`: `[triggers] crons = ["*/5 * * * *"]` · ✔ kuyruk 5 dk içinde boşalır
- [ ] `emailTemplates.ts`: `getCouponEmail()` (TR/EN/AR)
- [ ] `emailTemplates.ts`: `getNewsletterEmail()` + abonelikten çıkma linki

#### 10.6.2 Kupon
- [ ] `routes/adminCoupons.ts` (yeni): `POST /api/admin/coupons` → DB'ye yaz + e-postayı kuyruğa ekle
- [ ] `index.ts`: Kupon rotasını bağla
- [ ] `services/api.ts`: `createCoupon()` fonksiyonu
- [ ] `CouponModal.tsx`: Rastgele üretimi kaldır, API'yi çağır · ✔ kupon `coupons` tablosunda görünür

#### 10.6.3 Web Push
- [ ] VAPID anahtar çifti üret → private `wrangler secret`, public `VITE_VAPID_PUBLIC_KEY`
- [ ] `0003_push_subscriptions.sql`: `push_subscriptions` tablosu
- [ ] `routes/adminPush.ts`: `POST /api/admin/push/subscribe`
- [ ] `SettingsView.tsx`: `pushManager.subscribe()` + API'ye kaydet
- [ ] `utils/webPush.ts`: VAPID imzalı push gönderimi
- [ ] `support.ts` + `comments.ts`: Yeni kayıtta yöneticilere push · ✔ telefonda bildirim düşer

#### 10.6.4 i18n'in Tüm Ekranlara Uygulanması (ekran başına 1 iş)
- [ ] `DashboardView.tsx` → `t()`
- [ ] `TicketsView.tsx` → `t()`
- [ ] `TicketDetailModal.tsx` → `t()`
- [ ] `CommentsView.tsx` → `t()`
- [ ] `BroadcastView.tsx` → `t()`
- [ ] `SubscribersView.tsx` → `t()`
- [ ] `SettingsView.tsx` → `t()`
- [ ] `LoginView.tsx` → `t()`
- [ ] `ChannelsView.tsx` → `t()`
- [ ] `PostsView.tsx` (bölündükten sonra) → `t()`
- [ ] `AppsCMSView.tsx` → `t()`
- [ ] `TemplatesView.tsx` → `t()`
- [ ] `scripts/check_i18n_keys.js`: TR'de olup EN/AR'da olmayan anahtarları listele · ✔ 0 eksik

#### 10.6.5 Medya Yükleme (R2)
- [ ] `wrangler.toml`: R2 bucket binding (`MEDIA`)
- [ ] `routes/cmsMedia.ts`: `POST /api/admin/media` (multipart → R2 + `media_assets`)
- [ ] `routes/cmsMedia.ts`: `GET` liste + `DELETE`
- [ ] Boyut/tür sınırı (≤5 MB; jpg/png/webp/gif) · ✔ 6 MB dosya reddedilir

#### 10.6.6 Satır Sınırı Düzeltmesi
- [ ] `PostsView.tsx` (454 satır) → `PostList.tsx` + `PostEditorModal.tsx` · ✔ her biri < 300 satır

---

### 10.7 Premium Admin UI Altyapısı (Design System)
> 11-13'teki tüm modallar bu ortak bileşenleri kullanır; kod tekrarı ve satır sınırı ihlali önlenir.

#### 10.7.1 Tasarım Token'ları (`frontend/src/index.css`)
- [ ] Renk (HSL), spacing (4px ölçeği), radius, shadow, z-index, motion süreleri
- [ ] Light tema token seti (`[data-theme="light"]`) + tema geçiş anahtarı
- [ ] `prefers-reduced-motion` desteği

#### 10.7.2 Ortak Bileşenler (`frontend/src/components/ui/`)
- [ ] `Button.tsx`: primary / ghost / danger + loading durumu
- [ ] `Modal.tsx`: Odak kilidi, ESC ile kapanma, giriş animasyonu
- [ ] `Toast.tsx` + `ToastContext.tsx`: `alert()` yerine bildirim kutusu
- [ ] `Skeleton.tsx`: "Yükleniyor..." metinleri yerine iskelet
- [ ] `EmptyState.tsx`: İkonlu boş durum kartı
- [ ] `Tabs.tsx`: TR/EN/AR sekmeleri için tek bileşen
- [ ] `Slider.tsx` · `Toggle.tsx` · `Select.tsx` (her biri 1 iş)
- [ ] `DeviceFrame.tsx`: Masaüstü / Tablet / Mobil önizleme çerçevesi (11 ve 12 ortak)

#### 10.7.3 Mevcut Ekranlara Uygulama
- [ ] Tüm `alert()` çağrılarını toast'a çevir (dosya başına 1 iş)
- [ ] Inline `style={{}}` → CSS sınıfları (ekran başına 1 iş)
- [ ] Mobil: Sidebar → alt navigasyon (≤768px)
- [ ] `DashboardView.tsx`: 7/30 günlük talep grafiği (hafif SVG, kütüphanesiz)
- [ ] Erişilebilirlik: Odak halkaları, `aria-label`, kontrast ≥ 4.5:1

---

### 11. Gelişmiş AdSense & Reklam Yerleşim Motoru (Ad Customizer & Live Preview)

#### 11.1 Veritabanı (`backend/migrations/0004_ad_settings.sql`)
- [ ] `ad_settings` tablosu: `ad_key` UNIQUE, `ad_client`, `ad_slot`, `ad_format` (dil alanı yok; AdSense dilden bağımsız)
- [ ] `preset_type TEXT CHECK(... IN ('responsive','728x90','300x250','336x280','160x600','300x600','320x100','320x50','970x90','970x250','custom'))`
- [ ] `custom_width`, `custom_height` TEXT (px veya %)
- [ ] `margin_top`, `margin_bottom`, `padding` INTEGER DEFAULT 0
- [ ] `alignment` CHECK (`left`,`center`,`right`,`fluid`) · `sticky_mode` INTEGER 0/1
- [ ] `device_visibility` CHECK (`all`,`desktop_only`,`mobile_only`) · `placement` (`header`,`in_article`,`sidebar`,`footer`) · `is_active`
- [ ] Seed: 4 varsayılan reklam alanı kaydı · ✔ `SELECT COUNT(*)` = 4

#### 11.2 Backend API
- [ ] `utils/validate.ts` (yeni): Bağımlılıksız doğrulama yardımcıları (Zod yerine)
- [ ] `routes/cmsAds.ts`: `GET /api/admin/ads`
- [ ] `routes/cmsAds.ts`: `PUT /api/admin/ads/:key` + doğrulama · ✔ geçersiz preset 400
- [ ] `index.ts`: `/api/admin/ads` rotasını bağla
- [ ] `cmsPublic.ts`: `GET /api/v1/ads` + `Cache-Control: max-age=300`

#### 11.3 PWA Reklam Paneli (`AdSettingsModal.tsx`)
- [ ] `constants/adPresets.ts`: 10 AdSense ebadı + etiket + kullanım önerisi
- [ ] Preset seçici (görsel ebat kartları)
- [ ] Custom seçilince genişlik/yükseklik input'ları
- [ ] Üst/alt marj slider'ları (`Slider.tsx`)
- [ ] İç boşluk (padding) slider'ı
- [ ] Hizalama seçici (Sol / Orta / Sağ / Fluid)
- [ ] Sticky toggle + AdSense politika uyarı kutusu
- [ ] Cihaz görünürlüğü toggle'ları
- [ ] `TemplatesView.tsx`: Reklam alanı listesi + "Düzenle" → modal

#### 11.4 Canlı Önizleme (`AdPreviewModal.tsx`)
- [ ] `DeviceFrame` içinde simüle `webMSKLabs` sayfa iskeleti
- [ ] Ölçülü yer tutucu reklam kutusu (gerçek AdSense admin'de servis edilmez)
- [ ] Ölçü etiketi (ör. "728 × 90") + marj göstergeleri
- [ ] Ayar değişince anlık güncelleme (kaydetmeden) · ✔ slider hareketi önizlemeye yansır
- [ ] Önizlemede sürükleyerek marj ayarı (görsel tutamaç)

#### 11.5 webMSKLabs Entegrasyon Dokümanı (sadece bu repoda doküman)
- [ ] `ads-loader.js` taslağı: `/api/v1/ads` → reklam yerleştirme
- [ ] `ads.txt` içeriği ve yeri
- [ ] AdSense CMP / çerez onayı (AB/İngiltere) gereksinim notu

---

### 12. Modüler Blog Düzenleyici (Layout Builder) & Zengin Editör (TipTap)

#### 12.1 Editör Kurulumu (`frontend/src/components/editor/`)
- [ ] TipTap kurulumu (`@tiptap/react`, `@tiptap/starter-kit`) · ✔ boş editör render olur
- [ ] `RichTextEditor.tsx`: Temel araç çubuğu (B / I / U / S, H2-H4, listeler, alıntı)
- [ ] Eklenti: `TextAlign`
- [ ] Eklenti: `Link` (+ `target`, `rel` seçenekleri)
- [ ] Eklenti: `Color` + `Highlight`
- [ ] Eklenti: `FontFamily` (Inter, Roboto, Playfair Display, Cairo) + punto seçici
- [ ] Eklenti: `Table`
- [ ] `PostEditorModal.tsx`: textarea yerine `RichTextEditor`

#### 12.2 Görsel Yönetimi
- [ ] Eklenti: `Image` + sürükle-bırak → `/api/admin/media`
- [ ] `utils/compressImage.ts`: Canvas ile WebP + max 1600px · ✔ 3 MB → < 400 KB
- [ ] Görsel node: Köşe tutamaçlarıyla resize
- [ ] Görsel node: %50 / %75 / %100 butonları
- [ ] Görsel node: Hizalama (sol / sağ / orta / tam genişlik)
- [ ] Görsel node: `alt` + caption alanları

#### 12.3 Güvenli Kayıt
- [ ] Otomatik taslak kaydı (30 sn, `localStorage`) + "Kaydedilmemiş değişiklik" uyarısı
- [ ] `0005_blog_layouts.sql`: `post_revisions` tablosu (sürüm geçmişi)
- [ ] `cmsPosts.ts`: Her kayıtta revizyon ekle
- [ ] Revizyon listesi + geri yükleme butonu

#### 12.4 Layout Builder
- [ ] `0005_blog_layouts.sql`: `blog_layouts` (`blocks_json`, `theme_preset`, `font_family`, `reading_width`, `is_default`)
- [ ] `routes/cmsLayouts.ts`: `GET` / `PUT /api/admin/layouts`
- [ ] `cmsPublic.ts`: `GET /api/v1/layout`
- [ ] `LayoutBuilder.tsx`: Blok listesi + yukarı/aşağı butonları (önce bu)
- [ ] `LayoutBuilder.tsx`: Sürükle-bırak (`@dnd-kit/sortable`) (ikinci adım)
- [ ] Blok başına görünürlük toggle + ayar paneli
- [ ] Tema seçici (`glassmorphism_dark`, `minimal_light`, `editorial_magazine`, `modern_tech`)

#### 12.5 Taslak Önizleme (`PostPreviewModal.tsx`)
- [ ] `DeviceFrame` + seçili layout ile render
- [ ] TR / EN / AR sekmeleri + Arapça RTL
- [ ] Taslak (`draft`) yazıyı yayınlamadan önizleme · ✔ yayın durumu değişmez

#### 12.6 webMSKLabs Entegrasyon Dokümanı
- [ ] `blocks_json` → HTML render sözleşmesi (blok tipleri + alanlar)
- [ ] `innerHTML` yerine sanitize edilmiş içerik kullanımı notu

#### 12.7 İkinci Faz (Düşük Öncelik)
- [ ] Görev listesi (checklist) eklentisi
- [ ] Kod bloğu syntax highlighting

---

### 13. Çeviri Kalite Denetçisi (Aşamalı: Gemini → DeepL → GPT opsiyonel)
> Ön koşul: 10.6.4 (i18n tüm ekranlarda) tamamlanmış olmalı.

#### 13.1 Faz A — Geri Çeviri & Terminoloji (Gemini, ücretsiz)
- [ ] `utils/chunk.ts`: HTML'i bozmadan paragraf bölücü · ✔ 5 paragraf → 5 parça
- [ ] `ai.ts`: `backTranslate(text, lang)` → TR'ye geri çeviri
- [ ] `ai.ts`: `scoreFidelity(orig, back)` → `{score: 0-100, reason}` JSON
- [ ] `0006_translation.sql`: `translation_cache` (hash(paragraf+motor+dil) → sonuç)
- [ ] `0006_translation.sql`: `glossary` (TR terim → EN/AR zorunlu karşılık)
- [ ] `ai.ts`: Çeviri prompt'una glossary enjeksiyonu · ✔ "Bilet" → "Support Ticket" sabit

#### 13.2 Faz B — DeepL & Denetim Ekranı
- [ ] `utils/deepl.ts`: DeepL Free istemcisi (`DEEPL_API_KEY` secret) + glossary
- [ ] `POST /api/admin/translate/audit` → paragraf × motor × skor (önbellekli)
- [ ] `TranslationAuditModal.tsx`: Satır = paragraf · Sütun = TR / Gemini / DeepL / Skor
- [ ] Skor rozetleri (≥90 yeşil · 70-89 sarı · <70 kırmızı) + "sadece kırmızılar" filtresi
- [ ] Paragraf başına "Bunu kullan" + "Yeniden üret"
- [ ] "Onaylananları makaleye aktar" butonu
- [ ] `GlossaryView.tsx`: Terim ekle/düzenle/sil ekranı

#### 13.3 Panel Sözlüğü Denetimi
- [ ] `scripts/audit_translations.js`: `translations.ts` tara → öneri raporu üret (dosyaya otomatik yazma YOK)

#### 13.4 Faz C — Opsiyonel
- [ ] GPT-4o hakem (3. görüş) entegrasyonu

---

### 14. Test, Kalite & CI
- [ ] Vitest kurulumu (backend)
- [ ] Test: `auth.ts` (hash, token doğrulama, süresi dolmuş token)
- [ ] Test: `sanitize.ts` (XSS vektörleri)
- [ ] Test: `rateLimit.ts`
- [ ] Test: `chunk.ts`
- [ ] `scripts/check_line_limit.js`: 450 satırı aşan kod dosyasını listele · ✔ ihlalde exit 1
- [ ] `.github/workflows/ci.yml`: typecheck + lint + test + satır kontrolü
- [ ] `SMOKE_TEST.md`: Canlı ortam için 10 adımlık manuel kontrol listesi
- [ ] Uçtan uca test: Form → AI analizi → push → cevap → e-posta (canlıda, 10.5-10.6 sonrası)

---

### 15. webMSKLabs Entegrasyonu (⏳ Henüz başlanmadı — 10.5-14 tamamlanıp onay verildikten sonra)
> ⚠️ Bu aşamaya kadar **webMSKLabs reposuna hiçbir şey uygulanmaz**. Her adım ayrı onayla ve ayrı commit ile yapılır.

- [ ] webMSKLabs için salt-okunur entegrasyon envanteri (hangi sayfa hangi veriyi kullanıyor) · ✔ rapor, kod değişikliği yok
- [ ] Yedek dalı oluştur (git checkout -b feat/msklabsdesk-integration) · ✔ main dokunulmadı
- [ ] Destek formu: Apps Script yerine msklabs-desk-embed.js (tek sayfa, önce destek.html)
- [ ] Blog: /api/v1/posts ile liste sayfası (tek sayfa)
- [ ] Blog detay: /api/v1/posts/:slug + yorum formu + abonelik kutusu
- [ ] Uygulama kataloğu: /api/v1/apps (pp_catalog.json yerine, geri dönüş yedeği korunur)
- [ ] Duyuru bandı + reklam alanları: /api/v1/templates, /api/v1/ads
- [ ] Eski Apps Script akışı kapatılmadan önce paralel çalıştırma testi
- [ ] Canlıya alma + geri alma (rollback) planı
