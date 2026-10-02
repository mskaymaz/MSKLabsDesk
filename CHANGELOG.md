# MSKLabsDesk — Değişiklik Günlüğü (CHANGELOG.md)
> **Amaç:** Git commit ve push öncesinde projede yapılan teknik değişikliklerin versiyon, tarih ve saat bazlı kaydedildiği dokümandır.

## [02.10.2026 - 09:56] - D1 Veritabanı Şeması ve Migration Yapısı (Madde 1.3)
- `backend/migrations/0001_initial_schema.sql` oluşturuldu.
- `messages`, `message_events`, `replies`, `comments`, `subscribers`, `subscriber_preferences`, `email_queue`, `coupons`, `admins` tabloları ve indeksleri eklendi.
- Yerel D1 SQLite veritabanı testi başarıyla çalıştırıldı (14 SQL komutu uygulandı).

## [02.10.2026 - 09:53] - Frontend PWA Altyapı Kurulumu (Madde 1.2)
- `frontend/` dizininde Vite + React + TypeScript projesi oluşturuldu.
- `vite-plugin-pwa` ve `lucide-react` kütüphaneleri yüklendi.

## [02.10.2026 - 09:49] - Backend Altyapı Kurulumu (Madde 1.1)
- `backend/` klasörü altında Cloudflare Workers + TypeScript projesi oluşturuldu.

## [01.10.2026 - 16:30] - Proje Hazırlık ve Altyapı Kurulumu
- Proje temel dokümanları oluşturuldu.
