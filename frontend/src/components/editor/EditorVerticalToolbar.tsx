import React, { useState } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Scissors,
  Copy,
  Clipboard,
  CopyPlus,
  Undo2,
  Redo2,
  RemoveFormatting,
  Quote,
  Code,
  Minus,
  Table as TableIcon,
} from 'lucide-react';

interface EditorVerticalToolbarProps {
  editor: Editor | null;
  onToggleFloatingTable: () => void;
}

export const EditorVerticalToolbar: React.FC<EditorVerticalToolbarProps> = ({
  editor,
  onToggleFloatingTable,
}) => {
  const [notification, setNotification] = useState<string | null>(null);

  if (!editor) return null;

  const showNote = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleCut = async () => {
    const { from, to } = editor.state.selection;
    if (from === to) {
      showNote('Önce metin seçin');
      return;
    }
    const text = editor.state.doc.textBetween(from, to);
    try {
      await navigator.clipboard.writeText(text);
      editor.commands.deleteSelection();
      showNote('Kesildi');
    } catch {
      showNote('Ctrl + X kullanın');
    }
  };

  const handleCopy = async () => {
    const { from, to } = editor.state.selection;
    if (from === to) {
      showNote('Önce metin seçin');
      return;
    }
    const text = editor.state.doc.textBetween(from, to);
    try {
      await navigator.clipboard.writeText(text);
      showNote('Kopyalandı');
    } catch {
      showNote('Ctrl + C kullanın');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        editor.commands.insertContent(text);
        showNote('Yapıştırıldı');
      }
    } catch {
      showNote('Pano için Ctrl + V kullanın');
    }
  };

  const handleDuplicate = () => {
    const success = editor.commands.duplicateNode();
    if (success) {
      showNote('Blok Çoğaltıldı');
    } else {
      showNote('Çoğaltılacak blok bulunamadı');
    }
  };

  const btnStyle = (active: boolean = false): React.CSSProperties => ({
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: 'none',
    background: active ? 'var(--accent-primary)' : 'transparent',
    color: active ? '#FFFFFF' : 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s, color 0.15s',
  });

  const divider = (
    <div style={{ width: '20px', height: '1px', background: 'var(--border-subtle)', margin: '4px auto' }} />
  );

  return (
    <aside
      aria-label="Hızlı Araç Çubuğu"
      style={{
        width: '42px',
        background: 'var(--bg-card, #1F2937)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px 0',
        gap: '2px',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Pano Araçları */}
      <button type="button" onClick={handleCut} style={btnStyle()} title="Kes (Ctrl+X)">
        <Scissors size={15} />
      </button>
      <button type="button" onClick={handleCopy} style={btnStyle()} title="Kopyala (Ctrl+C)">
        <Copy size={15} />
      </button>
      <button type="button" onClick={handlePaste} style={btnStyle()} title="Yapıştır (Ctrl+V)">
        <Clipboard size={15} />
      </button>
      <button type="button" onClick={handleDuplicate} style={btnStyle()} title="Seçili Bloğu Çoğalt (Duplicate)">
        <CopyPlus size={15} />
      </button>

      {divider}

      {/* Belge İşlemleri */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        style={{ ...btnStyle(), opacity: editor.can().undo() ? 1 : 0.4 }}
        title="Geri Al (Ctrl+Z)"
      >
        <Undo2 size={15} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        style={{ ...btnStyle(), opacity: editor.can().redo() ? 1 : 0.4 }}
        title="İleri Al (Ctrl+Y)"
      >
        <Redo2 size={15} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        style={btnStyle()}
        title="Biçimlendirmeyi Temizle"
      >
        <RemoveFormatting size={15} />
      </button>

      {divider}

      {/* Hızlı Blok Ekleme */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        style={btnStyle(editor.isActive('blockquote'))}
        title="Alıntı Bloğu"
      >
        <Quote size={15} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        style={btnStyle(editor.isActive('codeBlock'))}
        title="Kod Bloğu"
      >
        <Code size={15} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        style={btnStyle()}
        title="Yatay Çizgi Ekle"
      >
        <Minus size={15} />
      </button>
      <button
        type="button"
        onClick={onToggleFloatingTable}
        style={btnStyle(editor.isActive('table'))}
        title="Canlı Tablo Paletini Aç/Kapat"
      >
        <TableIcon size={15} />
      </button>

      {/* Canlı Bildirim Baloncuğu */}
      {notification && (
        <div
          style={{
            position: 'absolute',
            left: '48px',
            top: '40px',
            background: 'var(--accent-primary, #6366F1)',
            color: '#FFFFFF',
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        >
          {notification}
        </div>
      )}
    </aside>
  );
};
