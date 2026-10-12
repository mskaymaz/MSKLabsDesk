# MSKLabsDesk — Yönetici (Admin) Kullanım & Fonksiyon Haritası

> **Bu Dokümanın Amacı:** Yazılım veya kodlama bilgisi gerektirmeyen; yönetim panelini günlük operasyonlarında kullanan site yöneticileri, editörler ve işletme sahipleri için ekranların, butonların ve ayarların kapsamlı rehberidir.
> 
> **Görsel Test & İlerleme İşaretleri:**
> * `[ ]` — Henüz başlanmamış / test edilmeyi bekleyen madde
> * `[-]` — Devam eden / üzerinde çalışılan / incelenen madde
> * `[x]` — Tamamlanmış / görsel ve fonksiyonel olarak doğrulanmış madde

---

## 🧭 Genel Bakış & Sol Menü Navigasyonu
Yönetim paneline giriş yapıldığında sol menüde günlük operasyonları yürütebileceğiniz modüller yer alır. Ekranlar modern karanlık (dark) ve aydınlık (light) tema desteğine sahiptir ve tüm cihazlardan (mobil, tablet, masaüstü) tam uyumlu olarak yönetilebilir.

---

## 1. Ana Gösterge Paneli (Dashboard & Canlı Durum Özeti)
İşletmenizin ve web sitenizin anlık nabzını tuttuğunuz ana kontrol merkezidir.

* **Ekranda Ne Görür?**
  * [-] **Canlı Durum Kartları:** *"Bekleyen Destek Talepleri"*, *"Onay Bekleyen Yorumlar"*, *"Kayıtlı E-Bülten Aboneleri"*, *"Toplu E-Posta / Duyuru Gönder"*.
  * [-] **Hızlı Uyarı Göstergeleri:** Yanıt bekleyen acil biletler ve onaylanmamış yorumlar için renkli bildirim rozetleri.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [-] **Hızlı Zıplama:** İstatistik kartına tıklayarak doğrudan ilgili modülün detayına geçiş (Örn: "Onay Bekleyen Yorumlar"a basıp yorum listesine gitme).
  * [-] **İş Akışı İzleme:** Sistem genelindeki güncel iş akışını tek ekranda anlık kontrol etme.

---

## 2. Destek Talepleri & İletişim Masası (Helpdesk & Gelen E-Postalar)
Ziyaretçilerden gelen mesajları, şikayetleri, iş birliği tekliflerini ve doğrudan kurumsal e-posta adreslerine (`destek@msklabs.org`, `msklabs.org@gmail.com`) gönderilen e-postaları tek merkezden yönettiğiniz iletişim masasıdır.

* **Ekranda Ne Görür?**
  * [ ] **Gelen Bilet Listesi:** Gönderen adı, e-posta adresi, konu, tarih ve işlem durumu (*Yeni*, *İşlemde*, *Çözüldü*, *Reddedildi*).
  * [ ] **Kaynak Ayrımı (Kanal Rozeti):** Web formundan gelen biletler ile doğrudan kurumsal e-postaya atılan mailler için özel **`✉️ E-Posta`** rozeti.
  * [ ] **Arama & Filtreleme Çubuğu:** İsim, e-posta, bilet no veya duruma göre anında arama.
  * [ ] **Yapay Zeka Analiz Kutusu (AI Banner):** Mesaj detayında yapay zekanın mesajı 2-3 cümlede özetlediği analiz paneli.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Yapay Zeka Taslağını Kullan:** AI'ın hazırladığı öneri yanıt metnini tek tıkla cevap kutusuna aktarıp düzenleyerek kullanıcının e-postasına doğrudan cevap gönderme.
  * [ ] **Durum Güncelleme:** Talebi *"İşlemde"*, *"Çözüldü"* veya *"Reddedildi"* olarak işaretleyip arşivleme.
  * [ ] **Kupon & Hediye Tanımlama:** Değerli geri bildirim veya hata bildirimi yapan kullanıcıya tek tıkla indirim kuponu veya teşekkür rozeti tanımlayıp e-posta ile hediye etme.

---

## 3. Blog & Makale Stüdyosu (CMS & İçerik Yönetimi)
Sitede yayınlanacak zengin içerikleri, rehberleri ve blog yazılarını hazırladığınız stüdyodur.

