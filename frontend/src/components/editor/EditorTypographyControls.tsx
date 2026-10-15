import React from 'react';
import type { Editor } from '@tiptap/react';
import { Minus, Plus, Indent, Outdent } from 'lucide-react';

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
}

const FONT_FAMILIES = [
  { label: 'Sistem Standart', value: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  { label: 'Serif (Kitap)', value: 'Georgia, "Times New Roman", Merriweather, serif' },
  { label: 'Monospace (Kod)', value: 'Consolas, Menlo, Monaco, monospace' },
  { label: 'Otantik Arapça', value: 'Cairo, sans-serif' },
  { label: 'Modern Başlık', value: 'Montserrat, sans-serif' },
];

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
}) => {
  const btnStyle: React.CSSProperties = {
    padding: 0,
    border: 'none',
    borderRadius: '3px',
    background: 'transparent',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '22px',
  };

  const inputStyle: React.CSSProperties = {
    height: '22px',
    textAlign: 'center',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    fontSize: '11px',
    fontWeight: 700,
    outline: 'none',
    padding: 0,
  };

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    border: '1px solid var(--border-card)',
    borderRadius: '4px',
    overflow: 'hidden',
    background: 'var(--bg-secondary)',
  };

  return (
    <>
      {/* Font Ailesi (Font Family) */}
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

      {/* Punto Değeri (Sayısal Giriş + Stepper) */}
      <div style={containerStyle} title="Punto Değeri (Doğrudan yazabilir veya +/- kullanabilirsiniz)">
        <button
          type="button"
          onClick={() => {
            const next = Math.max(8, (parseInt(fontSize, 10) || 16) - 1);
            setFontSize(String(next));
            editor.chain().focus().setFontSize(`${next}px`).run();
          }}
          style={btnStyle}
        >
          <Minus size={10} />
        </button>
        <input
          type="number"
          min={8}
          max={72}
          value={fontSize}
          onChange={(e) => {
            const val = e.target.value;
            setFontSize(val);
            if (val && parseInt(val, 10) >= 8) {
              editor.chain().focus().setFontSize(`${val}px`).run();
            }
          }}
          style={{ ...inputStyle, width: '30px' }}
        />
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', paddingRight: '2px' }}>pt</span>
        <button
          type="button"
          onClick={() => {
            const next = Math.min(72, (parseInt(fontSize, 10) || 16) + 1);
            setFontSize(String(next));
            editor.chain().focus().setFontSize(`${next}px`).run();
          }}
          style={btnStyle}
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Satır Aralığı (Sayısal Giriş + Stepper) */}
      <div style={containerStyle} title="Satır Aralığı (Line Height)">
        <button
          type="button"
          onClick={() => {
            const cur = parseFloat(lineHeight) || 1.5;
            const next = Math.max(0.8, cur - 0.1).toFixed(1);
            setLineHeight(next);
            editor.chain().focus().setLineHeight(next).run();
          }}
          style={btnStyle}
        >
          <Minus size={10} />
        </button>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', padding: '0 2px' }}>Satır</span>
        <input
          type="number"
          step="0.1"
          min="0.8"
          max="3.0"
          value={lineHeight}
          onChange={(e) => {
            const val = e.target.value;
            setLineHeight(val);
            if (val) editor.chain().focus().setLineHeight(val).run();
          }}
          style={{ ...inputStyle, width: '28px' }}
        />
        <button
          type="button"
          onClick={() => {
            const cur = parseFloat(lineHeight) || 1.5;
            const next = Math.min(3.0, cur + 0.1).toFixed(1);
            setLineHeight(next);
            editor.chain().focus().setLineHeight(next).run();
          }}
          style={btnStyle}
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Paragraf Boşluğu (Sayısal Giriş + Stepper) */}
      <div style={containerStyle} title="Paragraf Alt Boşluğu (px)">
        <button
          type="button"
          onClick={() => {
            const cur = parseInt(paragraphSpacing, 10) || 14;
            const next = String(Math.max(0, cur - 2));
            setParagraphSpacing(next);
            editor.chain().focus().setParagraphSpacing(`${next}px`).run();
          }}
          style={btnStyle}
        >
          <Minus size={10} />
        </button>
        <span style={{ fontSize: '9px', color: 'var(--text-muted)', padding: '0 2px' }}>Par</span>
        <input
          type="number"
          min="0"
          max="48"
          value={paragraphSpacing}
          onChange={(e) => {
            const val = e.target.value;
            setParagraphSpacing(val);
            if (val) editor.chain().focus().setParagraphSpacing(`${val}px`).run();
          }}
          style={{ ...inputStyle, width: '26px' }}
        />
        <button
          type="button"
          onClick={() => {
            const cur = parseInt(paragraphSpacing, 10) || 14;
            const next = String(Math.min(48, cur + 2));
            setParagraphSpacing(next);
            editor.chain().focus().setParagraphSpacing(`${next}px`).run();
          }}
          style={btnStyle}
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Girinti Azalt / Artır */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setIndent(-1).run()}
        style={{ ...btnStyle, width: '24px', height: '24px' }}
        title="Girintiyi Azalt"
      >
        <Outdent size={13} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setIndent(1).run()}
        style={{ ...btnStyle, width: '24px', height: '24px' }}
        title="Girintiyi Artır"
      >
        <Indent size={13} />
      </button>
    </>
  );
};
