import React, { useState, useEffect } from 'react';
import type { SitePage, PageFormData, StudioBlock, StudioBlockType } from '../types';
import { api } from '../services/api';
import { BlockPalette } from '../components/pages/BlockPalette';
import { PageCanvas } from '../components/pages/PageCanvas';
import { BlockInspector } from '../components/pages/BlockInspector';
import { PagePreviewModal } from '../components/pages/PagePreviewModal';
import { StudioTopBar } from '../components/pages/StudioTopBar';

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
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [canvasTheme, setCanvasTheme] = useState<'light' | 'dark'>('light');
  const [canvasZoom, setCanvasZoom] = useState<'fit' | '100' | '75'>('100');

  // Bloklar ve Seçim Durumu
  const [blocks, setBlocks] = useState<StudioBlock[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Geri Al / Yinele (Undo/Redo History Stack)
  const [history, setHistory] = useState<StudioBlock[][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Autosave Durum Makinesi
  const [autosaveState, setAutosaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');
  const [internalAiTranslating, setInternalAiTranslating] = useState(false);

  // Sayfa açıldığında blokları başlat
  useEffect(() => {
    if (!isOpen) return;

    let initialBlocks: StudioBlock[] = [];
    if (editingPage?.meta_json) {
      try {
        const meta = JSON.parse(editingPage.meta_json);
        if (Array.isArray(meta.blocks) && meta.blocks.length > 0) {
          initialBlocks = meta.blocks;
        }
      } catch {}
    }

    // Blok yoksa mevcut HTML içerikten başlangıç bloğu üret
    if (initialBlocks.length === 0) {
      initialBlocks = [
        {
          id: `blk_hero_${Date.now()}`,
          type: 'hero',
          title_tr: formData.title_tr || 'Sayfa Başlığı',
          title_en: formData.title_en || 'Page Title',
          title_ar: formData.title_ar || 'عنوان الصفحة',
          subtitle_tr: formData.summary_tr || '',
          subtitle_en: formData.summary_en || '',
          subtitle_ar: formData.summary_ar || '',
          align: 'center',
          padding_y: 'md',
        },
        {
          id: `blk_text_${Date.now() + 1}`,
          type: 'rich_text',
          title_tr: '',
          content_tr: formData.content_tr || '<p>Sayfa içeriği...</p>',
          content_en: formData.content_en || '<p>Page content...</p>',
          content_ar: formData.content_ar || '<p>محتوى الصفحة...</p>',
          padding_y: 'md',
        },
      ];
    }

    setBlocks(initialBlocks);
    setHistory([initialBlocks]);
    setHistoryIndex(0);
    setSelectedBlockId(initialBlocks[0]?.id || null);
    setAutosaveState('idle');
  }, [isOpen, editingPage]);

  // Geçmişe durum kaydet
  const pushHistory = (newBlocks: StudioBlock[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newBlocks);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setBlocks(newBlocks);
    setAutosaveState('dirty');
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setBlocks(history[prevIdx]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setBlocks(history[nextIdx]);
    }
  };

  // 3000ms Debounced Autosave State Machine
  useEffect(() => {
    if (autosaveState === 'dirty') {
      const timer = setTimeout(() => {
        setAutosaveState('saving');
        // Blokları formData'ya derle
        compileBlocksToFormData(blocks);
        setTimeout(() => setAutosaveState('saved'), 600);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autosaveState, blocks]);

  const compileBlocksToFormData = (currBlocks: StudioBlock[]) => {
    const renderLang = (lang: 'tr' | 'en' | 'ar') => {
      let out = '';
      currBlocks.forEach((b) => {
        const t = (lang === 'tr' ? b.title_tr : lang === 'en' ? b.title_en : b.title_ar) || b.title_tr || '';
        const sub = (lang === 'tr' ? b.subtitle_tr : lang === 'en' ? b.subtitle_en : b.subtitle_ar) || b.subtitle_tr || '';
        const pBtn = (lang === 'tr' ? b.btn_primary_text : lang === 'en' ? (b.btn_primary_text_en || b.btn_primary_text) : (b.btn_primary_text_ar || b.btn_primary_text)) || (lang === 'tr' ? 'Hemen Keşfet' : lang === 'en' ? 'Explore Now' : 'اكتشف الآن');
        const sBtn = (lang === 'tr' ? b.btn_secondary_text : lang === 'en' ? (b.btn_secondary_text_en || b.btn_secondary_text) : (b.btn_secondary_text_ar || b.btn_secondary_text)) || (lang === 'tr' ? 'Daha Fazla Bilgi' : lang === 'en' ? 'Learn More' : 'معرفة المزيد');
        const badge = (lang === 'tr' ? b.badge_text : lang === 'en' ? (b.badge_text_en || b.badge_text) : (b.badge_text_ar || b.badge_text)) || b.badge_text;

        if (b.type === 'hero') {
          const badgeHtml = badge ? `<span class="cms-badge">${badge}</span>` : '';
          const btns = `<div class="cms-btn-group"><a href="${b.btn_primary_link || '#'}" class="cms-btn cms-btn-primary">${pBtn}</a><a href="${b.btn_secondary_link || '#'}" class="cms-btn cms-btn-secondary">${sBtn}</a></div>`;
          out += `<div class="cms-hero text-${b.align || 'center'}">${badgeHtml}<h1>${t}</h1>${sub ? `<p>${sub}</p>` : ''}${btns}</div>\n`;
        } else if (b.type === 'features_grid') {
          const cols = b.grid_columns || 3;
          const itemsHtml = (b.items || []).map((it) => {
            const itT = (lang === 'tr' ? (it.title_tr || it.title) : lang === 'en' ? (it.title_en || it.title) : (it.title_ar || it.title)) || it.title;
            const itTxt = (lang === 'tr' ? (it.text_tr || it.text) : lang === 'en' ? (it.text_en || it.text) : (it.text_ar || it.text)) || it.text;
            return `  <div class="cms-card"><h4>${itT}</h4><p>${itTxt}</p></div>\n`;
          }).join('');
          out += `<div class="cms-features-section"><h2>${t}</h2>${sub ? `<p class="cms-sub">${sub}</p>` : ''}<div class="cms-grid cols-${cols}">\n${itemsHtml}</div></div>\n`;
        } else if (b.type === 'faq_accordion') {
          const itemsHtml = (b.items || []).map((it) => {
            const itT = (lang === 'tr' ? (it.title_tr || it.title) : lang === 'en' ? (it.title_en || it.title) : (it.title_ar || it.title)) || it.title;
            const itTxt = (lang === 'tr' ? (it.text_tr || it.text) : lang === 'en' ? (it.text_en || it.text) : (it.text_ar || it.text)) || it.text;
            return `  <details class="cms-faq-item"><summary><strong>${itT}</strong></summary><p>${itTxt}</p></details>\n`;
          }).join('');
          out += `<div class="cms-faq-group"><h2>${t}</h2>${sub ? `<p class="cms-sub">${sub}</p>` : ''}\n${itemsHtml}</div>\n`;
        } else if (b.type === 'contact_card') {
          const emailLbl = lang === 'tr' ? 'E-Posta' : lang === 'en' ? 'Email' : 'البريد الإلكتروني';
          const customRows = (b.items || []).map((it) => {
            const itT = (lang === 'tr' ? (it.title_tr || it.title) : lang === 'en' ? (it.title_en || it.title) : (it.title_ar || it.title)) || it.title;
            const itTxt = (lang === 'tr' ? (it.text_tr || it.text) : lang === 'en' ? (it.text_en || it.text) : (it.text_ar || it.text)) || it.text;
            return `  <div class="cms-contact-row"><strong>${itT}:</strong> <span>${itTxt}</span></div>\n`;
          }).join('');
          out += `<div class="cms-contact-box"><h3>${t}</h3>${sub ? `<p>${sub}</p>` : ''}<div class="cms-contact-grid">\n  <div class="cms-contact-row"><strong>${emailLbl}:</strong> <a href="mailto:destek@msklabs.org">destek@msklabs.org</a></div>\n${customRows}</div></div>\n`;
        } else if (b.type === 'cta_banner') {
          const ctaBtn = (lang === 'tr' ? b.btn_primary_text : lang === 'en' ? (b.btn_primary_text_en || b.btn_primary_text) : (b.btn_primary_text_ar || b.btn_primary_text)) || (lang === 'tr' ? 'İletişime Geç' : lang === 'en' ? 'Get In Touch' : 'اتصل بنا');
          out += `<div class="cms-cta-banner text-${b.align || 'center'}"><h2>${t}</h2>${sub ? `<p>${sub}</p>` : ''}<a href="${b.btn_primary_link || '/contact.html'}" class="cms-btn cms-btn-primary">${ctaBtn}</a></div>\n`;
        } else if (b.type === 'comparison_table') {
          const cardsHtml = (b.items || []).map((it) => {
            const itT = (lang === 'tr' ? (it.title_tr || it.title) : lang === 'en' ? (it.title_en || it.title) : (it.title_ar || it.title)) || it.title;
            const itTxt = (lang === 'tr' ? (it.text_tr || it.text) : lang === 'en' ? (it.text_en || it.text) : (it.text_ar || it.text)) || it.text;
            const itBdg = (lang === 'tr' ? it.badge : lang === 'en' ? (it.badge_en || it.badge) : (it.badge_ar || it.badge)) || it.badge;
            const itPr = (lang === 'tr' ? it.price : lang === 'en' ? (it.price_en || it.price) : (it.price_ar || it.price)) || it.price;
            const bullets = itTxt.split('\n').filter(Boolean).map((x) => `<li>${x}</li>`).join('');
            return `  <div class="cms-pricing-card ${it.highlight ? 'featured' : ''}">${itBdg ? `<span class="cms-badge">${itBdg}</span>` : ''}<h3>${itT}</h3><div class="cms-price">${itPr || '$0'}</div><ul>${bullets}</ul></div>\n`;
          }).join('');
          out += `<div class="cms-pricing-table"><h2>${t}</h2>${sub ? `<p class="cms-sub">${sub}</p>` : ''}<div class="cms-pricing-grid">\n${cardsHtml}</div></div>\n`;
        } else if (b.type === 'ad_hook') {
          out += `<!-- AD_SLOT: ${b.ad_slot_key || 'ad_in_content'} -->\n`;
        } else {
          out += (lang === 'tr' ? b.content_tr : lang === 'en' ? b.content_en : b.content_ar) || b.content_tr || '';
        }
      });
      return out;
    };

    let existingMeta: Record<string, any> = {};
    try {
      if (formData.meta_json) existingMeta = JSON.parse(formData.meta_json);
    } catch {}
    existingMeta.blocks = currBlocks;
    if (formData.meta_keywords) existingMeta.seo_keywords = formData.meta_keywords;

    setFormData((prev) => ({
      ...prev,
      content_tr: renderLang('tr'),
      content_en: renderLang('en'),
      content_ar: renderLang('ar'),
      meta_json: JSON.stringify(existingMeta),
    }));
  };

  const handleAiTranslateUnified = async () => {
    if (blocks.length > 0) {
      setInternalAiTranslating(true);
      try {
        const res = await api.translatePage({
          title_tr: formData.title_tr || editingPage?.title_tr || 'Sayfa',
          blocks,
        });
        if (res.success && res.blocks) {
          setBlocks(res.blocks);
          pushHistory(res.blocks);
          compileBlocksToFormData(res.blocks);
          alert('Tüm bloklar Gemini AI ile İngilizce ve Arapça dillerine başarıyla çevrildi.');
        } else {
          throw new Error('Blok çeviri sonucu alınamadı.');
        }
      } catch (err: any) {
        alert(err.message || 'AI blok çevirisi sırasında hata oluştu.');
      } finally {
        setInternalAiTranslating(false);
      }
    } else {
      onAiTranslate();
    }
  };

  const handleAddBlock = (type: StudioBlockType, insertAt?: number) => {
    const newBlock: StudioBlock = {
      id: `blk_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      type,
      title_tr: type === 'hero' ? 'Yeni Karşılama Başlığı' : type === 'features_grid' ? 'Özelliklerimiz' : type === 'faq_accordion' ? 'Sıkça Sorulan Sorular' : type === 'contact_card' ? 'İletişim Bilgileri' : type === 'cta_banner' ? 'Hemen Başlayın' : type === 'comparison_table' ? 'Paket Karşılaştırması' : 'Yeni Blok',
      subtitle_tr: 'Açıklama veya alt başlık...',
      padding_y: 'md',
      bg_variant: 'default',
      border_radius: 'md',
      align: type === 'hero' || type === 'cta_banner' ? 'center' : 'left',
      badge_text: type === 'hero' ? 'MSK Labs' : undefined,
      btn_primary_text: type === 'hero' ? 'Hemen Keşfet' : type === 'cta_banner' ? 'İletişime Geç' : undefined,
      btn_secondary_text: type === 'hero' ? 'Daha Fazla Bilgi' : undefined,
      grid_columns: type === 'features_grid' ? 3 : undefined,
      items: (type === 'features_grid' || type === 'faq_accordion' || type === 'contact_card') ? [
        { id: `it_1`, title: 'Örnek Madde 1', text: 'Detaylı açıklama metni...' },
        { id: `it_2`, title: 'Örnek Madde 2', text: 'Detaylı açıklama metni...' },
        { id: `it_3`, title: 'Örnek Madde 3', text: 'Detaylı açıklama metni...' },
      ] : type === 'comparison_table' ? [
        { id: `it_plan_1`, title: 'Başlangıç', price: 'Ücretsiz', text: 'Temel Özellikler\nTopluluk Desteği\nTemel Güncellemeler', badge: 'Standart', highlight: false },
        { id: `it_plan_2`, title: 'Profesyonel', price: '$0 / Özgür', text: 'Tüm Özellikler\nÖncelikli Destek\nErken Erişim\nReklamsız Deneyim', badge: 'Popüler', highlight: true },
      ] : undefined,
    };

    const next = [...blocks];
    if (typeof insertAt === 'number') {
      next.splice(insertAt, 0, newBlock);
    } else {
      next.push(newBlock);
    }
    pushHistory(next);
    setSelectedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (patch: Partial<StudioBlock>) => {
    if (!selectedBlockId) return;
    const next = blocks.map((b) => (b.id === selectedBlockId ? { ...b, ...patch } : b));
    pushHistory(next);
  };

  const handleDeleteBlock = (id: string) => {
    const next = blocks.filter((b) => b.id !== id);
    pushHistory(next);
    if (selectedBlockId === id) setSelectedBlockId(next[0]?.id || null);
  };

  const handleCloneBlock = (id: string) => {
    const target = blocks.find((b) => b.id === id);
    if (!target) return;
    const cloned: StudioBlock = {
      ...target,
      id: `blk_${target.type}_${Date.now()}_clone`,
      title_tr: `${target.title_tr} (Kopya)`,
    };
    const idx = blocks.findIndex((b) => b.id === id);
    const next = [...blocks];
    next.splice(idx + 1, 0, cloned);
    pushHistory(next);
    setSelectedBlockId(cloned.id);
  };

  const handleMoveBlock = (id: string, dir: 'up' | 'down') => {
    const idx = blocks.findIndex((b) => b.id === id);
    if (idx === -1) return;
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === blocks.length - 1) return;

    const next = [...blocks];
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    pushHistory(next);
  };

  const handleSaveAndPublish = (e: React.FormEvent) => {
    compileBlocksToFormData(blocks);
    onSave(e);
  };

  if (!isOpen) return null;

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  return (
    <div
      className="studio-container animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1200,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
      }}
    >
      <StudioTopBar
        editingPage={editingPage}
        formData={formData}
        setFormData={setFormData}
        autosaveState={autosaveState}
        onClose={onClose}
        undo={undo}
        redo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        device={device}
        setDevice={setDevice}
        canvasZoom={canvasZoom}
        setCanvasZoom={setCanvasZoom}
        canvasTheme={canvasTheme}
        setCanvasTheme={setCanvasTheme}
        isLeftPanelOpen={isLeftPanelOpen}
        setIsLeftPanelOpen={setIsLeftPanelOpen}
        isRightPanelOpen={isRightPanelOpen}
        setIsRightPanelOpen={setIsRightPanelOpen}
        isMetaOpen={isMetaOpen}
        setIsMetaOpen={setIsMetaOpen}
        onAiTranslate={handleAiTranslateUnified}
        aiTranslating={aiTranslating || internalAiTranslating}
        onPreview={() => { compileBlocksToFormData(blocks); setIsPreviewOpen(true); }}
        onSave={handleSaveAndPublish}
      />

      {/* 2. Ana İş İstasyonu Gövdesi (Flyout & Fixed Artboard) */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Orta Sahne: İnteraktif Tuval (Tam Alan) */}
        <PageCanvas
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={(id) => { setSelectedBlockId(id); setIsRightPanelOpen(true); }}
          onMoveUp={(id) => handleMoveBlock(id, 'up')}
          onMoveDown={(id) => handleMoveBlock(id, 'down')}
          onDelete={handleDeleteBlock}
          onClone={handleCloneBlock}
          onAddBlockPrompt={(afterIdx) => handleAddBlock('hero', afterIdx)}
          lang={activeTab}
          device={device}
          canvasTheme={canvasTheme}
          canvasZoom={canvasZoom}
          isLeftPanelOpen={isLeftPanelOpen}
          setIsLeftPanelOpen={setIsLeftPanelOpen}
          isRightPanelOpen={isRightPanelOpen}
          setIsRightPanelOpen={setIsRightPanelOpen}
        />

        {/* Sol Yüzen Panel: Bileşen Kütüphanesi (Flyout Drawer) */}
        {isLeftPanelOpen && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              zIndex: 40,
              boxShadow: '8px 0 32px rgba(0,0,0,0.5)',
              background: 'var(--bg-sidebar)',
            }}
          >
            <BlockPalette
              onAddBlock={handleAddBlock}
              onClose={() => setIsLeftPanelOpen(false)}
            />
          </div>
        )}

        {/* Sağ Yüzen Panel: Özellik Denetçisi (Flyout Drawer) */}
        {isRightPanelOpen && selectedBlock && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 40,
              boxShadow: '-8px 0 32px rgba(0,0,0,0.5)',
              background: 'var(--bg-sidebar)',
            }}
          >
            <BlockInspector
              block={selectedBlock}
              onUpdate={handleUpdateBlock}
              onDelete={handleDeleteBlock}
              onClone={handleCloneBlock}
              onMoveUp={(id) => handleMoveBlock(id, 'up')}
              onMoveDown={(id) => handleMoveBlock(id, 'down')}
              onClose={() => setIsRightPanelOpen(false)}
              lang={activeTab}
            />
          </div>
        )}
      </div>

      {/* Canlı Önizleme Modalı */}
      <PagePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
        blocks={blocks}
        activeLanguage={activeTab}
      />
    </div>
  );
};
