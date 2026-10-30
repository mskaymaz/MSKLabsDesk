# MSK Labs — 6698 Sayılı KVKK Kapsamında Genel Aydınlatma Metni (Taslak)

> **Belge Niteliği:** 6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") Madde 10 Uyarınca Aydınlatma Yükümlülüğü ve Veri Sahibi Başvuru Rehberi  
> **Kapsam:** `msklabs.org` Web Platformu, Tüm Alt Alan Adları, Masaüstü Yazılımları ve Mobil Uygulama Ekosistemi

---

## 🛡️ Aydınlatma Metninin Amacı ve Veri Sorumlusunun Taahhüdü

**MSK Labs** ("Kuruluş", "Biz" veya "Veri Sorumlusu") olarak; kullanıcılarımızın, web sitemizi ziyaret edenlerin ve yazılımlarımızı kullanan tüm ilgililerin kişisel verilerinin Türkiye Cumhuriyeti Anayasası, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve ilgili ikincil mevzuata tam uyumlu olarak işlenmesine ve korunmasına azami özen gösteriyoruz.

Bu Aydınlatma Metni; KVKK’nın 10. maddesinde düzenlenen *"Veri Sorumlusunun Aydınlatma Yükümlülüğü"* ile *Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ* hükümleri uyarınca; kişisel verilerinizin hangi kanallarla toplandığı, hangi hukuki sebeplere dayanarak işlendiği, kimlere ve hangi amaçlarla aktarılabileceği ve Kanun’un 11. maddesi kapsamındaki yasal haklarınız konusunda sizi bilgilendirmek amacıyla hazırlanmıştır.

---

## Madde 1 — Veri Sorumlusunun Kimliği

6698 sayılı Kanun’un 3. maddesinin 1. fıkrasının (ı) bendi uyarınca veri sorumlusu; kişisel verilerin işleme amaçlarını ve vasıtalarını belirleyen, veri kayıt sisteminin kurulmasından ve yönetilmesinden sorumlu olan tüzel veya gerçek kişidir.

Bu kapsamda; `msklabs.org` alan adı, bağlı alt alan adları ile bağımsız olarak geliştirilen masaüstü ve mobil yazılımların geliştiricisi ve işleticisi olan **MSK Labs**, Veri Sorumlusu sıfatını haizdir.

* **Resmi İnternet Sitesi:** https://msklabs.org
* **Çevrim İçi Destek Masası:** https://msklabs.org/destek.html

---

## Madde 2 — İşlenen Kişisel Veri Kategorileri

MSK Labs ekosisteminde işlenen veriler, nitelikleri ve toplanma amaçları doğrultusunda aşağıdaki kategorilerle sınırlıdır:

1. **Kimlik Verileri:** Kullanıcının yalnızca web sitesindeki destek formunu doldururken veya doğrudan kurumsal e-posta adreslerimize mesaj gönderirken kendi isteğiyle beyan ettiği Ad ve Soyad bilgisi. *(Uygulamalarımızın indirilmesinde veya çalıştırılmasında kimlik bilgisi talep edilmez.)*
2. **İletişim Verileri:** Kullanıcının destek talebi yanıtlama amacıyla paylaştığı e-posta adresi veya isteğe bağlı olarak kaydolduğu e-bülten aboneliği adresi.
3. **Müşteri İşlem ve Destek Verileri:** Kullanıcı tarafından iletilen hata bildirimleri, teknik geri bildirimler, talep/şikâyet biletleri ve bu taleplerin çözümlenmesi sürecindeki yazışma kayıtları.
4. **İşlem ve Ağ Güvenliği Verileri:** 5651 sayılı Kanun yükümlülüklerimiz ve sunucu altyapımızı siber saldırılara karşı koruma amacıyla web sunucularımız tarafından otomatik tutulan geçici internet protokolü (IP) adresi, erişim zaman damgaları ve tarayıcı kullanıcı arayüzü (User-Agent) bilgisi.
5. **Kullanıcı Tercih Verileri:** Kullanıcının tarayıcısının yerel depolama alanında (`localStorage`) saklanan açık/koyu tema tercihi, arayüz dili ve çerez onay tercihleri.

