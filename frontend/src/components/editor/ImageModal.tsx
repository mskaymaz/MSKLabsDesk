import React, { useState } from 'react';
import type { Editor } from '@tiptap/react';
import { Image as ImageIcon, X, AlignLeft, AlignRight, AlignCenter, Maximize2 } from 'lucide-react';

interface ImageModalProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ editor, isOpen, onClose }) => {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const [layout, setLayout] = useState<'left' | 'right' | 'center' | 'full'>('center');
  const [width, setWidth] = useState('auto');

  if (!isOpen) return null;

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!src) return;

    editor
      .chain()
      .focus()
      .setImageWithLayout({
        src,
        alt,
        layout,
        width: width === 'auto' ? undefined : width,
      })
      .run();

    setSrc('');
    setAlt('');
    setLayout('center');
    setWidth('auto');
    onClose();
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
          maxWidth: '480px',
          background: 'var(--bg-modal, var(--bg-card))',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-xl)',
          padding: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={18} color="var(--accent-primary)" />
            <h3 className="admin-modal-title" style={{ fontSize: '0.96rem' }}>
              Görsel & Metin Kaydırma (Image Wrap)
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

        <form onSubmit={handleInsert} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Görsel URL Adresi *
            </label>
            <input
              type="text"
              required
              placeholder="https://example.com/resim.webp"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              className="admin-filter-input"
              style={{ width: '100%', height: '34px', padding: '0 10px' }}
            />
          </div>

          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Görsel Açıklaması / Alt Metin
            </label>
            <input
              type="text"
              placeholder="Görsel açıklaması"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="admin-filter-input"
              style={{ width: '100%', height: '34px', padding: '0 10px' }}
            />
          </div>

          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Metin Kaydırma & Mizanpaj Modu:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setLayout('left')}
                className="admin-btn admin-btn-sm"
                style={{
                  background: layout === 'left' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: layout === 'left' ? '#FFF' : 'var(--text-primary)',
                  fontSize: '0.74rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                }}
              >
                <AlignLeft size={14} /> Metni Saran (Sol)
              </button>
              <button
                type="button"
                onClick={() => setLayout('right')}
                className="admin-btn admin-btn-sm"
                style={{
                  background: layout === 'right' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: layout === 'right' ? '#FFF' : 'var(--text-primary)',
                  fontSize: '0.74rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                }}
              >
                <AlignRight size={14} /> Metni Saran (Sağ)
              </button>
              <button
                type="button"
                onClick={() => setLayout('center')}
                className="admin-btn admin-btn-sm"
                style={{
                  background: layout === 'center' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: layout === 'center' ? '#FFF' : 'var(--text-primary)',
                  fontSize: '0.74rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                }}
              >
                <AlignCenter size={14} /> Satır Açan (Ortalı)
              </button>
              <button
                type="button"
                onClick={() => setLayout('full')}
                className="admin-btn admin-btn-sm"
                style={{
                  background: layout === 'full' ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: layout === 'full' ? '#FFF' : 'var(--text-primary)',
                  fontSize: '0.74rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'flex-start',
                  padding: '6px 10px',
                }}
              >
                <Maximize2 size={14} /> Tam Genişlik (%100)
              </button>
            </div>
          </div>

          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Genişlik Ölçeği:
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['auto', '35%', '50%', '75%', '100%'] as const).map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWidth(w)}
                  className="admin-btn admin-btn-xs"
                  style={{
                    background: width === w ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                    color: width === w ? '#FFF' : 'var(--text-primary)',
                    fontSize: '0.72rem',
                    flex: 1,
                  }}
                >
                  {w === 'auto' ? 'Otomatik' : w}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="admin-btn admin-btn-view admin-btn-sm">
              Vazgeç
            </button>
            <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm">
              Görseli Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
