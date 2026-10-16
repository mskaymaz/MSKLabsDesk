import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { Maximize, Palette, Link as LinkIcon, Unlink, Check } from 'lucide-react';
import { parseCellStyle, mergeCellStyle, parse4WayPadding } from './tableStyleHelper';
import { TableLayoutControls } from './TableLayoutControls';

interface TableCellDimensionControlsProps {
  editor: Editor;
}

const PRESET_CELL_BG = [
  'transparent',
  'rgba(99, 102, 241, 0.18)',
  'rgba(6, 182, 212, 0.18)',
  'rgba(16, 185, 129, 0.18)',
  'rgba(245, 158, 11, 0.18)',
  'rgba(239, 68, 68, 0.18)',
  'rgba(255, 255, 255, 0.12)',
  'rgba(0, 0, 0, 0.35)',
];

export const TableCellDimensionControls: React.FC<TableCellDimensionControlsProps> = ({ editor }) => {
  // 4 Yönlü Dolgu (Padding)
  const [padTop, setPadTop] = useState<string>('8');
  const [padRight, setPadRight] = useState<string>('12');
  const [padBottom, setPadBottom] = useState<string>('8');
  const [padLeft, setPadLeft] = useState<string>('12');
  const [isLinked, setIsLinked] = useState<boolean>(false);

  // Hücre Boyutları (Width & Height)
  const [cellWidth, setCellWidth] = useState<string>('');
  const [cellHeight, setCellHeight] = useState<string>('');

  // Hücre Zemin Rengi
  const [cellBg, setCellBg] = useState<string>('transparent');

  // Hücre seçiminde aktif değerleri oku
  useEffect(() => {
    const syncStyles = () => {
      const attrs = editor.getAttributes('tableCell')?.style || editor.getAttributes('tableHeader')?.style || '';
      const parsedCell = parseCellStyle(attrs);

      // Padding yansıtma
      const p = parsedCell['padding'];
      if (p) {
        const { top, right, bottom, left } = parse4WayPadding(p);
        setPadTop(top);
        setPadRight(right);
        setPadBottom(bottom);
        setPadLeft(left);
      } else {
        if (parsedCell['padding-top']) setPadTop(parsedCell['padding-top'].replace('px', ''));
        if (parsedCell['padding-right']) setPadRight(parsedCell['padding-right'].replace('px', ''));
        if (parsedCell['padding-bottom']) setPadBottom(parsedCell['padding-bottom'].replace('px', ''));
        if (parsedCell['padding-left']) setPadLeft(parsedCell['padding-left'].replace('px', ''));
      }

      // Hücre Boyutları
      setCellWidth(parsedCell['width'] || '');
      setCellHeight(parsedCell['height'] || parsedCell['min-height'] || '');

      // Zemin Rengi
      setCellBg(parsedCell['background-color'] || 'transparent');
    };

    syncStyles();
    editor.on('selectionUpdate', syncStyles);
    return () => {
      editor.off('selectionUpdate', syncStyles);
    };
  }, [editor]);

  // Dolgu uygulama (Odağı çalmadan uygular)
  const applyPadding = (top = padTop, right = padRight, bottom = padBottom, left = padLeft) => {
    const padStr = `${parseFloat(top) || 0}px ${parseFloat(right) || 0}px ${parseFloat(bottom) || 0}px ${parseFloat(left) || 0}px`;
    const existing = editor.getAttributes('tableCell')?.style || editor.getAttributes('tableHeader')?.style || '';
    const merged = mergeCellStyle(existing, { padding: padStr });
    editor.commands.setCellAttribute('style', merged);
  };

  const handlePadChange = (direction: 'top' | 'right' | 'bottom' | 'left', val: string) => {
    if (isLinked) {
      setPadTop(val);
      setPadRight(val);
      setPadBottom(val);
      setPadLeft(val);
    } else {
      if (direction === 'top') setPadTop(val);
      if (direction === 'right') setPadRight(val);
      if (direction === 'bottom') setPadBottom(val);
      if (direction === 'left') setPadLeft(val);
    }
  };

  // Hücre Genişliği ve Yüksekliği Uygulama (Odağı çalmadan uygular)
  const applyDimension = (widthVal = cellWidth, heightVal = cellHeight) => {
    const existing = editor.getAttributes('tableCell')?.style || editor.getAttributes('tableHeader')?.style || '';
    const updates: Record<string, string | null> = {};

    if (!widthVal || widthVal.trim() === 'auto') {
      updates['width'] = null;
    } else {
      const cleanW = widthVal.endsWith('%') || widthVal.endsWith('px') ? widthVal : `${widthVal}px`;
      updates['width'] = cleanW;
    }

    if (!heightVal || heightVal.trim() === 'auto') {
      updates['height'] = null;
      updates['min-height'] = null;
    } else {
      const cleanH = heightVal.endsWith('px') ? heightVal : `${heightVal}px`;
      updates['height'] = cleanH;
      updates['min-height'] = cleanH;
    }

    const merged = mergeCellStyle(existing, updates);
    editor.commands.setCellAttribute('style', merged);
  };

  // Zemin Rengi Uygulama
  const applyBg = (color: string) => {
    setCellBg(color);
    const existing = editor.getAttributes('tableCell')?.style || editor.getAttributes('tableHeader')?.style || '';
    const merged = mergeCellStyle(existing, {
      'background-color': color === 'transparent' ? 'transparent' : color,
    });
    editor.commands.setCellAttribute('style', merged);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
      {/* 1. Tablo Genişliği ve Hizalama (Modüler Bileşen) */}
      <TableLayoutControls editor={editor} />

      {/* 2. Hücre Boyutları (Genişlik & Yükseklik) */}
      <div style={{ paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Hücre Genişliği ve Yüksekliği
          </span>
          <button
            type="button"
            onClick={() => applyDimension(cellWidth, cellHeight)}
            className="admin-btn admin-btn-primary admin-btn-xs"
            title="Hücre boyutunu uygula"
          >
            <Check size={11} /> Uygula
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {/* Genişlik */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Genişlik</span>
              <button
                type="button"
                onClick={() => {
                  setCellWidth('');
                  applyDimension('', cellHeight);
                }}
                style={{ fontSize: '9px', background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: 0 }}
                title="Genişliği Otomatik Yap"
              >
                Oto
              </button>
            </div>
            <input
              type="text"
              placeholder="Örn: 250px veya 33%"
              value={cellWidth}
              onChange={(e) => setCellWidth(e.target.value)}
              onBlur={() => applyDimension(cellWidth, cellHeight)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyDimension(cellWidth, cellHeight);
              }}
              style={{
                width: '100%',
                fontSize: '11px',
                padding: '3px 6px',
                borderRadius: '3px',
                border: '1px solid var(--border-card)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
              }}
            />
          </div>

          {/* Yükseklik */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Yükseklik</span>
              <button
                type="button"
                onClick={() => {
                  setCellHeight('');
                  applyDimension(cellWidth, '');
                }}
                style={{ fontSize: '9px', background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: 0 }}
                title="Yüksekliği Otomatik Yap"
              >
                Oto
              </button>
            </div>
            <input
              type="text"
              placeholder="Örn: 40px"
              value={cellHeight}
              onChange={(e) => setCellHeight(e.target.value)}
              onBlur={() => applyDimension(cellWidth, cellHeight)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') applyDimension(cellWidth, cellHeight);
              }}
              style={{
                width: '100%',
                fontSize: '11px',
                padding: '3px 6px',
                borderRadius: '3px',
                border: '1px solid var(--border-card)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. 4 Yönlü Küsürlü Dolgu (Padding) */}
      <div style={{ paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Maximize size={11} /> 4 Yönlü Dolgu (Padding - px)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setIsLinked(!isLinked)}
              title={isLinked ? 'Tüm yönler bağlı' : 'Yönler bağımsız'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '1px 5px',
                fontSize: '9px',
                background: isLinked ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: isLinked ? '#FFFFFF' : 'var(--text-secondary)',
                border: '1px solid var(--border-card)',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              {isLinked ? <LinkIcon size={9} /> : <Unlink size={9} />}
              {isLinked ? 'Bağlı' : 'Ayrı'}
            </button>
            <button
              type="button"
              onClick={() => applyPadding(padTop, padRight, padBottom, padLeft)}
              className="admin-btn admin-btn-secondary admin-btn-xs"
              title="Dolguyu uygula"
            >
              <Check size={11} />
            </button>
          </div>
        </div>

        {/* 4 Yönlü Sayısal Girişler */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
          {[
            { label: 'Üst', key: 'top' as const, val: padTop },
            { label: 'Sağ', key: 'right' as const, val: padRight },
            { label: 'Alt', key: 'bottom' as const, val: padBottom },
            { label: 'Sol', key: 'left' as const, val: padLeft },
          ].map((d) => (
            <div key={d.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '1px' }}>{d.label}</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="100"
                value={d.val}
                onChange={(e) => handlePadChange(d.key, e.target.value)}
                onBlur={() => applyPadding(padTop, padRight, padBottom, padLeft)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') applyPadding(padTop, padRight, padBottom, padLeft);
                }}
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '11px',
                  padding: '2px 0',
                  borderRadius: '3px',
                  border: '1px solid var(--border-card)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Hücre Zemin Dolgu Rengi (Background Fill) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Palette size={11} /> Hücre Dolgu Rengi ve Şeffaflık
          </span>
          <button
            type="button"
            onClick={() => applyBg('transparent')}
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '3px',
              border: cellBg === 'transparent' ? '1px solid var(--accent-cyan)' : '1px solid var(--border-card)',
              background: cellBg === 'transparent' ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-secondary)',
              color: cellBg === 'transparent' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {cellBg === 'transparent' ? '✓ Şeffaf' : 'Şeffaf Yap'}
          </button>
        </div>

        {/* Renk Kutuları & HTML5 Renk Seçici */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {PRESET_CELL_BG.map((c, i) => (
            <button
              key={i}
              type="button"
              title={c === 'transparent' ? 'Şeffaf' : c}
              onClick={() => applyBg(c)}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '3px',
                border: cellBg === c ? '2px solid #FFFFFF' : '1px solid var(--border-card)',
                background: c === 'transparent' ? 'repeating-linear-gradient(45deg, #555, #555 2px, #222 2px, #222 4px)' : c,
                cursor: 'pointer',
              }}
            />
          ))}

          {/* HTML5 Paleti */}
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '1px' }} title="HTML Renk Paletini Aç">
            <Palette size={14} style={{ color: cellBg === 'transparent' ? 'var(--text-muted)' : cellBg }} />
            <input
              type="color"
              value={cellBg.startsWith('#') && cellBg.length === 7 ? cellBg : '#1F2937'}
              onChange={(e) => applyBg(e.target.value)}
              style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
            />
          </label>

          {/* Hex / Metin Girişi */}
          <input
            type="text"
            value={cellBg}
            onChange={(e) => setCellBg(e.target.value)}
            onBlur={() => applyBg(cellBg)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyBg(cellBg);
            }}
            placeholder="#HEX veya rgba"
            style={{
              flex: 1,
              minWidth: '70px',
              padding: '2px 5px',
              fontSize: '10px',
              borderRadius: '3px',
              border: '1px solid var(--border-card)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontFamily: 'monospace',
            }}
          />
        </div>
      </div>
    </div>
  );
};
