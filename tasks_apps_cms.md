# MSKLabsDesk — Uygulama Kataloğu ve Sürüm Yönetim Sistemi (tasks_apps_cms.md)
> **Tarih-Saat:** 16.10.2026 - 15:40  
> **Durum:** Geliştirme Aşamasında  
> **Dal (Branch):** `DevAdmin` (Ana dal `main` kesin olarak korunur)

---

## 📌 Mimari İlkeler ve Hedefler
* **Sıfır Yeniden Yazım İlkesi:** Yeni sürüm çıktığında uygulamanın ana tanıtım kartı, metinleri veya görselleri bozulmaz; sadece 3 alanlık hızlı sürüm formu (Sürüm Adı, İndirme Linki, Değişiklik Notları) doldurulur.
* **Sabit İndirme Bağlantısı (Permanent Latest URL):** Ziyaretçilere ve istemcilere sunulan indirme adresi sabittir (`/api/public/apps/:slug/download` veya `/dl/:slug`); sistem arka planda en güncel aktif sürüme otomatik yönlendirir.
* **Çok Dilli (TR/EN/AR) & Açık/Koyu Tema:** Tüm başlıklar, açıklamalar ve sürüm değişiklik notları (changelog) 3 dili ve tek tıkla AI çeviriyi destekler.
* **Modülerlik ve Kod Sınırı:** Yardımcı bileşenler ve modallar azami 400-450 satır bandında tutulur.

---

## 📋 AŞAMALAR VE YAPIM BASAMAKLARI

### [x] Aşama 1: Veritabanı (D1) ve Backend REST API
- [x] **1.1 D1 Şema Genişletmesi (`backend/migrations/0007_apps_store_and_features.sql`):**
  - `apps` tablosuna `store_links_json`, `features_tr`, `features_en`, `features_ar`, `screenshots_json`, `downloads_count` sütunları eklendi; HaydiNamaza, RekatSay ve Date Counter başlangıç verileriyle D1 yerel veritabanında başarıyla yürütüldü.
- [x] **1.2 Admin API Geliştirmesi (`backend/src/routes/cmsApps.ts`):**
  - `GET /api/v1/admin/apps` — Tüm uygulamalar, ayrıştırılmış mağaza linkleri ve bağlı sürümler listelendi.
  - `POST /api/v1/admin/apps` — Yeni uygulama ekleme tamamlandı.
  - `PUT /api/v1/admin/apps/:id` — Uygulama kimlik ve mağaza linkleri güncelleme sağlandı.
  - `DELETE /api/v1/admin/apps/:id` — Uygulamayı ve bağlı sürümleri silme eklendi.
  - `POST /api/v1/admin/apps/:id/versions` — Yeni sürüm yayını (Changelog TR/EN/AR) tamamlandı.
  - `DELETE /api/v1/admin/apps/:id/versions/:versionId` — Belirli bir sürümü silme eklendi.
- [x] **1.3 Public API & Sabit Yönlendirme (`backend/src/routes/cmsPublic.ts`):**
  - `GET /api/v1/apps` — Yayındaki aktif uygulamalar vitrin listesi (`store_links`, `latest_version`, `permanent_download_url` ile).
  - `GET /api/v1/apps/:slug` — Seçilen uygulamanın detayları, mağaza linkleri ve son sürüm bilgisi.
  - `GET /api/v1/apps/:slug/download` — En güncel sürüme ait indirme linkine 302 yönlendirmesi + `downloads_count` artırımı doğrulandı.

---

### [x] Aşama 2: Admin Paneli "Uygulama Stüdyosu" (MSKLabsDesk)
- [x] **2.1 Uygulama Kataloğu Ekranı (`frontend/src/views/AppsCMSView.tsx` — 374 satır):**
  - Uygulama kartları, platform rozetleri, aktif son sürüm rozeti, indirme sayacı ve durum anahtarı (Yayında/Taslak).
  - Tek tıkla kalıcı indirme bağlantısı kopyalayıcı (`/api/v1/apps/:slug/download`).
  - Hızlı aksiyon butonları: `+ Sürüm` (30 sn hızlı modal), `Düzenle`, `Sürüm Geçmişi Akordeonu`, `Sil`.
- [x] **2.2 Uygulama Tanımlama & Düzenleme Modalı (`AppModal.tsx` & `AppModalLangFields.tsx` — 439 + 183 satır):**
  - Temel Kimlik: Benzersiz Slug/ID, Ad, Kategori, Platform seçim kutuları, Sıralama, Yayında/Taslak anahtarı.
  - Medya Seçimi: Uygulama İkonu ve Tanıtım Kapağı (R2 Medya Yükleyici / Cihazdan Yükle entegrasyonu).
  - Çok Dilli Tanıtım: Modüler `AppModalLangFields`, TR Açıklama & Özellikler, Tek tıkla Gemini AI Çeviri (EN/AR).
  - Mağaza Bağlantıları: Google Play, App Store, GitHub, Doğrudan APK/İndirme ve Web vitrin URL girişleri.
