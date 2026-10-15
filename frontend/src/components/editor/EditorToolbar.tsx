import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { TableDropdown } from './TableDropdown';
import { ImageDropdown } from './ImageDropdown';
import { LinkModal } from './LinkModal';
import { EditorTypographyControls } from './EditorTypographyControls';

interface EditorToolbarProps {
  editor: Editor | null;
  onOpenFloatingTable?: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onOpenFloatingTable = () => {},
}) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState<string>('16');
  const [fontFamily, setFontFamily] = useState<string>('');
  const [lineHeight, setLineHeight] = useState<string>('1.5');
  const [paragraphSpacing, setParagraphSpacing] = useState<string>('14');

  // Canlı Durum Yansıtma (Seçim değiştikçe aktif nitelikleri araçlara aktar)
  useEffect(() => {
    if (!editor) return;

    const updateActiveAttrs = () => {
      // Font Size
      const curFontSize = editor.getAttributes('textStyle').fontSize;
      if (curFontSize) {
        setFontSize(curFontSize.replace('px', ''));
      }

      // Font Family
      const curFontFamily = editor.getAttributes('textStyle').fontFamily;
      setFontFamily(curFontFamily || '');

      // Line Height
      const curLh = editor.getAttributes('paragraph').lineHeight || editor.getAttributes('heading').lineHeight;
      if (curLh) {
        setLineHeight(curLh);
      }

      // Paragraph Spacing
      const curMb = editor.getAttributes('paragraph').marginBottom || editor.getAttributes('heading').marginBottom;
      if (curMb) {
        setParagraphSpacing(curMb.replace('px', ''));
      }
    };

    editor.on('selectionUpdate', updateActiveAttrs);
    editor.on('transaction', updateActiveAttrs);
    return () => {
      editor.off('selectionUpdate', updateActiveAttrs);
      editor.off('transaction', updateActiveAttrs);
    };
  }, [editor]);

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
    minWidth: '24px',
    height: '24px',
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

        <EditorTypographyControls
          editor={editor}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          lineHeight={lineHeight}
          setLineHeight={setLineHeight}
          paragraphSpacing={paragraphSpacing}
          setParagraphSpacing={setParagraphSpacing}
        />

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
