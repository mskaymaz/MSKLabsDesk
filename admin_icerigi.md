# MSKLabsDesk — Yönetici (Admin) Kullanım & Fonksiyon Haritası

> **Bu Dokümanın Amacı:** Yazılım veya kodlama bilgisi gerektirmeyen; yönetim panelini günlük operasyonlarında kullanan site yöneticileri, editörler ve işletme sahipleri için ekranların, butonların ve ayarların kapsamlı rehberidir.

---

## 🧭 Genel Bakış & Sol Menü Navigasyonu
Yönetim paneline giriş yapıldığında sol menüde günlük operasyonları yürütebileceğiniz modüller yer alır. Ekranlar modern karanlık (dark) ve aydınlık (light) tema desteğine sahiptir ve tüm cihazlardan (mobil, tablet, masaüstü) tam uyumlu olarak yönetilebilir.

---

## 1. Ana Gösterge Paneli (Dashboard & Canlı Durum Özeti)
İşletmenizin ve web sitenizin anlık nabzını tuttuğunuz ana kontrol merkezidir.

* **Ekranda Ne Görür?**
  * **Canlı Durum Kartları:** *"Bekleyen Destek Talepleri"*, *"Onay Bekleyen Yorumlar"*, *"Yayınlanmış Makaleler"*, *"Toplam Bülten Aboneleri"* ve *"Aktif Uygulamalar"*.
  * **Hızlı Uyarı Göstergeleri:** Yanıt bekleyen acil biletler ve onaylanmamış yorumlar için renkli bildirim rozetleri.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * Herhangi bir istatistik kartına tıkladığında doğrudan o işlemin detay ekranına zıplar (Örn: "3 Onay Bekleyen Yorum" kartına basıldığında doğrudan yorum moderasyonuna gider).
  * Sistem genelindeki güncel iş akışını tek ekranda kontrol eder.

---

## 2. Destek Talepleri & İletişim Masası (Helpdesk)
Ziyaretçilerden gelen mesajları, şikayetleri ve iş birliği tekliflerini yönettiğiniz müşteri ilişkileri ekranıdır.

* **Ekranda Ne Görür?**
  * Gelen mesajların listesi; gönderen adı, e-posta adresi, konusu, geliş tarihi ve işlem durumu (*Yeni*, *İşlemde*, *Çözüldü*, *Reddedildi*).
  * **Arama & Filtreleme Çubuğu:** İsim, e-posta, talep numarası veya durumuna göre anında arama.
  * **Yapay Zeka Analiz Kutusu (AI Banner):** Mesaj detayına tıklandığında, yapay zekanın mesajı 2-3 cümlede özetlediği analiz paneli.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * **Yapay Zeka Taslağını Kullan:** Tek tıkla AI'ın hazırladığı öneri yanıt metnini cevap kutusuna aktarır, gerekirse kelimeleri düzenler ve doğrudan kullanıcının e-postasına yanıt gönderir.
  * **Durum Güncelleme:** Talebi *"İşlemde"*, *"Çözüldü"* veya *"Reddedildi"* olarak işaretleyip arşivler.
  * **Kupon & Hediye Tanımlama (Müşteri Memnuniyeti):** Değerli geri bildirim veya hata bildirimi yapan kullanıcıya tek tıkla özel indirim kuponu (Örn: *1 Ay Ücretsiz Pro Üyelik*, *%50 İndirim*) veya teşekkür rozeti tanımlayıp e-posta ile hediye edebilir.

---

## 3. Blog & Makale Stüdyosu (CMS & İçerik Yönetimi)
Sitede yayınlanacak zengin içerikleri, rehberleri ve blog yazılarını hazırladığınız stüdyodur.

* **Ekranda Ne Görür?**
  * Yazıların durumu (*Taslak*, *İncelemede*, *Yayında*, *Arşivde*), okunma sayıları, ait olduğu kanal ve yayın tarihi.
  * **Zengin Metin Editörü (TipTap):** Word/Medium konforunda başlıklar, kalın/italik yazılar, listeler, alıntılar ve kod blokları ekleyebileceği yazı alanı.
  * **Blok Düzenleyici (Layout Builder):** Paragrafların, görsellerin ve özel kutuların sırasını gösteren görsel şema.
  * **Revizyon Geçmişi:** Makalenin geçmişte kaydedilmiş önceki sürümleri (Sürüm 1, Sürüm 2 vb.).
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * **Sürükle-Bırak Düzen:** Blok düzenleyicide bir görseli veya metin kutusunu fareyle yukarı-aşağı taşıyarak sayfa düzenini değiştirir.
  * **Kapak Görseli & Medya Yükleme:** Bilgisayarından kapak fotoğrafı veya makale içi görsel seçip tek tıkla güvenli bulut deposuna yükler.
  * **Zamanlanmış Otomatik Yayın:** "Bu yazıyı hemen değil, Cuma günü saat 14:00'te otomatik yayınla" diyerek ileri tarihli takvim kurar.
  * **Eski Sürüme Geri Dönüş (Restore):** Yanlışlıkla silinen veya bozulan bir içeriği, geçmiş revizyon listesinden tek tıkla eski haline döndürür.
  * **Canlı Önizleme:** Yazıyı yayına almadan önce mobil ve masaüstü ekranda nasıl görüneceğini test eder.

