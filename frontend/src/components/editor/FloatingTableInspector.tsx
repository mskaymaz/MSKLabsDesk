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
  Maximize,
  Grid,
  Box,
} from 'lucide-react';

interface FloatingTableInspectorProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

const CELL_BG_COLORS = [
  'transparent',
  'rgba(99, 102, 241, 0.18)',
  'rgba(6, 182, 212, 0.18)',
  'rgba(16, 185, 129, 0.18)',
  'rgba(245, 158, 11, 0.18)',
  'rgba(239, 68, 68, 0.18)',
  'rgba(255, 255, 255, 0.12)',
  'rgba(0, 0, 0, 0.35)',
];

const BORDER_COLORS = [
  '#6366F1',
  '#06B6D4',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#94A3B8',
  '#FFFFFF',
  '#000000',
];

export const FloatingTableInspector: React.FC<FloatingTableInspectorProps> = ({
  editor,
  isOpen,
  onClose,
}) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 130 });
  const [isDragging, setIsDragging] = useState(false);

  // Aktif Kenarlık Ayarları
  const [borderStyle, setBorderStyle] = useState<string>('solid');
  const [borderWidth, setBorderWidth] = useState<string>('1px');
  const [borderColor, setBorderColor] = useState<string>('#6366F1');
  const [activeDirection, setActiveDirection] = useState<string>('all');

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
      const newY = Math.max(60, Math.min(window.innerHeight - 480, dragStartRef.current.posY + dy));
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

  // Kenarlık Uygulama Fonksiyonu (Word Kenarlık Yönleri)
  const handleApplyBorderDirection = (
    dir: 'all' | 'box' | 'top' | 'bottom' | 'left' | 'right' | 'none',
    s = borderStyle,
    w = borderWidth,
    c = borderColor
  ) => {
    setActiveDirection(dir);
    setBorderStyle(s);
    setBorderWidth(w);
    setBorderColor(c);

    let borderCss = '';
    if (dir === 'none' || s === 'none' || w === '0px') {
      borderCss = 'border: none !important;';
    } else if (dir === 'all' || dir === 'box') {
      borderCss = `border: ${w} ${s} ${c} !important;`;
    } else if (dir === 'top') {
      borderCss = `border-top: ${w} ${s} ${c} !important;`;
    } else if (dir === 'bottom') {
      borderCss = `border-bottom: ${w} ${s} ${c} !important;`;
    } else if (dir === 'left') {
      borderCss = `border-left: ${w} ${s} ${c} !important;`;
    } else if (dir === 'right') {
      borderCss = `border-right: ${w} ${s} ${c} !important;`;
    }

    editor.chain().focus().setCellAttribute('style', borderCss).run();
  };

  // Hücre Zemin Rengi Uygulama
  const handleSetCellBg = (color: string) => {
    const bgCss = color === 'transparent' ? 'background-color: transparent !important;' : `background-color: ${color} !important;`;
    editor.chain().focus().setCellAttribute('style', bgCss).run();
  };

  // Hücre İçi Dolgu (Padding) Uygulama
  const handleSetPadding = (pad: string) => {
    editor.chain().focus().setCellAttribute('style', `padding: ${pad} !important;`).run();
  };

  const btnStyle: React.CSSProperties = {
    padding: '4px 6px',
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
    <aside
      aria-label="Yüzen Tablo Stüdyosu"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '300px',
        maxHeight: '88vh',
        background: 'var(--bg-card, #1F2937)',
        border: '1px solid var(--border-card-hover, rgba(99, 102, 241, 0.4))',
        borderRadius: '8px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
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
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px' }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Gövde / Araçlar (Scrollable) */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
        {!isTableActive ? (
          <div style={{ textAlign: 'center', padding: '12px 6px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              İmleç bir tablo hücresinde değil.
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
            {/* 1. Kenarlık Yönü Seçimi (Word Kenarlık Şablonu) */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                WORD KENARLIK YÖNLERİ
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px', marginBottom: '3px' }}>
                {[
                  { id: 'all', label: 'Tümü', icon: Grid },
                  { id: 'box', label: 'Dış', icon: Box },
                  { id: 'none', label: 'Gizli' },
                  { id: 'bottom', label: 'Alt' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      style={miniBtnStyle(activeDirection === item.id)}
                      onClick={() => handleApplyBorderDirection(item.id as any)}
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
                    style={miniBtnStyle(activeDirection === item.id)}
                    onClick={() => handleApplyBorderDirection(item.id as any)}
                    title={item.label}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Çizgi Kalınlığı, Stili ve Rengi */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                ÇİZGİ STİLİ, KALINLIK & RENK
              </span>
              {/* Stil & Kalınlık */}
              <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
                {['solid', 'dashed', 'dotted'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    style={miniBtnStyle(borderStyle === s)}
                    onClick={() => handleApplyBorderDirection(activeDirection as any, s, borderWidth, borderColor)}
                  >
                    {s === 'solid' ? 'Düz' : s === 'dashed' ? 'Kesikli' : 'Noktalı'}
                  </button>
                ))}
                {['1px', '2px', '3px'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    style={miniBtnStyle(borderWidth === w)}
                    onClick={() => handleApplyBorderDirection(activeDirection as any, borderStyle, w, borderColor)}
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Kenarlık Renkleri */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexWrap: 'wrap' }}>
                {BORDER_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleApplyBorderDirection(activeDirection as any, borderStyle, borderWidth, c)}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '3px',
                      border: borderColor === c ? '2px solid #FFFFFF' : '1px solid var(--border-card)',
                      background: c,
                      cursor: 'pointer',
                    }}
                  />
                ))}
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '1px' }} title="Özel Renk Seç">
                  <Palette size={13} style={{ color: borderColor }} />
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => handleApplyBorderDirection(activeDirection as any, borderStyle, borderWidth, e.target.value)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                </label>
              </div>
            </div>

            {/* 3. Hücre Dolgusu (Padding) */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Maximize size={11} /> HÜCRE İÇİ BOŞLUK (PADDING)
              </span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[
                  { label: 'Sıkı (4px)', value: '4px 8px' },
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

            {/* 4. Hücre Zemin Rengi (Background Fill) */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Palette size={11} /> HÜCRE DOLGU RENGİ
              </span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {CELL_BG_COLORS.map((c, i) => (
                  <button
                    key={i}
                    type="button"
                    title={c === 'transparent' ? 'Dolgu Yok' : 'Renk ver'}
                    onClick={() => handleSetCellBg(c)}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '4px',
                      border: '1px solid var(--border-card)',
                      background: c === 'transparent' ? 'repeating-linear-gradient(45deg, #555, #555 3px, #222 3px, #222 6px)' : c,
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 5. Satır & Sütun & Hücre Birleştirme */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                SATIR, SÜTUN & HÜCRE DÜZENİ
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                {[
                  { label: 'Üste Satır', icon: Rows, act: () => editor.chain().focus().addRowBefore().run() },
                  { label: 'Alta Satır', icon: Rows, act: () => editor.chain().focus().addRowAfter().run() },
                  { label: 'Sola Sütun', icon: Columns, act: () => editor.chain().focus().addColumnBefore().run() },
                  { label: 'Sağa Sütun', icon: Columns, act: () => editor.chain().focus().addColumnAfter().run() },
                  { label: 'Birleştir', icon: Combine, act: () => editor.chain().focus().mergeCells().run() },
                  { label: 'Böl', icon: Split, act: () => editor.chain().focus().splitCell().run() },
                ].map((actItem, idx) => {
                  const Icon = actItem.icon;
                  return (
                    <button key={idx} type="button" style={btnStyle} onClick={actItem.act}>
                      <Icon size={11} /> {actItem.label}
                    </button>
                  );
                })}
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
