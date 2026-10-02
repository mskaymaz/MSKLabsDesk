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
- [ ] **Admin Auth API:** Güvenli yönetici girişi ve JWT/Session yönetimi
- [ ] **Admin Mesaj İşlemleri API:** Mesaj listeleme, detay görme, onaylama, reddetme, cevaplama
- [ ] **Admin Yorum İşlemleri API:** Yorum onaylama/reddetme
- [ ] **Admin E-Posta / Duyuru API:** Toplu bülten oluşturma ve kuyruğa ekleme (`POST /api/broadcast`)
- [ ] **Kupon Üretim API:** Özel kupon/teşekkür kodu oluşturma ve e-posta ile iletme

---

### 4. Yapay Zeka Entegrasyonu (Google Gemini API)
- [ ] Gemini API istemcisinin kurulması
- [ ] Gelen destek mesajını otomatik analiz etme (Spam kontrolü, aciliyet, kategori belirleme)
- [ ] Mesaj özeti çıkarma ve yönetici için önerilen cevap taslağı (`ai_draft`) üretme
- [ ] Prompt injection koruması (Kullanıcı mesajının sistem talimatlarını bozmasını engelleme)

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
- [ ] **Giriş Ekranı:** Güvenli yönetici oturum açma sayfası
- [ ] **Dashboard (Özet Ekranı):** Bekleyen biletler, yeni yorumlar, abone sayısı ve istatistikler
- [ ] **Destek & Talep Yönetimi Ekranı:**
  - [ ] Mesaj listesi (Filtreleme, arama, durum rozetleri)
  - [ ] Mesaj detay kartı (AI özeti, işlem geçmişi, bilet numarası)
  - [ ] Cevap yazma ve AI cevabını tek tıkla aktarma
  - [ ] Onayla / Reddet / Durum Güncelle düğmeleri
  - [ ] "Kupon Tanımla & Teşekkür Et" düğmesi ve modalı
- [ ] **Blog Yorum Yönetimi Ekranı:**
  - [ ] Bekleyen yorumlar akışı
  - [ ] Yorumu Onayla (Sitede yayınla) / Reddet (Spam) düğmeleri
- [ ] **Bülten & E-Posta Yayın Ekranı:**
  - [ ] Toplu duyuru/bülten oluşturma formu
  - [ ] Hedef kitle tercihi seçimi (Blog yazıları, Yeni uygulamalar, Güncellemeler)
  - [ ] Canlı gönderim ilerleme çubuğu (%15 gönderildi...)
- [ ] **Abonelik Yönetim Ekranı:** Abone listesi, aktiflik durumları
- [ ] **Ayarlar Ekranı:** Gönderici adı (`MSK Labs`), E-posta şablonları, Web Push bildirim izinleri

---

### 7. Anlık Bildirimler (Web Push Notifications)
- [ ] Service Worker VAPID altyapısının PWA'ya eklenmesi
- [ ] Yeni destek mesajı veya yorum geldiğinde yöneticiye anlık push notification gönderilmesi

---

### 8. Web Sitesi Entegrasyonu (`webMSKLabs`) & Testler
- [ ] `webMSKLabs` destek formunun yeni Cloudflare API'ye bağlanması
- [ ] `webMSKLabs` blog detay sayfasına bülten abonelik kutusu ve yorum formunun eklenmesi
- [ ] Google Sheets'teki mevcut verilerin D1 PostgreSQL/SQLite veritabanına aktarım betiği (Migration Script)
- [ ] Uçtan uca mobil & masaüstü testleri (Form gönderme -> AI analizi -> PWA bildirimi -> Cevaplama -> Mail iletimi)