* **Ekranda Ne Görür?**
  * [ ] **Makale Listesi:** Yazıların durumu (*Taslak*, *İncelemede*, *Yayında*, *Arşivde*), okunma sayıları, ait olduğu kanal ve yayın tarihi.
  * [ ] **Zengin Metin Editörü (TipTap):** Word/Medium konforunda başlıklar, kalın/italik yazılar, listeler, alıntılar ve kod blokları ekleyebileceği yazı alanı.
  * [ ] **Blok Düzenleyici (Layout Builder):** Paragrafların, görsellerin ve özel kutuların sırasını gösteren görsel şema.
  * [ ] **Revizyon Geçmişi:** Makalenin geçmişte kaydedilmiş önceki sürümleri (Sürüm 1, Sürüm 2 vb.).
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Sürükle-Bırak Düzen:** Blok düzenleyicide bir görseli veya metin kutusunu fareyle yukarı-aşağı taşıyarak sayfa düzenini değiştirme.
  * [ ] **Kapak Görseli & Medya Yükleme:** Bilgisayarından görsel seçip tek tıkla güvenli bulut deposuna yükleme.
  * [ ] **Zamanlanmış Otomatik Yayın:** İleri bir tarih ve saat seçerek makaleyi otomatik yayına kurma.
  * [ ] **Eski Sürüme Geri Dönüş (Restore):** Geçmiş revizyon listesinden tek tıkla eski haline döndürme.
  * [ ] **Canlı Önizleme:** Yayına almadan önce mobil ve masaüstü ekranda nasıl görüneceğini test etme.

---

## 4. Blog Kanalları & Kategori Yönetimi
Blog yazılarını konularına göre gruplandırdığınız kategori merkezidir.

* **Ekranda Ne Görür?**
  * [ ] **Mevcut Kanalların Listesi:** Kanallar (Örn: *Bizce*, *Anıltılar*, *Güncel*), içlerindeki yazı sayıları ve kanal ikonları.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Yeni Kanal Oluşturma:** Kanalın adını ve açıklamasını Türkçe, İngilizce ve Arapça tanımlama; hazır simge/ikon seçme.
  * [ ] **Sıralama Belirleme:** Menüde hangi sırada görüneceğini numaralandırarak düzenleme.
  * [ ] **Kanal Silme / Düzenleme:** İsmi güncelleme veya kullanılmayan kanalı içerikleri koruyarak kaldırma.

---

## 5. Blog Yorum Denetimi & Kamusal Okuyucu Yorumları (Comments)
Okuyucuların blog sayfalarından (`webMSKLabs/blog/blog.html`) gönderdiği yorumların yayına girmeden önce denetlendiği güvenli moderasyon merkezidir.

* **Ekranda Ne Görür?**
  * [ ] **Yorum Listesi:** Yorum yapan kişinin adı, e-posta adresi (kamuya gizli tutulur), hangi makaleye yorum yaptığı ve yorum metni.
  * [ ] **Durum Sekmeleri:** *Onay Bekleyenler*, *Onaylananlar*, *Reddedilenler*.
  * [ ] **Kamusal Blog Arayüz Entegrasyonu:** Makale altında okuyucunun gördüğü yorum formu ve onaylanmış yorumların listelendiği akış.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Tek Tıkla Onaylama:** Yorumu onaylayarak anında web sitesinde makale altında görünür kılma.
  * [ ] **Ekip Olarak Yanıtlama:** Yorumun altına resmi "MSK Labs Ekibi" rozetiyle cevap yazma.
  * [ ] **Gerekçeli Reddetme / Spam:** Uygunsuz yorumları reddedip gerekçe bildirme veya tamamen silme.

---

## 6. Sesli Makale Dinleme & Onay Masası (TTS Player)
Yazıların yapay zeka tarafından seslendirilip sesli makaleye dönüştürüldüğü ses yönetim stüdyosudur.

* **Ekranda Ne Görür?**
  * [ ] **Ses Durum Kartları:** Her makalenin Türkçe, İngilizce ve Arapça ses durumu (*Üretiliyor*, *Taslak / Dinleme Bekliyor*, *Onaylandı / Yayında*, *Eski Sürüm - STALE*).
  * [ ] **Dahili Ses Oynatıcısı:** Oynat, durdur, 10 sn ileri/geri sar, hız ayarı (0.75x - 1.5x).
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Ses Üretimini Başlatma:** Tek tuşla TR/EN/AR dillerinde stüdyo kalitesinde MP3 ses üretimi başlatma.
  * [ ] **Yönetici Ön Dinlemesi:** Sesi yayınlamadan önce dinleyip telaffuz ve akıcılığı kontrol etme.
  * [ ] **Yayına Verme Onayı:** Beğenildiğinde "Onayla & Yayına Al" diyerek ziyaretçilere açma.
  * [ ] **Otomatik STALE Koruması:** Makale metni güncellendiğinde eski sesin otomatik gizlenmesini izleme ve tek tıkla sesi yeniden ürettirme.

