import React from 'react';
import {
  ArrowLeft,
  Sparkles,
  Eye,
  Save,
  RotateCcw,
  RotateCw,
  Lock,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Monitor,
  Tablet,
  Smartphone,
  Sun,
  Moon,
  LayoutTemplate,
  History,
  Copy,
} from 'lucide-react';
import type { SitePage, PageFormData } from '../../types';

export interface StudioTopBarProps {
  editingPage: SitePage | null;
  formData: PageFormData;
  setFormData: React.Dispatch<React.SetStateAction<PageFormData>>;
  autosaveState: 'idle' | 'dirty' | 'saving' | 'saved';
  onClose: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  activeTab: 'tr' | 'en' | 'ar';
  setActiveTab: (lang: 'tr' | 'en' | 'ar') => void;
  device: 'desktop' | 'tablet' | 'mobile';
  setDevice: (d: 'desktop' | 'tablet' | 'mobile') => void;
  canvasZoom: 'fit' | '100' | '75';
  setCanvasZoom: (z: 'fit' | '100' | '75') => void;
  canvasTheme: 'light' | 'dark';
  setCanvasTheme: (t: 'light' | 'dark') => void;
  canvasWidth?: '900' | '1024' | '1160' | '1200' | 'custom';
  setCanvasWidth?: (w: '900' | '1024' | '1160' | '1200' | 'custom') => void;
  customWidthPx?: number;
  setCustomWidthPx?: (px: number) => void;
  showSideAds?: boolean;
  setShowSideAds?: React.Dispatch<React.SetStateAction<boolean>>;
  allPages?: SitePage[];
  onSwitchPage?: (page: SitePage) => void;
  isMetaOpen: boolean;
  setIsMetaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAiTranslate: () => void;
  aiTranslating: boolean;
  onPreview: () => void;
  onSave: (e: React.FormEvent) => void;
  onOpenTemplates?: () => void;
  onOpenRevisions?: () => void;
  revisionsCount?: number;
  onCloneLayout?: () => void;
}

