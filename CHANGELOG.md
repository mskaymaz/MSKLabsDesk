# MSKLabsDesk — Değişiklik Günlüğü (CHANGELOG.md)
> **Amaç:** Git commit ve push öncesinde projede yapılan teknik değişikliklerin versiyon, tarih ve saat bazlı kaydedildiği dokümandır.

## [02.10.2026 - 09:53] - Frontend PWA Altyapı Kurulumu (Madde 1.2)
- rontend/ dizininde Vite + React + TypeScript projesi oluşturuldu.
- ite-plugin-pwa ve lucide-react kütüphaneleri yüklendi.
- ite.config.ts PWA manifest ve service worker oto-güncelleme konfigürasyonu eklendi.

## [02.10.2026 - 09:49] - Backend Altyapı Kurulumu (Madde 1.1)
- ackend/ klasörü altında Cloudflare Workers + TypeScript projesi oluşturuldu.
- wrangler.toml, package.json, 	sconfig.json ve /api/health destekli src/index.ts oluşturuldu.
- 
pm install çalıştırılarak @cloudflare/workers-types ve wrangler bağımlılıkları yüklendi.

## [01.10.2026 - 16:30] - Proje Hazırlık ve Altyapı Kurulumu
- Proje temel dokümanları (	asks.md, AGENTS.md, PROGRESS.md, DECISIONS.md, CHANGELOG.md) oluşturuldu.
- Uzak Git reposu https://github.com/mskaymaz/MSKLabsDesk.git bağlandı.
