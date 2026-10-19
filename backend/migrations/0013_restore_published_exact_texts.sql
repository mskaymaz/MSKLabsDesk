-- MSKLabsDesk — Migration 0013: Canlı Sitedeki (origin/main) Birebir Özgün Metinlerin Yerleştirilmesi
-- Tarih: 19.10.2026 - 16:05
-- Kaynak: origin/main üzerindeki apps.html ve apps/*.html canlı yayın dosyaları

-- 1. HaydiNamaza
UPDATE apps SET
  summary_tr = 'Lokasyon bazlı ibadet planlaması ve zaman yönetimi otomasyonu.',
  summary_en = 'Location-based worship planning and time management automation.',
  summary_ar = 'تخطيط العبادة القائم على الموقع وأتمتة إدارة الوقت.',
  description_tr = 'Haydi Namaza; günlük namaz vakitlerinizi takip etmenizi, kıble yönünüzü kolayca bulmanızı, günlük hatırlatma maksatlı yayınlanan dinî içeriklere ulaşmanızı ve vakit bildirimlerinizi tamamen kendi tercihlerinize göre kişiselleştirmenizi sağlayan modern bir mobil yardımcı uygulamadır. Sade arayüz, çevrimdışı kullanım kolaylığı, tam kullanıcı kontrolü ve veri şeffaflığı ilkeleriyle geliştirilmektedir. Hesap açma zorunluluğu bulunmaz; verileriniz ve kişisel ayarlarınız güvende kalacak şekilde doğrudan kendi cihazınızda saklanır.',
  description_en = 'Haydi Namaza is a modern mobile assistant application that allows you to track your daily prayer times, easily find the Qibla direction, access daily religious reminder content, and fully customize your prayer notifications. Developed with principles of a clean interface, offline-first convenience, full user control, and data transparency. No account creation required; your data and preferences remain safe on your device.',
  description_ar = 'تطبيق "Haydi Namaza" هو تطبيق محمول حديث يتيح لك متابعة أوقات الصلاة اليومية، وإيجاد اتجاه القبلة بسهولة، والوصول إلى المحتويات الدينية التذكيرية اليومية، وتخصيص إشعارات أوقات الصلاة بالكامل وفقاً لتفضيلاتك. يتم تطويره وفق مبادئ الواجهة البسيطة، سهولة الاستخدام بدون إنترنت، التحكم الكامل للمستخدم، وشفافية البيانات. لا يتطلب إنشاء حساب؛ تبقى بياناتك وتفضيلاتك آمنة على جهازك.'
WHERE app_id = 'haydinamaza';

-- 2. RekatSay
UPDATE apps SET
  summary_tr = 'Odaklanmayı artıran, minimalist ve etkileşimli takip aracı.',
  summary_en = 'A minimalist and interactive tracking tool that increases focus.',
  summary_ar = 'أداة تتبع تفاعلية وبسيطة تزيد من التركيز.',
  description_tr = 'RekatSay; namaz esnasında rekat ve secde sayılarını karıştırmadan, ibadetinize tam odaklanmanızı sağlamak amacıyla geliştirilmiş minimalist ve akıllı bir mobil uygulamadır. Sade ve sakin arayüz, temassız otomatik algılama ve yüksek gizlilik ilkeleri doğrultusunda tasarlanmıştır. Kamera veya yüz tanıma gibi müdahaleci yöntemler kullanmaz; tüm işlemler cihazınızın yerel sensörleri üzerinden %100 çevrimdışı ve güvenle gerçekleştirilir.',
  description_en = 'RekatSay is a minimalist and smart mobile application designed to help you focus on your worship without confusing the number of rakat and sujud (prostration). Built with principles of a clean interface, touchless automatic detection, and high privacy. It uses no intrusive methods like cameras or facial recognition; all processing is done 100% offline via local device sensors.',
  description_ar = 'تطبيق "RekatSay" هو تطبيق محمول حديث وبسيط تم تطويره لمساعدتك على التركيز في عبادتك دون الارتباك في عدد الركعات والسجدات. تم تصميمه وفق مبادئ الواجهة البسيطة، التتبع التلقائي بدون لمس، والخصوصية العالية. لا يستخدم طرقاً متطفلة مثل الكاميرا أو التعرف على الوجه؛ بل تتم جميع العمليات بنسبة 100% بدون إنترنت عبر المستشعرات المحلية للجهاز.'
WHERE app_id = 'rekatsay';

-- 3. Date Counter
UPDATE apps SET
  summary_tr = 'Emeklilik, sınav ve özel hedeflerinizi masaüstünüzde ve görev çubuğunuzda canlı takip eden gelişmiş zaman sayacı.',
  summary_en = 'Desktop & taskbar timer tracking retirement, exams, and milestones in real-time.',
  summary_ar = 'مؤقت سطح المكتب وشريط المهام لمتابعة التقاعد والامتحانات والتواريخ الهامة.',
  description_tr = 'Date Counter (Tarih & Hedef Sayacı); hedef yaş hesaplamalarının yanı sıra sınav süreçleri, proje teslim tarihleri, askerlik dönüşü, yıl dönümleri veya hayatınızdaki önemli dönüm noktalarını anlık olarak takip etmenizi sağlayan şık ve gelişmiş bir masaüstü zaman yönetim aracıdır. Masaüstünüzde ve görev çubuğunuzda gözü yormayan şeffaf ve minimalist tasarımıyla yer alan uygulama; sade kullanım, yüksek kişiselleştirme, hassas zaman senkronizasyonu, tam 3 dil desteği ve %100 çevrimdışı gizlilik ilkeleriyle geliştirilmiştir. Hesap açma zorunluluğu yoktur; tüm hedef tarihleriniz doğrudan bilgisayarınızda güvenle saklanır.',
  description_en = 'Date Counter (Date & Goal Tracker) is a sleek and advanced desktop time management tool designed to track target age milestones as well as exam schedules, project deadlines, military service countdowns, anniversaries, or important milestone dates in your life. Featuring a clean and minimalist desktop and taskbar docking design, it is built on principles of ease of use, high customizability, precise time synchronization, full 3-language support, and 100% offline privacy. No account required; all target dates remain safe on your device.',
  description_ar = 'تطبيق Date Counter (عداد التاريخ والأهداف) هو أداة أنيقة ومتقدمة لإدارة الوقت على سطح المكتب تتيح لك متابعة حسابات العمر المستهدف، إلى جانب فترات الامتحانات، مواعيد تسليم المشاريع، العودة من الخدمة العسكرية، الذكريات السنوية، أو المحطات الهامة في حياتك بشكل فوري. بتصميم شفاف وبسيط على سطح المكتب وشريط المهام، تم تطويره وفق مبادئ سهولة الاستخدام، التخصيص العالي، التزامن الدقيق للوقت، الدعم الكامل لـ 3 لغات، والخصوصية الكاملة بدون إنترنت. لا يتطلب حساباً؛ تبقى جميع مواعيدك المحفوظة آمنة على جهازك.'
WHERE app_id = 'date_counter';

-- 4. DeskPilot
UPDATE apps SET
  summary_tr = 'Operasyonel hızı artıran, eklenti tabanlı modüler masaüstü verimlilik asistanı.',
  summary_en = 'Plugin-based modular desktop productivity assistant.',
  summary_ar = 'مساعد إنتاجية معياري لسطح المكتب.',
  description_tr = 'Operasyonel hızı artıran, eklenti tabanlı modüler verimlilik asistanı. Günlük masaüstü görevlerinizi otomatize eder ve iş akışınızı hızlandırır.',
  description_en = 'Plugin-based modular productivity assistant that increases operational speed. Automates your daily desktop tasks and accelerates your workflow.',
  description_ar = 'مساعد إنتاجية معياري قائم على المكونات الإضافية يزيد من سرعة التشغيل. يطوّر مهام سطح المكتب اليومية ويسرّع سير عملك.'
WHERE app_id = 'deskpilot';

-- 5. En Yakın
UPDATE apps SET
  summary_tr = 'Kritik hizmet noktalarını anında tespit eden mobil lokasyon motoru.',
  summary_en = 'Location engine that instantly detects critical service points.',
  summary_ar = 'محرك الموقع الذي يكتشف نقاط الخدمة الحرجة.',
  description_tr = 'Kritik hizmet noktalarını anında tespit eden lokasyon motoru. Bulunduğunuz konuma en yakın acil, sosyal ve kamu hizmet alanlarını harita üzerinde anında listeler.',
  description_en = 'Location engine that instantly detects critical service points. Instantly lists nearest emergency, social, and public service areas on map based on your location.',
  description_ar = 'محرك الموقع الذي يكتشف نقاط الخدمة الحرجة على الفور. يعرض فوراً أقرب مناطق الطوارئ والخدمات الاجتماعية والعامة على الخريطة بناءً على موقعك.'
WHERE app_id = 'enyakin';

-- 6. GÇ Pil Uyarı
UPDATE apps SET
  summary_tr = 'Görev çubuğu üzerinde donanım sağlığını koruyan pil izleme ve bildirim servisi.',
  summary_en = 'Taskbar battery monitoring and hardware protection service.',
  summary_ar = 'خدمة مراقبة البطارية وحماية الأجهزة على شريط المهام.',
  description_tr = 'Donanım sağlığını koruyan arka plan izleme ve bildirim servisi. Dizüstü bilgisayarınızın pil ömrünü uzatmak için şarj seviyelerini akıllıca takip eder.',
  description_en = 'Background monitoring and notification service protecting hardware health. Intelligently tracks battery levels to extend your laptop''s battery lifespan.',
  description_ar = 'خدمة المراقبة والإشعارات الخلفية التي تحمي صحة الأجهزة. تتبع مستويات البطارية بذكاء لتطيل عمر بطارية الكمبيوتر المحمول.'
WHERE app_id = 'gcpiluyari';
