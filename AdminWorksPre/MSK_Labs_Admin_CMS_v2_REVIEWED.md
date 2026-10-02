# MSK LABS — Gelişmiş Yönetim ve İçerik Platformu (Admin CMS)
## Gemini Code Assistant Proje Talimatı — Gözden Geçirilmiş v2.0

> **Hazırlayan:** Antigravity (Claude Sonnet 4.6 Thinking) — Derin İnceleme & Geliştirme
> **Amaç:** Mevcut MSK Labs web sitesini bozmadan, mevcut mimariyle uyumlu, güvenli, estetik ve ölçeklenebilir bir Yönetim Merkezi / Admin CMS oluşturmak.
> **Temel hedef:** MSK Labs yöneticisinin gelecekte yeni uygulamaları, blog yazılarını, görselleri, indirme bağlantılarını, dokümantasyonları ve diğer içerikleri kod dosyalarına dokunmadan yönetebilmesi.

---

> [!IMPORTANT]
> Bu doküman, orijinal proje planının derin incelemesi ve güçlendirilmiş versiyonudur.
> Gemini 2.5 Pro (veya üzeri) ile çalışmak üzere optimize edilmiştir.
> Değişiklikler ve eklentiler `[EKLENDİ]`, `[GÜÇLENDİRİLDİ]`, `[ÇIKARILDI]` ile işaretlenmiştir.

---

# 0. DOKÜMAN DEĞİŞİKLİK ÖZETİ

## Kritik Eksikler (Eklendi)

| # | Konu | Önem |
|---|------|------|
| 1 | Tech Stack kararı yoktu — eklendi | 🔴 Kritik |
| 2 | Hangi database/storage kullanılacağı belirsizdi — eklendi | 🔴 Kritik |
| 3 | Authentication stratejisi yoktu (JWT vs session vs OAuth) — eklendi | 🔴 Kritik |
| 4 | Environment / secrets yönetimi yoktu — eklendi | 🔴 Kritik |
| 5 | API contract tanımı yoktu — eklendi | 🔴 Kritik |
| 6 | Error boundary ve monitoring yoktu — eklendi | 🟡 Önemli |
| 7 | Rate limiting detayları yoktu — güçlendirildi | 🟡 Önemli |
| 8 | Deployment stratejisi yoktu — eklendi | 🟡 Önemli |
| 9 | Test stratejisi yoktu — eklendi | 🟡 Önemli |
| 10 | Soft delete modeli net değildi — güçlendirildi | 🟢 Normal |

## Çıkarılanlar

| # | Konu | Neden |
|---|------|-------|
| 1 | Automation Engine (Faz 13) — öncelik dışına alındı | İlk versiyonda gereksiz karmaşıklık |
| 2 | FAZ sayısı 18'den 12'ye indirildi | Fazlar çok küçük parçalara bölünmüştü, bazıları birleştirildi |

---

# 1. ÇALIŞMA PRENSİBİ

Bu proje tek seferde kodlanmayacaktır.

Her fazdan önce:

1. Mevcut repository'yi ve ilgili dosyaları incele.
2. Bu fazın mevcut mimariyle olası çakışmalarını belirle.
3. Önerilen çözümü ve etkilenecek dosyaları açıkla.
4. **Kullanıcı onayı olmadan kod yazma.**
5. Onaydan sonra yalnızca ilgili fazı uygula.
6. Uygulama sonunda test et ve çalıştığını doğrula.
7. Değişiklikleri ve test sonuçlarını raporla.
8. **Sonraki faza kendiliğinden geçme.**

Mevcut çalışan özellikler her koşulda korunmalıdır.

> [!CAUTION]
> Hiçbir adımda kullanıcı onayı alınmadan production'a müdahale edilmeyecektir.

---

# 2. ANA MİMARİ

Admin paneli ile public web sitesi birbirinden net biçimde ayrılmalıdır.

```text
MSK Labs
│
├── Public Website (mevcut — dokunulmaz)
│   ├── Ana Sayfa
│   ├── Uygulamalar
│   ├── BİZCE
│   ├── ANILTILAR
│   ├── GÜNCEL
│   └── Kurumsal Sayfalar
│
└── Admin / Yönetim Merkezi (/admin)
    ├── Dashboard
    ├── İçerikler
    │   ├── Uygulamalar
    │   ├── Yazılar (BİZCE / GÜNCEL / ANILTILAR / BLOG)
    │   └── Sayfalar
    ├── Medya Merkezi
    ├── Kategoriler & Etiketler
    ├── SEO Merkezi
    ├── Yayın Yönetimi
    ├── Link Sağlık
    ├── Site Sağlık
    ├── Kullanıcı & Yetki
    ├── Audit Log
    ├── Yedekleme
    ├── Bildirimler
    └── Sistem Ayarları
```

Admin paneli public sitenin HTML dosyalarını rastgele değiştiren bir sistem **kesinlikle** olmamalıdır.

**Single Source of Truth** yaklaşımı kullanılmalıdır.

Veri akışı:

```text
ADMIN PANEL
    ↓
API / Backend
    ↓
DATABASE / STORAGE (Single Source of Truth)
    ↓
BUILD / SSR / ISR
    ↓
PUBLIC WEBSITE
```

---

# 3. [EKLENDİ] TECH STACK KARARI

> [!IMPORTANT]
> Orijinal planda tech stack kararı yoktu. Bu, Gemini'nin başlarken felç olmasına yol açar.
> Mevcut MSK Labs mimarisine bakılarak FAZ 0'da kesinleştirilecektir.
> Aşağıdakiler **öneri seçenekleridir** — FAZ 0 analizi sonrası birlikte seçilecektir.

## Backend Seçenekleri

| Seçenek | Ne zaman tercih et |
|---------|-------------------|
| **Next.js API Routes** | Mevcut site zaten Next.js ise — en az sürtüşme |
| **Node.js + Express / Fastify** | Mevcut site statik ise — ayrı backend |
| **Firebase / Supabase** | Hızlı prototip, backend-as-a-service isteniyorsa |

## Database Seçenekleri

| Seçenek | Ne zaman tercih et |
|---------|-------------------|
| **Firestore (Firebase)** | Mevcut proje Firebase kullanıyorsa |
| **Supabase (PostgreSQL)** | İlişkisel veri, güçlü sorgu ihtiyacı |
| **PlanetScale / Neon** | Serverless PostgreSQL tercih ediliyorsa |
| **JSON dosyaları + Git** | Mevcut site tamamen statik ise (geçici) |

## Frontend (Admin UI)

| Seçenek | Açıklama |
|---------|----------|
| **Next.js App Router** | SSR/SSG ile backend aynı projede |
| **React + Vite** | Bağımsız SPA admin paneli |

## Dosya Storage

| Seçenek | Açıklama |
|---------|----------|
| **Firebase Storage** | Firebase ekosistemi |
| **Supabase Storage** | Supabase ekosistemi |
| **Cloudinary** | Görsel optimizasyonu dahili |
| **Vercel Blob** | Vercel hosting kullanıyorsa |

