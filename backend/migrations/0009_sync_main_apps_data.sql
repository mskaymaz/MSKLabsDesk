-- MSKLabsDesk — Migration 0009: Main Verileri ile Uygulama Kataloğu Senkronizasyonu
-- Tarih: 19.10.2026 - 14:40
-- Main dalından alınan gerçek açıklama metinleri ve 3xN özellik kartları

-- 1. HaydiNamaza Güncellemesi
UPDATE apps SET
  description_tr = 'Haydi Namaza, günlük namaz vakitlerini Diyanet uyumlu hassas hesaplamalarla sunan, internet gerektirmeyen, %100 ücretsiz ve reklamsız bir mobil ibadet asistanıdır.',
  description_en = 'Haydi Namaza provides accurate prayer times offline with no ads, completely free for all users worldwide.',
  description_ar = 'تطبيق حي على الصلاة يوفر مواقيت الصلاة الدقيقة بدون إعلانات وبدون الحاجة للإنترنت.',
  icon_url = 'media/haydinamaza/icon.png',
  cover_url = 'media/haydinamaza/cover.png',
  feature_cards_json = json('[
    {
      "id": "card_1",
      "icon": "🕋",
      "title_tr": "Namaz Vakitleri & Canlı Sayaç / Widgetler",
      "title_en": "Prayer Times & Live Countdown / Widgets",
      "title_ar": "أوقات الصلاة والعداد التنازلي / أدوات الواجهة",
      "description_tr": "İmsak, Güneş, Öğle, İkindi, Akşam ve Yatsı vakitleri, canlı geri sayım sayacı, farklı boyutlarda widget seçenekleri ve Diyanet İşleri Başkanlığı uyumlu vakit hesaplama desteği.",
      "description_en": "Track Imsak, Sunrise, Dhuhr, Asr, Maghrib, and Isha prayer times with live countdown timer, multiple size widget options, and Diyanet-compatible calculations.",
      "description_ar": "متابعة أوقات الإمساك، الشروق، الظهر، العصر، المغرب، والعشاء مع عداد تنازلي مباشر، أدوات واجهة (Widget) بأحجام متعددة، وحسابات متوافقة مع رئاسة الشؤون الدينية."
    },
    {
      "id": "card_2",
      "icon": "➕",
      "title_tr": "İhtiyacınıza Göre Nafile Vakitler Ekleyin",
      "title_en": "Add Custom & Nafilah Times",
      "title_ar": "إضافة أوقات الصلاة النوافل والمخصصة",
      "description_tr": "Yalnızca 6 temel vakitle sınırlı kalmayın; nafile veya özel takip etmek istediğiniz vakitleri listeye ekleyebilir, düzenleyebilir ve dilediğiniz zaman silebilirsiniz.",
      "description_en": "Not limited to 6 basic prayer times; easily add, customize, track, and delete nafilah (voluntary) or custom prayer times according to your needs.",
      "description_ar": "لا تقتصر على 6 أوقات أساسية؛ يمكنك إضافة أوقات صلاة نافلة أو مخصصة لمتابعتها، تعديلها، وحذفها بسهولة في أي وقت."
    },
    {
      "id": "card_3",
      "icon": "⚠️",
      "title_tr": "Kerahat Vakitleri & Akıllı Görsel Uyarı",
      "title_en": "Kerahat Times & Smart Visual Alert",
      "title_ar": "أوقات الكراهة والتنبيه البصري الذكي",
      "description_tr": "Kerahat vakitlerinde ana ekrandaki sayaç kartında canlı görsel uyarı belirir; kerahat süreleri tercih ettiğiniz fıkhi yapıya göre dakika bazında ayarlanabilir.",
      "description_en": "Live visual alert appears on the countdown card during Kerahat times; durations can be customized in minutes according to your preferred Fiqh rules.",
      "description_ar": "تنبيه بصري مباشر على بطاقة العداد أثناء أوقات الكراهة؛ مع إمكانية تعديل دقيقة بالدقائق وفق المذهب الفقهي المفضل لديك."
    },
    {
      "id": "card_4",
      "icon": "🧭",
      "title_tr": "Güvenilir ve Kolay Kıble Yönü Tespiti",
      "title_en": "Reliable & Easy Qibla Direction",
      "title_ar": "تحديد اتجاه القبلة الموثوق والسهل",
      "description_tr": "Cihaz pusula sensörleri ve konum özelliklerini kullanarak ekrandaki pratik yön göstergeleri ile Kıble istikametini karmaşa olmadan kolayca tespit edin.",
      "description_en": "Easily determine the Qibla direction without complex technical jargon using your device''s compass sensors, location services, and clear visual indicators.",
      "description_ar": "تحديد اتجاه القبلة بسهولة وأمان دون تعقيدات تقنية من خلال مستشعرات البوصلة والموقع والمؤشرات البصرية الواضحة."
    },
    {
      "id": "card_5",
      "icon": "📖",
      "title_tr": "Günlük Dinî İçerikler & Sesli Okuma (TTS)",
      "title_en": "Daily Religious Content & Audio (TTS)",
      "title_ar": "المحتوى الديني اليومي والقراءة الصوتية",
      "description_tr": "Doğrulanmış Ayet, Hadis, Esma-i Hüsna ve Allah''ın Sıfatları; Türkçe canlı sesli okuma (TTS), bas-durdur kontrolleri ve akıcı panel geçişleri.",
      "description_en": "Verified Ayah, Hadith, Asma-ul-Husna, and Attributes; live Turkish Text-to-Speech (TTS) reading with tap-to-stop controls and smooth page swiping.",
      "description_ar": "آيات، أحاديث، الأسماء الحسنى، وصفات الله الموثوقة؛ قراءة صوتية باللغة التركية (TTS) مع إمكانية الإيقاف الفوري والتمرير السلس."
    },
    {
      "id": "card_6",
      "icon": "🔇",
      "title_tr": "Namazda Sessiz Kal Otomasyonu",
      "title_en": "Auto Prayer Silence Mode",
      "title_ar": "أتمتة وضع الصمت أثناء الصلاة",
      "description_tr": "Namaz vakti girdiğinde telefonunuzu otomatik olarak sessiz/titreşim moduna alır ve belirlenen süre sonunda ses seviyesini eski haline geri döndürür.",
      "description_en": "Automatically switches your phone to silent/vibrate mode when prayer time starts, and restores original volume settings after the set duration.",
      "description_ar": "تحويل الهاتف تلقائياً إلى وضع الصمت أو الاهتزاز عند دخول وقت الصلاة، وإعادة ضبط مستوى الصوت السابق بعد انتهاء المدة المحددة."
    },
    {
      "id": "card_7",
      "icon": "⚙️",
      "title_tr": "Özelleştirilebilir Bildirimler & Sesli Hatırlatma",
      "title_en": "Custom Notifications & Voice Reminders",
      "title_ar": "إشعارات مخصصة والتذكير الصوتي",
      "description_tr": "Ana ve nafile vakitler için birleşik ses/titreşim toggle ayarları; ezan öncesi belirlediğiniz sürede kişisel metninizi Türkçe sesli okuyan akıllı hatırlatıcı.",
      "description_en": "Unified audio/vibration toggles for main and nafilah times; smart pre-prayer reminder reading your custom text aloud prior to prayer time.",
      "description_ar": "مفاتيح موحدة للصوت والاهتزاز للأوقات الأساسية والنوافل؛ تذكير ذكي يقرأ نصك المخصص بصوت عالٍ قبل دخول الوقت بمدة محددة."
    },
    {
      "id": "card_8",
      "icon": "📍",
      "title_tr": "Konum Yönetimi & Favori Şehirler",
      "title_en": "Location Management & Favorites",
      "title_ar": "إدارة المواقع والمدن المفضلة",
      "description_tr": "Türkiye ve dünya üzerindeki şehir ve ilçeler arasından arama yapma, konum seçimi ve sık ziyaret edilen yerleri favorilere ekleyerek hızlı erişim.",
      "description_en": "Search and select cities/districts across Turkey and worldwide, save favorite locations, and switch quickly between your saved places.",
      "description_ar": "البحث واختيار المدن والأقضية في تركيا وحول العالم، إضافة المواقع المفضلة، والتنقل السريع بين الأماكن المحفوظة."
    },
    {
      "id": "card_9",
      "icon": "⚡",
      "title_tr": "%100 Çevrimdışı Kullanım (7 Günlük Önbellek) & Gizlilik",
      "title_en": "100% Offline (7-Day Cache) & Privacy",
      "title_ar": "100% عمل بدون إنترنت (تخزين 7 أيام) والخصوصية",
      "description_tr": "İnternet sağlandığında 7 günlük vakit verilerini otomatik çevrimdışına alır; hesap gerektirmez, kişisel verileri cihazda saklar ve pil dostudur.",
      "description_en": "Automatically caches 7-day prayer data for offline use when connected; no account required, stores settings on-device, and uses minimal battery.",
      "description_ar": "التخزين التلقائي لأوقات الصلاة لمدة 7 أيام عند الاتصال بالإنترنت للاستخدام بدون إنترنت؛ لا يتطلب حساباً، يحفظ البيانات محلياً، وموفر للبطارية."
    }
  ]')
