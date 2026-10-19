-- 0014_fix_app_icons_and_orders.sql
-- EnYakın ikon URL'sini geçerli media yoluna bağlama ve vitrin sıralamasını normalize etme

UPDATE apps SET icon_url = 'media/enyakin/icon.png' WHERE app_id = 'enyakin';
UPDATE apps SET icon_url = 'media/haydinamaza/icon.png' WHERE app_id = 'haydinamaza';
UPDATE apps SET icon_url = 'media/rekatsay/icon.png' WHERE app_id = 'rekatsay';
UPDATE apps SET icon_url = 'media/date-counter/icon.png' WHERE app_id = 'date_counter';
UPDATE apps SET icon_url = 'media/deskpilot/icon.png' WHERE app_id = 'deskpilot';
UPDATE apps SET icon_url = 'media/gcpiluyari/icon.png' WHERE app_id = 'gcpiluyari';

UPDATE apps SET display_order = 1 WHERE app_id = 'haydinamaza';
UPDATE apps SET display_order = 2 WHERE app_id = 'rekatsay';
UPDATE apps SET display_order = 3 WHERE app_id = 'date_counter';
UPDATE apps SET display_order = 4 WHERE app_id = 'deskpilot';
UPDATE apps SET display_order = 5 WHERE app_id = 'enyakin';
UPDATE apps SET display_order = 6 WHERE app_id = 'gcpiluyari';
