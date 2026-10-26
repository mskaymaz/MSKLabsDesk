import React, { useState, useEffect } from 'react';
import { Megaphone, Save, Sparkles, X, ExternalLink, Sun, Moon, Plus, Trash2, Smartphone, Monitor } from 'lucide-react';
import { Switch } from '../ui/Input';
import { RichTextEditor } from '../ui/RichTextEditor';
import { type AnnouncementMeta, type AnnouncementItem, BANNER_THEMES, getSizeMetrics } from './announcementConfig';

export type { AnnouncementMeta };

export interface AnnouncementBarSectionProps {
  announcementText: { tr: string; en: string; ar: string };
  setAnnouncementText: React.Dispatch<React.SetStateAction<{ tr: string; en: string; ar: string }>>;
  announcementActive: boolean;
  setAnnouncementActive: React.Dispatch<React.SetStateAction<boolean>>;
  announcementMeta: AnnouncementMeta;
  setAnnouncementMeta: React.Dispatch<React.SetStateAction<AnnouncementMeta>>;
  onSave: (e: React.FormEvent) => void;
  saving?: boolean;
}

export const AnnouncementBarSection: React.FC<AnnouncementBarSectionProps> = ({
  announcementText, setAnnouncementText, announcementActive, setAnnouncementActive,
  announcementMeta, setAnnouncementMeta, onSave, saving = false,
}) => {
  const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'ar'>('tr');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('light');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  const items: AnnouncementItem[] = (announcementMeta.items && announcementMeta.items.length > 0)
    ? announcementMeta.items
    : [{
        id: 'ann_1', title: 'Birincil Duyuru', content_tr: announcementText.tr || '<p>Duyuru içeriği...</p>',
        content_en: announcementText.en || '', content_ar: announcementText.ar || '',
        bannerType: announcementMeta.bannerType || 'info', placement: announcementMeta.placement || 'top_hanging',
        sizePreset: announcementMeta.sizePreset || 'standard', customHeight: announcementMeta.customHeight,
        cardWidth: announcementMeta.cardWidth, cardHeight: announcementMeta.cardHeight, topOffset: announcementMeta.topOffset ?? 110,
        opacity: announcementMeta.opacity ?? 95, isDismissable: announcementMeta.isDismissable !== false,
        ctaText: announcementMeta.ctaText, ctaUrl: announcementMeta.ctaUrl, targetUrl: announcementMeta.targetUrl, isActive: true,
        displayMode: announcementMeta.displayMode || 'static', tickerDirection: announcementMeta.tickerDirection || 'rtl', tickerSpeed: announcementMeta.tickerSpeed || 'normal',
      }];

  const [selectedId, setSelectedId] = useState<string>(announcementMeta.activeItemId || items[0].id);

  useEffect(() => {
    if (announcementMeta.activeItemId && items.some((x) => x.id === announcementMeta.activeItemId)) {
      setSelectedId(announcementMeta.activeItemId);
    }
  }, [announcementMeta.activeItemId, announcementMeta.items]);

  const activeItem = items.find((x) => x.id === selectedId) || items[0];

  useEffect(() => {
    if (activeItem) {
      setAnnouncementText({ tr: activeItem.content_tr || '', en: activeItem.content_en || '', ar: activeItem.content_ar || '' });
    }
  }, [selectedId]);

  const updateCurrentItem = (updates: Partial<AnnouncementItem>) => {
    const updatedItems = items.map((it) => (it.id === activeItem.id ? { ...it, ...updates } : it));
    setAnnouncementMeta({ ...announcementMeta, items: updatedItems, activeItemId: activeItem.id });
  };

  const handleSelectId = (id: string) => {
    setSelectedId(id);
    setAnnouncementMeta((prev) => ({ ...prev, activeItemId: id }));
  };

  const handleAddNewItem = () => {
    const newIdx = items.length + 1;
    const newItem: AnnouncementItem = {
      id: `ann_${Date.now()}`, title: `Duyuru #${newIdx}`, content_tr: `<p>Yeni duyuru #${newIdx}...</p>`,
      bannerType: 'info', placement: 'top_hanging', sizePreset: 'standard', customHeight: 46, opacity: 95, isDismissable: true, isActive: true,
    };
    const nextList = [...items, newItem];
    setAnnouncementMeta({ ...announcementMeta, items: nextList, activeItemId: newItem.id });
    setSelectedId(newItem.id);
  };

  const handleDeleteItem = (idToDelete: string) => {
    if (items.length <= 1) return alert('En az 1 duyuru bulunmalıdır.');
    const nextList = items.filter((x) => x.id !== idToDelete);
    setAnnouncementMeta({ ...announcementMeta, items: nextList, activeItemId: nextList[0].id });
    setSelectedId(nextList[0].id);
  };

  const handleSaveClick = (e: React.FormEvent) => {
    const syncedItems = items.map((it) => (it.id === activeItem.id ? {
      ...it,
      content_tr: announcementText.tr,
      content_en: announcementText.en,
      content_ar: announcementText.ar,
    } : it));
    const nextMeta: AnnouncementMeta = {
      ...announcementMeta,
      items: syncedItems,
      activeItemId: activeItem.id,
      displayMode: activeItem.displayMode,
      placement: activeItem.placement,
      bannerType: activeItem.bannerType,
      topOffset: activeItem.topOffset,
      cardWidth: activeItem.cardWidth,
      cardHeight: activeItem.cardHeight,
    };
    setAnnouncementMeta(nextMeta);
    (onSave as any)(e, nextMeta);
  };

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
    <div className="admin-list-card" style={{ padding: '16px' }}>
      {/* 1. Üst Bar: Başlık, Durum ve Kaydet */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle, #334155)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Megaphone size={18} color="var(--accent-amber, #f59e0b)" />
          <div>
            <h2 className="admin-card-title" style={{ margin: 0, fontSize: '14px' }}>Duyuru & Kampanya Havuzu (Flyout + Ticker)</h2>
            <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>Çoklu duyuru havuzu, sıralı gösterim ve kayan yazı akışı</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: announcementActive ? '#10b981' : 'var(--text-muted)' }}>
              {announcementActive ? 'Aktif' : 'Pasif'}
            </span>
            <Switch checked={announcementActive} onChange={(e: any) => setAnnouncementActive(e.target.checked)} aria-label="Duyuru aktiflik durumu" />
          </div>
          <button type="button" onClick={handleSaveClick} disabled={saving} className="admin-btn admin-btn-primary admin-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Save size={13} /><span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* 2. Kompakt Araç Çubuğu: Duyuru Seçici + Yerleşim & Akış Açılır Listeleri */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap', background: 'var(--bg-secondary, rgba(15,23,42,0.3))', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Duyuru:</span>
          <select className="form-select" value={activeItem.id} onChange={(e) => handleSelectId(e.target.value)} style={{ fontSize: '11px', height: '28px', minWidth: '150px', fontWeight: 600, padding: '2px 6px' }}>
            {items.map((it, idx) => {
              const sym = it.placement === 'left_floating' ? '←' : it.placement === 'right_floating' ? '→' : '↑';
              return (
                <option key={it.id} value={it.id}>
                  {sym} {it.title || `Duyuru #${idx + 1}`} {!it.isActive ? '(Pasif)' : ''}
                </option>
              );
            })}
          </select>
          <button type="button" onClick={handleAddNewItem} className="admin-btn admin-btn-secondary admin-btn-sm" style={{ height: '28px', padding: '0 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={13} /><span>Ekle</span>
          </button>
          {items.length > 1 && (
            <button type="button" onClick={() => handleDeleteItem(activeItem.id)} className="admin-btn admin-btn-sm" style={{ marginLeft: '15px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', height: '28px', width: '38px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title="Duyuruyu sil">
              <Trash2 size={13} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Yerleşim:</span>
            <select className="form-select" value={currentPlacement} onChange={(e) => updateCurrentItem({ placement: e.target.value as any })} style={{ fontSize: '11px', height: '28px', padding: '2px 6px' }}>
              <option value="top_hanging">Üst</option>
              <option value="right_floating">Sağ</option>
              <option value="left_floating">Sol</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Akış:</span>
            <select className="form-select" value={activeItem.displayMode || 'static'} onChange={(e) => updateCurrentItem({ displayMode: e.target.value as any })} style={{ fontSize: '11px', height: '28px', padding: '2px 6px' }}>
              <option value="static">Sabit / Çok Satırlı</option>
              <option value="ticker">Kayan Yazı (Ticker)</option>
              <option value="rotator">Dönüşümlü (Satır Satır Dikey)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Canlı Şerit Önizlemesi (Flyout + Ticker Simülasyonu) */}
      <div style={{
        background: isDark ? '#0B0F19' : '#F8FAFC',
        border: '1px solid var(--border-subtle, #E2E8F0)',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '14px',
        maxWidth: previewDevice === 'mobile' ? '390px' : '100%',
        margin: previewDevice === 'mobile' ? '0 auto 14px auto' : '0 0 14px 0',
        transition: 'max-width 0.25s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
            <span>Önizleme: {activeItem.title} ({currentPlacement === 'top_hanging' ? 'Üst' : currentPlacement === 'left_floating' ? 'Sol' : 'Sağ'})</span>
            {isTicker && <span className="admin-badge admin-badge-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>Kayan Yazı</span>}
            {isRotator && <span className="admin-badge admin-badge-sm" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>Dönüşümlü (Dikey/Fade)</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Cihaz Seçici (Masaüstü vs Mobil) */}
            <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setPreviewDevice('desktop')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 6px', fontSize: '10px',
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
                  display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 6px', fontSize: '10px',
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
                <button key={lang} type="button" onClick={() => setActiveLangTab(lang)} style={{ padding: '2px 7px', fontSize: '10px', fontWeight: activeLangTab === lang ? 700 : 500, border: 'none', background: activeLangTab === lang ? 'var(--accent-primary)' : 'transparent', color: activeLangTab === lang ? '#FFFFFF' : 'var(--text-secondary)', cursor: 'pointer' }}>{lang.toUpperCase()}</button>
              ))}
            </div>
            <button type="button" onClick={() => setPreviewTheme(isDark ? 'light' : 'dark')} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 7px', fontSize: '10px', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              {isDark ? <Sun size={11} /> : <Moon size={11} />}<span>{isDark ? 'Açık' : 'Koyu'}</span>
            </button>
          </div>
        </div>

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
              <span>Üstten Mesafe: {activeItem.topOffset ?? 110}px</span>
            </div>

            <div
              dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
              onClick={(e: React.MouseEvent) => {
                if ((e.target as HTMLElement).closest('button')) return;
                if (previewLink) window.open(previewLink, '_blank', 'noopener,noreferrer');
              }}
              style={{
                position: 'relative',
                marginTop: `${activeItem.topOffset ?? 110}px`,
                marginLeft: currentPlacement === 'left_floating' ? 0 : 'auto',
                marginRight: currentPlacement === 'right_floating' ? 0 : 'auto',
                width: previewDevice === 'mobile' ? '100%' : sizeMetrics.width,
                height: sizeMetrics.height,
                border: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight,
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
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
                  {activeItem.isDismissable && <button type="button" style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, padding: '2px' }}><X size={12} /></button>}
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
          </div>
        )}
      </div>

      {/* 4. Derli Toplu Ayar Paneli (Açılır Listeler ve Gruplanmış Kontroller) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '14px', padding: '12px', background: 'var(--bg-secondary, rgba(15, 23, 42, 0.4))', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Duyuru Başlığı</label>
          <input type="text" className="form-input" value={activeItem.title || ''} onChange={(e) => updateCurrentItem({ title: e.target.value })} placeholder="Duyuru Başlığı" style={{ fontSize: '11px', height: '28px', marginBottom: '8px' }} />
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={activeItem.isActive !== false} onChange={(e) => updateCurrentItem({ isActive: e.target.checked })} />
            <span>Bu duyuru havuzda aktif</span>
          </label>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Tema & Renkler</label>
          <select className="form-select" value={activeItem.bannerType || 'info'} onChange={(e) => updateCurrentItem({ bannerType: e.target.value as any })} style={{ fontSize: '11px', height: '28px', marginBottom: '6px', padding: '2px 6px' }}>
            {BANNER_THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>{theme.name}</option>
            ))}
          </select>
          {isCustomTheme ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Zemin:</span>
                <input type="color" value={activeItem.customBg || '#f8fafc'} onChange={(e) => updateCurrentItem({ customBg: e.target.value })} style={{ width: '26px', height: '24px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }} title="Özel Zemin Rengi" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Yazı:</span>
                <input type="color" value={activeItem.customText || '#0f172a'} onChange={(e) => updateCurrentItem({ customText: e.target.value })} style={{ width: '26px', height: '24px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }} title="Özel Yazı Rengi" />
              </div>
            </div>
          ) : (
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', height: '24px' }}>
              <span>{currentThemeObj.icon}</span> <span>{currentThemeObj.name} paleti</span>
            </div>
          )}
        </div>

        {currentPlacement === 'top_hanging' ? (
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Boyut, Boşluk & Opaklık</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '4px', marginBottom: '6px' }}>
              <select
                className="form-select" value={activeItem.sizePreset || 'standard'}
                onChange={(e) => {
                  const preset = e.target.value as 'compact' | 'standard' | 'large';
                  updateCurrentItem({
                    sizePreset: preset,
                    customHeight: preset === 'compact' ? 26 : preset === 'large' ? 48 : 34,
                    paddingY: preset === 'compact' ? 1 : preset === 'large' ? 3 : 2,
                  });
                }}
                style={{ fontSize: '11px', height: '28px', padding: '2px 4px' }}
              >
                <option value="compact">Kompakt</option>
                <option value="standard">Standart</option>
                <option value="large">Geniş</option>
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title="Bant Toplam Yüksekliği (px)">
                <input type="number" className="form-input" style={{ fontSize: '11px', height: '28px', width: '48px', textAlign: 'center', padding: '2px' }} value={activeItem.customHeight ?? ''} placeholder="34" onChange={(e) => updateCurrentItem({ customHeight: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>h</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title="Dikey Üst/Alt İç Boşluk (px)">
                <input type="number" className="form-input" style={{ fontSize: '11px', height: '28px', width: '48px', textAlign: 'center', padding: '2px' }} value={activeItem.paddingY ?? ''} placeholder="2" onChange={(e) => updateCurrentItem({ paddingY: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>pad</span>
              </div>
            </div>
            {/* İkiye Ayrılmış Opaklık Kontrolleri */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: '65px' }}>Zemin Opk: %{currentBgOpacity}</span>
                <input type="range" min="10" max="100" step="5" value={currentBgOpacity} onChange={(e) => updateCurrentItem({ bgOpacity: parseInt(e.target.value, 10), opacity: parseInt(e.target.value, 10) })} style={{ flex: 1, cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: '65px' }}>Yazı Opk: %{currentTextOpacity}</span>
                <input type="range" min="30" max="100" step="5" value={currentTextOpacity} onChange={(e) => updateCurrentItem({ textOpacity: parseInt(e.target.value, 10) })} style={{ flex: 1, cursor: 'pointer' }} />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Boyut, Boşluk & Konum (px)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '4px', marginBottom: '6px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Gen:</span>
                <input type="number" className="form-input" placeholder="310" style={{ fontSize: '11px', height: '26px', padding: '2px', textAlign: 'center' }} value={activeItem.cardWidth ?? ''} onChange={(e) => updateCurrentItem({ cardWidth: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Yük:</span>
                <input type="number" className="form-input" placeholder="Oto" style={{ fontSize: '11px', height: '26px', padding: '2px', textAlign: 'center' }} value={activeItem.cardHeight ?? ''} onChange={(e) => updateCurrentItem({ cardHeight: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Pad:</span>
                <input type="number" className="form-input" placeholder="10" style={{ fontSize: '11px', height: '26px', padding: '2px', textAlign: 'center' }} value={activeItem.paddingY ?? ''} onChange={(e) => updateCurrentItem({ paddingY: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Üst:</span>
                <input type="number" className="form-input" placeholder="110" style={{ fontSize: '11px', height: '26px', padding: '2px', textAlign: 'center' }} value={activeItem.topOffset ?? ''} onChange={(e) => updateCurrentItem({ topOffset: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
              </div>
            </div>
            {/* İkiye Ayrılmış Opaklık Kontrolleri */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: '65px' }}>Zemin Opk: %{currentBgOpacity}</span>
                <input type="range" min="10" max="100" step="5" value={currentBgOpacity} onChange={(e) => updateCurrentItem({ bgOpacity: parseInt(e.target.value, 10), opacity: parseInt(e.target.value, 10) })} style={{ flex: 1, cursor: 'pointer' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: '65px' }}>Yazı Opk: %{currentTextOpacity}</span>
                <input type="range" min="30" max="100" step="5" value={currentTextOpacity} onChange={(e) => updateCurrentItem({ textOpacity: parseInt(e.target.value, 10) })} style={{ flex: 1, cursor: 'pointer' }} />
              </div>
            </div>
          </div>
        )}

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Etkileşim & Buton</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', cursor: 'pointer', marginBottom: '6px' }}>
            <input type="checkbox" checked={activeItem.isDismissable} onChange={(e) => updateCurrentItem({ isDismissable: e.target.checked })} />
            <span>Kapatma '✕' butonu görünsün</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            <input type="text" className="form-input" placeholder="Buton Metni" value={activeItem.ctaText || ''} onChange={(e) => updateCurrentItem({ ctaText: e.target.value })} style={{ fontSize: '10px', height: '24px' }} />
            <input type="text" className="form-input" placeholder="Buton URL (/apps)" value={activeItem.ctaUrl || ''} onChange={(e) => updateCurrentItem({ ctaUrl: e.target.value })} style={{ fontSize: '10px', height: '24px' }} />
          </div>
        </div>
      </div>

      {/* 4.1 Ticker (Kayan Yazı) Ayarları Özel Bloğu */}
      {isTicker && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', padding: '8px 12px', background: 'rgba(59,130,246,0.08)', borderRadius: '6px', border: '1px solid rgba(59,130,246,0.25)' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-primary)' }}>Kayan Yazı (Ticker) Ayarları:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Yön:</span>
            <select className="form-select" style={{ fontSize: '11px', height: '26px', padding: '2px 6px' }} value={activeItem.tickerDirection || 'rtl'} onChange={(e: any) => updateCurrentItem({ tickerDirection: e.target.value })}>
              <option value="rtl">Sağdan Sola (RTL)</option>
              <option value="ltr">Soldan Sağa (LTR)</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Hız:</span>
            <select className="form-select" style={{ fontSize: '11px', height: '26px', padding: '2px 6px' }} value={activeItem.tickerSpeed || 'normal'} onChange={(e: any) => updateCurrentItem({ tickerSpeed: e.target.value })}>
              <option value="slow">Yavaş (28s)</option>
              <option value="normal">Normal (18s)</option>
              <option value="fast">Hızlı (10s)</option>
            </select>
          </div>
        </div>
      )}

      {/* 5. Zengin Metin Editörü */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{activeItem.title} — İçerik Düzenleme ({activeLangTab.toUpperCase()})</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>Görsel, link ve zengin format ekleyebilirsiniz</span>
          </div>
          <div style={{ display: 'inline-flex', gap: '4px' }}>
            {(['tr', 'en', 'ar'] as const).map((lang) => (
              <button key={lang} type="button" onClick={() => setActiveLangTab(lang)} className={`admin-btn admin-btn-sm ${activeLangTab === lang ? 'admin-btn-primary' : 'admin-btn-secondary'}`} style={{ fontSize: '10px', height: '22px', padding: '0 8px' }}>{lang.toUpperCase()}</button>
            ))}
          </div>
        </div>

        <RichTextEditor
          key={`ann-${activeItem.id}-${activeLangTab}`}
          preset="full"
          minHeight="140px"
          dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
          hideHeader={true}
          value={announcementText[activeLangTab]}
          onChange={(val) => {
            setAnnouncementText((prev) => ({ ...prev, [activeLangTab]: val }));
            updateCurrentItem({ [`content_${activeLangTab}`]: val } as any);
          }}
          placeholder={activeLangTab === 'tr' ? 'Duyuru başlığı, açıklaması, resim veya buton tasarımınızı oluşturunuz...' : activeLangTab === 'en' ? 'Create announcement heading, description, image or button design...' : 'أنشئ عنوان الإعلان والوصف والصور وتصميم الأزرار باللغة العربية...'}
        />
      </div>
    </div>
  );
};
