import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Eye,
  FileText,
  Save,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Lock,
  Layers,
} from 'lucide-react';
import type { SitePage, PageFormData } from '../types';
import { RichTextEditor } from '../components/ui/RichTextEditor';
import { PagePreviewModal } from '../components/pages/PagePreviewModal';
import { ModularSectionBuilder, type PageSection } from '../components/pages/ModularSectionBuilder';

export interface PageStudioViewProps {
  isOpen: boolean;
  onClose: () => void;
  editingPage: SitePage | null;
  formData: PageFormData;
  setFormData: React.Dispatch<React.SetStateAction<PageFormData>>;
  onSave: (e: React.FormEvent) => void;
  onAiTranslate: () => void;
  aiTranslating: boolean;
}

export const PageStudioView: React.FC<PageStudioViewProps> = ({
  isOpen,
  onClose,
  editingPage,
  formData,
  setFormData,
  onSave,
  onAiTranslate,
  aiTranslating,
}) => {
  const [activeTab, setActiveTab] = useState<'tr' | 'en' | 'ar'>('tr');
  const [editorMode, setEditorMode] = useState<'rich' | 'modular'>('rich');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [autosaveState, setAutosaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');

  // Modüler Bloklar Durumu
  const [sections, setSections] = useState<PageSection[]>([]);

  // 3000ms Debounced Autosave State Machine
  useEffect(() => {
    if (autosaveState === 'dirty') {
      const timer = setTimeout(() => {
        setAutosaveState('saving');
        setTimeout(() => setAutosaveState('saved'), 600);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autosaveState]);

  if (!isOpen) return null;

  const handleContentChange = (val: string, lang: 'tr' | 'en' | 'ar') => {
    setFormData((prev) => ({
      ...prev,
      [lang === 'tr' ? 'content_tr' : lang === 'en' ? 'content_en' : 'content_ar']: val,
    }));
    setAutosaveState('dirty');
  };

  const handleTitleChange = (val: string, lang: 'tr' | 'en' | 'ar') => {
    setFormData((prev) => ({
      ...prev,
      [lang === 'tr' ? 'title_tr' : lang === 'en' ? 'title_en' : 'title_ar']: val,
    }));
    setAutosaveState('dirty');
  };

  const handleSummaryChange = (val: string, lang: 'tr' | 'en' | 'ar') => {
    setFormData((prev) => ({
      ...prev,
      [lang === 'tr' ? 'summary_tr' : lang === 'en' ? 'summary_en' : 'summary_ar']: val,
    }));
    setAutosaveState('dirty');
  };

  const handleSectionsChange = (newSections: PageSection[]) => {
    setSections(newSections);
    // Modüler blokları HTML içeriğe dönüştür
    let htmlOutput = '';
    newSections.forEach((sec) => {
      if (sec.type === 'faq') {
        htmlOutput += `<h2>${sec.title}</h2>\n`;
        if (sec.subtitle) htmlOutput += `<p><em>${sec.subtitle}</em></p>\n`;
        htmlOutput += `<div class="faq-accordion-group">\n`;
        sec.items.forEach((it) => {
          htmlOutput += `  <div class="faq-item-card">\n    <h3>${it.title}</h3>\n    <p>${it.text}</p>\n  </div>\n`;
        });
        htmlOutput += `</div>\n`;
      } else if (sec.type === 'features') {
        htmlOutput += `<h2>${sec.title}</h2>\n`;
        if (sec.subtitle) htmlOutput += `<p>${sec.subtitle}</p>\n`;
        htmlOutput += `<div class="features-grid">\n`;
        sec.items.forEach((it) => {
          htmlOutput += `  <div class="feature-item">\n    <h4>${it.title}</h4>\n    <p>${it.text}</p>\n  </div>\n`;
        });
        htmlOutput += `</div>\n`;
      } else if (sec.type === 'contact_card') {
        htmlOutput += `<h2>${sec.title}</h2>\n`;
        htmlOutput += `<div class="contact-card-box">\n`;
        sec.items.forEach((it) => {
          htmlOutput += `  <p><strong>${it.title}:</strong> ${it.text}</p>\n`;
        });
        htmlOutput += `</div>\n`;
      } else {
        htmlOutput += `<h2>${sec.title}</h2>\n`;
        if (sec.subtitle) htmlOutput += `<p>${sec.subtitle}</p>\n`;
      }
    });

    handleContentChange(htmlOutput, activeTab);
  };

  const currentTitle =
    activeTab === 'tr' ? formData.title_tr : activeTab === 'en' ? formData.title_en : formData.title_ar;
  const currentSummary =
    activeTab === 'tr' ? formData.summary_tr : activeTab === 'en' ? formData.summary_en : formData.summary_ar;
  const currentContent =
    activeTab === 'tr' ? formData.content_tr : activeTab === 'en' ? formData.content_en : formData.content_ar;

  const isSystemPage = Boolean(editingPage?.is_system);

  return (
    <div className="studio-container animate-fade-in" style={{ zIndex: 1100 }}>
      {/* 1. Üst Stüdyo Çubuğu */}
      <header className="studio-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Listeye Geri Dön"
          >
            <ArrowLeft size={14} />
            <span>Sayfalar</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {editingPage ? `Sayfayı Düzenle: ${editingPage.title_tr}` : 'Yeni Kurumsal Sayfa'}
              </h2>
              <span
                className={`admin-badge ${
                  autosaveState === 'saved'
                    ? 'admin-badge-emerald'
                    : autosaveState === 'saving'
                    ? 'admin-badge-cyan'
                    : autosaveState === 'dirty'
                    ? 'admin-badge-amber'
                    : ''
                }`}
                style={{ fontSize: '10px' }}
              >
                {autosaveState === 'saved'
                  ? 'Taslak Kaydedildi'
                  : autosaveState === 'saving'
                  ? 'Kaydediliyor...'
                  : autosaveState === 'dirty'
                  ? 'Değişiklikler Var'
                  : 'Hazır'}
              </span>
              {isSystemPage && (
                <span className="admin-badge admin-badge-purple" style={{ fontSize: '10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={10} />
                  Sistem Sayfası
                </span>
              )}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              /{formData.slug || 'slug'} • Durum: {formData.status === 'published' ? 'Yayında' : 'Taslak'}
            </span>
          </div>
        </div>

        {/* Sağ Stüdyo Aksiyonları */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* TR / EN / AR Sekmeleri (Bayrak Emojisi Yasak Standardı) */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '3px',
              border: '1px solid var(--border-color)',
            }}
          >
            {(['tr', 'en', 'ar'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveTab(lang)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  background: activeTab === lang ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === lang ? '#FFF' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '11px',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  transition: 'all 0.15s ease',
                }}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* AI Çeviri & Doldurma Butonu */}
          <button
            type="button"
            onClick={onAiTranslate}
            disabled={aiTranslating}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Türkçe içerikten İngilizce ve Arapça versiyonları otomatik üret"
          >
            <Sparkles size={14} className={aiTranslating ? 'animate-spin text-purple' : 'text-purple'} />
            <span>{aiTranslating ? 'AI Çeviriyor...' : 'AI Çevir'}</span>
          </button>

          {/* Canlı Önizleme Butonu */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Sayfanın vitrinde nasıl görüneceğini simüle et"
          >
            <Eye size={14} />
            <span>Önizle</span>
          </button>

          {/* Kaydet / Yayına Al Butonu */}
          <button
            type="button"
            onClick={onSave}
            className="admin-btn admin-btn-primary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={14} />
            <span>Kaydet & Yayına Al</span>
          </button>
        </div>
      </header>

      {/* 2. Ana Stüdyo Tuvali */}
      <div className="studio-canvas-area" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Editör Modu Seçici (Zengin Metin vs Modüler Bloklar) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px 18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                İçerik Düzenleme Modu:
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setEditorMode('rich')}
                  className={`admin-btn admin-btn-sm ${editorMode === 'rich' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={13} />
                  <span>Serbest Zengin Metin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('modular')}
                  className={`admin-btn admin-btn-sm ${editorMode === 'modular' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Layers size={13} />
                  <span>Modüler Bölümler (SSS / İlkeler)</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMetaOpen(!isMetaOpen)}
              className="admin-btn admin-btn-secondary admin-btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <SlidersHorizontal size={13} />
              <span>SEO & Sayfa Ayarları</span>
              {isMetaOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>

          {/* Collapsible SEO & Meta Ayarları */}
          {isMetaOpen && (
            <div
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <label className="admin-label">Kalıcı Bağlantı / Adres (Slug)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>msklabs.org/</span>
                  <input
                    type="text"
                    disabled={isSystemPage}
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().trim() }))}
                    className="admin-input"
                    placeholder="ornek-sayfa"
                    style={{ flex: 1, cursor: isSystemPage ? 'not-allowed' : 'text' }}
                  />
                  {isSystemPage && (
                    <span title="Sistem sayfası adresi kilitlidir">
                      <Lock size={14} className="text-muted" />
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="admin-label">Hero / Kapak Görseli URL</label>
                <input
                  type="text"
                  value={formData.hero_image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, hero_image: e.target.value }))}
                  className="admin-input"
                  placeholder="img/BizKimiz2.jpg veya https://..."
                />
              </div>

              <div>
                <label className="admin-label">Yayın Durumu</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                  className="admin-select"
                >
                  <option value="published">Yayında (Canlı)</option>
                  <option value="draft">Taslak (Yalnızca Yönetici Görür)</option>
                  <option value="archived">Arşivlendi</option>
                </select>
              </div>

              <div>
                <label className="admin-label">Sıralama Önceliği</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData((prev) => ({ ...prev, display_order: parseInt(e.target.value, 10) || 0 }))}
                  className="admin-input"
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label className="admin-label">SEO Anahtar Kelimeleri</label>
                <input
                  type="text"
                  value={formData.meta_keywords || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_keywords: e.target.value }))}
                  className="admin-input"
                  placeholder="virgülle ayrılmış anahtar kelimeler..."
                />
              </div>
            </div>
          )}

          {/* Başlık ve Özet Form Alanları */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
            dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
          >
            <div>
              <label className="admin-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Sayfa Başlığı ({activeTab.toUpperCase()})</span>
                <span className="text-rose">*</span>
              </label>
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => handleTitleChange(e.target.value, activeTab)}
                placeholder={activeTab === 'tr' ? 'Örn: Hakkımızda & Biz Kimiz' : activeTab === 'en' ? 'e.g. About Us' : 'مثال: من نحن'}
                className="admin-input"
                style={{ fontSize: '16px', fontWeight: 700 }}
              />
            </div>

            <div>
              <label className="admin-label">Kısa Sayfa Özeti & SEO Açıklaması ({activeTab.toUpperCase()})</label>
              <textarea
                rows={2}
                value={currentSummary}
                onChange={(e) => handleSummaryChange(e.target.value, activeTab)}
                placeholder="Sayfanın arama motorlarında ve sosyal medyada görünecek özeti..."
                className="admin-input"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Ana İçerik Editörü (Zengin Metin veya Modüler Bloklar) */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <label className="admin-label" style={{ marginBottom: '12px', display: 'block' }}>
              Sayfa Gövdesi ({activeTab.toUpperCase()})
            </label>

            {editorMode === 'rich' ? (
              <RichTextEditor
                value={currentContent}
                onChange={(val) => handleContentChange(val, activeTab)}
                placeholder="Kurumsal sayfa metnini buraya yazın..."
                dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
              />
            ) : (
              <ModularSectionBuilder
                sections={sections}
                onChange={handleSectionsChange}
                lang={activeTab}
              />
            )}
          </div>
        </div>
      </div>

      {/* Canlı Önizleme Modalı */}
      <PagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
        activeLanguage={activeTab}
      />
    </div>
  );
};