> ⚠️ **Özel Nitelikli Kişisel Veriler Hakkında Kesin Taahhüt:**  
> MSK Labs; kullanıcılardan hiçbir koşulda sağlık, biyometrik, inanç, etnik köken veya benzeri hiçbir **özel nitelikli kişisel veri talep etmemekte ve işlememektedir.**

---

## Madde 3 — Kişisel Verilerin Toplanma Yöntemleri

Kişisel verileriniz aşağıdaki kanallar vasıtasıyla elektronik ortamda toplanmaktadır:
* `msklabs.org` web sitesinde yer alan destek ve geri bildirim formları (`destek.html`),
* Resmi e-posta adreslerimize (`destek@msklabs.org`, `iletisim@msklabs.org` vb.) gönderilen elektronik iletiler,
* Web sitesi sunucuları ve içerik dağıtım ağı tarafından güvenlik amacıyla otomatik üretilen teknik bağlantı günlükleri (loglar),
* Kullanıcı deneyimini sağlamak amacıyla tarayıcınızın yerel depolama alanına kaydedilen teknik yapılandırma anahtarları.

---

## Madde 4 — Yerel Öncelikli (Local-First) Mimari ve Kullanıcı Veri Egemenliği

> 🛡️ **TAVİZSİZ MAHREMİYET TAAHHÜDÜ:**  

Uygulamalarımız **merkezi kullanıcı hesabı açma veya oturum zorunluluğu getirmeyen, yerel öncelikli (local-first)** mimariyle tasarlanmıştır:
1. Uygulamalarımız yalnızca ilgili aracın çalışması için zorunlu olan asgari teknik verileri kullanıcının kendi fiziksel cihazında yerel olarak işler; merkezi sunuculara veri aktarılmaz.
2. Kullanıcılar, yerel cihazlarında depolanan çalışma verilerini görüntüleme, düzenleme, yedekleme ve diledikleri an silme konusunda tam yetkiye sahiptir.
3. Donanım izinleri ve mimari detaylar hakkında ayrıntılı bilgi [Gizlilik Politikası](privacy.html) sayfamızda yer almaktadır.

---

## Madde 5 — Kişisel Verilerin İşlenme Amaçları

Toplanan kişisel verileriniz aşağıdaki kurumsal ve yasal amaçlarla işlenmektedir:
1. Kullanıcılar tarafından iletilen teknik destek taleplerinin, hata bildirimlerinin ve önerilerin sonuçlandırılması,
2. Web sitesi ve API altyapısının güvenliğinin sağlanması, yetkisiz erişimlerin ve siber saldırıların engellenmesi,
3. 5651 sayılı Kanun ve ilgili mevzuattan kaynaklanan yasal yükümlülüklerin yerine getirilmesi,
4. Yetkili kamu kurum ve kuruluşları ile adli makamların mevzuata uygun bilgi taleplerinin karşılanması,
5. Kullanıcının açık rıza vermesi halinde, yeni sürüm duyuruları ve bülten iletilerinin gönderilmesi.

---

## Madde 6 — Kişisel Verilerin İşlenmesinin Hukuki Sebepleri

