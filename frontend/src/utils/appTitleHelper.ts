/**
 * MSKLabsDesk — Merkezi Uygulama Başlık & Parantez İçi Alt Açıklama Ayrıştırıcı (appTitleHelper.ts)
 * 
 * "Date Counter (Tarih & Hedef Sayacı)" gibi isimleri:
 * - Ana Başlık: "Date Counter"
 * - Alt Başlık: "Tarih & Hedef Sayacı"
 * olarak ayrıştırır ve %30 küçültülmüş, kalın olmayan alt satır olarak formatlar.
 */

export interface ParsedAppTitle {
  mainTitle: string;
  subtitle: string;
}

export function parseAppTitle(rawName?: string | null): ParsedAppTitle {
  if (!rawName) return { mainTitle: '', subtitle: '' };
  const trimmed = rawName.trim();
  // Standart parantez (...) veya tam genişlik parantez （...） ile eşleşme
  const match = trimmed.match(/^(.+?)\s*[\(（](.+?)[\)）]$/);
  if (match) {
    return {
      mainTitle: match[1].trim(),
      subtitle: match[2].trim(),
    };
  }
  return { mainTitle: trimmed, subtitle: '' };
}

export function buildAppTitle(mainTitle: string, subtitle?: string): string {
  const cleanMain = (mainTitle || '').trim();
  const cleanSub = (subtitle || '').trim();
  if (!cleanSub) return cleanMain;
  return `${cleanMain} (${cleanSub})`;
}