- [x] **2.3 30 Saniyede Hızlı Sürüm Yayını Modalı (`AppVersionModal.tsx` — 329 satır):**
  - Sürüm Adı (`1.3.0`), Sürüm Kodu (`version_code`), Dosya Boyutu ve Platform.
  - Önceki sürümün indirme bağlantısı varsayılan olarak korunur (sıfır yeniden yazım).
  - Değişiklik Notları: TR Changelog metin alanı + Tek Tıkla AI Çeviri (EN ve AR Fusha).
  - Zorunlu Güncelleme (`is_mandatory`) onay kutusu.
- [x] **2.4 TypeScript & Kod Standartları Doğrulaması:**
  - `npm run build` PASS (0 hata), Kural 2 (400-450 satır sınırı) tüm dosyalarda sağlandı.

---

### [x] Aşama 3: webMSKLabs Dinamik Vitrin Şablonu Entegrasyonu
- [x] **3.1 Dinamik Uygulamalar Kataloğu (`webMSKLabs/apps.html`):**
  - D1 Public API (`/api/v1/apps`) canlı kart ızgarası (`#activeAppsGrid`), çevrimdışı fallback mimarisi.
  - Platform filtreleme çubuğu (`app-filter-pill`: Tümü, Mobil, Masaüstü, Web).
  - Açık/koyu tema ve TR/EN/AR dil anahtarıyla tam uyumlu kart içeriği.
- [x] **3.2 Evrensel Uygulama Detay & İndirme Sayfası (`webMSKLabs/app.html?id=...` — 427 satır):**
  - URL'deki `?id=slug` parametresine göre D1 veritabanından dinamik başlık, ikon, özellikler ve SEO OpenGraph yükleme.
  - Sabit "Hemen İndir" butonu: Doğrudan kalıcı yönlendiriciye (`/api/v1/apps/:slug/download`) bağlı, tek tıkla en güncel APK/EXE indirmesi + indirme sayacı artırımı.
  - Mağaza butonları (Google Play, App Store, Microsoft Store, GitHub, Web vitrin).
  - Sürüm geçmişi (`.version-history-box`), çok dilli Changelog ve arşiv sürümleri indirme bağlantıları.

---

### [x] Aşama 4: Uçtan Uca Entegrasyon, Doğrulama & Kabul
- [x] **4.1 Gerçek Veriyle Yaşam Döngüsü Testi:**
  - Panelden uygulama listeleme, ekleme, güncelleme, silme ve hızlı sürüm yayınlama uç noktaları entegre edildi.
  - Sabit yönlendirme `/api/v1/apps/:slug/download` üzerinden 302 Found yönlendirmesi ve `downloads_count` artırımı gerçek veriyle doğrulandı.
  - `webMSKLabs/apps.html` ve `webMSKLabs/app.html` dinamik şablonları üzerinden canlı katalog listeleme ve uygulama detayları doğrulandı.
- [x] **4.2 Kod Standartları, Derleme ve Satır Tavanı Denetimi:**
  - `npm run build` (Admin Frontend) PASS (0 hata).
  - `npx tsc --noEmit` (Backend) PASS (0 hata).
  - Kural 2 satır tavanı (`<= 450`) tüm dosyalarda eksiksiz sağlandı (`AppModal`: 414, `AppsCMSView`: 374, `AppVersionModal`: 329, `app.html`: 450 satır).

---

### [x] Aşama 5: Parçalı "Öne Çıkan Özellikler" Kart Sistemi & AI Çeviri Modülü
- [x] **5.1 D1 Şema Genişletmesi (`backend/migrations/0008_apps_feature_cards.sql`):**
  - `apps` tablosuna `feature_cards_json TEXT DEFAULT '[]'` kolonu eklendi; HaydiNamaza (9 kart), RekatSay ve Date Counter kartları D1 yerel veritabanında başarıyla seed edildi.
- [x] **5.2 Backend API Genişletmesi (`backend/src/routes/cmsApps.ts` & `cmsPublic.ts`):**
  - GET, POST, PUT işlemlerinde `feature_cards` otomatik parse ve serialize edildi; `GET /api/v1/apps/:slug` public uç noktasına canlı kart listesi eklendi.
