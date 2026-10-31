# MSKLabsDesk Admin Panel — UI/UX ve Fonksiyonel Denetim Raporu
> **Tarih:** 22.10.2026 | **Dal:** DevAdmin | **Hedef:** Gemini uygulaması için öncelikli iyileştirmeler

---

## 0. Bağlam: Mevcut Mimari Özeti

| Katman | Teknoloji |
|---|---|
| Framework | React 19 + TypeScript 6 + Vite 8 |
| Editör | TipTap v3 (extensions: StarterKit, Tables, Image, Color, Highlight, TextAlign, Link, vb.) |
| İkonlar | lucide-react v1.49 |
| Stil | CSS değişkenleri (tokens.css) + inline style ağırlıklı |
| Durum | useState lokal, global context (Auth, Theme, I18n) |
| API | Cloudflare Workers D1 (REST) |

---

## 1. GLOBAL / ÇAPRAZ KESİM SORUNLARI

### 1.1 Toast / Bildirim Sistemi Eksik
**Sorun:** `alert()` çağrıları 12+ farklı yerde kullanılıyor (`AppsCMSView.tsx L47`, `SettingsView.tsx L61`, `BroadcastView.tsx L42`, `ChannelsView.tsx` vb.). Tarayıcı `alert()` bloklayıcı, tema dışı, async-unsafe.
**Çözüm:** Merkezi `<ToastProvider>` + `useToast()` hook mimarisi kurulmalı. `sonner` (1.5kB gzip, zero-config) veya özel hafif stack. Her `alert()` → `toast.error/success/warning()` ile değiştirilmeli.
**Kütüphane:** `sonner` (`npm i sonner`)

### 1.2 Yükleme Durumları Tutarsız
**Sorun:** Bazı view'larda spinner var (`loading` state), bazılarında yok. Skeleton loader sadece `CommonUI.tsx`'te tanımlı ama hiçbir list view'da kullanılmıyor — boş ekran gösteriliyor.
**Çözüm:** Her liste view'a ilk yüklemede `<SkeletonList>` gösterilmeli; mevcut `Skeleton` bileşeni genişletilip `SkeletonCard`, `SkeletonRow` varyantları eklenmeli.

### 1.3 Hata Sınırı (Error Boundary) Yok
**Sorun:** Herhangi bir stüdyo bileşeninin çökmesi tüm admin panelini boş bırakıyor.
**Çözüm:** `BlogStudioView`, `PageStudioView`, `AppDetailStudioView` etrafına `<ErrorBoundary>` sarmalı.

### 1.4 Onay Diyaloğu Tutarsızlığı
**Sorun:** Bazı silme işlemleri `window.confirm()` kullanıyor (`AppsCMSView L47`), diğerleri `ConfirmationDialog` bileşenini (`Modal.tsx` içinde mevcut). `window.confirm()` tema dışı ve bloklama modunda çalışır.
**Çözüm:** Tüm `window.confirm()` → `<ConfirmationDialog>` ile değiştirilmeli. Bileşen zaten var, sadece tutarlı kullanım eksik.

### 1.5 Global Arama — Yüzeysel
**Sorun:** `GlobalSearchModal.tsx`: yalnızca 4 statik navigasyon öğesi. Gerçek içerik araması (blog yazıları, uygulamalar, biletler) yok. `Ctrl+K` kısayolu var ama sayfada gösterilmiyor.
**Çözüm:** Arama sonuçları backend'den debounced çekilmeli. Sonuçlar kategori gruplarına ayrılmalı. Kısayol ipucu sidebar'da gösterilmeli.

### 1.6 Sayfa Başlığı (document.title) Güncellenmiyor
**Sorun:** Tüm sekmelerde "MSKLabsDesk Admin" sabit. Aktif sayfa başlığa yansımıyor.
**Çözüm:** Her view içinde `useEffect(() => { document.title = '...'; }, [])` veya merkezi router-aware `<DocumentTitle>` sarmalı.

---

## 2. LOGIN / KİMLİK DOĞRULAMA

**Dosya:** `LoginView.tsx`

