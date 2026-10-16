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
  Grid,
  Maximize,
  Table as TableIcon,
} from 'lucide-react';
import { TableBorderControls } from './TableBorderControls';
import { TableCellDimensionControls } from './TableCellDimensionControls';

interface FloatingTableInspectorProps {
  editor: Editor | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FloatingTableInspector: React.FC<FloatingTableInspectorProps> = ({
  editor,
  isOpen,
  onClose,
}) => {
  const [position, setPosition] = useState({ x: window.innerWidth - 340, y: 130 });
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'borders' | 'dimensions' | 'layout'>('borders');

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
      const newX = Math.max(10, Math.min(window.innerWidth - 330, dragStartRef.current.posX + dx));
      const newY = Math.max(60, Math.min(window.innerHeight - 520, dragStartRef.current.posY + dy));
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

  const btnStyle: React.CSSProperties = {
    padding: '6px 8px',
    fontSize: '11px',
    fontWeight: 500,
    border: '1px solid var(--border-card)',
    borderRadius: '4px',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    justifyContent: 'center',
  };

  const tabStyle = (tab: 'borders' | 'dimensions' | 'layout'): React.CSSProperties => ({
    flex: 1,
    padding: '5px 4px',
    fontSize: '10px',
    fontWeight: activeTab === tab ? 700 : 500,
    border: 'none',
    borderBottom: activeTab === tab ? '2px solid var(--accent-primary)' : '2px solid transparent',
    background: activeTab === tab ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
    color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
  });

  return (
    <aside
      aria-label="Yüzen Tablo Stüdyosu"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '320px',
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

      {/* Gövde / Araçlar */}
      {!isTableActive ? (
        <div style={{ padding: '16px 12px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
            İmleç bir tablo hücresinde değil.
          </p>
          <button
            type="button"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            style={{ ...btnStyle, background: 'var(--accent-primary)', color: '#FFFFFF', width: '100%' }}
          >
            <Plus size={12} /> 3x3 Tablo Ekle
          </button>
        </div>
      ) : (
        <>
          {/* Sekme Çubuğu */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-card)', background: 'var(--bg-secondary)' }}>
            <button type="button" style={tabStyle('borders')} onClick={() => setActiveTab('borders')}>
              <Grid size={11} /> Kenarlıklar
            </button>
            <button type="button" style={tabStyle('dimensions')} onClick={() => setActiveTab('dimensions')}>
              <Maximize size={11} /> Boyut & Dolgu
            </button>
            <button type="button" style={tabStyle('layout')} onClick={() => setActiveTab('layout')}>
              <TableIcon size={11} /> Düzen
            </button>
          </div>

          {/* Sekme İçeriği (Kaydırılabilir) */}
          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
            {activeTab === 'borders' && <TableBorderControls editor={editor} />}
            {activeTab === 'dimensions' && <TableCellDimensionControls editor={editor} />}
            {activeTab === 'layout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', display: 'block' }}>
                  Satır ve Sütun İşlemleri
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  {[
                    { label: 'Üste Satır', icon: Rows, act: () => editor.chain().focus().addRowBefore().run() },
                    { label: 'Alta Satır', icon: Rows, act: () => editor.chain().focus().addRowAfter().run() },
                    { label: 'Sola Sütun', icon: Columns, act: () => editor.chain().focus().addColumnBefore().run() },
                    { label: 'Sağa Sütun', icon: Columns, act: () => editor.chain().focus().addColumnAfter().run() },
                    { label: 'Satırı Sil', icon: Trash2, act: () => editor.chain().focus().deleteRow().run() },
                    { label: 'Sütunu Sil', icon: Trash2, act: () => editor.chain().focus().deleteColumn().run() },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button key={idx} type="button" style={btnStyle} onClick={item.act}>
                        <Icon size={11} /> {item.label}
                      </button>
                    );
                  })}
                </div>

                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginTop: '6px' }}>
                  Hücre Birleştirme ve Bölme
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <button type="button" style={btnStyle} onClick={() => editor.chain().focus().mergeCells().run()}>
                    <Combine size={11} /> Hücreleri Birleştir
                  </button>
                  <button type="button" style={btnStyle} onClick={() => editor.chain().focus().splitCell().run()}>
                    <Split size={11} /> Hücreyi Böl
                  </button>
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
                    background: 'rgba(239, 68, 68, 0.12)',
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    color: 'var(--accent-rose)',
                    marginTop: '8px',
                  }}
                >
                  <Trash2 size={12} /> Tabloyu Tamamen Sil
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </aside>
  );
};
