# MSK Labs — Genel Gizlilik Politikası (Taslak)

> **Belge Niteliği:** Kurumsal Çatı Gizlilik İlkeleri, Yerel Öncelikli Mimari ve Veri Güvenliği Esasları  
> **Kapsam:** `msklabs.org` Web Platformu, Tüm Alt Alan Adları, Masaüstü Yazılımları ve Mobil Uygulamalar

---

## 🛡️ Temel Mahremiyet İlkemiz — Sıfır Bilgi (Zero-Knowledge) ve Yerel Öncelikli (Local-First) Mimari

MSK Labs; kullanıcı mahremiyetini ve kişisel verilerin dokunulmazlığını tüm ticari hedeflerin, reklam modellerinin ve veri madenciliği faaliyetlerinin üzerinde tutar. 

Tüm uygulamalarımızda **merkezi kullanıcı hesabı açma, zorunlu üyelik, profil çıkarma veya kişisel veri toplama kesinlikle bulunmamaktadır.** Tüm çalışma dosyalarınız, notlarınız, hedefleriniz ve kullanıcı tercihleriniz *"Veriniz tamamen sizindir"* ilkesi uyarınca **tamamen kendi fiziksel cihazınızda yerel olarak** işlenir ve saklanır; merkezi sunucularımıza aktarılmaz. Kullanıcılar bu verileri kontrol etme, yedekleme ve diledikleri an silme konusunda tam yetkiye sahiptir.

---

## Madde 1 — Veri Sorumlusunun Kimliği

`msklabs.org` internet sitesi ile masaüstü ve mobil platformlarda yayınlanan bağımsız yazılım ürünlerinin geliştiricisi ve yöneticisi olan **MSK Labs** ("Kuruluş", "Biz" veya "Veri Sorumlusu"), kişisel verilerinizin korunmasına en üst düzeyde özen göstermektedir.

* **Resmi İnternet Sitesi:** https://msklabs.org
* **Çevrim İçi Destek Masası:** https://msklabs.org/destek.html

---

## Madde 2 — Kişisel Verilerin İşlenmesindeki Temel İlkeler

MSK Labs ekosisteminde yürütülen tüm süreçler evrensel veri koruma prensiplerine sıkı sıkıya bağlıdır:

1. **Hukuka ve Dürüstlük Kurallarına Uygunluk:** Kullanıcı aleyhine gizli veya öngörülemez hiçbir veri işleme faaliyeti yürütülmez.
2. **Kullanıcı Veri Egemenliği:** Yerel veriler kullanıcının kendi denetiminde olduğundan; verilerin üretimi, saklanması ve silinmesi doğrudan kullanıcının tasarrufundadır.
3. **Belirli, Açık ve Meşru Amaçlar İçin İşlenme:** Arka planda habersiz veri toplayan veya kullanıcı davranışını gözetleyen hiçbir telemetri kodu sistemlerimizde yer almaz.
4. **Veri Minimizasyonu (Ölçülülük):** Yalnızca ilgili hizmetin veya uygulamanın teknik olarak sunulabilmesi için kaçınılmaz olan asgari düzeydeki yerel veriler işlenir.
5. **Sınırlı Muhafaza:** Sunucularımızda gereksiz veri arşivi tutulmaz; yerel veriler kullanıcının cihazında saklanır.

---

## Madde 3 — İşlenen Veriler ve Genel Kapsamı

MSK Labs ekosisteminde işlenen veriler nitelikleri itibarıyla asgari düzeydedir:

* **İletişim ve Destek Bilgileri:** Yalnızca web sitemizdeki destek masası veya doğrudan e-posta yazışmalarında kullanıcının kendi isteğiyle paylaştığı ad-soyad, e-posta adresi ve talep içerikleri. *(Uygulamalarımızın kullanımında kimlik veya iletişim bilgisi talep edilmez.)*
* **Ağ ve İşlem Güvenliği Verileri:** Web sitesine erişim sırasında sunucu altyapısını siber saldırılardan korumak amacıyla geçici olarak kaydedilen internet protokolü (IP) adresi, tarayıcı türü ve zaman damgaları.
* **Kullanıcı Tercih Verileri (Yerel Depolama):** Kullanıcının tarayıcısında veya cihazında yerel olarak saklanan gece/gündüz tema tercihi, seçili dil ve çerez onay tercihleri.

> **Özel Nitelikli Kişisel Veriler:** MSK Labs; kullanıcılardan hiçbir koşulda sağlık, biyometrik, inanç veya benzeri hiçbir özel nitelikli kişisel veri talep etmez ve işlemez.

---

## Madde 4 — Yerel Öncelikli Mimari, Cihaz İzinleri ve Sensör Şeffaflığı

> ⚠️ **TAVİZSİZ GÜVENLİK TAAHHÜDÜ:**  
> **KAMERA VE MİKROFON MAHREMİYETİ TAAHHÜDÜ:** MSK Labs uygulamalarında habersiz kamera veya mikrofon erişimi kesinlikle yapılmaz; optik görüntü veya ses kaydı gizlice alınmaz. Yalnızca doğası gereği ses kaydı (sesli not alma, ses işleme vb.) veya optik görüntü işleme (belge tarama, görsel düzenleme vb.) fonksiyonuna sahip özel araçlarımızda bu tür izinler; yalnızca ilgili işlevin icrası amacıyla, kullanıcının açık rızası ve anlık işletim sistemi onayıyla talep edilir. Üretilen tüm ses ve görüntü kayıtları münhasıran kullanıcının kendi yerel cihazında saklanır ve kullanıcının tam tasarrufundadır.

