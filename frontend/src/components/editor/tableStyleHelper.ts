import { TableMap, selectionCell, isInTable } from '@tiptap/pm/tables';

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

/**
 * İmlecin bulunduğu tablonun ProseMirror node'unu ve pozisyonunu bulur.
 */
export function getTableNodeAndPos(editor: any): { node: any; pos: number } | null {
  if (!editor?.view?.state) return null;
  const { state } = editor.view;
  const { selection } = state;
  for (let d = selection.$from.depth; d > 0; d--) {
    const n = selection.$from.node(d);
    if (n.type.name === 'table') {
      return { node: n, pos: selection.$from.before(d) };
    }
  }
  return null;
}

/**
 * Aktif tablonun inline style dizesini okur.
 */
export function getTableStyle(editor: any): string {
  const match = getTableNodeAndPos(editor);
  return match?.node?.attrs?.style || '';
}

/**
 * Tablo seviyesinde genişlik ve hizalama (margin) stillerini günceller.
 */
export function updateTableStyle(editor: any, updates: Record<string, string | null>): void {
  const match = getTableNodeAndPos(editor);
  if (!match) return;
  const { state, dispatch } = editor.view;
  const current = match.node.attrs.style || '';
  const merged = mergeCellStyle(current, {
    display: 'table',
    ...updates,
  });
  const tr = state.tr.setNodeMarkup(match.pos, undefined, {
    ...match.node.attrs,
    style: merged,
  });
  dispatch(tr);
}

/**
 * Aktif hücrenin ait olduğu sütunun genişliğini okur.
 */
export function getActiveColumnWidth(editor: any): string {
  if (!editor?.view?.state || !isInTable(editor.view.state)) return '';
  try {
    const $cell = selectionCell(editor.view.state);
    if (!$cell) return '';
    const table = $cell.node(-1);
    const map = TableMap.get(table);
    const start = $cell.start(-1);
    const col = map.colCount($cell.pos - start) + ($cell.nodeAfter?.attrs.colspan || 1) - 1;

    for (let row = 0; row < map.height; row++) {
      const pos = map.map[row * map.width + col];
      const cellNode = table.nodeAt(pos);
      if (cellNode?.attrs.colwidth) {
        const index = cellNode.attrs.colspan === 1 ? 0 : col - map.colCount(pos);
        const w = cellNode.attrs.colwidth[index];
        if (w) return `${w}px`;
      }
      const st = parseCellStyle(cellNode?.attrs.style);
      if (st['width']) return st['width'];
    }
  } catch {
    // hücresel ayrıştırma hatasında sessizce geç
  }
  return '';
}

/**
 * Aktif hücrenin satır yüksekliğini okur.
 */
export function getActiveRowHeight(editor: any): string {
  if (!editor?.view?.state || !isInTable(editor.view.state)) return '';
  try {
    const $cell = selectionCell(editor.view.state);
    if (!$cell) return '';
    const st = parseCellStyle($cell.nodeAfter?.attrs.style);
    return st['height'] || st['min-height'] || '';
  } catch {
    return '';
  }
}

/**
 * Aktif sütundaki tüm hücrelerin colwidth ve style.width değerlerini günceller.
 */
export function setColumnWidth(editor: any, widthPx: number | null): void {
  if (!editor?.view?.state || !isInTable(editor.view.state)) return;
  try {
    const { state, dispatch } = editor.view;
    const $cell = selectionCell(state);
    if (!$cell) return;
    const table = $cell.node(-1);
    const map = TableMap.get(table);
    const start = $cell.start(-1);
    const col = map.colCount($cell.pos - start) + ($cell.nodeAfter?.attrs.colspan || 1) - 1;
    const tr = state.tr;

    for (let row = 0; row < map.height; row++) {
      const mapIndex = row * map.width + col;
      if (row && map.map[mapIndex] === map.map[mapIndex - map.width]) continue;
      const pos = map.map[mapIndex];
      const cellNode = table.nodeAt(pos);
      if (!cellNode) continue;
      const attrs = cellNode.attrs;
      const index = attrs.colspan === 1 ? 0 : col - map.colCount(pos);

      let colwidth: number[] | null = null;
      if (widthPx && widthPx > 0) {
        const arr = attrs.colwidth ? attrs.colwidth.slice() : new Array(attrs.colspan).fill(0);
        arr[index] = widthPx;
        colwidth = arr;
      } else {
        colwidth = null;
      }

      const currentStyle = attrs.style || '';
      const mergedStyle = mergeCellStyle(currentStyle, {
        width: widthPx && widthPx > 0 ? `${widthPx}px` : null,
      });

      tr.setNodeMarkup(start + pos, null, {
        ...attrs,
        colwidth,
        style: mergedStyle,
      });
    }

    if (tr.docChanged) {
      dispatch(tr);
    }
  } catch (err) {
    console.error('setColumnWidth error:', err);
  }
}

/**
 * Aktif satırdaki tüm hücrelerin yükseklik stillerini günceller.
 */
export function setRowHeight(editor: any, heightPx: number | null): void {
  if (!editor?.view?.state || !isInTable(editor.view.state)) return;
  try {
    const { state, dispatch } = editor.view;
    const $cell = selectionCell(state);
    if (!$cell) return;
    const table = $cell.node(-1);
    const map = TableMap.get(table);
    const start = $cell.start(-1);
    const cellOffset = $cell.pos - start;

    let targetRow = -1;
    for (let r = 0; r < map.height; r++) {
      for (let c = 0; c < map.width; c++) {
        if (map.map[r * map.width + c] === cellOffset) {
          targetRow = r;
          break;
        }
      }
      if (targetRow !== -1) break;
    }
    if (targetRow === -1) return;

    const tr = state.tr;
    const heightVal = heightPx && heightPx > 0 ? `${heightPx}px` : null;

    for (let c = 0; c < map.width; c++) {
      const pos = map.map[targetRow * map.width + c];
      const cellNode = table.nodeAt(pos);
      if (!cellNode) continue;
      const currentStyle = cellNode.attrs.style || '';
      const mergedStyle = mergeCellStyle(currentStyle, {
        height: heightVal,
        'min-height': heightVal,
      });
      tr.setNodeMarkup(start + pos, null, {
        ...cellNode.attrs,
        style: mergedStyle,
      });
    }

    if (tr.docChanged) {
      dispatch(tr);
    }
  } catch (err) {
    console.error('setRowHeight error:', err);
  }
}
