import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
} from 'lucide-react';

interface FloatingImageToolbarProps {
  editor: Editor | null;
}

export const FloatingImageToolbar: React.FC<FloatingImageToolbarProps> = ({ editor }) => {
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [currentWidth, setCurrentWidth] = useState('100%');
  const [currentLayout, setCurrentLayout] = useState<'left' | 'right' | 'center' | 'full'>('center');
  const [customWidthInput, setCustomWidthInput] = useState('');
  const [altText, setAltText] = useState('');
  const [isAltEditing, setIsAltEditing] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const checkSelection = () => {
      const active = editor.isActive('customImage');
      setIsImageSelected(active);

      if (active) {
        const attrs = editor.getAttributes('customImage');
        setCurrentWidth(attrs.width || '100%');
        setCurrentLayout(attrs.layout || 'center');
        setAltText(attrs.alt || '');
        setCustomWidthInput(attrs.width || '100%');
      }
    };

    editor.on('selectionUpdate', checkSelection);
    editor.on('transaction', checkSelection);

    return () => {
      editor.off('selectionUpdate', checkSelection);
      editor.off('transaction', checkSelection);
    };
  }, [editor]);

  if (!editor || !isImageSelected) return null;

  const handleSetWidth = (w: string) => {
    setCurrentWidth(w);
    setCustomWidthInput(w);
    editor.chain().focus().updateImageAttributes({ width: w }).run();
  };

  const handleCustomWidthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customWidthInput.trim()) return;
    let finalW = customWidthInput.trim();
    if (!finalW.endsWith('%') && !finalW.endsWith('px') && !finalW.endsWith('rem')) {
      finalW = `${finalW}px`;
    }
    handleSetWidth(finalW);
  };

  const handleSetLayout = (layout: 'left' | 'right' | 'center' | 'full') => {
    setCurrentLayout(layout);
    editor.chain().focus().updateImageAttributes({ layout }).run();
  };

  const handleSaveAlt = () => {
    editor.chain().focus().updateImageAttributes({ alt: altText.trim() }).run();
    setIsAltEditing(false);
  };

  const handleDelete = () => {
    editor.chain().focus().deleteSelection().run();
    setIsImageSelected(false);
  };

  const pillBtn = (active: boolean): React.CSSProperties => ({
    padding: '3px 7px',
    fontSize: '11px',
    fontWeight: active ? 700 : 500,
    borderRadius: '4px',
    border: '1px solid',
    borderColor: active ? 'var(--accent-primary)' : 'var(--border-card)',
    background: active ? 'var(--accent-primary)' : 'var(--bg-secondary)',
    color: active ? '#ffffff' : 'var(--text-primary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    lineHeight: 1.2,
  });

  return (
    <div
      className="floating-image-toolbar animate-fade-in"
      style={{
        position: 'sticky',
        bottom: '12px',
        margin: '0 auto',
        width: 'fit-content',
        maxWidth: '95%',
        zIndex: 50,
        background: 'var(--bg-card)',
        border: '1px solid var(--accent-primary)',
        boxShadow: '0 8px 24px -4px rgba(0,0,0,0.3)',
        borderRadius: '8px',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-primary)', fontSize: '11px', fontWeight: 700 }}>
        <ImageIcon size={14} />
        <span>Görsel:</span>
      </div>

      {/* Boyutlandırma / Ebat Seçimi (%25, %50, %75, %100) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        {(['25%', '50%', '75%', '100%'] as const).map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => handleSetWidth(w)}
            style={pillBtn(currentWidth === w)}
            title={`Görsel genişliğini ${w} yap`}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Özel Ebat Girişi (px veya %) */}
      <form onSubmit={handleCustomWidthSubmit} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
        <input
          type="text"
          value={customWidthInput}
          onChange={(e) => setCustomWidthInput(e.target.value)}
          placeholder="Örn: 400px"
          style={{
            width: '64px',
            padding: '2px 5px',
            fontSize: '11px',
            borderRadius: '4px',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            textAlign: 'center',
          }}
        />
        <button
          type="submit"
          className="admin-btn admin-btn-secondary"
          style={{ padding: '2px 6px', fontSize: '10px', height: '22px' }}
          title="Özel genişliği uygula"
        >
          Uygula
        </button>
      </form>

      <div style={{ width: '1px', height: '18px', background: 'var(--border-card)' }} />

      {/* Hizalama & Yerleşim (Float Sol, Orta, Float Sağ, Tam Satır) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <button
          type="button"
          onClick={() => handleSetLayout('left')}
          style={pillBtn(currentLayout === 'left')}
          title="Metin Sarmalı Sola Yasla"
        >
          <AlignLeft size={13} />
          <span>Sol</span>
        </button>
        <button
          type="button"
          onClick={() => handleSetLayout('center')}
          style={pillBtn(currentLayout === 'center')}
          title="Merkeze Ortala"
        >
          <AlignCenter size={13} />
          <span>Orta</span>
        </button>
        <button
          type="button"
          onClick={() => handleSetLayout('right')}
          style={pillBtn(currentLayout === 'right')}
          title="Metin Sarmalı Sağa Yasla"
        >
          <AlignRight size={13} />
          <span>Sağ</span>
        </button>
        <button
          type="button"
          onClick={() => handleSetLayout('full')}
          style={pillBtn(currentLayout === 'full')}
          title="Tam Satır Blok"
        >
          <Maximize2 size={13} />
          <span>Tam</span>
        </button>
      </div>

      <div style={{ width: '1px', height: '18px', background: 'var(--border-card)' }} />

      {/* Alt Metin (SEO) Düzenleme */}
      {isAltEditing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Görsel açıklaması (Alt)..."
            style={{
              width: '130px',
              padding: '2px 5px',
              fontSize: '11px',
              borderRadius: '4px',
              border: '1px solid var(--border-card)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            type="button"
            onClick={handleSaveAlt}
            className="admin-btn admin-btn-primary"
            style={{ padding: '2px 6px', fontSize: '10px', height: '22px' }}
          >
            <Check size={11} />
          </button>
          <button
            type="button"
            onClick={() => setIsAltEditing(false)}
            className="admin-btn admin-btn-secondary"
            style={{ padding: '2px 6px', fontSize: '10px', height: '22px' }}
          >
            <X size={11} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAltEditing(true)}
          style={{ ...pillBtn(false), fontSize: '10px' }}
          title="Görsel açıklama yazısını (alt) düzenle"
        >
          Alt Metin: {altText ? `"${altText.slice(0, 10)}..."` : '(Yok)'}
        </button>
      )}

      {/* Görseli Sil */}
      <button
        type="button"
        onClick={handleDelete}
        style={{
          ...pillBtn(false),
          borderColor: 'var(--danger, #EF4444)',
          color: 'var(--danger, #EF4444)',
        }}
        title="Görseli Editörden Kaldır"
      >
        <Trash2 size={12} />
        <span>Sil</span>
      </button>
    </div>
  );
};