WHERE app_id = 'haydinamaza';

-- 2. RekatSay Güncellemesi (Main dalındaki 6 kart ve tam metinler)
UPDATE apps SET
  name_en = 'Rakat Counter',
  name_ar = 'عداد الركعات',
  description_tr = 'RekatSay; namaz esnasında rekat ve secde sayılarını karıştırmadan, ibadetinize tam odaklanmanızı sağlamak amacıyla geliştirilmiş minimalist ve akıllı bir mobil uygulamadır. Sade ve sakin arayüz, temassız otomatik algılama ve yüksek gizlilik ilkeleri doğrultusunda tasarlanmıştır. Kamera veya yüz tanıma gibi müdahaleci yöntemler kullanmaz; tüm işlemler cihazınızın yerel sensörleri üzerinden %100 çevrimdışı ve güvenle gerçekleştirilir.',
  description_en = 'RekatSay is a minimalist and smart mobile application designed to keep track of rakat and sujud counts during prayer without confusion, allowing full focus on worship. Built on principles of touchless automatic detection, a calm interface, and total privacy with no camera or facial recognition.',
  description_ar = 'تطبيق RekatSay هو تطبيق محمول ذكي وبسيط مصمم لمتابعة عدد الركعات والسجدات أثناء الصلاة دون ارتباك، مما يتيح لك التركيز الكامل في العبادة. يعتمد على الكشف التلقائي بدون لمس، واجهة هادئة، وخصوصية تامة بدون استخدام الكاميرا أو التعرف على الوجه.',
  icon_url = 'media/rekatsay/icon.png',
  cover_url = 'media/rekatsay/cover.png',
  feature_cards_json = json('[
    {
      "id": "rs_1",
      "icon": "🖐️",
      "title_tr": "Temassız Otomatik Secde Algılama",
      "title_en": "Touchless Automatic Sujud Detection",
      "title_ar": "كشف السجود التلقائي بدون لمس",
      "description_tr": "Cihazınızın yakınlık ve ışık sensörlerinden yararlanarak secdeye varış hareketini temassız şekilde algılar; akıllı algoritmasıyla hatalı veya çift sayımları önler.",
      "description_en": "Detects prostration movements touchlessly using your device''s proximity and ambient light sensors; smart algorithm prevents false or double counts.",
      "description_ar": "الكشف عن حركة السجود بدون لمس باستخدام مستشعرات القرب والإضاءة في جهازك؛ تمنع خوارزميته الذكية العد الخاطئ أو المزدوج."
    },
    {
      "id": "rs_2",
      "icon": "📿",
      "title_tr": "Rekat ve Secde Sayacı",
      "title_en": "Rakat & Sujud Counter",
      "title_ar": "عداد الركعات والسجدات",
      "description_tr": "Eda edilen namaz boyunca rekat ve secde sayılarını net biçimde ekranda gösterir; ibadet esnasında zihinsel dağınıklığı önler.",
      "description_en": "Displays the count of rakats and sujud clearly on the screen throughout your prayer, preventing mental distraction.",
      "description_ar": "عرض عدد الركعات والسجدات بوضوح على الشاشة طوال الصلاة، مما يمنع التشتت الذهني أثناء العبادة."
    },
    {
      "id": "rs_3",
      "icon": "🎯",
      "title_tr": "Kolay Kalibrasyon ve Sensör Ayarı",
      "title_en": "Easy Calibration & Sensor Settings",
      "title_ar": "معايرة سهلة وإعدادات المستشعر",
      "description_tr": "Telefonu yere yerleştirdiğiniz duruş mesafesine göre pratik kalibrasyon ve sensör duyarlılık ayarları sunar.",
      "description_en": "Offers practical calibration and sensor sensitivity adjustments based on the placement distance on the floor.",
      "description_ar": "يوفر معايرة عملية وإعدادات حساسية المستشعر بناءً على مسافة وضع الهاتف على الأرض."
    },
    {
      "id": "rs_4",
      "icon": "🌙",
      "title_tr": "Açık / Koyu Mod (Sağ Üst Toggle)",
      "title_en": "Light / Dark Mode (Top Right Toggle)",
      "title_ar": "الوضع الفاتح / الداكن (مفتاح أعلى اليمين)",
      "description_tr": "Ekranın sağ üst tarafında bulunan pratik Toggle anahtarı sayesinde açık ve koyu (Karanlık Mod) temaları arasında kolayca geçiş yapabilirsiniz.",
      "description_en": "Easily switch between Light and Dark mode themes using the convenient toggle switch located at the top right of the screen.",
      "description_ar": "إمكانية التنقل السهل بين الوضع الفاتح والداكن (Dark Mode) باستخدام مفتاح التبديل المريح في أعلى يمين الشاشة."
    },
    {
      "id": "rs_5",
      "icon": "🕊️",
      "title_tr": "Sakin ve Minimalist Tasarım",
      "title_en": "Peaceful & Minimalist Design",
      "title_ar": "تصميم هادئ وبسيط",
      "description_tr": "Gözü yormayan renkler, reklam ve oyunlaştırma (puan/rozet) içermeyen yapısıyla ibadet ciddiyetine tam uyum sağlar.",
      "description_en": "Eye-pleasing colors, free of ads or gamification (points/badges), perfectly matching the tranquility of worship.",
      "description_ar": "ألوان مريحة للعين، خالية من الإعلانات وعناصر الألعاب (نقاط/شارات)، وتتوافق تماماً مع خشوع الصلاة."
    },
    {
      "id": "rs_6",
      "icon": "🔒",
      "title_tr": "%100 Çevrimdışı Çalışma & Tam Gizlilik",
      "title_en": "100% Offline & Full Privacy",
      "title_ar": "100% عمل بدون إنترنت وخصوصية كاملة",
      "description_tr": "Yüz tanıma, görüntü veya ses kaydı yapılmaz; tüm veriler cihaz yerel hafızasında saklanır, hesap gerektirmez ve pil dostudur.",
      "description_en": "No facial recognition, camera, or audio recording; all data stays on local device storage, no account needed, and battery friendly.",
      "description_ar": "لا يوجد التعرف على الوجه، أو تسجيل فيديو أو صوت؛ تبقى جميع البيانات على الجهاز محلياً، لا يتطلب حساباً وموفر للبطارية."
    }
  ]')
