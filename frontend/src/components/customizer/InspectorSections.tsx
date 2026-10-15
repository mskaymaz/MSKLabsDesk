import React from 'react';
import {
  type ThemeMetrics,
  type CustomizerSection,
  AVAILABLE_FONTS,
  CARD_SHADOW_OPTIONS,
} from './types';
import { ColorPickerInput } from './ColorPickerInput';
import { BoundedSlider } from './BoundedSlider';
import { ButtonsSection } from './ButtonsSection';
import { BadgesSection } from './BadgesSection';
import { PackageSection } from './PackageSection';

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
  // 1. Genel Renkler
  if (section === 'colors') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <ColorPickerInput
          label="Birincil Vurgu Rengi (Accent Primary)"
          description="Butonlar, aktif sekmeler, bağlantılar ve odak halkaları"
          value={metrics.accentPrimary}
          onChange={(hex) => onUpdateMetric('accentPrimary', hex)}
        />
        <ColorPickerInput
          label="Vurgu Üzerine Gelme (Accent Hover)"
          description="Butonların üzerine gelindiğindeki durum rengi"
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
            Başlık Yazı Tipi (Font Ailesi)
          </label>
          <select
            className="admin-filter-select"
            value={metrics.headingFont}
            onChange={(e) => onUpdateMetric('headingFont', e.target.value)}
            style={{ width: '100%', height: '30px' }}
          >
            {AVAILABLE_FONTS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <BoundedSlider
          boundKey="pageTitleSize"
          value={metrics.pageTitleSize}
          onChange={(v) => onUpdateMetric('pageTitleSize', v)}
          hint="Sayfa ana başlık boyutu"
        />

        <BoundedSlider
          boundKey="cardTitleSize"
          value={metrics.cardTitleSize}
          onChange={(v) => onUpdateMetric('cardTitleSize', v)}
          hint="Liste kartları ve modal başlık boyutu"
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
            Gövde & Metin Yazı Tipi
          </label>
          <select
            className="admin-filter-select"
            value={metrics.bodyFont}
            onChange={(e) => onUpdateMetric('bodyFont', e.target.value)}
            style={{ width: '100%', height: '30px' }}
          >
            {AVAILABLE_FONTS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <BoundedSlider
          boundKey="descSize"
          value={metrics.descSize}
          onChange={(v) => onUpdateMetric('descSize', v)}
          hint="Kart açıklama ve içerik metin boyutu"
        />

        <BoundedSlider
          boundKey="metaSize"
          value={metrics.metaSize}
          onChange={(v) => onUpdateMetric('metaSize', v)}
          hint="Tarih, etiket altı ve sayaç boyutu"
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

        <BoundedSlider
          boundKey="cardBorderWidth"
          value={metrics.cardBorderWidth ?? 1}
          onChange={(v) => onUpdateMetric('cardBorderWidth', v)}
          hint="Kart kenarlık çizgi kalınlığı"
        />

        <div>
          <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Kart Panel Gölgesi (Box Shadow)
          </label>
          <select
            className="admin-filter-select"
            value={metrics.cardShadow || 'medium'}
            onChange={(e) => onUpdateMetric('cardShadow', e.target.value as any)}
            style={{ width: '100%', height: '30px' }}
          >
            {CARD_SHADOW_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

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

  // 5. Butonlar (Köşe, Dolgular, Boyut ve Tüm Buton Rol Renkleri)
  if (section === 'buttons') {
    return (
      <ButtonsSection
        metrics={metrics}
        onUpdateMetric={onUpdateMetric}
      />
    );
  }

  // 6. Rozetler & Etiketler
  if (section === 'badges') {
    return (
      <BadgesSection
        metrics={metrics}
        onUpdateMetric={onUpdateMetric}
      />
    );
  }

  // 7. Token & Takip Kodları (MSK-2026-EZRD, #73_LLUNA)
  if (section === 'tokens') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Token Yazı Tipi (Font Ailesi)
          </label>
          <select
            className="admin-filter-select"
            value={metrics.tokenFont || 'mono'}
            onChange={(e) => onUpdateMetric('tokenFont', e.target.value)}
            style={{ width: '100%', height: '30px' }}
          >
            {AVAILABLE_FONTS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.name}
              </option>
            ))}
          </select>
        </div>

        <BoundedSlider
          boundKey="tokenSize"
          value={metrics.tokenSize}
          onChange={(v) => onUpdateMetric('tokenSize', v)}
          hint="Token ve takip kodları yazı boyutu"
        />

        <div>
          <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Token Kalınlığı (Font Weight)
          </label>
          <select
            className="admin-filter-select"
            value={metrics.tokenWeight}
            onChange={(e) => onUpdateMetric('tokenWeight', Number(e.target.value))}
            style={{ width: '100%', height: '30px' }}
          >
            <option value={500}>500 (Orta - Medium)</option>
            <option value={600}>600 (Yarı Kalın - SemiBold)</option>
            <option value={700}>700 (Kalın - Bold)</option>
            <option value={800}>800 (Çok Kalın - ExtraBold)</option>
          </select>
        </div>

        <div>
          <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
            Harf Aralığı (Letter Spacing)
          </label>
          <select
            className="admin-filter-select"
            value={metrics.tokenSpacing}
            onChange={(e) => onUpdateMetric('tokenSpacing', e.target.value)}
            style={{ width: '100%', height: '30px' }}
          >
            <option value="-0.04em">-0.04em (Çok Sıkı)</option>
            <option value="-0.02em">-0.02em (Hafif Sıkı - Varsayılan)</option>
            <option value="0em">0em (Normal)</option>
            <option value="0.02em">0.02em (Hafif Geniş)</option>
            <option value="0.04em">0.04em (Geniş)</option>
          </select>
        </div>

        <ColorPickerInput
          label="Token Metin Rengi"
          description="Bilet ve yorum takip numaralarının rengi"
          value={metrics.tokenColor}
          onChange={(hex) => onUpdateMetric('tokenColor', hex)}
        />
      </div>
    );
  }

  // 8. Tema Paketi (İçe / Dışa Aktar & Sıfırla)
  return (
    <PackageSection
      onExportJSON={onExportJSON}
      onImportJSON={onImportJSON}
      onReset={onReset}
    />
  );
};
