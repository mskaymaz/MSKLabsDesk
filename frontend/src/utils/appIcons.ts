/**
 * MSKLabsDesk — Merkezi Uygulama İkon Çözümleyici (appIcons.ts)
 * 
 * Yerel, CMS veritabanındaki bağıl media yolları ve emojileri
 * hem görsel URL'si hem de doğrudan render edilebilir formatta çözer.
 */

export interface ResolvedAppIcon {
  type: 'emoji' | 'image';
  value: string;
}

const DEFAULT_APP_ICONS: Record<string, { type: 'emoji' | 'image'; value: string }> = {
  haydinamaza: { type: 'image', value: 'media/haydinamaza/icon.png' },
  rekatsay: { type: 'image', value: 'media/rekatsay/icon.png' },
  date_counter: { type: 'image', value: 'media/date-counter/icon.png' },
  deskpilot: { type: 'image', value: 'media/deskpilot/icon.png' },
  gcpiluyari: { type: 'image', value: 'media/gcpiluyari/icon.svg' },
  gc_pil_uyari: { type: 'image', value: 'media/gcpiluyari/icon.svg' },
  enyakin: { type: 'image', value: 'img/EnYakinLogo.svg' },
  en_yakin: { type: 'image', value: 'img/EnYakinLogo.svg' },
  notes: { type: 'emoji', value: '📝' },
  docuedit: { type: 'emoji', value: '📄' },
  pdflayout: { type: 'emoji', value: '🖨️' },
};

export function isEmoji(str?: string | null): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  if (trimmed.length <= 8 && !trimmed.includes('/') && !trimmed.includes('.')) {
    return true;
  }
  return false;
}

export function resolveAppIcon(iconUrl?: string | null, appId?: string): ResolvedAppIcon {
  const cleanId = (appId || '').toLowerCase().trim();

  // 1. Doğrudan emoji verilmişse
  if (iconUrl && isEmoji(iconUrl)) {
    return { type: 'emoji', value: iconUrl.trim() };
  }

  // 2. Tam URL
  if (iconUrl && (iconUrl.startsWith('http://') || iconUrl.startsWith('https://'))) {
    return { type: 'image', value: iconUrl };
  }

  // 3. Dosya yolu verilmişse
  if (iconUrl && iconUrl.trim() && (iconUrl.includes('/') || iconUrl.includes('.'))) {
    let clean = iconUrl.trim().replace(/^\/+/, '');
    // enyakin için bozuk 'media/enyakin/icon.png' yerine doğrudan 'img/EnYakinLogo.svg' kullan
    if ((cleanId === 'enyakin' || cleanId === 'en_yakin') && clean.includes('icon.png')) {
      clean = 'img/EnYakinLogo.svg';
    }
    return { type: 'image', value: `https://msklabs.org/${clean}` };
  }

  // 4. Varsayılan sözlükten eşleştir
  if (cleanId && DEFAULT_APP_ICONS[cleanId]) {
    const def = DEFAULT_APP_ICONS[cleanId];
    if (def.type === 'emoji') {
      return def;
    }
    return { type: 'image', value: `https://msklabs.org/${def.value.replace(/^\/+/, '')}` };
  }

  // 5. Genel fallback: Emoji
  return { type: 'emoji', value: '📱' };
}

export function getAppIconUrl(iconUrl?: string, appId?: string): string {
  const res = resolveAppIcon(iconUrl, appId);
  return res.type === 'image' ? res.value : '';
}
