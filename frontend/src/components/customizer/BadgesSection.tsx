import React from 'react';
import type { ThemeMetrics } from './types';
import { BoundedSlider } from './BoundedSlider';

interface BadgesSectionProps {
  metrics: ThemeMetrics;
  onUpdateMetric: <K extends keyof ThemeMetrics>(key: K, val: ThemeMetrics[K]) => void;
}

export const BadgesSection: React.FC<BadgesSectionProps> = ({
  metrics,
  onUpdateMetric,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <BoundedSlider
        boundKey="badgeRadius"
        value={metrics.badgeRadius}
        onChange={(v) => onUpdateMetric('badgeRadius', v)}
        hint="Rozet köşe yuvarlaklığı"
      />

      <BoundedSlider
        boundKey="badgePaddingV"
        value={metrics.badgePaddingV}
        onChange={(v) => onUpdateMetric('badgePaddingV', v)}
        hint="Rozet dikey dolgusu"
      />

      <BoundedSlider
        boundKey="badgePaddingH"
        value={metrics.badgePaddingH}
        onChange={(v) => onUpdateMetric('badgePaddingH', v)}
        hint="Rozet yatay dolgusu"
      />

      <BoundedSlider
        boundKey="badgeFontSize"
        value={metrics.badgeFontSize}
        onChange={(v) => onUpdateMetric('badgeFontSize', v)}
        hint="Rozet metin boyutu"
      />
    </div>
  );
};
