# MSKLabsDesk — Kurumsal Sayfa Stüdyosu: Kapsamlı Analiz & Geliştirme Raporu

> **Bu doküman bir Gemini AI kod ajanına verilmek üzere hazırlanmıştır.**
> Projenin mevcut kaynak kodunu, tespit edilen tüm eksik ve sorunları, önerilen yeni mimariyi ve uygulanabilir görev listesini eksiksiz olarak içerir.

---

## PROJE BAĞLAMI

**Repo:** `D:\Code\mskaymaz\MSKLabsDesk`
**Stack:** React 18 + TypeScript + Vite (frontend) / Cloudflare Workers + D1 (backend)
**Stil Sistemi:** CSS değişkenleri (`var(--bg-primary)`, `var(--accent-cyan)` vb.), Lucide React ikonları
**Hedef Modül:** `frontend/src/` altındaki Kurumsal Sayfa (CMS) Stüdyosu

### Proje Yapısı

```
frontend/src/
├── views/
│   ├── PagesView.tsx           ← Sayfa listesi & CRUD yöneticisi
│   └── PageStudioView.tsx      ← Ana stüdyo orkestratörü (511 satır)
├── components/pages/
│   ├── BlockPalette.tsx        ← Sol panel: bileşen kütüphanesi (215 satır)
│   ├── PageCanvas.tsx          ← Orta sahne: interaktif tuval (270 satır)
│   ├── BlockRenderer.tsx       ← Blok render motoru (367 satır)
│   ├── BlockInspector.tsx      ← Sağ panel: özellik denetçisi (430 satır)
│   ├── PagePreviewModal.tsx    ← Canlı önizleme modalı (247 satır)
│   ├── StudioTopBar.tsx        ← Üst araç çubuğu (356 satır)
│   ├── StudioTemplatesModal.tsx← Hazır şablon seçici (5.5 KB)
│   ├── StudioRevisionsModal.tsx← Revizyon geçmişi modalı (7 KB)
│   ├── studioTemplatePresets.ts← Hazır şablon verileri (19 KB, 384 satır)
│   └── ModularSectionBuilder.tsx ← ESKİ/KULLANILMAYAN bileşen (342 satır)
├── types/index.ts              ← Tüm TypeScript tip tanımları
└── styles/
    └── editor.css              ← TipTap editör stilleri
```

---

## MEVCUT KAYNAK KODLAR

### 1. `types/index.ts` — İlgili Tip Tanımları

```typescript
export type StudioBlockType =
  | 'hero'
  | 'features_grid'
  | 'faq_accordion'
  | 'contact_card'
  | 'rich_text'
  | 'cta_banner'
  | 'comparison_table'
  | 'ad_hook';

export interface StudioBlockItem {
  id: string;
  title: string;
  title_tr?: string;
  title_en?: string;
  title_ar?: string;
  text: string;
  text_tr?: string;
  text_en?: string;
  text_ar?: string;
  icon?: string;
  link?: string;
  price?: string;
  price_en?: string;
  price_ar?: string;
  badge?: string;
  badge_en?: string;
  badge_ar?: string;
  highlight?: boolean;
}

export interface StudioBlock {
  id: string;
  type: StudioBlockType;
  // Çok dilli başlık
  title_tr: string;
  title_en?: string;
  title_ar?: string;
  subtitle_tr?: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  content_tr?: string;
  content_en?: string;
  content_ar?: string;
  // İçerik
  items?: StudioBlockItem[];
  // Tasarım tokenleri
  padding_y?: 'none' | 'sm' | 'md' | 'lg';
  bg_variant?: 'default' | 'surface' | 'gradient' | 'muted';
  border_radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  align?: 'left' | 'center' | 'right';
  // Blok tipine özel alanlar (hepsi flat tek interface'de)
  ad_slot_key?: string;
  app_id?: string;
  badge_text?: string;
  badge_text_en?: string;
  badge_text_ar?: string;
  btn_primary_text?: string;
  btn_primary_text_en?: string;
  btn_primary_text_ar?: string;
  btn_primary_link?: string;
  btn_secondary_text?: string;
  btn_secondary_text_en?: string;
  btn_secondary_text_ar?: string;
  btn_secondary_link?: string;
  bg_image?: string;
  grid_columns?: 2 | 3 | 4;
}

export interface PageRevision {
  id: string;
  timestamp: string;
  formattedDate: string;
  author: string;
  note: string;
  blocks_count: number;
  blocks: StudioBlock[];
}

export interface SitePage {
  id: string;
  slug: string;
  title_tr: string;
  title_en?: string;
  title_ar?: string;
  summary_tr?: string;
  summary_en?: string;
  summary_ar?: string;
  content_tr: string;
  content_en?: string;
  content_ar?: string;
  hero_image?: string;
  meta_json?: string;       // JSON içinde: { blocks, revisions, seo_keywords }
  status: 'draft' | 'published' | 'archived';
  display_order?: number;
  is_system?: boolean | number;
  created_at?: string;
  updated_at?: string;
}

export interface PageFormData {
  slug: string;
  title_tr: string;
  title_en: string;
  title_ar: string;
  summary_tr: string;
  summary_en: string;
  summary_ar: string;
  content_tr: string;
  content_en: string;
  content_ar: string;
  hero_image: string;
  meta_json?: string;
  meta_keywords?: string;
  meta_description_tr?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
  status: 'draft' | 'published' | 'archived';
  display_order: number;
}
```

---

### 2. `PageStudioView.tsx` — Ana Orkestratör (Tam Kod)

