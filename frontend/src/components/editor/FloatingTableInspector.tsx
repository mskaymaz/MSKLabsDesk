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
      const newX = Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.posX + dx));
      const newY = Math.max(70, Math.min(window.innerHeight - 340, dragStartRef.current.posY + dy));
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

  return (
    <aside
      aria-label="Yüzen Tablo Stüdyosu"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '280px',
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

      {/* Gövde / Araçlar */}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            {/* Satır İşlemleri */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                SATIR DÜZENLEME
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <button type="button" style={btnStyle} onClick={() => editor.chain().focus().addRowBefore().run()}>
                  <Rows size={11} /> Üste Ekle
                </button>
                <button type="button" style={btnStyle} onClick={() => editor.chain().focus().addRowAfter().run()}>
                  <Rows size={11} /> Alta Ekle
                </button>
              </div>
              <button
                type="button"
                style={{ ...btnStyle, width: '100%', marginTop: '4px', color: 'var(--accent-rose)' }}
                onClick={() => editor.chain().focus().deleteRow().run()}
              >
                <Trash2 size={11} /> Seçili Satırı Sil
              </button>
            </div>

            {/* Sütun İşlemleri */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                SÜTUN DÜZENLEME
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                <button type="button" style={btnStyle} onClick={() => editor.chain().focus().addColumnBefore().run()}>
                  <Columns size={11} /> Sola Ekle
                </button>
                <button type="button" style={btnStyle} onClick={() => editor.chain().focus().addColumnAfter().run()}>
                  <Columns size={11} /> Sağa Ekle
                </button>
              </div>
              <button
                type="button"
                style={{ ...btnStyle, width: '100%', marginTop: '4px', color: 'var(--accent-rose)' }}
                onClick={() => editor.chain().focus().deleteColumn().run()}
              >
                <Trash2 size={11} /> Seçili Sütunu Sil
              </button>
            </div>

            {/* Hücre Birleştirme / Bölme */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                HÜCRE İŞLEMLERİ
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

            {/* Hücre Zemin Rengi */}
            <div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                <Palette size={11} /> HÜCRE DOLGUSU
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