---

## 4. Blog Kanalları & Kategori Yönetimi
Blog yazılarını konularına göre gruplandırdığınız kategori merkezidir.

* **Ekranda Ne Görür?**
  * Mevcut kanalların listesi (Örn: *Yazılım*, *Tasarım*, *Yapay Zeka*), bu kanallardaki yazı sayıları ve kanal ikonları.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * **Yeni Kanal Oluşturma:** Kanalın adını ve açıklamasını Türkçe, İngilizce ve Arapça olarak tanımlar; hazır kütüphaneden uygun bir simge/ikon seçer.
  * **Sıralama Belirleme:** Kanalların web sitesi menüsünde hangi sırada görüneceğini (1, 2, 3...) numaralandırarak düzenler.
  * **Kanal Silme / Düzenleme:** İsmi günceller veya kullanılmayan kanalı kaldırır (İçindeki yazılar silinmez, güvenle korunur).

---

## 5. Yorum Denetimi & Moderasyon Paneli
Okuyucuların blog yazılarına yazdığı yorumların yayına girmeden önce denetlendiği güvenli filtre alanıdır.

* **Ekranda Ne Görür?**
  * Yorum yazan kişinin adı, e-posta adresi, hangi yazıya yorum yaptığı ve yorum metni.
  * Durum filtreleri (*Onay Bekleyenler*, *Onaylananlar*, *Reddedilenler*).
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * **Tek Tıkla Onay:** Yorumu uygun bulursa "Onayla" butonuna basar; yorum saniyeler içinde sitede görünür hale gelir.
  * **Gerekçeli Reddetme:** Uygunsuz, spam veya kaba yorumları reddeder; dilerse kullanıcıya "Topluluk kurallarına aykırı dil kullanımı sebebiyle yorumunuz onaylanmamıştır" şeklinde bilgilendirme iletir.
  * **Yorum Silme:** İlgili yorumu tamamen veri tabanından kaldırır.

---

## 6. Sesli Makale Dinleme & Onay Masası (TTS Player)
Yazıların yapay zeka tarafından seslendirilip sesli makaleye dönüştürüldüğü ses yönetim stüdyosudur.

* **Ekranda Ne Görür?**
  * Her makalenin Türkçe, İngilizce ve Arapça ses durumu (*Üretiliyor*, *Taslak / Dinleme Bekliyor*, *Onaylandı / Yayında*, *Eski Sürüm - STALE*).
  * Panel içi dahili HTML5 ses oynatıcısı (Oynat, durdur, 10 saniye ileri/geri sar, hız ayarı: 0.75x - 1.5x).
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * **Ses Üretimini Başlatma:** Makale yazıldıktan sonra tek tuşla TR/EN/AR dillerinde stüdyo kalitesinde MP3 ses üretimi başlatır.
  * **Yönetici Ön Dinlemesi:** Ses hazır olunca kulaklığını takıp önce kendisi dinler; telaffuz ve akıcılığı kontrol eder.
  * **Yayına Verme Onayı:** Beğendiğinde "Onayla & Yayına Al" der ve sitedeki ziyaretçilerin dinlemesine açar.
  * **Otomatik Koruma Güvencesi:** Yönetici makalede herhangi bir cümleyi değiştirdiğinde, sistem eski sesin uyumsuz kalmaması için sesi siteden otomatik olarak gizler (*STALE*). Yönetici tek tıkla yeni metne göre sesi baştan ürettirir.

---

## 7. Mobil & Web Uygulama Kataloğu (Apps Showcase)
MSK Labs bünyesinde geliştirilen Android, iOS ve Web uygulamalarının tanıtıldığı vitrin yönetim alanıdır.

