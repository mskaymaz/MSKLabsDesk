import React from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Sparkles,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
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
  setDevice: (d: 'desktop' | 'tablet' | 'mobile') => void;
  canvasTheme: 'light' | 'dark';
  setCanvasTheme: (t: 'light' | 'dark') => void;
  canvasZoom: 'fit' | '100' | '75';
  setCanvasZoom: (z: 'fit' | '100' | '75') => void;
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
  setDevice,
  canvasTheme,
  setCanvasTheme,
  canvasZoom,
  setCanvasZoom,
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
        background: canvasTheme === 'dark' ? '#040711' : '#0f172a',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Sahne Üst Cihaz & Genişlik Çubuğu */}
      <div
        style={{
          padding: '8px 16px',
          background: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        {/* Sol Araçlar: Panel Toggle & Cihaz Seçimi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
            className={`admin-btn-icon ${isLeftPanelOpen ? 'text-cyan' : ''}`}
            title={isLeftPanelOpen ? 'Bileşen Kütüphanesini Gizle' : 'Bileşen Kütüphanesini Aç'}
            style={{ padding: '5px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }}
          >
            {isLeftPanelOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
          </button>

          {/* Cihaz Genişlik Seçici */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
            {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={`admin-btn-icon ${device === d ? 'active text-cyan' : ''}`}
                title={d === 'desktop' ? 'Masaüstü (1140px)' : d === 'tablet' ? 'Tablet (768px)' : 'Mobil (390px)'}
                style={{ padding: '4px 8px', background: device === d ? 'var(--bg-card)' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                {d === 'desktop' ? <Monitor size={15} /> : d === 'tablet' ? <Tablet size={15} /> : <Smartphone size={15} />}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
            {device === 'desktop' ? '1140px' : device === 'tablet' ? '768px' : '390px'}
          </span>
        </div>

        {/* Orta Araçlar: Yakınlaştırma / Zoom & Tema */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Zoom Kontrolü */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
            {(['fit', '75', '100'] as const).map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setCanvasZoom(z)}
                style={{
                  padding: '3px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '5px',
                  background: canvasZoom === z ? 'var(--accent-primary)' : 'transparent',
                  color: canvasZoom === z ? '#FFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {z === 'fit' ? 'Sığdır' : `%${z}`}
              </button>
            ))}
          </div>

          {/* Canlı Açık / Koyu Tema Toggle */}
          <button
            type="button"
            onClick={() => setCanvasTheme(canvasTheme === 'light' ? 'dark' : 'light')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', padding: '4px 8px' }}
            title="Tasarlanan sayfanın canlı Açık/Koyu temasını değiştir"
          >
            {canvasTheme === 'light' ? <Moon size={13} className="text-purple" /> : <Sun size={13} className="text-amber" />}
            <span>{canvasTheme === 'light' ? 'Koyu Mod' : 'Açık Mod'}</span>
          </button>
        </div>

        {/* Sağ Araçlar: Denetçi Toggle & Blok Sayısı */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {blocks.length} Blok
          </span>
          <button
            type="button"
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className={`admin-btn-icon ${isRightPanelOpen ? 'text-cyan' : ''}`}
            title={isRightPanelOpen ? 'Özellik Denetçisini Gizle' : 'Özellik Denetçisini Aç'}
            style={{ padding: '5px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', border: 'none', cursor: 'pointer' }}
          >
            {isRightPanelOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          </button>
        </div>
      </div>

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
            border: '1px solid var(--border-color)',
            borderRadius: device === 'desktop' ? '14px' : '20px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background 0.2s ease',
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
