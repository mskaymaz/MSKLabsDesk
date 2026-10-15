import React, { useState, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import {
  X,
  Move,
  Plus,
  Trash2,
  Columns,
  Rows,
  Split,
  Combine,
  Palette,
  Square,
  Maximize,
} from 'lucide-react';

interface FloatingTableInspectorProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

const CELL_COLORS = [
  'transparent',
  'rgba(99, 102, 241, 0.15)',
  'rgba(6, 182, 212, 0.15)',
  'rgba(16, 185, 129, 0.15)',
  'rgba(245, 158, 11, 0.15)',
  'rgba(239, 68, 68, 0.15)',
  'rgba(255, 255, 255, 0.08)',
  'rgba(0, 0, 0, 0.25)',
];

export const FloatingTableInspector: React.FC<FloatingTableInspectorProps> = ({
  editor,
  isOpen,
  onClose,
}) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 140 });
  const [isDragging, setIsDragging] = useState(false);
  const [borderStyle, setBorderStyle] = useState<string>('solid');
  const [borderWidth, setBorderWidth] = useState<string>('1px');
  const [borderColor, setBorderColor] = useState<string>('var(--border-card)');

  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: position.x,
    posY: position.y,
  });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      const newX = Math.max(10, Math.min(window.innerWidth - 310, dragStartRef.current.posX + dx));
      const newY = Math.max(70, Math.min(window.innerHeight - 440, dragStartRef.current.posY + dy));
      setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  if (!isOpen || !editor) return null;

  const isTableActive = editor.isActive('table');

  const onPointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    setIsDragging(true);
  };

  const handleSetCellBg = (color: string) => {
    editor.chain().focus().setCellAttribute('style', `background-color: ${color}`).run();
  };

  const handleApplyBorder = (s = borderStyle, w = borderWidth, c = borderColor) => {
    setBorderStyle(s);
    setBorderWidth(w);
    setBorderColor(c);
    const borderCss = s === 'none' || w === '0px' ? 'border: none;' : `border: ${w} ${s} ${c};`;
    editor.chain().focus().setCellAttribute('style', borderCss).run();
  };

  const handleSetPadding = (pad: string) => {
    editor.chain().focus().setCellAttribute('style', `padding: ${pad};`).run();
  };

  const btnStyle: React.CSSProperties = {
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: 500,
    border: '1px solid var(--border-card)',
    borderRadius: '4px',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  };

  const miniBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '2px 6px',
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
    <aside
      aria-label="Yüzen Tablo Stüdyosu"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '290px',
        maxHeight: '85vh',
        background: 'var(--bg-card, #1F2937)',
        border: '1px solid var(--border-card-hover, rgba(99, 102, 241, 0.4))',
        borderRadius: '8px',
        boxShadow: '0 10px 28px rgba(0,0,0,0.35)',
        zIndex: 'var(--z-floating, 950)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      {/* Sürüklenebilir Başlık Çubuğu */}
      <div
        onPointerDown={onPointerDown}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 10px',
          background: 'var(--bg-secondary, #111827)',
          borderBottom: '1px solid var(--border-subtle)',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Move size={13} style={{ color: 'var(--accent-cyan)' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Tablo Stüdyosu
          </span>
          <span className="admin-badge admin-badge-cyan" style={{ fontSize: '9px', padding: '1px 4px' }}>
            Canlı
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '2px',
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Gövde / Araçlar (Scrollable) */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
        {!isTableActive ? (
          <div style={{ textAlign: 'center', padding: '12px 6px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              İmleç bir tablo içinde değil.
            </p>
            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              style={{ ...btnStyle, background: 'var(--accent-primary)', color: '#FFFFFF', justifyContent: 'center' }}
            >
              <Plus size={12} /> 3x3 Tablo Ekle
            </button>
          </div>
        ) : (
          <>
            {/* Satır & Sütun İşlemleri */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                SATIR & SÜTUN DÜZENİ
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '4px' }}>
                <button type="button" style={btnStyle} onClick={() => editor.chain().focus().addRowBefore().run()}>
                  <Rows size={11} /> Üste Satır
                </button>
                <button type="button" style={btnStyle} onClick={() => editor.chain().focus().addRowAfter().run()}>
                  <Rows size={11} /> Alta Satır
                </button>
                <button type="button" style={btnStyle} onClick={() => editor.chain().focus().addColumnBefore().run()}>
                  <Columns size={11} /> Sola Sütun
                </button>
                <button type="button" style={btnStyle} onClick={() => editor.chain().focus().addColumnAfter().run()}>
                  <Columns size={11} /> Sağa Sütun
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <button
                  type="button"
                  style={{ ...btnStyle, color: 'var(--accent-rose)' }}
                  onClick={() => editor.chain().focus().deleteRow().run()}
                >
                  <Trash2 size={11} /> Satırı Sil
                </button>
                <button
                  type="button"
                  style={{ ...btnStyle, color: 'var(--accent-rose)' }}
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                >
                  <Trash2 size={11} /> Sütunu Sil
                </button>
              </div>
            </div>

            {/* Hücre Birleştirme / Bölme */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                HÜCRE BİRLEŞTİRME & BÖLME
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <button type="button" style={btnStyle} onClick={() => editor.chain().focus().mergeCells().run()}>
                  <Combine size={11} /> Birleştir
                </button>
                <button type="button" style={btnStyle} onClick={() => editor.chain().focus().splitCell().run()}>
                  <Split size={11} /> Böl
                </button>
              </div>
            </div>

            {/* Kenarlık Çizgileri & Görünürlük */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Square size={11} /> KENARLIK ÇİZGİSİ
              </span>
              {/* Çizgi Tipi */}
              <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                {[
                  { label: 'Çizgili', value: 'solid' },
                  { label: 'Gizli', value: 'none' },
                  { label: 'Kesikli', value: 'dashed' },
                  { label: 'Noktalı', value: 'dotted' },
                ].map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    style={miniBtnStyle(borderStyle === s.value)}
                    onClick={() => handleApplyBorder(s.value, borderWidth, borderColor)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {/* Çizgi Kalınlığı & Renk */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {['1px', '2px', '3px', '4px'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    style={miniBtnStyle(borderWidth === w && borderStyle !== 'none')}
                    onClick={() => handleApplyBorder(borderStyle === 'none' ? 'solid' : borderStyle, w, borderColor)}
                  >
                    {w}
                  </button>
                ))}
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '2px' }} title="Kenarlık Rengi">
                  <Palette size={13} style={{ color: borderColor }} />
                  <input
                    type="color"
                    defaultValue="#6366F1"
                    onChange={(e) => handleApplyBorder(borderStyle, borderWidth, e.target.value)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                </label>
              </div>
            </div>

            {/* Hücre Dolgusu (Padding) */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Maximize size={11} /> HÜCRE DOLGUSU (PADDING)
              </span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[
                  { label: 'Kompakt (4px)', value: '4px 8px' },
                  { label: 'Standart (8px)', value: '8px 12px' },
                  { label: 'Ferah (14px)', value: '14px 18px' },
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    style={miniBtnStyle(false)}
                    onClick={() => handleSetPadding(p.value)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hücre Zemin Rengi */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Palette size={11} /> HÜCRE ZEMİN DOLGUSU
              </span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {CELL_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    title={c === 'transparent' ? 'Temizle' : 'Renk ver'}
                    onClick={() => handleSetCellBg(c)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-card)',
                      background: c === 'transparent' ? 'repeating-linear-gradient(45deg, #444, #444 3px, #222 3px, #222 6px)' : c,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Tabloyu Tamamen Sil */}
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().deleteTable().run();
                onClose();
              }}
              style={{
                ...btnStyle,
                justifyContent: 'center',
                background: 'rgba(239, 68, 68, 0.12)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: 'var(--accent-rose)',
                marginTop: '4px',
              }}
            >
              <Trash2 size={12} /> Tabloyu Tamamen Sil
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
