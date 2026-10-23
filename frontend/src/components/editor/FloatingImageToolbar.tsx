import React, { useState, useEffect, useRef } from 'react';
import type { Editor } from '@tiptap/react';
import {
  ChevronDown,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Square,
} from 'lucide-react';

interface FloatingImageToolbarProps {
  editor: Editor | null;
}

type ImageLayoutType = 'left' | 'right' | 'left-block' | 'right-block' | 'center' | 'full';

const WIDTH_PRESETS = ['%25', '%33', '%50', '%66', '%75', '%85', '%100'];

const LAYOUT_OPTIONS: { id: ImageLayoutType; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'left', label: 'Sola Yasla', icon: <AlignLeft size={13} />, desc: 'Metin sağdan sarar' },
  { id: 'right', label: 'Sağa Yasla', icon: <AlignRight size={13} />, desc: 'Metin soldan sarar' },
  { id: 'left-block', label: 'Sola Blok', icon: <Square size={13} />, desc: 'Metin sarmaz, altta kalır' },
  { id: 'right-block', label: 'Sağa Blok', icon: <Square size={13} />, desc: 'Metin sarmaz, altta kalır' },
  { id: 'center', label: 'Ortala', icon: <AlignCenter size={13} />, desc: 'Merkeze hizalı blok' },
  { id: 'full', label: 'Tam Satır', icon: <Maximize2 size={13} />, desc: 'Genişletilmiş tam satır' },
];

