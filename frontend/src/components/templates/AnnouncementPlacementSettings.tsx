import React, { useState } from 'react';
import { Monitor, Smartphone, Sliders, Clock } from 'lucide-react';
import { type AnnouncementItem, type AnnouncementPlacement } from './announcementConfig';
import { AnnouncementSlotMapSelector } from './AnnouncementSlotMapSelector';

export interface AnnouncementPlacementSettingsProps {
  activeItem: AnnouncementItem;
  updateCurrentItem: (updates: Partial<AnnouncementItem>) => void;
  deviceTab?: 'desktop' | 'mobile';
  setDeviceTab?: (device: 'desktop' | 'mobile') => void;
}

export const AnnouncementPlacementSettings: React.FC<AnnouncementPlacementSettingsProps> = ({
  activeItem,
  updateCurrentItem,
  deviceTab,
  setDeviceTab,
}) => {
  const [internalDeviceTab, setInternalDeviceTab] = useState<'desktop' | 'mobile'>('desktop');
  const activeDeviceTab = deviceTab ?? internalDeviceTab;
  const setActiveDeviceTab = setDeviceTab ?? setInternalDeviceTab;
  const isWebTab = activeDeviceTab === 'desktop';
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

  const handlePlacementChange = (newPlacement: AnnouncementPlacement) => {
    if (isWebTab) {
      updateCurrentItem({ placement: newPlacement });
    } else {
      updateCurrentItem({ mobilePlacement: newPlacement });
    }
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Cihaz Sekmesi & Hedef Kapsam */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
        <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
          <button
            type="button"
            onClick={() => setActiveDeviceTab('desktop')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', fontSize: '10px',
              border: 'none', background: isWebTab ? 'var(--accent-primary)' : 'transparent',
              color: isWebTab ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: isWebTab ? 700 : 500,
            }}
          >
            <Monitor size={11} /><span>Web (Masaüstü)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveDeviceTab('mobile')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', fontSize: '10px',
              border: 'none', background: !isWebTab ? 'var(--accent-primary)' : 'transparent',
              color: !isWebTab ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: !isWebTab ? 700 : 500,
            }}
          >
            <Smartphone size={11} /><span>Mobil</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Hedef Cihaz:</span>
          <select
            className="form-select"
            value={activeItem.deviceTarget || 'all'}
            onChange={(e) => updateCurrentItem({ deviceTarget: e.target.value as any })}
            style={{ fontSize: '10px', height: '24px', padding: '1px 4px' }}
          >
            <option value="all">Tüm Cihazlar</option>
            <option value="desktop">Yalnızca Masaüstü</option>
            <option value="mobile">Yalnızca Mobil</option>
          </select>
        </div>
      </div>

      {/* Görsel Silüet Haritası (Yuva Seçici) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {isWebTab ? 'Masaüstü Yuva Haritası (Tıklayarak Seçin):' : 'Mobil Yuva Haritası (Tıklayarak Seçin):'}
        </span>
        <AnnouncementSlotMapSelector
          device={activeDeviceTab}
          currentPlacement={currentPlacement}
          onSelectPlacement={handlePlacementChange}
        />
      </div>

      {!isTopHanging && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.12)', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
          {/* Cihaza Özel Kart Boyutları (Genişlik & Yükseklik) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>
                {isWebTab ? 'Web Genişlik (px):' : 'Mobil Genişlik (px):'}
              </span>
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
                style={{ fontSize: '10px', height: '24px', padding: '2px 5px' }}
                title="Duyuru kartı genişliği"
              />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>
                {isWebTab ? 'Web Yükseklik (px):' : 'Mobil Yükseklik (px):'}
              </span>
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
                style={{ fontSize: '10px', height: '24px', padding: '2px 5px' }}
                title="Duyuru kartı yüksekliği (boş bırakılırsa içeriğe göre otomatik)"
              />
            </div>
          </div>

          {/* Yatay ve Dikey Slider Kontrolleri */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sliders size={12} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', minWidth: '70px' }}>
              Yatay: {currentHOffset}px
            </span>
            <input
              type="range" min="0" max="250" step="5" value={currentHOffset}
              onChange={(e) => handleHOffsetChange(parseInt(e.target.value, 10))}
              style={{ flex: 1, cursor: 'pointer' }}
              title="Sağa/Sola doğru kaydırma ofseti"
            />
            <input
              type="number" min="0" max="250" value={currentHOffset}
              onChange={(e) => handleHOffsetChange(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
              style={{ width: '44px', height: '22px', fontSize: '10px', textAlign: 'center', padding: '1px' }}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sliders size={12} style={{ color: '#10b981', flexShrink: 0 }} />
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', minWidth: '70px' }}>
              Dikey: {currentVOffset}px
            </span>
            <input
              type="range" min="0" max="250" step="5" value={currentVOffset}
              onChange={(e) => handleVOffsetChange(parseInt(e.target.value, 10))}
              style={{ flex: 1, cursor: 'pointer' }}
              title="Yukarı/Aşağı doğru dikey ofset"
            />
            <input
              type="number" min="0" max="250" value={currentVOffset}
              onChange={(e) => handleVOffsetChange(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
              style={{ width: '44px', height: '22px', fontSize: '10px', textAlign: 'center', padding: '1px' }}
              className="form-input"
            />
          </div>
        </div>
      )}

      {/* Süre, Serbest Saniye Girişi & Kulakçık Metni */}
      {!isTopHanging && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr 1fr', gap: '6px', alignItems: 'flex-end', paddingTop: '4px' }}>
          <div>
            <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Kulakçık Metni:</span>
            <input
              type="text" className="form-input" placeholder="SİZİN İÇİN"
              value={activeItem.tabText ?? ''}
              onChange={(e) => updateCurrentItem({ tabText: e.target.value })}
              style={{ fontSize: '10px', height: '24px', padding: '2px 5px' }}
            />
          </div>

          <div>
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '9px', color: 'var(--text-muted)' }}>
              <Clock size={10} /> Açık Süre (sn):
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <input
                type="number" min="0" max="300" placeholder="10"
                value={currentDelay}
                onChange={(e) => updateCurrentItem({ autoCollapseDelay: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })}
                style={{ width: '42px', height: '24px', fontSize: '10px', textAlign: 'center', padding: '1px' }}
                className="form-input"
                title="Saniye cinsinden açık kalma süresi (0=manuel)"
              />
              <div style={{ display: 'inline-flex', gap: '2px' }}>
                {[5, 10, 15].map((s) => (
                  <button
                    key={s} type="button" onClick={() => updateCurrentItem({ autoCollapseDelay: s })}
                    style={{
                      border: '1px solid var(--border-subtle)', borderRadius: '3px', padding: '1px 4px',
                      fontSize: '9px', background: currentDelay === s ? 'var(--accent-primary)' : 'transparent',
                      color: currentDelay === s ? '#fff' : 'var(--text-secondary)', cursor: 'pointer',
                    }}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '9px', cursor: 'pointer', color: 'var(--text-secondary)', height: '24px' }} title="Sayfa kaydırıldığında otomatik küçül">
              <input
                type="checkbox"
                checked={activeItem.autoCollapseOnScroll !== false}
                onChange={(e) => updateCurrentItem({ autoCollapseOnScroll: e.target.checked })}
              />
              <span>Kaydırınca Küçül</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
