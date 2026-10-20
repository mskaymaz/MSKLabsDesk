-- MSKLabsDesk — Uygulama Durum Alanı (Status) ve Planlama Aşamasındaki Projeler (Migration 0017)
-- File: 0017_add_apps_status_and_planned_projects.sql

-- 1. apps tablosuna status kolonu ekle
ALTER TABLE apps ADD COLUMN status TEXT DEFAULT 'in_development';

-- 2. Mevcut uygulamaların durumunu güncelle
UPDATE apps SET status = 'active' WHERE is_active = 1;
UPDATE apps SET status = 'in_development' WHERE is_active = 0;

-- 3. Planlama Aşamasındaki Projelerin Eklenmesi (Gerçek Web İçerikleriyle)
-- A. Notes
INSERT OR IGNORE INTO apps (
    id, app_id, name_tr, name_en, name_ar,
    summary_tr, summary_en, summary_ar,
    description_tr, description_en, description_ar,
    category, platform, display_order, is_active, status,
    store_links_json, feature_cards_json
) VALUES (
    'app_notes', 'notes', 'Notes', 'Notes', 'Notes',
    'Fotoğraf, ses kaydı, el çizimi ve metin gibi tüm formatları bünyesinde barındıran gelişmiş not alma sistemi.',
    'Advanced note-taking system combining photo, audio, drawing, and text notes.',
    'نظام تدوين ملاحظات متقدم يجمع بين الصور والصوت والرسم والنصوص.',
    'Fotoğraf, ses kaydı, el çizimi ve metin gibi tüm formatları bünyesinde barındıran gelişmiş not alma sistemi.',
    'Advanced note-taking system combining photo, audio, drawing, and text notes.',
    'نظام تدوين ملاحظات متقدم يجمع بين الصور والصوت والرسم والنصوص.',
    'productivity', 'all', 10, 0, 'planned',
    '{}', '[]'
);

-- B. DocuEdit
INSERT OR IGNORE INTO apps (
    id, app_id, name_tr, name_en, name_ar,
    summary_tr, summary_en, summary_ar,
    description_tr, description_en, description_ar,
    category, platform, display_order, is_active, status,
    store_links_json, feature_cards_json
) VALUES (
    'app_docuedit', 'docuedit', 'DocuEdit', 'DocuEdit', 'DocuEdit',
    'Word, Excel, PowerPoint ve PDF dokümanlarını görüntüleme, düzenleme ve üzerine yazma asistanı.',
    'Document viewer and annotation assistant for Word, Excel, PPT and PDF.',
    'مساعد عرض وتحرير المستندات لـ Word و Excel و PPT و PDF.',
    'Word, Excel, PowerPoint ve PDF dokümanlarını görüntüleme, düzenleme ve üzerine yazma asistanı.',
    'Document viewer and annotation assistant for Word, Excel, PPT and PDF.',
    'مساعد عرض وتحرير المستندات لـ Word و Excel و PPT و PDF.',
    'productivity', 'desktop', 11, 0, 'planned',
    '{}', '[]'
);

-- C. PDF Layout
INSERT OR IGNORE INTO apps (
    id, app_id, name_tr, name_en, name_ar,
    summary_tr, summary_en, summary_ar,
    description_tr, description_en, description_ar,
    category, platform, display_order, is_active, status,
    store_links_json, feature_cards_json
) VALUES (
    'app_pdflayout', 'pdflayout', 'PDF Layout', 'PDF Layout', 'PDF Layout',
    'PDF sayfalarını özel boyutlarda, 2 sayfayı 1 sayfaya basma ve gelişmiş ölçeklendirme ile çıktıya gönderme yöneticisi.',
    'PDF print manager for custom multi-page layouts, scaling and crop printing.',
    'مدير طباعة PDF للتخطيطات المخصصة متعددة الصفحات.',
    'PDF sayfalarını özel boyutlarda, 2 sayfayı 1 sayfaya basma ve gelişmiş ölçeklendirme ile çıktıya gönderme yöneticisi.',
    'PDF print manager for custom multi-page layouts, scaling and crop printing.',
    'مدير طباعة PDF للتخطيطات المخصصة متعددة الصفحات.',
    'utility', 'desktop', 12, 0, 'planned',
    '{}', '[]'
);