> **FAZ 0'da analiz edilip FAZ 1'de kesinleştirilecektir.**

---

# 4. [EKLENDİ] AUTHENTICATION STRATEJİSİ

> [!IMPORTANT]
> Orijinal planda "güvenli authentication" yazıyordu fakat **nasıl** sorusu yanıtsızdı.

## Önerilen Yaklaşım

```text
Option A: NextAuth.js (next-auth)
  → Credentials provider (kullanıcı adı + şifre)
  → Session: JWT (httpOnly cookie)
  → CSRF built-in

Option B: Supabase Auth
  → Email + şifre
  → RLS (Row Level Security) ile DB güvenliği

Option C: Firebase Auth
  → Email + şifre veya Google OAuth
```

## Minimum Gereksinimler (hangisi seçilirse seçilsin)

- [ ] httpOnly, Secure, SameSite=Strict cookie
- [ ] JWT expiry: 15 dakika (access) + 7 gün (refresh)
- [ ] Refresh token rotation
- [ ] Brute-force koruması: 5 başarısız giriş → 15 dakika lock
- [ ] Rate limiting: `/admin/login` endpoint → 10 istek/dakika
- [ ] Şifre hashing: bcrypt (cost: 12)
- [ ] MFA desteği (gelecek için mimari hazır)

---

# 5. [EKLENDİ] ENVIRONMENT & SECRETS YÖNETİMİ

> [!CAUTION]
> Orijinal planda "secret/key bilgilerini repository'ye koymayacak" yazıyordu
> ama nasıl yönetileceği belirtilmemişti.

## Kurallar

```text
.env.local         → Yerel geliştirme (git ignore)
.env.example       → Şablon (git'e girer, değer içermez)
Vercel / Netlify   → Production env vars
```

## Gerekli Environment Variables (Taslak)

```env
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Database
DATABASE_URL=

# Storage
STORAGE_BUCKET=
STORAGE_KEY=

# App
ADMIN_EMAIL=
SITE_URL=

# Optional
GEMINI_API_KEY=   # AI özellikler için
```

---

# 6. TASARIM FELSEFESİ

Admin paneli aşağıdaki özellikleri taşımalıdır:

- Modern ve premium hissettiren
- Estetik fakat sade
- Hızlı ve responsive
- Mobil uyumlu
- Dark / Light mode destekli
- Erişilebilir (WCAG AA)
- Klavye kullanımına uygun
- Türkçe ağırlıklı, gelecekte çoklu dile hazır

Gösteriş uğruna kullanılabilirlikten taviz verilmeyecektir.

Hedef his: **Profesyonel SaaS yönetim paneli** (Linear, Vercel Dashboard, Raycast benzeri)

## [EKLENDİ] Design Token Referansları

```text
Renk paleti       → Neutral + tek accent renk (marka rengi)
Typography        → Inter veya Geist (sistem font alternatifi)
Spacing           → 4px base grid
Border radius     → sm: 4px, md: 8px, lg: 12px
Shadow            → Subtle, katmanlı
Motion            → Framer Motion veya CSS transition (150-200ms)
Icons             → Lucide React (tutarlı, açık kaynak)
```

---

# 7. DASHBOARD

Ana ekran aşağıdaki bilgileri göstermelidir:

## Genel Bakış (KPI Cards)

```text
┌─────────────────┬─────────────────┬─────────────────┐
│  Toplam App     │  Yayındaki App  │  Taslak App     │
│      12         │       9         │       3         │
└─────────────────┴─────────────────┴─────────────────┘
┌─────────────────┬─────────────────┬─────────────────┐
│  Toplam Yazı    │  Yayındaki Yazı │  Kırık Link     │
│      47         │       44        │   ⚠ 2           │
└─────────────────┴─────────────────┴─────────────────┘
```

## Aktivite Akışı (son 20 işlem)

```text
14:32  [Admin] DeskPilot güncellendi
13:48  [Admin] Yeni yazı oluşturuldu — "BİZCE #48"
12:16  [Admin] Yeni görsel yüklendi — logo.webp
11:05  [Sistem] Bir bağlantı geçersiz hale geldi → Direct Download
```

## Hızlı İşlemler

```text
[ + Yeni Uygulama ]  [ + Yeni Yazı ]  [ ↑ Görsel Yükle ]  [ ⚠ Uyarılar ]
```

## [EKLENDİ] Dashboard Widget Sistemi

Widget'lar sabit olmak zorunda değildir. İleride:
- Widget sıralama (drag & drop)
- Widget göster/gizle
- Tarih aralığı filtresi

eklenebilir. **İlk versiyonda sabit layout yeterlidir.**

---

# 8. UYGULAMA YÖNETİMİ

Panel üzerinden yeni uygulama oluşturulabilmelidir.

## Temel Bilgiler

- Uygulama adı
- Kısa açıklama (max 160 karakter)
- Uzun açıklama (rich text)
- Slug (otomatik önerilmeli, manuel düzenlenebilmeli)
- Logo (SVG / WebP, max 512x512)
- Kapak görseli (16:9 önerilen)
- Galeri (sürükle-bırak, sıralama)
- Kategori (çoklu)
- Etiketler
- Durum (Taslak / İnceleme / Yayında / Arşiv)
- Yayın tarihi

## Teknik Bilgiler

- Platform desteği: Android, iOS, Windows, Linux, macOS, Web
- Sürüm (semver: major.minor.patch)
- Son güncelleme tarihi
- İndirme boyutu
- Minimum sistem gereksinimleri
- Lisans türü
- Dil desteği

## Link Yönetimi

Her platform için ayrı bağlantı:

| Platform | URL | Durum |
|----------|-----|-------|
| Google Play | https://... | ✓ Aktif |
| App Store | https://... | ✓ Aktif |
| Microsoft Store | https://... | ⚠ Kontrol et |
| Direct Download | https://... | ✕ Bozuk |
| Web App | https://... | ✓ Aktif |
| GitHub | https://... | ✓ Aktif |
| Documentation | https://... | — Yok |

Bağlantı durumu panelden manuel veya otomatik kontrol edilebilmelidir.

## Özellik Yönetimi (Dynamic Features)

```text
[ + Özellik Ekle ]

┌─────────────────────────────────────────┐
│ İkon: [🎯]  Başlık: [Kolay kullanım   ] │
│ Açıklama: [Sürükle bırak ile...       ] │
│                              [Sil] [↕] │
└─────────────────────────────────────────┘
```

## Ekran Görüntüleri

Sürükle-bırak destekli, sıralama değiştirilebilir.
Her görsel için alt text girilebilmelidir (erişilebilirlik + SEO).

## [EKLENDİ] Changelog / Sürüm Geçmişi

```text
Sürüm 2.1.0 — 15 Eylül 2026
  • Yeni özellik A eklendi
  • Bug fix: #42 düzeltildi
  • Performans iyileştirmesi

Sürüm 2.0.0 — 01 Haziran 2026
  • Büyük yeniden tasarım
```

---

