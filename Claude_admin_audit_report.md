# MSKLabsDesk Admin Paneli — Bağımsız Denetim Raporu
**Tarih:** 20.10.2026 - 09:45 · **Repo:** `mskaymaz/MSKLabsDesk` · **Dal:** `DevAdmin` (doğrulandı) · **Kapsam:** salt okunur, hiçbir dosya değiştirilmedi

**Önem:** 🔴 Kritik · 🟠 Yüksek · 🟡 Orta · ⚪ Düşük · **[DY]** = Doğrulanamadı (canlı ortam/harici servis gerekir)

**Çalıştırılan doğrulamalar:** `backend tsc --noEmit` → 0 hata · `frontend tsc -p tsconfig.app.json --noEmit` → 0 hata · `oxlint` → 0 hata, 26 uyarı.
> [!NOTE]
> Tip denetiminin temiz çıkması aşağıdaki çalışma zamanı hatalarını yakalamaz. Rotalar `env: any` kullanıyor, SQL ise string olarak yazılmış.

---

## 📌 İyileştirme ve Düzeltme Kontrol Listesi (Action Checklist)
> **Kullanım:** İyileştirmeler `DevAdmin` dalında adım adım uygulandıkça ilgili maddeler `[x]` olarak işaretlenecektir.

### 🚨 FAZ 1: KRİTİK GÜVENLİK VE ÇALIŞMA ZAMANI ENGELLERİ (CRITICAL)
- [x] **GÖREV 1.1: Router Öncelik Çakışmasının Çözümü (A1)**
  - [x] `backend/src/index.ts` satır 54'teki `path.startsWith('/api/v1/')` kontrolünü satır 108-124'teki medya/tts/audio rotalarının altına taşı.
  - [x] `wrangler dev` altında `POST /api/v1/admin/media/upload` çağrısının 405 Method Not Allowed değil, kimlik kontrolü (401/201) cevabı verdiğini doğrula.
- [x] **GÖREV 1.2: D1 Medya Şeması ve Altyapı Tabloları (D1, D2, D5)**
  - [x] Yeni migration oluştur: `backend/migrations/0016_media_assets_and_admin_infra.sql` *(0011-0015 mevcut olduğundan 0016 kullanılır)*:
    - [x] `media_assets` tablosunu `r2_key`, `size_bytes`, `public_url`, `sha256` alanlarıyla modernize et.
    - [x] `rate_limits`, `audit_logs`, `post_audio_assets` (`post_id TEXT`, FK `blog_posts`), `post_revisions` tablolarını D1 şemasına ekle.
  - [x] `adminMedia.ts` ve `adminTts.ts` içindeki çalışma zamanı (runtime) `CREATE TABLE IF NOT EXISTS` kodlarını temizle.
  - [x] `comments.ts` içindeki her istekte çalışan gereksiz `ensureCommentColumns` `ALTER TABLE` sorgularını kaldır.
- [x] **GÖREV 1.3: Auth Secret & JWT İmza Bütünlüğü (S1, S2)**
  - [x] `backend/src/utils/auth.ts`: Varsayılan `'msklabs_default_secret_2026'` sabitini kaldır; secret yoksa güvenli hata fırlat.
  - [x] İmzalamayı basit string hash yerine WebCrypto `crypto.subtle` HMAC-SHA256 standardına yükselt.
  - [x] `cmsPosts.ts`, `cmsChannels.ts`, `cmsApps.ts`, `cmsTemplates.ts` rotalarına `env.ADMIN_JWT_SECRET` parametresini eksiksiz aktar.
- [x] **GÖREV 1.4: Kimlik Doğrulama Sertleştirme (S3, S4, S5)**
  - [x] İstemciden (`LoginView.tsx`) ham SHA-256 hash gönderimini kaldır; parolayı HTTPS üzerinden düz metin gönder.
  - [x] Sunucu tarafında PBKDF2 / WebCrypto + salt yapısına geç (Pass-the-hash açığını kapat).
  - [x] `adminAuth.ts` içindeki hardcoded `'MskLabs2026!'` ve auto-seed kodunu kaldır; `rate_limits` tablosuyla login'e dakikada azami 5 deneme sınırı koy.

### ⚡ FAZ 2: SÖZLEŞME VE İLETİŞİM UYUMSUZLUKLARI (HIGH)
- [x] **GÖREV 2.1: Bülten Gönderim Sözleşmesi (A3, E3)**
  - [x] `frontend/src/services/api.ts` ve `BroadcastView.tsx` payload alanlarını `{ subject, content_html, category }` olarak backend ile senkronize et.
  - [x] `backend/src/routes/adminBroadcast.ts`: Döngü içi subrequest kotasını aşmamak için kayıtları `email_queue` tablosuna yaz; cron handler altyapısını hazırla.
