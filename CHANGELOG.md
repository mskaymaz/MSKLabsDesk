# MSKLabsDesk — Değişiklik Günlüğü (CHANGELOG.md)
> **Amaç:** Git commit ve push öncesinde projede yapılan teknik değişikliklerin versiyon, tarih ve saat bazlı kaydedildiği dokümandır.

## [02.10.2026 - 16:15] - Dynamic Headless Admin CMS & Çoklu Dil (TR/EN/AR) Planlaması
- `tasks.md` dosyası güncellendi: Aşama 9 (Çoklu Dil i18n & RTL) ve Aşama 10 (Dynamic Headless Admin CMS: Dinamik Blog Kanalları, Uygulama Kataloğu, Medya & Şablon Yönetimi) detaylı mikro-görevler halinde eklendi.
- `PROGRESS.md` güncellendi.
- PWA arayüzü ve entegrasyon SDK'sı hazırlandı.

## [02.10.2026 - 11:05] - Admin Yönetim API Endpoints & Kimlik Doğrulama (Bölüm 3 & 5)
- `backend/src/utils/auth.ts` oturum tokenı ve şifreleme modülü eklendi.
- `backend/src/routes/adminAuth.ts` yönetici girişi ve auto-seed hesabı eklendi.
- `backend/src/routes/adminTickets.ts` bilet listeleme, detay görme, yanıt verme (e-posta gönderimi dahil) ve durum değiştirme eklendi.
- `backend/src/routes/adminComments.ts` blog yorum moderasyon API'leri eklendi.
- `backend/src/routes/adminBroadcast.ts` segmentasyon bazlı bülten gönderim API'leri eklendi.
- TypeScript derleme doğrulaması yapıldı (0 hata).

## [02.10.2026 - 10:51] - Yapay Zeka Entegrasyonu (Gemini API - Bölüm 4)
- `backend/src/utils/ai.ts` modülü oluşturuldu.