# 9. İÇERİK EDİTÖRÜ (Blog / BİZCE / GÜNCEL / ANILTILAR)

Tek bir gelişmiş yayın editörü oluşturulacaktır.

İçerik türleri:

| Tür | Açıklama |
|-----|----------|
| BİZCE | Görüş yazıları |
| GÜNCEL | Haberler, duyurular |
| ANILTILAR | Anı/deneyim paylaşımları |
| BLOG | Teknik/genel blog |

## Editör Özellikleri

Önerilen: **TipTap** (ProseMirror tabanlı, headless, özelleştirilebilir)
Alternatif: **Plate.js**, **Lexical**

> [!NOTE]
> Quill, CKEditor veya TinyMCE gibi ağır editörler **önerilmez**.
> TipTap headless yapısı MSK Labs tasarımıyla tam uyum sağlar.

Desteklenecek bloklar:

```text
Metin blokları:   Başlık (H1-H4), Paragraf, Alıntı, Callout
Liste:            Sıralı, Sırasız, Görev listesi
Medya:            Görsel, Video (embed), Dosya ekleme
İçerik:           Tablo, Kod bloğu (syntax highlighting), Bölücü
Gömülü:           YouTube, Twitter/X, iFrame (whitelist'e göre)
```

Gereksiz editör karmaşıklığından kaçınılmalıdır. Slash command (`/`) ile blok ekleme önerilir.

## İçerik Meta Alanları

- Başlık
- Alt başlık (opsiyonel)
- Özet / Excerpt (max 300 karakter)
- Kapak görseli
- Yazar
- Yayın tarihi
- Okuma süresi (otomatik hesaplansın)
- İçerik türü
- Kategori / Etiket

---

# 10. GELİŞMİŞ YAYIN SİSTEMİ

İçerik yaşam döngüsü:

```text
Taslak ──→ İnceleme ──→ Planlandı ──→ Yayında ──→ Arşiv
   ↑______________|         |              |
   (Revizyon gerekli)    (İptal)       (Geri al)
```

Zamanlanmış yayın desteklenmelidir:

```text
📅 15 Ekim 2026 09:00'da otomatik yayınla
```

## [EKLENDİ] Yayın Durumu Geçiş Kuralları

| Mevcut | Geçilebilir Durumlar |
|--------|---------------------|
| Taslak | İnceleme, Planlandı |
| İnceleme | Taslak, Planlandı, Yayında |
| Planlandı | Taslak, Yayında (iptal) |
| Yayında | Arşiv |
| Arşiv | Taslak (geri al) |

---

# 11. OTOMATİK TASLAK KAYDI

Editör yazarken otomatik kayıt yapılmalıdır.

```text
Son kaydedilme: 14:32:05  ✓ Kaydedildi
                          ⏳ Kaydediliyor...
                          ⚠ Kaydedilemedi — tekrar dene
```

## [GÜÇLENDİRİLDİ] Kayıp Koruma Stratejisi

- Otomatik kayıt: her **30 saniyede bir** veya her **önemli değişiklikte**
- `localStorage` fallback: bağlantı kopması durumunda tarayıcıda geçici saklama
- Sayfa yeniden açıldığında: "Kaydedilmemiş taslak bulundu — yükle / sil" uyarısı
- Debounce: 2 saniye bekle, ardından kaydet (gereksiz API çağrısı önlenir)

---

# 12. VERSİYONLAMA & DEĞİŞİKLİK GEÇMİŞİ

Her içerik için sürüm geçmişi tutulmalıdır.

```text
v4  (Mevcut) — 02.10.2026 14:32 — Admin
v3           — 01.10.2026 09:15 — Admin    [Bu sürümü geri yükle]
v2           — 28.09.2026 11:00 — Admin    [Bu sürümü geri yükle]
v1           — 25.09.2026 16:45 — Admin    [Bu sürümü geri yükle]
```

Her sürümde görülebilecekler:
- Kim değiştirdi
- Ne zaman değiştirdi
- Hangi alanlar değişti (diff görünümü)
- Sürümü önizle

## [EKLENDİ] Versiyon Saklama Politikası

```text
Son 50 versiyon saklanır.
30 günden eski versiyonlar otomatik temizlenir.
(Politika ayarlardan değiştirilebilir)
```

---

# 13. MEDYA MERKEZİ

Merkezi bir **Medya Kütüphanesi** oluşturulacaktır.

Desteklenecek işlemler:

- Görsel / dosya yükleme (drag & drop + tıklama)
- Görsel silme (çöp kutusuna taşıma)
- Görsel değiştirme / yeniden adlandırma
- Arama ve filtreleme (tür, boyut, tarih, etiket)
- Klasörleme (mantıksal organizasyon)
- Etiketleme
- Kullanım takibi (nerede kullanıldığı)
- Toplu seçim ve toplu işlem

## [EKLENDİ] Kullanım Takibi

```text
deskpilot-cover.webp

Kullanıldığı yerler:
  • Uygulama: DeskPilot → Kapak
  • Sayfa: Ana Sayfa → Hero
  • Yazı: BİZCE #24 → Kapak

⚠ Bu görseli silmeden önce yukarıdaki bağlantılar kaldırılmalıdır.
```

## Görsel Optimizasyonu

Görsel yüklendiğinde:

| İşlem | Koşul |
|-------|-------|
| WebP / AVIF dönüşümü | Kaynak PNG/JPEG ise |
| Thumbnail oluşturma | Her görsel için (150x150, 300x300) |
| Boyutlandırma | Max boyut aşılmışsa (örn. 2400px) |
| Metadata temizleme | EXIF verisi |
| Dosya boyutu optimizasyonu | Daima |

Orijinal dosya arşivde saklanabilir (opsiyonel ayar).

---

# 14. SEO MERKEZİ

Her uygulama ve yazı için:

| Alan | Açıklama |
|------|----------|
| SEO title | Max 60 karakter, karakter sayacı |
| Meta description | Max 160 karakter, karakter sayacı |
| Canonical URL | Otomatik önerilmeli |
| Slug | URL dostu, otomatik + manuel |
| OG title | Sosyal paylaşım başlığı |
| OG description | Sosyal paylaşım açıklaması |
| OG image | 1200x630 önerilir |
| Twitter/X card | summary_large_image |
| Robots | index/noindex, follow/nofollow |
| Schema.org | Article, SoftwareApplication, Organization |

## SEO Kontrol Paneli

```text
SEO Skoru: 85/100

✓ Başlık uygun uzunlukta (52 karakter)
✓ Meta description mevcut (145 karakter)
⚠ OG Image eksik — sosyal paylaşımda sorun çıkabilir
✓ Canonical URL ayarlandı
⚠ Schema.org yapılandırılmamış
✓ Slug URL dostu
```

## [EKLENDİ] Global SEO Ayarları

- Site geneli varsayılan OG image
- Site geneli robots.txt yönetimi
- Sitemap.xml otomatik güncelleme (içerik yayınlandığında)
- Hreflang desteği (çoklu dil için hazırlık)

