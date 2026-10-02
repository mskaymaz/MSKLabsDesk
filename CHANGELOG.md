# MSKLabsDesk — Değişiklik Günlüğü (CHANGELOG.md)
> **Amaç:** Git commit ve push öncesinde projede yapılan teknik değişikliklerin versiyon, tarih ve saat bazlı kaydedildiği dokümandır.

## [02.10.2026 - 09:58] - E-Posta Servis Modülü & Bölüm 1 Tamamlanması (Madde 1.4)
- `backend/src/utils/email.ts` e-posta modülü yazıldı (`sendEmail` fonksiyonu).
- Gmail SMTP (`msklabs.org@gmail.com`) ve Resend API konfigürasyonu eklendi.
- **Bölüm 1 (Hazırlık ve Altyapı Kurulumu)** %100 tamamlandı.

## [02.10.2026 - 09:56] - D1 Veritabanı Şeması ve Migration Yapısı (Madde 1.3)
- `backend/migrations/0001_initial_schema.sql` oluşturuldu (9 tablo).

## [02.10.2026 - 09:53] - Frontend PWA Altyapı Kurulumu (Madde 1.2)
- `frontend/` dizininde Vite + React + TypeScript projesi oluşturuldu.

## [02.10.2026 - 09:49] - Backend Altyapı Kurulumu (Madde 1.1)
- `backend/` klasörü altında Cloudflare Workers + TypeScript projesi oluşturuldu.