```tsx
import React, { useState, useEffect } from 'react';
import type { SitePage, PageFormData, StudioBlock, StudioBlockType, PageRevision } from '../types';
import { api } from '../services/api';
import { BlockPalette } from '../components/pages/BlockPalette';
import { PageCanvas } from '../components/pages/PageCanvas';
import { BlockInspector } from '../components/pages/BlockInspector';
import { PagePreviewModal } from '../components/pages/PagePreviewModal';
import { StudioTopBar } from '../components/pages/StudioTopBar';
import { StudioTemplatesModal } from '../components/pages/StudioTemplatesModal';
import { StudioRevisionsModal } from '../components/pages/StudioRevisionsModal';

export const PageStudioView: React.FC<PageStudioViewProps> = ({
  isOpen, onClose, editingPage, formData, setFormData, onSave, onAiTranslate, aiTranslating,
}) => {
  const [activeTab, setActiveTab] = useState<'tr' | 'en' | 'ar'>('tr');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isRevisionsOpen, setIsRevisionsOpen] = useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [canvasTheme, setCanvasTheme] = useState<'light' | 'dark'>('light');
  const [canvasZoom, setCanvasZoom] = useState<'fit' | '100' | '75'>('100');
  const [blocks, setBlocks] = useState<StudioBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [revisions, setRevisions] = useState<PageRevision[]>([]);
  const [history, setHistory] = useState<StudioBlock[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [autosaveState, setAutosaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');
  const [internalAiTranslating, setInternalAiTranslating] = useState(false);

  // Sayfa açıldığında blokları başlat
  useEffect(() => {
    if (!isOpen) return;
    let initialBlocks: StudioBlock[] = [];
    if (editingPage?.meta_json) {
      try {
        const meta = JSON.parse(editingPage.meta_json);
        if (Array.isArray(meta.blocks) && meta.blocks.length > 0) initialBlocks = meta.blocks;
        if (Array.isArray(meta.revisions)) setRevisions(meta.revisions);
      } catch {}
    }
    if (initialBlocks.length === 0) {
      initialBlocks = [
        { id: `blk_hero_${Date.now()}`, type: 'hero', title_tr: formData.title_tr || 'Sayfa Başlığı', ... },
        { id: `blk_text_${Date.now() + 1}`, type: 'rich_text', title_tr: '', content_tr: formData.content_tr || '<p>Sayfa içeriği...</p>', ... },
      ];
    }
    setBlocks(initialBlocks);
    setHistory([initialBlocks]);
    setHistoryIndex(0);
  }, [isOpen, editingPage]);

  // 3000ms Debounced Autosave — SADECE formData'yı günceller, API çağrısı yapmaz
  useEffect(() => {
    if (autosaveState === 'dirty') {
      const timer = setTimeout(() => {
        setAutosaveState('saving');
        compileBlocksToFormData(blocks);
        setTimeout(() => setAutosaveState('saved'), 600);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autosaveState, blocks]);

  // compileBlocksToFormData: Tüm blok tiplerini if/else ile işleyen 60 satırlık tek fonksiyon
  const compileBlocksToFormData = (currBlocks: StudioBlock[]) => {
    const renderLang = (lang: 'tr' | 'en' | 'ar') => {
      let out = '';
      currBlocks.forEach((b) => {
        if (b.type === 'hero') {
          out += `<div class="cms-hero text-${b.align || 'center'}">...</div>\n`;
        } else if (b.type === 'features_grid') {
          out += `<div class="cms-features-section">...</div>\n`;
        } else if (b.type === 'faq_accordion') {
          out += `<div class="cms-faq-group">...</div>\n`;
        } else if (b.type === 'contact_card') {
          out += `<div class="cms-contact-box">...</div>\n`;
        } else if (b.type === 'cta_banner') {
          out += `<div class="cms-cta-banner">...</div>\n`;
        } else if (b.type === 'comparison_table') {
          out += `<div class="cms-pricing-table">...</div>\n`;
        } else if (b.type === 'ad_hook') {
          out += `<!-- AD_SLOT: ${b.ad_slot_key || 'ad_in_content'} -->\n`;
        } else {
          out += b.content_tr || '';
        }
      });
      return out;
    };
    setFormData((prev) => ({
      ...prev,
      content_tr: renderLang('tr'),
      content_en: renderLang('en'),
      content_ar: renderLang('ar'),
      meta_json: JSON.stringify({ ...parsedMeta, blocks: currBlocks }),
    }));
  };

  // Undo/Redo
  const pushHistory = (newBlocks: StudioBlock[]) => { ... };
  const undo = () => { ... };
  const redo = () => { ... };

  // Blok işlemleri
  const handleAddBlock = (type: StudioBlockType, insertAt?: number) => { ... };
  const handleUpdateBlock = (patch: Partial<StudioBlock>) => { ... };
  const handleDeleteBlock = (id: string) => { ... };
  const handleCloneBlock = (id: string) => { ... };
  const handleMoveBlock = (id: string, dir: 'up' | 'down') => { ... };

  // Revizyonlar meta_json içinde saklanıyor (DB'ye yazılmıyor)
  const addRevisionSnapshot = (blocksToSave: StudioBlock[], note = 'Düzenleme') => { ... };

  return (
    <div className="studio-container" style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 1200 }}>
      <StudioTopBar ... />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <PageCanvas ... />
        {/* Sol flyout panel */}
        {isLeftPanelOpen && <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 40 }}><BlockPalette ... /></div>}
        {/* Sağ flyout panel */}
        {isRightPanelOpen && selectedBlock && <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 40 }}><BlockInspector ... /></div>}
      </div>
      <PagePreviewModal ... />
      <StudioTemplatesModal ... />
      <StudioRevisionsModal ... />
    </div>
  );
};
```

---

### 3. `BlockPalette.tsx` — Sol Panel: Bileşen Kütüphanesi

Mevcut blok tipleri (8 adet):

| Tip | Kategori | Açıklama |
|-----|----------|----------|
| `hero` | core | Büyük başlık, slogan, arka plan ve aksiyon butonları |
| `features_grid` | content | 3'lü / 4'lü özellik kartları ızgarası |
| `faq_accordion` | content | Açılır-kapanır SSS blokları |
| `contact_card` | content | E-posta, destek kanalları |
| `cta_banner` | marketing | Eylem çağrısı şeridi |
| `comparison_table` | marketing | Paket/plan karşılaştırma tablosu |
| `rich_text` | core | Serbest HTML metin alanı |
| `ad_hook` | ads | Reklam yuvası bağlantısı |