WHERE app_id = 'rekatsay';

-- 3. Date Counter Güncellemesi (Main dalındaki 6 kart ve tam metinler)
UPDATE apps SET
  name_tr = 'Date Counter (Tarih & Hedef Sayacı)',
  name_en = 'Date Counter (Date & Goal Tracker)',
  name_ar = 'Date Counter (عداد التاريخ والأهداف)',
  description_tr = 'Date Counter (Tarih & Hedef Sayacı); hedef yaş hesaplamalarının yanı sıra sınav süreçleri, proje teslim tarihleri, askerlik dönüşü, yıl dönümleri veya hayatınızdaki önemli dönüm noktalarını anlık olarak takip etmenizi sağlayan şık ve gelişmiş bir masaüstü zaman yönetim aracıdır. Masaüstünüzde ve görev çubuğunuzda gözü yormayan şeffaf ve minimalist tasarımıyla yer alan uygulama; sade kullanım, yüksek kişiselleştirme, hassas zaman senkronizasyonu, tam 3 dil desteği ve %100 çevrimdışı gizlilik ilkeleriyle geliştirilmiştir. Hesap açma zorunluluğu yoktur; tüm hedef tarihleriniz doğrudan bilgisayarınızda güvenle saklanır.',
  description_en = 'Date Counter (Date & Goal Tracker) is a sleek and advanced desktop time management tool designed to track target age milestones as well as exam schedules, project deadlines, military service countdowns, anniversaries, or important milestone dates in your life. Featuring a clean and minimalist desktop and taskbar docking design, it is built on principles of ease of use, high customizability, precise time synchronization, full 3-language support, and 100% offline privacy. No account required; all target dates remain safe on your device.',
  description_ar = 'تطبيق Date Counter (عداد التاريخ والأهداف) هو أداة أنيقة ومتقدمة لإدارة الوقت على سطح المكتب تتيح لك متابعة حسابات العمر المستهدف، إلى جانب فترات الامتحانات، مواعيد تسليم المشاريع، العودة من الخدمة العسكرية، الذكريات السنوية، أو المحطات الهامة في حياتك بشكل فوري. بتصميم شفاف وبسيط على سطح المكتب وشريط المهام، تم تطويره وفق مبادئ سهولة الاستخدام، التخصيص العالي، التزامن الدقيق للوقت، الدعم الكامل لـ 3 لغات، والخصوصية الكاملة بدون إنترنت. لا يتطلب حساباً؛ تبقى جميع مواعيدك المحفوظة آمنة على جهازك.',
  icon_url = 'media/date-counter/icon.png',
  cover_url = 'media/date-counter/cover.png',
  feature_cards_json = json('[
    {
      "id": "dc_1",
      "icon": "🔒",
      "title_tr": "Görev Çubuğu Entegrasyonu (Taskbar Docking)",
      "title_en": "Taskbar Docking & Widget",
      "title_ar": "تكامل شريط المهام ودجت",
      "description_tr": "Ekranı kaplamadan görev çubuğunda yatay kaydırılabilir, Always-on-Top (Her zaman üstte) ve şeffaf sayaç görünümü.",
      "description_en": "Horizontal dockable widget on the taskbar, Always-on-Top floating mode, and transparent counter layout.",
      "description_ar": "ودجت أفقية على شريط المهام دون تغطية الشاشة، مع وضع البقاء في المقدمة دائماً والشريط الشفاف."
    },
    {
      "id": "dc_2",
      "icon": "🎯",
      "title_tr": "3 Farklı Hesaplama Modu",
      "title_en": "3 Flexible Target Modes",
      "title_ar": "3 أنماط حساب مرنة",
      "description_tr": "Hedeflenen Süre (65), kullanıcının belirlediği Özel Yaş veya sınav/proje teslimi gibi gelecekteki Özel Tarih hedefleri.",
      "description_en": "Target Duration (65), custom target age, or specific milestone dates like exams, projects, and anniversaries.",
      "description_ar": "المدة المستهدفة (65)، العمر المستهدف المخصص، أو التواريخ الهامة المحددة مثل الامتحانات والمشاريع."
    },
    {
      "id": "dc_3",
      "icon": "📊",
      "title_tr": "Çoklu Zaman Formatı Gösterimi",
      "title_en": "Multiple Time Format Display",
      "title_ar": "عرض بتنسيقات زمنية متعددة",
      "description_tr": "Kalan süreyi Detaylı (Yıl, Ay, Gün, HH:MM:SS), Gün Bazlı (Toplam gün), veya Toplam Saat, Dakika ve Saniye formatlarında canlı görüntüleyebilme.",
      "description_en": "Live display of remaining time in Detailed (Year, Month, Day, HH:MM:SS), Day-based, or Total Hours, Minutes, and Seconds formats.",
      "description_ar": "عرض مباشر للوقت المتبقي بتنسيق تفصيلي (سنة، شهر، يوم، HH:MM:SS)، حسب الأيام الإجمالية، أو بإجمالي الساعات والدقائق."
    },
    {
      "id": "dc_4",
      "icon": "🎨",
      "title_tr": "Gelişmiş Görsel Tasarım & Fontlar",
      "title_en": "Custom Visuals & Typography",
      "title_ar": "تخصيص المظهر والخطوط",
      "description_tr": "İnce (Thin), Normal, Kalın (Bold) fontlar, renk özelleştirme, font boyutları ve ekran ölçekleme (Scale) tercihleri.",
      "description_en": "Thin, Normal, Bold font weights, custom color accents, font families, font sizes, and UI scaling control.",
      "description_ar": "خطوط رفيعة، عادية، وعريضة، تخصيص الألوان، وأحجام الخطوط وقياس الواجهة التكيفية (Scale)."
    },
    {
      "id": "dc_5",
      "icon": "🌐",
      "title_tr": "Tam 3 Dil Desteği (TR, EN, AR)",
      "title_en": "Full 3 Language Support",
      "title_ar": "دعم كامل لـ 3 لغات",
      "description_tr": "Türkçe, İngilizce ve Arapça anlık dinamik arayüz değişimi, tam yerelleştirilmiş bildirimler ve rehberler.",
      "description_en": "Instant real-time interface language switching between Turkish, English, and Arabic.",
      "description_ar": "التبديل الفوري والديناميكي للواجهة بين التركية، الإنجليزية، والعربية بنقرة واحدة."
    },
    {
      "id": "dc_6",
      "icon": "🛡️",
      "title_tr": "%100 Gizlilik & Çevrimdışı Güvenlik",
      "title_en": "100% Offline & Privacy",
      "title_ar": "100% عمل بدون إنترنت وخصوصية",
      "description_tr": "Üyelik veya hesap gerektirmez; tüm hedef verileriniz yerel bilgisayarınızda (settings.json) saklanır, son derece hafif mimari.",
      "description_en": "No signup required; all settings and target dates stay safe locally on your PC (settings.json) with low CPU usage.",
      "description_ar": "بدون تسجيل حساب؛ يتم حفظ جميع البيانات محلياً على جهازك (settings.json) وبنية خفيفة تستهلك المعالج بحد أدنى."
    }
  ]')