Kişisel verileriniz, 6698 sayılı Kanun’un 5. maddesinde düzenlenen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
* **KVKK m. 5/2-c (Sözleşmenin Kurulması veya İfası):** Destek taleplerinizin ve teknik biletlerinizin çözüme kavuşturulması amacıyla iletişim kurulması,
* **KVKK m. 5/2-ç (Veri Sorumlusunun Hukuki Yükümlülüğü):** 5651 sayılı Kanun uyarınca sistem erişim loglarının mevzuatta öngörülen zorunlu süre boyunca saklanması,
* **KVKK m. 5/2-e (Bir Hakkın Tesisi, Kullanılması veya Korunması):** Olası hukuki uyuşmazlıklarda savunma hakkının kullanılması,
* **KVKK m. 5/2-f (Meşru Menfaat):** İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla platform güvenliğinin temini ve hizmet kalitesinin artırılması,
* **KVKK m. 5/1 (Açık Rıza):** İsteğe bağlı olarak e-bülten listemize kaydolan kullanıcılara sürüm bildirimlerinin iletilmesi.

---

## Madde 7 — Kişisel Verilerin Aktarılması

MSK Labs, kullanıcılarına ait kişisel verileri hiçbir koşulda **üçüncü şahıslara satmaz, kiralamaz ve pazarlama şirketleriyle paylaşmaz.**

Kişisel verileriniz yalnızca aşağıdaki istisnai durumlarda ve KVKK’nın 8. ve 9. maddelerine tam uyumlu olarak aktarılabilir:
1. **Yetkili Kamu Kurumları:** Yasal zorunluluklar çerçevesinde mahkemeler, savcılıklar ve bilgi talep etmeye yetkili resmi mercilerin mevzuata uygun yazılı talepleri doğrultusunda.
2. **Teknik Altyapı Sağlayıcıları:** Web sitemizin küresel düzeyde yüksek performanslı ve siber saldırılara karşı korumalı biçimde sunulabilmesi amacıyla içerik dağıtım ağı ve kurumsal e-posta iletim altyapımız üzerinden teknik zorunlulukla sınırlı olarak.

---

## Madde 8 — Veri Güvenliğine İlişkin Alınan Tedbirler

KVKK'nın 12. maddesi doğrultusunda aşağıdaki teknik ve idari tedbirler uygulanmaktadır:
* Tüm web ve API trafiğimiz güncel **TLS 1.3 şifreleme protokolü** ve zorunlu HTTPS ile korunmaktadır.
* Web sitemiz üzerinde hiçbir şekilde kredi kartı veya banka kartı vb. bilgisi toplanmaz ve saklanmaz.
* API uç noktalarımızda CORS kuralları, CSRF doğrulamaları ve otomatik istek sınırlandırma (rate limiting) mekanizmaları etkindir.
* Uygulamalarımız yerel öncelikli olarak çalıştığından, sunucularımızda merkezi kullanıcı veritabanı tutulmaz; toplu veri sızıntısı riski bulunmamaktadır.

---

## Madde 9 — Kişisel Verilerin Saklanma Süresi ve İmhası

* **Masaüstü ve Mobil Uygulama Verileri:** Tamamen kullanıcının kendi yerel cihazında tutulduğundan; kullanıcının uygulamayı cihazından kaldırması veya yerel verileri temizlemesiyle anında ve geri döndürülemez biçimde silinir.
* **Destek Masası ve E-Posta Yazışmaları:** Talebin çözümlenmesinin ardından Türk Borçlar Kanunu ve Türk Ticaret Kanunu uyarınca genel zamanaşımı süresi sonunda güvenli yöntemlerle silinir, yok edilir veya anonim hale getirilir.
* **Sunucu Bağlantı Logları:** 5651 sayılı Kanun gereğince mevzuatta belirlenen yasal zorunlu süre boyunca saklanır ve sürenin dolmasıyla otomatik olarak imha edilir.

---

## Madde 10 — Yürürlük ve Değişiklikler

Bu Aydınlatma Metni, yayımlandığı tarihte yürürlüğe girer. MSK Labs, yasal düzenlemeler doğrultusunda bu metni güncelleme hakkını saklı tutar. Güncel metin `msklabs.org/kvkk.html` adresinde yayımlandığı anda geçerlilik kazanır.

---

> 📅 **Son Güncelleme:** 30 Ekim 2026
