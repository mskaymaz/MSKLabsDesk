import React, { useState } from 'react';
import { Monitor, Smartphone, Sliders, Clock, Compass } from 'lucide-react';
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
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      background: 'var(--bg-secondary, rgba(15, 23, 42, 0.4))',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid var(--border-subtle)',
    }}>
      {/* 1. Üst Satır: Başlık & Hedef Cihaz Kapsamı (En Üst Hiyerarşide) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Compass size={15} color="var(--accent-primary, #3b82f6)" />
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Yerleşim, Harita & Konumlandırma Stüdyosu
          </span>
        </div>

        {/* Hedef Cihaz Seçici (En üstte) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Hedef Cihaz:
          </span>
          <select
            className="form-select"
            value={activeItem.deviceTarget || 'all'}
            onChange={(e) => updateCurrentItem({ deviceTarget: e.target.value as any })}
            style={{ fontSize: '11px', height: '26px', padding: '1px 6px', fontWeight: 600 }}
          >
            <option value="all">Tüm Cihazlar (Masaüstü & Mobil)</option>
            <option value="desktop">Yalnızca Masaüstü</option>
            <option value="mobile">Yalnızca Mobil</option>
          </select>
        </div>
      </div>

      {/* 2. Ana Çalışma Alanı: Yan Yana İki Panel (Harita ve Sürgüler/Ayarlar) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(280px, 1.3fr)',
        gap: '14px',
        alignItems: 'start',
      }}>
        {/* Sol Panel: Harita Görseli ve Hemen Üstündeki Web / Mobil Sekmeleri */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(0,0,0,0.1)',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
        }}>
          {/* Web (Masaüstü) / Mobil Seçim Düğmeleri - Haritanın Tam Üstünde */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Harita Görünümü:
            </span>
            <div style={{
              display: 'inline-flex',
              borderRadius: '5px',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-primary, #0f172a)',
            }}>
              <button
                type="button"
                onClick={() => setActiveDeviceTab('desktop')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 9px', fontSize: '10px',
                  border: 'none', background: isWebTab ? 'var(--accent-primary, #2563eb)' : 'transparent',
                  color: isWebTab ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: isWebTab ? 700 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                <Monitor size={11} /><span>Web (Masaüstü)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveDeviceTab('mobile')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 9px', fontSize: '10px',
                  border: 'none', background: !isWebTab ? 'var(--accent-primary, #2563eb)' : 'transparent',
                  color: !isWebTab ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: !isWebTab ? 700 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                <Smartphone size={11} /><span>Mobil</span>
              </button>
            </div>
          </div>

          {/* Görsel Silüet Haritası (İşaretleme Alanı) */}
          <AnnouncementSlotMapSelector
            device={activeDeviceTab}
            currentPlacement={currentPlacement}
            onSelectPlacement={handlePlacementChange}
          />
        </div>

        {/* Sağ Panel: Boyut, Ofset Sürgüleri, Süre ve Kulakçık Ayarları */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(0,0,0,0.1)',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {isWebTab ? 'Masaüstü Konum & Boyut Ayarları' : 'Mobil Konum & Boyut Ayarları'}
            </span>
            <span style={{ fontSize: '9.5px', color: 'var(--accent-primary)', fontWeight: 600 }}>
              Aktif: {currentPlacement}
            </span>
          </div>

          {isTopHanging ? (
            <div style={{
              padding: '16px 12px',
              textAlign: 'center',
              background: 'rgba(59,130,246,0.06)',
              borderRadius: '6px',
              border: '1px dashed rgba(59,130,246,0.3)',
              color: 'var(--text-secondary)',
              fontSize: '11px',
            }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Üst Tam Bant (Klasik Şerit) Seçili</p>
              <p style={{ margin: '4px 0 0', fontSize: '9.5px', color: 'var(--text-muted)' }}>
                Bu modda duyuru web sayfasının veya mobil ekranın en üstünde tam genişlikte yer alır. Yatay ve dikey ofset gerekmez.
              </p>
            </div>
          ) : (
            <>
              {/* Cihaza Özel Kart Boyutları (Genişlik & Yükseklik) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '9.5px', color: 'var(--text-muted)', marginBottom: '2px' }}>
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
                    style={{ fontSize: '11px', height: '26px', padding: '2px 6px' }}
                    title="Duyuru kartı genişliği"
                  />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '9.5px', color: 'var(--text-muted)', marginBottom: '2px' }}>
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
                    style={{ fontSize: '11px', height: '26px', padding: '2px 6px' }}
                    title="Duyuru kartı yüksekliği (boş bırakılırsa içeriğe göre otomatik)"
                  />
                </div>
              </div>

              {/* Yatay ve Dikey Slider Kontrolleri */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sliders size={12} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', minWidth: '72px' }}>
                    Yatay: {currentHOffset}px
                  </span>
                  <input
                    type="range" min="0" max="250" step="5" value={currentHOffset}
                    onChange={(e) => handleHOffsetChange(parseInt(e.target.value, 10))}
                    style={{ flex: 1, cursor: 'pointer' }}
                    title="Kenardan içe doğru yatay ofset"
                  />
                  <input
                    type="number" min="0" max="250" value={currentHOffset}
                    onChange={(e) => handleHOffsetChange(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                    style={{ width: '46px', height: '22px', fontSize: '10px', textAlign: 'center', padding: '1px' }}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sliders size={12} style={{ color: '#10b981', flexShrink: 0 }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', minWidth: '72px' }}>
                    Dikey: {currentVOffset}px
                  </span>
                  <input
                    type="range" min="0" max="250" step="5" value={currentVOffset}
                    onChange={(e) => handleVOffsetChange(parseInt(e.target.value, 10))}
                    style={{ flex: 1, cursor: 'pointer' }}
                    title="Üstten veya alttan dikey ofset"
                  />
                  <input
                    type="number" min="0" max="250" value={currentVOffset}
                    onChange={(e) => handleVOffsetChange(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                    style={{ width: '46px', height: '22px', fontSize: '10px', textAlign: 'center', padding: '1px' }}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Kulakçık Metni, Açık Süre & Kaydırınca Küçül */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '8px', alignItems: 'end' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '9.5px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    Kulakçık Metni:
                  </span>
                  <input
                    type="text" className="form-input" placeholder="SİZİN İÇİN"
                    value={activeItem.tabText ?? ''}
                    onChange={(e) => updateCurrentItem({ tabText: e.target.value })}
                    style={{ fontSize: '10.5px', height: '26px', padding: '2px 6px' }}
                  />
                </div>

                <div>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '9.5px', color: 'var(--text-muted)', marginBottom: '2px' }}>
                    <Clock size={10} /> Açık Süre (sn):
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <input
                      type="number" min="0" max="300" placeholder="10"
                      value={currentDelay}
                      onChange={(e) => updateCurrentItem({ autoCollapseDelay: e.target.value === '' ? 0 : parseInt(e.target.value, 10) })}
                      style={{ width: '42px', height: '26px', fontSize: '10px', textAlign: 'center', padding: '1px' }}
                      className="form-input"
                      title="Saniye cinsinden açık kalma süresi (0=manuel)"
                    />
                    <div style={{ display: 'inline-flex', gap: '2px' }}>
                      {[5, 10, 15].map((s) => (
                        <button
                          key={s} type="button" onClick={() => updateCurrentItem({ autoCollapseDelay: s })}
                          style={{
                            border: '1px solid var(--border-subtle)', borderRadius: '3px', padding: '2px 5px',
                            fontSize: '9.5px', background: currentDelay === s ? 'var(--accent-primary)' : 'transparent',
                            color: currentDelay === s ? '#fff' : 'var(--text-secondary)', cursor: 'pointer',
                          }}
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', cursor: 'pointer', color: 'var(--text-secondary)' }} title="Sayfa kaydırıldığında otomatik küçül">
                  <input
                    type="checkbox"
                    checked={activeItem.autoCollapseOnScroll !== false}
                    onChange={(e) => updateCurrentItem({ autoCollapseOnScroll: e.target.checked })}
                  />
                  <span>Sayfa aşağı kaydırılınca otomatik kulakçığa küçül</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

