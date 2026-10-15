import React, { useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Palette,
  Highlighter,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  Indent,
  Outdent,
} from 'lucide-react';
import { TableDropdown } from './TableDropdown';
import { ImageDropdown } from './ImageDropdown';
import { LinkModal } from './LinkModal';

interface EditorToolbarProps {
  editor: Editor | null;
  onOpenFloatingTable?: () => void;
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
const LINE_HEIGHTS = [
  { label: '1.0 (Sıkı)', value: '1.0' },
  { label: '1.15 (Standart)', value: '1.15' },
  { label: '1.5 (Geniş)', value: '1.5' },
  { label: '2.0 (Çift)', value: '2.0' },
];
const PARAGRAPH_SPACINGS = [
  { label: '0px (Bitişik)', value: '0px' },
  { label: '8px (Hafif)', value: '8px' },
  { label: '14px (Standart)', value: '14px' },
  { label: '20px (Geniş)', value: '20px' },
];

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onOpenFloatingTable = () => {},
}) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  if (!editor) return null;

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '3px 5px',
    border: 'none',
    borderRadius: '4px',
    background: active ? 'var(--accent-primary)' : 'transparent',
    color: active ? '#FFFFFF' : 'var(--text-primary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '26px',
    height: '26px',
    transition: 'background 0.15s ease',
  });

  const divider = (
    <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 2px' }} />
  );

  return (
    <>
      <div
        className="editor-ribbon-toolbar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '3px',
          padding: '6px 10px',
          background: 'var(--bg-card, #1F2937)',
          borderBottom: '1px solid var(--border-subtle)',
          userSelect: 'none',
        }}
      >
        {/* Başlık / Paragraf Seçimi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            style={btnStyle(editor.isActive('paragraph'))}
            title="Normal Paragraf"
          >
            <Pilcrow size={13} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            style={btnStyle(editor.isActive('heading', { level: 1 }))}
            title="Başlık 1"
          >
            <Heading1 size={13} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            style={btnStyle(editor.isActive('heading', { level: 2 }))}
            title="Başlık 2"
          >
            <Heading2 size={13} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            style={btnStyle(editor.isActive('heading', { level: 3 }))}
            title="Başlık 3"
          >
            <Heading3 size={13} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            style={btnStyle(editor.isActive('heading', { level: 4 }))}
            title="Başlık 4"
          >
            <Heading4 size={13} />
          </button>
        </div>

        {divider}

        {/* Punto / Yazı Boyutu Seçici */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val) editor.chain().focus().setFontSize(val).run();
            else editor.chain().focus().unsetFontSize().run();
          }}
          className="admin-filter-select"
          style={{ height: '26px', fontSize: '11px', width: '70px', padding: '0 4px' }}
          title="Yazı Boyutu (Punto)"
          defaultValue="16px"
        >
          <option value="">Punto</option>
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {/* Satır Yüksekliği (Line Height) */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val) editor.chain().focus().setLineHeight(val).run();
            else editor.chain().focus().unsetLineHeight().run();
          }}
          className="admin-filter-select"
          style={{ height: '26px', fontSize: '11px', width: '84px', padding: '0 4px' }}
          title="Satır Aralığı (Line Height)"
          defaultValue="1.5"
        >
          <option value="">Satır Aralığı</option>
          {LINE_HEIGHTS.map((lh) => (
            <option key={lh.value} value={lh.value}>
              {lh.label}
            </option>
          ))}
        </select>

        {/* Paragraf Boşluğu (Margin Bottom) */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val) editor.chain().focus().setParagraphSpacing(val).run();
          }}
          className="admin-filter-select"
          style={{ height: '26px', fontSize: '11px', width: '92px', padding: '0 4px' }}
          title="Paragraf Altı Boşluğu"
          defaultValue="14px"
        >
          <option value="">Paragraf Arası</option>
          {PARAGRAPH_SPACINGS.map((ps) => (
            <option key={ps.value} value={ps.value}>
              {ps.label}
            </option>
          ))}
        </select>

        {/* Girinti Azalt / Artır */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setIndent(-1).run()}
          style={btnStyle(false)}
          title="Girintiyi Azalt"
        >
          <Outdent size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setIndent(1).run()}
          style={btnStyle(false)}
          title="Girintiyi Artır"
        >
          <Indent size={13} />
        </button>

        {divider}

        {/* Karakter Biçimlendirme */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={btnStyle(editor.isActive('bold'))}
          title="Kalın (Ctrl+B)"
        >
          <Bold size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={btnStyle(editor.isActive('italic'))}
          title="İtalik (Ctrl+I)"
        >
          <Italic size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          style={btnStyle(editor.isActive('underline'))}
          title="Altı Çizgili (Ctrl+U)"
        >
          <UnderlineIcon size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          style={btnStyle(editor.isActive('strike'))}
          title="Üstü Çizgili"
        >
          <Strikethrough size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          style={btnStyle(editor.isActive('subscript'))}
          title="Alt Simge (X₂)"
        >
          <SubscriptIcon size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          style={btnStyle(editor.isActive('superscript'))}
          title="Üst Simge (X²)"
        >
          <SuperscriptIcon size={13} />
        </button>

        {divider}

        {/* Renk Seçiciler */}
        <label
          style={{ ...btnStyle(false), cursor: 'pointer', position: 'relative' }}
          title="Yazı Rengi"
        >
          <Palette size={13} />
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          />
        </label>
        <label
          style={{ ...btnStyle(false), cursor: 'pointer', position: 'relative' }}
          title="Zemin Vurgusu (Highlighter)"
        >
          <Highlighter size={13} />
          <input
            type="color"
            defaultValue="#FEF08A"
            onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
            style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
          />
        </label>

        {divider}

        {/* Hizalama */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          style={btnStyle(editor.isActive({ textAlign: 'left' }))}
          title="Sola Yasla"
        >
          <AlignLeft size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          style={btnStyle(editor.isActive({ textAlign: 'center' }))}
          title="Ortala"
        >
          <AlignCenter size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          style={btnStyle(editor.isActive({ textAlign: 'right' }))}
          title="Sağa Yasla"
        >
          <AlignRight size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          style={btnStyle(editor.isActive({ textAlign: 'justify' }))}
          title="İki Yana Yasla"
        >
          <AlignJustify size={13} />
        </button>

        {divider}

        {/* Listeler */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={btnStyle(editor.isActive('bulletList'))}
          title="Madde İşaretli Liste"
        >
          <List size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={btnStyle(editor.isActive('orderedList'))}
          title="Numaralı Liste"
        >
          <ListOrdered size={13} />
        </button>

        {divider}

        {/* Bağlantı (Link) */}
        <button
          type="button"
          onClick={() => setIsLinkModalOpen(true)}
          style={btnStyle(editor.isActive('link'))}
          title="Bağlantı Ekle / Düzenle"
        >
          <LinkIcon size={13} />
        </button>

        {/* Açılır Menülü Tablo Aracı */}
        <TableDropdown editor={editor} onOpenFloating={onOpenFloatingTable} />

        {/* Açılır Menülü Görsel Aracı */}
        <ImageDropdown editor={editor} />
      </div>

      <LinkModal
        editor={editor}
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </>
  );
};
