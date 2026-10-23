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

const FONT_SIZE_PRESETS = ['9', '10', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '48', '72'];
const LINE_HEIGHT_PRESETS = ['1.0', '1.15', '1.25', '1.5', '1.75', '2.0', '2.5'];
const PARAGRAPH_SPACING_PRESETS = ['0', '4', '8', '12', '14', '18', '24', '32'];

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

  const selectStyle: React.CSSProperties = {
    height: '22px',
    fontSize: '10px',
    background: 'transparent',
    color: 'var(--text-muted)',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    padding: '0 2px',
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

      {/* Punto Değeri (Word Tipi Combobox: Açılır Liste + Doğrudan Değer Girişi + Stepper) */}
      <div style={containerStyle} title="Punto Değeri (Seçebilir veya doğrudan yazabilirsiniz)">
        <button
          type="button"
          onClick={() => {
            const next = Math.max(8, (parseInt(fontSize, 10) || 16) - 1);
            setFontSize(String(next));
            editor.chain().focus().setFontSize(`${next}px`).run();
          }}
          style={btnStyle}
          title="Puntoyu 1 pt küçült"
        >
          <Minus size={10} />
        </button>
        <input
          type="number"
          min={8}
          max={96}
          value={fontSize}
          onChange={(e) => {
            const val = e.target.value;
            setFontSize(val);
            if (val && parseInt(val, 10) >= 8) {
              editor.chain().focus().setFontSize(`${val}px`).run();
            }
          }}
          style={{ ...inputStyle, width: '28px' }}
        />
        {/* Hızlı Açılır Punto Seçici */}
        <select
          value={fontSize}
          onChange={(e) => {
            const val = e.target.value;
            setFontSize(val);
            editor.chain().focus().setFontSize(`${val}px`).run();
          }}
          style={selectStyle}
          title="Hazır punto listesi"
        >
          {FONT_SIZE_PRESETS.map((p) => (
            <option key={p} value={p}>
              {p} pt
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            const next = Math.min(96, (parseInt(fontSize, 10) || 16) + 1);
            setFontSize(String(next));
            editor.chain().focus().setFontSize(`${next}px`).run();
          }}
          style={btnStyle}
          title="Puntoyu 1 pt büyüt"
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Satır Aralığı (Word Tipi Combobox: Açılır Liste + Doğrudan Değer Girişi + Stepper) */}
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
        <input
          type="number"
          step="0.05"
          min="0.8"
          max="3.5"
          value={lineHeight}
          onChange={(e) => {
            const val = e.target.value;
            setLineHeight(val);
            if (val) editor.chain().focus().setLineHeight(val).run();
          }}
          style={{ ...inputStyle, width: '28px' }}
        />
        {/* Hızlı Açılır Satır Aralığı Seçici */}
        <select
          value={lineHeight}
          onChange={(e) => {
            const val = e.target.value;
            setLineHeight(val);
            editor.chain().focus().setLineHeight(val).run();
          }}
          style={selectStyle}
          title="Hazır satır aralığı listesi"
        >
          {LINE_HEIGHT_PRESETS.map((lh) => (
            <option key={lh} value={lh}>
              {lh}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            const cur = parseFloat(lineHeight) || 1.5;
            const next = Math.min(3.5, cur + 0.1).toFixed(1);
            setLineHeight(next);
            editor.chain().focus().setLineHeight(next).run();
          }}
          style={btnStyle}
        >
          <Plus size={10} />
        </button>
      </div>

      {/* Paragraf Boşluğu (Word Tipi Combobox: Açılır Liste + Doğrudan Değer Girişi + Stepper) */}
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
        <input
          type="number"
          min="0"
          max="64"
          value={paragraphSpacing}
          onChange={(e) => {
            const val = e.target.value;
            setParagraphSpacing(val);
            if (val) editor.chain().focus().setParagraphSpacing(`${val}px`).run();
          }}
          style={{ ...inputStyle, width: '24px' }}
        />
        {/* Hızlı Açılır Paragraf Boşluğu Seçici */}
        <select
          value={paragraphSpacing}
          onChange={(e) => {
            const val = e.target.value;
            setParagraphSpacing(val);
            editor.chain().focus().setParagraphSpacing(`${val}px`).run();
          }}
          style={selectStyle}
          title="Hazır paragraf boşluğu listesi"
        >
          {PARAGRAPH_SPACING_PRESETS.map((ps) => (
            <option key={ps} value={ps}>
              {ps}px
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => {
            const cur = parseInt(paragraphSpacing, 10) || 14;
            const next = String(Math.min(64, cur + 2));
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
