/**
 * MSKLabsDesk — Merkezi Uygulama İkon Çözümleyici (appIcons.ts)
 * 
 * Yerel veya CMS veritabanındaki bağıl media yollarını (örn: "media/haydinamaza/icon.png")
 * doğrudan erişilebilir görsel URL'sine dönüştürür.
 */
export function getAppIconUrl(iconUrl?: string, appId?: string): string {
  if (!iconUrl && !appId) return '';
  if (iconUrl && (iconUrl.startsWith('http://') || iconUrl.startsWith('https://'))) {
    return iconUrl;
  }
  const path = iconUrl || (appId ? `media/${appId.replace('_', '-')}/icon.png` : '');
  const clean = path.replace(/^\/+/, '');
  return `https://msklabs.org/${clean}`;
}