Kategori filtreleme (`all / core / content / marketing / ads`) ve arama mevcut. Blok ekleme yalnızca tıklamayla olur; sürükle-bırak ve thumbnail önizleme yoktur.

---

### 4. `BlockRenderer.tsx` — Render Motoru (Sorunlu Yapı)

```tsx
// Dil çözümleme mantığı: her blok için elle yazılıyor (DRY ihlali)
const title = (lang === 'tr' ? block.title_tr : lang === 'en' ? block.title_en : block.title_ar) || block.title_tr || '';
const subtitle = (lang === 'tr' ? block.subtitle_tr : lang === 'en' ? block.subtitle_en : block.subtitle_ar) || block.subtitle_tr || '';
// Bu mantık BlockInspector.tsx'de ve compileBlocksToFormData'da da birebir tekrarlanıyor

// Blok switch — yeni blok eklemek için buraya case eklenmeli (5 dosyadan biri)
switch (block.type) {
  case 'hero': return <section>...</section>;
  case 'features_grid': return <section>...</section>;
  case 'faq_accordion': return <section>...</section>;
  case 'comparison_table': return <section>...</section>;
  case 'contact_card': return <section>...</section>;
  case 'cta_banner': return <section>...</section>;
  case 'ad_hook': return <section>...</section>;
  case 'rich_text':
  default: return <section dangerouslySetInnerHTML={{ __html: content }} />;
}
```

**Kritik sorun:** `rich_text` bloğu `dangerouslySetInnerHTML` ile render ediliyor; XSS riski var ve sanitize işlemi yok.

---

### 5. `BlockInspector.tsx` — Sağ Panel: Özellik Denetçisi

**Mevcut özellikler:**
- Hızlı eylemler: Yukarı/Aşağı Taşı, Çoğalt, Sil
- Metin alanları: Başlık, Alt Başlık (aktif dil için)
- Hero'ya özel: Rozet metin, Birincil/İkincil buton metni
- Rich text'e özel: Ham textarea (TipTap yok)
- Ad hook'a özel: Reklam yuvası seçimi
- Features grid'e özel: Sütun sayısı (2/3/4)
- Tüm tipler: items yöneticisi (ekle/sil/güncelle)
- Tasarım token'leri: padding_y, bg_variant, border_radius, align (seçim menüleri)

**Kritik eksikler:**
- `bg_image` alanı type'da var ama inspector'da UI yok
- İkon seçici yok
- Renk seçici (color picker) yok
- Link editörü (iç sayfa listesinden seçim) yok
- Sekmeli yapı yok (tüm ayarlar tek scrollable listede)
- Rich text için TipTap veya WYSIWYG editör yok

---

### 6. `PageCanvas.tsx` — Orta Sahne: Tuval

