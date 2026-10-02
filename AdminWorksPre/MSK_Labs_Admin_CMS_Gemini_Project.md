# MSK LABS — Gelişmiş Yönetim ve İçerik Platformu
## Gemini Code Assistant Proje Talimatı

> **Amaç:** Mevcut MSK Labs web sitesini bozmadan, mevcut mimariyle uyumlu, güvenli, estetik ve ölçeklenebilir bir Yönetim Merkezi / Admin CMS oluşturmak.
>
> **Temel hedef:** MSK Labs yöneticisinin gelecekte yeni uygulamaları, blog yazılarını, görselleri, indirme bağlantılarını, dokümantasyonları ve diğer içerikleri kod dosyalarına dokunmadan yönetebilmesi.

---

# 1. ÇALIŞMA PRENSİBİ

Bu proje tek seferde kodlanmayacaktır.

Her fazdan önce:

1. Mevcut repository'yi ve ilgili dosyaları incele.
2. Bu fazın mevcut mimariyle olası çakışmalarını belirle.
3. Önerilen çözümü ve etkilenecek dosyaları açıkla.
4. Kullanıcı onayı olmadan kod yazma.
5. Onaydan sonra yalnızca ilgili fazı uygula.
6. Uygulama sonunda test et.
7. Değişiklikleri ve test sonuçlarını raporla.
8. Sonraki faza kendiliğinden geçme.

Mevcut çalışan özellikler korunmalıdır.

---

# 2. ANA MİMARİ

Admin paneli ile public web sitesi birbirinden ayrılmalıdır.

```text
MSK Labs
│
├── Public Website
│   ├── Ana Sayfa
│   ├── Uygulamalar
│   ├── BİZCE
│   ├── ANILTILAR
│   ├── GÜNCEL
│   └── Kurumsal Sayfalar
│
└── Admin / Yönetim Merkezi
    ├── Dashboard
    ├── İçerikler
    ├── Uygulamalar
    ├── Yazılar
    ├── Medya
    ├── Kategoriler
    ├── SEO
    ├── Yayınlar
    ├── Bağlantılar
    ├── Kullanıcılar
    ├── Sistem
    ├── Loglar
    └── Ayarlar
```

Admin paneli public sitenin HTML dosyalarını rastgele değiştiren bir sistem olmamalıdır.

**Single Source of Truth** yaklaşımı kullanılmalıdır.

Veri akışı:

```text
ADMIN
  ↓
CONTENT DATA
  ↓
VALIDATION
  ↓
PUBLISH
  ↓
PUBLIC WEBSITE
```

---

# 3. TASARIM FELSEFESİ

Admin paneli:

- modern
- premium
- estetik
- sade
- hızlı
- responsive
- mobil uyumlu
- dark/light mode destekli
- erişilebilir
- klavye kullanımına uygun
- Türkçe ağırlıklı
- gelecekte çoklu dile uygun

olmalıdır.

Gösteriş uğruna kullanılabilirlikten taviz verilmemelidir.

Profesyonel bir SaaS yönetim paneli hissi vermelidir.

---

# 4. DASHBOARD

Ana ekran aşağıdaki bilgileri gösterebilmelidir:

### Genel Bakış

- Toplam uygulama
- Yayındaki uygulama
- Taslak uygulama
- Toplam yazı
- Yayındaki yazı
- Taslak yazı
- Medya sayısı
- Son yayınlanan içerik
- Son düzenlenen içerik
- Kırık bağlantılar
- SEO uyarıları
- Sistem uyarıları

### Aktivite Akışı

Örnek:

```text
14:32  Yeni yazı oluşturuldu
13:48  Uygulama güncellendi
12:16  Yeni görsel yüklendi
11:05  Bir bağlantı geçersiz hale geldi
```

### Hızlı İşlemler

- Yeni Uygulama
- Yeni Yazı
- Görsel Yükle
- Taslak Oluştur

---

# 5. UYGULAMA YÖNETİMİ

Panel üzerinden yeni uygulama oluşturulabilmelidir.

## Temel Bilgiler

- Uygulama adı
- Kısa açıklama
- Uzun açıklama
- Slug
- Logo
- Kapak görseli
- Galeri
- Kategori
- Etiketler
- Durum
- Yayın tarihi

## Teknik Bilgiler

- Platform
- Android
- iOS
- Windows
- Linux
- Web
- Sürüm
- Son güncelleme
- Boyut
- Gereksinimler
- Lisans
- Dil desteği

