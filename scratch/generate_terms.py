import os

path = r'd:\Code\mskaymaz\webMSKLabs\terms.html'

terms_html = '''<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kullanım Şartları ve Hizmet Sözleşmesi | MSK Labs</title>
  <meta name="description" content="MSK Labs web sitesi, masaüstü yazılımları ve mobil uygulamaları için Genel Kullanım Şartları, Lisans İlkeleri ve Hizmet Sözleşmesi.">
  <script>!function(){var t=localStorage.getItem("user_theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");"dark"===t&&document.documentElement.setAttribute("data-theme","dark")}()</script>
  <link rel="canonical" href="https://msklabs.org/terms.html">
  <meta property="og:title" content="Kullanım Şartları ve Hizmet Sözleşmesi | MSK Labs">
  <meta property="og:description" content="MSK Labs web sitesi, masaüstü yazılımları ve mobil uygulamaları için Genel Kullanım Şartları, Lisans İlkeleri ve Hizmet Sözleşmesi.">
  <meta property="og:url" content="https://msklabs.org/terms.html">
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
      margin: 20px 0 8px 0;
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
    .legal-highlight-box {
      background: rgba(2, 132, 199, 0.06);
      border-left: 4px solid var(--primary-color, #0284c7);
      padding: 18px 22px;
      border-radius: 10px;
      margin: 20px 0 32px 0;
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
      <span class="lang-tr">Kullanım Şartları ve Hizmet Sözleşmesi</span>
      <span class="lang-en">Terms of Service &amp; User Agreement</span>
      <span class="lang-ar">شروط الخدمة واتفاقية الاستخدام</span>
    </h1>

    <div class="legal-meta-bar">
      <div>
        <span>📅 <strong class="lang-tr">Yürürlük Tarihi:</strong><strong class="lang-en">Effective Date:</strong><strong class="lang-ar">تاريخ السريان:</strong> 30 Ekim 2026</span>
        <span style="margin: 0 10px; opacity: 0.5;">|</span>
        <span>🌐 <strong class="lang-tr">Kapsam:</strong><strong class="lang-en">Scope:</strong><strong class="lang-ar">النطاق:</strong> Web Servisleri, Masaüstü (Windows/macOS/Linux) &amp; Mobil (Android/iOS) Ekosistemi</span>
      </div>
      <button type="button" onclick="window.print()" class="print-btn" aria-label="Yazdır">
        🖨️ <span class="lang-tr">PDF / Yazdır</span><span class="lang-en">Print / PDF</span><span class="lang-ar">طباعة / PDF</span>
      </button>
    </div>

    <div class="static-page-card legal-content">

      <!-- ==========================================
           TÜRKÇE TAM KURUMSAL SÖZLEŞME METNİ
           ========================================== -->
      <div class="lang-tr">
        <div class="legal-highlight-box">
          <strong style="color:var(--primary-color, #0284c7); font-size:1.02rem;">Önemli Başlangıç Bildirimi ve Taahhüdümüz:</strong>
          <p style="margin:8px 0 0 0; font-size:0.93rem; line-height:1.7;">İşbu Kullanım Şartları ve Hizmet Sözleşmesi; MSK Labs tarafından sunulan <code>msklabs.org</code> web sitesi, masaüstü araçları ve mobil uygulamalar için geçerli genel çerçeve sözleşmedir. MSK Labs yazılımları <strong>merkezi kullanıcı hesabı açmayı zorunlu kılmaz</strong>; tüm araçlarımız <em>"Veriniz tamamen sizindir"</em> ilkesiyle <strong>yerel öncelikli (local-first)</strong> olarak kendi donanımınızda çalışır ve kişisel verilerinizi merkezi sunucularda toplamaz.</p>
        </div>

        <h2>Madde 1 — Taraflar, Tanımlar ve Sözleşmenin Kapsamı</h2>
        <p>İşbu Kullanım Şartları ve Hizmet Sözleşmesi ("Sözleşme"); bir tarafta <code>msklabs.org</code> alan adını ve bağlı tüm dijital mecraları yöneten bağımsız yazılım ve teknoloji kuruluşu <strong>MSK Labs</strong> ("Geliştirici" veya "Kuruluş") ile diğer tarafta MSK Labs web sitesini ziyaret eden, servislerinden faydalanan veya MSK Labs tarafından geliştirilen herhangi bir masaüstü ya da mobil uygulamayı indiren, kuran veya çalıştıran gerçek ya da tüzel kişi ("Kullanıcı") arasında akdedilmiştir.</p>
        <p>İşbu Sözleşme kapsamında yer alan temel tanımlar şunlardır:</p>
        <ul>
          <li><strong>Web Servisleri:</strong> <code>msklabs.org</code> alan adı ve bağlı tüm alt alan adları, blog platformu, vitrin, dokümantasyon sayfaları, destek masası ve e-bülten servislerini,</li>
          <li><strong>Masaüstü Yazılımları:</strong> MSK Labs tarafından Windows, macOS veya Linux işletim sistemleri için derlenmiş DeskPilot Pro, Date Counter, DocuEdit, GC Pil Uyarı, Notes, PDFLayout ve yayınlanan tüm masaüstü araçlarını,</li>
          <li><strong>Mobil Uygulamalar:</strong> Google Play Store, Apple App Store veya doğrudan APK/kurulum paketleri vasıtasıyla sunulan HaydiNamaza, RekatSay, En Yakın ve bağlı mobil çözümleri,</li>
          <li><strong>Yerel Veri (Local Data):</strong> Kullanıcının cihazında üretilen, saklanan, hiçbir koşulda MSK Labs sunucularına aktarılmayan ayar dosyaları, SQLite/JSON veri tabanları, sayaç değerleri ve kullanıcı tercihlerini ifade eder.</li>
        </ul>

        <h2>Madde 2 — Sözleşmenin Akdi, Elektronik Onay ve Hukuki Bağlayıcılık</h2>
        <p>Kullanıcı; web sitesine giriş yaptığı, herhangi bir MSK Labs uygulamasını cihazına indirdiği, yüklediği veya çalıştırdığı andan itibaren işbu Sözleşme hükümlerini, ayrılmaz bir parçası olan Gizlilik Politikası ve KVKK Aydınlatma Metni ile birlikte gayrikabili rücu kabul etmiş, onaylamış ve bağlayıcılığını taahhüt etmiş sayılır.</p>
        <p>Bu Sözleşme'de yer alan şartlardan herhangi birini kabul etmeyen veya yerine getiremeyeceğini düşünen Kullanıcı'nın, web sitesini ziyaret etmeyi derhal sonlandırması ve cihazındaki tüm MSK Labs yazılımlarını kaldırması gerekmektedir. Kullanıcı, elektronik ortamda gerçekleştirdiği bu kabul beyanının yazılı onay ile eşdeğer hukuki geçerliliğe sahip olduğunu peşinen kabul eder.</p>
        <p>Kullanıcı'nın sözleşme yapma ehliyetine haiz olması esastır. 18 yaşını doldurmamış veya yasal olarak kısıtlı kişilerin web sitesini veya uygulamaları kullanması veli veya yasal vasilerinin onayına ve sorumluluğuna tabidir.</p>

        <h2>Madde 3 — Hizmet Modeli ve Yerel Öncelikli (Local-First) Mimari İlkesi</h2>
        <p>MSK Labs; kullanıcıların günlük yaşamlarını, ibadetlerini, zaman yönetimlerini, doküman işleme süreçlerini ve donanım izleme ihtiyaçlarını kolaylaştıran, minimalist ve odaklı yazılımlar üretir. Sistem mimarimizin ana prensipleri şunlardır:</p>
        <ul>
          <li><strong>Veri Sahipliği ve Sıfır Bilgi (Zero-Knowledge):</strong> MSK Labs prensip olarak kullanıcı hesabı oluşturulmasını zorunlu kılmaz. Verileriniz, ayarlarınız, geri sayım kayıtlarınız veya namaz vaktine ilişkin tercihleriniz merkezi bulut sunucularımızda depolanmaz; yalnızca kendi fiziksel cihazınızın yerel hafızasında tutulur.</li>
          <li><strong>Yedekleme ve Taşıma Sorumluluğu:</strong> Yerel verilerin cihazlar arasında taşınması, harici sürücülere yedeklenmesi veya cihaz formatlama/sıfırlama süreçlerinde korunması münhasıran Kullanıcı'nın sorumluluğundadır. Donanım arızası, işletim sistemi çökmesi veya uygulama silinmesi neticesinde yerel verilerin kaybolmasından dolayı MSK Labs'in veri kurtarma yükümlülüğü ve sorumluluğu bulunmamaktadır.</li>
        </ul>

        <h2>Madde 4 — Lisansın Niteliği ve Fikri Mülkiyet Hakları</h2>
        <p>MSK Labs, işbu Sözleşme koşullarına uyulması kaydıyla Kullanıcı'ya; yazılımları şahsi veya kurum içi meşru amaçlarla kullanması için münhasır olmayan, devredilemez, alt lisans verilemez ve geri alınabilir sınırlı bir kullanım lisansı tanır.</p>
        <p>Web sitesinde ve uygulamalarda yer alan tüm kaynak kodları, derlenmiş ikili dosyalar (binaries), algoritmalar, arayüz tasarımları, grafikler, metinler, logolar, ikonlar, tescilli markalar ve alan adları; 5846 sayılı Fikir ve Sanat Eserleri Kanunu, 6769 sayılı Sınai Mülkiyet Kanunu ve ilgili uluslararası telif mevzuatı kapsamında münhasıran MSK Labs'e aittir.</p>
        <p>Uygulamalarımızda kullanılan açık kaynak kodlu üçüncü taraf kütüphaneler (MIT, Apache 2.0, BSD vb.) kendi orijinal lisans şartlarına tabidir ve MSK Labs bu kütüphanelerin telif hak sahiplerinin haklarını teslim eder. Açık kaynak bileşenler haricindeki platformun özgün yazılım mimarisi, hiçbir şekilde izin alınmaksızın kopyalanamaz, çoğaltılamaz veya türev çalışmalarda kullanılamaz.</p>

        <h2>Madde 5 — Kullanım Koşulları ve Yasaklanan Fiiller</h2>
        <p>Kullanıcı, MSK Labs web sitesini ve uygulamalarını yürürlükteki mevzuata, kamu düzenine, dürüstlük ve ahlak kurallarına uygun olarak kullanacağını taahhüt eder. Aşağıdaki fiillerin gerçekleştirilmesi kesinlikle yasaktır ve doğrudan sözleşmenin feshi ile hukuki/cezai işlem sebebidir:</p>
        <ol>
          <li><strong>Tersine Mühendislik ve Kaynak Koda Müdahale:</strong> Yazılımların kaynak kodlarını derleme çözme (decompilation), tersine mühendislik (reverse engineering), ayrıştırma (disassembly) işlemlerine tabi tutmak; şifreleme veya güvenlik kontrollerini devre dışı bırakmak veya yazılımların işleyişini tahrif etmek,</li>
          <li><strong>Otomasyon ve Altyapı Güvenliği İhlalleri:</strong> Web sitesi veya API servisleri üzerinde bot, crawler, spider, scraper gibi otomatik veri çekme araçları çalıştırmak; sistem kaynaklarını aşırı tüketerek servis dışı bırakma (DoS/DDoS) teşebbüslerinde bulunmak,</li>
          <li><strong>İzinsiz Ticari Dağıtım:</strong> Ücretsiz veya lisanslı sunulan yazılımları üçüncü şahıslara ücret karşılığı satmak, kiralamak, açık artırmaya çıkarmak veya ticari bir ürün paketinin parçası haline getirmek (bundling),</li>
          <li><strong>Fikri Mülkiyet İhlali:</strong> Yazılımlarda veya sitede yer alan telif bildirimlerini, lisans dosyalarını, marka işaretlerini, filigranları veya kurumsal künye bilgilerini silmek, gizlemek veya değiştirmek,</li>
          <li><strong>Zararlı Kod Enjeksiyonu:</strong> Uygulamaları virüs, truva atı (trojan), casus yazılım (spyware) veya benzeri kötü niyetli kodlarla modifiye ederek üçüncü şahıslara dağıtmak veya bu yolla veri hırsızlığına zemin hazırlamak,</li>
          <li><strong>Hukuka Aykırı Faaliyet:</strong> Sistemleri herhangi bir suç unsuru teşkil eden, üçüncü şahısların kişilik haklarını ihlal eden veya ulusal/uluslararası yaptırımlara aykırı eylemlerde araç olarak kullanmak.</li>
        </ol>

        <h2>Madde 6 — Garanti Reddi ve Sorumluluk Sınırları (As-Is İlkesi)</h2>
        <p>MSK Labs yazılımları, mobil uygulamaları ve web servisleri; <em>"olduğu gibi"</em> (as-is) ve <em>"mevcut haliyle"</em> (as-available) sunulmaktadır. Geliştirici, yasaların izin verdiği azami ölçüde; yazılımların kesintisiz, hatasız, virüssüz, zamanında veya kullanıcının özel donanım ve işletim sistemi ortamında kusursuz çalışacağına dair zımni veya sarih hiçbir ticari elverişlilik veya amaca uygunluk garantisi vermez.</p>
        <ul>
          <li><strong>Donanımsal ve Sensör Bağımlılığı:</strong> HaydiNamaza, RekatSay ve GC Pil Uyarı gibi uygulamalarımız; cihazınızın fiziksel donanım sensörleri (GPS alıcısı, manyetik pusula sensörü, yakınlık / proximity sensörü ve işletim sistemi pil API'leri) üzerinden gelen verileri yerel matematiksel algoritmalarla işler. Donanımsal kalibrasyon eksiklikleri, manyetik alan sapmaları, metal kılıf etkileri veya işletim sistemi kısıtlamalarından kaynaklanabilecek namaz vakti sapması, kıble yönü farklılığı veya rekat algılama gecikmelerinden dolayı MSK Labs'e hiçbir maddi veya manevi sorumluluk yüklenemez.</li>
          <li><strong>Kritik Operasyon Yasağı:</strong> Yazılımlarımız tıbbi cihaz, cerrahi operasyon, nükleer kontrol, havacılık, hayat destek üniteleri veya yüksek riskli finansal alım-satım sistemleri gibi doğrudan can ve mal güvenliğini ilgilendiren operasyonlarda kullanılmak üzere tasarlanmamıştır. Bu tür alanlarda yazılımların tek kontrol mekanizması olarak kullanılmasından doğacak zararlardan Kullanıcı tek başına sorumludur.</li>
        </ul>

        <h2>Madde 7 — Sorumluluğun Sınırlandırılması ve Dolaylı Zararlar</h2>
        <p>Yürürlükteki hukukun izin verdiği en geniş ölçüde; MSK Labs, yöneticileri veya geliştiricileri; web sitesinin veya uygulamaların kullanımından, kullanılamamasından veya hatalı kullanımından kaynaklanan doğrudan, dolaylı, arızi, özel, cezai veya netice kabilinden doğan hiçbir zarardan (bunlarla sınırlı olmamak üzere kar kaybı, veri kaybı, iş kesintisi, donanım arızası veya üçüncü taraf tazminat talepleri dâhil) sorumlu tutulamaz.</p>

        <h2>Madde 8 — Reklam Ağları ve Üçüncü Taraf Servis Bağlantıları</h2>
        <p>Yazılımlarımızın ve web yayınlarımızın bağımsız ve ücretsiz sunumunu sürdürebilmek amacıyla web sitemizde ve mobil uygulamalarımızda doğrulanmış reklam ağları (Google AdSense ve Google AdMob) kullanılabilir. Bu reklamlar üçüncü taraf sunuculardan beslenir. Reklam içerikleri, yönlendirilen internet sayfaları ve bu sayfalarda toplanabilecek verilere ilişkin tüm süreçler ilgili reklam sağlayıcılarının kendi kullanım ve gizlilik sözleşmelerine tabidir; MSK Labs üçüncü taraf sitelerin içerik veya güvenlik standartlarını taahhüt etmez.</p>

        <h2>Madde 9 — Sözleşme Değişiklikleri ve Güncellemeler</h2>
        <p>MSK Labs; yürürlükteki kanunlarda meydana gelen değişiklikler, yeni uygulama sürümleri veya teknik zorunluluklar doğrultusunda işbu Sözleşme'de dilediği zaman tek taraflı değişiklik ve güncelleme yapma hakkını saklı tutar. Güncellenmiş Sözleşme metni, <code>msklabs.org/terms.html</code> adresinde yayınlandığı andan itibaren derhal yürürlüğe girer. Kullanıcı'nın bu değişikliklerden sonra web sitesini veya uygulamaları kullanmaya devam etmesi, güncellenmiş sözleşme şartlarını peşinen kabul ettiği anlamına gelir.</p>

        <h2>Madde 10 — Fesih ve Hizmetin Askıya Alınması</h2>
        <p>Kullanıcı; cihazındaki tüm MSK Labs uygulamalarını kalıcı olarak silmek ve web sitesini kullanmayı bırakmak suretiyle işbu Sözleşme'yi dilediği an tek taraflı olarak feshedebilir. Kullanıcı'nın işbu Sözleşme hükümlerinden herhangi birini ihlal etmesi halinde, MSK Labs önceden ihbarda bulunmaksızın kullanıcının servislere erişimini engelleme, bilet desteğini sonlandırma ve uğradığı zararların tazmini için yasal yollara başvurma hakkına sahiptir.</p>

        <h2>Madde 11 — Delil Sözleşmesi (HMK m. 193)</h2>
        <p>İşbu Sözleşme'den veya MSK Labs servislerinin kullanımından doğabilecek her türlü hukuki uyuşmazlıkta; MSK Labs'e ait sunucu erişim logları, sistem güvenlik kayıtları, e-posta yazışmaları ve elektronik veri tabanı kayıtları 6100 sayılı Hukuk Muhakemeleri Kanunu'nun 193. maddesi uyarınca taraflar arasında bağlayıcı, kesin ve münhasır delil teşkil eder.</p>

        <h2>Madde 12 — Bölünebilirlik (Kısmi Hükümsüzlük)</h2>
        <p>İşbu Sözleşme'nin herhangi bir hükmünün yetkili bir mahkeme veya idari merci tarafından geçersiz, hükümsüz veya uygulanamaz ilan edilmesi durumunda; söz konusu geçersizlik yalnızca ilgili hükümle sınırlı kalacak olup, Sözleşme'nin diğer tüm hükümleri tam olarak geçerliliğini ve yürürlüğünü korumaya devam edecektir.</p>

        <h2>Madde 13 — Uygulanacak Hukuk ve Yetkili Yargı Yeri</h2>
        <p>İşbu Sözleşme'nin akdedilmesinde, yorumlanmasında, uygulanmasında ve ortaya çıkabilecek her türlü uyuşmazlığın çözümünde münhasıran <strong>Türkiye Cumhuriyeti Hukuku</strong> uygulanır. Sözleşme'den doğabilecek ihtilaflarda <strong>İstanbul (Merkez) Mahkemeleri ve İcra Daireleri</strong> kesin yetkilidir.</p>

        <h2>Madde 14 — İletişim, Tebligat ve Yasal Bildirimler</h2>
        <p>Kullanıcı, işbu Sözleşme kapsamındaki tüm soruları, telif hakkı bildirimleri veya lisanslama talepleri için MSK Labs ile aşağıdaki resmi kurumsal iletişim kanalları üzerinden irtibat kurabilir:</p>
        <p>
          ✉️ <strong>Genel İletişim &amp; Destek:</strong> <a href="mailto:destek@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">destek@msklabs.org</a><br>
          📮 <strong>Kurumsal Yazışma:</strong> <a href="mailto:iletisim@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">iletisim@msklabs.org</a><br>
          🔒 <strong>Veri Koruma &amp; KVKK Masası:</strong> <a href="mailto:kvkk@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">kvkk@msklabs.org</a><br>
          🌐 <strong>Resmi Web Sitesi:</strong> <a href="https://msklabs.org" target="_blank" rel="noopener noreferrer" style="color:var(--primary-color, #0284c7); font-weight:600;">https://msklabs.org</a>
        </p>
      </div>

      <!-- ==========================================
           İNGİLİZCE TAM KURUMSAL SÖZLEŞME METNİ
           ========================================== -->
      <div class="lang-en">
        <div class="legal-highlight-box">
          <strong style="color:var(--primary-color, #0284c7); font-size:1.02rem;">Important Notice &amp; Core Architecture Statement:</strong>
          <p style="margin:8px 0 0 0; font-size:0.93rem; line-height:1.7;">This Terms of Service and User Agreement governs your access to <code>msklabs.org</code>, our desktop software utilities, and mobile applications. MSK Labs operates under an uncompromising <strong>local-first architecture</strong>: we <strong>do not enforce mandatory user account creation</strong>, and your personal data and configuration files are processed directly on your hardware without being uploaded to centralized servers.</p>
        </div>

        <h2>Section 1 — Parties, Definitions &amp; Scope</h2>
        <p>This Terms of Service and User Agreement ("Agreement") is entered into between <strong>MSK Labs</strong> ("Developer", "Organization", "we", "us"), an independent software initiative managing <code>msklabs.org</code>, and any natural person or legal entity downloading, installing, accessing, or utilizing our software and online services ("User", "you").</p>
        <p>Key terms used throughout this Agreement include:</p>
        <ul>
          <li><strong>Web Services:</strong> The website at <code>msklabs.org</code>, subdomains, documentation pages, blog platform, support desk, and newsletter feeds,</li>
          <li><strong>Desktop Applications:</strong> Binary distributions for Windows, macOS, and Linux including DeskPilot Pro, Date Counter, DocuEdit, GC Battery Alert, Notes, PDFLayout, and related tools,</li>
          <li><strong>Mobile Applications:</strong> HaydiNamaza, RekatSay, En Yakın, and related mobile apps delivered via official app stores or standalone packages,</li>
          <li><strong>Local Data:</strong> Settings files, SQLite/JSON databases, counter values, and preferences generated and maintained locally on the User's physical device.</li>
        </ul>

        <h2>Section 2 — Contract Formation, Electronic Consent &amp; Legal Capacity</h2>
        <p>By visiting our website or installing and executing our Applications, you unconditionally and irrevocably agree to be bound by the terms of this Agreement and our integrated Privacy Policy. If you do not agree to every clause, you must immediately uninstall all Applications and cease using our Web Services.</p>
        <p>You affirm that you have the legal capacity to enter into this Agreement under the laws of your jurisdiction. Minors must obtain consent from a parent or legal guardian.</p>

        <h2>Section 3 — Local-First Engineering &amp; Data Ownership</h2>
        <p>MSK Labs adheres to the principle of User Data Sovereignty. Our applications function without mandatory online authentication or server-side telemetry. Maintaining off-site backups, hardware migration, and disk safety remain your sole responsibility. MSK Labs bears no liability for data loss arising from operating system crashes, device wipes, or local storage malfunctions.</p>

        <h2>Section 4 — License Grant &amp; Intellectual Property Rights</h2>
        <p>Subject to compliance with this Agreement, MSK Labs grants you a personal, non-exclusive, non-transferable, non-sublicensable, revocable limited license to execute the Applications for personal or internal organizational operations.</p>
        <p>All source code, compiled binaries, algorithms, user interface layouts, logos, trademarks, and documentation are the exclusive intellectual property of MSK Labs, protected under Turkish Copyright Law No. 5846, Industrial Property Law No. 6769, and international copyright treaties. Third-party open-source libraries remain subject to their respective licenses (MIT, Apache 2.0, BSD).</p>

        <h2>Section 5 — Prohibited Conduct &amp; Restrictions</h2>
        <p>You agree not to engage in any of the following unauthorized activities:</p>
        <ol>
          <li>Decompiling, disassembling, reverse-engineering, or attempting to reconstruct the source code of our binaries,</li>
          <li>Deploying automated crawlers, scrapers, or bot networks against our website or APIs, or launching Denial of Service (DoS/DDoS) attacks,</li>
          <li>Sub-licensing, renting, leasing, reselling, or commercially bundling our software without written authorization,</li>
          <li>Removing, modifying, or obscuring copyright notices, digital watermarks, or trademark identifiers,</li>
          <li>Injecting trojans, malware, spyware, or repackaging binaries for illicit data interception,</li>
          <li>Using our services for unlawful, fraudulent, or harmful purposes infringing on the rights of third parties.</li>
        </ol>

        <h2>Section 6 — Disclaimer of Warranties (As-Is Principle)</h2>
        <p>To the maximum extent permitted by applicable law, all software tools and web services are provided on an <strong>"as-is"</strong> and <strong>"as-available"</strong> basis without warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, or uninterrupted error-free operation.</p>
        <ul>
          <li><strong>Hardware &amp; Sensor Calibration:</strong> Features such as prayer times, Qibla compass alignment, proximity count detection, and battery alerts rely on device hardware sensors (GPS, proximity, compass, battery controllers). MSK Labs assumes no responsibility for deviations caused by magnetic interference, phone cases, or sensor drift.</li>
          <li><strong>No Critical Operation Use:</strong> Our tools are not certified for medical, surgical, life-support, nuclear, or critical financial infrastructure where software failure could result in death or personal injury.</li>
        </ul>

        <h2>Section 7 — Limitation of Liability</h2>
        <p>In no event shall MSK Labs or its contributors be liable for any direct, indirect, incidental, punitive, or consequential damages (including loss of profits, data corruption, or business interruption) arising out of the use or inability to use our products.</p>

        <h2>Section 8 — Advertising Networks &amp; Third-Party Services</h2>
        <p>To support free operations, Google AdSense and Google AdMob ad units may be rendered. External advertising links lead to services governed by third-party terms over which MSK Labs exercises no control.</p>

        <h2>Section 9 — Amendments &amp; Service Termination</h2>
        <p>We reserve the right to revise this Agreement at any time. Updated versions become effective immediately upon publication at <code>msklabs.org/terms.html</code>. You may terminate this Agreement at any time by deleting the Applications.</p>

        <h2>Section 10 — Governing Law &amp; Jurisdiction</h2>
        <p>This Agreement is governed by the laws of the Republic of Turkey. The Central Courts and Enforcement Offices of Istanbul, Turkey, shall have exclusive jurisdiction over any disputes arising hereunder.</p>

        <h2>Section 11 — Official Inquiries &amp; Legal Notices</h2>
        <p>For legal notices, enterprise licensing, or technical inquiries, contact our official desk:</p>
        <p>
          ✉️ <strong>General Inquiries:</strong> <a href="mailto:destek@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">destek@msklabs.org</a><br>
          📮 <strong>Corporate Mail:</strong> <a href="mailto:iletisim@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">iletisim@msklabs.org</a><br>
          🔒 <strong>Data Privacy Desk:</strong> <a href="mailto:kvkk@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">kvkk@msklabs.org</a>
        </p>
      </div>

      <!-- ==========================================
           ARAPÇA TAM KURUMSAL SÖZLEŞME METNİ
           ========================================== -->
      <div class="lang-ar">
        <div class="legal-highlight-box">
          <strong style="color:var(--primary-color, #0284c7); font-size:1.02rem;">إشعار تمهيدي وتعهد معماري هام:</strong>
          <p style="margin:8px 0 0 0; font-size:0.93rem; line-height:1.7;">تحكم هذه الشروط واتفاقية الخدمة استخدام موقع <code>msklabs.org</code> وجميع البرمجيات المكتبية وتطبيقات الهاتف المحمول المقدمة من MSK Labs. تعمل حلولنا بموجب <strong>مبدأ الأولوية المحلية (Local-First)</strong>: <strong>لا نلزم المستخدمين بإنشاء حسابات مركزية</strong>، وتتم معالجة بياناتكم وإعداداتكم محلياً بالكامل على أجهزتكم الخاصة دون رفعها إلى خوادم مركزية.</p>
        </div>

        <h2>المادة 1 — الأطراف والتعريفات ونطاق الاتفاقية</h2>
        <p>تم إبرام اتفاقية شروط الاستخدام والخدمة هذه ("الاتفاقية") بين مبادرة <strong>MSK Labs</strong> البرمجية المستقلة ("المطور" أو "المؤسسة") من جهة، وأي شخص طبيعي أو اعتباري يقوم بزيارة الموقع أو تنزيل وتثبيت واستخدام أي من التطبيقات المكتبية أو المحمولة ("المستخدم") من جهة أخرى.</p>
        <ul>
          <li><strong>خدمات الويب:</strong> موقع <code>msklabs.org</code> والنطاقات الفرعية وبوابة التوثيق والمدونة ومكتب الدعم الفني،</li>
          <li><strong>البرامج المكتبية:</strong> البرمجيات المخصصة لأنظمة Windows وmacOS وLinux بما فيها DeskPilot Pro وDate Counter وDocuEdit وتنبيه البطارية وNotes،</li>
          <li><strong>تطبيقات الجوال:</strong> تطبيقات HaydiNamaza وRekatSay وEn Yakın الموزعة عبر المتاجر الرسمية،</li>
          <li><strong>البيانات المحلية:</strong> ملفات الإعدادات وقواعد البيانات المحلية وسجلات العدادات المحفوظة محلياً فقط على جهاز المستخدم.</li>
        </ul>

        <h2>المادة 2 — سريان الاتفاقية والموافقة الإلكترونية</h2>
        <p>بمجرد دخولك إلى الموقع الإلكتروني أو تثبيت وتشغيل أي من تطبيقات MSK Labs، فإنك توافق دون قيد أو شرط على الالتزام ببنود هذه الاتفاقية وسياسة الخصوصية المرتبطة بها. إذا كنت لا توافق على هذه الشروط، يتعين عليك التوقف فوراً عن استخدام الموقع وحذف جميع التطبيقات من جهازك.</p>

        <h2>المادة 3 — بنية الأولوية المحلية وحفظ البيانات</h2>
        <p>تؤكد MSK Labs على سيادة المستخدم التامة على بياناته. لا تتطلب تطبيقاتنا تسجيل دخول مركزي، وتقع مسؤولية النسخ الاحتياطي ونقل البيانات بين الأجهزة حصرياً على عاتق المستخدم. لا تتحمل المؤسسة أي مسؤولية عن فقدان البيانات الناتج عن إعادة تهيئة الجهاز أو تلف وحدات التخزين.</p>

        <h2>المادة 4 — ترخيص الاستخدام وحقوق الملكية الفكرية</h2>
        <p>تمنح MSK Labs المستخدم ترخيصاً محدوداً، غير حصري، غير قابل للتحويل، وقابلاً للإلغاء، لتشغيل البرمجيات للأغراض الشخصية أو الداخلية المشروعة. تظل جميع الشيفرات المصدرية، التصاميم، العلامات التجارية، والخوارزميات ملكية حصرية لـ MSK Labs بموجب قوانين حماية الملكية الفكرية التركية والدولية.</p>

        <h2>المادة 5 — التصرفات المحظورة</h2>
        <p>يحظر على المستخدم تماماً: الهندسة العكسية للشيفرات أو محاولة فك تجميعها، استخدام أدوات الزحف الآلي ضد الموقع أو تنفيذ هجمات حجب الخدمة، إعادة بيع أو تأجير البرمجيات تجارياً دون إذن مسبق، إزالة إشعارات حقوق النشر، أو دمج البرمجيات بأي شيفرات خبيثة.</p>

        <h2>المادة 6 — إخلاء المسؤولية (مبدأ كما هي)</h2>
        <p>يتم تقديم البرمجيات وخدمات الويب <strong>"كما هي"</strong> و<strong>"بحالتها الراهنة"</strong> دون أي ضمانات صريحة أو ضمنية. إن الحسابات المرتبطة بحركة الصلاة، اتجاه القبلة، أو عد السجدات تعتمد كلياً على دقة مستشعرات جهاز المستخدم (GPS، مستشعر القرب، البوصلة)، ولا تتحمل المؤسسة أي مسؤولية عن انحراف المعايرة أو العوامل المحيطة.</p>

        <h2>المادة 7 — تحديد المسؤولية والقانون الواجب التطبيق</h2>
        <p>لا تتحمل MSK Labs أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة تنشأ عن استخدام البرمجيات. تخضع هذه الاتفاقية وتفسر وفقاً <strong>لقوانين الجمهورية التركية</strong>، وتختص <strong>محاكم ودوائر التنفيذ في إسطنبول</strong> حصرياً بالفصل في أي نزاع.</p>

        <h2>المادة 8 — التواصل والمراسلات القانونية</h2>
        <p>
          ✉️ <strong>الدعم الفني:</strong> <a href="mailto:destek@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">destek@msklabs.org</a><br>
          📮 <strong>المراسلات الرسمية:</strong> <a href="mailto:iletisim@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">iletisim@msklabs.org</a><br>
          🔒 <strong>شؤون الخصوصية:</strong> <a href="mailto:kvkk@msklabs.org" style="color:var(--primary-color, #0284c7); font-weight:600;">kvkk@msklabs.org</a>
        </p>
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
    f.write(terms_html.strip())

print(f'Successfully wrote terms.html ({len(terms_html)} chars, {len(terms_html.splitlines())} lines)')
