-- MSKLabsDesk — Bülten Kampanyaları ve İletim İstatistikleri
-- File: 0021_newsletter_campaigns.sql

CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    target_category TEXT NOT NULL DEFAULT 'all',
    total_recipients INTEGER NOT NULL DEFAULT 0,
    sent_count INTEGER NOT NULL DEFAULT 0,
    failed_count INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'sending' | 'completed' | 'failed'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME
);

CREATE INDEX IF NOT EXISTS idx_campaigns_created ON newsletter_campaigns(created_at);