* **Ekranda Ne Görür?**
  * Uygulamaların logoları, isimleri, kategorileri (Araçlar, Eğitim, Oyun vb.) ve platform etiketleri (Android, iOS, Web).
  * Hangi uygulamanın ana sayfada "Vitrin / Öne Çıkan" olduğunu gösteren yıldız rozeti.
  * Yayınlanan sürüm geçmişi (v1.0.0, v1.2.0), indirme linkleri ve sürüm notları.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * **Yeni Uygulama Ekleme:** Uygulama adını, ikonunu, kapak görselini yükler; Türkçe, İngilizce ve Arapça tanıtım metinlerini girer.
  * **Platform Seçimi:** Uygulamanın çalıştığı ortamı belirler (*Android*, *iOS*, *Her İkisi* veya *Web Uygulaması*).
  * **Vitrinde Öne Çıkarma:** Tek bir anahtarla (Toggle) uygulamayı ana sayfa manşetine taşır veya manşetten indirir.
  * **Yeni Sürüm & Güncelleme Çıkarma:** Yeni güncelleme geldiğinde sürüm kodunu girer (Örn: `v2.1.0`), "Yenilikler / Değişiklik Notları"nı yazar ve doğrudan APK indirme linki veya Google Play / App Store mağaza linkini ekler.
  * **Zorunlu Güncelleme Ayarı:** Kritik bir güvenlik güncellemesinde "Bu sürüm zorunludur" anahtarını açarak eski sürüm kullanıcılarına güncelleme uyarısı gönderilmesini sağlar.

---

## 8. Reklam Yerleşimi & AdSense Ayarları
Sitedeki gelir ortaklığı ve reklam alanlarının görsel olarak yönetildiği reklam masasıdır.

* **Ekranda Ne Görür?**
  * Sitedeki reklam yuvaları (Üst Banner, Makale İçi, Yan Panel, Alt Bant).
  * Her alanın aktif/pasif durumu, seçili boyutu ve kenar boşlukları.
  * **Sandbox Önizleme Penceresi:** Reklamın sayfada nasıl duracağını gösteren güvenli test önizlemesi.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * **Standart Boyut Seçimi:** Reklamı 10 hazır standart boyuttan birine ayarlar (*728x90*, *300x250*, *336x280*, *320x50*, *300x600*, *160x600*, *970x90*, *970x250*, *320x100*, *Responsive*).
  * **Özel (Custom) Boyut Tanımlama:** Standart dışı bir tasarım istenirse piksel cinsinden özel genişlik ve yükseklik girer (Örn: 400x180 px).
  * **Yukarı / Aşağı Boşluk (Margin) Ayarı:** Reklamın üstündeki ve altındaki yazılarla mesafesini milimetrik olarak (Margin Top / Bottom) ayarlar.
  * **Yapışkan (Sticky) Reklam:** Sayfa aşağı kaydırıldığında reklamın ekranda sabit kalarak kullanıcıyı takip etmesini tek tıkla açar/kapatır.
  * **Anında Açma / Kapatma:** Tek bir butonla reklam alanını tamamen gizler veya anında görünür kılar.

---

## 9. Site Üst Duyuru Bandı (Announcement Bar)
Web sitesinin en üstünde ziyaretçilere gösterilen acil duyuru veya kampanya şerididir.

* **Ekranda Ne Görür?**
  * Duyuru metninin Türkçe, İngilizce ve Arapça alanları ve bandın açık/kapalı durumu.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * "Yeni mobil uygulamamız yayında!", "Bakım çalışması duyurusu" gibi metinleri yazar.
  * Tek anahtarla duyuruyu tüm sitede anında görünür yapar veya kaldırır.

---

## 10. Toplu E-Posta & Bülten Gönderimi (Broadcast)
Tüm kayıtlı e-posta abonelerine tek seferde duyuru, bülten veya kampanya gönderilen toplu iletişim aracıdır.

* **Ekranda Ne Görür?**
  * Sol tarafta e-posta konusu ve zengin metin editörü; sağ tarafta ise e-postanın alıcının gelen kutusunda nasıl görüneceğini gösteren canlı HTML önizleme penceresi.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * Başlığı ve duyuru içeriğini hazırlar.
  * Canlı önizlemeden kontrol ettikten sonra **"Tüm Abonelere Gönder"** butonuna basar; onay penceresini onaylar.
  * Sistem arka planda binlerce aboneye kotayı aşmadan düzenli aralıklarla e-postaları güvenle iletir.

---

## 11. Bülten Abone Yönetimi (Subscribers & KVKK)
E-bültene kaydolan kitleyi incelediğiniz ve yasal izinlerini takip ettiğiniz listedir.

* **Ekranda Ne Görür?**
  * Abone e-postası, abonelik tarihi, e-posta doğrulama durumu ve varsa bültenden ayrılma (unsubscribe) tarihi.
  * Hızlı e-posta arama kutusu ve durum filtreleri (*Tümü*, *Doğrulanmış*, *Doğrulanmamış*, *Ayrılanlar*).
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * Kullanıcı talep ettiğinde tek tıkla aboneyi pasife alabilir veya silebilir.
  * Ayrılan abonelerin gönderim listesinden otomatik düşmesini izler (İzinsiz e-posta gönderimi sıfıra indirilir).

---

## 12. Çok Dilli Çeviri Masası & Dil Seçimi (i18n & RTL)
Sitenin ve yönetim panelinin çok dilli çalışmasını sağlayan dil merkezidir.

