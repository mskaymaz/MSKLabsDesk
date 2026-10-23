import React, { useState, useRef, useEffect } from 'react';
import { Ban, ChevronDown, Highlighter, Palette } from 'lucide-react';

interface ColorMenuDropdownProps {
  type: 'text' | 'highlight';
  activeColor: string;
  onSelectColor: (color: string) => void;
  onClearColor: () => void;
  title: string;
}

const PRESET_COLORS = [
  '#000000', '#334155', '#64748b', '#94a3b8',
  '#ef4444', '#f97316', '#f59e0b', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#ec4899', '#f43f5e', '#ffffff', '#fef08a',
];

export const ColorMenuDropdown: React.FC<ColorMenuDropdownProps> = ({
  type,
  activeColor,
  onSelectColor,
  onClearColor,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const defaultUnderline = type === 'text' ? '#EF4444' : '#FEF08A';
  const displayLineColor = activeColor || defaultUnderline;

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          padding: '2px 4px',
          height: '24px',
          border: '1px solid var(--border-subtle)',
          borderRadius: '4px',
          background: isOpen ? 'var(--accent-primary-alpha, rgba(99,102,241,0.15))' : 'transparent',
          color: 'var(--text-primary)',
          cursor: 'pointer',
        }}
        title={title}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
          {type === 'text' ? (
            <span style={{ fontSize: '12px', fontWeight: 900, lineHeight: 1, fontFamily: 'serif' }}>A</span>
          ) : (
            <Highlighter size={11} />
          )}
          <span style={{ width: '13px', height: '3px', borderRadius: '1px', background: displayLineColor }} />
        </div>
        <ChevronDown size={10} style={{ opacity: 0.7 }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 9999,
            width: '168px',
            background: 'var(--bg-card, #1F2937)',
            border: '1px solid var(--border-subtle, #374151)',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* 1. Renksiz / Otomatik Butonu */}
          <button
            type="button"
            onClick={() => {
              onClearColor();
              setIsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              width: '100%',
              padding: '4px 6px',
              fontSize: '11px',
              fontWeight: 600,
              background: 'rgba(239,68,68,0.08)',
              color: 'var(--text-primary)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <Ban size={12} color="#EF4444" />
            <span>Otomatik / Renksiz</span>
          </button>

          {/* 2. Hazır Renk Izgarası */}
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>
              Tema Renkleri
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    onSelectColor(c);
                    setIsOpen(false);
                  }}
                  style={{
                    width: '100%',
                    height: '22px',
                    borderRadius: '3px',
                    background: c,
                    border: activeColor.toLowerCase() === c.toLowerCase() ? '2px solid var(--accent-primary, #6366F1)' : '1px solid rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    padding: 0,
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                  title={c}
                />
              ))}
            </div>
          </div>

          {/* 3. Özel Renk Seçici */}
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 6px',
              fontSize: '11px',
              background: 'var(--bg-secondary, rgba(255,255,255,0.05))',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Palette size={12} />
            <span>Özel Renk Seç...</span>
            <input
              type="color"
              value={activeColor || (type === 'text' ? '#000000' : '#FEF08A')}
              onChange={(e) => {
                onSelectColor(e.target.value);
                setIsOpen(false);
              }}
              style={{
                position: 'absolute',
                opacity: 0,
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                cursor: 'pointer',
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
};
