# MSKLabsDesk — Proje Kuralları ve Çalışma Prensipleri (AGENTS.md)

## 1. Açılış ve Durum Bildirimi
* Güne veya oturuma **Bismillah** diyerek başlanır.
* Kullanıcı **"Bismillah"** veya **"eko"** yazdığında:
  - Nerede kalındığına dair **çok kısa, öz ve token-ekonomik** bir özet sunulur.
  - Kodlamaya hazır olunduğu belirtilir.
* **İstişare ve Kullanıcı Onay Protokolü:** Kullanıcı süreç, yöntem veya denetim konusunda fikir sorduğunda veya istişare istediğinde, doğrudan işlem/kodlama başlatılamaz. Önce net ve nesnel mühendislik görüşü sunulur. Kullanıcı açıkça **"Bismillah başla"**, **"başlayalım"** veya onay vermeden hiçbir denetim/değişiklik aksiyonu başlatılmaz.

## 2. Kodlama ve Token Tasarrufu Prensipleri
* **Token Ekonomisi:** Tüm yanıtlar ve doküman güncellemeleri olabildiğince kısa, net ve ekonomik tutulur.
* **Özet ve Maddeli Yanıt Standardı:** İstişare ve açıklamalarda yanıtlar 10-15 satır bandında tutulur; durum bildirimi sonrasında maddelerin altında 1-2 satırlık öz ve net açıklamalar sunulur. Ne aşırı boğucu kısalıkta ne de gereksiz uzunlukta tutulur; detay gerektiren konular adım adım istişare edilir.
* **Minimalist & Cerrahi Müdahale:** Yazılan veya güncellenen kodlar son derece minimal, odaklı ve etrafa yayılmadan yazılır.
* **Satır Sınırı:** Yardımcı bileşenler, modallar, eklentiler ve araç çubuklarında **400-450 satır** hedefi korunur. Form alanlarını, durum makinelerini ve tuval düzenini bir arada yöneten ana stüdyo ekranları (`BlogStudioView` vb.) için tavan sınır **azami 600 satır** olarak uygulanabilir; 600 satırı aşan durumlar modüler parçalara bölünür.
* **Hukuki ve Yasal Tanım Sayfaları İstisnası:** Kullanım Şartları, Gizlilik Politikası ve İletişim sayfaları (`terms.html`, `privacy.html`, `contact.html`) yasal ve kurumsal gereksinimler nedeniyle satır ve kelime sınırı kısıtlamalarından tamamen muaftır. Bu sayfalar yerli emsal firmaların (Logo, Akınsoft, Paraşüt) derinliği ve eksiksiz madde kapsamı birebir esas alınarak tam metin halinde hazırlanır.
* **Kapsam İzni:** Onay/talimat olmadan tüm repo genelinde arama veya izinsiz büyük değişiklik yapılmaz.

## 3. Dokümantasyon ve İlerleme Takibi
* Commit/Push öncesinde veya oturum sonunda yapılan işlemler `PROGRESS.md`, `CHANGELOG.md` veya `tasks.md` dosyalarına işlenir.
* **Türkçe & Tarih-Saat Formatı:** Tüm commit mesajları ve dokümantasyon notları anlaşılır **Türkçe açıklamalarla ve tam tarih-saat damgasıyla** (Örn: `01.10.2026 - 16:30`) yazılır.
* Kullanıcı süreçle ilgili genel/özel bir kural ifade ettiğinde fark edilir ve `AGENTS.md` dosyasına eklenerek kayıt altına alınır.

## 4. DevAdmin Geliştirme ve Ana Dal Koruma Protokolü
* **Yalnızca DevAdmin:** Tüm geliştirmeler, entegrasyonlar ve testler yalnızca `DevAdmin` dalında yürütülür. İşlem öncesinde her iki repository'de dal doğrulanır.
* **Ana Dal Koruması (Main Protection):** `main` dalına geçiş yapılmaz, merge/PR/rebase veya otomatik entegrasyon tetiklenmez. `main` entegrasyonu ancak tüm sistem `DevAdmin` üzerinde hazırlandıktan, kabul raporu sunulduktan ve kullanıcıdan açık onay alındıktan sonra yapılır.
* **Yerel Öncelikli Doğrulama (Local-First Verification):** Tüm geliştirmeler ve tasarım ince ayarları önce yerel sunucuda (localhost) doğrulanır ve kullanıcı onayına sunulur. Kullanıcıdan yerel görünüm için açık onay alınmadan uzaktaki dev (Cloudflare Pages) ortamına dağıtım (deploy) veya push yapılmaz.
* **Kabul Kriteri:** Görevler ancak kod uygulandığında, arayüz-API-veritabanı entegrasyonu gerçek veriyle doğrulandığında ve regresyon testleri geçtiğinde `DoD` kriterini sağlar. Mock veri veya yüzeysel PASS yeterli kabul edilmez.

## 5. Dil ve Arayüz Kuralı (Admin UI vs. Web İçeriği)
* **Admin Paneli Arayüzü:** Yönetici panelinin kendi menüleri, butonları, bildirimleri ve yönetim ekranları tamamen **Türkçe** olarak sunulur (panel yöneticileri Türkçe bilen ekiptir).
* **Web İçerik Çoklu Dil Desteği:** Web arayüzüne sunulacak tüm içerikler (blog yazıları, SEO başlık/açıklamaları, bildirim şablonları vb.) TR, EN, AR dillerini destekleyen çok dilli CMS altyapısını ve AI çeviri yeteneklerini eksiksiz korur.
* **Dil Etiketleri Standardı (Bayrak Emojisi Yasağı):** Sistem genelindeki hiçbir arayüzde (rozetler, sekmeler, butonlar, önizleme çubukları) bayrak emojileri (🇹🇷, 🇬🇧, 🇸🇦 vb.) veya ülke kodları (TRTR, GB EN, SA AR) kullanılmaz. Dil göstergeleri her yerde istisnasız yalın **TR**, **EN**, **AR** (veya Arapça için özel hazırlanmış kaligrafik yazı/svg) formatında sunulur.

## 6. Nesnel Mühendislik ve Dürüst İstişare İlkesi (Övgü ve Pohpohlama Yasağı)
* Kullanıcıya yönelik yapay övgüler, pohpohlama veya abartılı ifadeler ("harika, süper, mühendislik harikası" vb.) kesinlikle kullanılmaz.
* İstişarelerde asistanın yegane görevi; nesnel, tarafsız ve soğukkanlı bir mühendis gibi davranmak, fikirdeki açıkları, riskleri ve tutarsızlıkları sansürsüzce ortaya koymak, doğru ve en verimli teknik yolu savunmaktır.
