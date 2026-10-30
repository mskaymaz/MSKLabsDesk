import os

path = r'd:\Code\mskaymaz\webMSKLabs\privacy.html'

privacy_html = '''<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gizlilik Politikası ve KVKK Aydınlatma Metni | MSK Labs</title>
  <meta name="description" content="MSK Labs web sitesi, masaüstü yazılımları ve mobil uygulamaları için Kişisel Verilerin Korunması (KVKK), GDPR ve Gizlilik İlkeleri.">
  <script>!function(){var t=localStorage.getItem("user_theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");"dark"===t&&document.documentElement.setAttribute("data-theme","dark")}()</script>
  <link rel="canonical" href="https://msklabs.org/privacy.html">
  <meta property="og:title" content="Gizlilik Politikası ve KVKK Aydınlatma Metni | MSK Labs">
  <meta property="og:description" content="MSK Labs web sitesi, masaüstü yazılımları ve mobil uygulamaları için Kişisel Verilerin Korunması (KVKK), GDPR ve Gizlilik İlkeleri.">
  <meta property="og:url" content="https://msklabs.org/privacy.html">
  <meta property="og:type" content="website">
  <meta property="og:image" content="https://msklabs.org/img/MSKLabsLogo.svg">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/global.css?v=31">

  <link rel="icon" type="image/png" href="img/MSKLabs_favicon.png">
  <link rel="shortcut icon" href="img/MSKLabs_favicon.png" type="image/x-icon">
  <link rel="apple-touch-icon" href="img/MSKLabs_favicon.png">

  <script src="assets/js/config.js"></script>
  <script src="assets/js/analytics.js"></script>

  <style>
    .legal-meta-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 24px;
      padding: 14px 20px;
      background: var(--bg-card, #ffffff);
      border: 1px solid var(--border-color, #cbd5e1);
      border-radius: 14px;
      font-size: 0.88rem;
      color: var(--text-muted, #64748b);
    }
    .print-btn {
      background: transparent;
      border: 1px solid var(--border-color, #cbd5e1);
      color: var(--text-main, #0f172a);
      padding: 7px 16px;
      border-radius: 8px;
      font-size: 0.84rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .print-btn:hover {
      border-color: var(--primary-color, #0284c7);
      color: var(--primary-color, #0284c7);
    }
    .legal-content h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main, #0f172a);
      margin: 36px 0 14px 0;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border-color, #f1f5f9);
    }
    .legal-content h2:first-of-type {
      margin-top: 0;
    }
    .legal-content h3 {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-main, #1e293b);
      margin: 22px 0 8px 0;
    }
    .legal-content p, .legal-content li {
      font-size: 0.95rem;
      line-height: 1.75;
      color: var(--text-main, #334155);
    }
    .legal-content ul, .legal-content ol {
      padding-left: 24px;
      margin: 12px 0 20px 0;
    }
    .legal-content li {
      margin-bottom: 10px;
    }
    .privacy-highlight-box {
      background: rgba(2, 132, 199, 0.06);
      border-left: 4px solid var(--primary-color, #0284c7);
      padding: 18px 22px;
      border-radius: 10px;
      margin: 20px 0 32px 0;
    }
    .privacy-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0 28px 0;
      font-size: 0.9rem;
    }
    .privacy-table th, .privacy-table td {
      border: 1px solid var(--border-color, #cbd5e1);
      padding: 12px 14px;
      text-align: left;
      vertical-align: top;
      line-height: 1.5;
    }
    .privacy-table th {
      background: var(--bg-hover, #f8fafc);
      color: var(--text-main, #0f172a);
      font-weight: 700;
    }
    @media (max-width: 768px) {
      .privacy-table {
        display: block;
        overflow-x: auto;
      }
    }
    @media print {
      .site-header-sticky, .site-footer, .desktop-ad, .print-btn, .infeed-ad-container {
        display: none !important;
      }
      .layout-wrapper, .portfolio-container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .static-page-card {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
    }
  </style>
</head>
<body class="lang-tr">

<header class="site-header-sticky"></header>

<div class="layout-wrapper">

  <aside class="desktop-ad desktop-ad-left">
    <div class="ad-placeholder">Masaüstü Sol Reklam<br>(120x300)</div>
  </aside>

  <main class="portfolio-container">

    <h1 class="page-title">
      <span class="lang-tr">Gizlilik Politikası &amp; KVKK Aydınlatma Metni</span>
      <span class="lang-en">Privacy Policy &amp; Data Protection Disclosure</span>
      <span class="lang-ar">سياسة الخصوصية وبيان حماية البيانات</span>
    </h1>

    <div class="legal-meta-bar">
      <div>
        <span>📅 <strong class="lang-tr">Son Güncelleme:</strong><strong class="lang-en">Last Updated:</strong><strong class="lang-ar">آخر تحديث:</strong> 30 Ekim 2026</span>
        <span style="margin: 0 10px; opacity: 0.5;">|</span>
        <span>🔒 <strong class="lang-tr">Yasal Dayanak:</strong><strong class="lang-en">Legal Basis:</strong><strong class="lang-ar">السند القانوني:</strong> 6698 Sayılı KVKK, GDPR &amp; 5651 Sayılı Kanun</span>
      </div>
      <button type="button" onclick="window.print()" class="print-btn" aria-label="Yazdır">
        🖨️ <span class="lang-tr">PDF / Yazdır</span><span class="lang-en">Print / PDF</span><span class="lang-ar">طباعة / PDF</span>
      </button>
    </div>

    <div class="static-page-card legal-content">

      <!-- ==========================================
           TÜRKÇE TAM KURUMSAL GİZLİLİK VE KVKK METNİ
           ========================================== -->
      <div class="lang-tr">
        <div class="privacy-highlight-box">
          <strong style="color:var(--primary-color, #0284c7); font-size:1.02rem;">🛡️ Temel Mahremiyet İlkemiz — Sıfır Bilgi (Zero-Knowledge) &amp; Yerel Öncelikli (Local-First) Mimari:</strong>
          <p style="margin:8px 0 0 0; font-size:0.93rem; line-height:1.7;">MSK Labs; kullanıcı mahremiyetini ticari kaygıların ve her türlü veri madenciliğinin üzerinde tutar. Masaüstü yazılımlarımızda ve mobil uygulamalarımızda <strong>merkezi üyelik kaydı, profil çıkarma veya kişisel veri toplama kesinlikle bulunmamaktadır</strong>. Tüm yapılandırma dosyalarınız, sayaç değerleriniz ve tercihleriniz yalnızca kendi fiziksel cihazınızda yerel olarak işlenir ve saklanır.</p>
        </div>

        <h2>1. Veri Sorumlusunun Kimliği</h2>
        <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve Aydınlatma Yükümlülüğünün Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkında Tebliğ uyarınca; <code>msklabs.org</code> alan adlı internet sitesi ile Windows, macOS, Linux, Android ve iOS platformlarında yayınlanan bağımsız yazılım ürünlerinin geliştiricisi ve yöneticisi olan <strong>MSK Labs</strong> ("Kuruluş" veya "Veri Sorumlusu"), kişisel verilerinizin korunmasına en üst düzeyde hassasiyet göstermektedir.</p>

        <h2>2. Kişisel Verilerin İşlenmesindeki Temel İlkeler</h2>
        <p>MSK Labs bünyesinde veri işleme faaliyetleri, KVKK'nın 4. maddesinde düzenlenen evrensel ilkelere tam uyum içerisinde yürütülür:</p>
        <ul>
          <li><strong>Hukuka ve Dürüstlük Kurallarına Uygunluk:</strong> Veri minimizasyonu katı bir mühendislik standardı olarak uygulanır; sadece sistemin çalışması için teknik olarak kaçınılmaz olan geçici veriler işlenir.</li>
          <li><strong>Doğruluk ve Gerektiğinde Güncellik:</strong> Veriler doğrudan kullanıcının kendi yerel cihazında tutulduğundan, kontrol ve güncellik münhasıran kullanıcının tasarrufundadır.</li>
          <li><strong>Belirli, Açık ve Meşru Amaçlar İçin İşlenme:</strong> Uygulamalarımızda arka planda gizli veri toplayan, kullanıcı davranışını gözetleyen veya izinsiz veri sızdıran hiçbir kod parçacığı yer almaz.</li>
          <li><strong>İşlendikleri Amaçla Bağlantılı, Sınırlı ve Ölçülü Olma:</strong> Kullanıcıyı tanımlamaya yarayan kimlik veya iletişim verileri hiçbir uygulamamız tarafından zorunlu kılınmaz.</li>
          <li><strong>İlgili Mevzuatta Öngörülen veya İşlendikleri Amaç İçin Gerekli Süre Kadar Muhafaza Edilme:</strong> Yerel veriler kullanıcının cihazında saklanır; merkezi sunucularımızda gereksiz veri arşivi tutulmaz.</li>
        </ul>

        <h2>3. İşlenen Kişisel Veri Kategorileri ve Toplama Yöntemleri</h2>
        <p>MSK Labs ekosisteminde işlenen veriler nitelikleri ve toplama kanalları itibarıyla aşağıda ayrıntılı olarak gruplandırılmıştır:</p>

        <h3>A) Kimlik ve İletişim Verileri (Yalnızca İsteğe Bağlı)</h3>
        <p>Masaüstü ve mobil uygulamalarımızın hiçbirinde kimlik (Ad, Soyad, TC Kimlik No) veya iletişim (Telefon, Adres) bilgisi talep edilmez ve toplanmaz. Yalnızca web sitemiz üzerindeki Destek Masası (<code>destek.html</code>), resmi e-posta kanallarımız (<code>destek@msklabs.org</code>) veya e-bülten kayıt formu aracılığıyla Kullanıcı'nın <strong>kendi açık rızası ve iradesiyle</strong> ilettiği ad, soyad ve e-posta adresi bilgileri; yalnızca teknik destek talebinin sonuçlandırılması veya bülten gönderimi amacıyla işlenir.</p>

        <h3>B) İşlem ve Ağ Güvenliği Verileri (Web Ziyaretleri)</h3>
        <p><code>msklabs.org</code> web sitesine erişim sağlandığında; 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi Hakkında Kanun kapsamındaki yasal yükümlülüklerimiz ve sunucu altyapımızı siber saldırılardan (DDoS, brute-force vb.) koruma meşru menfaatimiz gereğince, barındırma sağlayıcımız (Cloudflare) ve sunucu yazılımlarımız tarafından geçici teknik bağlantı logları tutulur. Bu loglar; anonimleştirilmiş IP adresi, istek yapılan tarih ve saat damgası, erişilen sayfa yolu ve tarayıcı kullanıcı arayüzü bilgisini (User-Agent) içerir; kişisel kimliklerle eşleştirilmez.</p>

        <h3>C) Cihaz Donanımı, Sensörler ve İzin Şeffaflığı Matrisi</h3>
        <p><strong>ÖNEMLİ VE TAVİZSİZ TAAHHÜT: HİÇBİR MSK LABS UYGULAMASINDA KAMERA VE MİKROFON İZNİ İSTENMEZ, KULLANILMAZ VE ÇALIŞTIRILMAZ.</strong></p>
        <p>Uygulamalarımızın düzgün çalışabilmesi için işletim sistemi düzeyinde ihtiyaç duyulan teknik donanım izinleri ve bu izinlerin işlenme amacı aşağıdaki tabloda şeffafça açıklanmıştır:</p>

        <table class="privacy-table">
          <thead>
            <tr>
              <th>Uygulama Adı</th>
              <th>Talep Edilen Donanım / İzin</th>
              <th>Teknik İşleme Amacı &amp; Güvenlik Taahhüdü</th>
              <th>Depolama Konumu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>RekatSay</strong> (Mobil)</td>
              <td>Mesafe / Yakınlık Sensörü (Proximity Sensor)</td>
              <td>Namaz esnasında secdeye varış hareketini fiziksel mesafeden tespit ederek rekat ve secde sayısını hesaplar. <strong>Kamera veya optik görüntü kesinlikle kullanılmaz.</strong></td>
              <td>Cihazın Geçici Belleği (RAM) — Uygulama kapandığında anında sıfırlanır.</td>
            </tr>
            <tr>
              <td><strong>HaydiNamaza &amp; En Yakın</strong> (Mobil / Web)</td>
              <td>Konum Servisleri (GPS / Ağ Tabanlı Konum)</td>
              <td>Güneşin coğrafi açısına göre namaz vakitlerini, pusula ile kıble açısını hesaplamak ve yakındaki ibadet noktalarını listelemek için anlık kullanılır. Konum koordinatları <strong>asla sunucularımıza iletilmez veya kaydedilmez</strong>.</td>
              <td>Kullanıcı Donanımı (Cihaz içi anlık matematiksel hesaplama)</td>
            </tr>
            <tr>
              <td><strong>Date Counter &amp; DeskPilot Pro</strong> (Masaüstü)</td>
              <td>Yerel Disk Erişim İzni</td>
              <td>Kullanıcının tanımladığı geri sayım hedeflerini, emeklilik tarihlerini, görev çubuğu kısayollarını ve arayüz yapılandırmasını saklar.</td>
              <td>Kullanıcının Yerel Sabit Diski (<code>settings.json</code> / <code>AppData</code>)</td>
            </tr>
            <tr>
              <td><strong>GC Pil Uyarı</strong> (Masaüstü)</td>
              <td>İşletim Sistemi Donanım Pil Durumu API'si</td>
              <td>Dizüstü bilgisayarın pil sağlığını korumak amacıyla kritik şarj eşiklerinde kullanıcıyı masaüstü bildirimiyle uyarmak için pil yüzdesini dinler.</td>
              <td>Yerel İşletim Sistemi Oturumu</td>
            </tr>
            <tr>
              <td><strong>DocuEdit, Notes &amp; PDFLayout</strong> (Masaüstü / Web)</td>
              <td>Kullanıcı Dosyası Seçimi (File Picker)</td>
              <td>Kullanıcının kendi seçtiği metin veya PDF belgelerini yerel olarak işler, dönüştürür ve kaydeder. Belgeler hiçbir uzak sunucuya yüklenmez.</td>
              <td>Kullanıcının Belirlediği Yerel Dizin</td>
            </tr>
          </tbody>
        </table>

        <h2>4. Kişisel Verilerin İşlenme Amaçları ve Hukuki Sebepleri</h2>
        <p>Kişisel verileriniz, 6698 sayılı KVKK’nın 5. maddesinde belirtilen aşağıdaki hukuki sebepler doğrultusunda işlenmektedir:</p>
        <ul>
          <li><strong>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (KVKK m. 5/2-c):</strong> Destek formları veya e-posta aracılığıyla iletilen teknik yardım taleplerinin ve biletlerin çözüme kavuşturulması,</li>
          <li><strong>Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi (KVKK m. 5/2-ç):</strong> 5651 sayılı Kanun ve ilgili mevzuat uyarınca sistem erişim loglarının mevzuatta öngörülen süre boyunca saklanması,</li>
          <li><strong>Veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması (KVKK m. 5/2-f):</strong> Web sitemizin ve API altyapımızın siber güvenliğinin sağlanması, sistem performansının optimize edilmesi, kötü niyetli istismarların ve hizmet aksatma saldırılarının engellenmesi,</li>
          <li><strong>Açık Rıza (KVKK m. 5/1):</strong> İsteğe bağlı olarak bülten aboneliği formunu dolduran kullanıcılara yeni sürüm duyurularının iletilmesi (Kullanıcı dilediği an rızasını geri alabilir).</li>
        </ul>

        <h2>5. Çerez (Cookie) Politikası ve Üçüncü Taraf Reklam Servisleri</h2>
        <p><code>msklabs.org</code> web sitesinde kullanıcı deneyimini iyileştirmek ve güvenliği sağlamak amacıyla sınırlı kapsamda çerezler kullanılmaktadır:</p>
        <ul>
          <li><strong>Zorunlu ve Tercih Çerezleri:</strong> Tarayıcınızın yerel depolama alanında (<code>localStorage</code>) saklanan gece/gündüz tema tercihi (<code>user_theme</code>), seçili arayüz dili (<code>user_lang</code>) ve çerez onay tercihini hatırlar. Bu veriler üçüncü şahıslarla paylaşılmaz.</li>
          <li><strong>Google AdSense ve AdMob Reklam Çerezleri:</strong> Bağımsız yazılım geliştirme ve ücretsiz yayın faaliyetlerimizi sürdürebilmek amacıyla sitemizde ve uygulamalarımızda Google reklamları yayınlanabilir. Google, web sitemizi ve internetteki diğer siteleri geçmiş ziyaretlerinize dayanarak size uygun reklamlar sunmak amacıyla çerezlerden (DoubleClick çerezi vb.) ve reklam kimliklerinden faydalanır.</li>
          <li><strong>Çerezleri Yönetme ve Devre Dışı Bırakma:</strong> Kullanıcılar, <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style="color:var(--primary-color, #0284c7); text-decoration:underline;">Google Reklam Ayarları</a> adresinden kişiselleştirilmiş reklamları kapatabilir veya <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style="color:var(--primary-color, #0284c7); text-decoration:underline;">aboutads.info</a> üzerinden üçüncü taraf reklam çerezlerini reddedebilirler. Ayrıca tarayıcınızın ayarlarından tüm çerezleri dilediğiniz an temizleyebilirsiniz.</li>
        </ul>

        <h2>6. Kişisel Verilerin Aktarılması (Yurtiçi ve Yurtdışı)</h2>
        <p>MSK Labs, kullanıcılarına ait kişisel verileri hiçbir koşulda ticari kazanç amacıyla üçüncü şahıslara satmaz, kiralamaz veya profil oluşturma amacıyla pazarlama şirketlerine aktarmaz. Veriler yalnızca aşağıdaki istisnai durumlarda ve sınırlı olarak aktarılabilir:</p>
        <ul>
          <li><strong>Yetkili Kamu Kurum ve Kuruluşları:</strong> Mahkemeler, savcılıklar, kolluk kuvvetleri ve yasal olarak bilgi talep etmeye yetkili idari mercilerin usulüne uygun talepleri doğrultusunda yasal zorunlulukların yerine getirilmesi amacıyla,</li>
          <li><strong>Teknik Hizmet Sağlayıcılar:</strong> Web sitemizin küresel düzeyde yüksek performanslı ve DDoS korumalı yayınlanmasını sağlayan içerik dağıtım ağı (Cloudflare) ve resmi kurumsal e-posta iletim altyapımız kapsamında teknik zorunlulukla sınırlı olarak.</li>
        </ul>

        <h2>7. Veri Güvenliğine İlişkin Alınan İdari ve Teknik Tedbirler</h2>
        <p>MSK Labs, kişisel verilerin hukuka aykırı olarak işlenmesini ve erişilmesini önlemek amacıyla gerekli tüm teknik ve idari güvenlik tedbirlerini uygulamaktadır:</p>
        <ul>
          <li>Web sitemiz ve tüm API iletişimlerimiz güncel <strong>TLS 1.3 şifreleme protokolü</strong> ve HTTPS zorunluluğu ile korunmaktadır.</li>
          <li>API uç noktalarımızda CORS kısıtlamaları, CSRF doğrulamaları ve otomatik rate-limiting (istek sınırlandırma) mekanizmaları etkindir.</li>
          <li>Uygulamalarımız yerel öncelikli (local-first) mimariyle tasarlandığından, merkezi sunucularda kullanıcı veritabanı bulunmaz; bu sayede toplu veri sızıntısı veya veritabanı çalınması riski teknik olarak ortadan kaldırılmıştır.</li>
        </ul>

        <h2>8. Kişisel Verilerin Saklanma Süresi ve İmhası</h2>
        <p>Masaüstü ve mobil uygulamalarımızdaki yerel veriler tamamen kullanıcının cihazında saklandığından, kullanıcının uygulamayı cihazından kaldırması veya uygulama verilerini temizlemesiyle anında ve kalıcı olarak imha edilir. Destek masası üzerinden gelen taleplere ilişkin yazışmalar ise teknik çözümün tamamlanmasının ardından Türk Borçlar Kanunu ve Türk Ticaret Kanunu'ndaki yasal zamanaşımı sürelerinin dolmasıyla birlikte güvenli şekilde silinir veya anonim hale getirilir.</p>

        <h2>9. 6698 Sayılı KVKK Kapsamındaki Haklarınız (Madde 11)</h2>
        <p>KVKK'nın 11. maddesi uyarınca veri sahibi olarak MSK Labs'e başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>
        <ol>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
          <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
          <li>Kişisel verilerin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
          <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme,</li>
          <li>Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
          <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme,</li>
          <li>Düzeltme, silme ve yok edilme işlemlerinin, kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,</li>
          <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li>
          <li>Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
        </ol>

        <h2>10. Başvuru Usulü ve İrtibat Kanalları</h2>
        <p>Yukarıda belirtilen haklarınızı kullanmak için, <em>Veri Sorumlusuna Başvuru Usul ve Esasları Hakkında Tebliğ</em> hükümlerine uygun olarak kimliğinizi tevsik edici belgeler ile birlikte talebinizi aşağıdaki kurumsal başvuru kanalımıza iletebilirsiniz:</p>
        <p>
          🔒 <strong>KVKK &amp; Veri Koruma Masası:</strong> <a href="mailto:kvkk@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">kvkk@msklabs.org</a><br>
          ✉️ <strong>Genel Destek E-Postası:</strong> <a href="mailto:destek@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">destek@msklabs.org</a><br>
          🌐 <strong>Web Adresi:</strong> <a href="https://msklabs.org" target="_blank" rel="noopener noreferrer" style="color:var(--primary-color, #0284c7); font-weight:600;">https://msklabs.org</a>
        </p>
        <p>Başvurularınız, talebin niteliğine göre en kısa sürede ve <strong>en geç 30 (otuz) gün içinde</strong> ücretsiz olarak sonuçlandırılacaktır. Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) kapsamındaki kullanıcılarımız da aynı kanallar üzerinden veri silme (unutulma) ve taşınabilirlik taleplerini yöneltebilirler.</p>
      </div>

      <!-- ==========================================
           İNGİLİZCE TAM KURUMSAL GİZLİLİK VE GDPR METNİ
           ========================================== -->
      <div class="lang-en">
        <div class="privacy-highlight-box">
          <strong style="color:var(--primary-color, #0284c7); font-size:1.02rem;">🛡️ Core Privacy Commitment — Zero-Knowledge &amp; Local-First Architecture:</strong>
          <p style="margin:8px 0 0 0; font-size:0.93rem; line-height:1.7;">MSK Labs puts privacy above monetization. Across our desktop software and mobile applications, we enforce <strong>no mandatory account registrations, no centralized tracking, and zero server-side telemetry</strong>. Your configuration files, counter records, and preferences remain strictly confined to your physical hardware.</p>
        </div>

        <h2>1. Identity of the Data Controller</h2>
        <p>Pursuant to Turkish Personal Data Protection Law No. 6698 ("KVKK") and the EU General Data Protection Regulation ("GDPR"), <strong>MSK Labs</strong> ("Organization", "we", "us") serves as the Data Controller for the website <code>msklabs.org</code> and our software ecosystem spanning Windows, macOS, Linux, Android, and iOS.</p>

        <h2>2. Data Processing Principles</h2>
        <p>Our operations comply with internationally recognized data protection principles: Lawfulness, fairness, and transparency; Purpose limitation; Data minimization; Accuracy; Storage limitation; and Integrity &amp; confidentiality. We never deploy background snooping or covert profiling mechanisms.</p>

        <h2>3. Data Categories &amp; Hardware Permission Transparency</h2>
        <p><strong>CRITICAL MANDATE: NONE OF OUR APPLICATIONS REQUEST, EXECUTE, OR UTILIZE CAMERA OR MICROPHONE ACCESS.</strong></p>
        <ul>
          <li><strong>Identity &amp; Contact Details:</strong> We collect zero identity data for application usage. Only when you voluntarily contact our support desk (<code>destek@msklabs.org</code>) or subscribe to our release bulletin do we process your provided name and email address strictly to resolve your ticket.</li>
          <li><strong>Network Security Logs:</strong> Our hosting infrastructure (Cloudflare) records temporary technical logs (anonymized IP, timestamp, user agent) to defend against DDoS attacks and brute-force threats.</li>
          <li><strong>Hardware &amp; Sensor Processing Matrix:</strong>
            <ul>
              <li><strong>RekatSay:</strong> Uses the device proximity sensor strictly in temporary RAM to detect prostration counts during prayers. No camera, no optical recording.</li>
              <li><strong>HaydiNamaza &amp; En Yakın:</strong> Uses device GPS locally to compute astronomical prayer times and compass Qibla alignment. Coordinates are never transmitted to our servers.</li>
              <li><strong>Desktop Apps (DeskPilot, Date Counter):</strong> All preferences and countdown data reside on your local disk (<code>settings.json</code> / <code>AppData</code>).</li>
            </ul>
          </li>
        </ul>

        <h2>4. Legal Grounds for Processing</h2>
        <p>We process data under KVKK Article 5 and GDPR Article 6: Performance of a contract (support tickets); Compliance with legal obligations (statutory web server logs); Legitimate interests (cybersecurity and platform defense); and Explicit consent (optional newsletter subscription).</p>

        <h2>5. Cookies &amp; Third-Party Advertising</h2>
        <p>We store purely functional preferences (theme and language) via browser <code>localStorage</code>. To maintain free software operations, verified Google AdSense and Google AdMob ad networks may serve contextual ads. You may manage or opt out of ad personalization anytime via <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style="color:var(--primary-color, #0284c7); text-decoration:underline;">Google Ad Settings</a> or <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style="color:var(--primary-color, #0284c7); text-decoration:underline;">aboutads.info</a>.</p>

        <h2>6. Data Security &amp; Retention</h2>
        <p>All web communications are encrypted via modern TLS 1.3. Because our apps adopt a local-first architecture without centralized cloud databases, collective data leakage risks are architecturally non-existent. Support ticket correspondence is securely pruned upon statutory limitation expirations.</p>

        <h2>7. Data Subject Rights (KVKK &amp; GDPR)</h2>
        <p>You have the right to access, rectify, delete, restrict, or port your personal data, and to object to automated processing. For inquiries or data deletion requests, contact our designated privacy desk:</p>
        <p>
          🔒 <strong>Privacy Desk:</strong> <a href="mailto:kvkk@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">kvkk@msklabs.org</a><br>
          ✉️ <strong>General Support:</strong> <a href="mailto:destek@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">destek@msklabs.org</a>
        </p>
        <p>Requests will be processed free of charge within a maximum of 30 days.</p>
      </div>

      <!-- ==========================================
           ARAPÇA TAM KURUMSAL GİZLİLİK VE VERİ KORUMA METNİ
           ========================================== -->
      <div class="lang-ar">
        <div class="privacy-highlight-box">
          <strong style="color:var(--primary-color, #0284c7); font-size:1.02rem;">🛡️ مبدأ الخصوصية الأساسي — بنية المعرفة الصفرية والأولوية المحلية:</strong>
          <p style="margin:8px 0 0 0; font-size:0.93rem; line-height:1.7;">تضع MSK Labs خصوصية المستخدم فوق كل اعتبار تجاري. في برمجياتنا المكتبية وتطبيقات الهواتف المحمولة، <strong>لا يوجد أي تسجيل دخول إلزامي، ولا تتبع مركزي، ولا جمع لبياناتك الشخصية على خوادمنا</strong>. يتم حفظ ومعالجة جميع إعداداتك وسجلاتك محلياً فقط على جهازك المادي الخاص.</p>
        </div>

        <h2>1. هوية المسؤول عن البيانات</h2>
        <p>وفقاً لقانون حماية البيانات الشخصية التركي رقم 6698 ولائحة حماية البيانات العامة للاتحاد الأوروبي (GDPR)، تعد <strong>MSK Labs</strong> هي الجهة المسؤولة عن معالجة البيانات لموقع <code>msklabs.org</code> ومنظومة التطبيقات التابعة لها لأنظمة Windows وmacOS وLinux وAndroid وiOS.</p>

        <h2>2. فئات البيانات والشفافية في استخدام المستشعرات</h2>
        <p><strong>تعهد قطعي وهام: لا يطلب أي تطبيق من تطبيقاتنا ولا يستخدم ولا يقوم بتشغيل إذن الكاميرا أو الميكروفون على الإطلاق.</strong></p>
        <ul>
          <li><strong>بيانات الهوية والاتصال:</strong> لا نجمع أي بيانات هوية لاستخدام التطبيقات. فقط عند مراسلتنا اختيارياً عبر مكتب الدعم الفني (<code>destek@msklabs.org</code>) تتم معالجة الاسم والبريد الإلكتروني للرد على تذكرتك.</li>
          <li><strong>سجلات أمان الشبكة:</strong> تسجل خوادمنا (عبر Cloudflare) سجلات اتصال فنية مؤقتة لحماية الموقع من الهجمات الإلكترونية.</li>
          <li><strong>مصفوفة أذونات الأجهزة:</strong>
            <ul>
              <li><strong>RekatSay:</strong> يستخدم مستشعر القرب فقط في الذاكرة المؤقتة (RAM) لاحتساب السجدات دون تشغيل أي كاميرا أو تسجيل بصري.</li>
              <li><strong>HaydiNamaza و En Yakın:</strong> يستخدم مستشعر الموقع الجغرافي محلياً لحساب أوقات الصلاة واتجاه القبلة، ولا يتم إرسال الإحداثيات لخوادمنا أبداً.</li>
              <li><strong>التطبيقات المكتبية:</strong> تُخزن الإعدادات وسجلات العدادات بالكامل على القرص الصلب المحلي للمستخدم.</li>
            </ul>
          </li>
        </ul>

        <h2>3. ملفات تعريف الارتباط والإعلانات</h2>
        <p>نستخدم التخزين المحلي للمتصفح لحفظ تفضيلات المظهر واللغة فقط. قد تُعرض إعلانات Google AdSense وAdMob المعتمدة لدعم استمرارية التطبيقات المجانية، ويمكنك إدارة تفضيلات الإعلانات أو إلغاء الاشتراك عبر إعدادات إعلانات Google في أي وقت.</p>

        <h2>4. حقوق المستخدم والتواصل</h2>
        <p>يحق لك الوصول إلى بياناتك، وتصحيحها، أو طلب حذفها بالكامل من خلال التواصل مع مكتب الخصوصية لدينا:</p>
        <p>
          🔒 <strong>مكتب الخصوصية وحماية البيانات:</strong> <a href="mailto:kvkk@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">kvkk@msklabs.org</a><br>
          ✉️ <strong>الدعم الفني العام:</strong> <a href="mailto:destek@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">destek@msklabs.org</a>
        </p>
        <p>تتم معالجة جميع الطلبات مجاناً خلال مدة أقصاها 30 يوماً وفقاً للأصول القانونية.</p>
      </div>

    </div>

    <!-- SAYFA ALTI REKLAM ALANI -->
    <div class="infeed-ad-container">
      <div class="ad-placeholder">Sayfa Sonu Reklamı (Bottom Banner)</div>
    </div>

  </main>

  <aside class="desktop-ad desktop-ad-right">
    <div class="ad-placeholder">Masaüstü Sağ Reklam<br>(120x300)</div>
  </aside>

</div>

<footer class="site-footer"></footer>
<script src="assets/js/layout.js"></script>
</body>
</html>
'''

with open(path, 'w', encoding='utf-8') as f:
    f.write(privacy_html.strip())

print(f'Successfully wrote privacy.html ({len(privacy_html)} chars, {len(privacy_html.splitlines())} lines)')
