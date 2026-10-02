# MSKLabsDesk — Değişiklik Günlüğü (CHANGELOG.md)
> **Amaç:** Git commit ve push öncesinde projede yapılan teknik değişikliklerin versiyon, tarih ve saat bazlı kaydedildiği dokümandır.

## [02.10.2026 - 10:28] - Blog Yorum API Endpoint'leri (Madde 3.2)
- `backend/src/routes/comments.ts` yazıldı (`handleCommentSubmission` & `handleGetApprovedComments`).
- `POST /api/comments` (Yorum gönderme, IP/User-Agent kaydı, `pending` statüsü) ve `GET /api/comments` (onaylı yorum çekme) eklendi.
- TypeScript derleme doğrulaması yapıldı (0 hata).

## [02.10.2026 - 10:22] - Destek API & Bilet Numarası Üretici (Madde 3.1)
- `backend/src/routes/support.ts` yazıldı (`POST /api/support`).

## [02.10.2026 - 09:58] - E-Posta Servis Modülü & Bölüm 1 Tamamlanması
- `backend/src/utils/email.ts` e-posta modülü yazıldı.