---

# 15. AI DESTEKLİ SEO / İÇERİK ÖNERİLERİ

Mimari AI entegrasyonuna hazır olmalıdır.

## [GÜÇLENDİRİLDİ] AI Kuralları

> [!IMPORTANT]
> AI hiçbir zaman kullanıcı onayı olmadan içeriği değiştirmemeli veya yayınlamamalıdır.
> AI önerileri her zaman **"Kabul Et / Reddet / Düzenle"** akışıyla sunulmalıdır.

Önerilen entegrasyon: **Gemini API** (mevcut ekosistemle uyumlu)

İleride eklenebilecek özellikler:

```text
[ AI Öner ] → Özet oluştur
[ AI Öner ] → SEO meta description yaz
[ AI Öner ] → Başlık önerileri (3 seçenek)
[ AI Öner ] → Etiket önerileri
[ AI Öner ] → Görsel alt text
[ AI Kontrol ] → Yazım ve dilbilgisi kontrolü
[ AI Kontrol ] → İçerik kalite skoru
[ AI Kontrol ] → Okunabilirlik analizi
```

---

# 16. LİNK SAĞLIK SİSTEMİ

Belirli aralıklarla tüm bağlantılar kontrol edilmelidir:

- Uygulama indirme linkleri
- Dış bağlantılar
- Sosyal medya bağlantıları
- Dokümantasyon bağlantıları
- Görsel URL'leri

## [GÜÇLENDİRİLDİ] Kontrol Mekanizması

```text
Otomatik: Her 24 saatte bir (cron job / scheduled function)
Manuel:   [ Şimdi Kontrol Et ] butonu

Sonuç:
  ✓ Google Play         → 200 OK
  ✓ GitHub              → 200 OK
  ⚠ Direct Download     → Yavaş yanıt (3.2s)
  ✕ Documentation       → 404 Not Found

Son kontrol: 02.10.2026 03:00
```

Dashboard'da özet gösterim + detay sayfasına link.

---

# 17. SİTE SAĞLIK MERKEZİ

```text
Kontrol Kategorileri:

SEO Sağlığı:
  ✓ Tüm sayfalar canonical URL'e sahip
  ⚠ 3 içeriğin OG image'ı eksik
  ✓ Sitemap güncel

İçerik Sağlığı:
  ✓ Duplicate slug yok
  ✓ Tüm görseller erişilebilir
  ⚠ 1 yayınlanan içerik 404 dönüyor

Teknik Sağlık:
  ✓ robots.txt mevcut
  ✓ sitemap.xml mevcut
  ⚠ 2 görselde alt text eksik
```

---

# 18. KATEGORİ & ETİKET YÖNETİMİ

Panel üzerinden:

- Kategoriler (hiyerarşik — üst/alt kategori)
- Etiketler (düz liste)
- Platformlar
- İçerik türleri

yönetilebilmelidir.

## [GÜÇLENDİRİLDİ] Silme Koruması

```text
"Verimlilik" kategorisini silmek üzeresiniz.

Bu kategori şu anda kullanımda:
  • 3 uygulama
  • 7 yazı

Silmeden önce ne yapmak istersiniz?
  [ Başka Kategoriyle Değiştir ]
  [ İlişkileri Kaldır ve Sil ]
  [ Vazgeç ]
```

---

# 19. ÇÖP KUTUSU & SOFT DELETE

Silinen içerikler doğrudan fiziksel olarak silinmeyecektir.

## [GÜÇLENDİRİLDİ] Soft Delete Modeli

```text
İçerik Durumları:
  active → deleted_at = null
  çöp    → deleted_at = timestamp (30 gün sonra otomatik temizlenir)
  kalıcı → fiziksel silme (onay gerekli)
```

Çöp kutusunda:
- Geri yükle
- Kalıcı sil (onay dialogu ile)
- Toplu temizle

Otomatik temizleme süresi sistem ayarlarından değiştirilebilir (7 / 14 / 30 / 90 gün).

---

# 20. ÖNİZLEME

Yayınlamadan önce içeriğin public sitede nasıl görüneceği gösterilmelidir.

## [GÜÇLENDİRİLDİ] Önizleme Türleri

```text
[ Desktop Önizleme ]  [ Tablet Önizleme ]  [ Mobil Önizleme ]
```

- Admin panelinden çıkmadan, ayrı bir frame/modal içinde gerçek public tasarım gösterilmelidir.
- Önizleme URL'si geçici token ile korunmalıdır (yayınlanmadan önce dışarıdan erişilemez).
- `?preview=TOKEN` yaklaşımı kullanılabilir.

---

# 21. RESPONSIVE TASARIM

| Ekran | Davranış |
|-------|----------|
| Desktop (≥1280px) | Tam sidebar + içerik alanı |
| Tablet (768–1279px) | Daraltılmış/gizlenebilir sidebar |
| Mobil (<768px) | Bottom navigation veya hamburger menu |

Mobil navigasyon öncelikli öğeler:

```text
[ Dashboard ]  [ İçerikler ]  [ Medya ]  [ ⚙ ]
```

---

# 22. GLOBAL SEARCH

`Ctrl + K` ile açılan komut paleti:

```text
┌─────────────────────────────────────────┐
│ 🔍  Ne arıyorsunuz?                    │
├─────────────────────────────────────────┤
│ 📱  DeskPilot                           │
│ 📝  BİZCE #47 — Verimlilik Üzerine     │
│ 🖼  deskpilot-cover.webp               │
│ ⚙   SEO Ayarları                       │
└─────────────────────────────────────────┘
```

Arama kapsamı: Uygulamalar, yazılar, medya, kategoriler, kullanıcılar, ayarlar, sayfalar.

## [EKLENDİ] Hızlı İşlemler (Command Palette)

```text
> Yeni Uygulama oluştur
> Yeni Yazı oluştur
> Medya yükle
> Önizleme aç
> Ayarlara git
> Çıkış yap
```

---

# 23. KLAVYE KISAYOLLARI

```text
Genel:
  Ctrl + K          → Global Search / Command Palette
  Ctrl + S          → Kaydet (taslak)
  Ctrl + Enter      → Yayınla
  Esc               → Kapat / İptal

Editör:
  Ctrl + B          → Kalın
  Ctrl + I          → İtalik
  Ctrl + Z          → Geri al
  Ctrl + Shift + Z  → İleri al
  /                 → Blok ekleme menüsü

Navigasyon:
  G + D             → Dashboard'a git
  G + A             → Uygulamalara git
  G + P             → Yazılara git
  G + M             → Medyaya git
```

---

# 24. KULLANICI & YETKİ SİSTEMİ

Şimdilik tek kullanıcı olsa bile mimari çok kullanıcılı kullanıma hazır olmalıdır.

## Roller

| Rol | Yetkiler |
|-----|---------|
| **Super Admin** | Her şey + sistem ayarları + kullanıcı yönetimi |
| **Admin** | İçerik + medya + SEO + yayın |
| **Editor** | İçerik oluştur/düzenle, yayın yapamaz |
| **Author** | Sadece kendi içeriklerini oluştur/düzenle |
| **Viewer** | Sadece görüntüle (preview) |

