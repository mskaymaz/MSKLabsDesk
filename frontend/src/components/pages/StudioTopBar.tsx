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
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  LayoutTemplate,
  History,
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
  isLeftPanelOpen: boolean;
  setIsLeftPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMetaOpen: boolean;
  setIsMetaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onAiTranslate: () => void;
  aiTranslating: boolean;
  onPreview: () => void;
  onSave: (e: React.FormEvent) => void;
  onOpenTemplates: () => void;
  onOpenRevisions: () => void;
  revisionsCount?: number;
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
  isLeftPanelOpen,
  setIsLeftPanelOpen,
  isRightPanelOpen,
  setIsRightPanelOpen,
  isMetaOpen,
  setIsMetaOpen,
  onAiTranslate,
  aiTranslating,
  onPreview,
  onSave,
  onOpenTemplates,
  onOpenRevisions,
  revisionsCount = 0,
}) => {
  const isSystemPage = Boolean(editingPage?.is_system);

  return (
    <>
      <header className="studio-header" style={{ padding: '8px 16px', background: 'var(--bg-sidebar)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50 }}>
        {/* Sol Aksiyonlar: Geri Dönüş ve Başlık */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={14} />
            <span>Sayfalar</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {allPages && allPages.length > 0 && onSwitchPage ? (
                <select
                  value={editingPage?.id || ''}
                  onChange={(e) => {
                    const target = allPages.find((p) => p.id === e.target.value);
                    if (target) onSwitchPage(target);
                  }}
                  className="admin-select"
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
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
                <h2 style={{ fontSize: '13px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  {editingPage ? editingPage.title_tr : 'Yeni Kurumsal Sayfa'}
                </h2>
              )}
              <span
                className={`admin-badge ${
                  autosaveState === 'saved' ? 'admin-badge-emerald' : autosaveState === 'saving' ? 'admin-badge-cyan' : autosaveState === 'dirty' ? 'admin-badge-amber' : ''
                }`}
                style={{ fontSize: '10px' }}
              >
                {autosaveState === 'saved' ? 'Kaydedildi' : autosaveState === 'saving' ? 'Kaydediliyor...' : autosaveState === 'dirty' ? 'Değişiklikler Var' : 'Hazır'}
              </span>
              {isSystemPage && (
                <span className="admin-badge admin-badge-purple" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={10} />
                  Sistem
                </span>
              )}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
              /{formData.slug || 'slug'} • Durum: {formData.status === 'published' ? 'Yayında' : 'Taslak'} • {device === 'desktop' ? `${canvasWidth === 'custom' ? customWidthPx : canvasWidth}px tuval` : device}
            </span>
          </div>
        </div>

        {/* Orta Araçlar: Panel, Cihaz, Genişlik, Kanatlar, Zoom, Tema Kontrolleri */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
            className={`admin-btn-icon ${isLeftPanelOpen ? 'text-cyan' : ''}`}
            title={isLeftPanelOpen ? 'Bileşen Kütüphanesini Gizle' : 'Bileşen Kütüphanesini Aç'}
            style={{ padding: '5px 7px', borderRadius: '6px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }}
          >
            {isLeftPanelOpen ? <PanelLeftClose size={14} /> : <PanelLeftOpen size={14} />}
          </button>

          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '6px', padding: '2px', gap: '2px' }}>
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={`admin-btn-icon ${device === d ? 'active text-cyan' : ''}`}
                title={d === 'desktop' ? 'Masaüstü' : d === 'tablet' ? 'Tablet (768px)' : 'Mobil (390px)'}
                style={{ padding: '3px 7px', background: device === d ? 'var(--bg-card)' : 'transparent', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                {d === 'desktop' ? <Monitor size={14} /> : d === 'tablet' ? <Tablet size={14} /> : <Smartphone size={14} />}
              </button>
            ))}
          </div>

          {device === 'desktop' && setCanvasWidth && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'var(--bg-secondary)', borderRadius: '6px', padding: '2px 4px' }}>
              <select
                value={canvasWidth}
                onChange={(e) => setCanvasWidth(e.target.value as any)}
                className="admin-select"
                style={{ fontSize: '10px', padding: '2px 4px', border: 'none', background: 'transparent', fontWeight: 700 }}
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
                  style={{ width: '48px', fontSize: '10px', padding: '1px 3px', height: '20px' }}
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
              style={{ fontSize: '10px', padding: '3px 6px' }}
              title={showSideAds ? 'Sol/Sağ Dikey Reklam Kanatlarını Gizle' : 'Sol/Sağ Dikey Reklam Kanatlarını Göster (120x600)'}
            >
              <span>{showSideAds ? 'Kanatlar' : 'Kanatsız'}</span>
            </button>
          )}

          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '6px', padding: '2px', gap: '2px' }}>
            {(['fit', '75', '100'] as const).map((z) => (
              <button key={z} type="button" onClick={() => setCanvasZoom(z)} style={{ padding: '3px 6px', fontSize: '10px', fontWeight: 700, border: 'none', borderRadius: '4px', background: canvasZoom === z ? 'var(--accent-primary)' : 'transparent', color: canvasZoom === z ? '#FFF' : 'var(--text-secondary)', cursor: 'pointer' }}>
                {z === 'fit' ? 'Sığdır' : `%${z}`}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCanvasTheme(canvasTheme === 'light' ? 'dark' : 'light')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '4px 8px' }}
            title="Tasarlanan sayfanın canlı Açık/Koyu modunu değiştir"
          >
            {canvasTheme === 'light' ? <Moon size={13} className="text-purple" /> : <Sun size={13} className="text-amber" />}
            <span>{canvasTheme === 'light' ? 'Koyu' : 'Açık'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className={`admin-btn-icon ${isRightPanelOpen ? 'text-cyan' : ''}`}
            title={isRightPanelOpen ? 'Özellik Denetçisini Gizle' : 'Özellik Denetçisini Aç'}
            style={{ padding: '5px 7px', borderRadius: '6px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }}
          >
            {isRightPanelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
          </button>
        </div>

        {/* Sağ Aksiyonlar: Dil, Undo/Redo, AI Çevir, SEO, Önizle, Kaydet */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '6px', padding: '2px', gap: '2px' }}>
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="admin-btn-icon"
              title="Geri Al (Undo)"
              style={{ padding: '4px', opacity: canUndo ? 1 : 0.3 }}
            >
              <RotateCcw size={13} />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="admin-btn-icon"
              title="Yinele (Redo)"
              style={{ padding: '4px', opacity: canRedo ? 1 : 0.3 }}
            >
              <RotateCw size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '6px', padding: '2px', border: '1px solid var(--border-color)', gap: '2px' }}>
            {(['tr', 'en', 'ar'] as const).map((lang) => (
              <button key={lang} type="button" onClick={() => setActiveTab(lang)} style={{ padding: '3px 10px', borderRadius: '4px', border: 'none', background: activeTab === lang ? 'var(--accent-primary)' : 'transparent', color: activeTab === lang ? '#FFF' : 'var(--text-secondary)', fontWeight: 800, fontSize: '11px', cursor: 'pointer', textTransform: 'uppercase' }}>
                {lang}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onAiTranslate}
            disabled={aiTranslating}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Türkçe kaynaktan İngilizce ve Arapça versiyonları otomatik üret"
          >
            <Sparkles size={13} className={aiTranslating ? 'animate-spin text-purple' : 'text-purple'} />
            <span>{aiTranslating ? 'AI Çeviriyor...' : 'AI Çevir'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenTemplates}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title="Hazır sayfa şablonları"
          >
            <LayoutTemplate size={13} className="text-cyan" />
            <span>Şablonlar</span>
          </button>

          <button
            type="button"
            onClick={onOpenRevisions}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            title="Sürüm ve revizyon geçmişi"
          >
            <History size={13} className="text-purple" />
            <span>Geçmiş</span>
            {revisionsCount > 0 && (
              <span className="admin-badge admin-badge-purple" style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px' }}>
                {revisionsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsMetaOpen(!isMetaOpen)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <SlidersHorizontal size={13} />
            <span>SEO</span>
            {isMetaOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>

          <button
            type="button"
            onClick={onPreview}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Eye size={13} />
            <span>Önizle</span>
          </button>

          <button
            type="button"
            onClick={onSave}
            className="admin-btn admin-btn-primary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={13} />
            <span>Yayına Al</span>
          </button>
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
