/**
 * MSKLabsDesk — Blog Türü ve Konu Başlığı Çözümleyici Yardımcıları
 */

export const BLOG_POST_TITLES: Record<string, string> = {
  '1': 'Bizce Nedir?',
  'bizce-1': 'Bizce Nedir?',
  '2': 'Anıltılar Nedir?',
  'anilts-2': 'Anıltılar Nedir?',
  'aniltilar-2': 'Anıltılar Nedir?',
  '3': 'Güncel Nedir?',
  'guncel-3': 'Güncel Nedir?',
  '4': 'Neden Ücretsiz?',
  'bizce-4': 'Neden Ücretsiz?',
  '5': 'Filistin - Konyaspor Maçı',
  'guncel-5': 'Filistin - Konyaspor Maçı',
};

export const getBlogTypeLabel = (type?: string): string => {
  const norm = (type || '').toLowerCase();
  if (norm === 'guncel' || norm === 'güncel') return 'Güncel';
  if (norm.includes('anilt') || norm.includes('anlat')) return 'Anıltılar';
  return 'Bizce';
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