## [EKLENDİ] İzin Matrisi (Örnek)

| İşlem | Super Admin | Admin | Editor | Author | Viewer |
|-------|------------|-------|--------|--------|--------|
| İçerik oluştur | ✓ | ✓ | ✓ | ✓ | ✗ |
| İçerik yayınla | ✓ | ✓ | ✗ | ✗ | ✗ |
| Medya sil | ✓ | ✓ | ✗ | ✗ | ✗ |
| Sistem ayarları | ✓ | ✗ | ✗ | ✗ | ✗ |
| Kullanıcı yönet | ✓ | ✗ | ✗ | ✗ | ✗ |
| Audit log gör | ✓ | ✓ | ✗ | ✗ | ✗ |

---

# 25. GÜVENLİK

Admin paneli public siteden güvenli şekilde ayrılmalıdır.

## [GÜÇLENDİRİLDİ] Güvenlik Kontrol Listesi

### Authentication & Session
- [ ] httpOnly + Secure + SameSite cookie
- [ ] JWT short-lived access token (15 dk) + refresh token rotation
- [ ] CSRF token (double-submit cookie pattern)
- [ ] Session fixation koruması

### Input & Upload
- [ ] XSS koruması (CSP header + sanitization)
- [ ] Input validation (server-side, tüm endpointlerde)
- [ ] SQL Injection / NoSQL injection koruması
- [ ] Dosya yükleme: MIME type doğrulama (magic bytes)
- [ ] Dosya boyutu limiti (örn. max 10MB görsel)
- [ ] Dosya adı sanitization
- [ ] Upload path traversal koruması

### Rate Limiting & Brute Force
- [ ] Login endpoint: max 5 deneme / 15 dakika
- [ ] API genel: rate limiting (örn. 100 istek/dakika)
- [ ] IP bazlı blocking

### Diğer
- [ ] Güvenli password hashing (bcrypt, cost: 12)
- [ ] Şifreler ve gizli anahtarlar source code'a yazılmayacak
- [ ] Dependency güvenlik taraması (npm audit)
- [ ] Security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- [ ] Audit log (her kritik işlem)

---

# 26. AUDIT LOG

Her kritik işlem kayıt altına alınmalıdır.

## Log Formatı

```json
{
  "id": "uuid",
  "userId": "admin-uuid",
  "userEmail": "admin@msklabs.com",
  "action": "UPDATE",
  "resource": "Application",
  "resourceId": "deskpilot",
  "changes": {
    "status": { "from": "draft", "to": "published" }
  },
  "ip": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2026-10-02T14:32:00Z",
  "result": "success"
}
```

## [EKLENDİ] Log Kategorileri

```text
AUTH:     Giriş, çıkış, başarısız denemeler
CONTENT:  Oluştur, güncelle, sil, yayınla, arşivle
MEDIA:    Yükle, sil, güncelle
SYSTEM:   Ayar değişikliği, yedekleme, geri yükleme
SECURITY: Şüpheli aktivite, rate limit aşımı
```

Audit log **düzenlenemez ve silinemez** (append-only).

---

# 27. YEDEKLEME

İçerik verileri için:

| Tür | Açıklama |
|-----|----------|
| Manuel yedek | Panelden tek tıkla |
| Otomatik yedek | Günlük (cron) |
| Geri yükleme | Onay + opsiyonel şifre doğrulaması |

## [EKLENDİ] Yedek Kapsamı

```text
Yedek içeriği:
  ✓ Tüm içerik verisi (JSON)
  ✓ Medya metadata
  ✓ Kullanıcı ayarları
  ✓ SEO konfigürasyonu
  ✗ Medya dosyaları (büyüklük nedeniyle ayrı)
```

Yedekler ZIP + JSON formatında indirilebilir olmalıdır.
Otomatik yedekler son 7 gün saklanır (ayarlanabilir).

---

# 28. IMPORT / EXPORT

İçeriklerin sistemden bağımsız taşınabilmesi için:

```text
Export → JSON (içerik + meta)
       → ZIP (içerik + görseller dahil)
       → Markdown (insanlar tarafından okunabilir)

Import → JSON / ZIP
       → Çakışma kontrolü
       → Dry-run modu (önce ne olacağını göster)
```

> [!NOTE]
> Amaç: Platform değişikliğinde içerik kaybını önlemek ve vendor lock-in'i minimize etmek.

---

# 29. [EKLENDİ] API CONTRACT

> [!IMPORTANT]
> Orijinal planda API tasarımı hiç yoktu. Bu kritik bir eksikti.

## Tasarım Prensipleri

```text
RESTful veya tRPC (Next.js ile)
Versiyonlama: /api/v1/...
Auth: Bearer token (Authorization header) veya httpOnly cookie
Content-Type: application/json
```

## Temel Endpoint'ler (Taslak)

```text
AUTH
  POST   /api/v1/auth/login
  POST   /api/v1/auth/logout
  POST   /api/v1/auth/refresh

APPLICATIONS
  GET    /api/v1/apps              → Liste (filter, sort, paginate)
  POST   /api/v1/apps              → Yeni oluştur
  GET    /api/v1/apps/:id          → Detay
  PATCH  /api/v1/apps/:id          → Güncelle
  DELETE /api/v1/apps/:id          → Soft delete

POSTS
  GET    /api/v1/posts
  POST   /api/v1/posts
  GET    /api/v1/posts/:id
  PATCH  /api/v1/posts/:id
  DELETE /api/v1/posts/:id

MEDIA
  GET    /api/v1/media
  POST   /api/v1/media/upload
  DELETE /api/v1/media/:id

SEO
  GET    /api/v1/seo/:type/:id
  PATCH  /api/v1/seo/:type/:id

HEALTH
  GET    /api/v1/health/links
  GET    /api/v1/health/site
  POST   /api/v1/health/links/check

AUDIT
  GET    /api/v1/audit/logs

BACKUP
  POST   /api/v1/backup/create
  GET    /api/v1/backup/list
  POST   /api/v1/backup/restore/:id
```

Her endpoint:
- Hata durumunda standart hata formatı döner
- Pagination: `?page=1&limit=20`
- Filter: `?status=published&type=bizcE`
- Sort: `?sort=createdAt&order=desc`

---

# 30. BİLDİRİM MERKEZİ

Panel içerisinde merkezi bildirim alanı:

```text
🔔 Bildirimler (3 yeni)

⚠ [Kritik] 2 kırık bağlantı bulundu — Direct Download, Documentation
⚠ [SEO]    3 içeriğin OG image'ı eksik
ℹ [Bilgi]  DeskPilot v2.1.0 taslak olarak oluşturuldu
```

## [EKLENDİ] Bildirim Seviyeleri

| Seviye | Renk | Örnek |
|--------|------|-------|
| Kritik | Kırmızı | Kırık link, sistem hatası |
| Uyarı | Sarı | Eksik SEO alanı |
| Bilgi | Mavi | Yeni taslak |
| Başarı | Yeşil | Yayın tamamlandı |