WHERE app_id = 'date_counter';

-- 4. DeskPilot Eklemesi (Yoksa Ekle, Varsa Güncelle)
INSERT OR IGNORE INTO apps (
  id, app_id, name_tr, name_en, name_ar,
  description_tr, description_en, description_ar,
  features_tr, features_en, features_ar,
  icon_url, cover_url, category, platform, display_order, is_active,
  store_links_json, feature_cards_json
) VALUES (
  'app_deskpilot', 'deskpilot',
  'DeskPilot', 'DeskPilot', 'DeskPilot',
  'Operasyonel hızı artıran, eklenti tabanlı modüler verimlilik asistanı. Günlük masaüstü görevlerinizi otomatize eder ve iş akışınızı hızlandırır.',
  'Plugin-based modular productivity assistant that increases operational speed. Automates your daily desktop tasks and accelerates your workflow.',
  'مساعد إنتاجية معياري قائم على المكونات الإضافية يزيد من سرعة التشغيل. يطوّر مهام سطح المكتب اليومية ويسرّع سير عملك.',
  'Akıllı Makro Motoru\nTek Tıkla Görev Dizileri\nSistem Kaynağını Tüketmeyen Yapı',
  'Smart Macro Engine\nOne-Click Task Sequences\nLightweight CPU & RAM Footprint',
  'محرك الماكرو الذكي\nسلسلة المهام بضغطة واحدة\nخفيف جداً على النظام',
  'media/deskpilot/icon.png', 'media/deskpilot/cover.png',
  'utility', 'desktop', 4, 1,
  '{"github":"https://github.com/mskaymaz/DeskPilot"}',
  json('[
    {
      "id": "dp_1",
      "icon": "🧩",
      "title_tr": "Modüler Eklentiler",
      "title_en": "Modular Plugins",
      "title_ar": "مكونات إضافية معيارية",
      "description_tr": "İhtiyacınıza göre açılıp kapatılabilen, sistemi yormayan dinamik eklenti mimarisi.",
      "description_en": "Dynamic lightweight plugin architecture that can be toggled based on your needs.",
      "description_ar": "بنية إضافات ديناميكية وخفيفة يمكن تفعيلها حسب حاجتك دون إرهاق النظام."
    },
    {
      "id": "dp_2",
      "icon": "⚡",
      "title_tr": "Hızlı Komut Paleti",
      "title_en": "Quick Command Palette",
      "title_ar": "لوحة أوامر سريعة",
      "description_tr": "Klavye kısayolları ve evrensel arama çubuğu ile tüm masaüstü eylemlerini saniyeler içinde tetikleyin.",
      "description_en": "Trigger all desktop routines and actions in seconds using global shortcuts and quick search.",
      "description_ar": "تشغيل جميع الإجراءات المكتبية في ثوانٍ باستخدام الاختصارات ولوحة البحث الفوري."
    },
    {
      "id": "dp_3",
      "icon": "📊",
      "title_tr": "Verimlilik Analizleri",
      "title_en": "Productivity Analytics",
      "title_ar": "تحليلات الإنتاجية",
      "description_tr": "Hangi görevde ne kadar zaman harcadığınızı şeffaf ve yerel kayıtlarla görselleştirin.",
      "description_en": "Visualize time spent on desktop tasks transparently with local analytics reports.",
      "description_ar": "تصور الوقت المستغرق في المهام اليومية بشفافية عبر تقارير تحليلية محلية."
    }
  ]')
);