## Link Yönetimi

Her platform için ayrı bağlantılar:

- Google Play
- App Store
- Microsoft Store
- Direct Download
- Web App
- GitHub
- Documentation

Bağlantıların çalışıp çalışmadığı kontrol edilebilmelidir.

## Özellik Yönetimi

Dinamik özellik ekleme:

```text
+ Özellik ekle

Başlık:
Açıklama:
İkon:
```

## Ekran Görüntüleri

Sürükle-bırak destekli olmalı ve sıralama değiştirilebilmelidir.

---

# 6. BLOG / BİZCE / GÜNCEL / ANILTILAR

Tek bir gelişmiş yayın editörü oluştur.

İçerik türleri:

- BİZCE
- GÜNCEL
- ANILTILAR
- BLOG

Editör aşağıdakileri destekleyebilmelidir:

- başlık
- alt başlık
- özet
- kapak görseli
- içerik
- galeri
- alıntı
- tablo
- bağlantı
- liste
- kod bloğu
- video
- gömülü içerik

Gereksiz editör karmaşıklığından kaçınılmalıdır.

---

# 7. GELİŞMİŞ YAYIN SİSTEMİ

İçerik durumları:

```text
Taslak
   ↓
İnceleme
   ↓
Planlandı
   ↓
Yayında
   ↓
Arşiv
```

Zamanlanmış yayın desteklenmelidir.

Örnek:

> 15 Ekim 2026 09:00'da yayınla.

---

# 8. OTOMATİK TASLAK KAYDI

Editör yazarken otomatik kayıt yapılmalıdır.

Örnek durum:

```text
Otomatik kaydediliyor...
✓ Kaydedildi
```

Tarayıcı kapanması veya bağlantı kopması nedeniyle içerik kaybolmamalıdır.

---

# 9. VERSİYONLAMA

Her içerik için sürümler tutulmalıdır:

```text
v1
v2
v3
v4
```

Kullanıcı önceki sürüme geri dönebilmeli.

Ayrıca:

> Kim, ne zaman, neyi değiştirdi?

görülebilmelidir.

---

# 10. UNDO / REDO

Editör içerisinde:

- Undo
- Redo

olmalıdır.

Ayrıca içerik seviyesinde:

> Bu sürümü geri yükle

özelliği bulunmalıdır.

---

# 11. MEDYA MERKEZİ

Merkezi bir **Medya Kütüphanesi** oluştur.

Desteklenecek işlemler:

- görsel yükleme
- görsel silme
- görsel değiştirme
- yeniden adlandırma
- arama
- filtreleme
- klasörleme
- etiketleme
- kullanım yerlerini görme

Örneğin:

```text
deskpilot-cover.webp

Kullanıldığı yerler:
• DeskPilot uygulaması
• Ana sayfa
• BİZCE yazısı #24
```

---

# 12. GÖRSEL OPTİMİZASYONU

Görsel yüklenirken uygun olduğunda:

- WebP / AVIF dönüşümü
- boyutlandırma
- thumbnail oluşturma
- metadata temizleme
- dosya boyutu optimizasyonu

yapılmalıdır.

Orijinal dosya gerektiğinde korunabilmelidir.

---

# 13. SEO MERKEZİ

Her uygulama ve yazı için:

- SEO title
- meta description
- canonical URL
- slug
- OG title
- OG description
- OG image
- Twitter/X card
- robots
- schema.org yapılandırması

yönetilebilmelidir.

SEO kontrol ekranı:

```text
SEO Kontrolü

✓ Başlık
✓ Description
⚠ Başlık fazla uzun
✓ Canonical
⚠ OG Image eksik
✓ Schema
```

---

# 14. AI DESTEKLİ SEO / İÇERİK ÖNERİLERİ

Mimari AI entegrasyonuna hazır olmalıdır.

İleride:

- özet oluşturma
- SEO açıklaması önerme
- başlık önerme
- etiket önerme
- alt text önerme
- yazım kontrolü
- içerik kalite kontrolü

gibi özellikler eklenebilmelidir.

**AI kullanıcı onayı olmadan içeriği değiştirmemeli veya yayınlamamalıdır.**

---

# 15. LİNK SAĞLIK SİSTEMİ

Belirli aralıklarla:

- uygulama indirme linkleri
- dış bağlantılar
- sosyal medya bağlantıları
- dokümantasyon bağlantıları

kontrol edilebilmelidir.

Örnek:

```text
✓ Google Play
✓ GitHub
⚠ Direct Download
✕ Documentation
```

