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
}) => {
  const isRtl = lang === 'ar';
  const widthStyle =
    device === 'mobile' ? '390px' : device === 'tablet' ? '768px' : '100%';

  return (
    <main
      className="studio-center-stage"
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#090d16',
        overflow: 'hidden',
      }}
    >
      {/* Sahne Üst Cihaz & Genişlik Çubuğu */}
      <div
        style={{
          padding: '10px 20px',
          background: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
          İnteraktif Tuval ({device.toUpperCase()})
        </span>

        {/* Cihaz Genişlik Seçici */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
          {(['desktop', 'tablet', 'mobile'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              className={`admin-btn-icon ${device === d ? 'active text-cyan' : ''}`}
              title={d === 'desktop' ? 'Masaüstü' : d === 'tablet' ? 'Tablet' : 'Mobil'}
              style={{ padding: '4px 8px', background: device === d ? 'var(--bg-card)' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              {d === 'desktop' ? <Monitor size={15} /> : d === 'tablet' ? <Tablet size={15} /> : <Smartphone size={15} />}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {blocks.length} Blok Yerleşti
        </span>
      </div>

      {/* Tuval Kaydırma Sahnesi */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '30px 20px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: widthStyle,
            maxWidth: '1000px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: device === 'desktop' ? '14px' : '20px',
            boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.25s ease-in-out',
            minHeight: '400px',
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
                      background: isSelected ? 'rgba(2, 132, 199, 0.04)' : 'transparent',
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
