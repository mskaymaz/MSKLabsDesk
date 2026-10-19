-- 0015_restore_haydinamaza_full_data.sql
-- Haydi Namaza uygulamasının özet, detay açıklaması ve 9 özellik kartını eksiksiz geri yükleme

UPDATE apps SET
  name_tr = 'Haydi Namaza',
  name_en = 'Haydi Namaza',
  name_ar = 'حي على الصلاة',
  summary_tr = 'Lokasyon bazlı ibadet planlaması ve zaman yönetimi otomasyonu.',
  summary_en = 'Location-based worship planning and time management automation.',
  summary_ar = 'تخطيط العبادة القائم على الموقع وأتمتة إدارة الوقت.',
  description_tr = 'Haydi Namaza; günlük namaz vakitlerinizi takip etmenizi, kıble yönünüzü kolayca bulmanızı, günlük hatırlatma maksatlı yayınlanan dinî içeriklere ulaşmanızı ve vakit bildirimlerinizi tamamen kendi tercihlerinize göre kişiselleştirmenizi sağlayan modern bir mobil yardımcı uygulamadır. Sade arayüz, çevrimdışı kullanım kolaylığı, tam kullanıcı kontrolü ve veri şeffaflığı ilkeleriyle geliştirilmektedir. Hesap açma zorunluluğu bulunmaz; verileriniz ve kişisel ayarlarınız güvende kalacak şekilde doğrudan kendi cihazınızda saklanır.',
  description_en = 'Haydi Namaza is a modern mobile assistant application that allows you to track your daily prayer times, easily find the Qibla direction, access daily religious reminder content, and fully customize your prayer notifications. Developed with principles of a clean interface, offline-first convenience, full user control, and data transparency. No account creation required; your data and preferences remain safe on your device.',
  description_ar = 'تطبيق "Haydi Namaza" هو تطبيق محمول حديث يتيح لك متابعة أوقات الصلاة اليومية، وإيجاد اتجاه القبلة بسهولة، والوصول إلى المحتويات الدينية التذكيرية اليومية، وتخصيص إشعارات أوقات الصلاة بالكامل وفقاً لتفضيلاتك. يتم تطويره وفق مبادئ الواجهة البسيطة، سهولة الاستخدام بدون إنترنت، التحكم الكامل للمستخدم، وشفافية البيانات. لا يتطلب إنشاء حساب؛ تبقى بياناتك وتفضيلاتك آمنة على جهازك.',
  icon_url = 'media/haydinamaza/icon.png',
  cover_url = 'media/haydinamaza/cover.png',
  category = 'Mobil',
  platform = 'Android / iOS',
  display_order = 1,
  is_active = 1,
  store_links_json = '{"google_play":"https://play.google.com/store/apps/details?id=org.msklabs.haydinamaza","github":"https://github.com/mskaymaz/HaydiNamaza"}',
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
