-- MSKLabsDesk — Kurumsal Sayfalar CMS Tablo Şeması ve Başlangıç Verileri
-- File: 0019_site_pages.sql

CREATE TABLE IF NOT EXISTS site_pages (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title_tr TEXT NOT NULL,
    title_en TEXT,
    title_ar TEXT,
    summary_tr TEXT,
    summary_en TEXT,
    summary_ar TEXT,
    content_tr TEXT NOT NULL,
    content_en TEXT,
    content_ar TEXT,
    hero_image TEXT,
    meta_json TEXT,
    status TEXT DEFAULT 'published',
    display_order INTEGER DEFAULT 0,
    is_system BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_site_pages_slug ON site_pages(slug);
CREATE INDEX IF NOT EXISTS idx_site_pages_status ON site_pages(status);

-- 1. Ana Sayfa (Index)
INSERT OR IGNORE INTO site_pages (id, slug, title_tr, title_en, title_ar, summary_tr, summary_en, summary_ar, content_tr, content_en, content_ar, hero_image, meta_json, status, display_order, is_system)
VALUES (
    'page_index',
    'index',
    'Ana Sayfa',
    'Home',
    'الرئيسية',
    'MSK Labs ana sayfa karşılama başlığı, sloganları ve vitrin tanıtımları.',
    'MSK Labs homepage greeting, slogans and showcase introduction.',
    'رسالة الترحيب والشعارات وعرض مشاريع MSK Labs.',
    '<h2>Kullanıcı Dostu Yazılım & İnsan Odaklı Geliştirme</h2><p>MSK Labs; mobil ve masaüstü platformlar için kullanıcı dostu, güvenli ve bağımsız çözümler geliştirir.</p>',
    '<h2>User Friendly Software & Human Centric Development</h2><p>MSK Labs develops user-friendly, secure, and independent solutions for mobile and desktop platforms.</p>',
    '<h2>برمجيات صديقة للمستخدم وتطوير مرتكز على الإنسان</h2><p>تطور MSK Labs حلولاً مستقلة وآمنة وسهلة الاستخدام لمنصات الهاتف والمكتب.</p>',
    NULL,
    '{"seo_keywords":"yazılım, mobil uygulama, msk labs, android, windows","show_header_banner":true}',
    'published',
    0,
    1
);

-- 2. Hakkımızda & Biz Kimiz (About)
INSERT OR IGNORE INTO site_pages (id, slug, title_tr, title_en, title_ar, summary_tr, summary_en, summary_ar, content_tr, content_en, content_ar, hero_image, meta_json, status, display_order, is_system)
VALUES (
    'page_about',
    'about',
    'Hakkımızda & Biz Kimiz',
    'About Us',
    'من نحن',
    'MSK Labs vizyonu, bağımsız yazılım felsefesi ve insan odaklı geliştirme ilkeleri.',
    'MSK Labs vision, independent software philosophy and human-centric development principles.',
    'رؤية MSK Labs وفلسفة البرمجيات المستقلة ومبادئ التطوير المرتكز على الإنسان.',
    '<h2>MSK Labs Vizyonu</h2><p>MSK Labs, mobil (Android) ve masaüstü (Windows) platformları için kullanıcı dostu, yüksek performanslı ve hayatı kolaylaştıran özgün yazılım çözümleri geliştiren bağımsız bir teknoloji projesidir.</p><p>Amacımız; ibadet takibinden emeklilik hesaplamalarına, donanım sağlığından konum bazlı hizmet araçlarına kadar geniş bir alanda güvenilir ve yenilikçi uygulamalar sunmaktır.</p><h2>Yazılım İlkelerimiz</h2><ul><li><strong>Güvenlik ve Gizlilik:</strong> Kullanıcı verilerini gereksiz yere işlemeyiz, izin almadan dış sunuculara aktarmayız.</li><li><strong>Performans:</strong> Şarj ve sistem kaynağı dostu, hızlı ve hafif yazılımlar tasarlarız.</li><li><strong>Erişilebilirlik:</strong> Çoklu dil desteği (Türkçe, İngilizce, Arapça) ile küresel erişim ve kullanım kolaylığı sağlarız.</li></ul>',
    '<h2>MSK Labs Vision</h2><p>MSK Labs designs innovative, high-performance mobile (Android) and desktop (Windows) software solutions engineered to simplify daily routines.</p><h2>Core Principles</h2><ul><li><strong>Privacy First:</strong> Respecting user data and device privacy.</li><li><strong>Resource Efficiency:</strong> Lightweight, battery-friendly applications.</li><li><strong>Global Accessibility:</strong> Multi-language support (TR, EN, AR).</li></ul>',
    '<h2>رؤية MSK Labs</h2><p>تلتزم MSK Labs بتطوير تطبيقات هاتف ومكتبية موثوقة وسهلة الاستخدام لتيسير المهام اليومية وتعزيز تجربة المستخدم.</p><h2>مبادئنا الأساسية</h2><ul><li><strong>الخصوصية أولاً:</strong> حماية بيانات المستخدم وأمان الأجهزة.</li><li><strong>كفاءة الموارد:</strong> تطبيقات خفيفة وصديقة للبطارية وسرعة فائقة.</li><li><strong>الوصول العالمي:</strong> دعم متعدد اللغات (التركية، الإنجليزية، العربية).</li></ul>',
    'img/BizKimiz2.jpg',
    '{"seo_keywords":"hakkımızda, biz kimiz, msk labs vizyonu, yazılım ilkeleri"}',
    'published',
    1,
    1
);

-- 3. İletişim (Contact)
INSERT OR IGNORE INTO site_pages (id, slug, title_tr, title_en, title_ar, summary_tr, summary_en, summary_ar, content_tr, content_en, content_ar, hero_image, meta_json, status, display_order, is_system)
VALUES (
    'page_contact',
    'contact',
    'İletişim & Bize Ulaşın',
    'Contact Us',
    'اتصل بنا',
    'MSK Labs ile doğrudan iletişime geçin, soru, görüş ve iş birliği taleplerinizi iletin.',
    'Get in touch with MSK Labs directly for inquiries, feedback, and collaboration.',
    'تواصل مباشرة مع MSK Labs لطرح الأسئلة وتقديم الملاحظات وطلبات التعاون.',
    '<h2>Bizimle İletişime Geçin</h2><p>Uygulamalarımız, projelerimiz veya genel sorularınız için bize dilediğiniz zaman ulaşabilirsiniz. Destek talepleri ve hata bildirimleri için Destek & Talep Merkezimizi kullanabilirsiniz.</p><p><strong>E-Posta:</strong> contact@msklabs.org</p>',
    '<h2>Contact Us</h2><p>Feel free to reach out to us regarding our applications, projects, or general inquiries. For bug reports and technical help, please use our Support Center.</p><p><strong>Email:</strong> contact@msklabs.org</p>',
    '<h2>تواصل معنا</h2><p>لا تتردد في التواصل معنا بخصوص تطبيقاتنا أو مشاريعنا أو أي استفسارات عامة. لتقارير الأخطاء والمساعدة التقنية، يرجى استخدام مركز الدعم.</p><p><strong>البريد الإلكتروني:</strong> contact@msklabs.org</p>',
    NULL,
    '{"seo_keywords":"iletişim, msk labs iletişim, e-posta, bize ulaşın"}',
    'published',
    2,
    1
);

-- 4. Sıkça Sorulan Sorular (FAQ)
INSERT OR IGNORE INTO site_pages (id, slug, title_tr, title_en, title_ar, summary_tr, summary_en, summary_ar, content_tr, content_en, content_ar, hero_image, meta_json, status, display_order, is_system)
VALUES (
    'page_faq',
    'faq',
    'Sıkça Sorulan Sorular (SSS)',
    'Frequently Asked Questions (FAQ)',
    'الأسئلة الشائعة',
    'MSK Labs, uygulamalar, gizlilik, indirme ve geliştirme süreçleri hakkında merak edilenler.',
    'Frequently asked questions about MSK Labs, apps, privacy, downloads, and roadmap.',
    'الأسئلة الشائعة حول MSK Labs والتطبيقات والخصوصية والتحميل ومسار التطوير.',
    '<h2>Sıkça Sorulan Sorular</h2><p>MSK Labs, ücretsiz ve kullanıcı odaklı yazılımlar geliştiren bağımsız bir teknoloji projesidir. Uygulamalar; gizlilik, kullanım kolaylığı, performans ve yerel çalışma prensipleri dikkate alınarak geliştirilir.</p>',
    '<h2>Frequently Asked Questions</h2><p>MSK Labs is an independent technology project developing free, user-centric software. Applications are designed prioritizing privacy, usability, performance, and offline-first principles.</p>',
    '<h2>الأسئلة الشائعة</h2><p>مشروع MSK Labs هو مشروع تكنولوجي مستقل يطور برمجيات مجانية ومحورية حول المستخدم بالتركيز على الخصوصية والكفاءة والأداء.</p>',
    NULL,
    '{"seo_keywords":"sss, faq, sıkça sorulan sorular, msk labs yardım"}',
    'published',
    3,
    1
);

-- 5. Gizlilik Politikası (Privacy)
INSERT OR IGNORE INTO site_pages (id, slug, title_tr, title_en, title_ar, summary_tr, summary_en, summary_ar, content_tr, content_en, content_ar, hero_image, meta_json, status, display_order, is_system)
VALUES (
    'page_privacy',
    'privacy',
    'Gizlilik Politikası',
    'Privacy Policy',
    'سياسة الخصوصية',
    'MSK Labs veri koruma, kullanıcı gizliliği ve uygulama izinleri politikası.',
    'MSK Labs data protection, user privacy, and application permissions policy.',
    'سياسة حماية البيانات وخصوصية المستخدم وأذونات التطبيقات في MSK Labs.',
    '<h2>Gizlilik Politikası</h2><p>MSK Labs olarak gizliliğinize en üst düzeyde önem veriyoruz. Uygulamalarımızda gereksiz veri toplamaz, kişisel bilgilerinizi üçüncü şahıslarla paylaşmayız veya satmayız.</p><h2>Toplanan Veriler ve İzinler</h2><p>Uygulamalarımızın düzgün çalışabilmesi için yalnızca teknik olarak zorunlu olan minimum izinler talep edilir.</p>',
    '<h2>Privacy Policy</h2><p>At MSK Labs, we prioritize your privacy. We do not collect unnecessary data, nor do we sell or distribute your personal information to third parties.</p><h2>Data and Permissions</h2><p>Our applications only request the minimal technical permissions necessary to function properly.</p>',
    '<h2>سياسة الخصوصية</h2><p>نحن في MSK Labs نولي خصوصيتك أهمية قصوى. لا نجمع بيانات غير ضرورية ولا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة.</p>',
    NULL,
    '{"seo_keywords":"gizlilik politikası, veri güvenliği, kvkk, privacy policy"}',
    'published',
    4,
    1
);

-- 6. Kullanım Koşulları (Terms)
INSERT OR IGNORE INTO site_pages (id, slug, title_tr, title_en, title_ar, summary_tr, summary_en, summary_ar, content_tr, content_en, content_ar, hero_image, meta_json, status, display_order, is_system)
VALUES (
    'page_terms',
    'terms',
    'Kullanım Koşulları',
    'Terms of Use',
    'شروط الاستخدام',
    'MSK Labs yazılım ve web hizmetleri kullanım esasları ve sorumluluk sınırları.',
    'MSK Labs software and web services terms of use and liability boundaries.',
    'شروط استخدام برمجيات وخدمات الويب الخاصة بـ MSK Labs وحدود المسؤولية.',
    '<h2>Kullanım Koşulları</h2><p>MSK Labs web sitesini ve uygulamalarını kullanarak bu sayfada belirtilen koşulları kabul etmiş sayılırsınız. Uygulamalarımız kullanıcı faydası gözetilerek geliştirilmiştir.</p>',
    '<h2>Terms of Use</h2><p>By accessing and using MSK Labs websites and applications, you agree to comply with the terms and conditions outlined herein.</p>',
    '<h2>شروط الاستخدام</h2><p>باستخدامك لموقع وتطبيقات MSK Labs، فإنك توافق على الالتزام بالشروط والأحكام الموضحة في هذه الصفحة.</p>',
    NULL,
    '{"seo_keywords":"kullanım koşulları, lisans, terms of use"}',
    'published',
    5,
    1
);

-- 7. Destek & Talep Merkezi (Support)
INSERT OR IGNORE INTO site_pages (id, slug, title_tr, title_en, title_ar, summary_tr, summary_en, summary_ar, content_tr, content_en, content_ar, hero_image, meta_json, status, display_order, is_system)
VALUES (
    'page_support',
    'support',
    'Destek & Talep Merkezi',
    'Support & Request Center',
    'مركز الدعم والطلبات',
    'Hata bildirimi, özellik talebi ve uygulama önerileri için doğrudan destek hattı.',
    'Direct support channel for bug reports, feature requests, and app proposals.',
    'قناة الدعم المباشر لتقارير الأخطاء وطلبات الميزات واقتراحات التطبيقات.',
    '<h2>Destek & Talep Merkezi</h2><p>MSK Labs uygulamalarıyla ilgili karşılaştığınız sorunları bildirebilir, yeni özellik veya uygulama taleplerinizi bize doğrudan iletebilirsiniz.</p>',
    '<h2>Support & Request Center</h2><p>Report issues encountered with MSK Labs apps, or submit your feature and application requests directly to our team.</p>',
    '<h2>مركز الدعم والطلبات</h2><p>أبلغ عن المشكلات التي تواجهها مع تطبيقات MSK Labs أو أرسل طلباتك وميزاتك المقترحة مباشرة إلى فريقنا.</p>',
    NULL,
    '{"seo_keywords":"destek, talep, hata bildirimi, öneri, support"}',
    'published',
    6,
    1
);
