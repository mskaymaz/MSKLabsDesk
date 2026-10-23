import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface WordComboboxProps {
  value: string;
  onChange: (val: string) => void;
  presets: string[];
  title?: string;
  min?: number;
  max?: number;
  step?: number;
  inputWidth?: string;
}

export const WordCombobox: React.FC<WordComboboxProps> = ({
  value,
  onChange,
  presets,
  title,
  min = 1,
  max = 100,
  step = 1,
  inputWidth = '28px',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleIncrement = () => {
    const num = parseFloat(value) || 0;
    const isFloat = String(step).includes('.');
    const next = Math.min(max, num + step);
    onChange(isFloat ? next.toFixed(2).replace(/\.?0+$/, '') : String(Math.round(next)));
  };

  const handleDecrement = () => {
    const num = parseFloat(value) || 0;
    const isFloat = String(step).includes('.');
    const next = Math.max(min, num - step);
    onChange(isFloat ? next.toFixed(2).replace(/\.?0+$/, '') : String(Math.round(next)));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSelectPreset = (p: string) => {
    onChange(p);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-card)',
        borderRadius: '4px',
        height: '24px',
        position: 'relative',
        userSelect: 'none',
      }}
      title={title}
    >
      {/* 1. Sol Tarafa Yerleştirilmiş Dikey Spinbox Okları (Yukarı / Aşağı) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border-subtle)',
          height: '22px',
          width: '13px',
        }}
      >
        <button
          type="button"
          onClick={handleIncrement}
          style={{
            height: '11px',
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Değeri artır"
        >
          <ChevronUp size={8} />
        </button>
        <button
          type="button"
          onClick={handleDecrement}
          style={{
            height: '11px',
            padding: 0,
            border: 'none',
            borderTop: '1px solid var(--border-subtle)',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title="Değeri azalt"
        >
          <ChevronDown size={8} />
        </button>
      </div>

      {/* 2. Doğrudan Değer Girişi Yapılabilen Alan (Yalnızca Sayısal) */}
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        style={{
          width: inputWidth,
          height: '22px',
          textAlign: 'center',
          border: 'none',
          background: 'transparent',
          color: 'var(--text-primary)',
          fontSize: '11px',
          fontWeight: 700,
          outline: 'none',
          padding: '0 2px',
        }}
      />

      {/* 3. Açılır Liste Butonu (Sağ uçta açılır ok) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: '22px',
          padding: '0 3px',
          border: 'none',
          borderLeft: '1px solid var(--border-subtle)',
          background: isOpen ? 'var(--accent-primary)' : 'transparent',
          color: isOpen ? '#FFFFFF' : 'var(--text-muted)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Hazır listeden seç"
      >
        <ChevronDown size={10} />
      </button>

      {/* 4. Açılır Hazır Değerler Menüsü (Yalnızca Sayısal Değerler, pt/px yok) */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 3px)',
            left: 0,
            zIndex: 120,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            maxHeight: '160px',
            overflowY: 'auto',
            minWidth: '50px',
            padding: '2px',
            display: 'flex',
            flexDirection: 'column',
            gap: '1px',
          }}
        >
          {presets.map((preset) => {
            const isSelected = value === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                style={{
                  padding: '4px 6px',
                  fontSize: '11px',
                  fontWeight: isSelected ? 700 : 500,
                  textAlign: 'center',
                  border: 'none',
                  borderRadius: '4px',
                  background: isSelected ? 'var(--accent-primary)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}
              >
                <span>{preset}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
