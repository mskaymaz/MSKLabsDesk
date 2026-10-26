import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { Indent, Outdent, MoveVertical } from 'lucide-react';
import { WordCombobox } from './WordCombobox';

interface EditorTypographyControlsProps {
  editor: Editor;
  fontSize: string;
  setFontSize: (v: string) => void;
  fontFamily: string;
  setFontFamily: (v: string) => void;
  lineHeight: string;
  setLineHeight: (v: string) => void;
  paragraphSpacing: string;
  setParagraphSpacing: (v: string) => void;
  paragraphSpacingTop?: string;
  setParagraphSpacingTop?: (v: string) => void;
}

const FONT_FAMILIES = [
  { label: 'Sistem Standart', value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Serif (Kitap)', value: 'Georgia, "Times New Roman", Merriweather, serif' },
  { label: 'Monospace (Kod)', value: 'Consolas, Menlo, Monaco, monospace' },
  { label: 'Otantik Arapça', value: 'Cairo, sans-serif' },
  { label: 'Modern Başlık', value: 'Montserrat, sans-serif' },
];

const FONT_SIZE_PRESETS = ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];
const LINE_HEIGHT_PRESETS = ['1.0', '1.15', '1.25', '1.5', '1.75', '2.0', '2.5'];
const MARGIN_TOP_PRESETS = ['0', '2', '4', '6', '8', '12', '16'];
const MARGIN_BOTTOM_PRESETS = ['0', '4', '6', '8', '12', '14', '18', '24'];