INSERT OR IGNORE INTO app_versions (
  id, app_id, version_name, version_code,
  changelog_tr, changelog_en, changelog_ar,
  download_url, platform, file_size_mb, is_mandatory
) VALUES (
  'ver_deskpilot_100', 'app_deskpilot', '1.4.2', 1,
  'İlk kararlı masaüstü verimlilik sürümü yayınlandı.',
  'First stable desktop productivity version released.',
  'تم إطلاق أول إصدار مستقر لإنتاجية سطح المكتب.',
  '/dl/deskpilot.zip', 'windows', 22.4, 0
);

-- 5. En Yakın Eklemesi (Yoksa Ekle, Varsa Güncelle)
INSERT OR IGNORE INTO apps (
  id, app_id, name_tr, name_en, name_ar,
  description_tr, description_en, description_ar,
  features_tr, features_en, features_ar,
  icon_url, cover_url, category, platform, display_order, is_active,
  store_links_json, feature_cards_json
) VALUES (
  'app_enyakin', 'enyakin',
  'En Yakın Camii & Mescid', 'Nearest Mosque Finder', 'أقرب مسجد',
  'Kritik hizmet noktalarını anında tespit eden lokasyon motoru. Bulunduğunuz konuma en yakın acil, sosyal ve kamu hizmet alanlarını harita üzerinde anında listeler.',
  'Location engine that instantly detects critical service points. Instantly lists nearest emergency, social, and public service areas on map based on your location.',
  'محرك الموقع الذي يكتشف نقاط الخدمة الحرجة على الفور. يعرض فوراً أقرب مناطق الطوارئ والخدمات الاجتماعية والعامة على الخريطة بناءً على موقعك.',
  'Canlı GPS Navigasyonu\nCuma Namazı Yer Bulucu',
  'Live GPS Navigation\nFriday Prayer Finder',
  'ملاحة GPS مباشرة\nمحدد صلاة الجمعة',
  'img/EnYakinLogo.svg', 'img/EnYakinLogo.svg',
  'utility', 'mobile', 5, 1,
  '{"github":"https://github.com/mskaymaz/EnYakin"}',
  json('[
    {
      "id": "ey_1",
      "icon": "🗺️",
      "title_tr": "Canlı Harita Motoru",
      "title_en": "Live Map Engine",
      "title_ar": "محرك الخريطة المباشر",
      "description_tr": "Çevrenizdeki tüm cami, mescit ve kritik hizmet noktalarını hassas mesafe sıralamasıyla harita üzerinde anında görün.",
      "description_en": "Locate all mosques and critical services around you on the live interactive map sorted by distance.",
      "description_ar": "عرض جميع المساجد ونقاط الخدمة الحرجة حولك فوراً على خريطة تفاعلية مرتبة حسب المسافة."
    },
    {
      "id": "ey_2",
      "icon": "🏥",
      "title_tr": "Kritik Hizmet Filtreleme",
      "title_en": "Critical Service Filter",
      "title_ar": "تصفية الخدمات الحرجة",
      "description_tr": "Eczane, acil servis, kamu binaları ve ibadethaneleri tek tıkla kategorize edin.",
      "description_en": "Filter pharmacies, emergency services, civic offices, and worship places with a single tap.",
      "description_ar": "تصفية الصيدليات، خدمات الطوارئ، المباني العامة، ودور العبادة بنقرة واحدة."
    },
    {
      "id": "ey_3",
      "icon": "🚀",
      "title_tr": "Tek Tıkla Navigasyon",
      "title_en": "One-Click Navigation",
      "title_ar": "ملاحة بنقرة واحدة",
      "description_tr": "Google Haritalar, Apple Haritalar veya varsayılan navigasyon uygulamanızla rotanızı hemen başlatın.",
      "description_en": "Start your turn-by-turn route instantly using Google Maps, Apple Maps, or your default navigation app.",
      "description_ar": "بدء التوجيه الصوتي خطوة بخطوة فوراً عبر خرائط Google أو Apple أو تطبيق الملاحة المفضل لديك."
    }
  ]')
);

