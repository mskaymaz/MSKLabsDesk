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

  // Autosave State Machine (3000ms debounce)
  const [autosaveState, setAutosaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');
  const [internalAiTranslating, setInternalAiTranslating] = useState(false);

  useEffect(() => {
    if (autosaveState === 'dirty') {
      const timer = setTimeout(() => {
        setAutosaveState('saving');
        setTimeout(() => setAutosaveState('saved'), 600);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autosaveState]);

  // Sayfa başlık değişikliği ve otomatik slug üretimi
  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const next = { ...prev };
      if (activeTab === 'tr') {
        next.title_tr = val;
        // Yeni sayfa eklenirken slug boşsa veya başlıkla eşleşiyorsa otomatik slugify et
        if (!editingPage) {
          next.slug = slugifyTurkish(val);
        }
      } else if (activeTab === 'en') {
        next.title_en = val;
      } else {
        next.title_ar = val;
      }
      return next;
    });
    setAutosaveState('dirty');
  };

  // Sayfa özet / alt başlık değişikliği
  const handleSummaryChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab === 'tr' ? 'summary_tr' : activeTab === 'en' ? 'summary_en' : 'summary_ar']: val,
    }));
    setAutosaveState('dirty');
  };

  // Zengin metin içerik değişikliği (TipTap HTML)
  const handleContentChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      [activeTab === 'tr' ? 'content_tr' : activeTab === 'en' ? 'content_en' : 'content_ar']: val,
    }));
    setAutosaveState('dirty');
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
        onSave(e as any);
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
        onPreview={() => setIsPreviewOpen(true)}
        onSave={onSave}
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
          onTitleChange={handleTitleChange}
          onSummaryChange={handleSummaryChange}
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
