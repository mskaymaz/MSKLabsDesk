-- TELEMETRY-ECO-001: Ekosistem Telemetri, Anonim Cihaz Kimliği ve Kaba Yaşam Döngüsü (IST-013, 25.11.2026)

CREATE TABLE IF NOT EXISTS device_apps (
    eco_device_id TEXT NOT NULL,
    app_id TEXT NOT NULL,
    app_version TEXT NOT NULL,
    install_source TEXT NOT NULL DEFAULT 'direct',
    platform TEXT NOT NULL,
    os_name TEXT,
    os_release TEXT,
    country TEXT,
    city TEXT,
    first_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    launch_count INTEGER NOT NULL DEFAULT 1,
    total_usage_seconds INTEGER NOT NULL DEFAULT 0,
    reinstall_count INTEGER NOT NULL DEFAULT 0,
    feature_counts_json TEXT NOT NULL DEFAULT '{}',
    PRIMARY KEY (eco_device_id, app_id)
);

CREATE INDEX IF NOT EXISTS idx_device_apps_last_seen ON device_apps(app_id, last_seen_at);
CREATE INDEX IF NOT EXISTS idx_device_apps_device ON device_apps(eco_device_id);

CREATE TABLE IF NOT EXISTS crash_reports (
    fingerprint TEXT NOT NULL,
    app_id TEXT NOT NULL,
    app_version TEXT NOT NULL,
    platform TEXT NOT NULL,
    error_message TEXT NOT NULL,
    stack_trace_snippet TEXT NOT NULL,
    first_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_seen DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    occurrence_count INTEGER NOT NULL DEFAULT 1,
    is_resolved BOOLEAN NOT NULL DEFAULT 0,
    PRIMARY KEY (fingerprint, app_id, app_version)
);

CREATE TABLE IF NOT EXISTS device_clusters (
    eco_device_id TEXT PRIMARY KEY,
    app_count INTEGER NOT NULL DEFAULT 1,
    apps_json TEXT NOT NULL DEFAULT '[]',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_daily_stats (
    stat_date TEXT NOT NULL,
    app_id TEXT NOT NULL,
    active_devices INTEGER NOT NULL DEFAULT 0,
    total_launches INTEGER NOT NULL DEFAULT 0,
    new_installs INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (stat_date, app_id)
);

ALTER TABLE messages ADD COLUMN eco_device_id TEXT;
ALTER TABLE messages ADD COLUMN app_version TEXT;
