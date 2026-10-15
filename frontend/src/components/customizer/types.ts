export type CustomizerSection =
  | 'colors'
  | 'headings'
  | 'body'
  | 'cards'
  | 'buttons'
  | 'badges'
  | 'tokens'
  | 'package';

export interface ThemeMetrics {
  // Renkler
  accentPrimary: string;
  accentHover: string;
  // Buton Rol Renkleri
  btnViewColor: string; // İncele (Cyan / View)
  btnSuccessColor: string; // Onayla (Emerald / Success)
  btnDangerColor: string; // Reddet (Rose / Danger)
  btnEditColor: string; // Düzenle (Amber / Edit)
  // Başlık Tipografisi
  headingFont: string;
  cardTitleSize: number; // px
  pageTitleSize: number; // px
  titleWeight: number; // 400 - 800
  titleColor: string;
  // Gövde & Açıklama Tipografisi
  bodyFont: string;
  descSize: number; // px
  descColor: string;
  metaSize: number; // px
  // Kartlar
  cardPaddingV: number; // px
  cardPaddingH: number; // px
  cardRadius: number; // px
  cardBg: string;
  cardBorder: string;
  // Butonlar (Köşe yuvarlatma maks 12px sınırlandırılmış)
  btnRadius: number; // px (0-12)
  btnPaddingV: number; // px (2-8)
  btnPaddingH: number; // px (4-16)
  btnFontSize: number; // px (11-14)
  // Rozetler & Etiketler (Köşe yuvarlatma maks 9px sınırlandırılmış)
  badgeRadius: number; // px (0-9)
  badgePaddingV: number; // px (1-6)
  badgePaddingH: number; // px (4-12)
  badgeFontSize: number; // px (10-13)
  // Token & Takip Kodları (MSK-2026-EZRD, #73_LLUNA)
  tokenSize: number; // px (11-16)
  tokenWeight: number; // 500-800
  tokenColor: string; // #hex
  tokenSpacing: string; // -0.04em to 0.04em
  // Genel Ölçek
  fontScale: number; // % (90-115)
}

export const METRIC_BOUNDS = {
  cardTitleSize: { min: 12, max: 18, step: 1, unit: 'px', label: 'Kart Başlık Boyutu' },
  pageTitleSize: { min: 14, max: 24, step: 1, unit: 'px', label: 'Sayfa Başlık Boyutu' },
  descSize: { min: 11, max: 16, step: 1, unit: 'px', label: 'Açıklama Metin Boyutu' },
  metaSize: { min: 10, max: 14, step: 1, unit: 'px', label: 'Tarih / Sayaç Metin Boyutu' },
  cardPaddingV: { min: 4, max: 20, step: 1, unit: 'px', label: 'Kart Dikey Dolgu' },
  cardPaddingH: { min: 8, max: 24, step: 1, unit: 'px', label: 'Kart Yatay Dolgu' },
  cardRadius: { min: 0, max: 20, step: 1, unit: 'px', label: 'Kart Köşe Yuvarlaklığı' },
  btnRadius: { min: 0, max: 12, step: 1, unit: 'px', label: 'Buton Köşe Yuvarlaklığı (0-12px)' },
  btnPaddingV: { min: 2, max: 8, step: 1, unit: 'px', label: 'Buton Dikey Dolgu' },
  btnPaddingH: { min: 4, max: 16, step: 1, unit: 'px', label: 'Buton Yatay Dolgu' },
  btnFontSize: { min: 11, max: 14, step: 1, unit: 'px', label: 'Buton Metin Boyutu' },
  badgeRadius: { min: 0, max: 9, step: 1, unit: 'px', label: 'Rozet Köşe Yuvarlaklığı (0-9px)' },
  badgePaddingV: { min: 1, max: 6, step: 1, unit: 'px', label: 'Rozet Dikey Dolgu' },
  badgePaddingH: { min: 4, max: 12, step: 1, unit: 'px', label: 'Rozet Yatay Dolgu' },
  badgeFontSize: { min: 10, max: 13, step: 1, unit: 'px', label: 'Rozet Metin Boyutu' },
  tokenSize: { min: 11, max: 16, step: 1, unit: 'px', label: 'Token / Kod Yazı Boyutu' },
  fontScale: { min: 90, max: 115, step: 1, unit: '%', label: 'Genel Font Ölçeği' },
} as const;

