-- DIST-CDN-001: Melez Hızlı Dağıtım & İndirme Sayacı Tablosu (25.11.2026)
CREATE TABLE IF NOT EXISTS download_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_slug TEXT NOT NULL,
    version TEXT NOT NULL,
    tier TEXT NOT NULL DEFAULT 'r2',
    download_count INTEGER NOT NULL DEFAULT 0,
    last_downloaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(app_slug, version)
);

CREATE INDEX IF NOT EXISTS idx_download_stats_app ON download_stats(app_slug, version);
