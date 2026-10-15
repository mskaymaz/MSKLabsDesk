import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { Maximize, Palette, Link as LinkIcon, Unlink } from 'lucide-react';
import { parseCellStyle, mergeCellStyle, parse4WayPadding } from './tableStyleHelper';

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

  // Hücre seçiminde aktif değerleri yansıt
  useEffect(() => {
    const syncStyles = () => {
      const attrs = editor.getAttributes('tableCell')?.style || editor.getAttributes('tableHeader')?.style || '';
      const parsed = parseCellStyle(attrs);

      // Padding yansıtma
      const p = parsed['padding'];
      if (p) {
        const { top, right, bottom, left } = parse4WayPadding(p);
        setPadTop(top);
        setPadRight(right);
        setPadBottom(bottom);
        setPadLeft(left);
      } else {
        if (parsed['padding-top']) setPadTop(parsed['padding-top'].replace('px', ''));
        if (parsed['padding-right']) setPadRight(parsed['padding-right'].replace('px', ''));
        if (parsed['padding-bottom']) setPadBottom(parsed['padding-bottom'].replace('px', ''));
        if (parsed['padding-left']) setPadLeft(parsed['padding-left'].replace('px', ''));
      }

      // Boyutlar
      setCellWidth(parsed['width'] || '');
      setCellHeight(parsed['height'] || parsed['min-height'] || '');

      // Zemin Rengi
      setCellBg(parsed['background-color'] || 'transparent');
    };

    syncStyles();
    editor.on('selectionUpdate', syncStyles);
    return () => {
      editor.off('selectionUpdate', syncStyles);
    };
  }, [editor]);

  // Dolgu uygulama
  const applyPadding = (top: string, right: string, bottom: string, left: string) => {
    setPadTop(top);
    setPadRight(right);
    setPadBottom(bottom);
    setPadLeft(left);

    const padStr = `${parseFloat(top) || 0}px ${parseFloat(right) || 0}px ${parseFloat(bottom) || 0}px ${parseFloat(left) || 0}px`;
    const existing = editor.getAttributes('tableCell')?.style || editor.getAttributes('tableHeader')?.style || '';
    const merged = mergeCellStyle(existing, { padding: padStr });
    editor.chain().focus().setCellAttribute('style', merged).run();
  };

  const handlePadChange = (direction: 'top' | 'right' | 'bottom' | 'left', val: string) => {
    if (isLinked) {
      applyPadding(val, val, val, val);
    } else {
      applyPadding(
        direction === 'top' ? val : padTop,
        direction === 'right' ? val : padRight,
        direction === 'bottom' ? val : padBottom,
        direction === 'left' ? val : padLeft
      );
    }
  };

  // Hücre Genişliği ve Yüksekliği Uygulama
  const applyDimension = (widthVal: string, heightVal: string) => {
    setCellWidth(widthVal);
    setCellHeight(heightVal);

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
    editor.chain().focus().setCellAttribute('style', merged).run();
  };

  // Zemin Rengi Uygulama
  const applyBg = (color: string) => {
    setCellBg(color);
    const existing = editor.getAttributes('tableCell')?.style || editor.getAttributes('tableHeader')?.style || '';
    const merged = mergeCellStyle(existing, {
      'background-color': color === 'transparent' ? 'transparent' : color,
    });
    editor.chain().focus().setCellAttribute('style', merged).run();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* 1. 4 Yönlü Küsürlü Dolgu (Padding) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Maximize size={11} /> 4 YÖNLÜ DOLGU (PADDING - PX)
          </span>
          <button
            type="button"
            onClick={() => setIsLinked(!isLinked)}
            title={isLinked ? 'Tüm yönler bağlı (tıklayarak ayırın)' : 'Yönler bağımsız (tıklayarak bağlayın)'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: '1px 5px',
              fontSize: '10px',
              background: isLinked ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: isLinked ? '#FFFFFF' : 'var(--text-secondary)',
              border: '1px solid var(--border-card)',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            {isLinked ? <LinkIcon size={10} /> : <Unlink size={10} />}
            {isLinked ? 'Bağlı' : 'Ayrı'}
          </button>
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

      {/* 2. Hücre Boyutları (Genişlik & Yükseklik) */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
          HÜCRE GENİŞLİĞİ & YÜKSEKLİĞİ
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {/* Genişlik */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Genişlik (Width)</span>
              <button
                type="button"
                onClick={() => applyDimension('', cellHeight)}
                style={{ fontSize: '9px', background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', padding: 0 }}
                title="Genişliği Otomatik Yap"
              >
                Oto
              </button>
            </div>
            <input
              type="text"
              placeholder="Örn: 120px veya 30%"
              value={cellWidth}
              onChange={(e) => {
                const val = e.target.value;
                setCellWidth(val);
                applyDimension(val, cellHeight);
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
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Yükseklik (Height)</span>
              <button
                type="button"
                onClick={() => applyDimension(cellWidth, '')}
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
              onChange={(e) => {
                const val = e.target.value;
                setCellHeight(val);
                applyDimension(cellWidth, val);
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

      {/* 3. Hücre Zemin Dolgu Rengi (Background Fill) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Palette size={11} /> HÜCRE DOLGU RENGİ & ŞEFFAFLIK
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
            onChange={(e) => {
              const val = e.target.value.trim();
              setCellBg(val);
              if (val.length >= 3) {
                applyBg(val);
              }
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
