import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Link as LinkIcon,
  Palette,
  Highlighter,
} from 'lucide-react';
import { TableDropdown } from './TableDropdown';
import { ImageDropdown } from './ImageDropdown';
import { LinkModal } from './LinkModal';
import { EditorTypographyControls } from './EditorTypographyControls';
import { HeadingStyleDropdown } from './HeadingStyleDropdown';
import { AdvancedCharStyleDropdown } from './AdvancedCharStyleDropdown';
import { CaseAndFormatControls } from './CaseAndFormatControls';
import { SymbolDropdown } from './SymbolDropdown';
import { ComponentDropdown } from './ComponentDropdown';

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
        {/* Geri Al / İleri Al (Undo / Redo) */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          style={{
            ...btnStyle(false),
            opacity: editor.can().undo() ? 1 : 0.4,
            cursor: editor.can().undo() ? 'pointer' : 'not-allowed',
          }}
          title="Geri Al (Ctrl+Z)"
        >
          <Undo size={13} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          style={{
            ...btnStyle(false),
            opacity: editor.can().redo() ? 1 : 0.4,
            cursor: editor.can().redo() ? 'pointer' : 'not-allowed',
          }}
          title="İleri Al (Ctrl+Y)"
        >
          <Redo size={13} />
        </button>

        {divider}

        {/* Word Tipi "Stil" Açılır Menüsü (Normal Metin, Başlık 1-4) */}
        <HeadingStyleDropdown editor={editor} />

        {divider}

        {/* Tipografi Kontrolleri (Font Ailesi, Punto Combobox, Satır Aralığı Combobox, Paragraf Boşluğu, Girinti) */}
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

        {/* Karakter Biçimlendirme (Birincil: B, I, U) */}
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

        {/* İkincil Karakter Biçimleri (Üstü Çizili, Alt Simge, Üst Simge, Kod) */}
        <AdvancedCharStyleDropdown editor={editor} />

        {/* Biçim Boyacısı (Stil Boyama) & Büyük/Küçük Harf Dönüştürücü */}
        <CaseAndFormatControls editor={editor} />

        {/* Word "Simge" (Ω) ve Matematik Simgesi Kataloğu */}
        <SymbolDropdown editor={editor} />

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

        {/* Çoklu Kartlar & SSS Akordeon Bileşen Ekleyici */}
        <ComponentDropdown editor={editor} />

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
