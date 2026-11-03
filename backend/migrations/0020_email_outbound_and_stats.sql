-- MSKLabsDesk — Giden E-Posta Denetim Günlüğü ve Günlük Kota Takibi (COM-OUTBOUND-002)
-- File: 0020_email_outbound_and_stats.sql

CREATE TABLE IF NOT EXISTS email_outbound_logs (
    id TEXT PRIMARY KEY,
    email_type TEXT NOT NULL,
    recipient_masked TEXT NOT NULL,
    subject TEXT,
    provider TEXT NOT NULL, -- 'RESEND' | 'BREVO' | 'MOCK'
    status_code INTEGER,
    is_success BOOLEAN NOT NULL DEFAULT 1,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_daily_stats (
    stat_date TEXT PRIMARY KEY, -- 'YYYY-MM-DD'
    resend_count INTEGER NOT NULL DEFAULT 0,
    brevo_count INTEGER NOT NULL DEFAULT 0,
    total_count INTEGER NOT NULL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_email_logs_date ON email_outbound_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_outbound_logs(email_type);