Masaüstü ve mobil uygulamalarımız aşağıdaki şeffaf ilkelerle çalışır:

1. **İşlev Odaklı Asgari İzin:** Uygulamalarımız yalnızca ilgili aracın vaat ettiği temel işlevi yerine getirebilmesi için teknik olarak zorunlu olan donanım bileşenlerini (yakınlık sensörü, GPS sinyali, dosya seçici veya pil durumu API'si) anlık ve yerel olarak kullanır.
2. **Cihaz İçi İşleme:** Sensör verileri veya kullanıcının seçtiği çalışma dosyaları hiçbir uzak sunucuya aktarılmaz; doğrudan kullanıcının işlemcisinde ve geçici belleğinde (RAM) işlenir.
3. **Kullanıcı Kontrolü ve Silme Yetkisi:** Uygulamalarımız tarafından üretilen tüm yapılandırma dosyaları kullanıcının kendi fiziksel cihazında depolanır. Kullanıcı bu dosyaları dilediği an açma, düzenleme, yedekleme veya kalıcı olarak silme konusunda tam ve müstakil yetkiye sahiptir.

---

## Madde 5 — Çerezler ve Web Sitesi Tercihleri

Web sitemizde (`msklabs.org`), kullanıcı deneyimini sağlamak, dil/tema tercihlerini hatırlamak ve sitemizin güvenliğini temin etmek amacıyla sınırlı kapsamda birinci taraf teknik çerezler ve yerel tarayıcı depolama alanları (`localStorage`) kullanılmaktadır. 

Ayrıca bağımsız geliştirme faaliyetlerimizi sürdürmek amacıyla açık rızanıza bağlı olarak onaylı reklam servisleri (Google AdSense) kullanılabilir. Sitemizde kullanılan tüm çerezlerin ayrıntılı dökümü, kullanım süreleri ve çerez tercihlerinizi yönetme yolları için lütfen [Çerez Politikası](cookies.html) sayfamızı inceleyiniz.

---

## Madde 6 — Veri Paylaşımı ve Üçüncü Taraflara Aktarım

MSK Labs, kullanıcılarına ait kişisel verileri hiçbir koşulda **üçüncü şahıslara satmaz, kiralamaz ve ticari amaçlı pazarlama şirketleriyle paylaşmaz.**

Veriler yalnızca yasal zorunluluklar gereği yetkili kamu kurum ve kuruluşlarının mevzuata uygun resmi talepleri doğrultusunda veya web sitemizin kesintisiz sunulabilmesi için teknik altyapı sağlayıcılarımız üzerinden teknik zorunlulukla sınırlı olarak aktarılabilir.

---

## Madde 7 — Veri Güvenliği Tedbirleri

Kişisel verilerin ve yerel çalışma ortamının güvenliği için aşağıdaki standartlar uygulanmaktadır:

* Web ve API trafiğimiz güncel **TLS 1.3 ve zorunlu HTTPS** şifrelemesiyle korunmaktadır.
* Web sitemiz üzerinde hiçbir şekilde kredi kartı veya finansal ödeme bilgisi toplanmaz ve saklanmaz.
* Sunucularımızda merkezi kullanıcı veritabanı tutulmadığından, toplu veri sızıntısı veya veritabanı çalınması riski teknik olarak ortadan kaldırılmıştır.

---

## Madde 8 — Veri Saklama ve Kalıcı İmha

* **Uygulama Verileri:** Tamamen kullanıcının kendi yerel cihazında tutulduğundan; kullanıcının uygulamayı cihazından kaldırması veya yerel dosyaları silmesiyle birlikte **anında ve geri döndürülemez biçimde silinir.**
* **Destek Yazışmaları:** Kullanıcının destek talebi çözüme kavuşturulduktan sonra yasal zamanaşımı sürelerinin dolmasıyla birlikte güvenli yöntemlerle imha edilir veya anonimleştirilir.

---

## Madde 9 — Üçüncü Taraf Web Siteleri ve Dış Bağlantılar

Web sitemiz veya uygulamalarımız harici web sitelerine bağlantılar içerebilir. MSK Labs, bağlantı verilen harici platformların gizlilik uygulamalarından ve içeriklerinden sorumlu değildir.

---

## Madde 10 — Yasal Haklarınız ve İrtibat Kanalları

6698 sayılı KVKK’nın 11. maddesi ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) kapsamında kişisel veri sahipleri; verilerinin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltilmesini veya silinmesini isteme haklarına sahiptir.

Yasal haklarınızın tam listesi, kanuni başvuru usulü ve detaylı rehber için lütfen [KVKK Aydınlatma Metni](kvkk.html) sayfamızı inceleyiniz. 

---

## Madde 11 — Değişiklikler ve Yürürlük

MSK Labs, mevzuat güncellemeleri veya ürün iyileştirmeleri doğrultusunda bu Gizlilik Politikası'nı güncelleme hakkını saklı tutar. Güncel metin `msklabs.org/privacy.html` adresinde yayımlandığı anda geçerlilik kazanır.

---

> 📅 **Son Güncelleme:** 30 Ekim 2026
