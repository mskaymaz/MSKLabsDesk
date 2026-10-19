-- MSKLabsDesk — Migration 0011: Yapım Aşamasındaki Uygulamaları Yayından Kaldır (is_active = 0)
-- Tarih: 19.10.2026 - 15:20
-- DeskPilot, En Yakın ve GÇ Pil Uyarı yapım aşamasında olduğu için yayındaki uygulamalardan (is_active = 1) çıkarılır.

UPDATE apps SET is_active = 0 WHERE app_id IN ('deskpilot', 'enyakin', 'gcpiluyari');
