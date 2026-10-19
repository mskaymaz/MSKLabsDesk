import React from 'react';
import { Bold, Italic, Heading, Type, List, CornerDownLeft, Link as LinkIcon, Eraser } from 'lucide-react';

interface AppStudioRichTextToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (val: string) => void;
}

export const AppStudioRichTextToolbar: React.FC<AppStudioRichTextToolbarProps> = ({
  textareaRef,
  value,
  onChange,
}) => {
  const applyWrap = (prefix: string, suffix: string, defaultText: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = value.substring(start, end);
    const content = selected || defaultText;
    const nextVal = value.substring(0, start) + prefix + content + suffix + value.substring(end);

    onChange(nextVal);

    setTimeout(() => {
      el.focus();
      const newStart = start + prefix.length;
      const newEnd = newStart + content.length;
      el.setSelectionRange(newStart, newEnd);
    }, 0);
  };

  const handleBold = () => applyWrap('<strong>', '</strong>', 'kalın metin');
  const handleItalic = () => applyWrap('<em>', '</em>', 'italik metin');
  const handleHeading = () => applyWrap('<h4>', '</h4>', 'Alt Başlık');
  const handleSmall = () => applyWrap('<small>', '</small>', 'ek bilgi / dipnot');

  const handleList = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = value.substring(start, end);

    if (selected) {
      const lines = selected.split('\n').map((line) => (line.startsWith('• ') ? line : `• ${line}`));
      const replaced = lines.join('\n');
      const nextVal = value.substring(0, start) + replaced + value.substring(end);
      onChange(nextVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start, start + replaced.length);
      }, 0);
    } else {
      const nextVal = value.substring(0, start) + '• ' + value.substring(end);
      onChange(nextVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + 2, start + 2);
      }, 0);
    }
  };

  const handleBr = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const nextVal = value.substring(0, start) + '<br>' + value.substring(end);
    onChange(nextVal);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + 4, start + 4);
    }, 0);
  };

  const handleLink = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = value.substring(start, end) || 'bağlantı metni';
    const rawUrl = window.prompt('Bağlantı URL adresi (örn: https://...):', 'https://');
    if (!rawUrl || rawUrl.trim() === '' || rawUrl === 'https://') return;

    const cleanUrl = rawUrl.trim();
    const tag = `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer">${selected}</a>`;
    const nextVal = value.substring(0, start) + tag + value.substring(end);
    onChange(nextVal);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start, start + tag.length);
    }, 0);
  };

  const handleClearTags = () => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    const selected = value.substring(start, end);

    if (selected) {
      const stripped = selected.replace(/<\/?[^>]+(>|$)/g, '');
      const nextVal = value.substring(0, start) + stripped + value.substring(end);
      onChange(nextVal);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start, start + stripped.length);
      }, 0);
    }
  };

  return (
    <div className="studio-rich-toolbar">
      <button
        type="button"
        className="studio-toolbar-btn"
        onClick={handleBold}
        title="Kalın (<strong>)"
      >
        <Bold size={13} />
        <span>B</span>
      </button>

      <button
        type="button"
        className="studio-toolbar-btn"
        onClick={handleItalic}
        title="İtalik (<em>)"
      >
        <Italic size={13} />
        <span>I</span>
      </button>

      <button
        type="button"
        className="studio-toolbar-btn"
        onClick={handleHeading}
        title="Alt Başlık (<h4>)"
      >
        <Heading size={13} />
        <span>H4</span>
      </button>

      <button
        type="button"
        className="studio-toolbar-btn"
        onClick={handleSmall}
        title="Küçük Metin / Dipnot (<small>)"
      >
        <Type size={13} />
        <span>Küçük</span>
      </button>

      <div className="studio-toolbar-divider" />

      <button
        type="button"
        className="studio-toolbar-btn"
        onClick={handleList}
        title="Madde İmi (•)"
      >
        <List size={13} />
        <span>Madde</span>
      </button>

      <button
        type="button"
        className="studio-toolbar-btn"
        onClick={handleBr}
        title="Satır Sonu (<br>)"
      >
        <CornerDownLeft size={13} />
        <span>Satır Sonu</span>
      </button>

      <button
        type="button"
        className="studio-toolbar-btn"
        onClick={handleLink}
        title="Web Bağlantısı (<a>)"
      >
        <LinkIcon size={13} />
        <span>Link</span>
      </button>

      <div className="studio-toolbar-divider" />

      <button
        type="button"
        className="studio-toolbar-btn btn-clear"
        onClick={handleClearTags}
        title="Seçili metindeki HTML etiketlerini temizle"
      >
        <Eraser size={13} />
      </button>
    </div>
  );
};