**Mevcut özellikler:**
- Sabit genişlik artboard: desktop=1140px, tablet=768px, mobile=390px
- CSS transform ile zoom: %75, %100, fit
- Blok seçimi: tıklamayla
- Seçili blok üstünde araç çubuğu (Yukarı/Aşağı/Çoğalt/Sil)
- Bloklar arası "+" butonu (hover'da görünür)
- Sol/sağ panel açma/kapama sekmesi
- Açık/koyu tema geçişi

**Kritik eksikler:**
- Sürükle-bırak (DnD) yok; büyük sayfalarda taşıma çok yavaş
- CSS transform zoom bozuk scroll davranışı yaratıyor
- Blok thumbnail önizlemesi yok

---

### 7. `StudioTopBar.tsx` — Üst Araç Çubuğu

**Sol bölge:** Geri butonu, sayfa başlığı + autosave rozeti, sistem sayfası rozeti
**Orta bölge:** Sol panel toggle, cihaz seçici (masaüstü/tablet/mobil), zoom seçici (%75/%100/sığdır), açık/koyu toggle, sağ panel toggle
**Sağ bölge:** Undo/Redo, Dil seçici (TR/EN/AR), AI Çevir butonu, Şablonlar, Geçmiş, SEO (açılır panel), Önizle, Yayına Al

**SEO Paneli** (`isMetaOpen=true` iken görünen drop-down):
- Slug input (sistem sayfalarında devre dışı)
- Yayın durumu (Yayında/Taslak/Arşivlendi)
- SEO anahtar kelimeleri (virgülle ayrılmış, tek input)
- Meta açıklama alanı: `PageFormData`'da `meta_description_tr/en/ar` tanımlı ama SEO panelinde gösterilmiyor

---

### 8. `studioTemplatePresets.ts` — Hazır Şablonlar

Mevcut 3 şablon:
1. **Kurumsal Karşılama (Landing)** — Hero + Features + Comparison + CTA (4 blok)
2. **Hakkımızda Sayfası** — Hero + Features + rich_text (özelleştirilmiş) (3 blok)
3. **SSS Sayfası** — Hero + faq_accordion (2 blok)

Her şablonda TR/EN/AR içerikler hazır doldurulmuş.

---

## TESPİT EDİLEN TÜM SORUNLAR VE EKSİKLER

### KRİTİK MİMARİ SORUNLAR (Önce Bunlar Çözülmeli)

**SORUN-1: Blok kayıt sistemi yok — 5 Dosya Kuralı**
Yeni bir blok tipi eklemek için şu an bu 5 dosyada değişiklik yapmak gerekiyor:
1. `types/index.ts` → `StudioBlockType` union'a ekleme
2. `BlockRenderer.tsx` → `switch` case ekleme
3. `BlockInspector.tsx` → if/else alanları ekleme
4. `BlockPalette.tsx` → `BLOCK_TEMPLATES` dizisine ekleme
5. `PageStudioView.tsx` → `compileBlocksToFormData` ve `handleAddBlock` defaults'larına ekleme

Bu pattern ölçeklenemez ve hata riskini artırıyor.

**SORUN-2: DRY İhlali — Üç Dosyada Tekrarlanan Dil Çözümleme**
Şu mantık `BlockRenderer.tsx`, `BlockInspector.tsx` ve `compileBlocksToFormData` içinde birebir kopyalanmış:
```ts
const title = (lang === 'tr' ? block.title_tr : lang === 'en' ? block.title_en : block.title_ar) || block.title_tr || '';
```
Tek bir yardımcı fonksiyon yoktur.

**SORUN-3: Flat Tip Arayüzü — Tip Güvenliği Yok**
`StudioBlock` interface'i tüm blok tiplerinin alanlarını tek flat nesnede birleştiriyor. `hero` tipi için `grid_columns` alanı `undefined` olduğunda TypeScript bunu kontrol etmiyor. Discriminated union kullanılmalı.

**SORUN-4: Autosave gerçek API çağrısı yapmıyor**
`autosaveState: 'saving'` durumunda sadece `formData` state'i güncelleniyor. Tarayıcı kapanırsa son 3 dakikaya kadar değişiklikler kaybolabilir.

**SORUN-5: Revizyonlar DB'ye yazılmıyor**
Revizyon geçmişi `meta_json` BLOB alanı içinde saklanıyor. Sayfa listesinden başka bir sayfaya geçilip geri dönüldüğünde revizyonlar `editingPage.meta_json`'dan tekrar yüklenebilir ama tarayıcı çökmesi veya başka bir oturumdan yükleme durumunda revizyonlar güvenilir değil.

**SORUN-6: `ModularSectionBuilder.tsx` ölü kod**
342 satırlık bu bileşen hiçbir yerde import edilmiyor. Bundle size şişiriyor, kafa karışıklığı yaratıyor.

**SORUN-7: `rich_text` bloğunda XSS riski**
```tsx
<div dangerouslySetInnerHTML={{ __html: content }} />
```
HTML sanitize işlemi yok (DOMPurify veya benzeri kullanılmıyor).

---

### UX VE GÖRSEL SORUNLAR

**SORUN-8: Sürükle-bırak yok**
Bloklar sadece ↑↓ butonlarıyla taşınıyor. 10+ bloklu bir sayfada taşıma son derece verimsiz.

**SORUN-9: Blok thumbnail önizlemesi yok**
`BlockPalette`'de her blok kartı metin açıklaması içeriyor ama görsel önizleme yok. Kullanıcı bloğu eklemeden nasıl görüneceğini bilemiyor.

**SORUN-10: `bg_image` alanı için UI yok**
`StudioBlock` interface'inde `bg_image?: string` tanımlı ve `BlockRenderer`'da kullanılıyor:
```tsx
if (block.bg_image) {
  return { backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.78), ...), url(${block.bg_image})`, ... };
}
```
Ama `BlockInspector`'da bu alanı düzenlemeye yarayan hiçbir UI elemanı yok. Hero bloğuna arka plan görseli atamak mümkün değil.

**SORUN-11: Rich text inspector ham textarea**
`rich_text` bloğu için `BlockInspector` basit `<textarea>` sunuyor. Kalın, italik, liste gibi temel formatlama yapılamıyor.

**SORUN-12: CSS transform zoom scroll bozukluğu**
```tsx
const scaleStyle: React.CSSProperties =
  canvasZoom === '75'
    ? { transform: 'scale(0.75)', transformOrigin: 'top center', marginBottom: '-25%' }
    : canvasZoom === 'fit'
    ? { transform: 'scale(0.85)', transformOrigin: 'top center', marginBottom: '-15%' }
    : {};
```
CSS `transform: scale()` ile yapılan zoom, gerçek viewport genişliğini değiştirmiyor. Bloklar responsive CSS'lerini yanlış hesaplıyor.

**SORUN-13: Önizleme iframe izolasyonu yok**
`PagePreviewModal` blokları `BlockRenderer` bileşeniyle render ediyor. Admin panel'in CSS'i içerikleri etkiliyor; gerçek web sitesinin CSS'i test edilemiyor.

**SORUN-14: EN/AR sekmesinde içerik boş görünüyor**
Kullanıcı TR içeriği yazdıktan sonra EN sekmesine geçtiğinde, AI çeviri yapılmamışsa tüm inspector alanları boş. "Bu alanda henüz içerik yok, AI ile çevir" gibi bir yönlendirme mesajı yok.

**SORUN-15: SEO panelinde meta_description alanları gösterilmiyor**
`PageFormData`'da tanımlı olan `meta_description_tr`, `meta_description_en`, `meta_description_ar` alanları `StudioTopBar`'ın SEO panelinde görünmüyor.

---

### İŞLEVSEL EKSİKLER

**EKSİK-1: Medya yöneticisi yok**
`bg_image`, `hero_image` ve gelecekte eklenecek görseller için URL manuel girilmek zorunda. Cloudflare R2 veya Workers KV entegrasyonu, görsel yükleme arayüzü yok.

**EKSİK-2: İkon seçici yok**
`StudioBlockItem.icon` alanı var ama inspector'da bu alanı düzenleyen UI yok. `features_grid` kartlarında tüm ikon `CheckCircle2` sabit olarak render ediliyor.

**EKSİK-3: Link editörü yok**
`btn_primary_link`, `btn_secondary_link` alanları için metin input mevcut ama `PagesView`'dan sayfa listesi getirip seçim yapılmasına olanak tanıyan picker yok.

**EKSİK-4: Renk seçici yok**
`bg_variant` ile 4 sabit seçenek var. Gerçek hex/hsl renk seçici, gradient oluşturucu yok.

**EKSİK-5: Klavye kısayolları yok**
Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+S (kaydet), Ctrl+P (önizle) gibi standart editör kısayolları tanımlanmamış.

**EKSİK-6: Blok panosu (clipboard) yok**
Bir bloğu kopyalayıp başka bir sayfaya yapıştırmak mümkün değil.

**EKSİK-7: SEO SERP önizlemesi yok**
Meta başlık/açıklama girildiğinde Google arama sonucu simülasyonu gösterilmiyor.

**EKSİK-8: AI ile blok içeriği üretimi yok**
Her blok için "Bu bloğun içeriğini AI ile doldur" özelliği yok. Mevcut AI özelliği sadece tüm sayfayı çeviriyor.

**EKSİK-9: History stack sınırı yok**
`history: StudioBlock[][]` dizisi sınırsız büyüyor. 100+ blok değişikliğinde bellek şişmesi.

**EKSİK-10: History stack `autosaveState`'den bağımsız**
Undo yapıldığında `autosaveState` 'dirty' olmaya devam ediyor ama aslında önceki state'e dönüldü. Bu tutarsızlık gerçek autosave eklendiğinde bug yaratacak.

---

## HEDEF MİMARİ: BLOCK REGISTRY PATTERN

### Yeni Dizin Yapısı

```
frontend/src/blocks/
├── registry.ts                   ← Merkezi kayıt + tip dışa aktarımı
├── shared/
│   ├── langHelpers.ts            ← Dil çözümleme yardımcıları (DRY çözümü)
│   ├── BaseInspectorFields.tsx   ← Ortak alanlar: padding, bg, align
│   └── ItemManager.tsx           ← Ortak madde listesi editörü
├── hero/
│   ├── index.ts                  ← BlockDefinition kaydı
│   ├── HeroRenderer.tsx
│   ├── HeroInspector.tsx
│   ├── HeroCompiler.ts           ← HTML string üretici
│   ├── HeroDefaults.ts           ← Varsayılan değerler
│   └── HeroThumbnail.tsx         ← Palette mini önizleme (SVG)
├── features_grid/ ...
├── faq_accordion/ ...
├── contact_card/ ...
├── cta_banner/ ...
├── comparison_table/ ...
├── rich_text/ ...
├── ad_hook/ ...
└── [YENİ BLOKLAR]/ ...
```

### Registry Arayüzü

```typescript
// frontend/src/blocks/registry.ts

