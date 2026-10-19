export type SupportedLang = 'tr' | 'en' | 'ar';

export interface LocalizedBadge {
  label: string;
  icon: string;
  full: string;
}

const PLATFORM_MAP: Record<string, Record<SupportedLang, { label: string; icon: string }>> = {
  desktop: {
    tr: { label: 'Masaüstü Sistem (Windows)', icon: '💻' },
    en: { label: 'Desktop App (Windows)', icon: '💻' },
    ar: { label: 'تطبيق سطح المكتب (Windows)', icon: '💻' },
  },
  windows: {
    tr: { label: 'Masaüstü Sistem (Windows)', icon: '💻' },
    en: { label: 'Desktop App (Windows)', icon: '💻' },
    ar: { label: 'تطبيق سطح المكتب (Windows)', icon: '💻' },
  },
  mobile: {
    tr: { label: 'Mobil Çözüm', icon: '📱' },
    en: { label: 'Mobile Solution', icon: '📱' },
    ar: { label: 'حل المحمول', icon: '📱' },
  },
  android: {
    tr: { label: 'Mobil Çözüm (Android)', icon: '📱' },
    en: { label: 'Mobile Solution (Android)', icon: '📱' },
    ar: { label: 'حل المحمول (Android)', icon: '📱' },
  },
  ios: {
    tr: { label: 'iOS Çözümü', icon: '🍏' },
    en: { label: 'iOS Solution', icon: '🍏' },
    ar: { label: 'حل iOS', icon: '🍏' },
  },
  'android / ios': {
    tr: { label: 'Mobil (Android & iOS)', icon: '📱' },
    en: { label: 'Mobile (Android & iOS)', icon: '📱' },
    ar: { label: 'المحمول (Android & iOS)', icon: '📱' },
  },
  'android & ios': {
    tr: { label: 'Mobil (Android & iOS)', icon: '📱' },
    en: { label: 'Mobile (Android & iOS)', icon: '📱' },
    ar: { label: 'المحمول (Android & iOS)', icon: '📱' },
  },
  web: {
    tr: { label: 'Web Uygulaması', icon: '🌐' },
    en: { label: 'Web Application', icon: '🌐' },
    ar: { label: 'تطبيق الويب', icon: '🌐' },
  },
  pwa: {
    tr: { label: 'Web Uygulaması (PWA)', icon: '🌐' },
    en: { label: 'Web Application (PWA)', icon: '🌐' },
    ar: { label: 'تطبيق الويب (PWA)', icon: '🌐' },
  },
  all: {
    tr: { label: 'Çoklu Platform', icon: '📱' },
    en: { label: 'Multi-Platform', icon: '📱' },
    ar: { label: 'منصات متعددة', icon: '📱' },
  },
};

const CATEGORY_MAP: Record<string, Record<SupportedLang, { label: string; icon: string }>> = {
  utility: {
    tr: { label: 'Araçlar & Yardımcılar', icon: '🛠️' },
    en: { label: 'Utilities & Tools', icon: '🛠️' },
    ar: { label: 'أدوات ومساعدات', icon: '🛠️' },
  },
  araçlar: {
    tr: { label: 'Araçlar & Yardımcılar', icon: '🛠️' },
    en: { label: 'Utilities & Tools', icon: '🛠️' },
    ar: { label: 'أدوات ومساعدات', icon: '🛠️' },
  },
  islamic: {
    tr: { label: 'İslami / Dinî', icon: '🕋' },
    en: { label: 'Islamic / Religious', icon: '🕋' },
    ar: { label: 'إسلامي وديني', icon: '🕋' },
  },
  ibadet: {
    tr: { label: 'İbadet Asistanı', icon: '🕋' },
    en: { label: 'Worship Assistant', icon: '🕋' },
    ar: { label: 'مساعد العبادة', icon: '🕋' },
  },
  productivity: {
    tr: { label: 'Üretkenlik & Takip', icon: '⚡' },
    en: { label: 'Productivity & Tracking', icon: '⚡' },
    ar: { label: 'إنتاجية ومتابعة', icon: '⚡' },
  },
  education: {
    tr: { label: 'Eğitim & İlim', icon: '📚' },
    en: { label: 'Education & Knowledge', icon: '📚' },
    ar: { label: 'تعليم ومعرفة', icon: '📚' },
  },
  lifestyle: {
    tr: { label: 'Yaşam & Sağlık', icon: '🌱' },
    en: { label: 'Lifestyle & Health', icon: '🌱' },
    ar: { label: 'نمط حياة وصحة', icon: '🌱' },
  },
  multimedia: {
    tr: { label: 'Multimedya & Ses', icon: '🎵' },
    en: { label: 'Multimedia & Audio', icon: '🎵' },
    ar: { label: 'وسائط متعددة وصوت', icon: '🎵' },
  },
  ai: {
    tr: { label: 'Yapay Zekâ', icon: '🤖' },
    en: { label: 'Artificial Intelligence', icon: '🤖' },
    ar: { label: 'ذكاء اصطناعي', icon: '🤖' },
  },
  system: {
    tr: { label: 'Sistem & Güvenlik', icon: '🛡️' },
    en: { label: 'System & Security', icon: '🛡️' },
    ar: { label: 'نظام وأمان', icon: '🛡️' },
  },
  mobil: {
    tr: { label: 'Mobil Uygulama', icon: '📱' },
    en: { label: 'Mobile Application', icon: '📱' },
    ar: { label: 'تطبيق جوال', icon: '📱' },
  },
  masaüstü: {
    tr: { label: 'Masaüstü Uygulama', icon: '💻' },
    en: { label: 'Desktop Application', icon: '💻' },
    ar: { label: 'تطبيق سطح المكتب', icon: '💻' },
  },
};