export const FloatingImageToolbar: React.FC<FloatingImageToolbarProps> = ({ editor }) => {
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [currentWidth, setCurrentWidth] = useState('100%');
  const [currentLayout, setCurrentLayout] = useState<ImageLayoutType>('center');
  const [customWidthInput, setCustomWidthInput] = useState('');
  const [altText, setAltText] = useState('');
  const [isAltEditing, setIsAltEditing] = useState(false);

  const [isWidthDropdownOpen, setIsWidthDropdownOpen] = useState(false);
  const [isLayoutDropdownOpen, setIsLayoutDropdownOpen] = useState(false);

  const widthRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (widthRef.current && !widthRef.current.contains(e.target as Node)) {
        setIsWidthDropdownOpen(false);
      }
      if (layoutRef.current && !layoutRef.current.contains(e.target as Node)) {
        setIsLayoutDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!editor) return;

    const checkSelection = () => {
      const active = editor.isActive('customImage');
      setIsImageSelected(active);

      if (active) {
        const attrs = editor.getAttributes('customImage');
        const w = attrs.width || '100%';
        setCurrentWidth(w);
        setCurrentLayout((attrs.layout as ImageLayoutType) || 'center');
        setAltText(attrs.alt || '');
        setCustomWidthInput(w.replace('%', '').replace('px', ''));
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
    setCustomWidthInput(w.replace('%', '').replace('px', ''));
    editor.chain().focus().updateImageAttributes({ width: w }).run();
    setIsWidthDropdownOpen(false);
  };

  const handleCustomWidthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customWidthInput.trim();
    if (!clean) return;

    let finalW = clean;
    if (!clean.endsWith('%') && !clean.endsWith('px') && !clean.endsWith('rem')) {
      // Sayısal değer ise doğrudan yüzde formatına dönüştür
      finalW = `${clean}%`;
    }
    handleSetWidth(finalW);
  };

  const handleSetLayout = (layout: ImageLayoutType) => {
    setCurrentLayout(layout);
    editor.chain().focus().updateImageAttributes({ layout }).run();
    setIsLayoutDropdownOpen(false);
  };

  const handleSaveAlt = () => {
    editor.chain().focus().updateImageAttributes({ alt: altText.trim() }).run();
    setIsAltEditing(false);
  };

  const handleDelete = () => {
    editor.chain().focus().deleteSelection().run();
    setIsImageSelected(false);
  };

  const currentLayoutObj = LAYOUT_OPTIONS.find((l) => l.id === currentLayout) || LAYOUT_OPTIONS[4];

  const pillBtn = (active: boolean): React.CSSProperties => ({
    padding: '3px 8px',
    fontSize: '11px',
    fontWeight: active ? 700 : 500,
    borderRadius: '4px',
    border: '1px solid var(--border-card)',
    background: active ? 'var(--accent-primary)' : 'var(--bg-secondary)',
    color: active ? '#ffffff' : 'var(--text-primary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    lineHeight: 1.2,
    height: '24px',
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
        zIndex: 100,
        background: 'var(--bg-card)',
        border: '1px solid var(--accent-primary)',
        boxShadow: '0 8px 24px -4px rgba(0,0,0,0.3)',
        borderRadius: '8px',
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-primary)', fontSize: '11px', fontWeight: 700 }}>
        <ImageIcon size={14} />
        <span>Görsel:</span>
      </div>

      {/* 1. Boyut Açılır Menüsü (%25-%100) */}
      <div ref={widthRef} style={{ position: 'relative', display: 'inline-block' }}>
        <button
          type="button"
          onClick={() => setIsWidthDropdownOpen(!isWidthDropdownOpen)}
          style={pillBtn(isWidthDropdownOpen)}
          title="Hazır genişlik seçin"
        >
          <span>Boyut: {currentWidth}</span>
          <ChevronDown size={11} style={{ opacity: 0.7 }} />
        </button>

        {isWidthDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 4px)',
              left: 0,
              zIndex: 120,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: '6px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
              padding: '4px',
              width: '110px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {WIDTH_PRESETS.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => handleSetWidth(w.replace('%', '') + '%')}
                style={{
                  padding: '5px 8px',
                  textAlign: 'left',
                  border: 'none',
                  borderRadius: '4px',
                  background: currentWidth === w.replace('%', '') + '%' ? 'var(--accent-primary)' : 'transparent',
                  color: currentWidth === w.replace('%', '') + '%' ? '#FFF' : 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: currentWidth === w.replace('%', '') + '%' ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{w}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Ara Değer Girişi (Örn: 15, 23, 36, 55, 72 veya px) */}
      <form onSubmit={handleCustomWidthSubmit} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
        <input
          type="text"
          value={customWidthInput}
          onChange={(e) => setCustomWidthInput(e.target.value)}
          placeholder="Ara değer (%)"
          style={{
            width: '60px',
            padding: '2px 5px',
            height: '24px',
            fontSize: '11px',
            borderRadius: '4px',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            textAlign: 'center',
          }}
          title="Ara değer girin (Örn: 23, 55 veya 350px)"
        />
        <button
          type="submit"
          className="admin-btn admin-btn-secondary"
          style={{ padding: '0 6px', fontSize: '10px', height: '24px' }}
          title="Özel genişliği uygula"
        >
          Uygula
        </button>
      </form>

      <div style={{ width: '1px', height: '18px', background: 'var(--border-card)' }} />

      {/* 3. Yerleşim & Metin Sarma Açılır Listesi */}
      <div ref={layoutRef} style={{ position: 'relative', display: 'inline-block' }}>
        <button
          type="button"
          onClick={() => setIsLayoutDropdownOpen(!isLayoutDropdownOpen)}
          style={pillBtn(isLayoutDropdownOpen)}
          title="Görsel yerleşimi ve metin sarma seçenekleri"
        >
          {currentLayoutObj.icon}
          <span>{currentLayoutObj.label}</span>
          <ChevronDown size={11} style={{ opacity: 0.7 }} />
        </button>

        {isLayoutDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 4px)',
              left: 0,
              zIndex: 120,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: '6px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
              padding: '4px',
              width: '210px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            {LAYOUT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSetLayout(opt.id)}
                style={{
                  padding: '6px 8px',
                  textAlign: 'left',
                  border: 'none',
                  borderRadius: '4px',
                  background: currentLayout === opt.id ? 'var(--accent-primary)' : 'transparent',
                  color: currentLayout === opt.id ? '#FFF' : 'var(--text-primary)',
                  fontSize: '11px',
                  fontWeight: currentLayout === opt.id ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                {opt.icon}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{opt.label}</span>
                  <span style={{ fontSize: '9px', opacity: 0.7 }}>{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ width: '1px', height: '18px', background: 'var(--border-card)' }} />

      {/* 4. Alt Metin (SEO) Düzenleme */}
      {isAltEditing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Görsel açıklaması (Alt)..."
            style={{
              width: '120px',
              padding: '2px 5px',
              height: '24px',
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
            style={{ padding: '0 6px', fontSize: '10px', height: '24px' }}
          >
            <Check size={11} />
          </button>
          <button
            type="button"
            onClick={() => setIsAltEditing(false)}
            className="admin-btn admin-btn-secondary"
            style={{ padding: '0 6px', fontSize: '10px', height: '24px' }}
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
          Alt: {altText ? `"${altText.slice(0, 10)}..."` : '(Yok)'}
        </button>
      )}

      {/* 5. Görseli Sil */}
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
