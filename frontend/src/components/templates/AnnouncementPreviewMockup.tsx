import React, { useState } from 'react';
import { Sparkles, X, ExternalLink, Sun, Moon, Smartphone, Monitor, Lock } from 'lucide-react';
import { type AnnouncementItem, BANNER_THEMES, getSizeMetrics } from './announcementConfig';

export interface AnnouncementPreviewMockupProps {
  activeItem: AnnouncementItem;
  announcementActive: boolean;
  announcementText: { tr: string; en: string; ar: string };
  activeLangTab: 'tr' | 'en' | 'ar';
  setActiveLangTab: (lang: 'tr' | 'en' | 'ar') => void;
  previewDevice?: 'desktop' | 'mobile';
  setPreviewDevice?: (device: 'desktop' | 'mobile') => void;
  previewWebWidth?: number;
}

export const AnnouncementPreviewMockup: React.FC<AnnouncementPreviewMockupProps> = ({
  activeItem,
  announcementActive,
  announcementText,
  activeLangTab,
  setActiveLangTab,
  previewDevice: controlledDevice,
  setPreviewDevice: setControlledDevice,
  previewWebWidth = 1160,
}) => {
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('light');
  const [internalDevice, setInternalDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isFloatingCollapsed, setIsFloatingCollapsed] = useState<boolean>(false);

  const previewDevice = controlledDevice ?? internalDevice;
  const setPreviewDevice = setControlledDevice ?? setInternalDevice;
  const isMobile = previewDevice === 'mobile';
  const currentPlacement = (isMobile && activeItem.mobilePlacement) ? activeItem.mobilePlacement : (activeItem.placement || 'top_hanging');
  const isDark = previewTheme === 'dark';
  const currentThemeObj = BANNER_THEMES.find((b) => b.id === (activeItem.bannerType || 'info')) || BANNER_THEMES[0];
  const currentBgOpacity = activeItem.bgOpacity ?? activeItem.opacity ?? 95;
  const currentTextOpacity = activeItem.textOpacity ?? 100;
  const previewLink = activeItem.targetUrl || activeItem.ctaUrl;
  const sizeMetrics = getSizeMetrics(activeItem, currentPlacement, isMobile);
  const isTicker = (activeItem.displayMode || 'static') === 'ticker';
  const isRotator = (activeItem.displayMode || 'static') === 'rotator';

  const isLeftSlot = currentPlacement === 'left_floating' || currentPlacement === 'top_left' || currentPlacement === 'bottom_left';
  const isRightSlot = currentPlacement === 'right_floating' || currentPlacement === 'top_right' || currentPlacement === 'bottom_right';
  const isCenterSlot = currentPlacement === 'bottom_center';
  const isBottomSlot = currentPlacement.startsWith('bottom_');

  const isCustomTheme = activeItem.bannerType === 'custom';
  const previewBg = isCustomTheme ? (activeItem.customBg || (isDark ? '#1e293b' : '#f8fafc')) : (isDark ? currentThemeObj.bgDark : currentThemeObj.bgLight);
  const previewText = isCustomTheme ? (activeItem.customText || (isDark ? '#f8fafc' : '#0f172a')) : (isDark ? currentThemeObj.textColorDark : currentThemeObj.textColorLight);

  const placementLabelMap: Record<string, string> = {
    top_hanging: 'Üst Şerit', top_left: 'Sol Üst', top_right: 'Sağ Üst',
    bottom_left: 'Sol Alt', bottom_center: 'Orta Alt', bottom_right: 'Sağ Alt',
    left_floating: 'Sol Kenar', right_floating: 'Sağ Kenar',
  };

  const stageWidth = isMobile ? '380px' : (previewWebWidth > 0 ? `${previewWebWidth}px` : '100%');

  return (
    <div style={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center', marginBottom: '14px', padding: '2px 0 6px 0' }}>
      <div style={{
        width: stageWidth,
        flexShrink: 0,
        background: isDark ? '#070a13' : '#F1F5F9',
        border: '2px solid var(--border-subtle, #334155)',
        borderRadius: '10px',
        boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.08)',
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}>
        <style>{`.ann-card-preview-content::-webkit-scrollbar { display: none !important; width: 0 !important; height: 0 !important; }`}</style>

        {/* 1. Mockup Pencere Başlık Çubuğu (Tarayıcı Barı) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 12px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', borderBottom: '1px solid var(--border-subtle, #334155)', fontSize: '11px', color: 'var(--text-secondary)', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '9.5px', color: 'var(--text-muted)' }}>
              <Lock size={9} style={{ color: '#10b981' }} />
              <span>msklabs.org</span>
              <span style={{ opacity: 0.5 }}>({stageWidth})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: 'var(--text-primary)', fontSize: '10.5px' }}>
              <Sparkles size={11} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ color: 'var(--accent-amber, #f59e0b)' }}>{activeItem.title}</span>
              <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', fontWeight: 500 }}>({placementLabelMap[currentPlacement] || currentPlacement})</span>
            </div>
          </div>

          {/* Sağ: Açık/Kulakçık Önizleme Düğmeleri, Cihaz, Dil ve Tema */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {currentPlacement !== 'top_hanging' && (
              <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--accent-primary, #2563eb)', background: 'var(--bg-primary, #0f172a)' }}>
                <button
                  type="button" onClick={() => setIsFloatingCollapsed(false)}
                  style={{ padding: '2px 8px', fontSize: '9.5px', fontWeight: !isFloatingCollapsed ? 800 : 500, border: 'none', background: !isFloatingCollapsed ? 'var(--accent-primary, #2563eb)' : 'transparent', color: !isFloatingCollapsed ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer' }}
                  title="Duyurunun tam açık kart halini görüntüle"
                >
                  📂 Açık Hali
                </button>
                <button
                  type="button" onClick={() => setIsFloatingCollapsed(true)}
                  style={{ padding: '2px 8px', fontSize: '9.5px', fontWeight: isFloatingCollapsed ? 800 : 500, border: 'none', background: isFloatingCollapsed ? 'var(--accent-primary, #2563eb)' : 'transparent', color: isFloatingCollapsed ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer' }}
                  title="Duyurunun kapalı kulakçık / rozet halini görüntüle"
                >
                  🔖 Kulakçık Hali
                </button>
              </div>
            )}

            <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <button type="button" onClick={() => setPreviewDevice('desktop')} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 6px', fontSize: '9.5px', border: 'none', background: previewDevice === 'desktop' ? 'var(--accent-primary)' : 'transparent', color: previewDevice === 'desktop' ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer' }} title="Masaüstü">
                <Monitor size={10} /><span>Web</span>
              </button>
              <button type="button" onClick={() => setPreviewDevice('mobile')} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 6px', fontSize: '9.5px', border: 'none', background: previewDevice === 'mobile' ? 'var(--accent-primary)' : 'transparent', color: previewDevice === 'mobile' ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer' }} title="Mobil">
                <Smartphone size={10} /><span>Mobil</span>
              </button>
            </div>

            <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              {(['tr', 'en', 'ar'] as const).map((lang) => (
                <button key={lang} type="button" onClick={() => setActiveLangTab(lang)} style={{ padding: '2px 6px', fontSize: '9.5px', fontWeight: activeLangTab === lang ? 700 : 500, border: 'none', background: activeLangTab === lang ? 'var(--accent-primary)' : 'transparent', color: activeLangTab === lang ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer' }}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button type="button" onClick={() => setPreviewTheme(isDark ? 'light' : 'dark')} style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 6px', fontSize: '9.5px', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              {isDark ? <Sun size={10} /> : <Moon size={10} />}
            </button>
          </div>
        </div>

        {/* 2. Web Sayfası İç Gövdesi (Sahne) */}
        <div style={{ position: 'relative', background: isDark ? '#0b1120' : '#FFFFFF', minHeight: isMobile ? '320px' : '250px', display: 'flex', flexDirection: 'column' }}>
          {/* Üst Şerit (Top Hanging Banner) */}
          {currentPlacement === 'top_hanging' && (
            <div
              dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
              onClick={(e: React.MouseEvent) => {
                if ((e.target as HTMLElement).closest('button')) return;
                if (previewLink) window.open(previewLink, '_blank', 'noopener,noreferrer');
              }}
              style={{
                position: 'relative', borderBottom: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight,
                minHeight: sizeMetrics.minHeight, height: isTicker ? sizeMetrics.minHeight : 'auto',
                boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
                backdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
                WebkitBackdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
                overflow: 'hidden', display: 'flex', alignItems: 'center', cursor: previewLink ? 'pointer' : 'default',
                zIndex: 20,
              }}
            >
              <div style={{ position: 'absolute', inset: 0, background: previewBg, opacity: announcementActive ? currentBgOpacity / 100 : 0.3, zIndex: 0, pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1160px', margin: '0 auto', padding: sizeMetrics.padding, fontSize: sizeMetrics.fontSize, color: previewText, opacity: announcementActive ? currentTextOpacity / 100 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, overflow: isTicker ? 'hidden' : 'visible' }}>
                  <span style={{ display: 'inline-flex', flexShrink: 0, marginTop: '1px' }}>{currentThemeObj.icon}</span>
                  {isTicker ? (
                    <div className="ann-ticker-wrap">
                      <div className="ann-ticker-track" style={{ animation: `${(activeItem.tickerDirection || 'rtl') === 'ltr' ? 'marqueeLTR' : 'marqueeRTL'} ${(activeItem.tickerSpeed || 'normal') === 'slow' ? '28s' : (activeItem.tickerSpeed || 'normal') === 'fast' ? '10s' : '18s'} linear infinite` }} dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Duyuru metni...' }} />
                    </div>
                  ) : isRotator ? (
                    <div style={{ flex: 1, overflow: 'hidden', height: '22px', display: 'flex', alignItems: 'center' }}>
                      <div className="ann-rotator-line" style={{ animation: 'annFadeRotate 4.5s ease-in-out infinite' }} dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Duyuru içeriği...' }} />
                    </div>
                  ) : (
                    <div className="ann-rich-content" style={{ flex: 1, display: 'flex', alignItems: 'center', margin: 0, lineHeight: 1.25 }} dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Duyuru içeriği...' }} />
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {activeItem.ctaText && (
                    <a href={previewLink || '#'} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 9px', fontSize: '10px', fontWeight: 700, borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)', color: 'inherit' }}>
                      {activeItem.ctaText} <ExternalLink size={9} />
                    </a>
                  )}
                  {activeItem.isDismissable && <button type="button" style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, padding: '2px', cursor: 'pointer' }}><X size={13} /></button>}
                </div>
              </div>
            </div>
          )}

          {/* Gerçekçi Web Başlığı (Header) */}
          <div style={{
            height: '32px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
            background: isDark ? '#0f172a' : '#FFFFFF', zIndex: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '11px', color: isDark ? '#F8FAFC' : '#0F172A' }}>
              <span style={{ color: 'var(--accent-primary, #3b82f6)' }}>❖</span>
              <span>MSK Labs</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '9.5px', color: isDark ? '#94A3B8' : '#64748B' }}>
              <span>Blog</span>
              <span>Yazılımlar</span>
              <span>Hakkında</span>
              <span>Destek</span>
            </div>
          </div>

          {/* Gerçekçi Sayfa İçeriği & Grid (Standart 1160px / 900px Temsili) */}
          <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Hero Tanıtım Kartı */}
              <div style={{
                background: isDark ? 'rgba(30, 41, 59, 0.5)' : '#F8FAFC',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                borderRadius: '8px', padding: '14px 18px', textAlign: 'center',
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: isDark ? '#F1F5F9' : '#1E293B', marginBottom: '4px' }}>
                  MSK Labs — Özgün, Kullanıcı Odaklı ve Güvenli Çözümler
                </div>
                <div style={{ height: '6px', width: '60%', background: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0', borderRadius: '3px', margin: '0 auto 6px auto' }} />
                <div style={{ height: '6px', width: '40%', background: isDark ? 'rgba(255,255,255,0.05)' : '#EDF2F7', borderRadius: '3px', margin: '0 auto' }} />
              </div>

              {/* 2 Sütunlu Kart Silüeti */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px' }}>
                <div style={{ background: isDark ? 'rgba(30, 41, 59, 0.3)' : '#FAFAFA', border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #F1F5F9', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ height: '8px', width: '50%', background: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0', borderRadius: '4px', marginBottom: '6px' }} />
                  <div style={{ height: '6px', width: '80%', background: isDark ? 'rgba(255,255,255,0.05)' : '#EDF2F7', borderRadius: '3px' }} />
                </div>
                <div style={{ background: isDark ? 'rgba(30, 41, 59, 0.3)' : '#FAFAFA', border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #F1F5F9', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ height: '8px', width: '50%', background: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0', borderRadius: '4px', marginBottom: '6px' }} />
                  <div style={{ height: '6px', width: '80%', background: isDark ? 'rgba(255,255,255,0.05)' : '#EDF2F7', borderRadius: '3px' }} />
                </div>
              </div>
            </div>

            {/* Kayan / Sabit Pozisyonlu Duyuru (Floating Card veya Askı Kulakçık) */}
            {currentPlacement !== 'top_hanging' && (
              isFloatingCollapsed ? (
                /* Kompakt Kulakçık / Rozet Hali */
                <div
                  onClick={() => setIsFloatingCollapsed(false)}
                  style={{
                    position: 'absolute',
                    top: isBottomSlot ? 'auto' : `${sizeMetrics.topOffset}px`,
                    bottom: isBottomSlot ? `${sizeMetrics.bottomOffset}px` : 'auto',
                    left: isLeftSlot ? `${sizeMetrics.horizontalOffset ?? 20}px` : isCenterSlot ? '50%' : 'auto',
                    right: isRightSlot ? `${sizeMetrics.horizontalOffset ?? 20}px` : 'auto',
                    transform: isCenterSlot ? 'translateX(-50%)' : 'none',
                    zIndex: 30,
                    width: 'fit-content', minWidth: '24px',
                    padding: isBottomSlot ? '5px 14px' : '12px 5px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    writingMode: isBottomSlot ? 'horizontal-tb' : 'vertical-rl',
                    textOrientation: 'mixed', letterSpacing: '0.6px', fontSize: '9.5px', fontWeight: 800, cursor: 'pointer',
                    background: previewBg, color: previewText, border: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight,
                    borderRadius: isBottomSlot ? '16px' : isLeftSlot ? '0 8px 8px 0' : '8px 0 0 8px',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.22)',
                    backdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
                    transition: 'all 0.2s ease', userSelect: 'none',
                  }}
                  title="Tıklayarak açık kart halini görüntüleyin"
                >
                  <span>{activeItem.tabText || 'SİZİN İÇİN'}</span>
                </div>
              ) : (
                /* Tam Açık Kart Hali */
                <div
                  dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                  onClick={(e: React.MouseEvent) => {
                    if ((e.target as HTMLElement).closest('button')) return;
                    if (previewLink) window.open(previewLink, '_blank', 'noopener,noreferrer');
                  }}
                  style={{
                    position: 'absolute',
                    top: isBottomSlot ? 'auto' : `${sizeMetrics.topOffset}px`,
                    bottom: isBottomSlot ? `${sizeMetrics.bottomOffset}px` : 'auto',
                    left: isLeftSlot ? `${sizeMetrics.horizontalOffset ?? 20}px` : isCenterSlot ? '50%' : 'auto',
                    right: isRightSlot ? `${sizeMetrics.horizontalOffset ?? 20}px` : 'auto',
                    transform: isCenterSlot ? 'translateX(-50%)' : 'none',
                    zIndex: 30,
                    width: sizeMetrics.width,
                    maxWidth: `calc(100% - ${(sizeMetrics.horizontalOffset ?? 20) * 2}px)`,
                    height: sizeMetrics.height,
                    boxSizing: 'border-box',
                    border: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight,
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                    backdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
                    WebkitBackdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
                    overflow: 'hidden',
                    cursor: previewLink ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: previewBg, opacity: announcementActive ? currentBgOpacity / 100 : 0.3, zIndex: 0, pointerEvents: 'none' }} />
                  <div style={{ position: 'relative', zIndex: 1, padding: sizeMetrics.padding, fontSize: sizeMetrics.fontSize, color: previewText, opacity: announcementActive ? currentTextOpacity / 100 : 0.45, display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 800 }}>
                        {currentThemeObj.icon} <span>{activeItem.title}</span>
                      </div>
                      {activeItem.isDismissable && (
                        <button type="button" onClick={(e) => { e.stopPropagation(); setIsFloatingCollapsed(true); }} style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, padding: '2px', cursor: 'pointer' }} title="Kulakçığa küçült">
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    {/* Kaydırma Çubuğu Gizlenmiş (Touch Scroll Aktif) İçerik Alanı */}
                    <div
                      className="ann-card-preview-content"
                      style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none', maxWidth: '100%', boxSizing: 'border-box', marginBottom: '4px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', WebkitOverflowScrolling: 'touch' }}
                      dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Zengin içerik...' }}
                    />
                    {activeItem.ctaText && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <a href={previewLink || '#'} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ textDecoration: 'none', color: 'inherit', fontSize: '9.5px', fontWeight: 700 }}>
                          {activeItem.ctaText} ➔
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
