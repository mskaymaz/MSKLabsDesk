-- MSKLabsDesk — Migration 0012: Apps Tablosuna summary Sütunlarının Eklenmesi & Ayrıştırılması
-- Tarih: 19.10.2026 - 15:45

ALTER TABLE apps ADD COLUMN summary_tr TEXT;
ALTER TABLE apps ADD COLUMN summary_en TEXT;
ALTER TABLE apps ADD COLUMN summary_ar TEXT;

-- 1. HaydiNamaza
UPDATE apps SET
  summary_tr = 'Lokasyon bazlı ibadet planlaması ve zaman yönetimi otomasyonu.',
  summary_en = 'Location-based worship planning and time management automation.',
  summary_ar = 'تخطيط العبادة القائم على الموقع وأتمتة إدارة الوقت.',
  description_tr = 'Haydi Namaza, günlük namaz vakitlerini Diyanet uyumlu hassas hesaplamalarla sunan, internet gerektirmeyen, %100 ücretsiz ve reklamsız bir mobil ibadet asistanıdır.',
  description_en = 'Haydi Namaza provides accurate prayer times offline with no ads, completely free for all users worldwide.',
  description_ar = 'تطبيق حي على الصلاة يوفر مواقيت الصلاة الدقيقة بدون إعلانات وبدون الحاجة للإنترنت.'
WHERE app_id = 'haydinamaza';

-- 2. RekatSay
UPDATE apps SET
  summary_tr = 'Odaklanmayı artıran, minimalist ve etkileşimli takip aracı.',
  summary_en = 'A minimalist and interactive tracking tool that increases focus.',
  summary_ar = 'أداة تتبع تفاعلية وبسيطة تزيد من التركيز.',
  description_tr = 'RekatSay; namaz esnasında rekat ve secde sayılarını karıştırmadan, ibadetinize tam odaklanmanızı sağlamak amacıyla geliştirilmiş minimalist ve akıllı bir mobil uygulamadır. Sade ve sakin arayüz, temassız otomatik algılama ve yüksek gizlilik ilkeleri doğrultusunda tasarlanmıştır. Kamera veya yüz tanıma gibi müdahaleci yöntemler kullanmaz; tüm işlemler cihazınızın yerel sensörleri üzerinden %100 çevrimdışı ve güvenle gerçekleştirilir.',
  description_en = 'RekatSay is a minimalist and smart mobile application designed to keep track of rakat and sujud counts during prayer without confusion, allowing full focus on worship. Built on principles of touchless automatic detection, a calm interface, and total privacy with no camera or facial recognition.',
  description_ar = 'تطبيق RekatSay هو تطبيق محمول ذكي وبسيط مصمم لمتابعة عدد الركعات والسجدات أثناء الصلاة دون ارتباك، مما يتيح لك التركيز الكامل في العبادة. يعتمد على الكشف التلقائي بدون لمس، واجهة هادئة، وخصوصية تامة بدون استخدام الكاميرا أو التعرف على الوجه.'
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
  summary_ar = 'مساعد إنتاجية معياري لسطح المكتب.'
WHERE app_id = 'deskpilot';

-- 5. En Yakın
UPDATE apps SET
  summary_tr = 'Kritik hizmet noktalarını anında tespit eden mobil lokasyon motoru.',
  summary_en = 'Location engine that instantly detects critical service points.',
  summary_ar = 'محرك الموقع الذي يكتشف نقاط الخدمة الحرجة.'
WHERE app_id = 'enyakin';

-- 6. GÇ Pil Uyarı
UPDATE apps SET
  summary_tr = 'Görev çubuğu üzerinde donanım sağlığını koruyan pil izleme ve bildirim servisi.',
  summary_en = 'Taskbar battery monitoring and hardware protection service.',
  summary_ar = 'خدمة مراقبة البطارية وحماية الأجهزة على شريط المهام.'
WHERE app_id = 'gcpiluyari';
