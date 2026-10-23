import React from 'react';
import type { Editor } from '@tiptap/react';
import { Indent, Outdent } from 'lucide-react';
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
const PARAGRAPH_SPACING_PRESETS = ['0', '4', '6', '8', '12', '14', '18', '24', '32'];

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

      {/* Punto Büyüklüğü (Tek Birleşik Combobox + Tek Taraf Spinbox) */}
      <WordCombobox
        value={fontSize}
        onChange={(val) => {
          setFontSize(val);
          if (val && !isNaN(Number(val))) {
            editor.chain().focus().setFontSize(`${val}px`).run();
          }
        }}
        presets={FONT_SIZE_PRESETS}
        unit="pt"
        title="Punto Büyüklüğü (Değer girebilir, listeden seçebilir veya oktan artırabilirsiniz)"
        min={6}
        max={96}
        step={1}
        inputWidth="24px"
      />

      {/* Satır Aralığı (Tek Birleşik Combobox + Tek Taraf Spinbox) */}
      <WordCombobox
        value={lineHeight}
        onChange={(val) => {
          setLineHeight(val);
          if (val) {
            editor.chain().focus().setLineHeight(val).run();
          }
        }}
        presets={LINE_HEIGHT_PRESETS}
        unit="x"
        title="Satır Aralığı (Değer girebilir, listeden seçebilir veya oktan artırabilirsiniz)"
        min={0.8}
        max={3.5}
        step={0.1}
        inputWidth="24px"
      />

      {/* Paragraf Boşluğu (Tek Birleşik Combobox + Tek Taraf Spinbox) */}
      <WordCombobox
        value={paragraphSpacing}
        onChange={(val) => {
          setParagraphSpacing(val);
          if (val && !isNaN(Number(val))) {
            editor.chain().focus().setParagraphSpacing(`${val}px`).run();
          }
        }}
        presets={PARAGRAPH_SPACING_PRESETS}
        unit="px"
        title="Paragraf Alt Boşluğu (Değer girebilir, listeden seçebilir veya oktan artırabilirsiniz)"
        min={0}
        max={64}
        step={2}
        inputWidth="22px"
      />

      {/* Girinti Azalt / Artır */}
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