- [x] **5.3 Admin Paneli Modüler Kart Yöneticisi (`AppModalFeatureCards.tsx` & `AppModal.tsx`):**
  - Tek büyük metin alanı yerine parçalı kart ekleme, düzenleme, silme ve yukarı/aşağı taşıma arayüzü kuruldu.
  - Hızlı emoji/ikon seçici (🕋, 🧭, ⚙️, 🔇, ⚡ vb.), TR başlık ve alt açıklama girişi, tek tıkla AI (EN / AR Fusha) çevirisi tamamlandı.
  - `AppModal.tsx` içine 3. sekme (`3. Özellik Kartları`) olarak entegre edildi (414 satır, `<= 450` kuralı korundu).
- [x] **5.4 Web Vitrin Dinamik Izgarası (`webMSKLabs/app.html`):**
  - `.features-grid` ve `.feature-box` sınıfları dinamik olarak `currentApp.feature_cards` dizisine bağlandı; TR/EN/AR dil anahtarıyla tam reaktif çalışması sağlandı (eski liste fallback'i korundu).
- [x] **5.5 Uçtan Uca Doğrulama:**
  - `npm run build` PASS (0 hata).
  - `npx tsc --noEmit` PASS (0 hata).
  - `curl.exe http://localhost:8787/api/v1/apps/haydinamaza` ile 9 özelliğin kart bazında geldiği ve `app.html` üzerinden basıldığı teyit edildi.

---

### [x] Aşama 6: Kategori Çoklu Seçim / Özel Etiket & Medya Dayanıklılığı
- [x] **6.1 Çoklu Kategori ve Özel Kategori Ekleme (`AppModalCategorySelect.tsx` — 143 satır):**
  - Hazır 8 kategori rozeti (İslami, Araçlar, Üretkenlik, Eğitim vb.) tıklanarak çoklu seçilebilir hale getirildi; serbest kategori yazıp Enter ile ekleme desteği kuruldu.
- [x] **6.2 Mükerrer Alanların Temizliği (`AppModalLangFields.tsx` — 151 satır):**
  - Özellik Kartları modülüne geçildiği için Tanıtım Metinleri sekmesindeki eski alt alta metin kutuları (`features_tr/en/ar`) kaldırılarak form sadeleştirildi.
- [x] **6.3 Kalıcı İkon Bağlantısı & Normalizer:**
  - D1'deki göreceli `/media/...` yolları `https://msklabs.org/media/...` kalıcı adreslerine güncellendi; frontend ve web şablonlarına göreceli yolları otomatik CDN'e tamamlayan `normalizeMediaUrl` eklendi.

---

### [x] Aşama 7: Web Detay Şablonu Kibar Düzenleme, Zengin Mağaza Kartları & 10px Üst Boşluk (19.10.2026 - 10:40)
- [x] **7.1 Üst Navigasyon & 10px Boşluk Kuralı (`webMSKLabs/app.html`):**
  - Sabit üst panel ile uygulama detay kartı arasındaki dikey boşluk `.portfolio-container { padding-top: 10px !important; }` kuralı ile tam 10px seviyesine çekildi.
  - Kart öncesine `.top-nav` ve `‹ Tüm Uygulamalara Dön` (`apps.html`) butonu yerleştirildi; TR/EN/AR dil anahtarıyla otomatik güncellenmesi sağlandı.
- [x] **7.2 Zengin Sol & Sağ Hero Düzeni (`webMSKLabs/app.html`):**
  - Sol kolonda: 90px taşmasız büyük ikon (`.app-big-icon`), başlık, platform rozeti, geliştirme durumu rozeti, çok dilli kategori rozetleri ve `#download-section` alanına akıcı kaydıran hızlı indir butonu (`.hero-download-btn`).
  - Sağ kolonda: Emojisiz bayrak kuralına tam uyumlu (TR/EN/AR yalın) dil durum paneli (`.global-status-panel`) ve EN/AR modunda Lab'dan sürüm talep mailto butonu (`.lab-request-btn`).
- [x] **7.3 Zengin İndirme ve Yayın Kanalları Izgarası (`#download-section .download-grid`):**
  - Google Play, GitHub Direct APK, Google Drive APK, App Store (iOS), Web/PWA ve Windows Store kartları bağlandı; link durumuna göre `⚡ Mağazaya Git / Doğrudan İndir` veya `🛠️ Hazırlanıyor` rozetleriyle render edildi.
  - Mağaza marka ikonları (`assets/img/store/`) doğru kök yollarıyla entegre edildi.
- [x] **7.4 Schema.org JSON-LD & Açık/Koyu Tema:**
  - `SoftwareApplication` yapılandırılmış veri bloğu dinamik olarak güncellendi.
  - Açık ve koyu tema değişkenleri (`var(--bg-card)`, `var(--border-color)`) ile gece modunda tam kontrast sağlandı.
- [x] **7.5 Doğrulama:**
  - `curl.exe http://localhost:5174/app.html?id=haydinamaza` ile test edildi (PASS).
  - Frontend `npm run build` PASS (0 hata).
