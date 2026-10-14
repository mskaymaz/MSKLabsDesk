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

