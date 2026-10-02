-- MSKLabsDesk — Initial D1 Database Schema Migration
-- File: 0001_initial_schema.sql

-- 1. Messages (Destek & Talep Biletleri)
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    status TEXT DEFAULT 'open',
    urgency TEXT DEFAULT 'medium',
    ai_summary TEXT,
    ai_draft TEXT,
    coupon_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Message Events (Audit / Durum Geçmişi)
CREATE TABLE IF NOT EXISTS message_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT NOT NULL,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- 3. Replies (Yönetici Yanıtları)
CREATE TABLE IF NOT EXISTS replies (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    admin_name TEXT NOT NULL,
    reply_content TEXT NOT NULL,
    is_sent_to_user BOOLEAN DEFAULT 1,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- 4. Comments (Blog Yazıları Yorum Sistemi)
CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    post_type TEXT NOT NULL,
    post_slug TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Subscribers (E-Bülten Aboneleri)
CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    verification_token TEXT,
    source TEXT DEFAULT 'website_footer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified_at DATETIME
);

-- 6. Subscriber Preferences (Kategori Bazlı Abonelik Tercihleri)
CREATE TABLE IF NOT EXISTS subscriber_preferences (
    subscriber_id TEXT NOT NULL,
    category TEXT NOT NULL,
    is_subscribed BOOLEAN DEFAULT 1,
    PRIMARY KEY (subscriber_id, category),
    FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE
);

-- 7. Email Queue (Akıllı E-Posta Gönderim Kuyruğu)
CREATE TABLE IF NOT EXISTS email_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    body_html TEXT NOT NULL,
    email_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    error_message TEXT,
    scheduled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    sent_at DATETIME
);

-- 8. Coupons (Özel Teşekkür & Hediye Kuponları)
CREATE TABLE IF NOT EXISTS coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    discount_amount INTEGER DEFAULT 0,
    message_id TEXT,
    recipient_email TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME
);

-- 9. Admins (Yönetici Hesapları & Roller)
CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler (Sorgu Performansı İçin)
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_comments_status ON comments(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