---

# 16. SİTE SAĞLIK MERKEZİ

Kontroller:

- JavaScript hataları
- eksik görseller
- kırık linkler
- 404 sayfaları
- eksik metadata
- sitemap
- robots.txt
- duplicate slug
- eksik alt text
- bozuk içerik
- yayınlanmış fakat erişilemeyen içerik

---

# 17. UYGULAMA SÜRÜM YÖNETİMİ

Uygulama sürümleri:

```text
Mevcut sürüm
Yeni sürüm
Değişiklikler
Yayın tarihi
İndirme bağlantıları
```

şeklinde yönetilebilmelidir.

Changelog altyapısı desteklenmelidir.

---

# 18. KATEGORİ / ETİKET YÖNETİMİ

Panel üzerinden:

- Kategoriler
- Etiketler
- Platformlar
- İçerik türleri

yönetilebilmelidir.

Kullanılan kategori veya etiket silinmek istendiğinde sistem uyarmalıdır.

---

# 19. ÇÖP KUTUSU

Silinen içerikler doğrudan fiziksel olarak silinmemelidir.

Önce:

```text
Çöp Kutusu
```

alanına taşınmalıdır.

İsteğe bağlı otomatik kalıcı silme süresi desteklenebilir.

---

# 20. ÖNİZLEME

Yayınlamadan önce:

> Sitede nasıl görünecek?

özelliği bulunmalıdır.

Admin panelinden çıkmadan gerçek public tasarımın önizlemesi gösterilmelidir.

---

# 21. RESPONSIVE TASARIM

### Desktop

Tam yönetim arayüzü.

### Tablet

Optimize edilmiş yapı.

### Mobil

Mobil uygulama hissi veren sade navigasyon:

```text
☰
Dashboard
İçerikler
Uygulamalar
Medya
Ayarlar
```

---

# 22. GLOBAL SEARCH

```text
Ctrl + K
```

ile açılan global arama sistemi:

- uygulamalar
- yazılar
- medya
- kategoriler
- kullanıcılar
- ayarlar

içerisinde arama yapabilmelidir.

---

# 23. KLAVYE KISAYOLLARI

Örnek:

```text
Ctrl + K → Global Search
Ctrl + S → Kaydet
Ctrl + Enter → Yayınla
Esc → Kapat
```

---

# 24. KULLANICI VE YETKİ SİSTEMİ

Şimdilik tek kullanıcı olsa bile mimari çok kullanıcılı kullanıma hazır olmalıdır.

Roller:

```text
Super Admin
Admin
Editor
Author
Viewer
```

Yetkiler ayrı ayrı yönetilebilmelidir.

---

# 25. GÜVENLİK

Admin paneli public siteden güvenli şekilde ayrılmalıdır.

En azından:

- güvenli authentication
- session yönetimi
- CSRF koruması
- XSS koruması
- input validation
- rate limiting
- brute-force koruması
- güvenli password hashing
- güvenli dosya yükleme
- MIME doğrulama
- dosya boyutu limiti
- audit log

uygulanmalıdır.

Şifreler ve gizli anahtarlar source code içerisine yazılmamalıdır.

---

# 26. AUDIT LOG

Her kritik işlem kayıt altına alınmalıdır.

Alanlar:

```text
Kullanıcı
İşlem
Nesne
Tarih
IP
Sonuç
```

Örnek:

```text
Admin — DeskPilot — Güncellendi — 02.10.2026 14:32
```

---

# 27. YEDEKLEME

İçerik verileri için:

- Manuel Yedek
- Otomatik Yedek
- Geri Yükle

özellikleri tasarlanmalıdır.

Geri yükleme güvenlik doğrulaması gerektirmelidir.

---

# 28. IMPORT / EXPORT

İçeriklerin sistemden bağımsız taşınabilmesi için:

- Export
- Import

mekanizması tasarlanmalıdır.

Uygun veri formatı (ör. JSON) kullanılabilir.

Amaç gelecekte platform değişikliğinde içerik kaybını önlemektir.

---

# 29. OTOMASYON MOTORU

Gelecekte genişletilebilir bir automation altyapısı oluştur.

Örnek:

```text
WHEN:
Yeni yazı yayınlandı

THEN:
Sitemap güncelle
OG metadata oluştur
Search index güncelle
Log oluştur
```

Başka örnek:

```text
WHEN:
Bir download linki bozuldu

THEN:
Admin'e uyarı oluştur
```

---