export type Lang = 'tr' | 'en' | 'ar';

export interface BlockRendererProps<T extends StudioBlock = StudioBlock> {
  block: T;
  lang: Lang;
  device?: 'desktop' | 'tablet' | 'mobile';
  isInteractive?: boolean;
}

export interface BlockInspectorProps<T extends StudioBlock = StudioBlock> {
  block: T;
  onUpdate: (patch: Partial<T>) => void;
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onClose: () => void;
  lang: Lang;
}

export interface BlockDefinition<T extends StudioBlock = StudioBlock> {
  type: StudioBlockType;
  title: string;
  category: 'core' | 'content' | 'marketing' | 'ads' | 'media';
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  thumbnail?: React.FC; // Palette mini önizleme
  createDefaults: () => Omit<T, 'id'>;
  Renderer: React.FC<BlockRendererProps<T>>;
  Inspector: React.FC<BlockInspectorProps<T>>;
  compileToHtml: (block: T, lang: Lang) => string;
}

const registry = new Map<string, BlockDefinition>();

export function registerBlock<T extends StudioBlock>(def: BlockDefinition<T>) {
  registry.set(def.type, def as BlockDefinition);
}

export function getBlock(type: string): BlockDefinition | undefined {
  return registry.get(type);
}

export function getAllBlocks(): BlockDefinition[] {
  return Array.from(registry.values());
}

// Her blok kendi dosyasında registerBlock() çağırır
// Bu dosyada tüm importlar:
import './hero';
import './features_grid';
import './faq_accordion';
import './contact_card';
import './cta_banner';
import './comparison_table';
import './rich_text';
import './ad_hook';
// Yeni bloklar buraya eklenir, başka hiçbir dosyaya dokunulmaz
```

### Dil Yardımcıları (DRY Çözümü)

```typescript
// frontend/src/blocks/shared/langHelpers.ts

export type Lang = 'tr' | 'en' | 'ar';

export function getLang<T extends object>(obj: T, field: string, lang: Lang, fallback = ''): string {
  if (lang === 'tr') return (obj as any)[`${field}_tr`] ?? (obj as any)[field] ?? fallback;
  if (lang === 'en') return (obj as any)[`${field}_en`] ?? (obj as any)[`${field}_tr`] ?? (obj as any)[field] ?? fallback;
  if (lang === 'ar') return (obj as any)[`${field}_ar`] ?? (obj as any)[`${field}_tr`] ?? (obj as any)[field] ?? fallback;
  return fallback;
}

export function setLang(field: string, lang: Lang, value: string): Record<string, string> {
  if (lang === 'tr') return { [`${field}_tr`]: value, [field]: value };
  return { [`${field}_${lang}`]: value };
}
```

### Discriminated Union Tipler

```typescript
// Mevcut flat StudioBlock yerine:

interface BaseBlock {
  id: string;
  padding_y?: 'none' | 'sm' | 'md' | 'lg';
  bg_variant?: 'default' | 'surface' | 'gradient' | 'muted';
  border_radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  align?: 'left' | 'center' | 'right';
}

interface HeroBlock extends BaseBlock {
  type: 'hero';
  title_tr: string; title_en?: string; title_ar?: string;
  subtitle_tr?: string; subtitle_en?: string; subtitle_ar?: string;
  badge_text?: string; badge_text_en?: string; badge_text_ar?: string;
  btn_primary_text?: string; btn_primary_text_en?: string; btn_primary_text_ar?: string;
  btn_primary_link?: string;
  btn_secondary_text?: string; btn_secondary_text_en?: string; btn_secondary_text_ar?: string;
  btn_secondary_link?: string;
  bg_image?: string;
  bg_overlay_opacity?: number;
  layout?: 'centered' | 'split-left' | 'split-right';
}

