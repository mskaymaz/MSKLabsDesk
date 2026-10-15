import React from 'react';

interface ColorPickerInputProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  description?: string;
}

const PRESET_SWATCHES = [
  { name: 'İndigo', hex: '#6366f1' },
  { name: 'Mavi', hex: '#3b82f6' },
  { name: 'Zümrüt', hex: '#10b981' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Mor', hex: '#8b5cf6' },
  { name: 'Gül Kurusu', hex: '#f43f5e' },
  { name: 'Koyu Slate', hex: '#0f172a' },
  { name: 'Açık Zemin', hex: '#f8fafc' },
];

export const ColorPickerInput: React.FC<ColorPickerInputProps> = ({
  label,
  value,
  onChange,
  description,
}) => {
  // Hex renk doğrulaması
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    onChange(text);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="admin-meta-text" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {label}
        </label>
        {description && (
          <span className="admin-meta-text" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            {description}
          </span>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* HTML5 Renk Seçici Kutusu */}
        <label
          style={{
            position: 'relative',
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-sm, 6px)',
            border: '1px solid var(--border-card)',
            background: value.startsWith('#') ? value : '#6366f1',
            cursor: 'pointer',
            flexShrink: 0,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
          title="Renk Tekerini Aç"
        >
          <input
            type="color"
            value={value.startsWith('#') && value.length === 7 ? value : '#6366f1'}
            onChange={(e) => onChange(e.target.value)}
            style={{
              position: 'absolute',
              top: '-10px',
              left: '-10px',
              width: '52px',
              height: '52px',
              opacity: 0,
              cursor: 'pointer',
            }}
          />
        </label>

        {/* Serbest HEX Metin Kutusu */}
        <input
          type="text"
          value={value}
          onChange={handleTextChange}
          placeholder="#RRGGBB"
          className="admin-filter-input"
          style={{
            flex: 1,
            height: '32px',
            padding: '0 8px',
            fontSize: '0.80rem',
            fontFamily: 'monospace',
            borderRadius: 'var(--radius-sm, 6px)',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-input, rgba(0,0,0,0.2))',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      {/* Hızlı Palet Noktaları */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
        {PRESET_SWATCHES.map((swatch) => (
          <button
            key={swatch.hex}
            type="button"
            onClick={() => onChange(swatch.hex)}
            title={swatch.name}
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: swatch.hex,
              border: value.toLowerCase() === swatch.hex.toLowerCase() ? '2px solid #FFFFFF' : '1px solid rgba(0,0,0,0.3)',
              cursor: 'pointer',
              padding: 0,
              boxShadow: value.toLowerCase() === swatch.hex.toLowerCase() ? `0 0 0 1.5px ${swatch.hex}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};