export const AVAILABLE_FONTS = [
  { id: 'system', name: 'Sistem Varsayılanı', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { id: 'inter', name: 'Inter (Modern & Düzgün)', family: "'Inter', sans-serif" },
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans (Kibar & Kurumsal)', family: "'Plus Jakarta Sans', sans-serif" },
  { id: 'outfit', name: 'Outfit (Geometrik & Net)', family: "'Outfit', sans-serif" },
  { id: 'roboto', name: 'Roboto (Klasik Google Standardı)', family: "'Roboto', sans-serif" },
  { id: 'poppins', name: 'Poppins (Yumuşak & Estetik)', family: "'Poppins', sans-serif" },
  { id: 'montserrat', name: 'Montserrat (Geniş & Vurgulu)', family: "'Montserrat', sans-serif" },
  { id: 'cairo', name: 'Cairo (Çok Dilli Arapça/Latin)', family: "'Cairo', sans-serif" },
] as const;

export const DEFAULT_DARK_METRICS: ThemeMetrics = {
  accentPrimary: '#6366f1',
  accentHover: '#4f46e5',
  btnViewColor: '#06b6d4',
  btnSuccessColor: '#10b981',
  btnDangerColor: '#f43f5e',
  btnEditColor: '#f59e0b',
  headingFont: 'system',
  cardTitleSize: 14,
  pageTitleSize: 17,
  titleWeight: 600,
  titleColor: '#F8FAFC',
  bodyFont: 'system',
  descSize: 14,
  descColor: '#94A3B8',
  metaSize: 12,
  cardPaddingV: 8,
  cardPaddingH: 12,
  cardRadius: 8,
  cardBg: 'rgba(18, 24, 38, 0.75)',
  cardBorder: 'rgba(255, 255, 255, 0.14)',
  btnRadius: 6,
  btnPaddingV: 3,
  btnPaddingH: 8,
  btnFontSize: 12,
  badgeRadius: 4,
  badgePaddingV: 2,
  badgePaddingH: 6,
  badgeFontSize: 11,
  tokenSize: 13,
  tokenWeight: 800,
  tokenColor: '#06b6d4',
  tokenSpacing: '-0.02em',
  fontScale: 100,
};

export const DEFAULT_LIGHT_METRICS: ThemeMetrics = {
  accentPrimary: '#6366f1',
  accentHover: '#4f46e5',
  btnViewColor: '#0891b2',
  btnSuccessColor: '#059669',
  btnDangerColor: '#e11d48',
  btnEditColor: '#d97706',
  headingFont: 'system',
  cardTitleSize: 14,
  pageTitleSize: 17,
  titleWeight: 600,
  titleColor: '#0F172A',
  bodyFont: 'system',
  descSize: 14,
  descColor: '#475569',
  metaSize: 12,
  cardPaddingV: 8,
  cardPaddingH: 12,
  cardRadius: 8,
  cardBg: '#FFFFFF',
  cardBorder: 'rgba(15, 23, 42, 0.14)',
  btnRadius: 6,
  btnPaddingV: 3,
  btnPaddingH: 8,
  btnFontSize: 12,
  badgeRadius: 4,
  badgePaddingV: 2,
  badgePaddingH: 6,
  badgeFontSize: 11,
  tokenSize: 13,
  tokenWeight: 800,
  tokenColor: '#0891b2',
  tokenSpacing: '-0.02em',
  fontScale: 100,
};

export function clampMetric<K extends keyof typeof METRIC_BOUNDS>(
  key: K,
  value: number
): number {
  const bound = METRIC_BOUNDS[key];
  if (!bound) return value;
  return Math.min(Math.max(value, bound.min), bound.max);
}
