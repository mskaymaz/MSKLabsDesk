import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Table as TableIcon,
  ChevronDown,
  Rows,
  Columns,
  Trash2,
  Combine,
  Split,
  Move,
  Eye,
  EyeOff,
} from 'lucide-react';

interface TableDropdownProps {
  editor: Editor | null;
  onOpenFloating: () => void;
}

export const TableDropdown: React.FC<TableDropdownProps> = ({ editor, onOpenFloating }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoverGrid, setHoverGrid] = useState({ rows: 3, cols: 3 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!editor) return null;

  const isTableActive = editor.isActive('table');

  const handleInsertGrid = (r: number, c: number) => {
    editor.chain().focus().insertTable({ rows: r, cols: c, withHeaderRow: true }).run();
    setIsOpen(false);
  };

  const itemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    width: '100%',
    padding: '6px 8px',
    fontSize: '12px',
    color: 'var(--text-primary)',
    background: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    textAlign: 'left',
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Tablo Menüsü"
        style={{
          padding: '4px 8px',
          border: '1px solid var(--border-card)',
          borderRadius: '4px',
          background: isTableActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
          color: isTableActive ? 'var(--accent-primary)' : 'var(--text-primary)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          height: '26px',
          fontSize: '12px',
        }}
      >
        <TableIcon size={14} />
        <span>Tablo</span>
        <ChevronDown size={11} style={{ opacity: 0.7 }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '210px',
            background: 'var(--bg-card, #1F2937)',
            border: '1px solid var(--border-card-hover, rgba(99, 102, 241, 0.4))',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            zIndex: 99,
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          {/* Hızlı Tablo Ekleme Izgarası */}
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              TABLO EKLE ({hoverGrid.rows}x{hoverGrid.cols})
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '3px', marginBottom: '6px' }}>
              {Array.from({ length: 6 }).map((_, rIdx) =>
                Array.from({ length: 6 }).map((_, cIdx) => {
                  const isHovered = rIdx < hoverGrid.rows && cIdx < hoverGrid.cols;
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onMouseEnter={() => setHoverGrid({ rows: rIdx + 1, cols: cIdx + 1 })}
                      onClick={() => handleInsertGrid(rIdx + 1, cIdx + 1)}
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '2px',
                        border: '1px solid var(--border-subtle)',
                        background: isHovered ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)',
                        cursor: 'pointer',
                      }}
                    />
                  );
                })
              )}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

          {/* Tablo İçi Hızlı Aksiyonlar */}
          {isTableActive ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button
                type="button"
                style={itemStyle}
                onClick={() => {
                  editor.chain().focus().addRowAfter().run();
                  setIsOpen(false);
                }}
              >
                <Rows size={12} /> Alta Satır Ekle
              </button>
              <button
                type="button"
                style={itemStyle}
                onClick={() => {
                  editor.chain().focus().addColumnAfter().run();
                  setIsOpen(false);
                }}
              >
                <Columns size={12} /> Sağa Sütun Ekle
              </button>
              <button
                type="button"
                style={itemStyle}
                onClick={() => {
                  editor.chain().focus().mergeCells().run();
                  setIsOpen(false);
                }}
              >
                <Combine size={12} /> Hücreleri Birleştir
              </button>
              <button
                type="button"
                style={itemStyle}
                onClick={() => {
                  editor.chain().focus().splitCell().run();
                  setIsOpen(false);
                }}
              >
                <Split size={12} /> Hücreyi Böl
              </button>
              <button
                type="button"
                style={itemStyle}
                onClick={() => {
                  editor.chain().focus().setCellAttribute('style', 'border: none;').run();
                  setIsOpen(false);
                }}
              >
                <EyeOff size={12} /> Kenarlıkları Gizle (Çizgisiz)
              </button>
              <button
                type="button"
                style={itemStyle}
                onClick={() => {
                  editor.chain().focus().setCellAttribute('style', 'border: 1px solid var(--border-card);').run();
                  setIsOpen(false);
                }}
              >
                <Eye size={12} /> Kenarlıkları Göster (1px)
              </button>
              <button
                type="button"
                style={{ ...itemStyle, color: 'var(--accent-rose)' }}
                onClick={() => {
                  editor.chain().focus().deleteTable().run();
                  setIsOpen(false);
                }}
              >
                <Trash2 size={12} /> Tabloyu Sil
              </button>
            </div>
          ) : (
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '2px 4px' }}>
              Düzenlemek için bir tablo hücresine tıklayın.
            </span>
          )}

          <div style={{ height: '1px', background: 'var(--border-subtle)' }} />

          {/* Sürüklenebilir Yüzen Palet Açıcı */}
          <button
            type="button"
            onClick={() => {
              onOpenFloating();
              setIsOpen(false);
            }}
            style={{
              ...itemStyle,
              background: 'rgba(99, 102, 241, 0.12)',
              color: 'var(--accent-cyan)',
              fontWeight: 600,
            }}
          >
            <Move size={12} /> Yüzen Canlı Paleti Aç
          </button>
        </div>
      )}
    </div>
  );
};
