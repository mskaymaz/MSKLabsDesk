import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { TextStyle, FontFamily } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TableRow from '@tiptap/extension-table-row';
import Link from '@tiptap/extension-link';
import { Eye, Edit3, Clock, Type, AlignLeft } from 'lucide-react';
import {
  FontSize,
  LineHeight,
  ParagraphSpacing,
  DuplicateSelection,
  CustomImage,
  CustomTable,
  CustomTableCell,
  CustomTableHeader,
} from '../editor/customExtensions';
import { EditorToolbar } from '../editor/EditorToolbar';
import { FloatingTableInspector } from '../editor/FloatingTableInspector';

export interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
  dir?: 'ltr' | 'rtl';
  editorRef?: React.MutableRefObject<any>;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  dir = 'ltr',
  editorRef,
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [isFloatingTableOpen, setIsFloatingTableOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Subscript,
      Superscript,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CustomTable.configure({
        resizable: true,
      }),
      TableRow,
      CustomTableHeader,
      CustomTableCell,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      FontSize,
      LineHeight,
      ParagraphSpacing,
      DuplicateSelection,
      CustomImage,
    ],
    content: value || '',
    onUpdate: ({ editor: activeEditor }) => {
      const html = activeEditor.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (editorRef) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  const sanitizeHTML = (html: string) => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, 'blocked:')
      .replace(/on\w+="[^"]*"/gi, '');
  };

  const textContent = editor?.state.doc.textContent || '';
  const wordCount = textContent.trim().length > 0 ? textContent.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = textContent.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div style={{ marginBottom: 'var(--space-3, 12px)' }}>
      {/* Üst Başlık ve Önizleme Geçiş Butonu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        {label && (
          <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          className="admin-btn admin-btn-secondary"
          style={{
            padding: '3px 10px',
            fontSize: '12px',
            height: '28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          {isPreview ? <Edit3 size={13} /> : <Eye size={13} />}
          <span>{isPreview ? 'Editör Modu' : 'Önizleme'}</span>
        </button>
      </div>

      {/* Editör / Önizleme Kapsayıcısı */}
      <div className={`rich-editor-wrapper ${error ? 'has-error' : ''}`} dir={dir}>
        {!isPreview && (
          <EditorToolbar
            editor={editor}
            onOpenFloatingTable={() => setIsFloatingTableOpen(true)}
          />
        )}

        {isPreview ? (
          <div
            className="rich-editor-content-area tiptap-content"
            style={{ minHeight: '340px' }}
            dangerouslySetInnerHTML={{
              __html: sanitizeHTML(
                value || '<p style="color:var(--text-muted); font-style:italic;">(İçerik henüz girilmedi...)</p>'
              ),
            }}
          />
        ) : (
          <div
            className="rich-editor-content-area"
            onClick={() => editor?.commands.focus()}
            style={{ minHeight: '340px' }}
          >
            <EditorContent editor={editor} placeholder={placeholder} />
          </div>
        )}

        {/* Alt Bilgi / İstatistik Çubuğu */}
        <div className="rich-editor-footer">
          <div className="rich-editor-stats">
            <span className="rich-editor-stat-item">
              <Type size={12} />
              <span>Kelime:</span>
              <strong className="rich-editor-stat-value">{wordCount}</strong>
            </span>
            <span className="rich-editor-stat-item">
              <AlignLeft size={12} />
              <span>Karakter:</span>
              <strong className="rich-editor-stat-value">{charCount}</strong>
            </span>
            <span className="rich-editor-stat-item">
              <Clock size={12} />
              <span>Tahmini Okuma:</span>
              <strong className="rich-editor-stat-value">{readingTimeMinutes} dk</strong>
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {isPreview ? 'Önizleme Modu Aktif' : 'WYSIWYG Word Editörü'}
          </span>
        </div>
      </div>

      {/* Sürüklenebilir Canlı Tablo Paleti */}
      <FloatingTableInspector
        editor={editor}
        isOpen={isFloatingTableOpen}
        onClose={() => setIsFloatingTableOpen(false)}
      />

      {error && (
        <span style={{ display: 'block', color: 'var(--danger, #EF4444)', fontSize: '12px', marginTop: '4px' }}>
          {error}
        </span>
      )}
    </div>
  );
};