### 2.1 Form Doğrulama Yetersiz
**Sorun:** Client-side doğrulama yalnızca min length. Hata mesajları tek `<div>`'de — hangi alana ait olduğu belirsiz.
**Çözüm:** Her alan için inline hata (mevcut `Input` bileşeninin `error` prop'u var, kullanılmıyor). `username` alanına `trim()` uyarısı eklenmeli.

### 2.2 Lockout Sayacı Hatalı
**Sorun:** 429 alındığında süre her zaman sabit 900 sn. Backend `Retry-After` header'ı okunmuyor.
**Çözüm:** API hatası içindeki `retryAfter` değeri parse edilip `setLockoutTimer()` içine verilmeli.

### 2.3 "Şifreyi Göster" Butonu Yok
**Sorun:** Parola alanı daima gizli.
**Çözüm:** `Input` bileşenine `type="password"` + `showToggle` prop'u eklenmeli (göz ikonu).

---

## 3. SIDEBAR / NAVİGASYON

**Dosya:** `Sidebar.tsx`

### 3.1 Daraltılabilir (Collapsible) Menü Yok
**Sorun:** Sol menü sabit 260px. Küçük ekranlarda ya da stüdyo modunda alan kaybettiriyor.
**Çözüm:** İkon-only collapse modu (72px) eklenmeli. State `localStorage`'da saklanmalı.

### 3.2 Aktif Rota Göstergesi Zayıf
**Sorun:** Aktif sekme yalnızca arka plan rengiyle belirtiliyor. Sol kenarda aktif çubuk yok.
**Çözüm:** `border-left: 3px solid var(--accent-primary)` aktif öğeye eklenmeli.

### 3.3 Kullanıcı Profil Kartı Basit
**Sorun:** Alt kısımda sadece kullanıcı adı ve rol. Avatar, "Son Giriş" bilgisi yok.
**Çözüm:** Profil mini kartına `<Avatar>` (baş harfi renkli daire), "Son Giriş: X dk önce" eklenmeli.

---

## 4. DASHBOARD

**Dosya:** `DashboardView.tsx`

### 4.1 Metrik Kartları Statik
**Sorun:** Sayılar gösteriliyor ama trend (geçen haftaya göre %+/-) ve grafik yok.
**Çözüm:** Her metrik kartının altına mini sparkline grafiği eklenmeli. Kütüphane: `recharts` veya `@visx/sparkline` (~5kB).

### 4.2 Aktivite Akışı (Activity Feed) Eksik
**Sorun:** Dashboard'da son işlemler listesi yok.
**Çözüm:** `audit_logs` tablosundan son 10 kaydı çekip "Son İşlemler" bölümü eklenmeli.

### 4.3 Hızlı Eylem Butonları Yok
**Sorun:** Dashboard salt okunur. Sık yapılan işlemler için kısayol yok.
**Çözüm:** "Hızlı İşlemler" bölümü — Yeni Blog, Yeni Duyuru, Abone Dışa Aktar kısayolları.

---

## 5. BİLET YÖNETİMİ

**Dosya:** `TicketsView.tsx`, `TicketDetailModal.tsx`

### 5.1 Sıralama Yok
**Sorun:** Biletler kart olarak listeleniyor, sıralama (tarih, öncelik, kategori) yok.
**Çözüm:** Liste/tablo toggle + başlık tıklanarak sıralama.

### 5.2 Toplu İşlem (Bulk Action) Yok
**Sorun:** Biletler tek tek işleniyor.
**Çözüm:** Checkbox + toplu "Çözüldü İşaretle" / "Reddet" aksiyonu.

### 5.3 Yanıt Editörü Ham Textarea
**Sorun:** `TicketDetailModal` içinde yanıt alanı düz `<textarea>`.
**Çözüm:** Yanıt alanı → `<RichTextEditor>` + hazır yanıt şablonları (quick replies) dropdown'u.

### 5.4 Öncelik Seviyesi Yok
**Sorun:** Biletlerde öncelik (düşük/orta/yüksek/kritik) alanı mevcut değil.
**Çözüm:** Backend `priority` alanı + frontend renkli badge ve sıralama kriteri.

---

## 6. YORUMLAR

**Dosya:** `CommentsView.tsx`

### 6.1 Eylem Akışı Fazla Adımlı
**Sorun:** Seçim dropdown'u + "Uygula" butonu — iki adım gerekiyor.
**Çözüm:** Kartın sağında doğrudan "Onayla ✓" / "Reddet ✗" inline butonları.

### 6.2 Toplu Moderasyon Yok
**Sorun:** Spam yorumları tek tek işlemek gerekiyor.
**Çözüm:** Checkbox + toplu aksiyon.

---

## 7. KANALLAR (BLOG TÜRLERİ)

**Dosya:** `ChannelsView.tsx`

### 7.1 İkon Seçici Yok
**Sorun:** İkon alanı serbest metin giriş. Geçerli ikon adları belirsiz, typo riski var.
**Çözüm:** Lucide ikon adlarından arama yapılabilir `<IconPicker>` dropdown.

### 7.2 Sürükle-Bırak Sıralama Yok
**Sorun:** `display_order` sayısal manuel giriş ile sıralanıyor.
**Çözüm:** `@dnd-kit/sortable` ile kart sıralama.

### 7.3 Kanal Düzenleme Modal Yok
**Sorun:** Oluşturma modalı var, düzenleme yok.
**Çözüm:** Her kanal kartına "Düzenle" butonu + form modalının edit modu.

---

## 8. BLOG YAZILARI

**Dosya:** `PostsView.tsx`, `PostCard.tsx`, `PostFilterBar.tsx`

### 8.1 Sayfalama Yok
**Sorun:** Tüm yazılar bir kerede yükleniyor. 200+ yazıda performans sorunu.
**Çözüm:** Backend limit/offset pagination + frontend sayfa numarası veya "Daha fazla yükle".

### 8.2 Toplu Durum Değişikliği Yok
**Sorun:** Yazılar tek tek yönetiliyor.
**Çözüm:** Checkbox + toplu "Yayına Al" / "Yayından Kaldır".

### 8.3 Liste Görünümü Yok
**Sorun:** Yalnızca kart grid var.
**Çözüm:** Grid/Liste toggle eklenmeli.

---

## 9. BLOG STÜDYOSU

**Dosya:** `BlogStudioView.tsx`

### 9.1 Otomatik Kaydetme Göstergesi Belirsiz
**Sorun:** `autosaveState` state var ama UI göstergesi yeterince belirgin değil.
**Çözüm:** Üst çubukta animasyonlu "Kaydediliyor..." / "✓ Kaydedildi" / "⚠ Kaydedilemedi" chip'i.

### 9.2 Revizyon Geçmişi Yok
**Sorun:** `StudioRevisionsModal` kaldırıldı, yerine konulmadı.
**Çözüm:** Her kaydetmede `localStorage`'da snapshot (son 5 revizyon). "Geri Yükle" butonu.

### 9.3 Word Count / Okuma Süresi Yok
**Sorun:** Yazı uzunluğu ve tahmini okuma süresi gösterilmiyor.
**Çözüm:** Durum çubuğuna `Kelime: X | ~Y dk okuma` (TipTap `getWordCount()`).

### 9.4 Odak Modu Yok
**Sorun:** Sol araç çubuğu ve üst bar yazarken dikkat dağıtıyor.
**Çözüm:** "Odak Modu" → sidebar + toolbar gizlenir.

### 9.5 Tuval Üzerine Sürükle-Bırak Görsel Yükleme Yok
**Sorun:** Görsel yükleme yalnızca toolbar butonuyla.
**Çözüm:** Tuval üzerine `dragover/drop` + R2 yükleme akışı.

### 9.6 SEO Meta Paneli Eksik Alanlar
**Sorun:** Yalnızca başlık ve açıklama. OG görseli, canonical, robots yok.
**Çözüm:** SEO paneline `og:image`, `canonical`, `noindex` checkbox alanları.

---

## 10. KURUMSAL SAYFA STÜDYOSU

**Dosya:** `PageStudioView.tsx`, `StudioTopBar.tsx`

### 10.1 Slug Düzenleme Arayüzü Ham
**Sorun:** Slug otomatik üretiliyor, URL yapısı gösterilmiyor.
**Çözüm:** Slug alanının önünde `msklabs.org/` prefix + inline düzenleme + benzersizlik kontrolü.

### 10.2 Mobil Önizleme Yok
**Sorun:** Yalnızca masaüstü tuval var.
**Çözüm:** Desktop / Tablet / Mobile önizleme genişlik toggle.

### 10.3 Yayın Durum Makinesi Eksik
**Sorun:** Blog state machine'i kadar olgun değil. Scheduled publish yok.
**Çözüm:** Blog yaşam döngüsü (published/unpublished/draft/trash) sayfa sistemine uyarlanmalı.

---

## 11. UYGULAMALAR CMS

**Dosya:** `AppsCMSView.tsx`, `AppModal.tsx`

### 11.1 `window.confirm()` Silme Onayı
**Çözüm:** `<ConfirmationDialog>` ile değiştirilmeli.

### 11.2 App Modal Çok Uzun
**Sorun:** Tek sayfada tüm alanlar — çok uzun scroll.
**Çözüm:** Modal içi sekme: **Temel Bilgiler | Özellikler | Görsel & Mağaza | Sürümler**.

### 11.3 Sürükle-Bırak Sıralama Yok
**Çözüm:** `@dnd-kit/sortable` ile kart sıralama.

---

## 12. ŞABLON & REKLAM

**Dosya:** `TemplatesView.tsx`

### 12.1 Duyuru Bandı Editörü Düz Textarea
**Çözüm:** `<RichTextEditor>` bağlanmalı (bold, link, emoji desteği).

### 12.2 Reklam Studio Kontrolü Monolitik
**Sorun:** `AdStudioControls.tsx` 18kB, tüm kontroller sıkışık.
**Çözüm:** Sol panel accordion bölümlere ayrılmalı: Boyut | Görünüm | Sayfa Hedefleme.

### 12.3 Önizleme Gerçek Zamanlı Değil
**Çözüm:** Debounced değişiklik → `AdLiveCanvas` otomatik güncelleme.

---

## 13. ABONE YÖNETİMİ

**Dosya:** `SubscribersView.tsx`

### 13.1 CSV Dışa Aktarma Yok
**Çözüm:** "CSV İndir" butonu — client-side `Blob` + `URL.createObjectURL`.

### 13.2 Doğrulama E-postasını Yeniden Gönder Yok
**Çözüm:** Doğrulanmamış abone satırına "Yeniden Gönder" butonu.

---

## 14. YAYIN (BROADCAST)

**Dosya:** `BroadcastView.tsx`

### 14.1 İçerik Editörü Düz Textarea
**Sorun:** HTML manuel giriliyor.
**Çözüm:** `<RichTextEditor>` bağlanmalı.

### 14.2 E-posta Önizleme Yok
**Çözüm:** Sağ panel → `<iframe srcDoc={contentHtml}>` e-posta önizlemesi.

### 14.3 Hedefleme Seçimi Devre Dışı
**Sorun:** `targetPreference` state var ama UI'da yok.
**Çözüm:** "Hedef Kitle" select aktif edilmeli: Tümü / Yalnızca Doğrulanmış / Kategori.

### 14.4 Zamanlanmış Gönderim Yok
**Çözüm:** Tarih/saat seçici + backend cron endpoint entegrasyonu.

---

## 15. AYARLAR

**Dosya:** `SettingsView.tsx`

### 15.1 Ham Input'lar — Bileşen Kullanılmıyor
**Sorun:** `<Input>`, `<Select>`, `<Switch>` bileşenleri var ama ayarlar formu ham `<input>` kullanıyor.
**Çözüm:** Tüm form alanları → UI bileşenlerine geçirilmeli.

### 15.2 Sekme Navigasyonu Yok
**Çözüm:** Genel | E-posta | Güvenlik | Görünüm | API & Entegrasyonlar sekmeleri.

### 15.3 API Anahtarı Yönetimi Yok
**Çözüm:** "API & Entegrasyonlar" sekmesine eye-toggle girişleri olan API anahtar yöneticisi.

---

## 16. FORM / UI BİLEŞEN BOŞLUKLARI

| Bileşen | Durum | Öneri |
|---|---|---|
| `Textarea` | Yok | `Input.tsx`'e eklenmeli (rows, resize, character count) |
| `Badge` | Dağınık inline style | Merkezi `<Badge variant="success/danger/warning/info">` |
| `Tooltip` | Yok | `title` attr yerine erişilebilir `<Tooltip>` |
| `Popover` | Yok | İkon seçici ve reklam stüdyosu için |
| `DatePicker` | Yok | Zamanlı yayın için; `react-day-picker` (~5kB) |
| `FileUpload` | Yok | Sürükle-bırak destekli, R2 entegrasyonlu merkezi yükleme |
| `DataTable` | Yok | Sıralama/filtre/pagination; abone ve bilet listesi için |
| `CommandPalette` | Yarım | GlobalSearch genişletilmeli, gerçek içerik araması |
| `Breadcrumb` | Yok | Stüdyo görünümlerinde gezinme için |
| `Tag/MultiSelect` | Yok | Blog yazı etiketleri için |
| `ProgressBar` | Yok | Broadcast ve görsel yükleme ilerlemesi |
| `Accordion` | Yok | Ayarlar ve reklam studio paneli |

---

## 17. ERİŞİLEBİLİRLİK (A11Y)

### 17.1 Focus Ring Eksik
**Sorun:** `outline: 'none'` tüm `<input>` ve `<button>`'da set edilmiş.
**Çözüm:** `:focus-visible` ile `outline: 2px solid var(--border-focus); outline-offset: 2px` eklenmeli.

### 17.2 `aria-label` Eksiklikleri
**Sorun:** İkon butonların çoğunda `aria-label` yok.
**Çözüm:** Tüm ikonografik butonlara `aria-label` zorunlu yapılmalı.

### 17.3 Renk Kontrastı
**Sorun:** `var(--text-muted)` koyu arka planda WCAG AA eşiğini karşılamıyor.
**Çözüm:** Muted renk hafif açılmalı.

---

## 18. PERFORMANS

### 18.1 Bundle Boyutu Büyük (1,184 kB)
**Çözüm:** `BlogStudioView` + `PageStudioView` → `React.lazy` + `Suspense` ile lazy load.

### 18.2 TipTap Tüm Extension'lar Her Zaman Yükleniyor
**Çözüm:** Extension'lar dinamik import ile sadece stüdyo açılırken yüklenmeli.

### 18.3 React.memo / useMemo Yetersiz
**Sorun:** `PostCard`, `AppCMSCard`, `CommentRow` her parent render'da yeniden oluşturuluyor.
**Çözüm:** `React.memo()` + filter/sort işlemleri → `useMemo`.

---

## 19. ÖNERİLEN YENİ PAKETLER

| Paket | Amaç | Boyut (gzip) |
|---|---|---|
| `sonner` | Toast bildirimleri | ~1.5kB |
| `@dnd-kit/sortable` | Sürükle-bırak sıralama | ~7kB |
| `react-day-picker` | Tarih seçici | ~5kB |
| `recharts` | Dashboard mini grafikler | ~35kB (lazy) |
| `fuse.js` | Client-side fuzzy arama | ~4kB |

> `@dnd-kit` ve `recharts` lazy load yapılırsa bundle'a etkisi minimal kalır.

---

## 20. EDİTÖR SİSTEMİ — İLERİ SEVİYE GELİŞTİRMELER

Mevcut editör altyapısı: TipTap v3 + özel extensions (`FontSize`, `LineHeight`, `ParagraphSpacing`, `CustomImage`, `CustomTable`). Eksik veya geliştirilebilecek yapılar:

### 20.1 Eksik TipTap Extension'ları

| Extension | Paket | Kullanım |
|---|---|---|
| `@tiptap/extension-mention` | Resmi | `@kişi` veya `#etiket` mention desteği — blog yazarlarını etiketleme |
| `@tiptap/extension-character-count` | Resmi | Kelime/karakter sayısı (durum çubuğu entegrasyonu — şu an elle hesaplanıyor) |
| `@tiptap/extension-placeholder` | Resmi | Placeholder metin sadece dış `<div>`'de var; TipTap'ın kendi `Placeholder` extension'ı her boş blok için çalışır |
| `@tiptap/extension-youtube` | Resmi | YouTube embed iframe ekleme — tek komut + URL parse |
| `@tiptap/extension-code-block-lowlight` | Resmi + `lowlight` | Sözdizim renklendirmeli kod bloğu; mevcut `code_block` renksiz |
| `@tiptap/extension-task-list` + `task-item` | Resmi | Checkbox görev listesi — teknik blog yazıları için |
| `@tiptap/extension-details` | Topluluk | `<details>/<summary>` — spoiler / açılır bölüm bloğu |
| `@tiptap/extension-global-drag-handle` | Topluluk | Notion-tarzı sol kenarda blok sürükleme tutamacı |
| `@tiptap/extension-slash-commands` | Topluluk | `/` yazınca açılan blok ekleme menüsü (en kritik UX iyileştirmesi) |

### 20.2 Slash Commands (/) — En Kritik UX Eksikliği
**Sorun:** Editöre her yeni blok eklemek için toolbar'ı kullanmak gerekiyor. Modern editörlerin tamamında (Notion, Linear, Ghost) `/` menüsü standart.
**Çözüm:**
```
/ yazınca açılan arama menüsü:
  Başlık 1/2/3/4
  Paragraf
  Madde Listesi / Numaralı Liste / Görev Listesi
  Tablo
  Görsel
  YouTube
  Kod Bloğu
  Alıntı (Blockquote)
  Yatay Çizgi
  Duyuru/Callout Kutusu
```
Kütüphane: `@tiptap-pro/extension-slash-commands` (Pro, lisanslı) **veya** topluluk paketi `tiptap-extension-slash-commands` ile özel implementasyon. Custom implementasyon mevcut TipTap altyapısıyla 1-2 günlük iş.

### 20.3 Callout / Uyarı Bloğu Extension Yok
**Sorun:** Blog yazılarında "Not:", "Uyarı:", "İpucu:" gibi vurgulu bölümler için özel blok yok.
**Çözüm:** `Node.create()` ile özel `CalloutBlock` extension yazılmalı. Tip seçenekleri: `info | warning | danger | success | tip`. Renk ve ikon token'lardan otomatik alınır.

### 20.4 Görsel Yükleme Akışı — R2 Entegrasyonu Doğrudan Editörde Yok
**Sorun:** `ImageDropdown.tsx` görseli URL olarak ekliyor. Gerçek dosya yükleme (sürükle-bırak veya clipboard paste) editör içinde desteklenmiyor.
**Çözüm:**
- TipTap `CustomImage` extension'ına `addPasteRules` + `addDropHandler` eklenmeli
- Paste/drop → R2 upload API → dönen URL → `setImageWithLayout()` akışı
- Yükleme sırasında placeholder görseli ve progress indicator

### 20.5 Tablo Araçları Çok Dağınık
**Sorun:** Tablo ile ilgili 6 ayrı dosya var: `TableDropdown`, `FloatingTableInspector`, `TableBorderControls`, `TableCellDimensionControls`, `TableLayoutControls`, `tableStyleHelper`. Toplam ~62kB. Her araç ayrı floating panel açıyor.
**Çözüm:** Tüm tablo kontrolleri tek bir `<TablePanel>` drawer içinde birleştirilmeli. Sekmeli yapı: **Düzen | Hücre | Kenarlık | Boyutlar**. `FloatingTableInspector` → `Drawer` varyantına taşınmalı.

### 20.6 Markdown Kısayolları Sınırlı
**Sorun:** `StarterKit` varsayılan markdown input kuralları var (`**bold**`, `_italic_` vb.) ama:
- `---` → yatay çizgi çalışmıyor (custom table extension çakışıyor)
- ` ```kod``` ` → code block dönüşümü yok
- `> alıntı` → blockquote çalışıyor ama görsel stilsiz

**Çözüm:** `addInputRules` ile eksik dönüşümler tamamlanmalı.

### 20.7 Geri Al / İleri Al (History) Göstergesi Yok
**Sorun:** `Ctrl+Z` / `Ctrl+Y` çalışıyor (StarterKit'ten geliyor) ama toolbar'da Undo/Redo butonları hiç yok.
**Çözüm:** `EditorToolbar`'a Undo/Redo ikonları eklenmeli. `editor.can().undo()` ile disable durumu yönetilmeli.

### 20.8 Editörden Dışa Aktarma (Export) Yok
**Sorun:** Editör içeriği yalnızca HTML olarak kaydediliyor. Markdown veya PDF export yok.
**Çözüm:**
- HTML → Markdown: `@tiptap/pm` + `prosemirror-markdown` (~8kB)
- HTML → PDF: Tarayıcı `window.print()` + özel `@media print` CSS (sıfır bağımlılık)
- Blog sayfalarına "Makaleyi PDF İndir" butonu için hazır altyapı olur

### 20.9 Çoklu Dil Editörü — RTL Geçişi Sorunlu
**Sorun:** TR/EN/AR sekmeleri arasında geçişte `dir` prop değişiyor ama editör instance yeniden oluşturuluyor (`key` değişiyor). Her dil geçişinde editör içeriği sıfırlanma riski var.
**Çözüm:** Her dil için ayrı `useEditor` instance tutulmalı, sekme geçişinde `display: none / block` ile gizleme yapılmalı (yeniden mount değil). Bu hem performansı artırır hem RTL/LTR geçişi güvence altına alır.

### 20.10 AI Entegrasyonu — Araç Çubuğu Düzeyi
**Sorun:** AI çeviri sadece tüm içerik için tek bir "AI Çevir" butonu olarak üst çubukta var. Seçili metin üzerinde AI aksiyonları yok.
**Çözüm:** Metin seçildiğinde floating mini toolbar'a AI menüsü eklenmeli:
- Seçili metni düzelt (gramer)
- Seçili metni yeniden yaz (ton: resmi / günlük)
- Seçili metni özet çıkar
- Seçili metni farklı dile çevir

---

## 21. ARAÇ ÇUBUĞU (TOOLBAR) MİMARİSİ ÖNERİSİ

Mevcut durum: `EditorToolbar` (yatay, üstte) + `EditorVerticalToolbar` (sol dikey). İkisi arasında özellik örtüşmesi var, hangisi ne yapıyor belirsiz.

**Önerilen mimari:**

```
┌─────────────────────────────────────────────┐
│  Üst Toolbar: Metin formatlama               │
│  (Bold, Italic, Renkler, Başlıklar, Hizalama)│
├────┬────────────────────────────────────────┤
│    │  Canvas (Yazı Alanı)                   │
│Sol │                                        │
│Bar │  /  → Slash commands menüsü            │
│(+) │  Seçim → Floating mini toolbar        │
│    │                                        │
│Blok│  [Tablo seçilince] → Tablo paneli     │
│Ekle│  [Görsel seçilince] → Görsel araçları │
└────┴────────────────────────────────────────┘
```

- **Sol bar:** Yalnızca blok ekleme (Tablo, Görsel, Kod, Callout, YouTube). `/` menüsü ile büyük ölçüde örtüşeceğinden sadeleştirilebilir.
- **Üst toolbar:** Yalnızca karakter/satır formatlama (mevcut `EditorToolbar`).
- **Floating context toolbar:** Metin seçince açılır → kalın/italik/link/AI/renk.
- **Panel drawer'ları:** Tablo kontrolleri + görsel ayarları (araç çubuğu yerine sağ drawer).

---

## 22. GENEL UI TOOL ÖNERİLERİ (ARAYÜZ KALİTESİ)

### 22.1 Animasyon Kütüphanesi Eksik
**Sorun:** Geçişler `transition: all 0.2s ease` ile CSS-only. Modal/drawer açılışı, liste item animasyonları, sayfa geçişleri yok.
**Çözüm:** `motion` (Framer Motion v12, yeni paket adı, ~20kB) veya daha hafif `@formkit/auto-animate` (~2.5kB). Kullanım: Modal giriş/çıkış, liste item mount/unmount, sayfa geçişleri.
**Kütüphane:** `npm i @formkit/auto-animate` (sıfır config, 3 satır entegrasyon)

### 22.2 Tema Özelleştirici Eksik Bölümler
**Sorun:** `ThemeCustomizerDrawer` açıkça mevcut ama token'lardan yalnızca `--accent-primary` gibi birkaç rengi etkiliyor. Yazı tipi seçimi aktif değil (7 font `tokens.css`'te tanımlı ama seçici yok).
**Çözüm:** Tema paneline font seçici eklenmeli. `tokens.css`'te tanımlı 7 font (Inter, Poppins, Outfit, vb.) seçilebilir olmalı.

### 22.3 Komponent Storybook / Kataloğu Yok
**Sorun:** Bileşenler var ama görsel dokümantasyon/katalog yok. Yeni geliştirici veya Gemini'nin nelerin mevcut olduğunu anlaması zor.
**Çözüm:** `Storybook` veya daha hafif `Histoire` (Vite native, ~1dk kurulum). En azından `ui/` klasöründeki temel bileşenler kataloglanmalı.

### 22.4 Klavye Kısayolları Sistematik Değil
**Mevcut kısayollar:** `Ctrl+K` (global arama), `Ctrl+Z/Y` (undo/redo editörde)
**Eksik kısayollar:**
- `Ctrl+S` → Kaydet (Studio)
- `Ctrl+P` → Önizleme aç/kapat
- `Ctrl+B/I/U` → Bold/Italic/Underline (editörde var, diğer yerlerde yok)
- `Esc` → Modal kapat (tutarsız)

**Çözüm:** Merkezi `useKeyboardShortcuts()` hook + kısayol yardım paneli (`?` tuşuna basınca açılır, Notion gibi).

### 22.5 Sağ Tıklama (Context Menu) Yok
**Sorun:** Liste kartlarına sağ tıklamak işe yaramıyor. Modern admin panellerinde sağ tık menüsü standart.
**Çözüm:** Kart üzerinde sağ tıklamak → `[Düzenle | Kopyala | Sil | Önizle]` context menüsü. Özel implementasyon veya `@radix-ui/react-context-menu` (~4kB).

### 22.6 Komut Paleti (Command Palette) Genişletilmeli
**Mevcut `GlobalSearchModal`:** 4 statik navigasyon öğesi.
**Olması gereken:**
```
Ctrl+K açıldığında:
  > Yeni Blog Yazısı Oluştur       [Eylem]
  > Yeni Kanal Ekle                 [Eylem]
  > Tema: Koyu/Açık Geçiş          [Eylem]
  > "react" → blog arama sonuçları  [İçerik]
  > Ayarlar > E-posta               [Navigasyon]
```
Kütüphane: `cmdk` (~5kB) veya mevcut modal genişletilmeli.

---

## 23. ÖNCELİK SIRASI (GÜNCEL — TÜM BÖLÜMLER DAHİL)

| Öncelik | Konu | Etki |
|---|---|---|
| 🔴 Kritik | `alert()` → `sonner` Toast | UX / Profesyonellik |
| 🔴 Kritik | `window.confirm()` → `ConfirmationDialog` | UX / Profesyonellik |
| 🔴 Kritik | Broadcast editörü → `<RichTextEditor>` | Fonksiyonel |
| 🔴 Kritik | Focus ring / A11y (:focus-visible) | Erişilebilirlik |
| 🔴 Kritik | Görsel paste/drop → R2 upload (editör) | Fonksiyonel |
| 🔴 Kritik | Editörde Undo/Redo butonları | UX / Editör |
| 🟠 Yüksek | Slash Commands (/) menüsü | Editör UX |
| 🟠 Yüksek | Tablo araçları → tek `<TablePanel>` drawer | Editör / Bakım |
| 🟠 Yüksek | Callout/Uyarı bloğu extension | Editör içerik |
| 🟠 Yüksek | `@tiptap/extension-code-block-lowlight` | Editör görsellik |
| 🟠 Yüksek | Toplu işlem (Bilet + Yorum + Yazı) | Verimlilik |
| 🟠 Yüksek | Sayfalama (Posts + Aboneler) | Performans |
| 🟠 Yüksek | Sidebar collapse + aktif bar | UI / Profesyonellik |
| 🟠 Yüksek | Ayarlar sekme yapısı | UX |
| 🟠 Yüksek | `@formkit/auto-animate` (geçişler) | UI kalitesi |
| 🟡 Orta | Çoklu dil editörü — RTL çoklu instance | Editör stabilitesi |
| 🟡 Orta | AI floating mini toolbar (seçili metin) | AI / UX |
| 🟡 Orta | YouTube embed extension | İçerik zenginliği |
| 🟡 Orta | HTML → Markdown / PDF export | Fonksiyonel |
| 🟡 Orta | Klavye kısayolları sistematik | UX |
| 🟡 Orta | Dashboard activity feed + sparkline | UX |
| 🟡 Orta | Revizyon geçmişi (Blog Studio) | İçerik güvenliği |
| 🟡 Orta | Bundle lazy load (Studio views) | Performans |
| 🟡 Orta | CSV export (Aboneler) | Fonksiyonel |
| 🟢 Düşük | Sağ tıklama context menu | UX |
| 🟢 Düşük | Font seçici (Tema paneli) | UI |
| 🟢 Düşük | Storybook / bileşen kataloğu | DX |
| 🟢 Düşük | Kanal ikon seçici | UX |
| 🟢 Düşük | `@dnd-kit` sürükle-bırak sıralama | UX |
| 🟢 Düşük | Avatar + profil mini kart | UI |

---

## 24. EK: BAĞLAMA ALINAN VE HARİTALANAN YAPI & BİLEŞEN ENVANTERİ (MODEL KNOWLEDGE)

Bu bölüm, önceki tarama ve bağlam oturumunda Claude tarafından çıkarılan, analiz edilen ve bellek özetine (checkpoint) işlenmiş olan somut bileşen, view ve CSS dosya envanterini içerir.

### 24.1 Ekranlar (Views) Envanteri — `frontend/src/views/`
1. `DashboardView.tsx` (12 KB) — İstatistik kartları (bilet, yorum, abone sayıları), son aktiviteler.
2. `PostsView.tsx` (8.7 KB) — Blog listesi, arama, filtreleme, yayın durumu kartları.
3. `BlogStudioView.tsx` (20.8 KB) — En büyük ekran; TipTap editörü, sayfa genişliği, kanallar, çok dilli sekmeler, yan/yüzen araç çubukları.
4. `PageStudioView.tsx` (13.3 KB) — Kurumsal sayfa tuvali, yan reklam yerleşimi ve üst bar.
5. `PagesView.tsx` (17.6 KB) — Kurumsal sayfalar listesi, hiyerarşi ve işlem aksiyonları.
6. `AppsCMSView.tsx` (13.5 KB) — Uygulamalar listesi, platform/durum filtreleri, kategori kartları.
7. `AppDetailStudioView.tsx` (6.1 KB) — Uygulama detay düzenleme stüdyosu.
8. `TemplatesView.tsx` (25.3 KB) — En kapsamlı view; duyuru bandı ayarları + AdSense reklam stüdyosu + sayfa-reklam dağılım matrisi.
9. `ChannelsView.tsx` (12.1 KB) — Blog türleri/kanalları listesi ve modal yönetimi.
10. `CommentsView.tsx` (12.2 KB) — Blog yorumları listesi, moderasyon onay/ret butonları.
11. `TicketsView.tsx` (16.5 KB) — Destek biletleri, kategori rozetleri, detay ve yapay zeka analiz modalları.
12. `SubscribersView.tsx` (6.2 KB) — E-posta bülteni aboneleri, doğrulama filtresi ve arama.
13. `BroadcastView.tsx` (5.5 KB) — Bülten e-posta gönderim ekranı, hedefleme ve gönderim simülasyonu.
14. `SettingsView.tsx` (10.8 KB) — Sistem başlığı, e-posta ayarları, Turnstile ve Push bildirim ayarları.
15. `LoginView.tsx` (8.3 KB) — Güvenlikli giriş, kilitlenme sayacı, tema değiştirici.

### 24.2 UI ve Çekirdek Bileşenler — `frontend/src/components/`
* **`components/ui/`:**
  - `Button.tsx` (3.4 KB): `primary`, `secondary`, `danger`, `success`, `ghost` varyantları, `IconButton` bileşeni.
  - `Input.tsx` (6.2 KB): `Input`, `Select`, `Checkbox`, `Switch` bileşenleri. *(Eksik: Textarea, DatePicker, TagInput)*.
  - `Modal.tsx` (6.1 KB): `Modal`, `Drawer`, `ConfirmationDialog`.
  - `CommonUI.tsx` (4.6 KB): `Skeleton`, `EmptyState`, `Tabs` bileşenleri.
  - `RichTextEditor.tsx` (5.8 KB): TipTap wrapper, önizleme toggle ve tablo denetçisi entegrasyonu.
* **`components/editor/` (13 Dosya — Editör Araç Seti):**
  - `customExtensions.ts` (10.8 KB): FontSize, LineHeight, ParagraphSpacing, DuplicateSelection, CustomImage, CustomTable.
  - `EditorToolbar.tsx` (10.7 KB), `EditorVerticalToolbar.tsx` (6.3 KB), `EditorTypographyControls.tsx` (7.6 KB).
  - `FloatingImageToolbar.tsx` (8.8 KB), `FloatingTableInspector.tsx` (9.8 KB), `ImageDropdown.tsx` (14.2 KB), `LinkModal.tsx` (4.8 KB).
  - `TableBorderControls.tsx` (12.8 KB), `TableCellDimensionControls.tsx` (15.9 KB), `TableDropdown.tsx` (8.5 KB), `TableLayoutControls.tsx` (5.2 KB), `tableStyleHelper.ts` (8.8 KB).
* **`components/posts/`:** `LayoutBuilder`, `PostCard`, `PostCardActions`, `PostFilterBar`, `PostList`, `PostPreviewModal`.
* **`components/apps/` & `studio/`:** `AppCMSCard`, `AppModal`, `AppModalCategorySelect`, `AppModalFeatureCards`, `AppModalLangFields`, `AppVersionModal` + 11 adet stüdyo alt bileşeni.
* **`components/ads/`:** `AdLiveCanvas`, `AdPageMatrixMap`, `AdSizeCatalogModal`, `AdStudioControls`.
* **`components/pages/`:** `CanvasSideAd`, `PageCanvas`, `PagePreviewModal`, `StudioTopBar` (20 KB).
* **`components/modals/` & diğer:** `AdPreviewModal`, `GlobalSearchModal`, `NewAdSlotModal`, `CommentDetailModal`, `TicketDetailModal`, `Sidebar`, `ThemeCustomizerDrawer`.

### 24.3 İncelenen Dosyalardaki Spesifik Kod Hataları ve İyileştirmeler
* **`Input.tsx`:** `Select` bileşeninde `background: '#0F1522'` hardcoded olarak yazılmış; açık temada bozuluyor (`tokens.css` `--bg-input` kullanılmalı). `Textarea` bileşeni hiç yok.
* **`Modal.tsx`:** `Drawer` içinde arka plan `#121826` sabit. Erişilebilirlik için `aria-labelledby` eksik. `disableBackdropBlur` varsayılan olarak `true` atanmış (arka plan bulanıklığı çalışmıyor). `ConfirmationDialog`'da `warning` varyantı tanımlı olmasına rağmen `Button` varyantına yansıtılmıyor.
* **`tokens.css` & Stil Katmanı:** `design-system.css`, `editor.css`, `app-studio.css`, `responsive.css` dosyaları mevcut; ancak `:focus-visible` ring standardı ve merkezi toast/tooltip değişkenleri tanımlanmamış.
* **İki Repo Durumu:** `MSKLabsDesk` ve `webMSKLabs` repoları `DevAdmin` dalında son commit'lerle tamamen güncel ve testleri başarılı (82/82 backend test PASS, 604 webMSKLabs test PASS, frontend 2048 modül build PASS).
