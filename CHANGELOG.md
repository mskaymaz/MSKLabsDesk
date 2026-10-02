# MSKLabsDesk — Değişiklik Günlüğü (CHANGELOG.md)
> **Amaç:** Git commit me push öncesinde projede yapılan teknik değişikliklerin versiyon, tarih ve saat bazlı kaydedildiği dokümandır.

## [02.10.2026 - 10:51] - Yapay Zeka Entegrasyonu (Gemini API - Bölüm 4)
- `backend/src/utils/ai.ts` modülü oluşturuldu (`analyzeSupportTicketWithAI`).
- Destek taleplerinde otomatik Spam/Risk analizi, aciliyet tespiti (`low`, `medium`, `high`, `critical`), Türkçe mesaj özeti (`ai_summary`) ve yanıt taslağı (`ai_draft`) üretme sağlandı.
- Prompt injection güvenlik koruması eklendi.
- `POST /api/support` akışına tam entegre edildi.
- TypeScript derleme doğrulaması yapıldı (0 hata).

## [02.10.2026 - 10:32] - E-Bülten Abonelik ve Tercih API Endpoints (Madde 3.3)
- `backend/src/routes/subscribe.ts` yazıldı.

## [02.10.2026 - 10:28] - Blog Yorum API Endpoint'leri (Madde 3.2)
- `backend/src/routes/comments.ts` yazıldı.