INSERT OR IGNORE INTO app_versions (
  id, app_id, version_name, version_code,
  changelog_tr, changelog_en, changelog_ar,
  download_url, platform, file_size_mb, is_mandatory
) VALUES (
  'ver_enyakin_100', 'app_enyakin', '1.2.0', 1,
  'En yakın mescit ve cami navigasyon motoru yayına alındı.',
  'Nearest mosque and prayer place navigation engine launched.',
  'تم إطلاق محرك ملاحة أقرب المساجد والمصليات.',
  '/dl/enyakin.apk', 'android', 15.0, 0
);

-- 6. GÇ Pil Uyarı Eklemesi (Yoksa Ekle, Varsa Güncelle)
INSERT OR IGNORE INTO apps (
  id, app_id, name_tr, name_en, name_ar,
  description_tr, description_en, description_ar,
  features_tr, features_en, features_ar,
  icon_url, cover_url, category, platform, display_order, is_active,
  store_links_json, feature_cards_json
) VALUES (
  'app_gcpiluyari', 'gcpiluyari',
  'GÇ Pil Uyarı', 'GC Battery Alert', 'تنبيه البطارية',
  'Donanım sağlığını koruyan arka plan izleme ve bildirim servisi. Dizüstü bilgisayarınızın pil ömrünü uzatmak için şarj seviyelerini akıllıca takip eder.',
  'Background monitoring and notification service protecting hardware health. Intelligently tracks battery levels to extend your laptop''s battery lifespan.',
  'خدمة المراقبة والإشعارات الخلفية التي تحمي صحة الأجهزة. تتبع مستويات البطارية بذكاء لتطيل عمر بطارية الكمبيوتر المحمول.',
  '%80 Şarj Koruma Alarmı\nSıcaklık ve Sağlık Analizi',
  '80% Charge Limit Alarm\nTemperature & Health Diagnostics',
  'منبه شحن 80%\nتشخيص الحرارة والصحة',
  'media/gcpiluyari/icon.png', 'media/gcpiluyari/cover.png',
  'utility', 'desktop', 6, 1,
  '{"github":"https://github.com/mskaymaz/GCPilUyari"}',
  json('[
    {
      "id": "gc_1",
      "icon": "🔋",
      "title_tr": "Pil Sağlığı Koruması",
      "title_en": "Battery Health Protection",
      "title_ar": "حماية صحة البطارية",
      "description_tr": "Dizüstü bilgisayarınızın pil ömrünü uzatmak için şarj seviyelerini akıllıca takip eder, aşırı dolumu önler.",
      "description_en": "Intelligently monitors battery levels to extend laptop battery longevity and prevent overcharging.",
      "description_ar": "مراقبة ذكية لمستويات شحن البطارية لإطالة عمر بطارية الكمبيوتر المحمول ومنع الشحن الزائد."
    },
    {
      "id": "gc_2",
      "icon": "⚙️",
      "title_tr": "Sessiz Arka Plan Servisi",
      "title_en": "Silent Background Service",
      "title_ar": "خدمة خلفية صامتة",
      "description_tr": "CPU ve bellek tüketmeyen ultra hafif sistem tepsisi servisi olarak kesintisiz çalışır.",
      "description_en": "Operates seamlessly as an ultra-lightweight system tray service without consuming CPU or memory.",
      "description_ar": "يعمل بسلاسة كخدمة خفيفة جداً في شريط المهام دون استهلاك المعالج أو الذاكرة."
    },
    {
      "id": "gc_3",
      "icon": "🔊",
      "title_tr": "Özelleştirilebilir Sesler",
      "title_en": "Customizable Audio",
      "title_ar": "أصوات قابلة للتخصيص",
      "description_tr": "Belirlediğiniz kritik eşiklerde zevkinize uygun sesli veya görsel uyarılarla sizi bilgilendirir.",
      "description_en": "Notifies you with pleasant audio or visual alerts when reaching your predefined battery thresholds.",
      "description_ar": "تنبيهات صوتية أو بصرية مخصصة عند الوصول إلى عتبات الشحن المحددة مسبقاً."
    }
  ]')
);

INSERT OR IGNORE INTO app_versions (
  id, app_id, version_name, version_code,
  changelog_tr, changelog_en, changelog_ar,
  download_url, platform, file_size_mb, is_mandatory
) VALUES (
  'ver_gcpiluyari_100', 'app_gcpiluyari', '1.1.0', 1,
  'Akıllı pil ve donanım koruma bildirim motoru yayında.',
  'Smart battery and hardware protection alert engine launched.',
  'تم إطلاق محرك تنبيه حماية البطارية والأجهزة الذكية.',
  '/dl/gcpiluyari.zip', 'windows', 8.5, 0
);
