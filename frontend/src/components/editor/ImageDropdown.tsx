import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Image as ImageIcon,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Plus,
} from 'lucide-react';

interface ImageDropdownProps {
  editor: Editor | null;
}

export const ImageDropdown: React.FC<ImageDropdownProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [layout, setLayout] = useState<'left' | 'right' | 'center' | 'full'>('center');
  const [width, setWidth] = useState('100%');
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

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    editor
      .chain()
      .focus()
      .setImageWithLayout({
        src: url.trim(),
        alt: alt.trim() || undefined,
        layout,
        width: layout === 'full' ? '100%' : width,
      })
      .run();

    setUrl('');
    setAlt('');
    setIsOpen(false);
  };

  const choiceBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '4px 6px',
    fontSize: '11px',
    border: '1px solid var(--border-card)',
    borderRadius: '4px',
    background: active ? 'var(--accent-primary)' : 'var(--bg-secondary)',
    color: active ? '#FFFFFF' : 'var(--text-primary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    justifyContent: 'center',
  });

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Görsel Yerleşim Menüsü"
        style={{
          padding: '4px 8px',
          border: '1px solid var(--border-card)',
          borderRadius: '4px',
          background: 'transparent',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          height: '26px',
          fontSize: '12px',
        }}
      >
        <ImageIcon size={14} />
        <span>Görsel</span>
        <ChevronDown size={11} style={{ opacity: 0.7 }} />
      </button>

      {isOpen && (
        <form
          onSubmit={handleInsert}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '270px',
            background: 'var(--bg-card, #1F2937)',
            border: '1px solid var(--border-card-hover, rgba(99, 102, 241, 0.4))',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            zIndex: 99,
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Görsel Ekle & Metin Sarma
          </span>

          <input
            type="url"
            placeholder="Görsel Bağlantısı (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="admin-filter-input"
            style={{ width: '100%', height: '28px', padding: '0 8px', fontSize: '12px' }}
          />

          <input
            type="text"
            placeholder="Açıklama / Alt Metin (İsteğe bağlı)"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="admin-filter-input"
            style={{ width: '100%', height: '28px', padding: '0 8px', fontSize: '12px' }}
          />

          {/* Metin Sarma & Yerleşim */}
          <div>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              METİN YERLEŞİMİ (WORD SARMA)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <button
                type="button"
                style={choiceBtnStyle(layout === 'left')}
                onClick={() => setLayout('left')}
                title="Metni Saran - Sola Yaslı"
              >
                <AlignLeft size={11} /> Sola Sar
              </button>
              <button
                type="button"
                style={choiceBtnStyle(layout === 'right')}
                onClick={() => setLayout('right')}
                title="Metni Saran - Sağa Yaslı"
              >
                <AlignRight size={11} /> Sağa Sar
              </button>
              <button
                type="button"
                style={choiceBtnStyle(layout === 'center')}
                onClick={() => setLayout('center')}
                title="Satır Açan Blok - Ortalı"
              >
                <AlignCenter size={11} /> Ortalı Blok
              </button>
              <button
                type="button"
                style={choiceBtnStyle(layout === 'full')}
                onClick={() => setLayout('full')}
                title="Tam Genişlik"
              >
                <Maximize2 size={11} /> Tam Genişlik
              </button>
            </div>
          </div>

          {/* Boyutlandırma */}
          {layout !== 'full' && (
            <div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                GENİŞLİK
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['25%', '50%', '75%', '100%'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    style={{ ...choiceBtnStyle(width === w), flex: 1 }}
                    onClick={() => setWidth(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 600,
              background: 'var(--accent-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '4px',
            }}
          >
            <Plus size={13} /> Belgeye Ekle
          </button>
        </form>
      )}
    </div>
  );
};
