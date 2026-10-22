import React from 'react';

export interface CanvasSideAdProps {
  side: 'left' | 'right';
  canvasTheme: 'light' | 'dark';
}

export const CanvasSideAd: React.FC<CanvasSideAdProps> = ({ side, canvasTheme }) => {
  const isLeft = side === 'left';
  const label = isLeft ? 'Sol Reklam' : 'Sağ Reklam';
  const slotKey = isLeft ? 'ad_sidebar_left' : 'ad_sidebar_right';

  return (
    <div
      style={{
        width: '120px',
        minWidth: '120px',
        height: '600px',
        border: canvasTheme === 'dark' ? '1px dashed #334155' : '1px dashed #cbd5e1',
        background: canvasTheme === 'dark' ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.65)',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        flexShrink: 0,
        userSelect: 'none',
        position: 'sticky',
        top: '20px',
      }}
    >
      <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: '4px' }}>
        {label}
      </span>
      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
        120 × 600
      </span>
      <span style={{ fontSize: '9px', opacity: 0.8, marginTop: '6px' }}>
        Dikey Gökdelen
      </span>
      <div style={{ marginTop: 'auto', fontSize: '9px', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', fontFamily: 'monospace' }}>
        {slotKey}
      </div>
    </div>
  );
};
