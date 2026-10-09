# MSKLabsDesk — Proje Kuralları ve Çalışma Prensipleri (AGENTS.md)

## 1. Açılış ve Durum Bildirimi
* Güne veya oturuma **Bismillah** diyerek başlanır.
* Kullanıcı **"Bismillah"** veya **"eko"** yazdığında:
  - Nerede kalındığına dair **çok kısa, öz ve token-ekonomik** bir özet sunulur.
  - Kodlamaya hazır olunduğu belirtilir.
* **İstişare ve Kullanıcı Onay Protokolü:** Kullanıcı süreç, yöntem veya denetim konusunda fikir sorduğunda veya istişare istediğinde, doğrudan işlem/kodlama başlatılamaz. Önce net ve nesnel mühendislik görüşü sunulur. Kullanıcı açıkça **"Bismillah başla"**, **"başlayalım"** veya onay vermeden hiçbir denetim/değişiklik aksiyonu başlatılmaz.

## 2. Kodlama ve Token Tasarrufu Prensipleri
* **Token Ekonomisi:** Tüm yanıtlar ve doküman güncellemeleri olabildiğince kısa, net ve ekonomik tutulur.
* **Minimalist & Cerrahi Müdahale:** Yazılan veya güncellenen kodlar son derece minimal, odaklı ve etrafa yayılmadan yazılır.
* **Satır Sınırı:** Hiçbir kod dosyası 400-450 satırı aşamaz; modüler parçalara bölünür.
* **Kapsam İzni:** Onay/talimat olmadan tüm repo genelinde arama veya izinsiz büyük değişiklik yapılmaz.

## 3. Dokümantasyon ve İlerleme Takibi
* Commit/Push öncesinde veya oturum sonunda yapılan işlemler `PROGRESS.md`, `CHANGELOG.md` veya `tasks.md` dosyalarına işlenir.
* **Türkçe & Tarih-Saat Formatı:** Tüm commit mesajları ve dokümantasyon notları anlaşılır **Türkçe açıklamalarla ve tam tarih-saat damgasıyla** (Örn: `01.10.2026 - 16:30`) yazılır.
* Kullanıcı süreçle ilgili genel/özel bir kural ifade ettiğinde fark edilir ve `AGENTS.md` dosyasına eklenerek kayıt altına alınır.

## 4. DevAdmin Geliştirme ve Ana Dal Koruma Protokolü
* **Yalnızca DevAdmin:** Tüm geliştirmeler, entegrasyonlar ve testler yalnızca `DevAdmin` dalında yürütülür. İşlem öncesinde her iki repository'de dal doğrulanır.
* **Ana Dal Koruması (Main Protection):** `main` dalına geçiş yapılmaz, merge/PR/rebase veya otomatik entegrasyon tetiklenmez. `main` entegrasyonu ancak tüm sistem `DevAdmin` üzerinde hazırlandıktan, kabul raporu sunulduktan ve kullanıcıdan açık onay alındıktan sonra yapılır.
* **Kabul Kriteri:** Görevler ancak kod uygulandığında, arayüz-API-veritabanı entegrasyonu gerçek veriyle doğrulandığında ve regresyon testleri geçtiğinde `DoD` kriterini sağlar. Mock veri veya yüzeysel PASS yeterli kabul edilmez.
