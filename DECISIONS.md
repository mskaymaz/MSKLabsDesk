# MSKLabsDesk — Mimari ve Proje Kararları (DECISIONS.md)
> **Amaç:** Proje geliştirme sürecinde alınan önemli teknik, mimari ve tasarımsal kararların gerekçeleriyle birlikte kaydedildiği dokümandır.

## Kararlar

### 1. Mimari Altyapı
* **Karar:** Cloudflare Workers (Backend) + Cloudflare D1 (Database) + Cloudflare Pages (PWA Frontend).
* **Gerekçe:** Serverless, %100 ücretsiz tier desteği ve yüksek performans.

### 2. E-Posta Gönderici Yapısı
* **Karar:** Google SMTP (msklabs.org@gmail.com) + Resend Fallback.
* **Gönderici Adı:** MSK Labs <msklabs.org@gmail.com>
* **Gerekçe:** Günlük 2.000 e-posta kotası ve yüksek teslimat başarısı.

### 3. Kodlama ve Dosya Kuralları
* **Karar:** Maksimum 400-450 satır/dosya sınırı, cerrahi ve odaklı müdahale.

### 4. Yorum Moderasyonu & E-Bülten Mimarisi (02.10.2026 - 09:15)
* **Yorum Mimarisi:** 
  - comments tablosu D1 üzerinde en baştan modüler oluşturulacak.
  - Moderasyon statüsü (pending, pproved, spam) ile çalışacak; panelden onaylanmadan yayına girmeyecek.
  - Cloudflare Turnstile + IP Rate-limiting ile spam engellenecek.
* **E-Bülten Mimarisi & Segmentasyon:**
  - subscribers ve subscriber_preferences tabloları D1 üzerinde oluşturulacak.
  - **Segmentasyon Kuralları:** Abonelik kategorileri (Blog Yazıları, Ürün/Uygulama Güncellemeleri, Genel Duyurular) ayrıştırılacak.
  - Panelden bülten gönderilirken hedef kategori seçilecek; yalnızca ilgili konuya abone olan kişilere e-posta iletilecek.

### 5. Gelecek Vizyonu, Ürünleştirme ve Büyüme Stratejisi (14.10.2026 - 11:45)
* **Karar:** Mevcut projeler (`MSKLabsDesk` ve `webMSKLabs`) canlıya alınıp gerçek testler tamamlandıktan ve zihinsel sakinlik sağlandıktan sonra 3 ana stratejik faz hayata geçirilecektir:
  1. **Yüzsüz (Faceless) Video/Vlog Modeli:** Memuriyet ve gizlilik kısıtlarına uygun, şahıs yerine MSK Labs marka kimliğiyle, dijital tahta ve minimalist tipografi ile "Kodsuz Mimarlık & Dijital Akıl" içerikleri üretilecek. YouTube embed ile sıfır sunucu maliyetli huni kurulacak.
  2. **White-Label / Anahtar Teslim Web & Yönetim Çekirdeği (Boilerplate):** Şahsi verilerden arındırılmış demo içerikli (`seed_demo.sql`), tek dosyadan konfigüre edilen (`site.config.json`) ve modül aç/kapa (Feature Flags) yapısına sahip ürünleştirilmiş bir şablon oluşturulacak.
  3. **Sadık Müşteri Yapılı E-Ticaret Platformu:** Sistem oturduktan sonra topluluk ve sadakat odaklı özel bir e-ticaret mimarisi geliştirilecek.
* **Detaylı Doküman:** Tüm istişare ve uygulama detayları [GELECEK_VIZYONU_VE_STRATEJI.md](file:///d:/Code/mskaymaz/MSKLabsDesk/GELECEK_VIZYONU_VE_STRATEJI.md) dosyasında kayıt altına alınmıştır.


### 6. Reklam ve Gelir Modeli Alternatifleri (30.10.2026 - 11:38)
* **Mevcut Yapı:** Google AdSense (Web) ve Google AdMob (Mobil).
* **Alternatif / İleri Aşama Programatik Ağ:** [theAds](https://theads.io/)
  - **Kapsam:** Türkiye dijital medya pazarına odaklanan bağımsız programatik SSP ve yayıncı reklam ağı.
  - **Özellikler:** Header Bidding (Prebid), Google Ad Manager entegrasyonu ve çoklu talep kaynakları (DSP) ile açık artırma usulü CPM optimizasyonu (+38% CPM, +42% gelir artış potansiyeli).
  - **Kullanım Stratejisi:** Manuel incelemeli premium yayıncı modeli uyguladıklarından, sitemizin trafik hacmi belirli bir olgunluğa (aylık düzenli tekil ziyaretçi/gösterim eşiğine) ulaştığında AdSense'e ek/hibrit veya alternatif yerli reklam ağı olarak başvuru yapılacaktır.

### 7. Kurumsal Yasal Sayfalar ve İletişim Mimarisi Standardı (30.10.2026 - 16:15)
* **Kapsam:** `terms.html`, `privacy.html`, `cookies.html`, `kvkk.html`, `contact.html`.
* **Temel Standartlar:**
  1. **Yerel Öncelikli (Local-First) Güvence:** Kamera ve mikrofon izninin kesinlikle istenmediği, hiçbir uygulamanın merkezi hesap/sunucu veritabanı dayatmadığı, tüm kullanıcı verilerinin yerel donanımda saklandığı taahhüt edilmiştir.
  2. **Tipografi:** Okunabilirlik ve kurumsal kompaktlık için gövde metinleri `0.86rem` (~13.8px) ve `line-height: 1.68` ile tam 2 pt küçültülmüştür.
  3. **Konumlandırma Standardı:** Son güncelleme tarihi ve yasal kapsam bilgileri daima sayfanın en altında (`.legal-footer-meta`) sunulur.
  4. **Dinamik Yükleyici Koruması:** `page-loader.js` içerisinden yasal sayfalar çıkarılmış ve `.legal-content` korumasıyla statik zengin içeriklerin CMS taslaklarıyla ezilmesi engellenmiştir.
  5. **İletişim Omurgası:** İletişim süreçlerinin odağı takip numaralı `destek.html` merkezine bağlanmış; resmi kanallar yalnızca `@msklabs.org` ile sınırlandırılmıştır.
