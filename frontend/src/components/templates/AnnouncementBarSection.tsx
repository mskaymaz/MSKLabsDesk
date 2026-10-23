import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Save,
  Sparkles,
  X,
  ExternalLink,
  Sun,
  Moon,
  PanelTop,
  SidebarClose,
  Plus,
  Trash2,
} from 'lucide-react';
import { Switch } from '../ui/Input';
import { RichTextEditor } from '../ui/RichTextEditor';
import {
  type AnnouncementMeta,
  type AnnouncementItem,
  BANNER_THEMES,
  getSizeMetrics,
} from './announcementConfig';

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

  // Havuz ve Aktif Öğe Senkronizasyonu
  const items: AnnouncementItem[] = (announcementMeta.items && announcementMeta.items.length > 0)
    ? announcementMeta.items
    : [{
        id: 'ann_1',
        title: 'Birincil Duyuru',
        content_tr: announcementText.tr || '<p>Duyuru içeriği...</p>',
        content_en: announcementText.en || '',
        content_ar: announcementText.ar || '',
        bannerType: announcementMeta.bannerType || 'info',
        placement: announcementMeta.placement || 'top_hanging',
        sizePreset: announcementMeta.sizePreset || 'standard',
        customHeight: announcementMeta.customHeight,
        cardWidth: announcementMeta.cardWidth,
        opacity: announcementMeta.opacity ?? 95,
        isDismissable: announcementMeta.isDismissable !== false,
        ctaText: announcementMeta.ctaText,
        ctaUrl: announcementMeta.ctaUrl,
        targetUrl: announcementMeta.targetUrl,
        isActive: true,
      }];

  const [selectedId, setSelectedId] = useState<string>(announcementMeta.activeItemId || items[0].id);
  const activeItem = items.find((x) => x.id === selectedId) || items[0];

  useEffect(() => {
    if (activeItem) {
      setAnnouncementText({
        tr: activeItem.content_tr || '',
        en: activeItem.content_en || '',
        ar: activeItem.content_ar || '',
      });
    }
  }, [selectedId]);

  const updateCurrentItem = (updates: Partial<AnnouncementItem>) => {
    const updatedItems = items.map((it) => (it.id === activeItem.id ? { ...it, ...updates } : it));
    setAnnouncementMeta({ ...announcementMeta, items: updatedItems });
  };

  const handleAddNewItem = () => {
    if (items.length >= 10) return alert('En fazla 10 duyuru ekleyebilirsiniz.');
    const newIdx = items.length + 1;
    const newItem: AnnouncementItem = {
      id: `ann_${Date.now()}`,
      title: `Duyuru #${newIdx}`,
      content_tr: `<p>Yeni duyuru #${newIdx} içeriği...</p>`,
      content_en: '',
      content_ar: '',
      bannerType: 'info',
      placement: 'top_hanging',
      sizePreset: 'standard',
      customHeight: 46,
      opacity: 95,
      isDismissable: true,
      isActive: true,
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

  const currentThemeObj = BANNER_THEMES.find((b) => b.id === (activeItem.bannerType || 'info')) || BANNER_THEMES[0];
  const currentPlacement = activeItem.placement || 'top_hanging';
  const isDark = previewTheme === 'dark';
  const currentOpacity = activeItem.opacity ?? 95;
  const sizeMetrics = getSizeMetrics(activeItem, currentPlacement);
  const isTicker = (announcementMeta.displayMode || 'static') === 'ticker';

  return (
    <div className="admin-list-card" style={{ padding: '18px' }}>
      {/* 1. Üst Bar: Başlık, Durum ve Kaydet */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border-subtle, #334155)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Megaphone size={18} color="var(--accent-amber, #f59e0b)" />
          <div>
            <h2 className="admin-card-title" style={{ margin: 0, fontSize: '14px' }}>Duyuru & Kampanya Havuzu (Flyout + Ticker)</h2>
            <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
              Çoklu duyuru havuzu, round-robin sıralı gösterim ve kayan yazı akışı
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {announcementActive ? 'Havuz Yayında' : 'Pasif'}
            </span>
            <Switch checked={announcementActive} onChange={(e: any) => setAnnouncementActive(e.target.checked)} aria-label="Duyuru havuzu aktiflik" />
          </div>
          <button type="button" onClick={onSave} disabled={saving} className="admin-btn admin-btn-primary admin-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Save size={13} />
            <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* 2. Çoklu Duyuru Sekmeleri & Akış Modu Seçici */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', overflowX: 'auto', maxWidth: '70%' }}>
          {items.map((it, idx) => {
            const isSel = it.id === activeItem.id;
            return (
              <button
                key={it.id}
                type="button"
                onClick={() => setSelectedId(it.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 9px', borderRadius: '6px',
                  border: isSel ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                  background: isSel ? 'rgba(59,130,246,0.18)' : 'var(--bg-card)', color: 'var(--text-primary)',
                  fontSize: '11px', fontWeight: isSel ? 700 : 500, cursor: 'pointer',
                }}
              >
                <span>{it.title || `Duyuru #${idx + 1}`}</span>
                {!it.isActive && <span style={{ fontSize: '9px', opacity: 0.6 }}>(Pasif)</span>}
              </button>
            );
          })}
          <button type="button" onClick={handleAddNewItem} className="admin-btn admin-btn-secondary admin-btn-sm" style={{ padding: '3px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
            <Plus size={12} /><span>Ekle</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-secondary)', padding: '3px 6px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>Akış:</span>
            <button
              type="button"
              onClick={() => setAnnouncementMeta({ ...announcementMeta, displayMode: 'static' })}
              style={{ padding: '2px 6px', fontSize: '10px', borderRadius: '4px', border: 'none', background: !isTicker ? 'var(--accent-primary)' : 'transparent', color: !isTicker ? '#fff' : 'inherit', cursor: 'pointer' }}
            >
              Sabit / Çok Satırlı
            </button>
            <button
              type="button"
              onClick={() => setAnnouncementMeta({ ...announcementMeta, displayMode: 'ticker' })}
              style={{ padding: '2px 6px', fontSize: '10px', borderRadius: '4px', border: 'none', background: isTicker ? 'var(--accent-primary)' : 'transparent', color: isTicker ? '#fff' : 'inherit', cursor: 'pointer' }}
            >
              Kayan Yazı (Ticker)
            </button>
          </div>
          {items.length > 1 && (
            <button type="button" onClick={() => handleDeleteItem(activeItem.id)} className="admin-btn admin-btn-sm" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', padding: '2px 6px' }} title="Bu duyuruyu sil">
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Canlı Şerit Önizlemesi (Flyout + Ticker Simülasyonu) */}
      <div style={{ background: isDark ? '#0B0F19' : '#F8FAFC', border: '1px solid var(--border-subtle, #E2E8F0)', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
            <span>Önizleme: {activeItem.title} ({currentPlacement === 'top_hanging' ? 'Flyout Üst Askılı' : 'Flyout Sağ Kayan'})</span>
            {isTicker && <span className="admin-badge admin-badge-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>Kayan Yazı Aktif (Hover Durdurur)</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 7px', fontSize: '10px', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              {isDark ? <Sun size={11} /> : <Moon size={11} />}
              <span>{isDark ? 'Açık' : 'Koyu'}</span>
            </button>
          </div>
        </div>

        {/* Simülasyon Konteyneri */}
        {currentPlacement === 'top_hanging' ? (
          <div
            dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
            style={{
              background: isDark ? currentThemeObj.bgDark : currentThemeObj.bgLight,
              color: isDark ? currentThemeObj.textColorDark : currentThemeObj.textColorLight,
              borderBottom: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight,
              borderRadius: '6px', padding: sizeMetrics.padding, fontSize: sizeMetrics.fontSize, minHeight: sizeMetrics.minHeight,
              opacity: announcementActive ? currentOpacity / 100 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '12px', boxShadow: '0 4px 18px rgba(0,0,0,0.1)', overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <span style={{ display: 'inline-flex', flexShrink: 0 }}>{currentThemeObj.icon}</span>
              {isTicker ? (
                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
                  <div
                    style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: `${(announcementMeta.tickerDirection === 'ltr') ? 'marqueeLTR' : 'marqueeRTL'} ${announcementMeta.tickerSpeed === 'slow' ? '28s' : announcementMeta.tickerSpeed === 'fast' ? '10s' : '18s'} linear infinite` }}
                    dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Duyuru metni...' }}
                  />
                </div>
              ) : (
                <div style={{ flex: 1, maxHeight: '80px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Duyuru içeriği...' }} />
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {activeItem.ctaText && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 9px', fontSize: '10px', fontWeight: 700, borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)', color: 'inherit' }}>
                  {activeItem.ctaText} <ExternalLink size={9} />
                </span>
              )}
              {activeItem.isDismissable && <button type="button" style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, padding: '2px', cursor: 'pointer' }}><X size={13} /></button>}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '6px 0' }}>
            <div style={{ width: '80px', height: '130px', background: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '4px', border: '1px dashed #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#64748b', textAlign: 'center', flexShrink: 0 }}>Sağ Reklam</div>
            <div
              dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
              style={{
                width: sizeMetrics.width, padding: sizeMetrics.padding, fontSize: sizeMetrics.fontSize,
                background: isDark ? currentThemeObj.bgDark : currentThemeObj.bgLight, color: isDark ? currentThemeObj.textColorDark : currentThemeObj.textColorLight,
                border: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight, borderRadius: '8px', opacity: announcementActive ? currentOpacity / 100 : 0.45,
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 800 }}>{currentThemeObj.icon} <span>{activeItem.title}</span></div>
                {activeItem.isDismissable && <button type="button" style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, padding: '2px' }}><X size={12} /></button>}
              </div>
              <div style={{ maxHeight: '90px', overflowY: 'auto', marginBottom: '6px' }} dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Zengin içerik...' }} />
              {activeItem.ctaText && <div style={{ display: 'flex', justifyContent: 'flex-end' }}><span style={{ fontSize: '10px', fontWeight: 700 }}>{activeItem.ctaText} ➔</span></div>}
            </div>
          </div>
        )}
      </div>

      {/* 4. Aktif Duyuru Ayar Paneli (4 Sütun) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '10px', marginBottom: '14px', padding: '12px', background: 'var(--bg-secondary, rgba(15, 23, 42, 0.4))', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        {/* A. Başlık & Yerleşim */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Duyuru Başlığı & Yerleşim</label>
          <input
            type="text" className="form-input" value={activeItem.title || ''}
            onChange={(e) => updateCurrentItem({ title: e.target.value })}
            placeholder="Duyuru Başlığı" style={{ fontSize: '11px', height: '26px', marginBottom: '6px' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            <button
              type="button" onClick={() => updateCurrentItem({ placement: 'top_hanging' })}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px', borderRadius: '4px', border: currentPlacement === 'top_hanging' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)', background: currentPlacement === 'top_hanging' ? 'rgba(59,130,246,0.15)' : 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
            >
              <PanelTop size={12} /> Üst Askılı
            </button>
            <button
              type="button" onClick={() => updateCurrentItem({ placement: 'right_floating' })}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px', borderRadius: '4px', border: currentPlacement === 'right_floating' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)', background: currentPlacement === 'right_floating' ? 'rgba(59,130,246,0.15)' : 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}
            >
              <SidebarClose size={12} /> Sağ Kayan
            </button>
          </div>
        </div>

        {/* B. Bant Teması & Ticker Ayarları */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Bant Teması & Akış</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '6px' }}>
            {BANNER_THEMES.map((theme) => {
              const isSel = (activeItem.bannerType || 'info') === theme.id;
              return (
                <button
                  key={theme.id} type="button" onClick={() => updateCurrentItem({ bannerType: theme.id })}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px', borderRadius: '4px', border: isSel ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)', background: isSel ? 'rgba(59,130,246,0.15)' : 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '10px', fontWeight: isSel ? 700 : 500, cursor: 'pointer' }}
                >
                  <span style={{ color: theme.textColorLight }}>{theme.icon}</span> <span>{theme.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
          {isTicker && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <select className="form-input" style={{ fontSize: '10px', height: '24px' }} value={announcementMeta.tickerDirection || 'rtl'} onChange={(e: any) => setAnnouncementMeta({ ...announcementMeta, tickerDirection: e.target.value })}>
                <option value="rtl">Sağdan Sola</option>
                <option value="ltr">Soldan Sağa</option>
              </select>
              <select className="form-input" style={{ fontSize: '10px', height: '24px' }} value={announcementMeta.tickerSpeed || 'normal'} onChange={(e: any) => setAnnouncementMeta({ ...announcementMeta, tickerSpeed: e.target.value })}>
                <option value="slow">Yavaş</option>
                <option value="normal">Normal</option>
                <option value="fast">Hızlı</option>
              </select>
            </div>
          )}
        </div>

        {/* C. Boyut & Şeffaflık */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Boyut & Şeffaflık</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', marginBottom: '5px' }}>
            {(['compact', 'standard', 'large'] as const).map((preset) => (
              <button
                key={preset} type="button"
                onClick={() => updateCurrentItem({ sizePreset: preset, ...(currentPlacement === 'top_hanging' ? { customHeight: preset === 'compact' ? 36 : preset === 'large' ? 62 : 46 } : { cardWidth: preset === 'compact' ? 260 : preset === 'large' ? 380 : 310 }) })}
                style={{ padding: '3px', borderRadius: '4px', border: (activeItem.sizePreset || 'standard') === preset ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)', background: (activeItem.sizePreset || 'standard') === preset ? 'rgba(59,130,246,0.15)' : 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '10px', cursor: 'pointer' }}
              >
                {preset === 'compact' ? 'İnce' : preset === 'standard' ? 'Orta' : 'Geniş'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{currentPlacement === 'top_hanging' ? 'Yükseklik:' : 'Genişlik:'}</span>
            <input
              type="number" className="form-input" style={{ fontSize: '10px', height: '22px', width: '50px', textAlign: 'center', padding: '1px' }}
              value={currentPlacement === 'top_hanging' ? (activeItem.customHeight || 46) : (activeItem.cardWidth || 310)}
              onChange={(e) => updateCurrentItem(currentPlacement === 'top_hanging' ? { customHeight: parseInt(e.target.value, 10) } : { cardWidth: parseInt(e.target.value, 10) })}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>%</span>
            <input
              type="range" min="40" max="100" step="5" value={currentOpacity}
              onChange={(e) => updateCurrentItem({ opacity: parseInt(e.target.value, 10) })}
              style={{ width: '42px', cursor: 'pointer' }} title={`%${currentOpacity}`}
            />
          </div>
        </div>

        {/* D. Link & Kapatma */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Etkileşim & Link</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', cursor: 'pointer', marginBottom: '4px' }}>
            <input type="checkbox" checked={activeItem.isDismissable} onChange={(e) => updateCurrentItem({ isDismissable: e.target.checked })} />
            <span>'✕' butonu ile kapatılsın</span>
          </label>
          <input
            type="text" className="form-input" placeholder="Genel Kart URL (/apps/deskpilot)"
            value={activeItem.targetUrl || ''} onChange={(e) => updateCurrentItem({ targetUrl: e.target.value })}
            style={{ fontSize: '10px', height: '22px', marginBottom: '4px' }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            <input type="text" className="form-input" placeholder="Buton Metni" value={activeItem.ctaText || ''} onChange={(e) => updateCurrentItem({ ctaText: e.target.value })} style={{ fontSize: '10px', height: '22px' }} />
            <input type="text" className="form-input" placeholder="Buton URL" value={activeItem.ctaUrl || ''} onChange={(e) => updateCurrentItem({ ctaUrl: e.target.value })} style={{ fontSize: '10px', height: '22px' }} />
          </div>
        </div>
      </div>

      {/* 5. Zengin Metin Editörü */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{activeItem.title} — İçerik Düzenleme ({activeLangTab.toUpperCase()})</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>Görsel, link ve format ekleyebilirsiniz</span>
          </div>
          <div style={{ display: 'inline-flex', gap: '4px' }}>
            {(['tr', 'en', 'ar'] as const).map((lang) => (
              <button
                key={lang} type="button" onClick={() => setActiveLangTab(lang)}
                className={`admin-btn admin-btn-sm ${activeLangTab === lang ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                style={{ fontSize: '10px', height: '22px', padding: '0 8px' }}
              >
                {lang.toUpperCase()}
              </button>
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