- [x] **GÖREV 2.2: E-Posta Gönderim Dayanıklılığı (E1, S6, E7)**
  - [x] `backend/src/utils/email.ts`: Resend `from` adresini `@gmail.com` yerine `destek@msklabs.org` yap; hata durumunda sessizce simülasyona düşüp `success: true` dönme açığını gider (`success: false` dön).
  - [x] HTML e-posta şablonlarında (`adminTickets.ts`, `support.ts`, `comments.ts`) kullanıcı girdilerini `escapeHtml()` süzgecinden geçir.
  - [x] Atıl durumdaki `emailTemplates.ts` dosyasını aktif kullanıma al.
- [x] **GÖREV 2.3: Workers Asenkron Süreç Güvencesi (E2)**
  - [x] `backend/src/index.ts` üzerinden `ctx: ExecutionContext` nesnesini handler'lara geçir.
  - [x] Yanıt sonrası çalışan AI analizi ve e-posta gönderimlerini `ctx.waitUntil(...)` içine alarak Workers kesilmelerini önle.
- [x] **GÖREV 2.4: Reklam (Ads) Uç Noktası Kararı (A4)**
  - [x] Reklam yönetimi henüz aktif olmadığından `TemplatesView.tsx` ve `api.ts` içindeki 404 veren reklam çağrılarını temizle veya pasife al.

### 🧹 FAZ 3: MİMARİ TEMİZLİK, ÖLÜ KOD VE KURAL UYUMU (MEDIUM)
- [ ] **GÖREV 3.1: Frontend Ölü Kod Temizliği (F1, F2)**
  - [ ] Kullanılmayan modal ve bileşenleri sil: `ImageModal.tsx`, `TableModal.tsx`, `TranslationAuditModal.tsx`, `AudioPlayer.tsx`, `Toast.tsx`, `CouponModal.tsx`.
  - [ ] `PostEditorModal.tsx` ve `PostEditorLangFields.tsx` dosyalarını sil (`BlogStudioView` kullanılıyor); paylaşılan `PostFormData` tipini `types/index.ts` altına taşı.
- [ ] **GÖREV 3.2: Satır Sınırı Aşımı Düzeltmeleri (T3 & AGENTS Kural 2)**
  - [ ] `backend/src/routes/adminTts.ts` (714 satır): `ttsRoutes.ts` ve `ttsShared.ts` olarak modüllere böl (<= 400 satır).
  - [ ] `frontend/src/components/apps/studio/AppStudioFloatingModal.tsx` (519 satır): Alt parçalara bölerek 450 satır altına çek.
- [ ] **GÖREV 3.3: Ayarlar Ekranı Kalıcılığı (F4)**
  - [ ] `SettingsView.tsx` ekranını backend `site_templates` tablosuna (`site_settings` anahtarıyla) bağla.
- [ ] **GÖREV 3.4: Bilet Durum Sözlüğü ve ID Çakışma Önlemi (A7, A8, D8)**
  - [ ] `backend/src/utils/statuses.ts` ile durum whitelist'i tanımla; e-posta biletlerinin `new` statüsüyle oluşmasını sağla.
  - [ ] Destek bilet ID üretimindeki rastgele kısmı 6 karaktere genişlet.