export const EditorTypographyControls: React.FC<EditorTypographyControlsProps> = ({
  editor,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  lineHeight,
  setLineHeight,
  paragraphSpacing,
  setParagraphSpacing,
  paragraphSpacingTop = '0',
  setParagraphSpacingTop,
}) => {
  const [isSpacingMenuOpen, setIsSpacingMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsSpacingMenuOpen(false);
      }
    };
    if (isSpacingMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSpacingMenuOpen]);

  const btnStyle: React.CSSProperties = {
    padding: 0,
    border: 'none',
    borderRadius: '4px',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
  };

  return (
    <>
      {/* 1. Font Ailesi (Font Family) */}
      <select
        value={fontFamily}
        onChange={(e) => {
          const val = e.target.value;
          setFontFamily(val);
          if (val) editor.chain().focus().setFontFamily(val).run();
          else editor.chain().focus().unsetFontFamily().run();
        }}
        className="admin-filter-select"
        style={{ height: '24px', fontSize: '11px', width: '96px', padding: '0 4px' }}
        title="Yazı Tipi (Font Ailesi)"
      >
        <option value="">Yazı Tipi</option>
        {FONT_FAMILIES.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      {/* 2. Punto Büyüklüğü (Açık ve Net Etiketli) */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }} title="Punto (Yazı Büyüklüğü)">
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Pt:</span>
        <WordCombobox
          value={fontSize}
          onChange={(val) => {
            setFontSize(val);
            if (val && !isNaN(Number(val))) {
              editor.chain().focus().setFontSize(`${val}px`).run();
            }
          }}
          presets={FONT_SIZE_PRESETS}
          title="Punto (Yazı Büyüklüğü)"
          min={6}
          max={96}
          step={1}
          inputWidth="24px"
        />
      </div>

      {/* Ayırıcı: Pt ile Aralık Arası */}
      <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 8px', flexShrink: 0 }} />

      {/* 3. Satır & Paragraf Boşluğu (Word Tarzı Açılır Popover Menü) */}
      <div style={{ position: 'relative', display: 'inline-block' }} ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsSpacingMenuOpen(!isSpacingMenuOpen)}
          style={{
            ...btnStyle,
            width: 'auto',
            padding: '0 5px',
            gap: '3px',
            fontSize: '11px',
            fontWeight: 600,
            background: isSpacingMenuOpen ? 'var(--bg-active, rgba(59,130,246,0.15))' : 'transparent',
            color: isSpacingMenuOpen ? 'var(--accent-primary, #3b82f6)' : 'var(--text-secondary)',
          }}
          title="Satır & Paragraf Boşlukları (Word Modeli)"
        >
          <MoveVertical size={13} />
          <span>Aralık</span>
        </button>

        {isSpacingMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: '4px',
              zIndex: 1000,
              background: 'var(--bg-card, #1e293b)',
              border: '1px solid var(--border-subtle, #334155)',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              padding: '10px 12px',
              minWidth: '240px',
              color: 'var(--text-primary)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
              Satır & Paragraf Boşlukları
            </div>

            {/* Satır Aralığı */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Satır Aralığı: <b style={{ color: 'var(--text-primary)' }}>{lineHeight}x</b>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <input
                    type="number"
                    step="0.05"
                    min="0.5"
                    max="4.0"
                    value={lineHeight}
                    onChange={(e) => {
                      const val = e.target.value;
                      setLineHeight(val);
                      if (val && !isNaN(Number(val))) {
                        editor.chain().focus().setLineHeight(val).run();
                      }
                    }}
                    style={{
                      width: '44px',
                      height: '20px',
                      fontSize: '10px',
                      textAlign: 'center',
                      padding: '1px 2px',
                      background: 'var(--bg-secondary, #0f172a)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                    }}
                    title="Özel Satır Aralığı (Örn: 1.25)"
                  />
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>x</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                {LINE_HEIGHT_PRESETS.map((lh) => {
                  const isCur = lineHeight === lh;
                  return (
                    <button
                      key={lh}
                      type="button"
                      onClick={() => {
                        setLineHeight(lh);
                        editor.chain().focus().setLineHeight(lh).run();
                      }}
                      style={{
                        padding: '2px 6px',
                        fontSize: '10px',
                        borderRadius: '4px',
                        border: isCur ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isCur ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: isCur ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: isCur ? 700 : 500,
                      }}
                    >
                      {lh}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paragraf Üst Boşluğu */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Paragraf Üstü: <b style={{ color: 'var(--text-primary)' }}>{paragraphSpacingTop}px</b>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="60"
                    value={paragraphSpacingTop}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (setParagraphSpacingTop) setParagraphSpacingTop(val);
                      if (val !== '' && !isNaN(Number(val))) {
                        editor.chain().focus().setParagraphMarginTop(`${val}px`).run();
                      }
                    }}
                    style={{
                      width: '44px',
                      height: '20px',
                      fontSize: '10px',
                      textAlign: 'center',
                      padding: '1px 2px',
                      background: 'var(--bg-secondary, #0f172a)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                    }}
                    title="Özel Üst Boşluk (px)"
                  />
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>px</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                {MARGIN_TOP_PRESETS.map((mt) => {
                  const isCur = paragraphSpacingTop === mt;
                  return (
                    <button
                      key={mt}
                      type="button"
                      onClick={() => {
                        if (setParagraphSpacingTop) setParagraphSpacingTop(mt);
                        editor.chain().focus().setParagraphMarginTop(`${mt}px`).run();
                      }}
                      style={{
                        padding: '2px 5px',
                        fontSize: '10px',
                        borderRadius: '4px',
                        border: isCur ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isCur ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: isCur ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: isCur ? 700 : 500,
                      }}
                    >
                      {mt}px
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paragraf Alt Boşluğu */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Paragraf Altı: <b style={{ color: 'var(--text-primary)' }}>{paragraphSpacing}px</b>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="80"
                    value={paragraphSpacing}
                    onChange={(e) => {
                      const val = e.target.value;
                      setParagraphSpacing(val);
                      if (val !== '' && !isNaN(Number(val))) {
                        editor.chain().focus().setParagraphMarginBottom(`${val}px`).run();
                      }
                    }}
                    style={{
                      width: '44px',
                      height: '20px',
                      fontSize: '10px',
                      textAlign: 'center',
                      padding: '1px 2px',
                      background: 'var(--bg-secondary, #0f172a)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '4px',
                    }}
                    title="Özel Alt Boşluk (px)"
                  />
                  <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>px</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap' }}>
                {MARGIN_BOTTOM_PRESETS.map((mb) => {
                  const isCur = paragraphSpacing === mb;
                  return (
                    <button
                      key={mb}
                      type="button"
                      onClick={() => {
                        setParagraphSpacing(mb);
                        editor.chain().focus().setParagraphMarginBottom(`${mb}px`).run();
                      }}
                      style={{
                        padding: '2px 5px',
                        fontSize: '10px',
                        borderRadius: '4px',
                        border: isCur ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                        background: isCur ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                        color: isCur ? '#ffffff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontWeight: isCur ? 700 : 500,
                      }}
                    >
                      {mb}px
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ayırıcı: Aralık ile Girinti Arası */}
      <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 8px', flexShrink: 0 }} />

      {/* 4. Girinti Azalt / Artır */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setIndent(-1).run()}
        style={btnStyle}
        title="Girintiyi Azalt"
      >
        <Outdent size={13} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setIndent(1).run()}
        style={btnStyle}
        title="Girintiyi Artır"
      >
        <Indent size={13} />
      </button>
    </>
  );
};
