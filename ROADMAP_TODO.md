# MSKLabs — Uçtan Uca Geliştirme ve Dağıtım Yol Haritası (ROADMAP_TODO.md)
> **Tarih:** 30 Ekim 2026  
> **Amaç:** Ev ve işyeri çalışma senkronizasyonunu sağlayan, adım adım işaretlenebilir ana görev listesi.

---

### 📋 1. AŞAMA: SEO & YASAL SAYFALARIN EMSAL STANDARTLARA GÖRE TAMAMLANMASI (TAMAMLANDI — 30.10.2026 - 16:15)
* [x] **1.1 Kullanım Koşulları (`terms.html` & `KULLANIM_KOSULLARI_TASLAK.md`):**
  - [x] Kaktüs, Esnek, K Yazılım ve F2 Bilişim emsalleri sentezlendi; 19 maddelik çatı sözleşme hazırlandı.
  - [x] Osmanlıca/arkaik terimler güncel modern Türkçeye çevrildi, yerel öncelikli (local-first) veri sahipliği ilkesi işlendi.
  - [x] TR, EN, AR dillerinde derlendi; tarih ve kapsam bilgileri sayfa sonuna yerleştirildi; 2 pt tipografi küçültüldü.
* [x] **1.2 Gizlilik Politikası (`privacy.html` & `GIZLILIK_POLITIKASI_TASLAK.md`):**
  - [x] Esnek, Kaktüs, Sistem İki, CNB ve İes emsalleri sentezlenerek 13 maddelik metin oluşturuldu.
  - [x] Sıfır bilgi & yerel öncelikli mimari, kamera/mikrofon kullanılmadığına dair şeffaf izin tablosu ve KVKK/GDPR hakları eklendi.
  - [x] TR, EN, AR dilleri uygulandı; `page-loader.js` ezme koruması sağlandı.
* [x] **1.3 Çerez Politikası (`cookies.html` & `CEREZ_POLITIKASI_TASLAK.md`):**
  - [x] Molekül, CNB ve İes emsalleri sentezlendi; çerez matrisi (tema, dil, onay, cloudflare, analytics, adsense) tablosu eklendi.
  - [x] Sitedeki etkileşimli modalı açan "⚙️ Çerez Ayarları" butonu, footer navigasyonu ve cookie banner köprüsü entegre edildi.
* [x] **1.4 KVKK Aydınlatma Metni (`kvkk.html` & `KVKK_AYDINLATMA_METNI_TASLAK.md`):**
  - [x] İletişim Yazılım, Paraşüt ve Ehli Yazılım emsalleri sentezlenerek 12 maddelik aydınlatma ve başvuru rehberi hazırlandı.
  - [x] Özel nitelikli veri alınmadığı taahhüdü, 30 günlük ücretsiz sonuçlandırma kuralı ve TR/EN/AR çevirileri eklendi.
* [x] **1.5 İletişim Sayfası (`contact.html` & `ILETISIM_KURUMSAL_TASLAK.md`):**
  - [x] Ops, Molekül, CNB, İes, Log ve Sistem İki emsalleri incelendi.
  - [x] Destek & talep odaklı mimari: Canlı destek masası (`destek.html`), yetkili e-postalar (`@msklabs.org`), SSS (`faq.html`), GitHub, çalışma saatleri ve güvenlik doğrulaması kartları.
  - [x] Hızlı bilet oluşturma çağrı kutusu (CTA) ve 2 pt küçültülmüş tipografi uygulandı.
* [x] **1.6 Kalite Kapısı:** `npm run build` (13.24s) başarıyla geçti; `localhost:5174` üzerinden tüm sayfaların HTTP 200 yanıtı ve görsel yerleşimi doğrulandı.

---

### 📋 2. AŞAMA: CANLI ANA DAL GÜVENCESİ VE GEÇİŞİ (MAIN & OLDMAIN)
* [ ] **2.1 Yedek Dal Oluşturma (`OldMain`):**
  - [ ] `webMSKLabs` uzak `main` dalı çekilerek `OldMain` dalı oluşturulacak ve GitHub'a kilitli/kalıcı yedek olarak push edilecek.
* [ ] **2.2 DevAdmin -> Main Birleştirme (Production Release):**
  - [ ] `DevAdmin` üzerindeki tüm onaylı geliştirmeler `main` dalına merge edilecek.
  - [ ] `msklabs.org` canlı yayını HTTP 200 ve DOM testleriyle doğrulanacak.
  - [ ] `DevAdmin` pasif dal veya sürüm havuzu olarak korunacak.

---

### 📋 3. AŞAMA: KURUMSAL E-POSTA ALTYAPISINA TAM GEÇİŞ
* [ ] **3.1 Kimlik ve Yapılandırma Kasası (`CREDENTIALS.enc`):**
  - [ ] `node scripts/vault.js unlock` ile şifreli kasanın çözülüp e-posta/sunucu kimliklerinin okunması.
* [ ] **3.2 Web Arayüzü E-Posta Güncellemesi (`webMSKLabs`):**
  - [ ] `config.js`, `about.html`, `bizkimiz.html`, `contact.html`, `apps/*` sayfalarındaki `msklabs.org@gmail.com` adreslerinin `@msklabs.org` ile değiştirilmesi.
* [ ] **3.3 Admin & Bildirim E-Postaları (`MSKLabsDesk`):**
  - [ ] Cloudflare Email Routing / Resend API gönderici kimliğinin kurumsal e-posta ile doğrulanması.

---

### 📋 4. AŞAMA: YÖNETİM PANELİ (ADMIN) EKSİKLERİNİN BİTİRİLMESİ
* [ ] **4.1 Duyuru Modülü Tamamlama:**
  - [ ] Admin panelinde kalan yarım duyuru ayarları, zamanlama ve önizleme bileşenlerinin bitirilmesi.
* [ ] **4.2 E-Posta Bülteni ve Aboneler Ekranı:**
  - [ ] Abone listesi, filtreleme, CSV dışa aktarma ve bülten şablonu oluşturma arayüzü.
* [ ] **4.3 Genel Sistem Ayarları:**
  - [ ] Site genel ayarları, API anahtarları yönetimi ve bakım modu geçişlerinin tamamlanması.

---

### 📋 5. AŞAMA: BİRLEŞİK BİLDİRİM & MESAJLAŞMA UYGULAMASI (INBOX HUB)
* [ ] **5.1 Ortak Veri Toplama Motoru:**
  - [ ] Blog yorumları, destek talepleri ve gelen kurumsal e-postaları tek API uç noktasında (`/api/v1/inbox/unified`) toplayan Edge servis.
* [ ] **5.2 Minimalist Arayüz (Masaüstü & Mobil Uyumlu):**
  - [ ] Yeni gelen bildirimleri rozet ve anlık durumla gösteren hafif gösterge paneli.
  - [ ] İlgili öğeye (Yorum, Destek Bileti, E-Posta) tıklandığında otomatik oturumla doğrudan işlem ekranına yönlendirme.
