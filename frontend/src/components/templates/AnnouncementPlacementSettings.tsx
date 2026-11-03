import React from 'react';
import { Sliders, Clock } from 'lucide-react';
import { type AnnouncementItem, type AnnouncementPlacement } from './announcementConfig';

export interface AnnouncementPlacementSettingsProps {
  activeItem: AnnouncementItem;
  updateCurrentItem: (updates: Partial<AnnouncementItem>) => void;
  deviceTab?: 'desktop' | 'mobile';
  setDeviceTab?: (device: 'desktop' | 'mobile') => void;
  previewWebWidth?: number;
  setPreviewWebWidth?: (width: number) => void;
}

export const AnnouncementPlacementSettings: React.FC<AnnouncementPlacementSettingsProps> = ({
  activeItem,
  updateCurrentItem,
  deviceTab = 'desktop',
  previewWebWidth = 1160,
  setPreviewWebWidth,
}) => {
  const isWebTab = deviceTab === 'desktop';
  const currentPlacement: AnnouncementPlacement = isWebTab
    ? (activeItem.placement || 'top_hanging')
    : (activeItem.mobilePlacement || activeItem.placement || 'right_floating');

  const isTopHanging = currentPlacement === 'top_hanging';
  const isBottom = currentPlacement.startsWith('bottom_');

  // Yatay ve Dikey Ofset Değerleri
  const currentHOffset = isWebTab
    ? (activeItem.horizontalOffset ?? activeItem.sideOffset ?? (isTopHanging ? 0 : 20))
    : (activeItem.mobileHorizontalOffset ?? (isTopHanging ? 0 : 10));

  const currentVOffset = isWebTab
    ? (isBottom ? (activeItem.bottomOffset ?? 20) : (activeItem.topOffset ?? (currentPlacement.startsWith('top_') ? 20 : 110)))
    : (isBottom ? (activeItem.mobileBottomOffset ?? 20) : (activeItem.mobileTopOffset ?? 100));

  const currentDelay = activeItem.autoCollapseDelay ?? 10;

  const handleHOffsetChange = (val: number) => {
    const clamped = Math.min(250, Math.max(0, val));
    if (isWebTab) {
      updateCurrentItem({ horizontalOffset: clamped, sideOffset: clamped });
    } else {
      updateCurrentItem({ mobileHorizontalOffset: clamped });
    }
  };

  const handleVOffsetChange = (val: number) => {
    const clamped = Math.min(250, Math.max(0, val));
    if (isWebTab) {
      if (isBottom) updateCurrentItem({ bottomOffset: clamped });
      else updateCurrentItem({ topOffset: clamped });
    } else {
      if (isBottom) updateCurrentItem({ mobileBottomOffset: clamped });
      else updateCurrentItem({ mobileTopOffset: clamped });
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
      background: 'var(--bg-secondary, rgba(15, 23, 42, 0.45))',
      padding: '6px 10px',
      borderRadius: '6px',
      border: '1px solid var(--border-subtle)',
      marginBottom: '8px',
    }}>
      {/* 1. Sol Kısım: Başlık & Hedef Cihaz */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
          {isWebTab ? 'Masaüstü Konum & Boyut:' : 'Mobil Konum & Boyut:'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Hedef:</span>
          <select
            className="form-select"
            value={activeItem.deviceTarget || 'all'}
            onChange={(e) => updateCurrentItem({ deviceTarget: e.target.value as any })}
            style={{ fontSize: '10px', height: '23px', padding: '1px 4px', fontWeight: 600 }}
          >
            <option value="all">Tüm Cihazlar</option>
            <option value="desktop">Yalnızca Masaüstü</option>
            <option value="mobile">Yalnızca Mobil</option>
          </select>
        </div>
      </div>

      {/* 2. Web Sahne Genişliği Açılır Menüsü */}
      {isWebTab && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Sahne:</span>
          <select
            className="form-select"
            value={previewWebWidth}
            onChange={(e) => setPreviewWebWidth?.(parseInt(e.target.value, 10))}
            style={{ fontSize: '10px', height: '23px', padding: '1px 5px', minWidth: '95px' }}
            title="Masaüstü Web Önizleme Sahne Genişliği"
          >
            <option value={1160}>1160px (Standart)</option>
            <option value={1024}>1024px (Laptop)</option>
            <option value={1280}>1280px (HD)</option>
            <option value={1440}>1440px (Geniş)</option>
            <option value={1920}>1920px (Full HD)</option>
          </select>
        </div>
      )}

      {/* 3. Orta Kısım: Boyutlar & Sürgüler */}
      {isTopHanging ? (
        <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          ↑ Üst Tam Bant (Klasik Şerit) seçili — Boyut ve ofset otomatik uygulanır.
        </span>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Genişlik */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title="Kart Genişliği">
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Genişlik:</span>
            <input
              type="number"
              className="form-input"
              placeholder={isWebTab ? '310' : (activeItem.cardWidth ? String(activeItem.cardWidth) : '220')}
              value={(isWebTab ? activeItem.cardWidth : activeItem.mobileCardWidth) ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                if (isWebTab) updateCurrentItem({ cardWidth: val });
                else updateCurrentItem({ mobileCardWidth: val });
              }}
              style={{ width: '48px', height: '22px', fontSize: '10px', textAlign: 'center', padding: '1px' }}
            />
            <span style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>px</span>
          </div>

          {/* Yükseklik */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title="Kart Yüksekliği (boş=otomatik)">
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Yükseklik:</span>
            <input
              type="number"
              className="form-input"
              placeholder={isWebTab ? 'Oto' : (activeItem.cardHeight ? String(activeItem.cardHeight) : 'Oto')}
              value={(isWebTab ? activeItem.cardHeight : activeItem.mobileCardHeight) ?? ''}
              onChange={(e) => {
                const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                if (isWebTab) updateCurrentItem({ cardHeight: val });
                else updateCurrentItem({ mobileCardHeight: val });
              }}
              style={{ width: '48px', height: '22px', fontSize: '10px', textAlign: 'center', padding: '1px' }}
            />
            <span style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>px</span>
          </div>

          {/* Yatay Ofset Sürgüsü */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Yatay Ofset">
            <Sliders size={11} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Yatay:</span>
            <input
              type="range" min="0" max="250" step="5" value={currentHOffset}
              onChange={(e) => handleHOffsetChange(parseInt(e.target.value, 10))}
              style={{ width: '85px', height: '4px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
            />
            <input
              type="number" min="0" max="250" value={currentHOffset}
              onChange={(e) => handleHOffsetChange(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
              style={{ width: '38px', height: '22px', fontSize: '9.5px', textAlign: 'center', padding: '1px' }}
              className="form-input"
            />
            <span style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>px</span>
          </div>

          {/* Dikey Ofset Sürgüsü */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Dikey Ofset">
            <Sliders size={11} style={{ color: '#10b981', flexShrink: 0 }} />
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Dikey:</span>
            <input
              type="range" min="0" max="250" step="5" value={currentVOffset}
              onChange={(e) => handleVOffsetChange(parseInt(e.target.value, 10))}
              style={{ width: '85px', height: '4px', cursor: 'pointer', accentColor: '#10b981' }}
            />
            <input
              type="number" min="0" max="250" value={currentVOffset}
              onChange={(e) => handleVOffsetChange(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
              style={{ width: '38px', height: '22px', fontSize: '9.5px', textAlign: 'center', padding: '1px' }}
              className="form-input"
            />
            <span style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>px</span>
          </div>
        </div>
      )}

      {/* 4. Sağ Kısım: Kulakçık Metni, Süre ve Küçülme */}
      {!isTopHanging && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title="Kulakçık Metni">
            <span style={{ fontSize: '9.5px', color: 'var(--text-muted)' }}>Kulakçık:</span>
            <input
              type="text" className="form-input" placeholder="SİZİN İÇİN"
              value={activeItem.tabText ?? ''}
              onChange={(e) => updateCurrentItem({ tabText: e.target.value })}
              style={{ width: '80px', height: '22px', fontSize: '9.5px', padding: '1px 4px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }} title="Açık kalma süresi">
            <Clock size={10} color="var(--text-muted)" />
            <input
              type="number" min="0" max="300" placeholder="10"
              value={currentDelay}
              onChange={(e) => updateCurrentItem({ autoCollapseDelay: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })}
              style={{ width: '34px', height: '22px', fontSize: '9.5px', textAlign: 'center', padding: '1px' }}
              className="form-input"
            />
            <span style={{ fontSize: '8.5px', color: 'var(--text-muted)' }}>sn</span>
          </div>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '9.5px', cursor: 'pointer', color: 'var(--text-secondary)' }} title="Sayfa kaydırıldığında otomatik küçül">
            <input
              type="checkbox"
              checked={activeItem.autoCollapseOnScroll !== false}
              onChange={(e) => updateCurrentItem({ autoCollapseOnScroll: e.target.checked })}
            />
            <span>Küçül</span>
          </label>
        </div>
      )}
    </div>
  );
};
