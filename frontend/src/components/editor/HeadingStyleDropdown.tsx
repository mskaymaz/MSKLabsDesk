import React from 'react';
import type { Editor } from '@tiptap/react';
import { ChevronDown } from 'lucide-react';

interface HeadingStyleDropdownProps {
  editor: Editor;
}

export const HeadingStyleDropdown: React.FC<HeadingStyleDropdownProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const currentLabel = editor.isActive('heading', { level: 1 })
    ? 'Başlık 1'
    : editor.isActive('heading', { level: 2 })
    ? 'Başlık 2'
    : editor.isActive('heading', { level: 3 })
    ? 'Başlık 3'
    : editor.isActive('heading', { level: 4 })
    ? 'Başlık 4'
    : 'Normal Metin';

  const selectStyle = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="admin-btn admin-btn-secondary admin-btn-sm"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          height: '24px',
          padding: '0 8px',
          fontSize: '11px',
          fontWeight: 600,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-card)',
          borderRadius: '4px',
          minWidth: '95px',
          justifyContent: 'space-between',
        }}
        title="Paragraf & Başlık Stilleri"
      >
        <span>{currentLabel}</span>
        <ChevronDown size={11} style={{ opacity: 0.7 }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 100,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: '6px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            padding: '4px',
            minWidth: '150px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => selectStyle(() => editor.chain().focus().setParagraph().run())}
            style={{
              padding: '6px 10px',
              textAlign: 'left',
              border: 'none',
              background: editor.isActive('paragraph') ? 'var(--accent-primary)' : 'transparent',
              color: editor.isActive('paragraph') ? '#FFF' : 'var(--text-primary)',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Normal Metin</span>
            <span style={{ fontSize: '10px', opacity: 0.6 }}>¶</span>
          </button>

          <button
            type="button"
            onClick={() => selectStyle(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}
            style={{
              padding: '6px 10px',
              textAlign: 'left',
              border: 'none',
              background: editor.isActive('heading', { level: 1 }) ? 'var(--accent-primary)' : 'transparent',
              color: editor.isActive('heading', { level: 1 }) ? '#FFF' : 'var(--text-primary)',
              borderRadius: '4px',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Başlık 1</span>
            <span style={{ fontSize: '10px', opacity: 0.6 }}>H1</span>
          </button>

          <button
            type="button"
            onClick={() => selectStyle(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
            style={{
              padding: '6px 10px',
              textAlign: 'left',
              border: 'none',
              background: editor.isActive('heading', { level: 2 }) ? 'var(--accent-primary)' : 'transparent',
              color: editor.isActive('heading', { level: 2 }) ? '#FFF' : 'var(--text-primary)',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Başlık 2</span>
            <span style={{ fontSize: '10px', opacity: 0.6 }}>H2</span>
          </button>

          <button
            type="button"
            onClick={() => selectStyle(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
            style={{
              padding: '6px 10px',
              textAlign: 'left',
              border: 'none',
              background: editor.isActive('heading', { level: 3 }) ? 'var(--accent-primary)' : 'transparent',
              color: editor.isActive('heading', { level: 3 }) ? '#FFF' : 'var(--text-primary)',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Başlık 3</span>
            <span style={{ fontSize: '10px', opacity: 0.6 }}>H3</span>
          </button>

          <button
            type="button"
            onClick={() => selectStyle(() => editor.chain().focus().toggleHeading({ level: 4 }).run())}
            style={{
              padding: '6px 10px',
              textAlign: 'left',
              border: 'none',
              background: editor.isActive('heading', { level: 4 }) ? 'var(--accent-primary)' : 'transparent',
              color: editor.isActive('heading', { level: 4 }) ? '#FFF' : 'var(--text-primary)',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>Başlık 4</span>
            <span style={{ fontSize: '10px', opacity: 0.6 }}>H4</span>
          </button>
        </div>
      )}
    </div>
  );
};
