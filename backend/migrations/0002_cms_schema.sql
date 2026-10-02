-- MSKLabsDesk — Dynamic Headless Admin CMS Schema Migration
-- File: 0002_cms_schema.sql

-- 1. Blog Channels (Dinamik Blog Kanalları: BİZCE, ANILTILAR, GÜNCEL, HİKAYELER, ŞİİRLER vb.)
CREATE TABLE IF NOT EXISTS blog_channels (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name_tr TEXT NOT NULL,
    name_en TEXT,
    name_ar TEXT,
    description_tr TEXT,
    description_en TEXT,
    description_ar TEXT,
    icon TEXT DEFAULT 'book-open',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Blog Posts (Blog Yazıları / Makaleler — 3 Dilli & SEO Uyumlu)
CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    
    title_tr TEXT NOT NULL,
    title_en TEXT,
    title_ar TEXT,
    
    content_tr TEXT NOT NULL,
    content_en TEXT,
    content_ar TEXT,
    
    summary_tr TEXT,
    summary_en TEXT,
    summary_ar TEXT,
    
    cover_image TEXT,
    meta_keywords TEXT,
    author_name TEXT DEFAULT 'MSK Labs',
    status TEXT DEFAULT 'draft', -- draft, scheduled, published, archived
    views_count INTEGER DEFAULT 0,
    
    published_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (channel_id) REFERENCES blog_channels(id) ON DELETE CASCADE
);

-- 3. Apps Catalog (Uygulama Kataloğu — webMSKLabs & Tüm Platformlar İçin)
CREATE TABLE IF NOT EXISTS apps (
    id TEXT PRIMARY KEY,
    app_id TEXT UNIQUE NOT NULL, -- örn: 'al-mushaf', 'quran-word-by-word'
    name_tr TEXT NOT NULL,
    name_en TEXT,
    name_ar TEXT,
    
    description_tr TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    
    icon_url TEXT,
    cover_url TEXT,
    category TEXT DEFAULT 'utility',
    platform TEXT DEFAULT 'all', -- mobile, web, desktop, all
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. App Versions (Uygulama Sürüm Takibi & İndirme Linkleri)
CREATE TABLE IF NOT EXISTS app_versions (
    id TEXT PRIMARY KEY,
    app_id TEXT NOT NULL,
    version_name TEXT NOT NULL, -- örn: '2.1.0'
    version_code INTEGER DEFAULT 1,
    
    changelog_tr TEXT,
    changelog_en TEXT,
    changelog_ar TEXT,
    
    download_url TEXT NOT NULL,
    platform TEXT DEFAULT 'android', -- android, ios, windows, mac, web
    file_size_mb REAL DEFAULT 0,
    is_mandatory BOOLEAN DEFAULT 0,
    
    released_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (app_id) REFERENCES apps(id) ON DELETE CASCADE
);

-- 5. Site Templates & Ads (Header Duyuru Bandı, Footer Linkleri, Reklam Kodları)
CREATE TABLE IF NOT EXISTS site_templates (
    id TEXT PRIMARY KEY,
    key_name TEXT UNIQUE NOT NULL, -- 'announcement_bar', 'footer_links', 'ad_banner_top', 'ad_banner_sidebar'
    
    content_tr TEXT,
    content_en TEXT,
    content_ar TEXT,
    
    meta_json TEXT, -- ek stil veya konfigürasyon JSON verisi
    is_active BOOLEAN DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 6. Media Assets (Medya Kütüphanesi & Görsel Yönetimi)
CREATE TABLE IF NOT EXISTS media_assets (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    url TEXT NOT NULL,
    file_size INTEGER DEFAULT 0,
    mime_type TEXT DEFAULT 'image/jpeg',
    
    alt_text_tr TEXT,
    alt_text_en TEXT,
    alt_text_ar TEXT,
    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Seed Data: Varsayılan Blog Kanalları (BİZCE, ANILTILAR, GÜNCEL)
INSERT OR IGNORE INTO blog_channels (id, slug, name_tr, name_en, name_ar, description_tr, display_order) 
VALUES 
('ch_bizce', 'bizce', 'BİZCE', 'OUR OPINION', 'رأينا', 'MSK Labs kurumsal duyuru ve düşünce yazıları', 1),
('ch_aniltilar', 'aniltilar', 'ANILTILAR', 'MEMORIES', 'ذكريات', 'Geçmişten gelen değerli hatıralar ve notlar', 2),
('ch_guncel', 'guncel', 'GÜNCEL', 'CURRENT', 'أخبار حصرية', 'Teknoloji ve yazılım dünyasından güncel haberler', 3);

-- İndeksler (Sorgu Hızı İçin)
CREATE INDEX IF NOT EXISTS idx_posts_channel ON blog_posts(channel_id);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_apps_app_id ON apps(app_id);
CREATE INDEX IF NOT EXISTS idx_app_versions_app ON app_versions(app_id);
