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

### 1. Hazırlık ve Altyapı Kurulumu
- [ ] Backend projesi kurulumu (`backend/` - Cloudflare Workers + TypeScript + Wrangler)
- [ ] Frontend projesi kurulumu (`frontend/` - Vite + React / PWA konfigürasyonu)
- [x] Cloudflare D1 veritabanı oluşturulması ve `wrangler.toml` bağlantısı
- [x] E-posta servis entegrasyonu konfigürasyonu (`msklabs.org@gmail.com` SMTP & App Password)

---

### 2. Veritabanı Şeması Tasarımı (D1 SQL Migrations)
- [ ] `messages` tablosu (Destek & talep kayıtları, bilet no, kategori, durum, AI özet/taslak)
- [ ] `message_events` tablosu (Mesaj durum değişiklikleri ve audit logları)
- [ ] `replies` tablosu (Yöneticilerin mesajlara verdiği yanıtlar)
- [ ] `comments` tablosu (Blog yazıları altına gelen yorumlar, onay durumları)
- [ ] `subscribers` tablosu (E-posta bülten aboneleri ve doğrulama tokenları)
- [ ] `subscriber_preferences` tablosu (Kullanıcı abonelik tercihleri: Blog, Uygulama, Sürüm vb.)
- [ ] `email_queue` tablosu (Toplu bülten gönderimleri için akıllı e-posta kuyruğu)
- [ ] `coupons` tablosu (Değerli hata bildirimi/öneri yapan kullanıcılar için hediye/kupon kodları)
- [ ] `admins` tablosu (Yönetici hesapları ve yetki rolleri)

---

### 3. Backend API Geliştirmesi (Cloudflare Workers)
- [x] **Destek API:** Destek/talep formu kabul endpoint'i (`POST /api/support`), Bilet No üretici (`MSK-YYYY-XXXX`)
- [x] **Blog Yorum API:** Blog yorum kabul endpoint'i (`POST /api/comments` & `GET /api/comments`)
- [x] **Abonelik API:** Bültene abone olma (`POST /api/subscribe`) ve Abonelikten çıkma/tercih güncelleme (`POST /api/unsubscribe`)
- [x] **Admin Auth API:** Güvenli yönetici girişi ve JWT/Session yönetimi
- [x] **Admin Mesaj İşlemleri API:** Mesaj listeleme, detay görme, onaylama, reddetme, cevaplama
- [x] **Admin Yorum İşlemleri API:** Yorum onaylama/reddetme
- [x] **Admin E-Posta / Duyuru API:** Toplu bülten oluşturma ve kuyruğa ekleme (`POST /api/admin/broadcast`)
- [ ] **Kupon Üretim API:** Özel kupon/teşekkür kodu oluşturma ve e-posta ile iletme

---

### 4. Yapay Zeka Entegrasyonu (Google Gemini API)
- [x] Gemini API istemcisinin kurulması
- [x] Gelen destek mesajını otomatik analiz etme (Spam kontrolü, aciliyet, kategori belirleme)
- [x] Mesaj özeti çıkarma ve yönetici için önerilen cevap taslağı (`ai_draft`) üretme
- [x] Prompt injection koruması (Kullanıcı mesajının sistem talimatlarını bozmasını engelleme)

---

### 5. Akıllı E-Posta Gönderim & Kuyruk Motoru
- [ ] Gmail SMTP (`msklabs.org@gmail.com`) gönderici modülünün yazılması
- [ ] Otomatik E-posta Şablonları (HTML):
  - [ ] Bilet Alındı Onay E-postası (Kullanıcıya)
  - [ ] Destek Cevap E-postası (Kullanıcıya)
  - [ ] Kupon / Teşekkür E-postası (Kullanıcıya)
  - [ ] Bülten / Duyuru E-postası (Abonelere - Tercih bazlı + Unsubscribe linkli)
- [ ] `email_queue` işleyici (Günlük kotalara takılmadan mailleri kontrollü ve spamsız gönderme)

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
- [x] Service Worker VAPID altyapısının PWA'ya eklenmesi (`SettingsView.tsx` & `vite-plugin-pwa`)
- [x] Yeni destek mesajı veya yorum geldiğinde yöneticiye anlık push notification altyapısı hazırlanması

---

### 8. Web Sitesi Entegrasyonu (`webMSKLabs`) & Testler
- [x] `webMSKLabs` destek formunun yeni Cloudflare API'ye bağlanması (`msklabs-desk-embed.js`)
- [x] `webMSKLabs` blog detay sayfasına bülten abonelik kutusu ve yorum formunun eklenmesi (`webMSKLabs_integration_guide.md`)
- [x] Google Sheets'teki mevcut verilerin D1 PostgreSQL/SQLite veritabanına aktarım betiği (`scripts/import_google_sheets.js`)
- [x] Uçtan uca mobil & masaüstü testleri (Form gönderme -> AI analizi -> PWA bildirimi -> Cevaplama -> Mail iletimi)

---

### 9. Çoklu Dil (TR, EN, AR) Entegrasyonu & i18n Altyapısı
- [x] **PWA Panel i18n Kurulumu:** `frontend/src/i18n/translations.ts` ve `I18nContext.tsx` dil motorunun kurulması (TR, EN, AR sözlük dosyaları)
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



