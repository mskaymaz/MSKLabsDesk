-- MSKLabsDesk — Migration 0010: Ana Uygulamalar Kart Özet Metinleri (Main Eşitlemesi)
-- Tarih: 19.10.2026 - 15:10

-- 1. HaydiNamaza
UPDATE apps SET
  description_tr = 'Lokasyon bazlı ibadet planlaması ve zaman yönetimi otomasyonu.',
  description_en = 'Location-based worship planning and time management automation.',
  description_ar = 'تخطيط العبادة القائم على الموقع وأتمتة إدارة الوقت.'
WHERE app_id = 'haydinamaza';

-- 2. RekatSay
UPDATE apps SET
  description_tr = 'Odaklanmayı artıran, minimalist ve etkileşimli takip aracı.',
  description_en = 'A minimalist and interactive tracking tool that increases focus.',
  description_ar = 'أداة تتبع تفاعلية وبسيطة تزيد من التركيز.'
WHERE app_id = 'rekatsay';

-- 3. Date Counter
UPDATE apps SET
  description_tr = 'Emeklilik, sınav ve özel hedeflerinizi masaüstünüzde ve görev çubuğunuzda canlı takip eden gelişmiş zaman sayacı.',
  description_en = 'Desktop & taskbar timer tracking retirement, exams, and milestones in real-time.',
  description_ar = 'مؤقت سطح المكتب وشريط المهام لمتابعة التقاعد والامتحانات والتواريخ الهامة.'
WHERE app_id = 'date_counter';

-- 4. DeskPilot
UPDATE apps SET
  description_tr = 'Operasyonel hızı artıran, eklenti tabanlı modüler masaüstü verimlilik asistanı.',
  description_en = 'Plugin-based modular desktop productivity assistant.',
  description_ar = 'مساعد إنتاجية معياري لسطح المكتب.'
WHERE app_id = 'deskpilot';

-- 5. En Yakın
UPDATE apps SET
  description_tr = 'Kritik hizmet noktalarını anında tespit eden mobil lokasyon motoru.',
  description_en = 'Location engine that instantly detects critical service points.',
  description_ar = 'محرك الموقع الذي يكتشف نقاط الخدمة الحرجة.'
WHERE app_id = 'enyakin';

-- 6. GÇ Pil Uyarı
UPDATE apps SET
  description_tr = 'Görev çubuğu üzerinde donanım sağlığını koruyan pil izleme ve bildirim servisi.',
  description_en = 'Taskbar battery monitoring and hardware protection service.',
  description_ar = 'خدمة مراقبة البطارية وحماية الأجهزة على شريط المهام.'
WHERE app_id = 'gcpiluyari';
