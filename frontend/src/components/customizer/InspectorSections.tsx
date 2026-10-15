import React from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';
import {
  type ThemeMetrics,
  type CustomizerSection,
  METRIC_BOUNDS,
  AVAILABLE_FONTS,
  clampMetric,
} from './types';
import { ColorPickerInput } from './ColorPickerInput';

interface BoundedSliderProps {
  boundKey: keyof typeof METRIC_BOUNDS;
  value: number;
  onChange: (val: number) => void;
  hint?: string;
}

const BoundedSlider: React.FC<BoundedSliderProps> = ({ boundKey, value, onChange, hint }) => {
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

interface InspectorSectionsProps {
  section: CustomizerSection;
  metrics: ThemeMetrics;
  onUpdateMetric: <K extends keyof ThemeMetrics>(key: K, val: ThemeMetrics[K]) => void;
  onReset: () => void;
  onExportJSON: () => void;
  onImportJSON: (json: string) => void;
}

export const InspectorSections: React.FC<InspectorSectionsProps> = ({
  section,
  metrics,
  onUpdateMetric,
  onReset,
  onExportJSON,
  onImportJSON,
}) => {
  const [importText, setImportText] = React.useState('');
  const [importStatus, setImportStatus] = React.useState<string | null>(null);

  // 1. Genel Renkler
  if (section === 'colors') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <ColorPickerInput
          label="Ana Vurgu Rengi (Accent Primary)"
          description="Kaydet, Uygula ve aktif butonlar"
          value={metrics.accentPrimary}
          onChange={(hex) => onUpdateMetric('accentPrimary', hex)}
        />
        <ColorPickerInput
          label="Vurgu Hover Rengi (Accent Hover)"
          description="Buton üzerine gelme durumu"
          value={metrics.accentHover}
          onChange={(hex) => onUpdateMetric('accentHover', hex)}
        />
      </div>
    );
  }

  // 2. Başlık Tipografisi
  if (section === 'headings') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Başlık Yazı Tipi Ailesi
          </label>
          <select
            className="admin-filter-select"
            value={metrics.headingFont}
            onChange={(e) => onUpdateMetric('headingFont', e.target.value)}
            style={{ width: '100%', height: '32px' }}
          >
            {AVAILABLE_FONTS.map((f) => (
              <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <BoundedSlider
          boundKey="cardTitleSize"
          value={metrics.cardTitleSize}
          onChange={(v) => onUpdateMetric('cardTitleSize', v)}
          hint="Kart içi başlık boyutu"
        />

        <BoundedSlider
          boundKey="pageTitleSize"
          value={metrics.pageTitleSize}
          onChange={(v) => onUpdateMetric('pageTitleSize', v)}
          hint="Sayfa en üst ana başlık boyutu"
        />

        <div>
          <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Başlık Kalınlığı (Font Weight)
          </label>
          <select
            className="admin-filter-select"
            value={metrics.titleWeight}
            onChange={(e) => onUpdateMetric('titleWeight', Number(e.target.value))}
            style={{ width: '100%', height: '30px' }}
          >
            <option value={500}>500 (Orta - Medium)</option>
            <option value={600}>600 (Yarı Kalın - SemiBold)</option>
            <option value={700}>700 (Kalın - Bold)</option>
            <option value={800}>800 (Çok Kalın - ExtraBold)</option>
          </select>
        </div>

        <ColorPickerInput
          label="Başlık Metin Rengi"
          value={metrics.titleColor}
          onChange={(hex) => onUpdateMetric('titleColor', hex)}
        />
      </div>
    );
  }

  // 3. Gövde & Açıklama Tipografisi
  if (section === 'body') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Gövde Yazı Tipi Ailesi
          </label>
          <select
            className="admin-filter-select"
            value={metrics.bodyFont}
            onChange={(e) => onUpdateMetric('bodyFont', e.target.value)}
            style={{ width: '100%', height: '32px' }}
          >
            {AVAILABLE_FONTS.map((f) => (
              <option key={f.id} value={f.id} style={{ fontFamily: f.family }}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <BoundedSlider
          boundKey="descSize"
          value={metrics.descSize}
          onChange={(v) => onUpdateMetric('descSize', v)}
          hint="Kart açıklama ve özet metinleri"
        />

        <BoundedSlider
          boundKey="metaSize"
          value={metrics.metaSize}
          onChange={(v) => onUpdateMetric('metaSize', v)}
          hint="Tarih, saat ve yazar bilgileri"
        />

        <BoundedSlider
          boundKey="fontScale"
          value={metrics.fontScale}
          onChange={(v) => onUpdateMetric('fontScale', v)}
          hint="Tüm panel genel ölçeği"
        />

        <ColorPickerInput
          label="Açıklama Metin Rengi"
          value={metrics.descColor}
          onChange={(hex) => onUpdateMetric('descColor', hex)}
        />
      </div>
    );
  }

  // 4. Liste & İçerik Kartları
  if (section === 'cards') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <BoundedSlider
          boundKey="cardPaddingV"
          value={metrics.cardPaddingV}
          onChange={(v) => onUpdateMetric('cardPaddingV', v)}
          hint="Kart içi üst ve alt boşluk"
        />

        <BoundedSlider
          boundKey="cardPaddingH"
          value={metrics.cardPaddingH}
          onChange={(v) => onUpdateMetric('cardPaddingH', v)}
          hint="Kart içi sol ve sağ boşluk"
        />

        <BoundedSlider
          boundKey="cardRadius"
          value={metrics.cardRadius}
          onChange={(v) => onUpdateMetric('cardRadius', v)}
          hint="Kart köşe yuvarlaklığı"
        />

        <ColorPickerInput
          label="Kart Kenarlık Rengi"
          value={metrics.cardBorder}
          onChange={(hex) => onUpdateMetric('cardBorder', hex)}
        />

        <ColorPickerInput
          label="Kart Arka Plan Rengi"
          value={metrics.cardBg}
          onChange={(hex) => onUpdateMetric('cardBg', hex)}
        />
      </div>
    );
  }

  // 5. Butonlar (Köşe, Dolgular, Boyut ve Tüm Buton Renkleri)
  if (section === 'buttons') {
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
  }

  // 6. Rozetler & Etiketler
  if (section === 'badges') {
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
  }

  // 7. Tema Paketi (İçe / Dışa Aktar & Sıfırla)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <h4 className="admin-card-title" style={{ fontSize: '0.84rem', marginBottom: '4px' }}>
          Tema Paketini Dışa Aktar (Export)
        </h4>
        <p className="admin-card-desc" style={{ fontSize: '0.74rem', marginBottom: '8px' }}>
          Tüm bu ayarları JSON formatında indirerek başka bir müşteriye veya projeye tek tıkla yükleyebilirsiniz.
        </p>
        <button
          type="button"
          onClick={onExportJSON}
          className="admin-btn admin-btn-primary admin-btn-sm"
          style={{ width: '100%' }}
        >
          <Download size={14} /> JSON Tema Paketini İndir
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <h4 className="admin-card-title" style={{ fontSize: '0.84rem', marginBottom: '4px' }}>
          Tema Paketini İçe Aktar (Import)
        </h4>
        <p className="admin-card-desc" style={{ fontSize: '0.74rem', marginBottom: '6px' }}>
          Elinizdeki tema JSON metnini buraya yapıştırıp sisteme uygulayabilirsiniz:
        </p>
        <textarea
          rows={3}
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          placeholder='{"accentPrimary": "#3b82f6", ...}'
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            padding: '6px',
            borderRadius: 'var(--radius-sm, 4px)',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-input, rgba(0,0,0,0.2))',
            color: 'var(--text-primary)',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
          <button
            type="button"
            onClick={() => {
              if (!importText.trim()) return;
              try {
                onImportJSON(importText);
                setImportStatus('✅ Tema başarıyla yüklendi.');
                setImportText('');
              } catch (err: any) {
                setImportStatus(`❌ Hata: ${err.message}`);
              }
            }}
            className="admin-btn admin-btn-view admin-btn-sm"
            style={{ flex: 1 }}
          >
            <Upload size={14} /> Temayı Yükle ve Uygula
          </button>
        </div>
        {importStatus && (
          <span className="admin-meta-text" style={{ fontSize: '0.70rem', display: 'block', marginTop: '4px' }}>
            {importStatus}
          </span>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <h4 className="admin-card-title" style={{ fontSize: '0.84rem', marginBottom: '4px' }}>
          Fabrika Ayarlarına Dön
        </h4>
        <button
          type="button"
          onClick={onReset}
          className="admin-btn admin-btn-refresh admin-btn-sm"
          style={{ width: '100%' }}
        >
          <RotateCcw size={14} /> Bu Temanın Varsayılan Ayarlarına Sıfırla
        </button>
      </div>
    </div>
  );
};
