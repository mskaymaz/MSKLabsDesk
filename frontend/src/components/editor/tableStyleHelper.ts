/**
 * MSKLabsDesk — Tablo Hücre Stili Yardımcı Fonksiyonları (tableStyleHelper.ts)
 * Hücre inline CSS stillerini parse eder, birleştirir ve günceller.
 */

export interface ParsedCellStyle {
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  border?: string;
  backgroundColor?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  padding?: string;
  width?: string;
  height?: string;
  minHeight?: string;
  [key: string]: string | undefined;
}

/**
 * CSS style dizesini anahtar-değer haritasına ayrıştırır.
 */
export function parseCellStyle(styleStr: string | null | undefined): Record<string, string> {
  const map: Record<string, string> = {};
  if (!styleStr || typeof styleStr !== 'string') return map;

  const declarations = styleStr.split(';');
  for (const decl of declarations) {
    const trimmed = decl.trim();
    if (!trimmed) continue;
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx > 0) {
      const key = trimmed.slice(0, colonIdx).trim().toLowerCase();
      let val = trimmed.slice(colonIdx + 1).trim();
      // !important temizle
      val = val.replace(/\s*!important/gi, '').trim();
      if (key && val) {
        map[key] = val;
      }
    }
  }
  return map;
}

/**
 * Mevcut hücre stiline yeni kuralları ekler veya siler (null ise siler).
 */
export function mergeCellStyle(
  existingStyle: string | null | undefined,
  updates: Record<string, string | null | undefined>
): string {
  const current = parseCellStyle(existingStyle);

  for (const [key, val] of Object.entries(updates)) {
    const lowerKey = key.toLowerCase();
    if (val === null || val === undefined || val === '') {
      delete current[lowerKey];
    } else {
      current[lowerKey] = val;
    }
  }

  return Object.entries(current)
    .map(([k, v]) => `${k}: ${v} !important;`)
    .join(' ');
}

/**
 * Padding dizesinden 4 yönlü değerleri (top, right, bottom, left) çıkarır.
 */
export function parse4WayPadding(paddingStr: string | undefined): {
  top: string;
  right: string;
  bottom: string;
  left: string;
} {
  if (!paddingStr) {
    return { top: '8', right: '12', bottom: '8', left: '12' };
  }

  const parts = paddingStr
    .split(/\s+/)
    .map((p) => p.replace('px', '').trim())
    .filter(Boolean);

  if (parts.length === 1) {
    return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  }
  if (parts.length === 2) {
    return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
  }
  if (parts.length === 3) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
  }
  if (parts.length >= 4) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
  }

  return { top: '8', right: '12', bottom: '8', left: '12' };
}
