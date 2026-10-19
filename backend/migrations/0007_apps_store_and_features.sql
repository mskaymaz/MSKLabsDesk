-- MSKLabsDesk — Migration 0007: Apps Store Links, Features & Initial Seed
-- Tarih: 16.10.2026

ALTER TABLE apps ADD COLUMN store_links_json TEXT DEFAULT '{}';
ALTER TABLE apps ADD COLUMN features_tr TEXT;
ALTER TABLE apps ADD COLUMN features_en TEXT;
ALTER TABLE apps ADD COLUMN features_ar TEXT;
ALTER TABLE apps ADD COLUMN screenshots_json TEXT DEFAULT '[]';
ALTER TABLE apps ADD COLUMN downloads_count INTEGER DEFAULT 0;

-- 1. HaydiNamaza
INSERT OR IGNORE INTO apps (
    id, app_id, name_tr, name_en, name_ar,
    description_tr, description_en, description_ar,
    features_tr, features_en, features_ar,
    icon_url, cover_url, category, platform, display_order, is_active,
    store_links_json
) VALUES (
    'app_haydinamaza', 'haydinamaza',
    'HaydiNamaza', 'HaydiNamaza', 'حي على الصلاة',
    'Lokasyon bazlı ibadet planlaması ve zaman yönetimi otomasyonu.',
    'Location-based worship planning and time management automation.',
    'تخطيط العبادة القائم على الموقع وأتمتة إدارة الوقت.',
    'Hassas konum bazlı vakit hesaplama\nAkıllı sessize alma ve bildirimler\nKıble pusulası ve zikirmatik',
    'Precise location-based prayer calculation\nSmart silent mode and notifications\nQibla compass and dhikr counter',
    'حساب دقيق لمواقيت الصلاة حسب الموقع\nوضع صامت ذكي وتنبيهات\nبوصلة القبلة والمسبحة الإلكترونية',
    'https://msklabs.org/media/haydinamaza/icon.png', 'https://msklabs.org/media/haydinamaza/cover.png',
    'utility', 'mobile', 1, 1,
    '{"google_play":"https://play.google.com/store/apps/details?id=com.msklabs.haydinamaza","github":"https://github.com/mskaymaz/HaydiNamaza"}'
);

INSERT OR IGNORE INTO app_versions (
    id, app_id, version_name, version_code,
    changelog_tr, changelog_en, changelog_ar,
    download_url, platform, file_size_mb, is_mandatory
) VALUES (
    'ver_haydinamaza_100', 'app_haydinamaza', '1.0.0', 1,
    'İlk kararlı sürüm yayınlandı. Konum bazlı vakit hesaplama ve ezan bildirimleri eklendi.',
    'Initial stable release published. Location prayer times and adhan notifications added.',
    'تم إطلاق الإصدار المستقر الأول. تمت إضافة حساب مواقيت الصلاة وإشعارات الأذان.',
    '/dl/haydinamaza.apk', 'android', 24.5, 0
);

-- 2. RekatSay
INSERT OR IGNORE INTO apps (
    id, app_id, name_tr, name_en, name_ar,
    description_tr, description_en, description_ar,
    features_tr, features_en, features_ar,
    icon_url, cover_url, category, platform, display_order, is_active,
    store_links_json
) VALUES (
    'app_rekatsay', 'rekatsay',
    'RekatSay', 'RekatSay', 'عداد الركعات',
    'Odaklanmayı artıran, minimalist ve etkileşimli takip aracı.',
    'A minimalist and interactive tracking tool that increases focus.',
    'أداة تتبع تفاعلية وبسيطة تزيد من التركيز.',
    'Minimalist tek dokunuş sayaç\nHassas sensör desteği\nGece ve gündüz yüksek kontrast teması',
    'Minimalist one-touch counter\nPrecision proximity sensor support\nDay and night high contrast theme',
    'عداد بسيط بلمسة واحدة\nدعم مستشعر التقارب الحساس\nسمة عالية التباين ليلية ونهارية',
    'https://msklabs.org/media/rekatsay/icon.png', 'https://msklabs.org/media/rekatsay/cover.png',
    'utility', 'mobile', 2, 1,
    '{"google_play":"https://play.google.com/store/apps/details?id=com.msklabs.rekatsay","github":"https://github.com/mskaymaz/RekatSay"}'
);

INSERT OR IGNORE INTO app_versions (
    id, app_id, version_name, version_code,
    changelog_tr, changelog_en, changelog_ar,
    download_url, platform, file_size_mb, is_mandatory
) VALUES (
    'ver_rekatsay_100', 'app_rekatsay', '1.0.0', 1,
    'Minimalist rekat takip aracı kullanıma sunuldu.',
    'Minimalist rakah tracking tool released.',
    'تم إطلاق أداة تتبع الركعات البسيطة.',
    '/dl/rekatsay.apk', 'android', 12.0, 0
);

-- 3. Date Counter
INSERT OR IGNORE INTO apps (
    id, app_id, name_tr, name_en, name_ar,
    description_tr, description_en, description_ar,
    features_tr, features_en, features_ar,
    icon_url, cover_url, category, platform, display_order, is_active,
    store_links_json
) VALUES (
    'app_date_counter', 'date_counter',
    'Date Counter (Tarih & Hedef Sayacı)', 'Date Counter (Date & Goal Tracker)', 'عداد التاريخ والأهداف',
    'Emeklilik, sınav ve özel hedeflerinizi masaüstünüzde ve görev çubuğunuzda canlı takip eden gelişmiş zaman sayacı.',
    'Desktop & taskbar timer tracking retirement, exams, and milestones in real-time.',
    'مؤقت سطح المكتب وشريط المهام لمتابعة التقاعد والامتحانات والتواريخ الهامة في الوقت الفعلي.',
    'Windows görev çubuğu canlı göstergesi\nGeri sayım ve ileri sayım sayaçları\nÖzelleştirilebilir alarm ve bildirimler',
    'Windows taskbar live indicator\nCountdown and count-up timers\nCustomizable alerts and notifications',
    'مؤشر حي لشريط مهام ويندوز\nمؤقتات العد التنازلي والتصاعدي\nتنبيهات وإشعارات قابلة للتخصيص',
    'https://msklabs.org/media/date-counter/icon.png', 'https://msklabs.org/media/date-counter/cover.png',
    'utility', 'desktop', 3, 1,
    '{"windows_store":"https://apps.microsoft.com","github":"https://github.com/mskaymaz/DateCounter"}'
);

INSERT OR IGNORE INTO app_versions (
    id, app_id, version_name, version_code,
    changelog_tr, changelog_en, changelog_ar,
    download_url, platform, file_size_mb, is_mandatory
) VALUES (
    'ver_date_counter_100', 'app_date_counter', '1.0.0', 1,
    'Windows masaüstü sürümü yayınlandı. Görev çubuğu eklentisi aktif.',
    'Windows desktop release published. Taskbar widget enabled.',
    'تم إطلاق إصدار سطح المكتب لنظام ويندوز مع تفعيل أداة شريط المهام.',
    '/dl/DateCounterSetup.exe', 'windows', 18.2, 0
);
