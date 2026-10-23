import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Code,
  MoreHorizontal,
} from 'lucide-react';

interface AdvancedCharStyleDropdownProps {
  editor: Editor;
}

export const AdvancedCharStyleDropdown: React.FC<AdvancedCharStyleDropdownProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const hasActiveSub =
    editor.isActive('strike') ||
    editor.isActive('subscript') ||
    editor.isActive('superscript') ||
    editor.isActive('code');

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

  const itemStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 8px',
    textAlign: 'left',
    border: 'none',
    background: active ? 'var(--accent-primary)' : 'transparent',
    color: active ? '#FFF' : 'var(--text-primary)',
    borderRadius: '4px',
    fontSize: '11px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  });

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={btnStyle(hasActiveSub)}
        title="Gelişmiş Yazı Biçimleri (Üstü Çizili, Alt/Üst Simge, Kod)"
      >
        <MoreHorizontal size={13} />
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
            minWidth: '140px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleStrike().run();
              setIsOpen(false);
            }}
            style={itemStyle(editor.isActive('strike'))}
          >
            <Strikethrough size={12} />
            <span>Üstü Çizili</span>
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleSubscript().run();
              setIsOpen(false);
            }}
            style={itemStyle(editor.isActive('subscript'))}
          >
            <SubscriptIcon size={12} />
            <span>Alt Simge (X₂)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleSuperscript().run();
              setIsOpen(false);
            }}
            style={itemStyle(editor.isActive('superscript'))}
          >
            <SuperscriptIcon size={12} />
            <span>Üst Simge (X²)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleCode().run();
              setIsOpen(false);
            }}
            style={itemStyle(editor.isActive('code'))}
          >
            <Code size={12} />
            <span>Satır İçi Kod</span>
          </button>
        </div>
      )}
    </div>
  );
};
