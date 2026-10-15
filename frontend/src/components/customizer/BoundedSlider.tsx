import React from 'react';
import { METRIC_BOUNDS, clampMetric } from './types';

interface BoundedSliderProps {
  boundKey: keyof typeof METRIC_BOUNDS;
  value: number;
  onChange: (val: number) => void;
  hint?: string;
}

export const BoundedSlider: React.FC<BoundedSliderProps> = ({ boundKey, value, onChange, hint }) => {
  const bound = METRIC_BOUNDS[boundKey];

  const handleChange = (newVal: number) => {
    onChange(clampMetric(boundKey, newVal));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="admin-meta-text" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {bound.label}
        </span>
        <span className="admin-badge admin-badge-info" style={{ fontFamily: 'monospace', fontSize: '0.70rem' }}>
          {value}{bound.unit}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="range"
          min={bound.min}
          max={bound.max}
          step={bound.step}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
        />
        <input
          type="number"
          min={bound.min}
          max={bound.max}
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          style={{
            width: '48px',
            height: '24px',
            fontSize: '0.74rem',
            textAlign: 'center',
            borderRadius: 'var(--radius-sm, 4px)',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-input, rgba(0,0,0,0.2))',
            color: 'var(--text-primary)',
          }}
        />
      </div>
      {hint && (
        <span className="admin-meta-text" style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
          {hint} ({bound.min}{bound.unit} - {bound.max}{bound.unit})
        </span>
      )}
    </div>
  );
};
