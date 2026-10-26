import React, { useState, useEffect } from 'react';
import { Megaphone, Save, Plus, Trash2 } from 'lucide-react';
import { Switch } from '../ui/Input';
import { RichTextEditor } from '../ui/RichTextEditor';
import { type AnnouncementMeta, type AnnouncementItem, BANNER_THEMES } from './announcementConfig';
import { AnnouncementPreviewMockup } from './AnnouncementPreviewMockup';

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
      sideOffset: activeItem.sideOffset,
      tabText: activeItem.tabText,
      autoCollapseDelay: activeItem.autoCollapseDelay,
      glassEffect: activeItem.glassEffect,
    };
    setAnnouncementMeta(nextMeta);
    (onSave as any)(e, nextMeta);
  };

  const currentPlacement = activeItem.placement || 'top_hanging';
  const currentBgOpacity = activeItem.bgOpacity ?? activeItem.opacity ?? 95;
  const currentTextOpacity = activeItem.textOpacity ?? 100;
  const isTicker = (activeItem.displayMode || 'static') === 'ticker';
  const isCustomTheme = activeItem.bannerType === 'custom';

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

      {/* 2. Bağımsız Canlı Önizleme Vitrini (Browser / Device Mockup Penceresi) */}
      <AnnouncementPreviewMockup
        activeItem={activeItem}
        announcementActive={announcementActive}
        announcementText={announcementText}
        activeLangTab={activeLangTab}
        setActiveLangTab={setActiveLangTab}
      />

      {/* 3. Kompakt Araç Çubuğu: Duyuru Seçici + Yerleşim & Akış Açılır Listeleri */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '14px', flexWrap: 'wrap', background: 'var(--bg-secondary, rgba(15,23,42,0.3))', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
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

      {/* 4. Derli Toplu Ayar Paneli (Açılır Listeler ve Gruplanmış Kontroller) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '14px', padding: '12px', background: 'var(--bg-secondary, rgba(15, 23, 42, 0.4))', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>Duyuru Başlığı</label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', cursor: 'pointer', color: 'var(--text-secondary)', marginLeft: '20px' }}>
              <input type="checkbox" checked={activeItem.isActive !== false} onChange={(e) => updateCurrentItem({ isActive: e.target.checked })} />
              <span style={{ fontWeight: 600 }}>Aktif</span>
            </label>
          </div>
          <input type="text" className="form-input" value={activeItem.title || ''} onChange={(e) => updateCurrentItem({ title: e.target.value })} placeholder="Duyuru Başlığı" style={{ fontSize: '11px', height: '28px', marginBottom: currentPlacement !== 'top_hanging' ? '8px' : '0' }} />

          {currentPlacement !== 'top_hanging' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '6px', paddingTop: '6px', borderTop: '1px dashed var(--border-subtle)' }}>
              <div title="Dikey Kulakçık Üzerinde Yazacak Metin">
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Kulakçık Metni:</span>
                <input type="text" className="form-input" placeholder="SİZİN İÇİN" style={{ fontSize: '10px', height: '24px', padding: '2px 6px' }} value={activeItem.tabText ?? ''} onChange={(e) => updateCurrentItem({ tabText: e.target.value })} />
              </div>
              <div title="İlk Açık Kalma Süresi (0 ise doğrudan kulakçık başlar)">
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Açık Süre (sn):</span>
                <input type="number" min="0" max="30" className="form-input" placeholder="4" style={{ fontSize: '10px', height: '24px', textAlign: 'center', padding: '2px' }} value={activeItem.autoCollapseDelay ?? ''} onChange={(e) => updateCurrentItem({ autoCollapseDelay: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
              </div>
            </div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Tema & Renkler</label>
          <select className="form-select" value={activeItem.bannerType || 'info'} onChange={(e) => updateCurrentItem({ bannerType: e.target.value as any })} style={{ fontSize: '11px', height: '28px', marginBottom: '6px', padding: '2px 6px' }}>
            {BANNER_THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>{theme.name}</option>
            ))}
          </select>
          {isCustomTheme && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Zemin:</span>
                <input type="color" value={activeItem.customBg || '#f8fafc'} onChange={(e) => updateCurrentItem({ customBg: e.target.value })} style={{ width: '26px', height: '24px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }} title="Özel Zemin Rengi" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Yazı:</span>
                <input type="color" value={activeItem.customText || '#0f172a'} onChange={(e) => updateCurrentItem({ customText: e.target.value })} style={{ width: '26px', height: '24px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }} title="Özel Yazı Rengi" />
              </div>
            </div>
          )}
          {/* Zemin Şeffaflık Efekti Açılır Menüsü */}
          <div>
            <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Zemin Efekti:</span>
            <select
              className="form-select"
              value={activeItem.glassEffect || 'none'}
              onChange={(e) => updateCurrentItem({ glassEffect: e.target.value as any })}
              style={{ fontSize: '10px', height: '24px', padding: '1px 4px' }}
            >
              <option value="none">Düz Şeffaf (Altı Net Okunur)</option>
              <option value="blur">Buzlu Cam (Bulanık Arka Plan)</option>
            </select>
          </div>
        </div>

        {currentPlacement === 'top_hanging' ? (
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Boyut, Boşluk & Zemin Opaklığı</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '4px', marginBottom: '8px' }}>
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
            {/* Zemin ve Yazı Opaklığı */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>Boyut, Kenar & Opaklık</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '8px' }}>
              <div title="Kart Genişliği (px)">
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Gen:</span>
                <input type="number" className="form-input" placeholder="310" style={{ fontSize: '11px', height: '26px', padding: '2px', textAlign: 'center' }} value={activeItem.cardWidth ?? ''} onChange={(e) => updateCurrentItem({ cardWidth: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
              </div>
              <div title="Kart Yüksekliği (px, boş=otomatik)">
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Yük:</span>
                <input type="number" className="form-input" placeholder="Oto" style={{ fontSize: '11px', height: '26px', padding: '2px', textAlign: 'center' }} value={activeItem.cardHeight ?? ''} onChange={(e) => updateCurrentItem({ cardHeight: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
              </div>
              <div title="İç Boşluk (pad)">
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Pad:</span>
                <input type="number" className="form-input" placeholder="10" style={{ fontSize: '11px', height: '26px', padding: '2px', textAlign: 'center' }} value={activeItem.paddingY ?? ''} onChange={(e) => updateCurrentItem({ paddingY: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
              </div>
              <div title="Üstten Mesafe (px)">
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Üst:</span>
                <input type="number" className="form-input" placeholder="110" style={{ fontSize: '11px', height: '26px', padding: '2px', textAlign: 'center' }} value={activeItem.topOffset ?? ''} onChange={(e) => updateCurrentItem({ topOffset: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
              </div>
              <div title="Sağ/Sol Kenar Boşluğu (px, varsayılan 5px)">
                <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)' }}>Kenar:</span>
                <input type="number" className="form-input" placeholder="5" style={{ fontSize: '11px', height: '26px', padding: '2px', textAlign: 'center' }} value={activeItem.sideOffset ?? ''} onChange={(e) => updateCurrentItem({ sideOffset: e.target.value === '' ? undefined : parseInt(e.target.value, 10) })} />
              </div>
            </div>

            {/* Zemin ve Yazı Opaklığı */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '8px' }}>
            <input type="text" className="form-input" placeholder="Buton Metni" value={activeItem.ctaText || ''} onChange={(e) => updateCurrentItem({ ctaText: e.target.value })} style={{ fontSize: '10px', height: '24px' }} />
            <input type="text" className="form-input" placeholder="Buton URL (/apps)" value={activeItem.ctaUrl || ''} onChange={(e) => updateCurrentItem({ ctaUrl: e.target.value })} style={{ fontSize: '10px', height: '24px' }} />
          </div>

          {/* Kapatma '✕' butonu görünsün */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={activeItem.isDismissable} onChange={(e) => updateCurrentItem({ isDismissable: e.target.checked })} />
            <span>Kapatma '✕' butonu görünsün</span>
          </label>
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
