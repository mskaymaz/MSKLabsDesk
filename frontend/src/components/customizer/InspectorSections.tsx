import React from 'react';
import {
  type ThemeMetrics,
  type CustomizerSection,
  AVAILABLE_FONTS,
} from './types';
import { ColorPickerInput } from './ColorPickerInput';
import { BoundedSlider } from './BoundedSlider';
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

  // 5. Butonlar (Köşe, Dolgular, Boyut ve Tüm Buton Rol Renkleri)
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

  // 7. Token & Takip Kodları (MSK-2026-EZRD, #73_LLUNA)
  if (section === 'tokens') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