Bildirimler: okundu/okunmadı durumu, toplu işaret, filtreleme.

---

# 31. SİSTEM AYARLARI

## [GÜÇLENDİRİLDİ] Ayar Kategorileri

```text
Genel
  • Site adı, açıklama
  • Logo (light + dark mode için ayrı)
  • Favicon
  • İletişim bilgileri

İçerik
  • Varsayılan yayın dili
  • Otomatik kayıt aralığı
  • Versiyon saklama süresi
  • Çöp kutusu temizleme süresi

Medya
  • Max dosya boyutu
  • İzin verilen MIME türleri
  • Otomatik WebP dönüşümü
  • Thumbnail boyutları

SEO
  • Varsayılan meta bilgileri
  • OG image varsayılanı
  • Robots.txt
  • Sitemap güncelleme sıklığı

Güvenlik
  • Oturum süresi
  • Başarısız giriş limiti
  • MFA zorunluluğu

Bildirimler
  • Hangi olaylar bildirim oluştursun
  • E-posta bildirimleri (opsiyonel)

Yedekleme
  • Otomatik yedek sıklığı
  • Yedek saklama süresi

Temizlik
  • Cache temizle
  • Geçici dosyaları temizle
```

---

# 32. VERİ DOĞRULAMA

Form kaydedilmeden önce (hem client hem server-side):

| Alan | Kural |
|------|-------|
| Zorunlu alanlar | Boş bırakılamaz |
| URL alanları | Geçerli URL formatı |
| Slug | Lowercase, alfanümerik + tire, benzersiz |
| Görseller | MIME type + boyut + format |
| Tarih | Geçerli tarih, mantıklı aralık |
| Sürüm | Semver formatı (x.y.z) |
| SEO başlık | Max 60 karakter |
| Meta description | Max 160 karakter |

Hatalar kullanıcıya **alan bazında**, **açık ve Türkçe** mesajlarla gösterilmelidir.

```text
❌ Slug zaten kullanımda. Farklı bir slug seçin.
❌ OG Image boyutu 1200x630 piksel olmalıdır.
```

---

# 33. DESIGN SYSTEM

Merkezi tasarım sistemi oluşturulmalıdır.

## Token'lar

```css
/* Renkler */
--color-primary: ...;
--color-bg: ...;
--color-surface: ...;
--color-border: ...;
--color-text: ...;
--color-muted: ...;
--color-danger: ...;
--color-warning: ...;
--color-success: ...;

/* Spacing */
--space-1: 4px;
--space-2: 8px;
--space-4: 16px;
--space-8: 32px;

/* Border radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;

/* Typography */
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'Fira Code', monospace;
```

## Komponent Kataloğu

```text
Layout:       AdminLayout, Sidebar, Header, Main, Footer
Navigation:   NavItem, NavGroup, Breadcrumb, Tabs
Forms:        FormField, Input, Textarea, Select, Toggle, Checkbox, DatePicker, FileUpload
Data:         DataTable, DataGrid, Pagination, SortableList
Feedback:     Toast, Alert, Banner, LoadingSpinner, Skeleton, EmptyState, ErrorState
Overlay:      Modal, Drawer, ConfirmDialog, Tooltip, Popover
Content:      Card, Badge, StatusBadge, Avatar, Tag
Media:        MediaPicker, ImagePreview, FileIcon
Editor:       RichTextEditor, CodeBlock, MediaEmbed
```

---

# 34. COMPONENT TABANLI YAPI

Tekrarlanan UI kodları çoğaltılmamalıdır.

Her bileşen:
- TypeScript ile tip güvenli
- Prop arayüzü net tanımlı
- Storybook veya benzer araçla dokümante edilebilir (ileride)
- Test edilebilir (unit + integration)

---

# 35. PERFORMANS

| Teknik | Açıklama |
|--------|----------|
| Lazy loading | Route bazlı code splitting |
| Pagination | Liste ekranlarında (varsayılan: 20 öğe/sayfa) |
| Debounced search | 300ms debounce |
| Image thumbnails | Küçük görseller için thumbnail |
| Caching | API yanıtları (SWR veya React Query) |
| Optimistic UI | Anlık geri bildirim gereken işlemler |
| Gereksiz re-render önleme | memo, useMemo, useCallback |
| Bundle analizi | Build'de bundle size takibi |

---

# 36. HATA YÖNETİMİ

Kullanıcı hiçbir zaman boş ekran görmemelidir.

## State Matrisi

| Durum | Gösterim |
|-------|----------|
| Loading | Skeleton loader |
| Success | İçerik |
| Empty | Boş durum illustrasyonu + eylem butonu |
| Error | Hata mesajı + tekrar dene butonu |
| Warning | Uyarı banner'ı + devam et seçeneği |
| Offline | Çevrimdışı banner'ı |

## [EKLENDİ] Error Boundary

React Error Boundary ile beklenmedik JS hataları yakalanmalı ve kullanıcıya anlamlı mesaj gösterilmelidir.

---

# 37. [EKLENDİ] TEST STRATEJİSİ

> [!NOTE]
> Orijinal planda test stratejisi yoktu. Bu eklendi.

## Test Seviyeleri

| Seviye | Araç | Kapsam |
|--------|------|--------|
| Unit | Vitest / Jest | Utility fonksiyonlar, hook'lar |
| Component | React Testing Library | UI bileşenleri |
| Integration | Vitest + MSW | API entegrasyonu |
| E2E | Playwright | Kritik kullanıcı akışları |

## Kritik Test Senaryoları

```text
✓ Login / Logout akışı
✓ Uygulama oluştur → yayınla akışı
✓ Yazı oluştur → önizle → yayınla akışı
✓ Medya yükle → kullan → sil akışı
✓ Sürüm geri yükleme
✓ Kırık link tespiti
✓ Unauthorized erişim engeli
✓ Rate limiting davranışı
```

---

# 38. ERİŞİLEBİLİRLİK

WCAG 2.1 AA prensipleri dikkate alınmalıdır:

