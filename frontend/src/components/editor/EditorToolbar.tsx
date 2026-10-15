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
  Quote,
  Minus,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Undo2,
  Redo2,
  RemoveFormatting,
  Palette,
  Highlighter,
} from 'lucide-react';
import { TableModal } from './TableModal';
import { ImageModal } from './ImageModal';
import { LinkModal } from './LinkModal';

interface EditorToolbarProps {
  editor: Editor | null;
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  if (!editor) return null;

  const btnStyle = (active: boolean): React.CSSProperties => ({
    padding: '4px 6px',
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
    <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 3px' }} />
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
          padding: '6px 8px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-card)',
          borderTopLeftRadius: 'var(--radius-md, 6px)',
          borderTopRightRadius: 'var(--radius-md, 6px)',
        }}
      >
        {/* 1. Geçmiş (Undo / Redo) */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Geri Al (Ctrl+Z)"
          style={{ ...btnStyle(false), opacity: editor.can().undo() ? 1 : 0.35 }}
        >
          <Undo2 size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="İleri Al (Ctrl+Y)"
          style={{ ...btnStyle(false), opacity: editor.can().redo() ? 1 : 0.35 }}
        >
          <Redo2 size={14} />
        </button>

        {divider}

        {/* 2. Paragraf / Başlık Formatı */}
        <select
          value={
            editor.isActive('heading', { level: 1 })
              ? 'h1'
              : editor.isActive('heading', { level: 2 })
              ? 'h2'
              : editor.isActive('heading', { level: 3 })
              ? 'h3'
              : editor.isActive('heading', { level: 4 })
              ? 'h4'
              : 'p'
          }
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') editor.chain().focus().setParagraph().run();
            else if (val === 'h1') editor.chain().focus().toggleHeading({ level: 1 }).run();
            else if (val === 'h2') editor.chain().focus().toggleHeading({ level: 2 }).run();
            else if (val === 'h3') editor.chain().focus().toggleHeading({ level: 3 }).run();
            else if (val === 'h4') editor.chain().focus().toggleHeading({ level: 4 }).run();
          }}
          className="admin-filter-select"
          style={{ height: '26px', fontSize: '11px', padding: '0 18px 0 6px', fontWeight: 600 }}
        >
          <option value="p">Normal Metin</option>
          <option value="h1">Başlık 1 (H1)</option>
          <option value="h2">Başlık 2 (H2)</option>
          <option value="h3">Başlık 3 (H3)</option>
          <option value="h4">Başlık 4 (H4)</option>
        </select>

        {/* 3. Yazı Boyutu (Punto) */}
        <select
          onChange={(e) => {
            const size = e.target.value;
            if (size === 'default') editor.chain().focus().unsetFontSize().run();
            else editor.chain().focus().setFontSize(size).run();
          }}
          className="admin-filter-select"
          style={{ height: '26px', fontSize: '11px', padding: '0 18px 0 6px' }}
          title="Yazı Boyutu"
        >
          <option value="default">Punto (Oto)</option>
          {FONT_SIZES.map((sz) => (
            <option key={sz} value={sz}>
              {sz}
            </option>
          ))}
        </select>

        {divider}

        {/* 4. Karakter Stilleri */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Kalın (Ctrl+B)"
          style={btnStyle(editor.isActive('bold'))}
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="İtalik (Ctrl+I)"
          style={btnStyle(editor.isActive('italic'))}
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Altı Çizgili (Ctrl+U)"
          style={btnStyle(editor.isActive('underline'))}
        >
          <UnderlineIcon size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Üstü Çizili"
          style={btnStyle(editor.isActive('strike'))}
        >
          <Strikethrough size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          title="Alt Simge (X₂)"
          style={btnStyle(editor.isActive('subscript'))}
        >
          <SubscriptIcon size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          title="Üst Simge (X²)"
          style={btnStyle(editor.isActive('superscript'))}
        >
          <SuperscriptIcon size={14} />
        </button>

        {divider}

        {/* 5. Yazı & Zemin Rengi */}
        <label
          title="Yazı Rengi"
          style={{
            ...btnStyle(false),
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <Palette size={14} color="var(--accent-primary)" />
          <input
            type="color"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            style={{
              position: 'absolute',
              opacity: 0,
              width: 0,
              height: 0,
              pointerEvents: 'none',
            }}
          />
        </label>

        <label
          title="Metin Vurgu / Zemin Rengi (Highlight)"
          style={{
            ...btnStyle(editor.isActive('highlight')),
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          <Highlighter size={14} color="var(--accent-amber, #f59e0b)" />
          <input
            type="color"
            onChange={(e) => editor.chain().focus().toggleHighlight({ color: e.target.value }).run()}
            style={{
              position: 'absolute',
              opacity: 0,
              width: 0,
              height: 0,
              pointerEvents: 'none',
            }}
          />
        </label>

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Biçimlendirmeyi Temizle (Silgi)"
          style={btnStyle(false)}
        >
          <RemoveFormatting size={14} />
        </button>

        {divider}

        {/* 6. Hizalama */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Sola Yasla"
          style={btnStyle(editor.isActive({ textAlign: 'left' }))}
        >
          <AlignLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Ortala"
          style={btnStyle(editor.isActive({ textAlign: 'center' }))}
        >
          <AlignCenter size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Sağa Yasla"
          style={btnStyle(editor.isActive({ textAlign: 'right' }))}
        >
          <AlignRight size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="İki Yana Yasla"
          style={btnStyle(editor.isActive({ textAlign: 'justify' }))}
        >
          <AlignJustify size={14} />
        </button>

        {divider}

        {/* 7. Listeler & Bloklar */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Madde İşaretli Liste"
          style={btnStyle(editor.isActive('bulletList'))}
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numaralı Liste"
          style={btnStyle(editor.isActive('orderedList'))}
        >
          <ListOrdered size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Alıntı Bloğu"
          style={btnStyle(editor.isActive('blockquote'))}
        >
          <Quote size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Yatay Ayırıcı Çizgi"
          style={btnStyle(false)}
        >
          <Minus size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          title="Kod Bloğu"
          style={btnStyle(editor.isActive('codeBlock'))}
        >
          <Code size={14} />
        </button>

        {divider}

        {/* 8. Bağlantı, Resim & Tablo Ekleme */}
        <button
          type="button"
          onClick={() => setIsLinkModalOpen(true)}
          title="Bağlantı (Link) Ekle"
          style={btnStyle(editor.isActive('link'))}
        >
          <LinkIcon size={14} />
        </button>
        <button
          type="button"
          onClick={() => setIsImageModalOpen(true)}
          title="Görsel & Metin Kaydırma Ekle"
          style={btnStyle(editor.isActive('customImage'))}
        >
          <ImageIcon size={14} />
        </button>
        <button
          type="button"
          onClick={() => setIsTableModalOpen(true)}
          title="Tablo Stüdyosu (Ekle / Düzenle / Birleştir)"
          style={btnStyle(editor.isActive('table'))}
        >
          <TableIcon size={14} />
        </button>
      </div>

      {/* İlgili Modallar */}
      <TableModal
        editor={editor}
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />
      <ImageModal
        editor={editor}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
      <LinkModal
        editor={editor}
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </>
  );
};
