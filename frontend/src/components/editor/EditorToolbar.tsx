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
  Highlighter,
  Ban,
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
  preset?: 'full' | 'inline' | 'compact' | 'email';
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onOpenFloatingTable = () => {},
  preset = 'full',
}) => {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [fontSize, setFontSize] = useState<string>('16');
  const [fontFamily, setFontFamily] = useState<string>('');
  const [lineHeight, setLineHeight] = useState<string>('1.5');
  const [paragraphSpacing, setParagraphSpacing] = useState<string>('14');
  const [activeTextColor, setActiveTextColor] = useState<string>('');
  const [activeHighlightColor, setActiveHighlightColor] = useState<string>('');

  // Canlı Aktif İşaretler & Formatlar (İmleç her hareket ettiğinde UI anında güncellenir)
  const [activeMarks, setActiveMarks] = useState({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: false,
    alignCenter: false,
    alignRight: false,
    alignJustify: false,
    bulletList: false,
    orderedList: false,
    link: false,
    canUndo: false,
    canRedo: false,
  });

  // Canlı Durum Yansıtma (Seçim veya imleç değiştikçe aktif nitelikleri araçlara aktar)
  useEffect(() => {
    if (!editor) return;

    const updateActiveAttrs = () => {
      // 1. Tipografi
      const curFontSize = editor.getAttributes('textStyle').fontSize;
      if (curFontSize) {
        setFontSize(curFontSize.replace('px', ''));
      } else {
        if (editor.isActive('heading', { level: 1 })) setFontSize('32');
        else if (editor.isActive('heading', { level: 2 })) setFontSize('24');
        else if (editor.isActive('heading', { level: 3 })) setFontSize('20');
        else if (editor.isActive('heading', { level: 4 })) setFontSize('18');
        else setFontSize('16');
      }

      const curFontFamily = editor.getAttributes('textStyle').fontFamily;
      setFontFamily(curFontFamily || '');

      const curLh = editor.getAttributes('paragraph').lineHeight || editor.getAttributes('heading').lineHeight;
      setLineHeight(curLh || '1.5');

      const curMb = editor.getAttributes('paragraph').marginBottom || editor.getAttributes('heading').marginBottom;
      setParagraphSpacing(curMb ? curMb.replace('px', '') : '14');

      // 2. Renkler
      const curColor = editor.getAttributes('textStyle').color;
      setActiveTextColor(curColor || '');

      const curHighlight = editor.getAttributes('highlight').color;
      setActiveHighlightColor(curHighlight || '');

      // 3. Buton Aktiflik Durumları
      setActiveMarks({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        alignLeft: editor.isActive({ textAlign: 'left' }),
        alignCenter: editor.isActive({ textAlign: 'center' }),
        alignRight: editor.isActive({ textAlign: 'right' }),
        alignJustify: editor.isActive({ textAlign: 'justify' }),
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        link: editor.isActive('link'),
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
      });
    };

    updateActiveAttrs();
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
    transition: 'background 0.15s ease, color 0.15s ease',
  });

  const divider = (
    <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 2px', flexShrink: 0 }} />
  );

  const colorGroupStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '4px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-subtle)',
  };

  const colorLabelStyle: React.CSSProperties = {
    ...btnStyle(false),
    cursor: 'pointer',
    position: 'relative',
    flexDirection: 'column',
    gap: '1px',
    padding: '2px 4px',
    height: '24px',
  };

  const clearColorBtnStyle = (hasColor: boolean): React.CSSProperties => ({
    padding: '0 3px',
    border: 'none',
    borderLeft: '1px solid var(--border-subtle)',
    background: 'transparent',
    color: hasColor ? '#EF4444' : 'var(--text-muted)',
    cursor: 'pointer',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  return (
    <>
      <div
        className="editor-ribbon-toolbar"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '6px 10px',
          background: 'var(--bg-card, #1F2937)',
          borderBottom: '1px solid var(--border-subtle)',
          userSelect: 'none',
        }}
      >
        {/* 1. ÜST SATIR: Tipografi & Karakter Biçimlendirme & Renkler */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3px' }}>
          {/* Geri Al / İleri Al (Undo / Redo) */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!activeMarks.canUndo}
              style={{
                ...btnStyle(false),
                opacity: activeMarks.canUndo ? 1 : 0.4,
                cursor: activeMarks.canUndo ? 'pointer' : 'not-allowed',
              }}
              title="Geri Al (Ctrl+Z)"
            >
              <Undo size={13} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!activeMarks.canRedo}
              style={{
                ...btnStyle(false),
                opacity: activeMarks.canRedo ? 1 : 0.4,
                cursor: activeMarks.canRedo ? 'pointer' : 'not-allowed',
              }}
              title="İleri Al (Ctrl+Y)"
            >
              <Redo size={13} />
            </button>
          </div>

          {divider}

          {/* Word Tipi "Stil" Açılır Menüsü (Normal Metin, Başlık 1-4) & Tipografi — Yalnızca Full/Standart Modda */}
          {preset !== 'inline' && (
            <>
              <HeadingStyleDropdown editor={editor} />
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
            </>
          )}

          {/* Karakter Biçimlendirme & Tipografi Araçları (B, I, U, Gelişmiş Stiller, Biçim Boyacısı, Simge) */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              style={btnStyle(activeMarks.bold)}
              title="Kalın (Ctrl+B)"
            >
              <Bold size={13} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              style={btnStyle(activeMarks.italic)}
              title="İtalik (Ctrl+I)"
            >
              <Italic size={13} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              style={btnStyle(activeMarks.underline)}
              title="Altı Çizgili (Ctrl+U)"
            >
              <UnderlineIcon size={13} />
            </button>
            {preset !== 'inline' && <AdvancedCharStyleDropdown editor={editor} />}
            <CaseAndFormatControls editor={editor} />
            <SymbolDropdown editor={editor} />
          </div>

          {divider}

          {/* Renk Seçiciler (Word Tipi 'A' Yazı Rengi & Zemin Vurgusu + Renksiz Seçeneği) */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
            {/* Yazı Rengi: A Harfi + Renk Çizgisi + Renksiz Butonu */}
            <div style={colorGroupStyle}>
              <label style={colorLabelStyle} title="Yazı Rengi">
                <span style={{ fontSize: '12px', fontWeight: 900, lineHeight: 1, fontFamily: 'serif' }}>A</span>
                <span style={{ width: '13px', height: '3px', borderRadius: '1px', background: activeTextColor || '#EF4444' }} />
                <input
                  type="color"
                  value={activeTextColor || '#000000'}
                  onChange={(e) => { editor.chain().focus().setColor(e.target.value).run(); setActiveTextColor(e.target.value); }}
                  style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                />
              </label>
              <button
                type="button"
                onClick={() => { editor.chain().focus().unsetColor().run(); setActiveTextColor(''); }}
                style={clearColorBtnStyle(Boolean(activeTextColor))}
                title="Yazı Rengini Sıfırla (Renksiz)"
              >
                <Ban size={10} />
              </button>
            </div>

            {/* Vurgu Rengi: Highlighter + Vurgu Çizgisi + Renksiz Butonu */}
            <div style={colorGroupStyle}>
              <label style={colorLabelStyle} title="Metin Vurgu Rengi">
                <Highlighter size={11} />
                <span style={{ width: '13px', height: '3px', borderRadius: '1px', background: activeHighlightColor || '#FEF08A' }} />
                <input
                  type="color"
                  defaultValue={activeHighlightColor || '#FEF08A'}
                  onChange={(e) => { editor.chain().focus().toggleHighlight({ color: e.target.value }).run(); setActiveHighlightColor(e.target.value); }}
                  style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                />
              </label>
              <button
                type="button"
                onClick={() => { editor.chain().focus().unsetHighlight().run(); setActiveHighlightColor(''); }}
                style={clearColorBtnStyle(Boolean(activeHighlightColor))}
                title="Vurguyu Kaldır (Renksiz)"
              >
                <Ban size={10} />
              </button>
            </div>
          </div>

          {/* Inline Modda Yalnızca Bağlantı Ekle */}
          {preset === 'inline' && (
            <>
              {divider}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(true)}
                  style={btnStyle(activeMarks.link)}
                  title="Bağlantı Ekle / Düzenle"
                >
                  <LinkIcon size={13} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* 2. ALT SATIR: Ekler & Blok Bileşenler + (10px Boşluk) + Hizalama Dörtlüsü + Listeler */}
        {preset !== 'inline' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3px', paddingTop: '2px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Ekler & Blok Bileşenler (Akordeon/Kartlar, Bağlantı, Tablo, Görsel) */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
              <ComponentDropdown editor={editor} />
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(true)}
                style={btnStyle(activeMarks.link)}
                title="Bağlantı Ekle / Düzenle"
              >
                <LinkIcon size={13} />
              </button>
              <TableDropdown editor={editor} onOpenFloating={onOpenFloatingTable} />
              <ImageDropdown editor={editor} />
            </div>

            {/* Görsel ekleme yapısının 10px sağına dikey ayırıcı */}
            <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 10px', flexShrink: 0 }} />

            {/* Hizalama Dörtlüsü (Sola Yasla, Ortala, Sağa Yasla, İki Yana Yasla / Blokla) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1px',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                style={btnStyle(activeMarks.alignLeft)}
                title="Sola Yasla"
              >
                <AlignLeft size={13} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                style={btnStyle(activeMarks.alignCenter)}
                title="Ortala"
              >
                <AlignCenter size={13} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                style={btnStyle(activeMarks.alignRight)}
                title="Sağa Yasla"
              >
                <AlignRight size={13} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                style={btnStyle(activeMarks.alignJustify)}
                title="İki Yana Yasla (Blokla)"
              >
                <AlignJustify size={13} />
              </button>
            </div>

            {divider}

            {/* Listeler (Madde İşaretli & Numaralı) */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1px', flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                style={btnStyle(activeMarks.bulletList)}
                title="Madde İşaretli Liste"
              >
                <List size={13} />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                style={btnStyle(activeMarks.orderedList)}
                title="Numaralı Liste"
              >
                <ListOrdered size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      <LinkModal
        editor={editor}
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
      />
    </>
  );
};
