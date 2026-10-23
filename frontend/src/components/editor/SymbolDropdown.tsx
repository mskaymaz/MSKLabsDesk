import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';

interface SymbolDropdownProps {
  editor: Editor;
}

interface SymbolCategory {
  name: string;
  symbols: string[];
}

const SYMBOL_CATEGORIES: SymbolCategory[] = [
  {
    name: 'Para',
    symbols: ['₺', '€', '$', '£', '¥', '₿', '₽', '¢', '₹', '₩'],
  },
  {
    name: 'Matematik',
    symbols: ['±', '≠', '≤', '≥', '÷', '×', '∞', '∑', '√', 'π', '≈', '‰', '°', '¬', '∂', '∫', '∆', 'µ'],
  },
  {
    name: 'Yunan',
    symbols: ['Ω', 'θ', 'α', 'β', 'γ', 'δ', 'λ', 'μ', 'σ', 'φ', 'ψ', 'ω', 'Φ', 'Ψ', 'Σ', 'Δ', 'Π'],
  },
  {
    name: 'Oklar',
    symbols: ['←', '→', '↑', '↓', '↔', '↕', '⇐', '⇒', '⇑', '⇓', '⇔', '↗', '↘'],
  },
  {
    name: 'Özel İmler',
    symbols: ['•', '—', '–', '❤', '★', '☆', '✓', '✗', '◆', '◇', '■', '□', '▲', '▼', '&', '§', '¶', '©', '®', '™'],
  },
];

export const SymbolDropdown: React.FC<SymbolDropdownProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Para');
  const [recentSymbols, setRecentSymbols] = useState<string[]>(['₺', '€', '$', '•', '—', '±', 'Ω', '★']);
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

  const handleInsertSymbol = (sym: string) => {
    editor.chain().focus().insertContent(sym).run();
    setRecentSymbols((prev) => [sym, ...prev.filter((s) => s !== sym)].slice(0, 8));
    setIsOpen(false);
  };

  const currentCategoryObj = SYMBOL_CATEGORIES.find((c) => c.name === activeCategory) || SYMBOL_CATEGORIES[0];

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="admin-btn admin-btn-secondary admin-btn-sm"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '24px',
          width: '26px',
          padding: 0,
          fontSize: '13px',
          fontWeight: 700,
          background: isOpen ? 'var(--accent-primary)' : 'transparent',
          color: isOpen ? '#FFFFFF' : 'var(--text-primary)',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'serif',
        }}
        title="Simge & Özel Karakter Ekle (Word Simge Kataloğu)"
      >
        Ω
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 110,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: '8px',
            boxShadow: '0 12px 28px rgba(0,0,0,0.35)',
            padding: '8px',
            width: '260px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Son Kullanılan Hızlı Simgeler */}
          <div>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Son Kullanılanlar
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '3px' }}>
              {recentSymbols.map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => handleInsertSymbol(sym)}
                  style={{
                    height: '24px',
                    fontSize: '13px',
                    border: '1px solid var(--border-card)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  title={sym}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Kategori Sekmeleri */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '3px',
              gap: '2px',
              overflowX: 'auto',
            }}
          >
            {SYMBOL_CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setActiveCategory(cat.name)}
                style={{
                  padding: '3px 6px',
                  fontSize: '10px',
                  fontWeight: activeCategory === cat.name ? 700 : 500,
                  border: 'none',
                  borderRadius: '4px',
                  background: activeCategory === cat.name ? 'var(--accent-primary)' : 'transparent',
                  color: activeCategory === cat.name ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Kategori Sembolleri Izgarası */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '4px',
              maxHeight: '140px',
              overflowY: 'auto',
              padding: '2px',
            }}
          >
            {currentCategoryObj.symbols.map((sym) => (
              <button
                key={sym}
                type="button"
                onClick={() => handleInsertSymbol(sym)}
                style={{
                  height: '28px',
                  fontSize: '14px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.1s ease',
                }}
                title={sym}
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
