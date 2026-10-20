import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import {
  Bold, Italic, Underline as UnderlineIcon,
  Heading3, Heading4, List, ListOrdered,
  Link as LinkIcon, RemoveFormatting
} from 'lucide-react';

interface AppStudioTipTapEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  dir?: 'ltr' | 'rtl';
}

export const AppStudioTipTapEditor: React.FC<AppStudioTipTapEditorProps> = ({
  value,
  onChange,
  placeholder,
  dir = 'ltr',
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [3, 4] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor: activeEditor }) => {
      onChange(activeEditor.getHTML());
    },
  });

  // Dışarıdan gelen değer değiştiğinde içeriği güncelle
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const handleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Bağlantı URL adresi:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '' || url === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div
      className="app-studio-tiptap-wrapper"
      dir={dir}
      style={{
        border: '1px solid var(--border-color, #cbd5e1)',
        borderRadius: '8px',
        overflow: 'hidden',
        background: 'var(--bg-surface, #ffffff)',
      }}
    >
      {/* 1. Görsel Araç Çubuğu (WYSIWYG Toolbar) */}
      <div
        className="app-studio-tiptap-toolbar"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 8px',
          background: 'rgba(0, 0, 0, 0.04)',
          borderBottom: '1px solid var(--border-color, #cbd5e1)',
        }}
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`studio-tool-btn ${editor.isActive('bold') ? 'active' : ''}`}
          title="Kalın"
          style={btnStyle(editor.isActive('bold'))}
        >
          <Bold size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`studio-tool-btn ${editor.isActive('italic') ? 'active' : ''}`}
          title="İtalik"
          style={btnStyle(editor.isActive('italic'))}
        >
          <Italic size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`studio-tool-btn ${editor.isActive('underline') ? 'active' : ''}`}
          title="Altı Çizili"
          style={btnStyle(editor.isActive('underline'))}
        >
          <UnderlineIcon size={14} />
        </button>

        <span style={{ width: '1px', height: '18px', background: 'var(--border-color, #cbd5e1)', margin: '0 4px' }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`studio-tool-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
          title="Başlık 3"
          style={btnStyle(editor.isActive('heading', { level: 3 }))}
        >
          <Heading3 size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={`studio-tool-btn ${editor.isActive('heading', { level: 4 }) ? 'active' : ''}`}
          title="Başlık 4 (Alt Başlık)"
          style={btnStyle(editor.isActive('heading', { level: 4 }))}
        >
          <Heading4 size={14} />
        </button>

        <span style={{ width: '1px', height: '18px', background: 'var(--border-color, #cbd5e1)', margin: '0 4px' }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`studio-tool-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
          title="Madde İmleri"
          style={btnStyle(editor.isActive('bulletList'))}
        >
          <List size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`studio-tool-btn ${editor.isActive('orderedList') ? 'active' : ''}`}
          title="Numaralı Liste"
          style={btnStyle(editor.isActive('orderedList'))}
        >
          <ListOrdered size={14} />
        </button>

        <button
          type="button"
          onClick={handleLink}
          className={`studio-tool-btn ${editor.isActive('link') ? 'active' : ''}`}
          title="Bağlantı Ekle / Düzenle"
          style={btnStyle(editor.isActive('link'))}
        >
          <LinkIcon size={14} />
        </button>

        <span style={{ width: '1px', height: '18px', background: 'var(--border-color, #cbd5e1)', margin: '0 4px' }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="studio-tool-btn"
          title="Biçimlendirmeyi Temizle"
          style={btnStyle(false)}
        >
          <RemoveFormatting size={14} />
        </button>
      </div>

      {/* 2. WYSIWYG Canlı İçerik Tuvali */}
      <div
        className="app-studio-tiptap-content"
        style={{
          minHeight: '140px',
          maxHeight: '280px',
          overflowY: 'auto',
          padding: '10px 14px',
          fontSize: '0.90rem',
          lineHeight: 1.6,
          cursor: 'text',
          color: 'var(--text-main, inherit)',
        }}
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>
    </div>
  );
};

function btnStyle(isActive: boolean): React.CSSProperties {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '26px',
    height: '26px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    background: isActive ? 'var(--accent-primary, #3b82f6)' : 'transparent',
    color: isActive ? '#ffffff' : 'inherit',
    transition: 'background 0.15s ease, color 0.15s ease',
  };
}
