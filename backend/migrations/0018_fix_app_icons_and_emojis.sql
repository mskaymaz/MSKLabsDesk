-- 0018_fix_app_icons_and_emojis.sql
-- Uygulama ikon ve emojilerinin D1 veritabanında standartlaştırılması

-- EnYakın: Bozuk PNG yerine doğrudan geçerli SVG logosunu bağla
UPDATE apps SET icon_url = 'img/EnYakinLogo.svg' WHERE app_id = 'enyakin' OR app_id = 'en_yakin';

-- GÇ Pil Uyarı: Hazırlanan vektörel SVG ikonunu bağla
UPDATE apps SET icon_url = 'media/gcpiluyari/icon.svg' WHERE app_id = 'gcpiluyari' OR app_id = 'gc_pil_uyari';

-- Planlama aşamasındaki projeler için vitrin emojilerini bağla
UPDATE apps SET icon_url = '📝' WHERE app_id = 'notes';
UPDATE apps SET icon_url = '📄' WHERE app_id = 'docuedit';
UPDATE apps SET icon_url = '🖨️' WHERE app_id = 'pdflayout';
