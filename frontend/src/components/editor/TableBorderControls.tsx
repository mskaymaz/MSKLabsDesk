import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { Grid, Box, EyeOff, Minus, Plus, Palette } from 'lucide-react';
import { parseCellStyle, mergeCellStyle } from './tableStyleHelper';

interface TableBorderControlsProps {
  editor: Editor;
}

const PRESET_BORDER_COLORS = [
  '#6366F1',
  '#06B6D4',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#94A3B8',
  '#FFFFFF',
  '#000000',
];

export const TableBorderControls: React.FC<TableBorderControlsProps> = ({ editor }) => {
  const [activeDirection, setActiveDirection] = useState<'all' | 'box' | 'top' | 'bottom' | 'left' | 'right' | 'none'>('all');
  const [borderStyle, setBorderStyle] = useState<string>('solid');
  const [borderWidth, setBorderWidth] = useState<string>('1');
  const [borderColor, setBorderColor] = useState<string>('#6366F1');
  const [isTransparent, setIsTransparent] = useState<boolean>(false);

  // Hücre seçiminde aktif kenarlık özelliklerini yansıt
  useEffect(() => {
    const syncStyles = () => {
      const attrs = editor.getAttributes('tableCell')?.style || editor.getAttributes('tableHeader')?.style || '';
      const parsed = parseCellStyle(attrs);

      const b = parsed['border'] || parsed['border-bottom'] || parsed['border-top'] || '';
      if (b === 'none' || parsed['border-color'] === 'transparent') {
        setIsTransparent(true);
      } else if (b) {
        setIsTransparent(false);
        const matchWidth = b.match(/([\d.]+)px/);
        if (matchWidth) setBorderWidth(matchWidth[1]);
        if (b.includes('dashed')) setBorderStyle('dashed');
        else if (b.includes('dotted')) setBorderStyle('dotted');
        else if (b.includes('double')) setBorderStyle('double');
        else if (b.includes('solid')) setBorderStyle('solid');

        const matchColor = b.match(/(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/);
        if (matchColor) setBorderColor(matchColor[1]);
      }
    };

    syncStyles();
    editor.on('selectionUpdate', syncStyles);
    return () => {
      editor.off('selectionUpdate', syncStyles);
    };
  }, [editor]);

  // Kenarlık uygulama fonksiyonu (Mevcut padding ve bg rengini koruyarak birleştirir)
  const applyBorder = (
    dir = activeDirection,
    s = borderStyle,
    w = borderWidth,
    c = borderColor,
    trans = isTransparent
  ) => {
    setActiveDirection(dir);
    setBorderStyle(s);
    setBorderWidth(w);
    setBorderColor(c);
    setIsTransparent(trans);

    const formattedWidth = `${parseFloat(w) || 1}px`;
    const finalColor = trans ? 'transparent' : c;
    const borderRule = trans || dir === 'none' ? 'none' : `${formattedWidth} ${s} ${finalColor}`;

    const existingStyle = editor.getAttributes('tableCell')?.style || editor.getAttributes('tableHeader')?.style || '';

    const updates: Record<string, string | null> = {};
    if (dir === 'all' || dir === 'box' || dir === 'none') {
      updates['border'] = borderRule;
      updates['border-top'] = null;
      updates['border-bottom'] = null;
      updates['border-left'] = null;
      updates['border-right'] = null;
    } else if (dir === 'top') {
      updates['border-top'] = borderRule;
    } else if (dir === 'bottom') {
      updates['border-bottom'] = borderRule;
    } else if (dir === 'left') {
      updates['border-left'] = borderRule;
    } else if (dir === 'right') {
      updates['border-right'] = borderRule;
    }

    const merged = mergeCellStyle(existingStyle, updates);
    editor.chain().focus().setCellAttribute('style', merged).run();
  };

  const handleWidthChange = (delta: number) => {
    const cur = parseFloat(borderWidth) || 1;
    const next = Math.max(0.1, +(cur + delta).toFixed(2));
    setBorderWidth(String(next));
    applyBorder(activeDirection, borderStyle, String(next), borderColor, false);
  };

  const miniBtn = (active: boolean): React.CSSProperties => ({
    padding: '3px 6px',
    fontSize: '10px',
    fontWeight: active ? 700 : 500,
    border: '1px solid var(--border-card)',
    borderRadius: '3px',
    background: active ? 'var(--accent-primary)' : 'var(--bg-secondary)',
    color: active ? '#FFFFFF' : 'var(--text-secondary)',
    cursor: 'pointer',
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* 1. Word Kenarlık Yönleri */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
          WORD KENARLIK YÖNLERİ
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px', marginBottom: '3px' }}>
          {[
            { id: 'all', label: 'Tümü', icon: Grid },
            { id: 'box', label: 'Dış', icon: Box },
            { id: 'none', label: 'Gizli', icon: EyeOff },
            { id: 'bottom', label: 'Alt' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                style={miniBtn(activeDirection === item.id)}
                onClick={() => applyBorder(item.id as any, borderStyle, borderWidth, borderColor, item.id === 'none')}
                title={item.label}
              >
                {Icon && <Icon size={11} style={{ marginRight: '2px' }} />} {item.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
          {[
            { id: 'top', label: 'Üst' },
            { id: 'left', label: 'Sol' },
            { id: 'right', label: 'Sağ' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              style={miniBtn(activeDirection === item.id)}
              onClick={() => applyBorder(item.id as any, borderStyle, borderWidth, borderColor, false)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Çizgi Stili & Küsürlü Kalınlık Stepper */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
          ÇİZGİ STİLİ & KÜSÜRLÜ KALINLIK (PX)
        </span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {/* Stil Seçici */}
          <div style={{ display: 'flex', gap: '2px', flex: 1 }}>
            {[
              { id: 'solid', label: 'Düz' },
              { id: 'dashed', label: 'Kesikli' },
              { id: 'dotted', label: 'Noktalı' },
              { id: 'double', label: 'Çift' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                style={miniBtn(borderStyle === s.id)}
                onClick={() => applyBorder(activeDirection, s.id, borderWidth, borderColor, false)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Küsürlü Kalınlık Stepper */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', borderRadius: '4px', padding: '1px' }}>
            <button
              type="button"
              onClick={() => handleWidthChange(-0.5)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px 4px' }}
              title="Kalınlığı Azalt (-0.5px)"
            >
              <Minus size={11} />
            </button>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="20"
              value={borderWidth}
              onChange={(e) => {
                const val = e.target.value;
                setBorderWidth(val);
                if (val && !isNaN(Number(val))) {
                  applyBorder(activeDirection, borderStyle, val, borderColor, false);
                }
              }}
              style={{
                width: '38px',
                textAlign: 'center',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontWeight: 600,
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', paddingRight: '2px' }}>px</span>
            <button
              type="button"
              onClick={() => handleWidthChange(0.5)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px 4px' }}
              title="Kalınlığı Artır (+0.5px)"
            >
              <Plus size={11} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Kenarlık Rengi, HTML5 Paleti & Şeffaf Seçeneği */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>
            KENARLIK RENGİ & ŞEFFAFLIK
          </span>
          <button
            type="button"
            onClick={() => applyBorder(activeDirection, borderStyle, borderWidth, 'transparent', true)}
            style={{
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '3px',
              border: isTransparent ? '1px solid var(--accent-cyan)' : '1px solid var(--border-card)',
              background: isTransparent ? 'rgba(6, 182, 212, 0.2)' : 'var(--bg-secondary)',
              color: isTransparent ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {isTransparent ? '✓ Renksiz / Şeffaf' : 'Renksiz / Şeffaf Yap'}
          </button>
        </div>

        {/* Renk Girişi ve Palet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
          {PRESET_BORDER_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => applyBorder(activeDirection, borderStyle, borderWidth, c, false)}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '3px',
                border: !isTransparent && borderColor.toLowerCase() === c.toLowerCase() ? '2px solid #FFFFFF' : '1px solid var(--border-card)',
                background: c,
                cursor: 'pointer',
              }}
            />
          ))}

          {/* HTML5 Renk Seçici */}
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '1px' }} title="HTML Renk Paletini Aç">
            <Palette size={14} style={{ color: isTransparent ? 'var(--text-muted)' : borderColor }} />
            <input
              type="color"
              value={borderColor.startsWith('#') && borderColor.length === 7 ? borderColor : '#6366F1'}
              onChange={(e) => applyBorder(activeDirection, borderStyle, borderWidth, e.target.value, false)}
              style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
            />
          </label>

          {/* Doğrudan Hex/Metin Girişi */}
          <input
            type="text"
            value={isTransparent ? 'transparent' : borderColor}
            onChange={(e) => {
              const val = e.target.value.trim();
              if (val.toLowerCase() === 'transparent') {
                applyBorder(activeDirection, borderStyle, borderWidth, 'transparent', true);
              } else {
                setBorderColor(val);
                if (val.length >= 3) {
                  applyBorder(activeDirection, borderStyle, borderWidth, val, false);
                }
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
