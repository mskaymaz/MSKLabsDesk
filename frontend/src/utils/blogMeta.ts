/**
 * MSKLabsDesk — Blog Türü ve Konu Başlığı Çözümleyici Yardımcıları
 */

export const BLOG_POST_TITLES: Record<string, string> = {
  '1': 'BİZCE Nedir?',
  'bizce-1': 'BİZCE Nedir?',
  '2': 'ANILTILAR Nedir?',
  'anilts-2': 'ANILTILAR Nedir?',
  'aniltilar-2': 'ANILTILAR Nedir?',
  '3': 'GÜNCEL Nedir?',
  'guncel-3': 'GÜNCEL Nedir?',
  '4': 'Neden Ücretsiz?',
  'bizce-4': 'Neden Ücretsiz?',
  '5': 'Filistin - Konyaspor Maçı',
  'guncel-5': 'Filistin - Konyaspor Maçı',
};

export const getBlogTypeLabel = (type?: string): string => {
  const norm = (type || '').toLowerCase();
  if (norm === 'guncel' || norm === 'güncel') return 'GÜNCEL';
  if (norm.includes('anilt') || norm.includes('anlat')) return 'ANILTILAR';
  return 'BİZCE';
};

export const formatBlogSlug = (slug?: string, fallbackId?: string): string => {
  const raw = (slug || fallbackId || '').trim();
  if (!raw) return 'Genel Yazı';

  const lower = raw.toLowerCase();
  if (BLOG_POST_TITLES[lower]) return BLOG_POST_TITLES[lower];

  const match = lower.match(/\d+/);
  if (match && BLOG_POST_TITLES[match[0]]) {
    return BLOG_POST_TITLES[match[0]];
  }

  return raw
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
};