### 🧪 FAZ 4: TEST ALTYAPISI VE DOKÜMANTASYON SENKRONİZASYONU
- [ ] **GÖREV 4.1: Gerçek D1 Test Altyapısı (T1)**
  - [ ] `backend/package.json` içerisine `vitest` ve `@cloudflare/vitest-pool-workers` ekle (`npm test` script'i).
  - [ ] Mock tabanlı `api010.test.ts` testini gerçek yerel D1 (Miniflare) test havuzuna dönüştür.
- [ ] **GÖREV 4.2: Dokümantasyon Senkronizasyonu (D3, F5, T5)**
  - [ ] `tasks.md` içindeki migration ve tablo isimlerini gerçek D1 ile eşle; `admin_icerigi.md` içindeki henüz olmayan özellikleri "Planlanan Modüller" başlığına al.

---

## Aşama 1 — Güvenlik ve Kimlik Doğrulama

| # | Önem | Konum | Bulgu ve Kanıt | Etki |
|---|---|---|---|---|
| S1 | 🔴 | [auth.ts:30,47](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/utils/auth.ts#L30-L47), [adminAuth.ts:46](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/adminAuth.ts#L46) | Gizli anahtarın varsayılan değeri `'msklabs_default_secret_2026'` kaynak kodda açık duruyor. İmza HMAC değil, `SHA256(payload.secret)` ile üretiliyor. | `ADMIN_JWT_SECRET` tanımlı değilse herkes geçerli bir admin token'ı üretebilir. |
| S2 | 🔴 | [cmsPosts.ts:9](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/cmsPosts.ts#L9), cmsChannels.ts:8, cmsApps.ts:9, cmsTemplates.ts:8 | `verifyAuthToken(request)` secret verilmeden çağrılıyor, diğer tüm rotalar ise `env.ADMIN_JWT_SECRET` geçiyor. | Secret tanımlanırsa CMS rotaları (yazılar, kanallar, uygulamalar, şablonlar) **401** döner. Tanımlanmazsa S1 açığı geçerli olur. Her iki durumda da sistem bozuk. |
| S3 | 🔴 | [adminAuth.ts:9-36](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/adminAuth.ts#L9-L36), [LoginView.tsx:9-13](file:///d:/Code/mskaymaz/MSKLabsDesk/frontend/src/views/LoginView.tsx#L9-L13) | İstemci `password_hash` gönderiyor, sunucu bunu doğrudan DB'deki hash ile karşılaştırıyor (pass-the-hash). Hash'ler tuzsuz SHA-256. | DB'ye sızan hash doğrudan parola gibi kullanılabilir. |
| S4 | 🔴 | [adminAuth.ts:21-27](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/adminAuth.ts#L21-L27) | Tablo boşsa `MskLabs2026!` parolasıyla `superadmin` hesabı otomatik oluşturuluyor. Parola repoda açık. | Canlıya ilk çıkışta herkesin bildiği bir parolayla süper admin hesabı oluşur. |
| S5 | 🟠 | [index.ts:35-39](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/index.ts#L35-L39) | Admin uçları dahil tüm yanıtlarda CORS `*`. Login'de rate-limit yok. Token 30 gün geçerli ve `localStorage`'da tutuluyor. | Kaba kuvvet ve XSS sonrası token çalınması riski. |
| S6 | 🟠 | [adminTickets.ts:137-140](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/adminTickets.ts#L137-L140), support.ts:143-146, comments.ts:112 | `sender_name`, `subject` ve `replyContent` kaçışsız olarak e-posta HTML'ine ekleniyor. | Ziyaretçi, sistemin gönderdiği maillere HTML/link enjekte edebilir. |
| S7 | 🟠 | support.ts:46-55, comments.ts:46-55 | Captcha'da beklenen cevap (`captcha_expected`) istemciden geliyor ve kontrol isteğe bağlı. Turnstile kodda yok. | Bot koruması fiilen yok. |
| S8 | 🟠 | [subscribe.ts:113-126](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/subscribe.ts#L113-L126) | Abonelikten çıkış token'sız çalışıyor; e-posta bilen herkes başkasının aboneliğini sonlandırabilir. Double opt-in yok (`verified_at` anında set ediliyor). Bültenlerde abonelikten çıkış linki yok. | KVKK ve itibar riski. |
| S9 | 🟡 | adminMedia/adminTts | Rol kontrolü yalnızca `role === 'GUEST'` için var; sistemde böyle bir rol yok (`superadmin`/`admin`). RBAC uygulanmamış. | Tüm token sahipleri tüm yetkilere sahip. |
| S10 | 🟡 | [ai.ts:77,227,323](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/utils/ai.ts#L77) | Gemini API anahtarı URL query parametresinde (`?key=`). | Anahtar loglara sızabilir. |

## Aşama 2 — Veritabanı ve Migration Uyumu

| # | Önem | Konum | Bulgu ve Kanıt | Etki |
|---|---|---|---|---|
| D1 | 🔴 | [0002_cms_schema.sql:109-121](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/migrations/0002_cms_schema.sql#L109-L121) ↔ [adminMedia.ts:103-126,218-257](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/adminMedia.ts#L103-L126) | Migration `media_assets(id TEXT, url, file_size)` oluşturuyor. Kod ise `r2_key, size_bytes, public_url, sha256` kolonlarını kullanıyor. `CREATE IF NOT EXISTS` mevcut tabloyu değiştirmediği için kod tarafındaki şema hiç uygulanmıyor. | Her medya yüklemesi `no such column: sha256` hatasıyla **500** döner. |
| D2 | 🔴 | Tüm migration dosyaları | `audit_logs`, `rate_limits`, `post_audio_assets` ve `post_revisions` tabloları hiçbir migration'da yok. İlk üçü kod içinde çalışma anında `CREATE TABLE` ile oluşturuluyor; `post_revisions` hiç oluşturulmuyor. | Şema denetimsiz kalıyor ve her istekte DDL çalışıyor. |
| D3 | 🟠 | [tasks.md DATA-001…DATA-TTS-001](file:///d:/Code/mskaymaz/MSKLabsDesk/tasks.md) ↔ `backend/migrations/` | Belgedeki dosya adları (`0001_devadmin_initial_schema`, `0005_cms_schema`, `0006_push_subscriptions`, `0007_ad_settings`, `0008_blog_layouts`, `0009_translation`, `0010_post_audio_assets`) ve kolon tipleri (INTEGER PK, UPPERCASE status, CHECK kısıtları) repodaki dosyalarla uyuşmuyor. Repoda `push_subscriptions`, `ad_settings`, `blog_layouts`, `translation_cache`, `glossary` tabloları yok. | `[*]` "derin denetlendi" işaretleri gerçeği yansıtmıyor (DoD ihlali). |
| D4 | 🟠 | [0002:48](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/migrations/0002_cms_schema.sql#L48) + [cmsChannels.ts:104-106](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/cmsChannels.ts#L104-L106) | `blog_posts.channel_id` FK'si `ON DELETE CASCADE`. Kanal silindiğinde yazılar da silinir (D1'de FK zorlaması varsayılan olarak açık — **[DY]** canlıda doğrulanmalı). | Veri kaybı. admin_icerigi §4 "içerikleri koruyarak kaldırma" vaadiyle çelişiyor. |
| D5 | 🟠 | [adminTts.ts:77,166](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/adminTts.ts#L166) ↔ 0002:23 | TTS `post_id INTEGER` ve pozitif tamsayı bekliyor, oysa `blog_posts.id` TEXT (`post_…`). | Gerçek yazılar için TTS çağrısı yapılamaz. |
| D6 | 🟡 | [0010_standardize_app_summaries.sql](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/migrations/0010_standardize_app_summaries.sql) (takipsiz) | 0009'un güncellediği `description_*` alanlarını 0007'deki kısa metinlere geri çeviriyor. Başlıktaki tarih (15:10) dosyanın oluşturulma saatinden sonra. | Migration karmaşası; commit edilmemiş değişiklik. |
| D7 | ⚪ | [comments.ts:18-25](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/comments.ts#L18-L25) | 0003'te zaten eklenmiş kolonlar için her istekte iki başarısız `ALTER TABLE` çalışıyor. | Gereksiz D1 yükü. |
| D8 | 🟡 | [support.ts:20-28](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/support.ts#L20-L28) | Bilet ID'si 32⁴ ≈ 1,05M olasılık içeriyor. Doğum günü hesabıyla yılda ~1000 bilette çakışma ihtimali yaklaşık %40. | PK çakışmasında 500 hatası ve kayıp bilet. |
| D9 | ⚪ | [wrangler.toml](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/wrangler.toml) | `database_id = "dummy-id-pending-creation"`. Queue ve cron tanımı yok. | Canlıya çıkış (deploy) mümkün değil. |

## Aşama 3 — API Yönlendirme ve Sözleşme Uyumsuzlukları

| # | Önem | Konum | Bulgu ve Kanıt | Etki |
|---|---|---|---|---|
| A1 | 🔴 | [index.ts:54-55](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/index.ts#L54-L55) | `path.startsWith('/api/v1/')` koşulu, satır 108-124'teki `/api/v1/admin/media`, `/api/v1/admin/tts/*` ve `/api/v1/public/audio/*` rotalarından **önce** geliyor. `cmsPublic` bu isteklere POST için 405, GET için 404 döner. | v1 üzerinden medya, TTS ve ses uçlarının hepsi erişilemez. |
| A2 | 🔴 | [api.ts:367](file:///d:/Code/mskaymaz/MSKLabsDesk/frontend/src/services/api.ts#L367) | `uploadMedia` gölgelenen `/v1/admin/media/upload` yolunu çağırıyor (A1 ve D1 birlikte). Ayrıca hiçbir bileşen `uploadMedia` fonksiyonunu çağırmıyor. | Kapak görseli ve medya yükleme özelliği çalışmıyor. |
| A3 | 🔴 | [BroadcastView.tsx:28-32](file:///d:/Code/mskaymaz/MSKLabsDesk/frontend/src/views/BroadcastView.tsx#L28-L32) ↔ [adminBroadcast.ts:39-42](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/adminBroadcast.ts#L39-L42) | Frontend `{title, content, target_preference}` gönderiyor, backend `{subject, content_html, category}` bekliyor. | Bülten gönderimi **her zaman 400** döner. |
| A4 | 🟠 | [api.ts:328-358](file:///d:/Code/mskaymaz/MSKLabsDesk/frontend/src/services/api.ts#L328-L358), [TemplatesView.tsx:37,83](file:///d:/Code/mskaymaz/MSKLabsDesk/frontend/src/views/TemplatesView.tsx#L37) | `/v1/admin/ads` için backend'de rota yok; istekler cmsPublic'e düşüyor ve 404/405 dönüyor. Hata `.catch` ile boş listeye çevriliyor. | Reklam yönetimi özelliği yok ama arayüzde varmış gibi görünüyor. |
| A5 | 🟠 | adminTts.ts (tamamı) | TTS sağlayıcısı ve `TTS_QUEUE` binding'i yok; kayıtlar sonsuza dek `GENERATING` durumunda kalıyor ve sonraki üretimler 409 dönüyor. Approve işlemi R2'de dosya olup olmadığını ve kaydın durumunu kontrol etmiyor. `X-Idempotency-Key` zorunlu tutuluyor ama hiçbir yerde kullanılmıyor. Frontend TTS uçlarını hiç çağırmıyor; `AudioPlayer` hiçbir yerden import edilmiyor. | Tüm TTS modülü işlevsiz. |
| A6 | 🟡 | [adminTts.ts:654](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/adminTts.ts#L654) | Range isteği gelse bile tüm R2 nesnesi `arrayBuffer` ile belleğe okunuyor. | Büyük MP3 dosyalarında bellek ve CPU sınırı aşılabilir. |
| A7 | 🟡 | adminTickets.ts:174, adminComments.ts:52 | `status` değeri doğrulanmadan yazılıyor ve kaydın varlığı kontrol edilmiyor. Satır 175'te string `"status_changed"` çift tırnakla yazılmış (SQLite bunu önce kolon adı olarak yorumlar). | Tutarsız durum değerleri birikir. |
| A8 | 🟡 | App.tsx:57 ↔ emailInbound.ts:146 | E-postayla gelen biletler `open` durumuyla oluşturuluyor, sayaç ise yalnızca `new` ve `in_progress` sayıyor. | Bekleyen bilet rozeti eksik gösteriyor. |
| A9 | 🟡 | cmsPublic.ts:70-74 | Yazının yayında olup olmadığı kontrol edilmeden önce okunma sayacı artırılıyor. `limit` için üst sınır ve NaN kontrolü yok. | Sayaç şişebilir; sınırsız sorgu çalışabilir. |
| A10 | 🟡 | cmsTemplates.ts:45 | `meta_json` string olarak gelirse `JSON.stringify` ile ikinci kez kodlanıyor. **[DY]** Frontend'in hangi tipte gönderdiği incelenmedi. | Bozuk meta verisi. |

## Aşama 4 — E-posta, AI ve Arka Plan İşleri

| # | Önem | Konum | Bulgu ve Kanıt | Etki |
|---|---|---|---|---|
| E1 | 🔴 | [email.ts:26-53](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/utils/email.ts#L26-L53) | DECISIONS #2'deki Gmail SMTP kanalı kodda yok. Resend `from` adresi `@gmail.com`; Resend gmail.com gibi doğrulanmamış alan adlarından gönderimi reddeder (**[DY]** canlı test gerekir). Hata durumunda kod "simülasyon" moduna düşüp `success:true` dönüyor. | Mailler sessizce gitmez ve sistem başarılı göründüğü için fark edilmez. |
| E2 | 🟠 | support.ts:109,153 · adminTickets.ts:146 · adminBroadcast.ts:71 · subscribe.ts:87 | Promise'ler `await` veya `ctx.waitUntil` olmadan bırakılıyor. Workers yanıt döndükten sonra bu işleri iptal edebilir. | AI analizi ve e-postalar rastgele kaybolabilir. |
| E3 | 🟠 | [adminBroadcast.ts:64-77](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/routes/adminBroadcast.ts#L64-L77) | Her abone için döngü içinde hem DB'ye kayıt hem `fetch` yapılıyor. `email_queue` kayıtları `pending` kalıyor ve kuyruğu tüketen bir cron yok. | Free plan subrequest limiti (50) aşılır; kuyruk tablosu fiilen anlamsız. |
| E4 | 🟠 | [ai.ts:77,227,323](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/utils/ai.ts#L77) | Model adı `gemini-1.5-flash`; bu model ailesi kullanımdan kaldırıldı (**[DY]** canlı çağrıyla doğrulanmalı). | Analiz ve çeviri istekleri 404 alıp null dönebilir. |
| E5 | 🟡 | adminTickets.ts:238-264 | `analyze-all` tek istek içinde sırayla 50 AI çağrısı yapıyor. | Gemini RPM kotası ve Worker süre sınırı aşılır. |
| E6 | 🟡 | [emailInbound.ts:67-86](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/services/emailInbound.ts#L67-L86) | base64 ve quoted-printable gövdeler çözülmüyor; regex ile kaba temizlik yapılıyor. | Bilet içerikleri bozuk görünür. Email Routing kuralının kurulu olup olmadığı **[DY]**. |
| E7 | ⚪ | [emailTemplates.ts](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/src/utils/emailTemplates.ts) | Çok dilli şablonlar hiçbir yerden import edilmiyor; rotalar kendi inline HTML'lerini üretiyor. | Ölü kod ve tekrar. |

## Aşama 5 — Frontend: Ölü Kod, İşlevsiz Ekranlar, Tekrarlar

| # | Önem | Konum | Bulgu | Etki |
|---|---|---|---|---|
| F1 | 🟡 | `ImageModal.tsx`, `TableModal.tsx`, `TranslationAuditModal.tsx`, `AudioPlayer.tsx`, `Toast.tsx`, `CouponModal.tsx` | Hiçbir dosyadan import edilmiyor (import taraması ile doğrulandı). | Yaklaşık 1000 satır ölü kod. |
| F2 | 🟡 | [PostEditorModal.tsx](file:///d:/Code/mskaymaz/MSKLabsDesk/frontend/src/components/posts/PostEditorModal.tsx), PostEditorLangFields.tsx | `<PostEditorModal>` hiçbir yerde render edilmiyor; dosyadan yalnızca `PostFormData` tipi kullanılıyor. Yerini BlogStudioView almış. | Yaklaşık 480 satır tekrar. |
| F3 | 🟡 | AppsCMSView.tsx:90,434 | Aynı işi yapan iki ayrı düzenleme akışı var (`AppModal` ve `AppDetailStudioView`). | İki yerde bakım yükü, iki farklı veri sözleşmesi. **[DY]** Hangisinin kalıcı olacağı ürün kararı. |
| F4 | 🟠 | [SettingsView.tsx](file:///d:/Code/mskaymaz/MSKLabsDesk/frontend/src/views/SettingsView.tsx) | `api` veya `fetch` çağrısı yok; ayarlar kalıcı olarak kaydedilmiyor. | Ekran yalnızca görsel. |
| F5 | 🟠 | Sidebar.tsx:24 ↔ admin_icerigi.md §6, §8, §11, §12, §14, §15 | TTS, reklam (ayrı ekran), denetim logu, RBAC, kupon ve zamanlanmış yayın için sekme veya backend yok. CouponModal bağlı değil. | Kullanım dokümanı mevcut olmayan özellikleri tarif ediyor. |
| F6 | ⚪ | BlogStudioView.tsx:401,505; AppsCMSView.tsx:44 | oxlint uyarıları: render sırasında `ref.current` okunuyor; effect içinde senkron setState çağrılıyor (toplam 26 uyarı). | Editör araç çubuğu güncel kalmayabilir. |
| F7 | ⚪ | BroadcastView.tsx:11,14 | `targetPreference` sabit `'ALL'` (segment seçimi yok, DECISIONS #4 ile çelişiyor). `progress` state'i yazılıyor ama hiç okunmuyor. | Ölü state; segmentasyon yok. |
| F8 | ⚪ | package.json | `vite-plugin-pwa` devDependencies yerine dependencies altında. | Bağımlılık hijyeni. |

## Aşama 6 — Test, Kurallar ve Dokümantasyon

| # | Önem | Bulgu |
|---|---|---|
| T1 | 🟠 | `backend/package.json` dosyasında test script'i ve vitest bağımlılığı yok. [api010.test.ts](file:///d:/Code/mskaymaz/MSKLabsDesk/backend/tests/api010.test.ts) SQL'i metin eşleştirmesiyle taklit eden mock D1 kullanıyor; bu yüzden D1/A1 hataları testlerde PASS çıkıyor. AGENTS §4 "mock yeterli değil" kuralı ihlal ediliyor. |
| T2 | 🟠 | tasks.md'nin atıf yaptığı `tests/com_inbound001.test.ts` ve `int_com001.test.ts` bu repoda yok. **[DY]** webMSKLabs reposunda olabilir. |
| T3 | 🟡 | Satır sınırı aşımları (gerçek satır sayısı): `adminTts.ts` **715**, `AppStudioFloatingModal.tsx` 475 (>450), `app-studio.css` 674. |
| T4 | 🟡 | `adminTts.ts` içinde yetki, idempotency ve rate-limit blokları 5 kez kopyalanmış; `checkUploadRateLimit` / `checkTTSRateLimit` ve `ensureTables` fonksiyonları birebir aynı. |
| T5 | ⚪ | admin_icerigi.md §13 "Turnstile" ve "Web Push" ayarlarından söz ediyor; kodda ikisi de yok. |

---

## Gemini Code Assist İçin Düzeltme Görevleri (bağımlılık sırasıyla)

> Her görev ayrı bir commit olmalı ve yalnızca `DevAdmin` dalında yapılmalı. **Korunacaklar:** Türkçe admin arayüzü, TR/EN/AR içerik alanları, mevcut endpoint yolları (yalnızca eklenir, kaldırılmaz) ve 450 satır kuralı.

**FIX-01 · Auth secret birleştirme (S1, S2)** — Bağımlılık: yok
- **Değiştir:** `auth.ts` içindeki varsayılan parametreyi kaldır; secret yoksa hata fırlat. `cmsPosts/Channels/Apps/Templates` çağrılarına `env.ADMIN_JWT_SECRET` ekle. İmzayı `crypto.subtle` HMAC-SHA256 ile üret ve sabit zamanlı karşılaştırma kullan.
- **Test:** Secret tanımlıyken login sonrası 4 CMS rotası 200 dönmeli; sahte token 401 almalı.
- **Başarı:** Repoda `msklabs_default_secret` metni kalmamalı.

**FIX-02 · Login sertleştirme (S3, S4, S5)** — Bağımlılık: FIX-01
- **Değiştir:** `password_hash` kabulünü kaldır; frontend düz parolayı HTTPS üzerinden göndersin. Sunucuda PBKDF2 (WebCrypto) + salt kullan. Otomatik seed'i kaldır ve yerine `wrangler d1 execute` ile çalışan tek seferlik bir seed betiği yaz. Login için `rate_limits` tablosuyla dakikada 5 deneme sınırı koy.
- **Test:** Hash ile giriş denemesi 401 dönmeli; 6. denemede 429 dönmeli.

**FIX-03 · Eksik şema migration'ı (D1, D2, D5)** — Bağımlılık: yok
- **Yeni dosya:** `0011_admin_infra.sql` → `rate_limits`, `audit_logs`, `post_audio_assets` (`post_id TEXT`, FK → `blog_posts`), `post_revisions` tabloları. `media_assets` için yeni tablo oluştur, verileri kopyala, eski tabloyu sil ve yeniden adlandır (r2_key/size_bytes/public_url/sha256 kolonlarıyla).
- **Kaldır:** `adminMedia.ts` ve `adminTts.ts` içindeki runtime `CREATE TABLE` çağrıları, `comments.ts` içindeki `ensureCommentColumns`.
- **Test:** `wrangler d1 migrations apply --local` sonrasında `PRAGMA table_info` ile kolonları doğrula; gerçek yerel D1 üzerinde PNG yüklemesi 201 dönmeli.

**FIX-04 · Router sırası (A1)** — Bağımlılık: yok
- **Değiştir:** `index.ts` içinde `/api/v1/admin/*` ve `/api/v1/public/audio/*` kontrollerini `startsWith('/api/v1/')` satırından önceye taşı.
- **Test:** `wrangler dev` altında `POST /api/v1/admin/media/upload` isteği 405 değil 201/401 dönmeli.

**FIX-05 · Bülten sözleşmesi ve kuyruk (A3, E2, E3, S8)** — Bağımlılık: FIX-04
- **Değiştir:** `api.broadcastNewsletter` alanlarını `{subject, content_html, category}` olarak düzelt. Backend yalnızca `email_queue` tablosuna yazsın. `wrangler.toml` içine `[triggers] crons` ekle ve `scheduled()` handler'ı her turda ≤40 mail gönderip kayıtları `sent`/`failed` olarak güncellesin. Her bültene token'lı abonelikten çıkış linki ekle. `/api/unsubscribe` token zorunlu olsun.
- **Test:** 3 aboneyle gönderim yapıldığında kuyruk `sent` durumuna geçmeli; token'sız çıkış isteği 400 dönmeli.

**FIX-06 · E-posta gönderimi (E1, S6)** — Bağımlılık: yok
- **Değiştir:** Resend `from` adresini doğrulanmış alan adına (`destek@msklabs.org`) çek. `res.ok` false ise `success:false` dön (simülasyon modu yalnızca `ENV=dev` iken çalışsın). Tüm HTML şablonlarında `escapeHtml()` kullan ve `emailTemplates.ts` dosyasını gerçekten kullanıma al (E7).
- **Test:** Hatalı API anahtarıyla gönderim `success:false` dönmeli; `<b>` içeren bir isim maile kaçışlı olarak yazılmalı.

**FIX-07 · waitUntil yayılımı (E2)** — Bağımlılık: FIX-06
- **Değiştir:** `ctx` nesnesini `fetch` içinden handler'lara geçir; fire-and-forget çağrıları `ctx.waitUntil(...)` ile sar.
- **Test:** `wrangler dev` loglarında AI ve e-posta tamamlanma kayıtları görünmeli.

**FIX-08 · Kanal silme koruması (D4)** — Bağımlılık: FIX-03
- **Değiştir:** Kanalda yazı varsa DELETE isteği 409 dönsün veya kanal `is_active=0` ile pasife alınsın. Migration ile FK'yi `ON DELETE RESTRICT` yap.
- **Test:** Yazısı olan kanalı silme denemesinde yazı sayısı değişmemeli.

**FIX-09 · Durum sözlüğü ve doğrulama (A7, A8)** — Bağımlılık: yok
- **Değiştir:** `backend/src/utils/statuses.ts` dosyasında bilet durumları (`new`/`in_progress`/`resolved`/`rejected`/`spam`) ve yorum durumları için whitelist tanımla. Inbound biletler `new` ile oluşturulsun. Bulunamayan kayıtta 404 dön. Satır 175'teki çift tırnaklı literal'i tek tırnağa çevir.
- **Test:** Geçersiz status 400, olmayan ID 404 dönmeli; e-posta bileti rozet sayacına eklenmeli.

**FIX-10 · Bilet ID genişletme (D8)** — Bağımlılık: yok
- **Değiştir:** Rastgele kısmı 6 karaktere çıkar ve PK çakışmasında 3 kez yeniden dene.
- **Test:** 10.000 ID üretiminde benzersizlik birim testi.

**FIX-11 · AI modeli ve anahtar (E4, E5, S10)** — Bağımlılık: yok
- **Değiştir:** Modeli `GEMINI_MODEL` env değişkeninden oku (geçerli bir varsayılanla). Anahtarı `x-goog-api-key` header'ı ile gönder. `analyze-all` her çağrıda en fazla 5 bilet işlesin.
- **Test:** Gerçek anahtarla tek bir bilet analizi `ai_summary` alanını doldurmalı.

**FIX-12 · TTS kararı (A5, A6, T3, T4)** — Bağımlılık: FIX-03, FIX-04
- **Ön koşul:** Sağlayıcı seçilene kadar `adminTts.ts` dosyasını `ttsRoutes.ts` + `ttsShared.ts` (auth/rate-limit/ensure) olarak böl (<450 satır). Approve yalnızca R2'de nesne varsa ve durum `DRAFT` ise çalışsın. Range isteğinde `MEDIA.get(key, {range})` kullan.
- **Test:** Mevcut test senaryoları gerçek yerel D1 ile geçmeli.

**FIX-13 · Reklam ve medya arayüzü bağlantısı (A2, A4)** — Bağımlılık: FIX-03, FIX-04
- **Seçenek A:** `ad_settings` migration'ı ve `/api/v1/admin/ads` rotası eklenir.
- **Seçenek B:** `getAds`/`updateAd`/`createAd` fonksiyonları ve TemplatesView'daki reklam bölümü kaldırılır.
- `uploadMedia` BlogStudioView'daki kapak alanına bağlanır.
- **Test:** UI'dan yüklenen görsel R2'de ve `media_assets` tablosunda görünmeli.

**FIX-14 · Ölü kod temizliği (F1, F2, F7, E7)** — Bağımlılık: FIX-13 (Toast/Audio kararı için)
- **Değiştir:** F1'deki 6 dosyayı ve PostEditorModal + PostEditorLangFields dosyalarını sil. `PostFormData` tipini `types/index.ts` dosyasına taşı.
- **Test:** `tsc --noEmit` ve `npm run build` geçmeli.

**FIX-15 · Settings kalıcılığı (F4)** — Bağımlılık: FIX-01
- **Değiştir:** `site_templates` tablosunda `key_name='site_settings'` kaydına `meta_json` olarak kaydet ve oku.
- **Test:** Sayfa yenilendikten sonra ayarlar korunmalı.

**FIX-16 · Gerçek test altyapısı (T1, T2)** — Bağımlılık: FIX-03
- **Değiştir:** Backend'e `vitest` + `@cloudflare/vitest-pool-workers` (Miniflare D1) ekle. Testler mock yerine migration uygulanmış yerel D1 üzerinde çalışsın. `npm test` script'i ekle.
- **Başarı:** D1 ve A1 türü hataları yakalayan regresyon testleri bulunmalı.

**FIX-17 · Dokümantasyon hizalama (D3, D6, F5, T5)** — Bağımlılık: diğer tüm görevler
- **Değiştir:** tasks.md içinde gerçekte doğrulanamayan `[*]` işaretlerini `[x?]` olarak düzelt; migration adlarını repodaki dosyalarla eşle. 0010 migration'ı için karar verilip commit edilsin veya silinsin. admin_icerigi.md'de olmayan özellikleri "Planlanan" başlığı altına taşı.

---
### Doğrulanamayanlar (özet)
- Canlı D1'de FK zorlaması (D4)
- Resend'in gmail adresinden gönderimi reddetmesi (E1)
- gemini-1.5-flash modelinin erişilebilirliği (E4)
- Email Routing kuralı (E6)
- webMSKLabs reposundaki testler (T2)
- `meta_json` gönderim tipi (A10)
- F3 için ürün kararı
