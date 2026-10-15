import React from 'react';
import type { ThemeMetrics } from './types';
import { BoundedSlider } from './BoundedSlider';
import { ColorPickerInput } from './ColorPickerInput';

interface ButtonsSectionProps {
  metrics: ThemeMetrics;
  onUpdateMetric: <K extends keyof ThemeMetrics>(key: K, val: ThemeMetrics[K]) => void;
}

export const ButtonsSection: React.FC<ButtonsSectionProps> = ({
  metrics,
  onUpdateMetric,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <BoundedSlider
        boundKey="btnRadius"
        value={metrics.btnRadius}
        onChange={(v) => onUpdateMetric('btnRadius', v)}
        hint="Köşe yuvarlaklığı"
      />

      <BoundedSlider
        boundKey="btnPaddingV"
        value={metrics.btnPaddingV}
        onChange={(v) => onUpdateMetric('btnPaddingV', v)}
        hint="Buton dikey dolgusu"
      />

      <BoundedSlider
        boundKey="btnPaddingH"
        value={metrics.btnPaddingH}
        onChange={(v) => onUpdateMetric('btnPaddingH', v)}
        hint="Buton yatay dolgusu"
      />

      <BoundedSlider
        boundKey="btnFontSize"
        value={metrics.btnFontSize}
        onChange={(v) => onUpdateMetric('btnFontSize', v)}
        hint="Buton yazı boyutu"
      />

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h4 className="admin-meta-text" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
          BUTON ROL RENKLERİ:
        </h4>
        <ColorPickerInput
          label="Kaydet / Uygula Butonu (Birincil)"
          value={metrics.accentPrimary}
          onChange={(hex) => onUpdateMetric('accentPrimary', hex)}
        />
        <ColorPickerInput
          label="İncele Butonu (Detay/Görüntüle)"
          value={metrics.btnViewColor}
          onChange={(hex) => onUpdateMetric('btnViewColor', hex)}
        />
        <ColorPickerInput
          label="Onayla Butonu (Kabul Et/Aktif)"
          value={metrics.btnSuccessColor}
          onChange={(hex) => onUpdateMetric('btnSuccessColor', hex)}
        />
        <ColorPickerInput
          label="Reddet Butonu (Sil/İptal)"
          value={metrics.btnDangerColor}
          onChange={(hex) => onUpdateMetric('btnDangerColor', hex)}
        />
        <ColorPickerInput
          label="Düzenle Butonu (İkincil)"
          value={metrics.btnEditColor}
          onChange={(hex) => onUpdateMetric('btnEditColor', hex)}
        />
      </div>
    </div>
  );
};