---

## 7. Mobil & Web Uygulama Kataloğu (Apps Showcase)
MSK Labs bünyesinde geliştirilen Android, iOS ve Web uygulamalarının tanıtıldığı vitrin yönetim alanıdır.

* **Ekranda Ne Görür?**
  * [ ] **Uygulama Kartları:** Uygulama logoları, isimleri, kategorileri ve platform etiketleri (Android, iOS, Web).
  * [ ] **Öne Çıkan Rozeti:** Ana sayfa manşetinde vitrine çıkan uygulamalar.
  * [ ] **Sürüm Geçmişi:** Yayınlanan sürüm kodları (v1.0.0, v2.1.0), indirme linkleri ve sürüm notları.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Yeni Uygulama Ekleme:** İsim, ikon, kapak görseli ve TR/EN/AR tanıtım metinlerini girme.
  * [ ] **Platform Belirleme:** Android, iOS veya Web ortamını seçme.
  * [ ] **Vitrinde Öne Çıkarma:** Tek anahtarla ana sayfa manşetine taşıma.
  * [ ] **Yeni Sürüm & Güncelleme Çıkarma:** Yeni sürüm kodu, APK/mağaza linki ve yenilik notları ekleme.
  * [ ] **Zorunlu Güncelleme Ayarı:** Kritik güncellemelerde "Zorunlu Sürüm" anahtarını açma.

---

## 8. Reklam Yerleşimi & AdSense Ayarları
Sitedeki reklam alanlarının ve gelir ortaklığı yerleşimlerinin görsel olarak yönetildiği reklam masasıdır.

* **Ekranda Ne Görür?**
  * [ ] **Reklam Yuvaları:** Üst Banner, Makale İçi, Yan Panel, Alt Bant yuvalarının listesi.
  * [ ] **Ayar Göstergeleri:** Aktif/pasif durumu, seçili boyutu ve kenar boşlukları.
  * [ ] **Sandbox Önizleme Penceresi:** Reklamın sayfada nasıl duracağını gösteren güvenli test önizlemesi.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Standart Boyut Seçimi:** 10 hazır standart boyuttan birini seçme (728x90, 300x250, 336x280, 300x600, Responsive vb.).
  * [ ] **Özel (Custom) Boyut Tanımlama:** Özel piksel genişlik ve yükseklik girme (Örn: 400x180 px).
  * [ ] **Boşluk (Margin) Ayarı:** Reklamın üstündeki ve altındaki yazılarla mesafesini milimetrik ayarlama.
  * [ ] **Yapışkan (Sticky) Reklam:** Sayfa kaydırıldığında reklamın ekranda sabit kalarak takip etmesini açma/kapatma.
  * [ ] **Anında Açma / Kapatma:** Tek butonla reklam alanını tamamen gizleme veya yayına alma.

---

## 9. Site Üst Duyuru Bandı (Announcement Bar)
Web sitesinin en üstünde ziyaretçilere gösterilen acil duyuru veya kampanya şerididir.

* **Ekranda Ne Görür?**
  * [ ] **Duyuru Alanları:** Türkçe, İngilizce ve Arapça duyuru metinleri ve bandın açık/kapalı durumu.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Duyuru Yazma:** Kampanya, bakım veya yeni sürüm metnini yazma.
  * [ ] **Tek Tıkla Yayına Alma:** Duyuru bandını tüm sitede anında görünür yapma veya kaldırma.

---

## 10. Toplu E-Posta & Bülten Gönderimi (Broadcast)
Tüm kayıtlı e-posta abonelerine tek seferde duyuru, bülten veya kampanya gönderilen toplu iletişim aracıdır.

* **Ekranda Ne Görür?**
  * [ ] **Editör & Canlı Önizleme:** Sol tarafta konu ve metin editörü; sağ tarafta e-postanın gelen kutusunda nasıl görüneceğini gösteren canlı HTML önizleme penceresi.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Bülten Hazırlama:** Başlık ve zengin içerikli metni oluşturma.
  * [ ] **Toplu Gönderim:** "Tüm Abonelere Gönder" butonuna basarak kotayı aşmadan arka planda güvenle iletme.

---

## 11. Bülten Abone Yönetimi (Subscribers & KVKK)
E-bültene kaydolan kitleyi incelediğiniz ve yasal izinlerini takip ettiğiniz listedir.

