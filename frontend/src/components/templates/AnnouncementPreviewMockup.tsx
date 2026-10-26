import React, { useState } from 'react';
import { Sparkles, X, ExternalLink, Sun, Moon, Smartphone, Monitor } from 'lucide-react';
import { type AnnouncementItem, BANNER_THEMES, getSizeMetrics } from './announcementConfig';

export interface AnnouncementPreviewMockupProps {
  activeItem: AnnouncementItem;
  announcementActive: boolean;
  announcementText: { tr: string; en: string; ar: string };
  activeLangTab: 'tr' | 'en' | 'ar';
  setActiveLangTab: (lang: 'tr' | 'en' | 'ar') => void;
}

export const AnnouncementPreviewMockup: React.FC<AnnouncementPreviewMockupProps> = ({
  activeItem,
  announcementActive,
  announcementText,
  activeLangTab,
  setActiveLangTab,
}) => {
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('light');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isFloatingCollapsed, setIsFloatingCollapsed] = useState<boolean>(false);

  const currentThemeObj = BANNER_THEMES.find((b) => b.id === (activeItem.bannerType || 'info')) || BANNER_THEMES[0];
  const currentPlacement = activeItem.placement || 'top_hanging';
  const isDark = previewTheme === 'dark';
  const currentBgOpacity = activeItem.bgOpacity ?? activeItem.opacity ?? 95;
  const currentTextOpacity = activeItem.textOpacity ?? 100;
  const previewLink = activeItem.targetUrl || activeItem.ctaUrl;
  const sizeMetrics = getSizeMetrics(activeItem, currentPlacement);
  const isTicker = (activeItem.displayMode || 'static') === 'ticker';
  const isRotator = (activeItem.displayMode || 'static') === 'rotator';

  const isCustomTheme = activeItem.bannerType === 'custom';
  const previewBg = isCustomTheme
    ? (activeItem.customBg || (isDark ? '#1e293b' : '#f8fafc'))
    : (isDark ? currentThemeObj.bgDark : currentThemeObj.bgLight);
  const previewText = isCustomTheme
    ? (activeItem.customText || (isDark ? '#f8fafc' : '#0f172a'))
    : (isDark ? currentThemeObj.textColorDark : currentThemeObj.textColorLight);

  return (
    <div style={{
      background: isDark ? '#070a13' : '#F1F5F9',
      border: '2px solid var(--border-subtle, #334155)',
      borderRadius: '10px',
      marginBottom: '16px',
      maxWidth: previewDevice === 'mobile' ? '400px' : '100%',
      margin: previewDevice === 'mobile' ? '0 auto 16px auto' : '0 0 16px 0',
      boxShadow: isDark ? '0 8px 30px rgba(0,0,0,0.5)' : '0 8px 24px rgba(0,0,0,0.08)',
      transition: 'max-width 0.25s ease',
      overflow: 'hidden',
    }}>
      {/* Mockup Pencere Başlık Çubuğu */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
        borderBottom: '1px solid var(--border-subtle, #334155)',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        {/* Sol: Pencere Kontrol Noktaları ve Başlık */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--text-primary)' }}>
            <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
            <span>Canlı Önizleme Vitrini:</span>
            <span style={{ color: 'var(--accent-amber, #f59e0b)' }}>{activeItem.title}</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 500 }}>
              ({currentPlacement === 'top_hanging' ? 'Üst Şerit' : currentPlacement === 'left_floating' ? 'Sol Kart' : 'Sağ Kart'})
            </span>
            {isTicker && <span className="admin-badge admin-badge-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '1px 5px', fontSize: '10px' }}>Kayan Yazı</span>}
            {isRotator && <span className="admin-badge admin-badge-sm" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1', padding: '1px 5px', fontSize: '10px' }}>Dönüşümlü</span>}
          </div>
        </div>

        {/* Sağ: Görünüm Modu, Web/Mobil, Dil, Açık/Koyu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentPlacement !== 'top_hanging' && (
            <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setIsFloatingCollapsed(false)}
                style={{
                  padding: '2px 7px', fontSize: '10px', fontWeight: !isFloatingCollapsed ? 700 : 500,
                  border: 'none', background: !isFloatingCollapsed ? 'var(--accent-primary)' : 'transparent',
                  color: !isFloatingCollapsed ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer',
                }}
                title="Genişletilmiş Kart Görünümü"
              >
                Kart
              </button>
              <button
                type="button"
                onClick={() => setIsFloatingCollapsed(true)}
                style={{
                  padding: '2px 7px', fontSize: '10px', fontWeight: isFloatingCollapsed ? 700 : 500,
                  border: 'none', background: isFloatingCollapsed ? 'var(--accent-primary)' : 'transparent',
                  color: isFloatingCollapsed ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer',
                }}
                title="Dikey Kulakçık / Rozet Görünümü"
              >
                Kulakçık
              </button>
            </div>
          )}

          <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 7px', fontSize: '10px',
                border: 'none', background: previewDevice === 'desktop' ? 'var(--accent-primary)' : 'transparent',
                color: previewDevice === 'desktop' ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer',
              }}
              title="Masaüstü Görünümü"
            >
              <Monitor size={10} /><span>Web</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 7px', fontSize: '10px',
                border: 'none', background: previewDevice === 'mobile' ? 'var(--accent-primary)' : 'transparent',
                color: previewDevice === 'mobile' ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer',
              }}
              title="Mobil Cihaz Görünümü"
            >
              <Smartphone size={10} /><span>Mobil</span>
            </button>
          </div>

          <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            {(['tr', 'en', 'ar'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLangTab(lang)}
                style={{
                  padding: '2px 7px', fontSize: '10px', fontWeight: activeLangTab === lang ? 700 : 500,
                  border: 'none', background: activeLangTab === lang ? 'var(--accent-primary)' : 'transparent',
                  color: activeLangTab === lang ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer',
                }}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPreviewTheme(isDark ? 'light' : 'dark')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 7px', fontSize: '10px',
              border: '1px solid var(--border-subtle)', borderRadius: '4px', background: 'transparent',
              color: 'var(--text-secondary)', cursor: 'pointer',
            }}
          >
            {isDark ? <Sun size={11} /> : <Moon size={11} />}<span>{isDark ? 'Açık' : 'Koyu'}</span>
          </button>
        </div>
      </div>

      {/* Pencere İç Gövdesi (Sahne) */}
      <div style={{ padding: '12px', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)' }}>
        {currentPlacement === 'top_hanging' ? (
          <div
            dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
            onClick={(e: React.MouseEvent) => {
              if ((e.target as HTMLElement).closest('button')) return;
              if (previewLink) window.open(previewLink, '_blank', 'noopener,noreferrer');
            }}
            style={{
              position: 'relative',
              borderRadius: '6px',
              borderBottom: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight,
              minHeight: sizeMetrics.minHeight,
              height: isTicker ? sizeMetrics.minHeight : 'auto',
              boxShadow: '0 4px 18px rgba(0,0,0,0.1)',
              backdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
              WebkitBackdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              cursor: previewLink ? 'pointer' : 'default',
            }}
          >
            {/* Bağımsız Zemin Opaklık Katmanı */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: previewBg,
                opacity: announcementActive ? currentBgOpacity / 100 : 0.3,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />
            {/* İçerik & Yazı Opaklık Katmanı */}
            <div
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                padding: sizeMetrics.padding,
                fontSize: sizeMetrics.fontSize,
                color: previewText,
                opacity: announcementActive ? currentTextOpacity / 100 : 0.45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, overflow: isTicker ? 'hidden' : 'visible' }}>
                <span style={{ display: 'inline-flex', flexShrink: 0, marginTop: '1px' }}>{currentThemeObj.icon}</span>
                {isTicker ? (
                  <div className="ann-ticker-wrap">
                    <div
                      className="ann-ticker-track"
                      style={{
                        animation: `${(activeItem.tickerDirection || 'rtl') === 'ltr' ? 'marqueeLTR' : 'marqueeRTL'} ${(activeItem.tickerSpeed || 'normal') === 'slow' ? '28s' : (activeItem.tickerSpeed || 'normal') === 'fast' ? '10s' : '18s'} linear infinite`,
                      }}
                      dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Duyuru metni...' }}
                    />
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
                  <a
                    href={previewLink || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => { e.stopPropagation(); }}
                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 9px', fontSize: '10px', fontWeight: 700, borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)', color: 'inherit' }}
                  >
                    {activeItem.ctaText} <ExternalLink size={9} />
                  </a>
                )}
                {activeItem.isDismissable && <button type="button" style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, padding: '2px', cursor: 'pointer' }}><X size={13} /></button>}
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            position: 'relative',
            minHeight: `${Math.max(200, (activeItem.topOffset ?? 110) + 160)}px`,
            background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.4)',
            borderRadius: '6px',
            padding: '8px',
            border: '1px dashed var(--border-subtle)',
            transition: 'min-height 0.2s ease',
          }}>
            {/* Temsili Header Çizgisi */}
            <div style={{
              height: '24px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px',
              fontSize: '9px', fontWeight: 600, color: 'var(--text-muted)',
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '4px',
            }}>
              <span>🌐 Web Sayfası Başlığı (Header)</span>
              <span>Üst: {activeItem.topOffset ?? 110}px | Kenar: {sizeMetrics.sideOffset}px | Süre: {sizeMetrics.autoCollapseDelay}s | Efekt: {sizeMetrics.glassEffect === 'blur' ? 'Buzlu' : 'Şeffaf'}</span>
            </div>

            {isFloatingCollapsed ? (
              /* Dikey Kulakçık Önizlemesi (İkonsuz, İnce ve Yalın) */
              <div
                onClick={() => setIsFloatingCollapsed(false)}
                style={{
                  position: 'relative',
                  marginTop: `${activeItem.topOffset ?? 110}px`,
                  marginLeft: currentPlacement === 'left_floating' ? `${sizeMetrics.sideOffset}px` : 'auto',
                  marginRight: currentPlacement === 'right_floating' ? `${sizeMetrics.sideOffset}px` : 'auto',
                  width: 'fit-content',
                  minWidth: '22px',
                  padding: '10px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  letterSpacing: '1px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: previewBg,
                  color: previewText,
                  border: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight,
                  borderRadius: currentPlacement === 'left_floating' ? '0 8px 8px 0' : '8px 0 0 8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                  backdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
                  WebkitBackdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
                  transition: 'all 0.2s ease',
                }}
                title="Tıklayarak kartı açınız"
              >
                <span>{activeItem.tabText || 'SİZİN İÇİN'}</span>
              </div>
            ) : (
              /* Genişletilmiş Kart Önizlemesi */
              <div
                dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                onClick={(e: React.MouseEvent) => {
                  if ((e.target as HTMLElement).closest('button')) return;
                  if (previewLink) window.open(previewLink, '_blank', 'noopener,noreferrer');
                }}
                style={{
                  position: 'relative',
                  marginTop: `${activeItem.topOffset ?? 110}px`,
                  marginLeft: currentPlacement === 'left_floating' ? `${sizeMetrics.sideOffset}px` : 'auto',
                  marginRight: currentPlacement === 'right_floating' ? `${sizeMetrics.sideOffset}px` : 'auto',
                  width: previewDevice === 'mobile' ? '100%' : sizeMetrics.width,
                  height: sizeMetrics.height,
                  border: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight,
                  borderRadius: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  backdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
                  WebkitBackdropFilter: sizeMetrics.glassEffect === 'blur' ? 'blur(10px)' : 'none',
                  overflow: 'hidden',
                  cursor: previewLink ? 'pointer' : 'default',
                  transition: 'margin-top 0.2s ease, width 0.2s ease',
                }}
              >
                {/* Bağımsız Zemin Opaklık Katmanı */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: previewBg,
                    opacity: announcementActive ? currentBgOpacity / 100 : 0.3,
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />
                {/* İçerik & Yazı Opaklık Katmanı */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: sizeMetrics.padding,
                    fontSize: sizeMetrics.fontSize,
                    color: previewText,
                    opacity: announcementActive ? currentTextOpacity / 100 : 0.45,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 800 }}>{currentThemeObj.icon} <span>{activeItem.title}</span></div>
                    {activeItem.isDismissable && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsFloatingCollapsed(true);
                        }}
                        style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, padding: '2px', cursor: 'pointer' }}
                        title="Kulakçığa küçült"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                  <div className="ann-card-preview-content" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', maxWidth: '100%', boxSizing: 'border-box', marginBottom: '6px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Zengin içerik...' }} />
                  {activeItem.ctaText && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <a
                        href={previewLink || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ textDecoration: 'none', color: 'inherit', fontSize: '10px', fontWeight: 700 }}
                      >
                        {activeItem.ctaText} ➔
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
