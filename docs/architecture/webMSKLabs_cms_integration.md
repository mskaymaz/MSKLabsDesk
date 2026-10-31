# webMSKLabs — Dynamic Headless CMS Entegrasyon Rehberi

> **Amaç:** `webMSKLabs` sitesinin, `MSKLabsDesk` tarafından sunulan 3 dilli Headless CMS API'lerini (Blog Kanalları, Makaleler, Uygulamalar ve Reklam Şablonları) dinamik olarak nasıl tüketeceğini açıklar.

---

### 🌐 Base API URL
* **Canlı API Endpoint:** `https://msklabsdesk-api.mskaymaz.workers.dev/api/v1`

---

### 📡 Available Endpoints & Integration Examples

#### 1. Aktif Blog Kanallarını Çekme (BİZCE, ANILTILAR, HİKAYELER vb.)
* **Endpoint:** `GET /api/v1/channels`
* **Yanıt:**
```json
{
  "channels": [
    {
      "slug": "bizce",
      "name_tr": "BİZCE",
      "name_en": "OUR OPINION",
      "name_ar": "رأينا",
      "icon": "book-open"
    }
  ]
}
```

---

#### 2. Blog Yazılarını Çekme (Filtreli & Çok Dilli)
* **Endpoint:** `GET /api/v1/posts?channel=bizce&lang=tr&limit=10`
* **Dil Seçenekleri:** `lang=tr`, `lang=en`, `lang=ar`
* **Yanıt:**
```json
{
  "posts": [
    {
      "id": "post_123",
      "slug": "yeni-vizyonumuz-2026",
      "title": "2026 Vizyonumuz ve Yapay Zeka Ekosistemi",
      "summary": "Yapay zeka odaklı yeni projelerimiz...",
      "cover_image": "https://...",
      "channel_slug": "bizce",
      "published_at": "2026-10-02T16:00:00Z",
      "views_count": 42
    }
  ]
}
```

---

#### 3. Uygulama Kataloğunu Çekme (`app_catalog.json` Canlı Karşılığı)
* **Endpoint:** `GET /api/v1/apps`
* **Yanıt:**
```json
{
  "apps": [
    {
      "app_id": "al-mushaf",
      "name_tr": "El-Mushaf",
      "description_tr": "Gelişmiş Kur'an-ı Kerim uygulaması",
      "latest_version": "2.1.0",
      "download_url": "https://..."
    }
  ]
}
```

---

#### 4. Header Duyuru Bandı & Reklam Kodlarını Çekme
* **Endpoint:** `GET /api/v1/templates`
* **Yanıt:**
```json
{
  "templates": [
    {
      "key_name": "announcement_bar",
      "content_tr": "🎉 Yeni mobil uygulamamız yayınlandı!",
      "content_en": "🎉 Our new mobile app is live!",
      "content_ar": "🎉 تم إطلاق تطبيقنا الجديد!"
    }
  ]
}
```

---

#### 5. Otomatik XML Sitemap
* **Endpoint:** `GET /api/v1/sitemap.xml`
* Siteniz Google arama motoruna bu URL'yi sitemap olarak bildirebilir.
