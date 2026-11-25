# Google Workspace API Kullanım Katmanları ve MCP Güncellemesi — Etki Analizi

* **Tarih:** 25.11.2026 - 14:15
* **GCP Projesi:** `msklabs-org` (`projects/306607897800`)
* **Yetkili Hesap (`gcloud`):** `mskaymaz05@gmail.com`
* **Durum:** Tamamlandı — **Aksiyon Gerektirmiyor (Düşük Risk)**

---

## 1. Özet ve Bağlam
Google Cloud ekibi, `msklabs-org` projesi için Workspace geliştirici araçları (Gmail, Drive, Calendar API'leri, MCP sunucuları ve CLI) hakkında iki kademeli kullanım modelini ve AI ajanları için MCP zorunluluğunu duyurdu:

* **24 Kasım 2026:** Gmail, Drive ve Calendar API'lerinden başlayarak **Standard Tier (Ücretsiz)** ve **Scaled Tier (Ücretli)** modeli devreye girer. Yeni kota artış talepleri için Scaled Tier zorunlu olur.
* **1 Şubat 2027:** AI ajanları ve benzeri otonom erişim araçlarının Workspace verisine doğrudan REST API yerine **MCP (Model Context Protocol)** üzerinden erişmesi teknik olarak zorunlu hale gelir.
* **1 Nisan 2027:** Scaled Tier seçilmemişse projeler otomatik olarak ücretsiz **Standard Tier** limitlerine sabitlenir; ek ücret yansıtılmaz.

---

## 2. Teknik Bulgular

### 2.1. `msklabs-org` Etkin Servis Denetimi (`gcloud services list --enabled`)
Projede toplam 24 servis etkin olup yalnızca **1 tanesi** Google Workspace API kapsamındadır:
* **`drive.googleapis.com` (Google Drive API):** Etkin ve aktif trafik alıyor.
* `gmail.googleapis.com` ve `calendar-json.googleapis.com`: **Etkin değil.**
* Diğer 23 servis (`analyticsdata`, `bigquery*`, `dataform`, `dataplex`, `datastore`, `storage*`, `sql-component`, `logging`, `monitoring`, `cloudtrace`, `telemetry` vb.): Standart GCP altyapı/veri servisleridir; bu değişiklik kapsamı dışındadır.

### 2.2. Son 30 Günlük `drive.googleapis.com` Trafiği (`2026-10-26` – `2026-11-25`)
Cloud Monitoring (`serviceruntime.googleapis.com/api/request_count`) verilerine göre toplam **228 istek** kaydedilmiştir:
* `DriveFiles.List`: 134 istek (dakikada maks. 4, son istek: `2026-11-25T06:50:04Z`)
* `DriveFiles.Get`: 48 istek (24× `200`, 24× `302`, dakikada maks. 4)
* `DriveFiles.Create`: 45 istek (24 OAuth2 + 21 `credential_id` boş, dakikada maks. 2)
* `DriveFiles.Delete`: 1 istek (`204`)

### 2.3. Kullanım Kaynağı Tespiti
* OAuth2 isteklerinin tamamı `306607897800-1ofd2kunn3e3crfineg8op73a1d046t5.apps.googleusercontent.com` istemci kimliği üzerinden gelmektedir.
* `D:\Code\mskaymaz` altındaki tüm repolar tarandığında bu istemcinin yalnızca **`AGBackupTool`** ([`client_secret_...json`](file:///D:/Code/mskaymaz/AGBackupTool/client_secret_306607897800-1ofd2kunn3e3crfineg8op73a1d046t5.apps.googleusercontent.com.json)) tarafından kullanıldığı doğrulanmıştır.

---

## 3. Etki Değerlendirmesi
* **`MSKLabsDesk` ve `MSKLabsWeb`:** Kod tabanında `drive.googleapis.com` REST API çağrısı yoktur (`ga4.ts` yalnızca Analytics Data API, `ai.ts` yalnızca Gemini API kullanır). Kullanıcıların web vitrininden Drive üzerinden APK indirmesi (`storeLinks.google_drive`) statik Drive URL'si ile çalıştığı için **hiçbir şekilde etkilenmez**.
* **`AGBackupTool`:** Aylık ~228 istek / dakikada en fazla 4 istek ile ücretsiz **Standard Tier** limitlerinin çok altındadır. Araç bir AI ajanı değil klasik bir yedekleme uygulamasıdır.

---

## 4. Karar ve Sonraki Adımlar
* `drive.googleapis.com` aktif yedekleme için kullanıldığından **kapatılmayacaktır**.
* **Scaled Tier**'a geçiş yapılmayacak, mevcut ücretsiz **Standard Tier** altında kalınacaktır.
* Ek bir kod veya konsol değişikliği gerekmemektedir.
