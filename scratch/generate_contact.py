import os

path = r'd:\Code\mskaymaz\webMSKLabs\contact.html'

contact_html = '''<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>İletişim, Destek Kanalları ve Kurumsal Künye | MSK Labs</title>
  <meta name="description" content="MSK Labs resmi iletişim kanalları, teknik destek bilet masası, kurumsal e-posta adresleri ve kurumsal künye bilgileri.">
  <script>!function(){var t=localStorage.getItem("user_theme")||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");"dark"===t&&document.documentElement.setAttribute("data-theme","dark")}()</script>
  <link rel="canonical" href="https://msklabs.org/contact.html">
  <meta property="og:title" content="İletişim ve Destek Kanalları | MSK Labs">
  <meta property="og:description" content="MSK Labs resmi iletişim kanalları, teknik destek bilet masası ve kurumsal künye.">
  <meta property="og:url" content="https://msklabs.org/contact.html">
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
    .contact-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin: 24px 0 36px 0;
    }
    .contact-card {
      background: var(--bg-card, #ffffff);
      border: 1px solid var(--border-color, #cbd5e1);
      border-radius: 16px;
      padding: 24px 22px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .contact-card:hover {
      transform: translateY(-2px);
      border-color: var(--primary-color, #0284c7);
    }
    .contact-card-icon {
      font-size: 2rem;
      margin-bottom: 14px;
      line-height: 1;
    }
    .contact-card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main, #0f172a);
      margin: 0 0 10px 0;
    }
    .contact-card-desc {
      font-size: 0.92rem;
      color: var(--text-muted, #475569);
      line-height: 1.6;
      margin: 0 0 18px 0;
      flex-grow: 1;
    }
    .contact-card-action {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 0.92rem;
      color: var(--primary-color, #0284c7);
      text-decoration: none;
      word-break: break-all;
    }
    .contact-card-action:hover {
      text-decoration: underline;
    }
    .contact-card-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--primary-color, #0284c7);
      color: #ffffff !important;
      padding: 11px 18px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: opacity 0.2s ease;
      margin-top: auto;
    }
    .contact-card-btn:hover {
      opacity: 0.92;
    }
    .corporate-info-section {
      background: var(--bg-card, #ffffff);
      border: 1px solid var(--border-color, #cbd5e1);
      border-radius: 16px;
      padding: 28px 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
    }
    .corporate-info-section h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main, #0f172a);
      margin: 0 0 16px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border-color, #f1f5f9);
    }
    .corporate-info-section p, .corporate-info-section li {
      font-size: 0.95rem;
      line-height: 1.7;
      color: var(--text-main, #334155);
    }
    .corporate-grid-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
      margin-top: 18px;
    }
    .corporate-detail-item {
      background: var(--bg-hover, #f8fafc);
      padding: 16px 18px;
      border-radius: 12px;
      border: 1px solid var(--border-color, #e2e8f0);
    }
    .corporate-detail-item strong {
      display: block;
      color: var(--text-main, #0f172a);
      font-size: 0.9rem;
      margin-bottom: 4px;
    }
    .corporate-detail-item span {
      color: var(--text-muted, #64748b);
      font-size: 0.92rem;
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
      <span class="lang-tr">İletişim &amp; Destek Kanalları</span>
      <span class="lang-en">Contact &amp; Support Channels</span>
      <span class="lang-ar">قنوات الاتصال والدعم</span>
    </h1>

    <div class="static-page-card" style="margin-bottom: 24px;">
      <div class="lang-tr">
        <p style="margin: 0; font-size: 1rem; line-height: 1.7; color: var(--text-main, #334155);">
          <strong>MSK Labs</strong>; masaüstü (Windows, macOS, Linux), mobil (Android, iOS) ve web platformlarında bağımsız, minimalist ve odaklı yazılım çözümleri üretir. Teknik destek, hata bildirimleri, kurumsal istişareler veya KVKK başvurularınız için aşağıdaki doğrudan kanallarımızı kullanabilirsiniz.
        </p>
      </div>
      <div class="lang-en">
        <p style="margin: 0; font-size: 1rem; line-height: 1.7; color: var(--text-main, #334155);">
          <strong>MSK Labs</strong> engineers focused, independent utility software across desktop, mobile, and web ecosystems. For technical support, bug reports, enterprise inquiries, or data privacy requests, you can reach us via our official direct channels below.
        </p>
      </div>
      <div class="lang-ar">
        <p style="margin: 0; font-size: 1rem; line-height: 1.7; color: var(--text-main, #334155);">
          تقوم <strong>MSK Labs</strong> بتطوير حلول برمجية مستقلة ومحددة لأنظمة سطح المكتب والأجهزة المحمولة والويب. للحصول على الدعم الفني، الإبلاغ عن الأخطاء، أو المراسلات المؤسسية، يرجى التواصل معنا عبر القنوات المباشرة أدناه.
        </p>
      </div>
    </div>

    <!-- 4 KURUMSAL İLETİŞİM KARTI -->
    <div class="contact-grid">

      <!-- 1. Teknik Destek ve Canlı Bilet -->
      <div class="contact-card">
        <div class="contact-card-icon">🎫</div>
        <h2 class="contact-card-title">
          <span class="lang-tr">Teknik Destek &amp; Bilet</span>
          <span class="lang-en">Technical Support &amp; Ticket</span>
          <span class="lang-ar">الدعم الفني والتذاكر</span>
        </h2>
        <p class="contact-card-desc">
          <span class="lang-tr">Uygulamalarımızla ilgili hata bildirimi veya özellik talebi oluşturup takip numarası (Bilet ID) alabilirsiniz.</span>
          <span class="lang-en">Submit bug reports or feature requests and obtain an official tracking ticket ID.</span>
          <span class="lang-ar">إنشاء تذكرة دعم فني أو الإبلاغ عن خطأ برمجي والحصول على رقم تتبع رسمي.</span>
        </p>
        <a href="destek.html" class="contact-card-btn">
          <span>🎫</span>
          <span class="lang-tr">Destek Masasına Git</span>
          <span class="lang-en">Go to Support Desk</span>
          <span class="lang-ar">الذهاب لمكتب الدعم</span>
        </a>
      </div>

      <!-- 2. Doğrudan E-Posta -->
      <div class="contact-card">
        <div class="contact-card-icon">✉️</div>
        <h2 class="contact-card-title">
          <span class="lang-tr">Kurumsal E-Posta Hatları</span>
          <span class="lang-en">Official Email Channels</span>
          <span class="lang-ar">البريد الإلكتروني الرسمي</span>
        </h2>
        <p class="contact-card-desc">
          <span class="lang-tr">Resmi yazışmalar, kurumsal iş birlikleri ve veri koruma başvuruları için kurumsal hatlarımız.</span>
          <span class="lang-en">Official channels for enterprise correspondence, partnership inquiries, and data privacy requests.</span>
          <span class="lang-ar">القنوات الرسمية للمراسلات المؤسسية، استفسارات الشراكة، وطلبات حماية البيانات.</span>
        </p>
        <div style="display:flex; flex-direction:column; gap:10px; margin-top:auto;">
          <a href="mailto:destek@msklabs.org" class="contact-card-action">
            <span>📩</span> <span>destek@msklabs.org</span>
          </a>
          <a href="mailto:iletisim@msklabs.org" class="contact-card-action">
            <span>📮</span> <span>iletisim@msklabs.org</span>
          </a>
          <a href="mailto:kvkk@msklabs.org" class="contact-card-action">
            <span>🔒</span> <span>kvkk@msklabs.org</span>
          </a>
        </div>
      </div>

      <!-- 3. Açık Kaynak & GitHub -->
      <div class="contact-card">
        <div class="contact-card-icon">🐙</div>
        <h2 class="contact-card-title">
          <span class="lang-tr">Geliştirici &amp; GitHub</span>
          <span class="lang-en">Developer &amp; GitHub Hub</span>
          <span class="lang-ar">المطور و GitHub</span>
        </h2>
        <p class="contact-card-desc">
          <span class="lang-tr">Açık kaynak modüllerimiz, derleme betikleri, sürüm yayın kayıtları ve kamuya açık Issue takibi.</span>
          <span class="lang-en">Open-source modules, build scripts, release changelogs, and public issue tracking.</span>
          <span class="lang-ar">الوحدات البرمجية مفتوحة المصدر، سجلات الإصدارات، وتتبع المشكلات العام.</span>
        </p>
        <a href="https://github.com/mskaymaz" target="_blank" rel="noopener noreferrer" class="contact-card-action" style="margin-top:auto;">
          <span>🔗</span> <span>github.com/mskaymaz</span>
        </a>
      </div>

      <!-- 4. SSS ve Bilgi Bankası -->
      <div class="contact-card">
        <div class="contact-card-icon">❓</div>
        <h2 class="contact-card-title">
          <span class="lang-tr">Sıkça Sorulan Sorular</span>
          <span class="lang-en">FAQ &amp; Knowledge Base</span>
          <span class="lang-ar">الأسئلة الشائعة</span>
        </h2>
        <p class="contact-card-desc">
          <span class="lang-tr">Uygulama kurulumları, sensör izinleri, yerel veri saklama ve sorun giderme rehberleri.</span>
          <span class="lang-en">Installation guides, sensor permissions, local-first storage, and troubleshooting steps.</span>
          <span class="lang-ar">أدلة التثبيت، أذونات المستشعرات، التخزين المحلي، وحل المشكلات الشائعة.</span>
        </p>
        <a href="faq.html" class="contact-card-btn" style="background: transparent; color: var(--text-main, #0f172a) !important; border: 1px solid var(--border-color, #cbd5e1);">
          <span>🔍</span>
          <span class="lang-tr">Rehberi İncele</span>
          <span class="lang-en">Browse FAQ</span>
          <span class="lang-ar">استعراض الأسئلة</span>
        </a>
      </div>

    </div>

    <!-- KURUMSAL KÜNYE VE ÇALIŞMA STANDARTLARI -->
    <div class="corporate-info-section">
      <div class="lang-tr">
        <h2>Kurumsal Künye ve İletişim İlkelerimiz</h2>
        <p>MSK Labs, kullanıcılara karşı açık, şeffaf ve nesnel bir mühendislik yaklaşımı benimser. İletişim ve destek operasyonlarımız aşağıdaki kurumsal prensipler çerçevesinde yürütülür:</p>
        
        <div class="corporate-grid-details">
          <div class="corporate-detail-item">
            <strong>Kuruluş / İnisiyatif Adı</strong>
            <span>MSK Labs Yazılım ve Bilişim Teknolojileri</span>
          </div>
          <div class="corporate-detail-item">
            <strong>Resmi Web Sitesi</strong>
            <span><a href="https://msklabs.org" style="color:var(--primary-color, #0284c7);">https://msklabs.org</a></span>
          </div>
          <div class="corporate-detail-item">
            <strong>Faaliyet Alanı</strong>
            <span>Bağımsız Masaüstü, Mobil ve Web Yazılım Ekosistemi</span>
          </div>
          <div class="corporate-detail-item">
            <strong>Teknik İnceleme &amp; Yanıt Süreci</strong>
            <span>Hafta içi 09:00 - 18:00 (TSİ) Bilet Sırasına Göre</span>
          </div>
        </div>

        <h3 style="margin-top:24px; font-size:1.05rem; font-weight:700;">Destek Taleplerinde Hızlı Çözüm İçin Tavsiyeler:</h3>
        <ul>
          <li><strong>Detaylı Sistem Bilgisi:</strong> Yaşadığınız sorunu iletirken kullandığınız işletim sistemini (Örn: Windows 11 23H2, macOS Sonoma, Android 14) ve uygulamanın sürüm numarasını belirtmeniz çözümü hızlandıracaktır.</li>
          <li><strong>Hata Ekran Görüntüsü / Log:</strong> Varsa karşılaştığınız hata ekranının görüntüsünü veya hata metnini destek biletinize ekleyebilirsiniz.</li>
          <li><strong>Kişisel Veri Göndermeyiniz:</strong> Yazılımlarımız yerel öncelikli çalıştığından, destek masasına özel kimlik veya şifre bilgilerinizi asla iletmeyiniz.</li>
        </ul>
      </div>

      <div class="lang-en">
        <h2>Corporate Information &amp; Support Standards</h2>
        <p>MSK Labs maintains a transparent, engineering-driven approach to user communication. Support requests are handled strictly in order of receipt under the following principles:</p>

        <div class="corporate-grid-details">
          <div class="corporate-detail-item">
            <strong>Organization Name</strong>
            <span>MSK Labs Software &amp; Information Technologies</span>
          </div>
          <div class="corporate-detail-item">
            <strong>Official Web Portal</strong>
            <span><a href="https://msklabs.org" style="color:var(--primary-color, #0284c7);">https://msklabs.org</a></span>
          </div>
          <div class="corporate-detail-item">
            <strong>Core Domain</strong>
            <span>Independent Desktop, Mobile &amp; Web Software</span>
          </div>
          <div class="corporate-detail-item">
            <strong>Operating Hours</strong>
            <span>Monday – Friday, 09:00 – 18:00 (UTC+3)</span>
          </div>
        </div>

        <h3 style="margin-top:24px; font-size:1.05rem; font-weight:700;">Guidelines for Faster Ticket Resolution:</h3>
        <ul>
          <li><strong>Environment Details:</strong> Please specify your operating system (e.g., Windows 11, macOS, Android 14) and application version when opening a ticket.</li>
          <li><strong>Screenshots / Error Text:</strong> Attaching error logs or screenshots facilitates immediate diagnostic reproduction.</li>
          <li><strong>No Sensitive Data:</strong> Our software is local-first; never include personal passwords or sensitive local keys in support messages.</li>
        </ul>
      </div>

      <div class="lang-ar">
        <h2>المعلومات المؤسسية ومعايير الدعم الفني</h2>
        <p>تعتمد MSK Labs نهجاً هندسياً شفافاً في التواصل مع المستخدمين. تتم معالجة طلبات الدعم بالتسلسل وفقاً للمبادئ التالية:</p>

        <div class="corporate-grid-details">
          <div class="corporate-detail-item">
            <strong>اسم المؤسسة</strong>
            <span>MSK Labs للبرمجيات وتكنولوجيا المعلومات</span>
          </div>
          <div class="corporate-detail-item">
            <strong>الموقع الرسمي</strong>
            <span><a href="https://msklabs.org" style="color:var(--primary-color, #0284c7);">https://msklabs.org</a></span>
          </div>
          <div class="corporate-detail-item">
            <strong>مجال النشاط</strong>
            <span>برمجيات سطح المكتب، الجوال، وحلول الويب</span>
          </div>
          <div class="corporate-detail-item">
            <strong>أوقات العمل</strong>
            <span>الاثنين – الجمعة، 09:00 – 18:00 (توقيت تركيا)</span>
          </div>
        </div>
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
    f.write(contact_html.strip())

print(f'Successfully wrote contact.html ({len(contact_html)} chars, {len(contact_html.splitlines())} lines)')