// ... diğer blok tipleri
export type StudioBlock = HeroBlock | FeaturesGridBlock | FaqAccordionBlock | /* ... */;
```

---

## EKLENECEK YENİ BLOK TİPLERİ (12 ADET)

| Blok Tipi | Başlık | Kategori | Açıklama |
|-----------|--------|----------|----------|
| `image_text_split` | Görsel + Metin (Split) | content | Sol veya sağda görsel, yanında metin. Hakkımızda, misyon sayfaları için ideal. |
| `stats_counter` | Sayısal İstatistikler | marketing | Animasyonlu sayaç kartları. "10.000+ kullanıcı", "50+ proje" gibi metrikler. |
| `team_grid` | Ekip Üyeleri | content | Fotoğraf, isim, ünvan ve sosyal medya bağlantıları olan ekip kartları. |
| `testimonials_carousel` | Kullanıcı Yorumları | marketing | Dönen yorum kartları. Ad, fotoğraf, yıldız puanı, yorum metni. |
| `timeline` | Zaman Çizelgesi | content | Dikey milestone listesi. Tarih, başlık, açıklama. Hakkımızda, roadmap için. |
| `embed_block` | Medya Embed | media | YouTube/Vimeo video, Google Harita veya iframe embed alanı. |
| `download_card` | İndirme Kartı | content | APK / dosya indirme. İkon, dosya adı, boyut, versiyon, indirme butonu. |
| `icon_list` | İkonlu Madde Listesi | content | Yanında Lucide ikonu olan madde listesi. Özellikler, avantajlar için. |
| `divider` | Bölüm Ayracı | core | Sayfayı ayıran çizgi, dalga veya zigzag SVG. Yükseklik ve renk ayarlanabilir. |
| `spacer` | Boşluk | core | Piksel bazında yükseklik ayarlanabilen boş alan bloğu. |
| `gallery_grid` | Fotoğraf Galerisi | media | Ekran görüntüleri veya fotoğraf galerisi. 2-4 sütun grid. Lightbox desteği. |
| `table_data` | Veri Tablosu | content | Satır-sütun tablosu editörü. Başlık satırı, renkli satırlar, sıralama. |

---

## UYGULANACAK BAĞIMLILIKLAR

```bash
# Sürükle-bırak
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Renk seçici
npm install react-colorful

# Görsel yükleme
npm install react-dropzone

# HTML sanitizasyonu (XSS koruması)
npm install dompurify
npm install --save-dev @types/dompurify

# Rich text editörü (zaten kurulu olabilir, kontrol et)
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link

# Immutable state yönetimi (history stack optimizasyonu)
npm install immer

# Animasyonlar
npm install framer-motion
```

---

## UYGULAMA GÖREV LİSTESİ

### FAZA 1 — Temizlik ve Mimari Yeniden Yapılandırma

#### Görev 1.1: Ölü Kodu Kaldır
`frontend/src/components/pages/ModularSectionBuilder.tsx` dosyasını sil. Bu dosya 342 satır olup hiçbir yerde import edilmiyor.

#### Görev 1.2: Dil Yardımcısı Oluştur
`frontend/src/blocks/shared/langHelpers.ts` dosyasını oluştur. `getLang()` ve `setLang()` fonksiyonlarını yaz. `BlockRenderer.tsx`, `BlockInspector.tsx` ve `PageStudioView.tsx` içindeki tekrarlanan dil çözümleme mantığını bu fonksiyonla değiştir.

#### Görev 1.3: Block Registry Kur
`frontend/src/blocks/registry.ts` dosyasını oluştur. `BlockDefinition<T>` interface'ini, `registerBlock()`, `getBlock()`, `getAllBlocks()` fonksiyonlarını yaz.

#### Görev 1.4: Mevcut 8 Bloğu Refactor Et
Her mevcut blok için `frontend/src/blocks/{tip}/` dizini oluştur. Her dizinde `index.ts`, `Renderer.tsx`, `Inspector.tsx`, `Compiler.ts`, `Defaults.ts` dosyalarını oluştur. Mevcut `BlockRenderer.tsx` ve `BlockInspector.tsx`'i bu yeni yapıyı kullanacak şekilde güncelle.

#### Görev 1.5: `PageStudioView.tsx` Refactoring
- `compileBlocksToFormData` fonksiyonunu block registry'yi kullanacak şekilde yeniden yaz
- `handleAddBlock` fonksiyonunu `registry.getBlock(type).createDefaults()` kullanacak şekilde güncelle
- History stack'e `MAX_HISTORY = 50` sınırı ekle
- `autosaveState` tip tanımına `'error'` durumu ekle

#### Görev 1.6: Discriminated Union Tipler
`types/index.ts` içindeki flat `StudioBlock` interface'ini discriminated union'a dönüştür. Her blok tipi için ayrı interface oluştur.

#### Görev 1.7: `rich_text` XSS Güvenliği
```tsx
// DOMPurify ile sanitize et:
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
```

---

### FAZA 2 — Sürükle-Bırak Entegrasyonu

#### Görev 2.1: `@dnd-kit` ile `PageCanvas` Güncelleme
`PageCanvas.tsx` içinde:
```tsx
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';

// Blok listesini SortableContext ile sar
// Her blok kartını useSortable ile sar
// DragOverlay ile sürüklenen bloğun ghost görselini göster
// arrayMove ile sıralamayı güncelle
```

Mevcut ↑↓ butonları silinmeyecek; DnD ile birlikte tutulacak (erişilebilirlik).

---

### FAZA 3 — Zenginleştirilmiş BlockInspector

#### Görev 3.1: Sekmeli Panel Yapısı
`BlockInspector.tsx`'i 3 sekmeye böl:
- **İçerik** — Başlık, alt başlık, metin, butonlar, maddeler
- **Görsel** — Arka plan görseli, arka plan rengi, overlay opaklığı, ikonlar
- **Gelişmiş** — Padding, border-radius, hizalama, özel CSS class

#### Görev 3.2: `bg_image` Alanı için Görsel URL/Yükleme UI
Hero ve CTA Banner bloklarının inspector'ına arka plan görseli düzenleme alanı ekle:
```tsx
<div>
  <span>Arka Plan Görseli:</span>
  <input
    type="text"
    value={block.bg_image || ''}
    onChange={(e) => onUpdate({ bg_image: e.target.value })}
    placeholder="Görsel URL girin veya yükleyin..."
    className="admin-input"
  />
  {/* react-dropzone ile yükleme butonu */}
