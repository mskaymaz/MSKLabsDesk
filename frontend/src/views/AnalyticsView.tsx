import React, { useState } from 'react';
import { Globe2, Smartphone } from 'lucide-react';
import { WebAnalyticsTab } from '../components/analytics/WebAnalyticsTab';
import { TelemetryView } from '../components/analytics/TelemetryView';

export const AnalyticsView: React.FC = () => {
  const [tab, setTab] = useState<'web' | 'ecosystem'>('ecosystem');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        className="admin-panel-card"
        style={{
          padding: '8px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => setTab('ecosystem')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            background: tab === 'ecosystem' ? 'var(--accent-primary, #3b82f6)' : 'transparent',
            color: tab === 'ecosystem' ? '#fff' : 'var(--text-secondary)',
          }}
        >
          <Smartphone size={15} />
          Uygulama & Ekosistem
        </button>
        <button
          type="button"
          onClick={() => setTab('web')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 600,
            background: tab === 'web' ? 'var(--accent-primary, #3b82f6)' : 'transparent',
            color: tab === 'web' ? '#fff' : 'var(--text-secondary)',
          }}
        >
          <Globe2 size={15} />
          Web İstatistikleri
        </button>
      </div>

      {tab === 'ecosystem' ? <TelemetryView /> : <WebAnalyticsTab />}
    </div>
  );
};
