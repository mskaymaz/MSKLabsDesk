# MSKLabsDesk — Değişiklik Günlüğü (CHANGELOG.md)
> **Amaç:** Git commit ve push öncesinde projede yapılan teknik değişikliklerin versiyon, tarih ve saat bazlı kaydedildiği dokümandır.

## [02.10.2026 - 16:38] - Dynamic Headless Admin CMS (Aşama 10)
- `backend/migrations/0002_cms_schema.sql` oluşturuldu ve D1 veritabanına uygulandı (`blog_channels`, `blog_posts`, `apps`, `app_versions`, `site_templates`, `media_assets`).
- `backend/src/routes/cmsChannels.ts`, `cmsPosts.ts`, `cmsApps.ts`, `cmsTemplates.ts`, `cmsPublic.ts` modülleri yazıldı.
- `backend/src/utils/ai.ts` modülüne `translatePostWithAI` (Gemini AI ile EN ve AR oto-çeviri) eklendi.
- Frontend views oluşturuldu: `ChannelsView.tsx`, `PostsView.tsx` (AI Çevirili Editör), `AppsCMSView.tsx`, `TemplatesView.tsx`.
- `scripts/import_apps_catalog.js` aktarım betiği ve `webMSKLabs_cms_integration.md` rehberi hazırlandı.
- Frontend ve Backend 0 hata ile başarıyla derlendi.

## [02.10.2026 - 16:25] - Çoklu Dil (TR, EN, AR) Entegrasyonu & RTL Desteği (Aşama 9)
- `frontend/src/i18n/translations.ts` 3 dilli sözlük modülü oluşturuldu (TR, EN, AR).
- `frontend/src/context/I18nContext.tsx` dil yönetimi ve localStorage kalıcılığı sağlandı.
- `frontend/src/components/Sidebar.tsx` bileşenine 🇹🇷 TR / 🇬🇧 EN / 🇸🇦 AR dil seçici eklendi.
- `frontend/src/index.css` dosyasına Cairo Arapça yazı tipi ve `<html dir="rtl">` stilleri eklendi.
- `backend/src/utils/emailTemplates.ts` 3 dilli ve RTL uyumlu HTML e-posta şablonları eklendi.
- Frontend ve Backend 0 hata ile derlendi.

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