</div>
```

#### Görev 3.3: Renk Seçici
```tsx
import { HexColorPicker } from 'react-colorful';
// bg_variant yerine doğrudan hex renk seçimi
```

#### Görev 3.4: İkon Seçici
Features grid kartları için Lucide ikonlarından seçim yapılabilen grid:
```tsx
// Lucide'den 40-50 sık kullanılan ikon ile grid
const ICON_OPTIONS = ['Shield', 'Zap', 'Globe', 'Heart', 'Star', 'Lock', 'Rocket', ...];
```

#### Görev 3.5: Rich Text için TipTap Inspector
`rich_text` bloğu için inspector'a TipTap editörü entegre et (zaten `editor.css` mevcut, TipTap paketleri kuruluysa).

---

### FAZA 4 — SEO Paneli Geliştirme

#### Görev 4.1: Meta Açıklama Alanları
`StudioTopBar.tsx`'in SEO drop-down paneline `meta_description_tr`, `meta_description_en`, `meta_description_ar` alanlarını ekle.

#### Görev 4.2: SERP Önizleme Simülatörü
SEO panelinin alt kısmına Google arama sonucu simülasyonu ekle:
```tsx
<div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #dfe1e5' }}>
  <div style={{ color: '#1a0dab', fontSize: '18px', fontWeight: 400 }}>
    {formData.title_tr || 'Sayfa Başlığı'} — MSK Labs
  </div>
  <div style={{ color: '#006621', fontSize: '13px' }}>
    msklabs.org › {formData.slug || 'sayfa'}
  </div>
  <div style={{ color: '#545454', fontSize: '13px' }}>
    {formData.meta_description_tr?.slice(0, 160) || formData.summary_tr?.slice(0, 160) || '...'}
  </div>
  {/* Karakter sayacı */}
  <div>Başlık: {(formData.title_tr || '').length}/60 karakter</div>
  <div>Açıklama: {(formData.meta_description_tr || '').length}/160 karakter</div>
</div>
```

---

### FAZA 5 — Klavye Kısayolları ve Autosave

#### Görev 5.1: `useStudioKeyboard` Custom Hook
```typescript
// frontend/src/hooks/useStudioKeyboard.ts
export const useStudioKeyboard = (actions: StudioKeyboardActions) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (isCtrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); actions.undo(); }
      if (isCtrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); actions.redo(); }
      if (isCtrl && e.key === 's') { e.preventDefault(); actions.save(); }
      if (isCtrl && e.key === 'p') { e.preventDefault(); actions.preview(); }
      if (e.key === 'Escape') actions.closeInspector();
      if (e.key === 'Delete' && !e.target) actions.deleteSelected();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions]);
};
```

#### Görev 5.2: Gerçek Autosave API Çağrısı
```typescript
// PageStudioView.tsx içinde
const debouncedApiSave = useMemo(() =>
  debounce(async (blocksToSave: StudioBlock[]) => {
    if (!editingPage?.id) return; // Yeni sayfa: API autosave yapma
    try {
      setAutosaveState('saving');
      const meta = { blocks: blocksToSave, revisions };
      await api.updatePage(editingPage.id, {
        ...formData,
        meta_json: JSON.stringify(meta),
        content_tr: renderLang(blocksToSave, 'tr'),
        content_en: renderLang(blocksToSave, 'en'),
        content_ar: renderLang(blocksToSave, 'ar'),
      });
      setAutosaveState('saved');
    } catch {
      setAutosaveState('error'); // Yeni durum
    }
  }, 5000),
[editingPage?.id]);
```

---

### FAZA 6 — Blok Panosu ve Ek UX

#### Görev 6.1: Blok Panosu (Clipboard)
```typescript
// Bloğu kopyala (localStorage ile sayfalar arası çalışır)
const copyBlock = (block: StudioBlock) => {
  const copy = { ...block, id: `paste_${Date.now()}` };
  localStorage.setItem('msklabs_studio_clipboard', JSON.stringify(copy));
};

// Panoya yapıştır
const pasteBlock = () => {
  const raw = localStorage.getItem('msklabs_studio_clipboard');
  if (!raw) return;
  const block: StudioBlock = JSON.parse(raw);
  block.id = `blk_${block.type}_${Date.now()}_paste`;
  pushHistory([...blocks, block]);
};
```

Yapıştır butonunu `StudioTopBar`'a ve sağ tık context menüye ekle.

#### Görev 6.2: iframe Önizleme
`PagePreviewModal.tsx` içinde `BlockRenderer` yerine gerçek iframe kullan:
```tsx
const html = generateFullPageHtml(blocks, previewLang); // Tüm HTML + CSS döndürür
<iframe
  srcDoc={html}
  style={{ width: previewWidth, height: '100%', border: 'none' }}
  sandbox="allow-scripts allow-same-origin"