# 30. BİLDİRİM MERKEZİ

Panel içerisinde merkezi bildirim alanı:

```text
🔔 Bildirimler

2 kırık bağlantı bulundu.
1 yazının SEO açıklaması eksik.
Yeni uygulama taslak olarak oluşturuldu.
```

---

# 31. SİSTEM AYARLARI

Merkezi ayarlar:

- Site adı
- Logo
- Varsayılan dil
- Tema
- SEO
- Sosyal medya
- Analytics
- Dosya limitleri
- Yayın ayarları
- Bildirimler
- Güvenlik

---

# 32. VERİ DOĞRULAMA

Form kaydedilmeden önce:

- required fields
- URL validation
- slug validation
- image validation
- date validation
- version validation
- SEO validation

yapılmalıdır.

Hatalar kullanıcıya alan bazında açıkça gösterilmelidir.

---

# 33. DESIGN SYSTEM

Merkezi tasarım sistemi oluştur:

```text
colors
spacing
radius
typography
shadows
buttons
inputs
cards
tables
modals
alerts
badges
```

Tüm panel aynı tasarım dilini kullanmalıdır.

---

# 34. COMPONENT TABANLI YAPI

Tekrarlanan UI kodları çoğaltılmamalıdır.

Uygun olduğunda yeniden kullanılabilir bileşenler:

```text
AdminHeader
AdminSidebar
DataTable
SearchBox
MediaPicker
RichTextEditor
StatusBadge
ConfirmDialog
Toast
Modal
FormField
PreviewPanel
```

---

# 35. PERFORMANS

- lazy loading
- pagination
- debounced search
- image thumbnails
- caching
- gerekli yerlerde optimistic UI
- gereksiz API çağrılarının önlenmesi

kullanılmalıdır.

---

# 36. HATA YÖNETİMİ

Kullanıcı boş ekran görmemelidir.

Her işlem aşağıdaki durumları ele almalıdır:

```text
Loading
Success
Warning
Error
Empty
```

---

# 37. ERİŞİLEBİLİRLİK

WCAG prensipleri dikkate alınmalıdır:

- keyboard navigation
- focus state
- semantic HTML
- aria
- kontrast
- ekran okuyucu uyumluluğu

---

# 38. ÇOKLU DİL HAZIRLIĞI

Bugün Türkçe kullanılabilir.

Ancak veri modeli gelecekte çoklu dile genişleyebilecek şekilde tasarlanmalıdır.

Örneğin:

```text
title.tr
title.en

description.tr
description.en
```

---

# 39. UYGULAMA VERİ MODELİ

Örnek:

```text
Application
├── id
├── slug
├── name
├── shortDescription
├── description
├── icon
├── cover
├── screenshots[]
├── features[]
├── platforms[]
├── versions[]
├── downloadLinks[]
├── categories[]
├── tags[]
├── seo
├── status
├── createdAt
├── updatedAt
└── publishedAt
```

Blog modeli de benzer şekilde normalize edilmeli ve gereksiz veri tekrarından kaçınılmalıdır.

---

# 40. ADMIN URL YAPISI

Örnek:

```text
/admin
/admin/login
/admin/dashboard

/admin/apps
/admin/apps/new
/admin/apps/:id

/admin/posts
/admin/posts/new
/admin/posts/:id

/admin/media

/admin/categories
/admin/tags

/admin/seo

/admin/links

/admin/analytics

/admin/system

/admin/users

/admin/settings

/admin/logs
```

Gerçek URL yapısını mevcut repository ve hosting mimarisini analiz ettikten sonra kesinleştir.

---

# 41. GELİŞTİRME FAZLARI

## FAZ 0 — Repository Analizi

**Kod değiştirme.**

Analiz et:

- mevcut mimari
- veri yapıları
- mevcut içerik sistemi
- uygulama sistemi
- blog sistemi
- asset/media sistemi
- API/functions
- hosting/deployment
- mevcut güvenlik yaklaşımı
- mevcut SEO yaklaşımı
- admin için kullanılabilecek mevcut altyapı

Çıktılar:

```text
architecture.md
data-model.md
admin-roadmap.md
security-model.md
```

---

## FAZ 1 — Admin CMS Mimarisi

Kodlama yapmadan önce:

- veri modeli
- authentication modeli
- API yaklaşımı
- storage yaklaşımı
- public/admin veri akışı
- yetki modeli
- yayın modeli
- versioning modeli
- media modeli
- backup modeli

kesinleştir.

---

