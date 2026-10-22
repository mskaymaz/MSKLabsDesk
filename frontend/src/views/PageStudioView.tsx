import React, { useState, useEffect } from 'react';
import type { SitePage, PageFormData, StudioBlock, StudioBlockType } from '../types';
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
    let htmlTr = '';
    let htmlEn = '';
    let htmlAr = '';

    currBlocks.forEach((b) => {
      const tTr = b.title_tr || '';
      const tEn = b.title_en || tTr;
      const tAr = b.title_ar || tTr;
      const subTr = b.subtitle_tr || '';
      const subEn = b.subtitle_en || subTr;
      const subAr = b.subtitle_ar || subTr;

      if (b.type === 'hero') {
        const badge = b.badge_text ? `<span class="cms-badge">${b.badge_text}</span>` : '';
        const pBtn = b.btn_primary_text || 'Hemen Keşfet';
        const sBtn = b.btn_secondary_text || 'Daha Fazla Bilgi';
        const btns = `<div class="cms-btn-group"><a href="${b.btn_primary_link || '#'}" class="cms-btn cms-btn-primary">${pBtn}</a><a href="${b.btn_secondary_link || '#'}" class="cms-btn cms-btn-secondary">${sBtn}</a></div>`;
        const renderHero = (t: string, s: string) => `<div class="cms-hero text-${b.align || 'center'}">${badge}<h1>${t}</h1>${s ? `<p>${s}</p>` : ''}${btns}</div>\n`;
        htmlTr += renderHero(tTr, subTr); htmlEn += renderHero(tEn, subEn); htmlAr += renderHero(tAr, subAr);
      } else if (b.type === 'features_grid') {
        const cols = b.grid_columns || 3;
        const itemsHtml = (b.items || []).map((it) => `  <div class="cms-card"><h4>${it.title}</h4><p>${it.text}</p></div>\n`).join('');
        const renderGrid = (t: string, s: string) => `<div class="cms-features-section"><h2>${t}</h2>${s ? `<p class="cms-sub">${s}</p>` : ''}<div class="cms-grid cols-${cols}">\n${itemsHtml}</div></div>\n`;
        htmlTr += renderGrid(tTr, subTr); htmlEn += renderGrid(tEn, subEn); htmlAr += renderGrid(tAr, subAr);
      } else if (b.type === 'faq_accordion') {
        const itemsHtml = (b.items || []).map((it) => `  <details class="cms-faq-item"><summary><strong>${it.title}</strong></summary><p>${it.text}</p></details>\n`).join('');
        const renderFaq = (t: string, s: string) => `<div class="cms-faq-group"><h2>${t}</h2>${s ? `<p class="cms-sub">${s}</p>` : ''}\n${itemsHtml}</div>\n`;
        htmlTr += renderFaq(tTr, subTr); htmlEn += renderFaq(tEn, subEn); htmlAr += renderFaq(tAr, subAr);
      } else if (b.type === 'contact_card') {
        const customRows = (b.items || []).map((it) => `  <div class="cms-contact-row"><strong>${it.title}:</strong> <span>${it.text}</span></div>\n`).join('');
        const renderContact = (t: string, s: string, emailLabel: string) => `<div class="cms-contact-box"><h3>${t}</h3>${s ? `<p>${s}</p>` : ''}<div class="cms-contact-grid">\n  <div class="cms-contact-row"><strong>${emailLabel}:</strong> <a href="mailto:destek@msklabs.org">destek@msklabs.org</a></div>\n${customRows}</div></div>\n`;
        htmlTr += renderContact(tTr, subTr, 'E-Posta'); htmlEn += renderContact(tEn, subEn, 'Email'); htmlAr += renderContact(tAr, subAr, 'البريد');
      } else if (b.type === 'cta_banner') {
        const ctaBtn = b.btn_primary_text || 'İletişime Geç';
        const renderCta = (t: string, s: string) => `<div class="cms-cta-banner text-${b.align || 'center'}"><h2>${t}</h2>${s ? `<p>${s}</p>` : ''}<a href="${b.btn_primary_link || '/contact.html'}" class="cms-btn cms-btn-primary">${ctaBtn}</a></div>\n`;
        htmlTr += renderCta(tTr, subTr); htmlEn += renderCta(tEn, subEn); htmlAr += renderCta(tAr, subAr);
      } else if (b.type === 'comparison_table') {
        const cardsHtml = (b.items || []).map((it) => {
          const bullets = it.text.split('\n').filter(Boolean).map((x) => `<li>${x}</li>`).join('');
          return `  <div class="cms-pricing-card ${it.highlight ? 'featured' : ''}">${it.badge ? `<span class="cms-badge">${it.badge}</span>` : ''}<h3>${it.title}</h3><div class="cms-price">${it.price || '$0'}</div><ul>${bullets}</ul></div>\n`;
        }).join('');
        const renderPricing = (t: string, s: string) => `<div class="cms-pricing-table"><h2>${t}</h2>${s ? `<p class="cms-sub">${s}</p>` : ''}<div class="cms-pricing-grid">\n${cardsHtml}</div></div>\n`;
        htmlTr += renderPricing(tTr, subTr); htmlEn += renderPricing(tEn, subEn); htmlAr += renderPricing(tAr, subAr);
      } else if (b.type === 'ad_hook') {
        const slotComment = `<!-- AD_SLOT: ${b.ad_slot_key || 'ad_in_content'} -->\n`;
        htmlTr += slotComment; htmlEn += slotComment; htmlAr += slotComment;
      } else {
        htmlTr += b.content_tr || '';
        htmlEn += b.content_en || b.content_tr || '';
        htmlAr += b.content_ar || b.content_tr || '';
      }
    });

    let existingMeta: Record<string, any> = {};
    try {
      if (formData.meta_json) existingMeta = JSON.parse(formData.meta_json);
    } catch {}
    existingMeta.blocks = currBlocks;
    if (formData.meta_keywords) existingMeta.seo_keywords = formData.meta_keywords;

    setFormData((prev) => ({
      ...prev,
      content_tr: htmlTr,
      content_en: htmlEn,
      content_ar: htmlAr,
      meta_json: JSON.stringify(existingMeta),
    }));
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
        onAiTranslate={onAiTranslate}
        aiTranslating={aiTranslating}
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
