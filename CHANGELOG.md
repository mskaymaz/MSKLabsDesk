# MSKLabsDesk — Değişiklik Günlüğü (CHANGELOG.md)
> **Amaç:** Git commit ve push öncesinde projede yapılan teknik değişikliklerin versiyon, tarih ve saat bazlı kaydedildiği dokümandır.

## [02.10.2026 - 10:32] - E-Bülten Abonelik ve Tercih API Endpoints (Madde 3.3)
- `backend/src/routes/subscribe.ts` yazıldı (`handleSubscribe` & `handleUnsubscribe`).
- `POST /api/subscribe` (kategori bazlı abonelik tercihi, D1 `subscribers` & `subscriber_preferences` kaydı, karşılama maili).
- `POST /api/unsubscribe` (abonelik pasife alma).
- TypeScript derleme doğrulaması yapıldı (0 hata).

## [02.10.2026 - 10:28] - Blog Yorum API Endpoint'leri (Madde 3.2)
- `backend/src/routes/comments.ts` yazıldı (`POST /api/comments` & `GET /api/comments`).

## [02.10.2026 - 10:22] - Destek API & Bilet Numarası Üretici (Madde 3.1)
- `backend/src/routes/support.ts` yazıldı (`POST /api/support`).
