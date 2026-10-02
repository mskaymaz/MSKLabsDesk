# MSKLabsDesk — Değişiklik Günlüğü (CHANGELOG.md)
> **Amaç:** Git commit ve push öncesinde projede yapılan teknik değişikliklerin versiyon, tarih ve saat bazlı kaydedildiği dokümandır.

## [02.10.2026 - 10:22] - Destek API & Bilet Numarası Üretici (Madde 3.1)
- `backend/src/routes/support.ts` yazıldı (`handleSupportSubmission` & `generateTicketId`).
- `POST /api/support` endpoint'i `src/index.ts` dosyasına bağlandı.
- Form alan doğrulamaları, D1 `messages` kaydı, `message_events` audit kaydı ve onay e-postası tetiklemesi eklendi.
- `npx tsc --noEmit` ile TypeScript derleme doğrulaması yapıldı (0 hata).

## [02.10.2026 - 09:58] - E-Posta Servis Modülü & Bölüm 1 Tamamlanması
- `backend/src/utils/email.ts` e-posta modülü yazıldı.

## [02.10.2026 - 09:56] - D1 Veritabanı Şeması ve Migration Yapısı
- `backend/migrations/0001_initial_schema.sql` oluşturuldu.
