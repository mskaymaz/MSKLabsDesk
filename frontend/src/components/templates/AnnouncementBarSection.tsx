import React, { useState, useEffect } from 'react';
import { Megaphone, Save, Sparkles, X, ExternalLink, Sun, Moon, Plus, Trash2 } from 'lucide-react';
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

  const items: AnnouncementItem[] = (announcementMeta.items && announcementMeta.items.length > 0)
    ? announcementMeta.items
    : [{
        id: 'ann_1', title: 'Birincil Duyuru', content_tr: announcementText.tr || '<p>Duyuru içeriği...</p>',
        content_en: announcementText.en || '', content_ar: announcementText.ar || '',
        bannerType: announcementMeta.bannerType || 'info', placement: announcementMeta.placement || 'top_hanging',
        sizePreset: announcementMeta.sizePreset || 'standard', customHeight: announcementMeta.customHeight,
        cardWidth: announcementMeta.cardWidth, opacity: announcementMeta.opacity ?? 95,
        isDismissable: announcementMeta.isDismissable !== false, ctaText: announcementMeta.ctaText,
        ctaUrl: announcementMeta.ctaUrl, targetUrl: announcementMeta.targetUrl, isActive: true,
      }];

  const [selectedId, setSelectedId] = useState<string>(announcementMeta.activeItemId || items[0].id);
  const activeItem = items.find((x) => x.id === selectedId) || items[0];

  useEffect(() => {
    if (activeItem) {
      setAnnouncementText({ tr: activeItem.content_tr || '', en: activeItem.content_en || '', ar: activeItem.content_ar || '' });
    }
  }, [selectedId]);

  const updateCurrentItem = (updates: Partial<AnnouncementItem>) => {
    const updatedItems = items.map((it) => (it.id === activeItem.id ? { ...it, ...updates } : it));
    setAnnouncementMeta({ ...announcementMeta, items: updatedItems });
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

  const currentThemeObj = BANNER_THEMES.find((b) => b.id === (activeItem.bannerType || 'info')) || BANNER_THEMES[0];
  const currentPlacement = activeItem.placement || 'top_hanging';
  const isDark = previewTheme === 'dark';
  const currentOpacity = activeItem.opacity ?? 95;
  const sizeMetrics = getSizeMetrics(activeItem, currentPlacement);
  const isTicker = (announcementMeta.displayMode || 'static') === 'ticker';

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
          <button type="button" onClick={onSave} disabled={saving} className="admin-btn admin-btn-primary admin-btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Save size={13} /><span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* 2. Kompakt Araç Çubuğu: Duyuru Seçici + Yerleşim & Akış Açılır Listeleri */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap', background: 'var(--bg-secondary, rgba(15,23,42,0.3))', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Duyuru:</span>
          <select className="form-select" value={activeItem.id} onChange={(e) => setSelectedId(e.target.value)} style={{ fontSize: '11px', height: '28px', minWidth: '150px', fontWeight: 600, padding: '2px 6px' }}>
            {items.map((it, idx) => (
              <option key={it.id} value={it.id}>{it.title || `Duyuru #${idx + 1}`} {!it.isActive ? '(Pasif)' : ''}</option>
            ))}
          </select>
          <button type="button" onClick={handleAddNewItem} className="admin-btn admin-btn-secondary admin-btn-sm" style={{ height: '28px', padding: '0 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Plus size={13} /><span>Ekle</span>
          </button>
          {items.length > 1 && (
            <button type="button" onClick={() => handleDeleteItem(activeItem.id)} className="admin-btn admin-btn-sm" style={{ marginLeft: '15px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', height: '28px', width: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }} title="Duyuruyu sil">
              <Trash2 size={13} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Yerleşim:</span>
            <select className="form-select" value={currentPlacement} onChange={(e) => updateCurrentItem({ placement: e.target.value as any })} style={{ fontSize: '11px', height: '28px', padding: '2px 6px' }}>
              <option value="top_hanging">Üst Askılı</option>
              <option value="right_floating">Sağ Askılı</option>
              <option value="left_floating">Sol Askılı</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Akış:</span>
            <select className="form-select" value={announcementMeta.displayMode || 'static'} onChange={(e) => setAnnouncementMeta({ ...announcementMeta, displayMode: e.target.value as any })} style={{ fontSize: '11px', height: '28px', padding: '2px 6px' }}>
              <option value="static">Sabit / Çok Satırlı</option>
              <option value="ticker">Kayan Yazı (Ticker)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Canlı Şerit Önizlemesi (Flyout + Ticker Simülasyonu) */}
      <div style={{ background: isDark ? '#0B0F19' : '#F8FAFC', border: '1px solid var(--border-subtle, #E2E8F0)', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
            <span>Önizleme: {activeItem.title} ({currentPlacement === 'top_hanging' ? 'Üst Askılı' : currentPlacement === 'left_floating' ? 'Sol Askılı' : 'Sağ Askılı'})</span>
            {isTicker && <span className="admin-badge admin-badge-sm" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>Kayan Yazı (Hover Durdurur)</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <div dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'} style={{ background: previewBg, color: previewText, borderBottom: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight, borderRadius: '6px', padding: sizeMetrics.padding, fontSize: sizeMetrics.fontSize, minHeight: sizeMetrics.minHeight, opacity: announcementActive ? currentOpacity / 100 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', boxShadow: '0 4px 18px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <span style={{ display: 'inline-flex', flexShrink: 0 }}>{currentThemeObj.icon}</span>
              {isTicker ? (
                <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', width: '100%' }}>
                  <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: `${(announcementMeta.tickerDirection === 'ltr') ? 'marqueeLTR' : 'marqueeRTL'} ${announcementMeta.tickerSpeed === 'slow' ? '28s' : announcementMeta.tickerSpeed === 'fast' ? '10s' : '18s'} linear infinite` }} dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Duyuru metni...' }} />
                </div>
              ) : (
                <div style={{ flex: 1, maxHeight: '80px', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: announcementText[activeLangTab] || 'Duyuru içeriği...' }} />
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {activeItem.ctaText && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 9px', fontSize: '10px', fontWeight: 700, borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)', color: 'inherit' }}>{activeItem.ctaText} <ExternalLink size={9} /></span>}
              {activeItem.isDismissable && <button type="button" style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, padding: '2px', cursor: 'pointer' }}><X size={13} /></button>}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: currentPlacement === 'left_floating' ? 'flex-start' : 'flex-end', gap: '12px', padding: '6px 0' }}>
            <div dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'} style={{ width: sizeMetrics.width, padding: sizeMetrics.padding, fontSize: sizeMetrics.fontSize, background: previewBg, color: previewText, border: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight, borderRadius: '8px', opacity: announcementActive ? currentOpacity / 100 : 0.45, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}>
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

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Boyut & Şeffaflık</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
            <select
              className="form-select" value={activeItem.sizePreset || 'standard'}
              onChange={(e) => {
                const preset = e.target.value as 'compact' | 'standard' | 'large';
                updateCurrentItem({
                  sizePreset: preset,
                  ...(currentPlacement === 'top_hanging' ? { customHeight: preset === 'compact' ? 36 : preset === 'large' ? 62 : 46 } : { cardWidth: preset === 'compact' ? 260 : preset === 'large' ? 380 : 310 }),
                });
              }}
              style={{ fontSize: '11px', height: '28px', padding: '2px 6px' }}
            >
              <option value="compact">Kompakt (İnce)</option>
              <option value="standard">Standart (Orta)</option>
              <option value="large">Geniş (Büyük)</option>
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <input type="number" className="form-input" style={{ fontSize: '11px', height: '28px', width: '56px', textAlign: 'center', padding: '2px' }} value={currentPlacement === 'top_hanging' ? (activeItem.customHeight || 46) : (activeItem.cardWidth || 310)} onChange={(e) => updateCurrentItem(currentPlacement === 'top_hanging' ? { customHeight: parseInt(e.target.value, 10) } : { cardWidth: parseInt(e.target.value, 10) })} />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>px</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', minWidth: '55px' }}>Opaklık: %{currentOpacity}</span>
            <input type="range" min="40" max="100" step="5" value={currentOpacity} onChange={(e) => updateCurrentItem({ opacity: parseInt(e.target.value, 10) })} style={{ flex: 1, cursor: 'pointer' }} />
          </div>
        </div>

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
            <select className="form-select" style={{ fontSize: '11px', height: '26px', padding: '2px 6px' }} value={announcementMeta.tickerDirection || 'rtl'} onChange={(e: any) => setAnnouncementMeta({ ...announcementMeta, tickerDirection: e.target.value })}>
              <option value="rtl">Sağdan Sola (RTL)</option>
              <option value="ltr">Soldan Sağa (LTR)</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Hız:</span>
            <select className="form-select" style={{ fontSize: '11px', height: '26px', padding: '2px 6px' }} value={announcementMeta.tickerSpeed || 'normal'} onChange={(e: any) => setAnnouncementMeta({ ...announcementMeta, tickerSpeed: e.target.value })}>
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