/>
```

#### Görev 6.3: `alert()` → Toast Sistemi
`PagesView.tsx` ve `PageStudioView.tsx` içindeki toplam 12 adet `alert()` ve `window.confirm()` çağrısını toast/snackbar bileşeniyle değiştir. Öneri: Mevcut design system'e uygun minimal toast bileşeni.

#### Görev 6.4: EN/AR Boş İçerik Uyarısı
`BlockInspector`'da aktif dil EN veya AR ve içerik boşsa:
```tsx
{lang !== 'tr' && !currentTitle && (
  <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid var(--accent-amber)', borderRadius: '6px', padding: '8px 10px', fontSize: '11px', color: 'var(--accent-amber)' }}>
    Bu dilde henüz içerik yok.{' '}
    <button onClick={onAiTranslate} style={{ fontWeight: 700, textDecoration: 'underline' }}>
      AI ile çevir
    </button>
  </div>
)}
```

---

### FAZA 7 — Yeni Blok Tipleri Ekleme

Her yeni blok için `frontend/src/blocks/{tip}/` dizini oluştur. 12 yeni blok:

**Öncelikli (en çok kullanılacak):**
1. `image_text_split` — Sol/sağ layout seçeneği ile görsel+metin
2. `stats_counter` — 4 sayaç kartı, isteğe bağlı animasyon
3. `icon_list` — Lucide ikonlu madde listesi
4. `divider` — Çizgi/wave/zigzag ayraç
5. `spacer` — Yükseklik ayarlanabilir boşluk

**İkincil:**
6. `embed_block` — YouTube/Vimeo/iframe embed
7. `download_card` — Dosya indirme kartı
8. `gallery_grid` — 2-4 sütunlu fotoğraf galerisi
9. `timeline` — Dikey zaman çizelgesi

**İleri seviye:**
10. `team_grid` — Ekip üyesi kartları
11. `testimonials_carousel` — Yorum slider'ı
12. `table_data` — Satır-sütun tablosu editörü

---

### FAZA 8 — Performans ve Animasyonlar

#### Görev 8.1: `useCallback` Optimizasyonu
`PageStudioView.tsx` içindeki handler fonksiyonları `useCallback` ile sar:
```typescript
const handleUpdateBlock = useCallback((patch: Partial<StudioBlock>) => {
  if (!selectedBlockId) return;
  const next = blocks.map((b) => b.id === selectedBlockId ? { ...b, ...patch } : b);
  pushHistory(next);
}, [selectedBlockId, blocks]);
```

#### Görev 8.2: `StudioContext` ile Prop Drilling Azaltma
```typescript
// frontend/src/context/StudioContext.tsx
const StudioContext = createContext<StudioContextValue | null>(null);
export const useStudio = () => {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudio must be used within StudioProvider');
  return ctx;
};
// blocks, selectedBlockId, lang, device, autosaveState ve tüm handler'lar context'e taşınır
// PageStudioView prop sayısı ~50'den ~10'a iner
```

#### Görev 8.3: Framer Motion Animasyonları
```tsx
// Blok eklendiğinde
<motion.div
  initial={{ opacity: 0, y: -12 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.2 }}
>
  <BlockRenderer ... />
</motion.div>

// Paneller (sol/sağ) açılırken
<motion.div
  initial={{ x: -295 }}
  animate={{ x: 0 }}
  exit={{ x: -295 }}
  transition={{ type: 'spring', damping: 28 }}
>
  <BlockPalette ... />
</motion.div>
```

#### Görev 8.4: Immer ile History Stack Optimizasyonu
```typescript
import { produce } from 'immer';

const pushHistory = useCallback((newBlocks: StudioBlock[]) => {
  setHistory(prev =>
    produce(prev, draft => {
      draft.splice(historyIndex + 1); // Sonraki geçmişi temizle
      draft.push(newBlocks);
      if (draft.length > 50) draft.shift(); // Max 50 kayıt
    })
  );
  setHistoryIndex(prev => Math.min(prev + 1, 49));
  setBlocks(newBlocks);
  setAutosaveState('dirty');
}, [historyIndex]);
```

---

## UYGULAMA SIRASI VE TAHMİNİ EFOR

| Faza | İçerik | Efor |
|------|--------|------|
| **FAZA 1** | Mimari yeniden yapılandırma + DRY temizliği | 2-3 gün |
| **FAZA 2** | Sürükle-bırak (DnD) | 0.5 gün |
| **FAZA 3** | Zengin inspector (sekmeler + bg_image + renk + ikon) | 1-2 gün |
| **FAZA 4** | SEO paneli + SERP simülatörü | 0.5 gün |
| **FAZA 5** | Klavye kısayolları + gerçek autosave | 0.5 gün |
| **FAZA 6** | Clipboard + iframe önizleme + toast + boş uyarı | 0.5 gün |
| **FAZA 7** | 12 yeni blok tipi | 3-4 gün |
| **FAZA 8** | Performans + animasyonlar | 1 gün |

**Toplam tahmini süre:** 9-12 geliştirici-günü

---

## HIZLI KAZANIMLAR (Bu Oturumda Yapılabilir)

Büyük refactor gerektirmeden hemen uygulanabilecek 8 iyileştirme:

1. `ModularSectionBuilder.tsx` dosyasını sil
2. History stack'e `MAX_HISTORY = 50` sınırı ekle (`PageStudioView.tsx` L50)
3. `autosaveState` tipine `'error'` durumu ekle
4. Klavye kısayolları (`useEffect` + `addEventListener`, kütüphane gerektirmiyor)
5. Blok panosu (`localStorage`, kütüphane gerektirmiyor)
6. Hero/CTA Banner inspector'ına `bg_image` URL input alanı ekle
7. `BlockInspector`'a EN/AR boş içerik uyarısı + "AI ile çevir" kısayolu
8. SEO paneline `meta_description` alanlarını ekle (alan zaten `PageFormData`'da var)

---

## KOD STILI VE KISITLAMALAR

1. **TypeScript strict mode** — `any` kullanımı minimize edilecek, discriminated union'lar tercih edilecek
2. **CSS değişkenleri** — Tüm renkler `var(--bg-primary)`, `var(--accent-cyan)` gibi token'larla, hard-coded hex yok
3. **Lucide React ikonları** — Başka ikon kütüphanesi eklenmeyecek
4. **Class isimleri** — `admin-btn`, `admin-badge`, `admin-input`, `admin-select`, `admin-label` sınıfları korunacak
5. **RTL desteği** — Arapça için `dir="rtl"` ve `direction: rtl` korunacak, tüm yeni bloklar RTL uyumlu olacak
6. **3 dil** — TR/EN/AR içerik alanları tüm yeni blok tiplerinde olacak
7. **Mevcut API** — `api.getPages()`, `api.updatePage()`, `api.createPage()`, `api.deletePage()`, `api.translatePage()` endpoint'leri korunacak

---

*Rapor oluşturulma: 22 Ekim 2026 | MSKLabsDesk — Kurumsal Sayfa Stüdyosu Geliştirme Planı*
