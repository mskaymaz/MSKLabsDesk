-- MSKLabsDesk — Medya Varlıkları ve Yönetim Altyapısı Tabloları (Migration 0016)
-- File: 0016_media_assets_and_admin_infra.sql

-- 1. media_assets tablosunu R2 ve sha256 standartlarına modernize et
CREATE TABLE IF NOT EXISTS media_assets_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    r2_key TEXT NOT NULL UNIQUE,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    public_url TEXT NOT NULL,
    sha256 TEXT,
    alt_text TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Eski veriler varsa yeni şemaya taşı
INSERT OR IGNORE INTO media_assets_new (id, filename, r2_key, mime_type, size_bytes, public_url, created_at)
SELECT rowid, filename, COALESCE(url, 'legacy_' || id), COALESCE(mime_type, 'image/jpeg'), COALESCE(file_size, 0), url, created_at 
FROM media_assets;

DROP TABLE IF EXISTS media_assets;
ALTER TABLE media_assets_new RENAME TO media_assets;

CREATE INDEX IF NOT EXISTS idx_media_assets_sha256 ON media_assets(sha256);
CREATE INDEX IF NOT EXISTS idx_media_assets_r2_key ON media_assets(r2_key);

-- 2. rate_limits Tablosu
CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    reset_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset_at ON rate_limits(reset_at);

-- 3. audit_logs Tablosu
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    actor TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- 4. post_audio_assets Tablosu (TTS)
CREATE TABLE IF NOT EXISTS post_audio_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id TEXT NOT NULL,
    language TEXT NOT NULL CHECK(language IN ('TR', 'EN', 'AR')),
    article_version INTEGER NOT NULL DEFAULT 1,
    audio_version INTEGER NOT NULL DEFAULT 1,
    provider TEXT NOT NULL DEFAULT 'DEFAULT',
    model TEXT NOT NULL DEFAULT 'DEFAULT',
    r2_object_key TEXT NOT NULL UNIQUE,
    file_size INTEGER NOT NULL DEFAULT 0,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'DRAFT',
    validation_result_json TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_post_audio_assets_post_lang ON post_audio_assets(post_id, language);

-- 5. post_revisions Tablosu
CREATE TABLE IF NOT EXISTS post_revisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    content_snapshot TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_post_revisions_post_id ON post_revisions(post_id);
