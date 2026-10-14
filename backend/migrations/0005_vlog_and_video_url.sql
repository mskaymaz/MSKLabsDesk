-- MSKLabsDesk — Vlog Channel and Video URL Support
-- Migration: 0005_vlog_and_video_url.sql

-- 1. Blog gönderilerine opsiyonel video URL (YouTube vb.) alanı eklenmesi
ALTER TABLE blog_posts ADD COLUMN video_url TEXT;

-- 2. VLOG kanalının varsayılan olarak pasif (is_active = 0) eklenmesi
INSERT OR IGNORE INTO blog_channels (id, slug, name_tr, name_en, name_ar, description_tr, description_en, description_ar, icon, display_order, is_active)
VALUES (
    'ch_vlog',
    'vlog',
    'VLOG',
    'VLOG',
    'فلوغ',
    'MSK Labs video günlükleri, mimari analizler ve dijital düşünce',
    'MSK Labs video logs, architectural analysis and digital thoughts',
    'يوميات فيديو MSK Labs والتحليلات المعمارية والفكر الرقمي',
    'video',
    4,
    0
);
