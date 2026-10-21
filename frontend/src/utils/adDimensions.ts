export interface ResolvedDimensions {
  w: number;
  h: number;
  isResponsive: boolean;
}

export interface AdSenseCatalogItem {
  key: string;
  label: string;
  desc: string;
  width: number;
  height: number;
  category: 'horizontal' | 'vertical_rect' | 'special';
  isCommon?: boolean;
}

export const ADSENSE_MASTER_CATALOG: AdSenseCatalogItem[] = [
  // 1. Yatay Reklamlar (Horizontal)
  {
    key: '728x90',
    label: '728x90 — Leaderboard',
    desc: 'Masaüstü sayfa başı veya içerik arası standart yatay bant',
    width: 728,
    height: 90,
    category: 'horizontal',
    isCommon: true,
  },
  {
    key: '970x90',
    label: '970x90 — Large Leaderboard',
    desc: 'Geniş ekranlar için büyük yatay başlık reklamı',
    width: 970,
    height: 90,
    category: 'horizontal',
    isCommon: true,
  },
  {
    key: '970x250',
    label: '970x250 — Billboard',
    desc: 'Yüksek görünürlüklü dev yatay pano reklamı',
    width: 970,
    height: 250,
    category: 'horizontal',
  },
  {
    key: '468x60',
    label: '468x60 — Banner',
    desc: 'Klasik yatay ara bant reklamı',
    width: 468,
    height: 60,
    category: 'horizontal',
  },
  {
    key: '320x50',
    label: '320x50 — Mobile Leaderboard',
    desc: 'Akıllı telefonlar için kompakt yatay tepe/alt çubuk',
    width: 320,
    height: 50,
    category: 'horizontal',
    isCommon: true,
  },
  {
    key: '320x100',
    label: '320x100 — Large Mobile Banner',
    desc: 'Mobil ekranlar için 2 katı yükseklikte zengin içerikli yatay bant',
    width: 320,
    height: 100,
    category: 'horizontal',
    isCommon: true,
  },

  // 2. Dikey & Kare Reklamlar (Vertical & Rectangles)
  {
    key: '120x600',
    label: '120x600 — Skyscraper',
    desc: 'Geleneksel ince dikey gökdelen (Sol/Sağ yan sütunlar)',
    width: 120,
    height: 600,
    category: 'vertical_rect',
    isCommon: true,
  },
  {
    key: '160x600',
    label: '160x600 — Wide Skyscraper',
    desc: 'Geniş dikey gökdelen (Geniş yan sütun yerleşimleri)',
    width: 160,
    height: 600,
    category: 'vertical_rect',
    isCommon: true,
  },
  {
    key: '300x600',
    label: '300x600 — Half Page',
    desc: 'Büyük yarım sayfa dikey reklam (Yüksek TBM/Etkileşim)',
    width: 300,
    height: 600,
    category: 'vertical_rect',
  },
  {
    key: '120x240',
    label: '120x240 — Vertical Banner',
    desc: 'Kısa dikey yan sütun veya köşe kutusu',
    width: 120,
    height: 240,
    category: 'vertical_rect',
  },
  {
    key: '300x250',
    label: '300x250 — Medium Rectangle',
    desc: 'Orta boy dikdörtgen (Hem masaüstü hem mobilde en popüler format)',
    width: 300,
    height: 250,
    category: 'vertical_rect',
    isCommon: true,
  },
  {
    key: '336x280',
    label: '336x280 — Large Rectangle',
    desc: 'Geniş dikdörtgen (Makale içi ve sonu)',
    width: 336,
    height: 280,
    category: 'vertical_rect',
  },
  {
    key: '250x250',
    label: '250x250 — Square',
    desc: 'Kare reklam kutusu',
    width: 250,
    height: 250,
    category: 'vertical_rect',
  },
  {
    key: '200x200',
    label: '200x200 — Small Square',
    desc: 'Küçük kare alan reklamı',
    width: 200,
    height: 200,
    category: 'vertical_rect',
  },

  // 3. Dinamik ve Özel
  {
    key: 'RESPONSIVE',
    label: 'RESPONSIVE — Otomatik / Esnek',
    desc: 'Ekran ve kutu boyutuna göre otomatik uyarlanan akıllı AdSense birimi',
    width: 0,
    height: 0,
    category: 'special',
    isCommon: true,
  },
  {
    key: 'CUSTOM',
    label: 'CUSTOM — Özel Boyut',
    desc: 'Kullanıcının belirleyeceği serbest piksel genişlik ve yükseklik',
    width: 0,
    height: 0,
    category: 'special',
    isCommon: true,
  },
];

export const DEFAULT_ENABLED_PRESETS: string[] = [
  'RESPONSIVE',
  '728x90',
  '970x90',
  '120x600',
  '160x600',
  '300x250',
  '320x50',
  'CUSTOM',
];

const STORAGE_KEY = 'msklabs_ads_enabled_presets';

export function getEnabledPresets(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ENABLED_PRESETS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Her zaman CUSTOM ve RESPONSIVE mevcut olsun
      const set = new Set(parsed);
      set.add('CUSTOM');
      set.add('RESPONSIVE');
      return Array.from(set);
    }
  } catch (err) {
    console.error('getEnabledPresets parse error:', err);
  }
  return DEFAULT_ENABLED_PRESETS;
}

export function saveEnabledPresets(keys: string[]): void {
  try {
    const set = new Set(keys);
    set.add('CUSTOM');
    set.add('RESPONSIVE');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.error('saveEnabledPresets write error:', err);
  }
}

/**
 * Dinamik Reklam Boyut Çözümleyici
 * Sabit sözlüklere bağımlı kalmadan her türlü WxH veya Özel boyutu matematiksel olarak çözer.
 */
export function resolveAdDimensions(
  presetSize?: string,
  customWidth?: number | null,
  customHeight?: number | null,
  isMobile: boolean = false
): ResolvedDimensions {
  const preset = (presetSize || 'RESPONSIVE').trim();

  // 1. Özel Boyut (CUSTOM) seçilmişse doğrudan kullanıcının girdiği pikselleri uygula
  if (preset === 'CUSTOM') {
    const w = Number(customWidth) || (isMobile ? 320 : 300);
    const h = Number(customHeight) || (isMobile ? 50 : 250);
    return { w, h, isResponsive: false };
  }

  // 2. Responsive / Otomatik
  if (preset === 'RESPONSIVE') {
    return {
      w: isMobile ? 320 : 728,
      h: isMobile ? 50 : 90,
      isResponsive: true,
    };
  }

  // 3. Herhangi bir [Genişlik]x[Yükseklik] formatındaki dizeyi dinamik ayrıştır (Regex)
  const match = preset.match(/^(\d+)x(\d+)$/);
  if (match) {
    const w = parseInt(match[1], 10);
    const h = parseInt(match[2], 10);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      return { w, h, isResponsive: false };
    }
  }

  // 4. Beklenmeyen bir dize gelirse güvenli fallback
  return {
    w: isMobile ? 320 : 300,
    h: isMobile ? 50 : 250,
    isResponsive: false,
  };
}