- [ ] Keyboard navigation (Tab, Enter, Esc, Arrow keys)
- [ ] Visible focus state (outline kaldırılmayacak)
- [ ] Semantic HTML (heading hiyerarşisi, landmark'lar)
- [ ] ARIA (role, label, describedby)
- [ ] Renk kontrastı: 4.5:1 normal metin, 3:1 büyük metin
- [ ] Ekran okuyucu uyumluluğu (NVDA, VoiceOver)
- [ ] Form etiketleri (her input'un label'ı var)
- [ ] Hata mesajları renk dışında da belirtilmeli (ikon + metin)

---

# 39. ÇOKLU DİL HAZIRLIĞI

Bugün Türkçe kullanılabilir. Veri modeli gelecekte çoklu dile genişleyebilir.

## [GÜÇLENDİRİLDİ] i18n Stratejisi

```json
// İçerik veri modeli
{
  "title": {
    "tr": "DeskPilot",
    "en": "DeskPilot"
  },
  "description": {
    "tr": "Masa düzeni yöneticisi...",
    "en": "Desktop layout manager..."
  }
}
```

Admin UI metinleri için: `next-intl` veya `react-i18next`

---

# 40. VERİ MODELLERİ

## Uygulama (Application)

```typescript
interface Application {
  id: string;
  slug: string;
  name: LocalizedString;
  shortDescription: LocalizedString;  // max 160 char
  description: LocalizedString;       // rich text (JSON/HTML)
  icon: MediaRef;
  cover: MediaRef;
  screenshots: MediaRef[];
  features: Feature[];
  platforms: Platform[];
  versions: Version[];
  downloadLinks: DownloadLink[];
  categories: string[];
  tags: string[];
  seo: SEOMeta;
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  deletedAt?: Date;    // soft delete
  createdBy: string;
  updatedBy: string;
}

interface Version {
  version: string;     // semver
  releaseDate: Date;
  changelog: LocalizedString[];
  downloadSize?: string;
  requirements?: string;
}

interface DownloadLink {
  platform: 'google-play' | 'app-store' | 'microsoft-store' | 'direct' | 'web' | 'github' | 'docs';
  url: string;
  status?: 'ok' | 'slow' | 'broken' | 'unchecked';
  lastChecked?: Date;
}

type LocalizedString = {
  tr: string;
  en?: string;
};
```

## Yazı (Post)

```typescript
interface Post {
  id: string;
  slug: string;
  type: 'bizcE' | 'guncel' | 'aniltilar' | 'blog';
  title: LocalizedString;
  subtitle?: LocalizedString;
  excerpt: LocalizedString;   // max 300 char
  content: LocalizedString;   // rich text
  cover: MediaRef;
  gallery?: MediaRef[];
  author: string;
  categories: string[];
  tags: string[];
  readingTime?: number;        // dakika (otomatik hesaplanır)
  seo: SEOMeta;
  status: 'draft' | 'review' | 'scheduled' | 'published' | 'archived';
  scheduledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  deletedAt?: Date;
  createdBy: string;
  updatedBy: string;
}
```

## Medya (Media)

```typescript
interface Media {
  id: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;              // bytes
  width?: number;
  height?: number;
  url: string;
  thumbnailUrl?: string;
  alt?: LocalizedString;
  caption?: LocalizedString;
  folder?: string;
  tags: string[];
  usedIn: MediaUsage[];
  uploadedBy: string;
  createdAt: Date;
  deletedAt?: Date;
}
```

---

# 41. ADMIN URL YAPISI

```text
/admin                       → Dashboard'a redirect
/admin/login                 → Giriş
/admin/dashboard             → Dashboard

/admin/apps                  → Uygulama listesi
/admin/apps/new              → Yeni uygulama
/admin/apps/:id              → Uygulama düzenleme
/admin/apps/:id/versions     → Sürüm yönetimi
/admin/apps/:id/preview      → Önizleme

/admin/posts                 → Yazı listesi
/admin/posts/new             → Yeni yazı
/admin/posts/:id             → Yazı düzenleme
/admin/posts/:id/versions    → Versiyon geçmişi
/admin/posts/:id/preview     → Önizleme

/admin/media                 → Medya kütüphanesi

/admin/categories            → Kategori yönetimi
/admin/tags                  → Etiket yönetimi

/admin/seo                   → Global SEO ayarları
/admin/seo/check             → SEO kontrol raporu

/admin/health/links          → Link sağlık raporu
/admin/health/site           → Site sağlık raporu

/admin/users                 → Kullanıcı yönetimi

/admin/audit                 → Audit log

/admin/backup                → Yedekleme

/admin/settings              → Sistem ayarları
/admin/settings/general      → Genel ayarlar
/admin/settings/media        → Medya ayarları
/admin/settings/seo          → SEO ayarları
/admin/settings/security     → Güvenlik ayarları
/admin/settings/notifications → Bildirim ayarları
/admin/settings/backup       → Yedekleme ayarları

/admin/trash                 → Çöp kutusu
```

> [!NOTE]
> Gerçek URL yapısı mevcut repository ve hosting mimarisi analiz edildikten sonra FAZ 0'da kesinleştirilecektir.

---

# 42. GELİŞTİRME FAZLARI

## FAZ 0 — Repository Analizi (Kod değişikliği YOK)

**Analiz edilecekler:**

- Mevcut mimari (Next.js / statik / diğer?)
- Mevcut veri yapıları (uygulamalar, blog)
- Mevcut içerik sistemi
- API / functions yapısı
- Media / assets yapısı
- Mevcut yayın mekanizması
- Hosting / deployment altyapısı (Vercel / Netlify / diğer)
- Mevcut güvenlik yaklaşımı
- Mevcut SEO yaklaşımı
- `GEMINI.md`, `tasks_architecture.md`, ilgili config dosyaları

**FAZ 0 Çıktıları:**

```text
architecture.md       → Mevcut mimari dokümantasyonu
data-model.md         → Mevcut + önerilen veri modeli
admin-roadmap.md      → Kesinleştirilmiş fazlar ve kararlar
security-model.md     → Seçilen auth + güvenlik yaklaşımı
tech-stack-decision.md → Tech stack kararı (gerekçeli)
```

**FAZ 0 Sonunda Raporlanacaklar:**

1. Mevcut mimari özeti
2. Önerilen admin CMS mimarisi
3. Seçilen tech stack ve gerekçesi
4. Mevcut sistemle çakışma riskleri
5. Veri modeli önerisi
6. Authentication yaklaşımı önerisi
7. Storage yaklaşımı önerisi
8. API yaklaşımı önerisi
9. Güvenlik modeli önerisi
10. Kesinleştirilmiş faz planı
11. Değiştirilecek / oluşturulacak dosyalar
12. Riskler ve alternatifler

> [!CAUTION]
> FAZ 0 tamamlandıktan sonra kullanıcı onayı beklenmeden bir sonraki adıma geçilmeyecektir.

---

## FAZ 1 — Mimari & Veri Modeli Kararı (Kod değişikliği YOK)

FAZ 0 analizi + kullanıcı onayı sonrası kesinleştirilir:

- Tech stack seçimi
- Veri modeli (veritabanı şeması veya koleksiyon yapısı)
- Authentication modeli
- API endpoint tasarımı
- Storage yapısı
- Public/admin veri akışı
- Yetki modeli
- Yayın modeli
- Versioning modeli
- Media modeli
- Backup modeli

---

## FAZ 2 — Design System & Temel Komponentler

```text
Çıktılar:
  • globals.css / design-tokens
  • AdminLayout bileşeni
  • Sidebar + Header
  • Temel form bileşenleri
  • DataTable
  • Modal / Toast / Alert
  • Dark mode altyapısı
  • Responsive davranış
```

---

## FAZ 3 — Authentication

```text
Çıktılar:
  • Login sayfası (/admin/login)
  • Session yönetimi
  • Middleware (korunan route'lar)
  • Rol bazlı erişim kontrolü
  • Brute-force + rate limiting
  • Güvenlik header'ları
```

---

## FAZ 4 — Dashboard

```text
Çıktılar:
  • Gerçek verilerle çalışan KPI kartları
  • Aktivite akışı
  • Hızlı işlemler
  • Bildirim özeti
```

---

## FAZ 5 — Uygulama CMS

```text
Çıktılar:
  • Uygulama listesi (filtreleme, arama, sıralama)
  • Uygulama oluştur / düzenle formu
  • Sürüm yönetimi
  • Link yönetimi
  • Durum yönetimi
  • API entegrasyonu
```

---

## FAZ 6 — Blog / İçerik CMS

```text
Çıktılar:
  • Yazı listesi
  • Yazı editörü (TipTap)
  • Otomatik taslak kayıt
  • Versiyonlama
  • Undo / Redo
  • Önizleme
  • Zamanlanmış yayın
```

---

## FAZ 7 — Medya Kütüphanesi

```text
Çıktılar:
  • Drag & drop upload
  • Görsel grid + liste görünümü
  • Arama + filtreleme
  • Klasörleme + etiketleme
  • Kullanım takibi
  • Otomatik optimizasyon
```

---

## FAZ 8 — SEO + Yayın Sistemi

```text
Çıktılar:
  • SEO meta yönetimi
  • SEO kontrol paneli
  • Schema.org yapılandırması
  • Sitemap otomatik güncelleme
  • Yayın durumu akışı
  • Önizleme (token korumalı)
```

---

## FAZ 9 — Link Sağlık + Site Sağlık

```text
Çıktılar:
  • Otomatik link kontrolü
  • Manuel tetikleme
  • Site sağlık raporu
  • Dashboard entegrasyonu
```

---

## FAZ 10 — Yedekleme + Import/Export

```text
Çıktılar:
  • Manuel ve otomatik yedek
  • Yedek listesi + indirme
  • Geri yükleme akışı
  • JSON / ZIP export
  • Import + dry-run
```

---

## FAZ 11 — Güvenlik & Performans Testleri

```text
Çıktılar:
  • Güvenlik kontrol listesi doğrulama
  • Lighthouse audit
  • Bundle size analizi
  • E2E test senaryoları (Playwright)
  • Penetration test (manual review)
```

---

## FAZ 12 — Production Hazırlığı

```text
Çıktılar:
  • Environment konfigürasyonu
  • CI/CD pipeline
  • Error monitoring (Sentry veya benzeri)
  • Deployment dokümanı
  • Son kabul kriterleri testi
```

---

# 43. KESİNLİKLE YAPILMAYACAKLAR

Mevcut çalışan sistem her koşulda korunacaktır.

Gemini kesinlikle:

- ❌ Çalışan sayfaları gereksiz yere yeniden yazmayacak
- ❌ Mevcut URL'leri sebepsiz değiştirmeyecek
- ❌ SEO URL'lerini bozmayacak
- ❌ Mevcut uygulama verilerini silmeyecek
- ❌ Mevcut blog içeriklerini kaybetmeyecek
- ❌ Tek seferde bütün projeyi refactor etmeyecek
- ❌ Sırf modern olduğu için gereksiz framework eklemeyecek
- ❌ Gereksiz dependency eklemeyecek
- ❌ Secret/key bilgilerini repository'ye koymayacak
- ❌ Kullanıcı onayı olmadan production değişikliği yapmayacak
- ❌ `git push` yapmayacak (kullanıcı açıkça "push" demeden)
- ❌ Bir faz tamamlanmadan sonraki faza geçmeyecek
- ❌ Konsültasyon sorusuna kod yazarak yanıt vermeyecek
- ❌ AI özelliği, kullanıcı onayı olmadan içerik değiştirmeyecek veya yayınlamayacak

---

# 44. KABUL KRİTERİ

Sistem tamamlandığında kod bilgisi olmayan bir yönetici aşağıdaki işlemleri yapabilmelidir:

## Yeni Uygulama Ekleme

```text
Admin → Uygulamalar → Yeni Uygulama
→ Temel bilgileri gir
→ Görselleri yükle (sürükle-bırak)
→ Platform linklerini gir
→ SEO bilgilerini doldur
→ Önizle (public sitede nasıl görünür?)
→ Yayınla

Sonuç: Uygulama public sitede otomatik görünür.
Hiçbir HTML dosyasına müdahale gerekmez.
```

## Yeni Yazı Yayınlama

```text
Admin → Yazılar → Yeni Yazı
→ Türü seç (BİZCE / GÜNCEL / ANILTILAR / BLOG)
→ Yaz (rich text editör)
→ Görsel ekle
→ SEO kontrolü yap
→ Önizle
→ Hemen yayınla veya zamanla

Sonuç: Yazı ilgili bölümde otomatik görünür.
Hiçbir HTML dosyasına müdahale gerekmez.
```

## Güncelleme

```text
Admin → İlgili içerik → Düzenle
→ Değişiklik yap
→ Kaydet (otomatik veya manuel)
→ Önizle
→ Yayınla

Sonuç: Public site güncellenir.
```

---

# 45. BAŞLANGIÇ KOMUTU

Bu dokümanı okuduktan sonra **hemen kod yazmaya başlama**.

Önce yalnızca **FAZ 0 — Repository Analizi** gerçekleştir.

Özellikle mevcut:
- `GEMINI.md`
- `tasks_architecture.md`
- Uygulama veri yapıları ve mevcut veri dosyaları
- Blog yapıları ve mevcut içerik dosyaları
- `functions/` veya `api/` klasörü
- `public/` ve `assets/` yapısı
- Mevcut yayın mekanizması
- `package.json` (dependencies analizi)
- Deployment konfigürasyonu (vercel.json, netlify.toml, vb.)

incelenmelidir.

> [!IMPORTANT]
> FAZ 0 tamamlandıktan sonra **kullanıcı onayı bekle**.
> Onay gelmeden FAZ 1'e geçme.

---

# 46. SON HEDEF

Ortaya çıkacak sistem basit bir CRUD admin paneli olmamalıdır.

> **MSK Labs'ın uygulamalarını, yazılarını, medyasını, SEO'sunu, yayınlarını, bağlantılarını, sürümlerini, sistem sağlığını ve gelecekteki AI destekli özelliklerini tek merkezden yönetebilen; güvenli, hızlı, estetik, ölçeklenebilir ve uzun süre sürdürülebilir bir İçerik ve Yönetim Platformu.**

Bu hedef:
- Hiçbir zaman tek seferde değil, adım adım inşa edilecektir.
- Her adım mevcut sistemi koruyarak ilerleyecektir.
- Her karar kullanıcı onayı ile gerçekleşecektir.
- Mimari, ileride AI entegrasyonu, otomasyon ve çoklu dil için hazır olacaktır.

---

*Doküman v2.0 — Antigravity (Claude Sonnet 4.6 Thinking) tarafından gözden geçirildi — 02.10.2026*
