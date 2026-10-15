import React, { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { 
  Table as TableIcon, 
  Trash2, 
  Plus, 
  Minus, 
  Split, 
  Combine, 
  Palette,
  X
} from 'lucide-react';

interface TableModalProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export const TableModal: React.FC<TableModalProps> = ({ editor, isOpen, onClose }) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [cellColor, setCellColor] = useState('#6366f1');

  if (!isOpen) return null;

  const isTableActive = editor.isActive('table');

  const handleInsertTable = () => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    onClose();
  };

  const handleSetCellBackground = (color: string) => {
    editor.chain().focus().setCellAttribute('style', `background-color: ${color}`).run();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="admin-panel-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: 'var(--bg-modal, var(--bg-card))',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-xl)',
          padding: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TableIcon size={18} color="var(--accent-primary)" />
            <h3 className="admin-modal-title" style={{ fontSize: '0.96rem' }}>
              Tablo Stüdyosu (Word Table Engine)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-refresh admin-btn-sm"
            style={{ width: '26px', height: '26px', padding: 0 }}
          >
            <X size={15} />
          </button>
        </div>

        {!isTableActive ? (
          /* Tablo Ekleme Formu */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="admin-meta-text" style={{ fontSize: '0.8rem' }}>
              Yeni bir tablo boyutu belirleyin:
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Satır Sayısı
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={rows}
                  onChange={(e) => setRows(Math.max(1, Number(e.target.value)))}
                  className="admin-filter-input"
                  style={{ width: '100%', height: '34px', padding: '0 10px' }}
                />
              </div>

              <div>
                <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Sütun Sayısı
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={cols}
                  onChange={(e) => setCols(Math.max(1, Number(e.target.value)))}
                  className="admin-filter-input"
                  style={{ width: '100%', height: '34px', padding: '0 10px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
              <button type="button" onClick={onClose} className="admin-btn admin-btn-view admin-btn-sm">
                Vazgeç
              </button>
              <button type="button" onClick={handleInsertTable} className="admin-btn admin-btn-primary admin-btn-sm">
                Tabloyu Ekle ({rows}x{cols})
              </button>
            </div>
          </div>
        ) : (
          /* Aktif Tablo Düzenleme Menüsü */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span className="admin-badge admin-badge-info" style={{ alignSelf: 'flex-start' }}>
              İmleç Tablo İçinde
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className="admin-btn admin-btn-view admin-btn-sm"
                style={{ fontSize: '0.74rem' }}
              >
                <Plus size={12} /> Üste Satır Ekle
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="admin-btn admin-btn-view admin-btn-sm"
                style={{ fontSize: '0.74rem' }}
              >
                <Plus size={12} /> Alta Satır Ekle
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteRow().run()}
                className="admin-btn admin-btn-danger admin-btn-sm"
                style={{ fontSize: '0.74rem' }}
              >
                <Minus size={12} /> Satırı Sil
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className="admin-btn admin-btn-view admin-btn-sm"
                style={{ fontSize: '0.74rem' }}
              >
                <Plus size={12} /> Sola Sütun Ekle
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="admin-btn admin-btn-view admin-btn-sm"
                style={{ fontSize: '0.74rem' }}
              >
                <Plus size={12} /> Sağa Sütun Ekle
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className="admin-btn admin-btn-danger admin-btn-sm"
                style={{ fontSize: '0.74rem' }}
              >
                <Minus size={12} /> Sütunu Sil
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span className="admin-meta-text" style={{ fontWeight: 600 }}>
                Hücre Birleştirme & Ayırma (Merge / Split):
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().mergeCells().run()}
                  className="admin-btn admin-btn-edit admin-btn-sm"
                  style={{ fontSize: '0.74rem' }}
                >
                  <Combine size={13} /> Hücreleri Birleştir
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().splitCell().run()}
                  className="admin-btn admin-btn-edit admin-btn-sm"
                  style={{ fontSize: '0.74rem' }}
                >
                  <Split size={13} /> Hücreyi Böl
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              <span className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                Hücre Zemin Rengi:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="color"
                  value={cellColor}
                  onChange={(e) => setCellColor(e.target.value)}
                  style={{ width: '32px', height: '32px', borderRadius: '4px', cursor: 'pointer', border: 'none', background: 'transparent' }}
                />
                <button
                  type="button"
                  onClick={() => handleSetCellBackground(cellColor)}
                  className="admin-btn admin-btn-view admin-btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  <Palette size={13} /> Hücreyi Boya
                </button>
                <button
                  type="button"
                  onClick={() => handleSetCellBackground('transparent')}
                  className="admin-btn admin-btn-view admin-btn-sm"
                  style={{ fontSize: '0.75rem' }}
                >
                  Dolgu Temizle
                </button>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => {
                  editor.chain().focus().deleteTable().run();
                  onClose();
                }}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Trash2 size={13} /> Tüm Tabloyu Sil
              </button>
              <button type="button" onClick={onClose} className="admin-btn admin-btn-primary admin-btn-sm">
                Tamam
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
