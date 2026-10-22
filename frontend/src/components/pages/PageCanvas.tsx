import React from 'react';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Sparkles,
  PanelLeftOpen,
  PanelRightOpen,
} from 'lucide-react';
import type { StudioBlock } from '../../types';
import { BlockRenderer } from './BlockRenderer';

export interface PageCanvasProps {
  blocks: StudioBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
  onAddBlockPrompt: (afterIndex: number) => void;
  lang: 'tr' | 'en' | 'ar';
  device: 'desktop' | 'tablet' | 'mobile';
  canvasTheme: 'light' | 'dark';
  canvasZoom: 'fit' | '100' | '75';
  isLeftPanelOpen: boolean;
  setIsLeftPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PageCanvas: React.FC<PageCanvasProps> = ({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onMoveUp,
  onMoveDown,
  onDelete,
  onClone,
  onAddBlockPrompt,
  lang,
  device,
  canvasTheme,
  canvasZoom,
  isLeftPanelOpen,
  setIsLeftPanelOpen,
  isRightPanelOpen,
  setIsRightPanelOpen,
}) => {
  const isRtl = lang === 'ar';
  const fixedWidth =
    device === 'mobile' ? '390px' : device === 'tablet' ? '768px' : '1140px';

  const scaleStyle: React.CSSProperties =
    canvasZoom === '75'
      ? { transform: 'scale(0.75)', transformOrigin: 'top center', marginBottom: '-25%' }
      : canvasZoom === 'fit'
      ? { transform: 'scale(0.85)', transformOrigin: 'top center', marginBottom: '-15%' }
      : {};

  return (
    <main
      className="studio-center-stage"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: canvasTheme === 'dark' ? '#090d16' : '#e2e8f0',
        overflow: 'hidden',
        position: 'relative',
        transition: 'background 0.2s ease',
      }}
    >
      {/* Tuval Kaydırma Sahnesi (Fixed Artboard Stage) */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '36px 40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative',
          minWidth: 0,
        }}
      >
        {/* Sol Kenar Hızlı Açma Sekmesi (Paneli Kapalıyken) */}
        {!isLeftPanelOpen && (
          <button
            type="button"
            onClick={() => setIsLeftPanelOpen(true)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{
              position: 'absolute',
              top: '20px',
              left: '12px',
              zIndex: 25,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              fontSize: '11px',
              padding: '6px 12px',
              borderRadius: '8px',
            }}
          >
            <PanelLeftOpen size={14} className="text-cyan" />
            <span>Kütüphane</span>
          </button>
        )}

        {/* Sağ Kenar Hızlı Açma Sekmesi (Paneli Kapalıyken) */}
        {!isRightPanelOpen && selectedBlockId && (
          <button
            type="button"
            onClick={() => setIsRightPanelOpen(true)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{
              position: 'absolute',
              top: '20px',
              right: '12px',
              zIndex: 25,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
              fontSize: '11px',
              padding: '6px 12px',
              borderRadius: '8px',
            }}
          >
            <PanelRightOpen size={14} className="text-cyan" />
            <span>Denetçi</span>
          </button>
        )}

        <div
          data-theme={canvasTheme}
          style={{
            width: fixedWidth,
            minWidth: fixedWidth,
            maxWidth: fixedWidth,
            flexShrink: 0,
            background: canvasTheme === 'dark' ? '#0f172a' : '#ffffff',
            color: canvasTheme === 'dark' ? '#f8fafc' : '#0f172a',
            border: canvasTheme === 'dark' ? '1px solid #334155' : '1px solid #cbd5e1',
            borderRadius: device === 'desktop' ? '14px' : '20px',
            boxShadow: canvasTheme === 'dark' ? '0 25px 50px -12px rgba(0,0,0,0.8)' : '0 20px 45px -10px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background 0.2s ease, border-color 0.2s ease',
            minHeight: '600px',
            ...scaleStyle,
          }}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {blocks.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
              }}
            >
              <Sparkles size={36} className="text-cyan" style={{ opacity: 0.5, marginBottom: '14px' }} />
              <h3 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                Tuval Henüz Boş
              </h3>
              <p style={{ margin: 0, fontSize: '12px', maxWidth: '360px', lineHeight: 1.5 }}>
                Sol taraftaki bileşen kütüphanesinden dilediğiniz blokları tıklayarak sayfanızı inşa etmeye başlayın.
              </p>
            </div>
          ) : (
            blocks.map((block, index) => {
              const isSelected = selectedBlockId === block.id;

              return (
                <React.Fragment key={block.id}>
                  <div
                    onClick={() => onSelectBlock(block.id)}
                    style={{
                      position: 'relative',
                      border: isSelected ? '2px solid var(--accent-primary)' : '1px solid transparent',
                      borderRadius: '10px',
                      margin: '6px 8px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      background: isSelected ? (canvasTheme === 'dark' ? 'rgba(2, 132, 199, 0.12)' : 'rgba(2, 132, 199, 0.05)') : 'transparent',
                    }}
                    className="canvas-block-wrapper"
                  >
                    {/* Seçili Blok Aksiyon Çubuğu */}
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-14px',
                          right: isRtl ? 'auto' : '16px',
                          left: isRtl ? '16px' : 'auto',
                          background: 'var(--bg-sidebar)',
                          border: '1px solid var(--accent-primary)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          padding: '2px 4px',
                          zIndex: 10,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        }}
                      >
                        <button type="button" onClick={(e) => { e.stopPropagation(); onMoveUp(block.id); }} className="admin-btn-icon" title="Yukarı Taşı" style={{ padding: '3px' }}><ArrowUp size={12} /></button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onMoveDown(block.id); }} className="admin-btn-icon" title="Aşağı Taşı" style={{ padding: '3px' }}><ArrowDown size={12} /></button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onClone(block.id); }} className="admin-btn-icon" title="Çoğalt" style={{ padding: '3px' }}><Copy size={12} /></button>
                        <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(block.id); }} className="admin-btn-icon text-rose" title="Sil" style={{ padding: '3px' }}><Trash2 size={12} /></button>
                      </div>
                    )}

                    <BlockRenderer block={block} lang={lang} device={device} isInteractive={false} />
                  </div>

                  {/* Bloklar Arası Hızlı Ekleme Çizgisi */}
                  <div
                    style={{
                      height: '8px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    className="canvas-gap-indicator"
                  >
                    <button
                      type="button"
                      onClick={() => onAddBlockPrompt(index + 1)}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '50%',
                        width: '18px',
                        height: '18px',
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                      }}
                      className="canvas-add-btn"
                      title="Buraya Blok Ekle"
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </React.Fragment>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
};
