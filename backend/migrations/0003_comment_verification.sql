-- MSKLabsDesk — Blog Yorum E-Posta Doğrulama & Spam Koruması Migration
-- File: 0003_comment_verification.sql

ALTER TABLE comments ADD COLUMN verification_token TEXT;
ALTER TABLE comments ADD COLUMN verified_at DATETIME;
CREATE INDEX IF NOT EXISTS idx_comments_verification_token ON comments(verification_token);
