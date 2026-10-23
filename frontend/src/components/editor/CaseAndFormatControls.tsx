import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { Paintbrush, CaseSensitive, ChevronDown } from 'lucide-react';

interface CaseAndFormatControlsProps {
  editor: Editor;
}

interface StoredStyles {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  color?: string;
  fontSize?: string;
  fontFamily?: string;
  highlight?: string;
}

export const CaseAndFormatControls: React.FC<CaseAndFormatControlsProps> = ({ editor }) => {
  const [isCaseOpen, setIsCaseOpen] = useState(false);
  const [isPainterActive, setIsPainterActive] = useState(false);
  const [copiedStyles, setCopiedStyles] = useState<StoredStyles | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCaseOpen(false);
      }
    };
    if (isCaseOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCaseOpen]);

  // Format Painter Dinleyicisi (Metin seçildiğinde kopyalanan stilleri uygular)
  useEffect(() => {
    if (!editor || !isPainterActive || !copiedStyles) return;

    const handleSelection = () => {
      const { empty } = editor.state.selection;
      if (!empty) {
        let chain = editor.chain().focus();

        if (copiedStyles.bold) chain = chain.setBold();
        else chain = chain.unsetBold();

        if (copiedStyles.italic) chain = chain.setItalic();
        else chain = chain.unsetItalic();

        if (copiedStyles.underline) chain = chain.setUnderline();
        else chain = chain.unsetUnderline();

        if (copiedStyles.color) chain = chain.setColor(copiedStyles.color);
        if (copiedStyles.fontSize) chain = chain.setFontSize(copiedStyles.fontSize);
        if (copiedStyles.fontFamily) chain = chain.setFontFamily(copiedStyles.fontFamily);

        chain.run();

        // Tek kullanımlık Word standardı: Biçim uygulandıktan sonra fırçayı kapat
        setIsPainterActive(false);
        setCopiedStyles(null);
      }
    };

    editor.on('selectionUpdate', handleSelection);
    return () => {
      editor.off('selectionUpdate', handleSelection);
    };
  }, [editor, isPainterActive, copiedStyles]);

  const toggleFormatPainter = () => {
    if (isPainterActive) {
      setIsPainterActive(false);
      setCopiedStyles(null);
    } else {
      const textAttrs = editor.getAttributes('textStyle') || {};
      const styles: StoredStyles = {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        strike: editor.isActive('strike'),
        color: textAttrs.color,
        fontSize: textAttrs.fontSize,
        fontFamily: textAttrs.fontFamily,
      };
      setCopiedStyles(styles);
      setIsPainterActive(true);
    }
  };

  const applyCaseConversion = (type: 'upper' | 'lower' | 'title' | 'sentence') => {
    const { from, to, empty } = editor.state.selection;
    if (empty) {
      setIsCaseOpen(false);
      return;
    }

    const selectedText = editor.state.doc.textBetween(from, to, ' ');
    let result = selectedText;

    if (type === 'upper') {
      result = selectedText.toLocaleUpperCase('tr-TR');
    } else if (type === 'lower') {
      result = selectedText.toLocaleLowerCase('tr-TR');
    } else if (type === 'title') {
      result = selectedText
        .toLocaleLowerCase('tr-TR')
        .split(' ')
        .map((word) =>
          word.length > 0 ? word[0].toLocaleUpperCase('tr-TR') + word.slice(1) : ''
        )
        .join(' ');
    } else if (type === 'sentence') {
      const lower = selectedText.toLocaleLowerCase('tr-TR');
      result = lower.length > 0 ? lower[0].toLocaleUpperCase('tr-TR') + lower.slice(1) : '';
    }

    editor.chain().focus().insertContent(result).run();
    setIsCaseOpen(false);
  };

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

  const menuItemStyle: React.CSSProperties = {
    padding: '6px 10px',
    textAlign: 'left',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {/* Biçim Boyacısı / Stil Boyama (Format Painter) */}
      <button
        type="button"
        onClick={toggleFormatPainter}
        style={btnStyle(isPainterActive)}
        title="Biçim Boyacısı (Stil Boyama): Bir metnin biçimini kopyalayıp başka bir metne uygular"
      >
        <Paintbrush size={13} />
      </button>

      {/* Büyük / Küçük Harf Değiştirici Açılır Menü */}
      <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
        <button
          type="button"
          onClick={() => setIsCaseOpen(!isCaseOpen)}
          style={{
            ...btnStyle(isCaseOpen),
            gap: '1px',
            padding: '0 4px',
            minWidth: '32px',
          }}
          title="Büyük / Küçük Harf Değiştir (TÜMÜ BÜYÜK, tümü küçük, Başlık Düzeni)"
        >
          <CaseSensitive size={14} />
          <ChevronDown size={10} style={{ opacity: 0.7 }} />
        </button>

        {isCaseOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              zIndex: 110,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: '6px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
              padding: '4px',
              width: '170px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => applyCaseConversion('upper')}
              style={menuItemStyle}
            >
              <span>TÜMÜ BÜYÜK</span>
              <span style={{ fontSize: '9px', opacity: 0.6 }}>ABC</span>
            </button>
            <button
              type="button"
              onClick={() => applyCaseConversion('lower')}
              style={menuItemStyle}
            >
              <span>tümü küçük</span>
              <span style={{ fontSize: '9px', opacity: 0.6 }}>abc</span>
            </button>
            <button
              type="button"
              onClick={() => applyCaseConversion('title')}
              style={menuItemStyle}
            >
              <span>Başlık Düzeni</span>
              <span style={{ fontSize: '9px', opacity: 0.6 }}>Abc Def</span>
            </button>
            <button
              type="button"
              onClick={() => applyCaseConversion('sentence')}
              style={menuItemStyle}
            >
              <span>Tümce düzeni</span>
              <span style={{ fontSize: '9px', opacity: 0.6 }}>Abc def</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
