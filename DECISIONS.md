# MSKLabsDesk — Mimari ve Proje Kararları (DECISIONS.md)
> **Amaç:** Proje geliştirme sürecinde alınan önemli teknik, mimari ve tasarımsal kararların gerekçeleriyle birlikte kaydedildiği dokümandır.

## Kararlar

### 1. Mimari Altyapı
* **Karar:** Cloudflare Workers (Backend) + Cloudflare D1 (Database) + Cloudflare Pages (PWA Frontend).
* **Gerekçe:** Serverless, %100 ücretsiz tier desteği ve yüksek performans.

### 2. E-Posta Gönderici Yapısı
* **Karar:** Google SMTP (`msklabs.org@gmail.com`) + Resend Fallback.
* **Gönderici Adı:** `MSK Labs <msklabs.org@gmail.com>`
* **Gerekçe:** Günlük 2.000 e-posta kotası ve yüksek teslimat başarısı.

### 3. Kodlama ve Dosya Kuralları
* **Karar:** Maksimum 400-450 satır/dosya sınırı, cerrahi ve odaklı müdahale.