## FAZ 2 — Design System

Önce görsel sistem:

- layout
- sidebar
- header
- cards
- forms
- tables
- modal
- notification
- dark mode
- responsive davranış

---

## FAZ 3 — Authentication

- login
- session
- role
- permission
- güvenlik

---

## FAZ 4 — Dashboard

Gerçek verilerle çalışan dashboard.

---

## FAZ 5 — Uygulama CMS

İlk gerçek içerik modülü.

---

## FAZ 6 — Blog CMS

- BİZCE
- GÜNCEL
- ANILTILAR
- BLOG

---

## FAZ 7 — Media Library

---

## FAZ 8 — SEO Center

---

## FAZ 9 — Preview + Publishing

---

## FAZ 10 — Versioning + Audit

---

## FAZ 11 — Link Health + Site Health

---

## FAZ 12 — Backup + Import + Export

---

## FAZ 13 — Automation

---

## FAZ 14 — AI-ready altyapı

---

## FAZ 15 — Security Testing

---

## FAZ 16 — Performance Testing

---

## FAZ 17 — Responsive / Accessibility Testing

---

## FAZ 18 — Production Preparation

---

# 42. KESİNLİKLE YAPILMAYACAKLAR

Mevcut çalışan sistem korunmalıdır.

Gemini:

- çalışan sayfaları gereksiz yere yeniden yazmayacak
- mevcut URL'leri sebepsiz değiştirmeyecek
- SEO URL'lerini bozmayacak
- mevcut uygulama verilerini silmeyecek
- mevcut blog içeriklerini kaybetmeyecek
- tek seferde bütün projeyi refactor etmeyecek
- sırf modern olduğu için gereksiz framework eklemeyecek
- gereksiz dependency eklemeyecek
- secret/key bilgilerini repository'ye koymayacak
- kullanıcı onayı olmadan production değişikliği yapmayacak
- git push yapmayacak
- bir faz tamamlanmadan sonraki faza geçmeyecek

---

# 43. KABUL KRİTERİ

Sistem tamamlandığında kod bilgisi olmayan bir yönetici şu işlemi yapabilmelidir:

## Yeni Uygulama

```text
Admin
→ Uygulamalar
→ Yeni Uygulama
→ Bilgileri gir
→ Görselleri yükle
→ Linkleri gir
→ Önizle
→ Yayınla
```

Sonuç:

Uygulama public sitede otomatik görünmelidir.

## Yeni Makale

```text
Admin
→ Yazılar
→ Yeni Yazı
→ Yaz
→ Görsel ekle
→ SEO kontrolü
→ Önizle
→ Yayınla
```

Sonuç:

Makale otomatik olarak ilgili bölümde görünmelidir.

**Hiçbir HTML dosyasına manuel müdahale gerekmemelidir.**

---

# 44. BAŞLANGIÇ KOMUTU

Bu dokümanı okuduktan sonra hemen kod yazmaya başlama.

Önce yalnızca **FAZ 0 — Repository Analizi** gerçekleştir.

Özellikle mevcut:

- `GEMINI.md`
- `tasks_architecture.md`
- uygulama veri yapıları
- blog yapıları
- `functions/api`
- media/assets yapısı
- mevcut yayın mekanizması
- mevcut deployment yapısı

incelenmelidir.

FAZ 0 sonunda:

1. Mevcut mimariyi açıkla.
2. Admin CMS için önerdiğin mimariyi açıkla.
3. Mevcut sistemle çakışma risklerini belirt.
4. Veri modelini öner.
5. Authentication yaklaşımını öner.
6. Storage yaklaşımını öner.
7. API yaklaşımını öner.
8. Güvenlik modelini öner.
9. Fazları gerekiyorsa yeniden sırala.
10. Değiştirilecek/oluşturulacak dosyaları listele.
11. Riskleri ve alternatifleri belirt.
12. Kod yazma.

**FAZ 0 tamamlandıktan sonra kullanıcı onayı bekle.**

---

## Son Hedef

Ortaya çıkacak sistem basit bir CRUD admin paneli olmamalıdır.

Hedef:

> **MSK Labs'ın uygulamalarını, yazılarını, medyasını, SEO'sunu, yayınlarını, bağlantılarını, sürümlerini, sistem sağlığını ve gelecekteki otomasyonlarını tek merkezden yönetebilen; güvenli, hızlı, estetik, ölçeklenebilir ve uzun süre sürdürülebilir bir İçerik ve Yönetim Platformu oluşturmak.**