* **Ekranda Ne Görür?**
  * Yönetim panelinin sağ üst köşesinde dil seçici (TR / EN / AR).
  * Çeviri onay modalında sol tarafta orijinal Türkçe metin, sağ tarafta yapay zekanın çevirdiği İngilizce veya Arapça metin.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * **Panel Dilini Değiştirme:** Tek tıkla yönetim panelini İngilizceye veya Arapçaya çevirir. Arapça seçildiğinde tüm panel otomatik olarak sağdan sola (RTL) ayna düzenine geçer.
  * **Çeviriyi İnceleme & Düzeltme:** Yapay zekanın çevirisinde beğenmediği bir kelime varsa düzenler ve "Onayla" diyerek sitede yayınlar.

---

## 13. Sistem, Güvenlik & Site Ayarları (Settings)
Web sitesinin temel kurumsal bilgilerini ve güvenlik kalkanlarını ayarladığınız ekrandır.

* **Ekranda Ne Görür?**
  * Site Başlığı, Site Adresi (URL), Gönderici E-Postası ve Güvenlik kalkanı durumları.
* **Neler Yapabilir / Hangi Ayarları Değiştirir?**
  * **Site Bilgileri:** Site adını (Örn: *MSK Labs*) ve resmi web adresini günceller.
  * **Arayüz Teması:** Panel görünümünü *Karanlık (Dark)* veya *Aydınlık (Light)* tema olarak ayarlar.
  * **E-Posta Gönderici Bilgisi:** Siteden giden bildirimlerde görünecek Gönderici Adı (Örn: *MSK Labs Destek*) ve Gönderici E-Posta adresini tanımlar.
  * **Cloudflare Turnstile Bot Koruması:** Formlara otomatik saldıran robotları engelleyen akıllı bot filtresini tek tıkla açar/kapatır (Kullanıcıya zor resimler çözdürmeyen görünmez koruma).
  * **Web Push Bildirimleri:** Masaüstü ve mobil cihazlara anlık web bildirimleri gitmesini tek tuşla etkinleştirir.

---

## 14. Güvenlik Denetim Logları & Olay İzleme (Audit Log)
Panelde kimin ne yaptığının şeffafça kaydedildiği güvenlik hafızasıdır.

* **Ekranda Ne Görür?**
  * İşlem tarihi, işlemi yapan yöneticinin adı, yapılan işlem (Örn: *"Makale Silindi"*, *"Yeni Reklam Eklendi"*, *"Yorum Onaylandı"*, *"Başarısız Giriş Denemesi"*).
* **Neler Yapabilir?**
  * Şüpheli bir durum olduğunda hangi tarihte hangi personelin değişiklik yaptığını filtreleyip inceler.
  * Şifreler ve özel anahtarlar ekranda yıldızlı (maskeli) görünür, kimse kimsenin şifresini göremez.

---

## 15. Yönetici Ekip & Rol Yetkilendirme (RBAC)
Paneli kullanacak çalışma arkadaşlarının sınırlarını belirlediğiniz personel yetki tablosudur.

* **Hangi Roller Vardır ve Ne Yapabilirler?**
  1. **Süper Admin (SUPER_ADMIN):** Tüm yetkilere sahiptir. Reklamları düzenleyebilir, sistem ayarlarını değiştirebilir, yeni yönetici ekleyebilir veya silebilir.
  2. **Yönetici (ADMIN):** İçerikleri, uygulamaları, biletleri, yorumları ve e-postaları yönetir; ancak kritik sistem/güvenlik anahtarlarını değiştiremez.
  3. **Editör (EDITOR):** Sadece Blog Makaleleri, Kanallar, Uygulama Kataloğu ve Yorum moderasyonu yapabilir. Destek biletlerine, reklam ayarlarına ve bülten gönderimine erişemez.
  4. **İzleyici (VIEWER):** Yalnızca istatistikleri ve içerikleri okuyabilir; hiçbir ekleme, silme veya düzenleme yapamaz.

---

### 💡 Özet: Yönetici İçin Sıfır Kodlama Konforu
Bu yönetim paneli sayesinde teknik ekibe, yazılımcıya veya kodlamaya hiçbir ihtiyaç duymadan;
* Reklamların yerini ve boyutunu değiştirebilir,
* Blog yazılarını yazıp saatli yayına kurabilir,
* Yorumları gerekçe yazarak onaylayıp reddedebilir,
* Yazıları seslendirip dinleyerek yayına alabilir,
* Geliştirdiğiniz mobil/web uygulamalarını vitrine koyup yeni sürümlerini duyurabilir,
* Müşteri biletlerini yapay zeka desteğiyle yanıtlayıp kupon hediye edebilir,
* Tüm abonelerinize tek tıkla toplu bülten gönderebilirsiniz.
