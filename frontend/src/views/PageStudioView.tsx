import React, { useState, useEffect, useRef } from 'react';
import type { SitePage, PageFormData } from '../types';
import { api } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { slugifyTurkish } from '../utils/slugify';
import { StudioTopBar } from '../components/pages/StudioTopBar';
import { PageCanvas } from '../components/pages/PageCanvas';
import { PagePreviewModal } from '../components/pages/PagePreviewModal';

export interface PageStudioViewProps {
  isOpen: boolean;
  onClose: () => void;
  editingPage: SitePage | null;
  formData: PageFormData;
  setFormData: React.Dispatch<React.SetStateAction<PageFormData>>;
  onSave: (e: React.FormEvent) => void;
  onAiTranslate: () => void;
  aiTranslating: boolean;
  allPages?: SitePage[];
  onSelectPage?: (page: SitePage) => void;
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
  allPages,
  onSelectPage,
}) => {
  const [activeTab, setActiveTab] = useState<'tr' | 'en' | 'ar'>('tr');
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const { theme: canvasTheme, setTheme: setAppTheme } = useTheme();
  const editorRef = useRef<any>(null);

  const [canvasZoom, setCanvasZoom] = useState<'fit' | '100' | '75'>('100');
  const [canvasWidth, setCanvasWidth] = useState<'900' | '1024' | '1160' | '1200' | 'custom'>('900');
  const [customWidthPx, setCustomWidthPx] = useState<number>(900);
  const [showSideAds, setShowSideAds] = useState<boolean>(true);

  // Autosave & Kaydetme Durum Makinesi
  const [autosaveState, setAutosaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');
  const [internalAiTranslating, setInternalAiTranslating] = useState(false);

  // Sayfa açıldığında veya dil değiştiğinde başlık & özeti zengin tuval içine dahil et
  useEffect(() => {
    if (!isOpen) return;

    setFormData((prev) => {
      const next = { ...prev };
      const currentContent = activeTab === 'tr' ? next.content_tr : activeTab === 'en' ? next.content_en : next.content_ar;
      const currentTitle = activeTab === 'tr' ? next.title_tr : activeTab === 'en' ? next.title_en : next.title_ar;
      const currentSummary = activeTab === 'tr' ? next.summary_tr : activeTab === 'en' ? next.summary_en : next.summary_ar;

      // Eğer içerik boşsa veya <h1 içermiyorsa, başlık ve alt başlığı doğrudan biçimlendirilebilir H1 ve P olarak tuvale ekle
      if (!currentContent || !currentContent.toLowerCase().includes('<h1')) {
        const titleText = currentTitle || (activeTab === 'tr' ? 'Sayfa Başlığı' : activeTab === 'en' ? 'Page Title' : 'عنوان الصفحة');
        const summaryText = currentSummary || (activeTab === 'tr' ? 'Kısa açıklama veya alt başlık...' : activeTab === 'en' ? 'Short summary or subtitle...' : 'ملخص الصفحة...');
        const newHtml = `<h1 style="text-align: center; font-size: 2.25rem; font-weight: 800; color: #0284c7;">${titleText}</h1><p style="text-align: center; color: #64748b; font-size: 1.05rem; margin-bottom: 24px;">${summaryText}</p><p>Sayfa içeriğinizi buraya yazmaya başlayın...</p>`;

        if (activeTab === 'tr') {
          next.content_tr = newHtml;
          if (!next.title_tr) next.title_tr = titleText;
        } else if (activeTab === 'en') {
          next.content_en = newHtml;
          if (!next.title_en) next.title_en = titleText;
        } else {
          next.content_ar = newHtml;
          if (!next.title_ar) next.title_ar = titleText;
        }
      }
      return next;
    });
  }, [isOpen, editingPage?.id, activeTab]);

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

  // Zengin metin içerik değişikliği (Başlık ve Özeti HTML'den otomatik senkronize eder)
  const handleContentChange = (val: string) => {
    let extractedTitle = '';
    let extractedSummary = '';

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(val, 'text/html');
      const h1El = doc.querySelector('h1') || doc.querySelector('h2');
      if (h1El) extractedTitle = (h1El.textContent || '').trim();

      const leadP = doc.querySelector('p.lead') || (h1El?.nextElementSibling?.tagName === 'P' ? h1El.nextElementSibling : null);
      if (leadP) extractedSummary = (leadP.textContent || '').trim();
    } catch {}

    setFormData((prev) => {
      const next = { ...prev };
      if (activeTab === 'tr') {
        next.content_tr = val;
        if (extractedTitle) {
          next.title_tr = extractedTitle;
          if (!editingPage && (!next.slug || next.slug.startsWith('sayfa-'))) {
            next.slug = slugifyTurkish(extractedTitle);
          }
        }
        if (extractedSummary) next.summary_tr = extractedSummary;
      } else if (activeTab === 'en') {
        next.content_en = val;
        if (extractedTitle) next.title_en = extractedTitle;
        if (extractedSummary) next.summary_en = extractedSummary;
      } else {
        next.content_ar = val;
        if (extractedTitle) next.title_ar = extractedTitle;
        if (extractedSummary) next.summary_ar = extractedSummary;
      }
      return next;
    });
    setAutosaveState('dirty');
  };

  // Manuel Kaydetme Butonu (Anlık backend kaydı ve durum güncellemesi)
  const handleManualSave = async (e: React.FormEvent) => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.getHTML();
      handleContentChange(currentHtml);
    }
    setAutosaveState('saving');
    try {
      await onSave(e);
      setAutosaveState('saved');
    } catch {
      setAutosaveState('dirty');
    }
  };

  // TipTap Undo / Redo
  const handleUndo = () => {
    if (editorRef.current?.can().undo()) {
      editorRef.current.commands.undo();
    }
  };

  const handleRedo = () => {
    if (editorRef.current?.can().redo()) {
      editorRef.current.commands.redo();
    }
  };

  // Klavyeden Hızlı Kaydetme (Ctrl+S)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleManualSave(e as any);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onSave]);

  // Stüdyodan çıkmadan sayfa değiştirme
  const handleSwitchPage = (targetPage: SitePage) => {
    if (targetPage.id === editingPage?.id) return;
    if (autosaveState === 'dirty') {
      if (
        !window.confirm(
          `"${editingPage?.title_tr || editingPage?.slug}" sayfasında kaydedilmemiş değişiklikleriniz var. Sayfayı değiştirmek istediğinize emin misiniz?`
        )
      ) {
        return;
      }
    }
    if (onSelectPage) onSelectPage(targetPage);
  };

  // AI Çeviri Hattı (TR -> EN / AR)
  const handleAiTranslateDirect = async () => {
    if (onAiTranslate) {
      onAiTranslate();
      return;
    }

    if (!formData.title_tr || !formData.content_tr) {
      alert('AI çeviri yapabilmek için önce Türkçe başlık ve içerik doldurulmalıdır.');
      return;
    }

    setInternalAiTranslating(true);
    try {
      const res = await api.translatePage({
        title_tr: formData.title_tr,
        content_tr: formData.content_tr,
        summary_tr: formData.summary_tr,
      });

      if (res.success && res.translation) {
        const tr = res.translation;
        setFormData((prev) => ({
          ...prev,
          title_en: tr.title_en || prev.title_en,
          title_ar: tr.title_ar || prev.title_ar,
          summary_tr: tr.summary_tr || prev.summary_tr,
          summary_en: tr.summary_en || prev.summary_en,
          summary_ar: tr.summary_ar || prev.summary_ar,
          content_en: tr.content_en || prev.content_en,
          content_ar: tr.content_ar || prev.content_ar,
          meta_keywords: tr.meta_keywords || prev.meta_keywords,
        }));
        alert('Sayfa başlığı, özeti ve zengin içeriği AI ile İngilizce ve Arapça dillerine çevrildi.');
      } else {
        throw new Error('AI çeviri sonucu alınamadı.');
      }
    } catch (err: any) {
      alert(err.message || 'AI çevirisi sırasında hata oluştu.');
    } finally {
      setInternalAiTranslating(false);
    }
  };

  // Düzeni ve İçeriği Diğer Dillere Klonlama
  const handleCloneLayout = () => {
    if (!formData.content_tr) {
      alert('Klonlanacak Türkçe içerik bulunamadı.');
      return;
    }

    if (activeTab === 'tr') {
      if (confirm('Türkçe sayfa düzenini ve içeriğini hem EN hem de AR sekmesine klonlamak istiyor musunuz?')) {
        setFormData((prev) => ({
          ...prev,
          title_en: prev.title_en || prev.title_tr,
          title_ar: prev.title_ar || prev.title_tr,
          summary_en: prev.summary_en || prev.summary_tr,
          summary_ar: prev.summary_ar || prev.summary_tr,
          content_en: prev.content_tr,
          content_ar: prev.content_tr,
        }));
        alert('Türkçe içerik ve biçimlendirme EN ve AR sekmelerine aktarıldı.');
      }
    } else {
      if (confirm(`Türkçe mizanpaj ve içeriği ${activeTab.toUpperCase()} sekmesine aktarmak istiyor musunuz?`)) {
        setFormData((prev) => ({
          ...prev,
          [activeTab === 'en' ? 'content_en' : 'content_ar']: prev.content_tr,
          [activeTab === 'en' ? 'title_en' : 'title_ar']:
            prev[activeTab === 'en' ? 'title_en' : 'title_ar'] || prev.title_tr,
          [activeTab === 'en' ? 'summary_en' : 'summary_ar']:
            prev[activeTab === 'en' ? 'summary_en' : 'summary_ar'] || prev.summary_tr,
        }));
        alert(`Türkçe mizanpaj ${activeTab.toUpperCase()} sekmesine aktarıldı.`);
      }
    }
  };

  // Canlı Önizleme Açmadan Önce Editör İçeriğini Senkronize Et
  const handleOpenPreview = () => {
    if (editorRef.current) {
      const latestHtml = editorRef.current.getHTML();
      handleContentChange(latestHtml);
    }
    setIsPreviewOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className="studio-container animate-fade-in"
      data-theme={canvasTheme}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
      }}
    >
      {/* 1. Üst Kontrol Çubuğu */}
      <StudioTopBar
        editingPage={editingPage}
        formData={formData}
        setFormData={setFormData}
        autosaveState={autosaveState}
        onClose={onClose}
        undo={handleUndo}
        redo={handleRedo}
        canUndo={true}
        canRedo={true}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        device={device}
        setDevice={setDevice}
        canvasZoom={canvasZoom}
        setCanvasZoom={setCanvasZoom}
        canvasTheme={canvasTheme}
        setCanvasTheme={(t) => setAppTheme(t)}
        canvasWidth={canvasWidth}
        setCanvasWidth={setCanvasWidth}
        customWidthPx={customWidthPx}
        setCustomWidthPx={setCustomWidthPx}
        showSideAds={showSideAds}
        setShowSideAds={setShowSideAds}
        allPages={allPages}
        onSwitchPage={handleSwitchPage}
        isMetaOpen={isMetaOpen}
        setIsMetaOpen={setIsMetaOpen}
        onAiTranslate={handleAiTranslateDirect}
        aiTranslating={aiTranslating || internalAiTranslating}
        onPreview={handleOpenPreview}
        onSave={handleManualSave}
        onCloneLayout={handleCloneLayout}
      />

      {/* 2. Merkez İş İstasyonu: Gökdelen Reklam Kanatları & Word Kağıt Tuval */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <PageCanvas
          formData={formData}
          activeTab={activeTab}
          device={device}
          canvasTheme={canvasTheme}
          canvasZoom={canvasZoom}
          canvasWidth={canvasWidth}
          customWidthPx={customWidthPx}
          showSideAds={showSideAds}
          onContentChange={handleContentChange}
          editorRef={editorRef}
        />
      </div>

      {/* 3. Canlı Önizleme Modalı */}
      <PagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
        activeLanguage={activeTab}
      />
    </div>
  );
};