* **Ekranda Ne Görür?**
  * [ ] **Abone Listesi:** E-posta adresi, kayıt tarihi, doğrulama durumu ve varsa ayrılma (unsubscribe) tarihi.
  * [ ] **Filtreler:** *Tümü*, *Doğrulanmış*, *Doğrulanmamış*, *Ayrılanlar*.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Abone Silme / Pasife Alma:** Talep üzerine kullanıcıyı listeden çıkarma.
  * [ ] **İzin Takibi:** Ayrılan abonelerin gönderim listesinden otomatik düşmesini izleme.

---

## 12. Çok Dilli Çeviri Masası & Dil Seçimi (i18n & RTL)
Sitenin ve yönetim panelinin çok dilli çalışmasını sağlayan dil merkezidir.

* **Ekranda Ne Görür?**
  * [ ] **Panel Dil Seçici:** Sağ üst köşede dil değiştirici (TR / EN / AR).
  * [ ] **Çeviri Karşılaştırma Modalı:** Solda orijinal Türkçe metin, sağda yapay zekanın çevirdiği İngilizce/Arapça metin.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Panel Dilini Değiştirme:** Paneli İngilizceye veya Arapçaya çevirme. Arapçada panelin sağdan sola (RTL) düzene geçmesi.
  * [ ] **Çeviriyi Düzeltme & Onaylama:** Yapay zeka çevirisini düzenleyip tek tıkla onaylama.

---

## 13. Sistem, Güvenlik & Site Ayarları (Settings)
Web sitesinin temel kurumsal bilgilerini ve güvenlik kalkanlarını ayarladığınız ekrandır.

* **Ekranda Ne Görür?**
  * [ ] **Ayar Kartları:** Site Başlığı, Site Adresi, Gönderici E-Postası, Bot Filtresi ve Web Push durumu.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * [ ] **Site Bilgileri:** Site adı ve resmi alan adını güncelleme.
  * [ ] **Tema Seçimi:** Panel görünümünü *Karanlık (Dark)* veya *Aydınlık (Light)* ayarlama.
  * [ ] **Gönderici E-Postası:** Bildirimlerde görünecek gönderici adı ve e-posta adresini belirleme.
  * [ ] **Cloudflare Turnstile Koruması:** Formlara saldıran robotları engelleyen bot filtresini açma/kapatma.
  * [ ] **Web Push Bildirimleri:** Cihazlara giden anlık web bildirimlerini etkinleştirme.

---

## 14. Güvenlik Denetim Logları & Olay İzleme (Audit Log)
Panelde kimin ne yaptığının şeffafça kaydedildiği güvenlik hafızasıdır.

* **Ekranda Ne Görür?**
  * [ ] **Olay Zaman Çizelgesi:** İşlem tarihi, işlemi yapan yönetici, yapılan işlem (*"Makale Silindi"*, *"Reklam Güncellendi"*, *"Yorum Onaylandı"* vb.).
* **Neler Yapabilir?**
  * [ ] **Olay Filtreleme:** Tarihe ve personele göre güvenlik olaylarını inceleme.
  * [ ] **Maskeli Güvenlik:** Şifre ve anahtarların ekranda maskeli görünerek korunmasını sağlama.

---

## 15. Yönetici Ekip & Rol Yetkilendirme (RBAC)
Paneli kullanacak personelin erişim sınırlarını belirlediğiniz yetkilendirme tablosudur.

* **Hangi Roller Vardır ve Ne Yapabilirler?**
  * [ ] **Süper Admin (SUPER_ADMIN):** Tüm yetkilere sahiptir. Reklam, sistem ayarları ve personel yönetimi yapabilir.
  * [ ] **Yönetici (ADMIN):** İçerik, uygulama, bilet, yorum ve e-postaları yönetir; sistem ayarlarını değiştiremez.
  * [ ] **Editör (EDITOR):** Yalnızca Makaleler, Kanallar, Uygulama Kataloğu ve Yorum moderasyonu yapabilir.
  * [ ] **İzleyici (VIEWER):** Yalnızca okuma yetkisine sahiptir; hiçbir değişiklik yapamaz.

---

### 💡 Özet: Yönetici İçin Sıfır Kodlama Konforu
* [ ] Reklamların yerini, boyutunu ve boşluklarını yönetebilme
* [ ] Blog yazılarını TipTap ile yazıp zamanlı yayına alabilme
* [ ] Okuyucuların blog yorumlarını okuyup onaylayabilme veya yanıtlayabilme
* [ ] Yazıları seslendirip dinleyerek yayına açabilme
* [ ] Mobil/Web uygulamalarını vitrine koyup yeni sürümleri duyurabilme
* [ ] Gelen e-posta ve web biletlerini yapay zeka desteğiyle yanıtlayabilme
* [ ] Tüm bülten abonelerine tek tıkla toplu duyuru gönderebilme