const STATUS_MAP: Record<string, Record<SupportedLang, { label: string; icon: string }>> = {
  active: {
    tr: { label: 'Yayında', icon: '🚀' },
    en: { label: 'Published', icon: '🚀' },
    ar: { label: 'مباشر', icon: '🚀' },
  },
  in_development: {
    tr: { label: 'Geliştirme Devam Ediyor', icon: '🛠️' },
    en: { label: 'Development In Progress', icon: '🛠️' },
    ar: { label: 'التطوير قيد التقدم', icon: '🛠️' },
  },
  planned: {
    tr: { label: 'Planlanıyor', icon: '📋' },
    en: { label: 'Planned', icon: '📋' },
    ar: { label: 'مخطط له', icon: '📋' },
  },
};

export function getLocalizedPlatform(
  platform?: string | null,
  lang: SupportedLang = 'tr'
): LocalizedBadge {
  const raw = (platform || 'android').trim().toLowerCase();
  const found = PLATFORM_MAP[raw];
  if (found && found[lang]) {
    const item = found[lang];
    return { label: item.label, icon: item.icon, full: `${item.icon} ${item.label}` };
  }
  const fallbackIcon = raw.includes('desk') || raw.includes('win') ? '💻' : (raw.includes('web') ? '🌐' : '📱');
  const fallbackLabel = platform || 'Mobil';
  return { label: fallbackLabel, icon: fallbackIcon, full: `${fallbackIcon} ${fallbackLabel}` };
}

export function getLocalizedCategory(
  category?: string | null,
  lang: SupportedLang = 'tr'
): LocalizedBadge {
  if (!category) {
    const def = CATEGORY_MAP.utility[lang];
    return { label: def.label, icon: def.icon, full: `${def.icon} ${def.label}` };
  }

  const parts = category.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length > 1) {
    const localizedParts = parts.map((part) => {
      const match = CATEGORY_MAP[part.toLowerCase()];
      return match ? match[lang].label : part;
    });
    const firstMatch = CATEGORY_MAP[parts[0].toLowerCase()];
    const icon = firstMatch ? firstMatch[lang].icon : '🏷️';
    const label = localizedParts.join(' • ');
    return { label, icon, full: `${icon} ${label}` };
  }

  const key = parts[0]?.toLowerCase() || 'utility';
  const match = CATEGORY_MAP[key];
  if (match && match[lang]) {
    const item = match[lang];
    return { label: item.label, icon: item.icon, full: `${item.icon} ${item.label}` };
  }

  return { label: category, icon: '🏷️', full: `🏷️ ${category}` };
}

export function getLocalizedStatus(
  status?: string | null,
  lang: SupportedLang = 'tr'
): LocalizedBadge {
  const raw = (status || 'active').trim().toLowerCase();
  const match = STATUS_MAP[raw];
  if (match && match[lang]) {
    const item = match[lang];
    return { label: item.label, icon: item.icon, full: `${item.icon} ${item.label}` };
  }
  return { label: status || 'Yayında', icon: '🚀', full: `🚀 ${status || 'Yayında'}` };
}
