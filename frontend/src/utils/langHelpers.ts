export type Lang = 'tr' | 'en' | 'ar';

/**
 * Nesne içindeki çok dilli alanları (title_tr, title_en, title_ar) seçili dile göre çözer.
 * EN veya AR boşsa zarifçe Türkçe (TR) kaynağa geri döner.
 */
export function getLang<T extends Record<string, any>>(
  obj: T | undefined | null,
  field: string,
  lang: Lang = 'tr',
  fallback = ''
): string {
  if (!obj) return fallback;
  const tr = obj[`${field}_tr`] ?? obj[field] ?? '';
  if (lang === 'tr') return tr || fallback;
  const target = obj[`${field}_${lang}`];
  return target || tr || fallback;
}

/**
 * Doğrudan üç dil değişkenini (tr, en, ar) verilen dile göre çözer.
 */
export function resolveLangText(
  tr?: string,
  en?: string,
  ar?: string,
  lang: Lang = 'tr',
  fallback = ''
): string {
  if (lang === 'tr') return tr || fallback;
  if (lang === 'en') return en || tr || fallback;
  if (lang === 'ar') return ar || tr || fallback;
  return fallback;
}