export const StudioTopBar: React.FC<StudioTopBarProps> = ({
  editingPage,
  formData,
  setFormData,
  autosaveState,
  onClose,
  undo,
  redo,
  canUndo,
  canRedo,
  activeTab,
  setActiveTab,
  device,
  setDevice,
  canvasZoom,
  setCanvasZoom,
  canvasTheme,
  setCanvasTheme,
  canvasWidth = '900',
  setCanvasWidth,
  customWidthPx = 900,
  setCustomWidthPx,
  showSideAds = true,
  setShowSideAds,
  allPages,
  onSwitchPage,
  isMetaOpen,
  setIsMetaOpen,
  onAiTranslate,
  aiTranslating,
  onPreview,
  onSave,
  onOpenTemplates,
  onOpenRevisions,
  revisionsCount = 0,
  onCloneLayout,
}) => {
  const isSystemPage = Boolean(editingPage?.is_system);

  return (
    <>
      <header className="studio-header" style={{ padding: 0, background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', zIndex: 50 }}>
        {/* 1. Üst Satır: Sayfa Kimliği ve Yayınlama Eylemleri */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 14px', borderBottom: '1px solid var(--border-subtle, rgba(255,255,255,0.06))', gap: '10px' }}>
          {/* Sol: Geri Dönüş ve Başlık/Slug */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', padding: '3px 8px' }}
            >
              <ArrowLeft size={13} />
              <span>Sayfalar</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {allPages && allPages.length > 0 && onSwitchPage ? (
                <select
                  value={editingPage?.id || ''}
                  onChange={(e) => {
                    const target = allPages.find((p) => p.id === e.target.value);
                    if (target) onSwitchPage(target);
                  }}
                  className="admin-select"
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '5px',
                    color: 'var(--text-primary)',
                    maxWidth: '180px',
                  }}
                  title="Düzenlemek için sayfayı değiştirin"
                >
                  {allPages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title_tr || p.slug} {p.is_system ? '🔒' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <h2 style={{ fontSize: '12px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {editingPage ? editingPage.title_tr : 'Yeni Kurumsal Sayfa'}
                </h2>
              )}
              <span
                className={`admin-badge ${
                  autosaveState === 'saved' ? 'admin-badge-emerald' : autosaveState === 'saving' ? 'admin-badge-cyan' : autosaveState === 'dirty' ? 'admin-badge-amber' : ''
                }`}
                style={{ fontSize: '9px', padding: '1px 5px' }}
              >
                {autosaveState === 'saved' ? 'Kaydedildi' : autosaveState === 'saving' ? 'Kaydediliyor...' : autosaveState === 'dirty' ? 'Değişiklikler Var' : 'Hazır'}
              </span>
              {isSystemPage && (
                <span className="admin-badge admin-badge-purple" style={{ fontSize: '9px', display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '1px 5px' }}>
                  <Lock size={9} />
                  Sistem
                </span>
              )}
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                /{formData.slug || 'slug'}
              </span>
            </div>
          </div>

          {/* Sağ: Şablonlar, Geçmiş, SEO, Önizle, Yayına Al */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {onOpenTemplates && (
              <button
                type="button"
                onClick={onOpenTemplates}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px' }}
                title="Hazır sayfa şablonları"
              >
                <LayoutTemplate size={12} className="text-cyan" />
                <span>Şablonlar</span>
              </button>
            )}

            {onOpenRevisions && (
              <button
                type="button"
                onClick={onOpenRevisions}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px' }}
                title="Sürüm ve revizyon geçmişi"
              >
                <History size={12} className="text-purple" />
                <span>Geçmiş</span>
                {revisionsCount > 0 && (
                  <span className="admin-badge admin-badge-purple" style={{ fontSize: '9px', padding: '0 4px', borderRadius: '4px' }}>
                    {revisionsCount}
                  </span>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMetaOpen(!isMetaOpen)}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px' }}
            >
              <SlidersHorizontal size={12} />
              <span>SEO</span>
              {isMetaOpen ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>

            <button
              type="button"
              onClick={onPreview}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '3px 8px' }}
            >
              <Eye size={12} />
              <span>Önizle</span>
            </button>

            <button
              type="button"
              onClick={onSave}
              className="admin-btn admin-btn-primary admin-btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', padding: '3px 12px', fontWeight: 700 }}
              title="Değişiklikleri Kaydet (Ctrl+S)"
            >
              <Save size={12} />
              <span>Kaydet</span>
            </button>
          </div>
        </div>

        {/* 2. Alt Satır: Tuval Görünümü (Sol) & İçerik Düzenleme/Dil (Sağ) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 14px', background: 'var(--bg-secondary)', gap: '8px' }}>
          {/* Sol Araçlar: Cihaz, Genişlik, Kanatlar, Zoom, Açık/Koyu Tema */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '5px', padding: '1px', gap: '2px' }}>
              {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDevice(d)}
                  className={`admin-btn-icon ${device === d ? 'active text-cyan' : ''}`}
                  title={d === 'desktop' ? 'Masaüstü' : d === 'tablet' ? 'Tablet (768px)' : 'Mobil (390px)'}
                  style={{ padding: '3px 6px', background: device === d ? 'var(--accent-primary)' : 'transparent', color: device === d ? '#FFF' : 'inherit', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {d === 'desktop' ? <Monitor size={12} /> : d === 'tablet' ? <Tablet size={12} /> : <Smartphone size={12} />}
                </button>
              ))}
            </div>

            {device === 'desktop' && setCanvasWidth && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'var(--bg-card)', borderRadius: '5px', padding: '2px 4px' }}>
                <select
                  value={canvasWidth}
                  onChange={(e) => setCanvasWidth(e.target.value as any)}
                  className="admin-select"
                  style={{ fontSize: '10px', padding: '1px 3px', border: 'none', background: 'transparent', fontWeight: 700 }}
                  title="Tuval Genişliği"
                >
                  <option value="900">900px (Vitrin)</option>
                  <option value="1024">1024px</option>
                  <option value="1160">1160px</option>
                  <option value="1200">1200px</option>
                  <option value="custom">Özel px</option>
                </select>
                {canvasWidth === 'custom' && setCustomWidthPx && (
                  <input
                    type="number"
                    value={customWidthPx}
                    onChange={(e) => setCustomWidthPx(Number(e.target.value))}
                    className="admin-input"
                    style={{ width: '44px', fontSize: '10px', padding: '1px 2px', height: '18px' }}
                    min={400}
                    max={1920}
                  />
                )}
              </div>
            )}

            {device === 'desktop' && setShowSideAds && (
              <button
                type="button"
                onClick={() => setShowSideAds(!showSideAds)}
                className={`admin-btn admin-btn-sm ${showSideAds ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                style={{ fontSize: '10px', padding: '2px 6px' }}
                title={showSideAds ? 'Sol/Sağ Dikey Reklam Kanatlarını Gizle' : 'Sol/Sağ Dikey Reklam Kanatlarını Göster (120x600)'}
              >
                <span>{showSideAds ? 'Kanatlar' : 'Kanatsız'}</span>
              </button>
            )}

            <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '5px', padding: '1px', gap: '2px' }}>
              {(['fit', '75', '100'] as const).map((z) => (
                <button key={z} type="button" onClick={() => setCanvasZoom(z)} style={{ padding: '2px 5px', fontSize: '10px', fontWeight: 700, border: 'none', borderRadius: '3px', background: canvasZoom === z ? 'var(--accent-primary)' : 'transparent', color: canvasZoom === z ? '#FFF' : 'var(--text-secondary)', cursor: 'pointer' }}>
                  {z === 'fit' ? 'Sığdır' : `%${z}`}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCanvasTheme(canvasTheme === 'light' ? 'dark' : 'light')}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', padding: '2px 7px' }}
              title="Açık / Koyu Tema Değiştir"
            >
              {canvasTheme === 'light' ? <Moon size={12} className="text-purple" /> : <Sun size={12} className="text-amber" />}
              <span>{canvasTheme === 'light' ? 'Koyu' : 'Açık'}</span>
            </button>
          </div>

          {/* Sağ Araçlar: Geri/İleri Alma, TR EN AR Dil Seçici, AI Çevir */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
            <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '5px', padding: '1px', gap: '2px' }}>
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                className="admin-btn-icon"
                title="Geri Al (Ctrl+Z)"
                style={{ padding: '3px', opacity: canUndo ? 1 : 0.3 }}
              >
                <RotateCcw size={12} />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                className="admin-btn-icon"
                title="Yinele (Ctrl+Y)"
                style={{ padding: '3px', opacity: canRedo ? 1 : 0.3 }}
              >
                <RotateCw size={12} />
              </button>
            </div>

            <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '5px', padding: '1px', border: '1px solid var(--border-color)', gap: '1px' }}>
              {(['tr', 'en', 'ar'] as const).map((lang) => (
                <button key={lang} type="button" onClick={() => setActiveTab(lang)} style={{ padding: '2px 8px', borderRadius: '3px', border: 'none', background: activeTab === lang ? 'var(--accent-primary)' : 'transparent', color: activeTab === lang ? '#FFF' : 'var(--text-secondary)', fontWeight: 800, fontSize: '10px', cursor: 'pointer', textTransform: 'uppercase' }}>
                  {lang}
                </button>
              ))}
            </div>

            {onCloneLayout && (
              <button
                type="button"
                onClick={onCloneLayout}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', padding: '2px 7px' }}
                title="Türkçe mizanpaj ve içeriği diğer dillere kopyalar"
              >
                <Copy size={11} />
                <span>Klonla</span>
              </button>
            )}

            <button
              type="button"
              onClick={onAiTranslate}
              disabled={aiTranslating}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '10px', padding: '2px 8px' }}
              title="Türkçe kaynaktan İngilizce ve Arapça versiyonları otomatik üret"
            >
              <Sparkles size={12} className={aiTranslating ? 'animate-spin text-purple' : 'text-purple'} />
              <span>{aiTranslating ? 'AI Çeviriyor...' : 'AI Çevir'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Collapsible SEO & Sayfa Ayarları Barı */}
      {isMetaOpen && (
        <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '12px 20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', zIndex: 45 }}>
          <div>
            <label className="admin-label" style={{ fontSize: '11px' }}>Kalıcı Bağlantı (Slug)</label>
            <input type="text" disabled={isSystemPage} value={formData.slug} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().trim() }))} className="admin-input" style={{ fontSize: '11px' }} />
          </div>
          <div>
            <label className="admin-label" style={{ fontSize: '11px' }}>Yayın Durumu</label>
            <select value={formData.status} onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))} className="admin-select" style={{ fontSize: '11px' }}>
              <option value="published">Yayında (Canlı)</option>
              <option value="draft">Taslak</option>
              <option value="archived">Arşivlendi</option>
            </select>
          </div>
          <div>
            <label className="admin-label" style={{ fontSize: '11px' }}>Kapak Görseli URL</label>
            <input
              type="text"
              value={formData.hero_image || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, hero_image: e.target.value }))}
              className="admin-input"
              placeholder="https://.../cover.webp"
              style={{ fontSize: '11px' }}
            />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label className="admin-label" style={{ fontSize: '11px' }}>SEO Anahtar Kelimeleri</label>
            <input
              type="text"
              value={formData.meta_keywords || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, meta_keywords: e.target.value }))}
              className="admin-input"
              placeholder="virgülle ayrılmış kelimeler..."
              style={{ fontSize: '11px' }}
            />
          </div>
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label className="admin-label" style={{ fontSize: '11px' }}>SEO Meta Açıklamaları (TR / EN / AR)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
              <input
                type="text"
                value={formData.meta_description_tr || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, meta_description_tr: e.target.value }))}
                className="admin-input"
                placeholder="Açıklama (TR - max 160 kar.)..."
                style={{ fontSize: '11px' }}
              />
              <input
                type="text"
                value={formData.meta_description_en || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, meta_description_en: e.target.value }))}
                className="admin-input"
                placeholder="Description (EN)..."
                style={{ fontSize: '11px' }}
              />
              <input
                type="text"
                value={formData.meta_description_ar || ''}
                dir="rtl"
                onChange={(e) => setFormData((prev) => ({ ...prev, meta_description_ar: e.target.value }))}
                className="admin-input"
                placeholder="الوصف (AR)..."
                style={{ fontSize: '11px' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
