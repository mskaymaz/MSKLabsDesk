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
  Megaphone,
  CheckCircle2,
  Mail,
  Send,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import type { StudioBlock } from '../../types';

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

  const getTitle = (b: StudioBlock) =>
    (lang === 'tr' ? b.title_tr : lang === 'en' ? b.title_en : b.title_ar) || b.title_tr;
  const getSubtitle = (b: StudioBlock) =>
    (lang === 'tr' ? b.subtitle_tr : lang === 'en' ? b.subtitle_en : b.subtitle_ar) || b.subtitle_tr;
  const getContent = (b: StudioBlock) =>
    (lang === 'tr' ? b.content_tr : lang === 'en' ? b.content_en : b.content_ar) || b.content_tr;

  const renderBlockContent = (block: StudioBlock) => {
    const title = getTitle(block);
    const subtitle = getSubtitle(block);
    const content = getContent(block);

    switch (block.type) {
      case 'hero':
        return (
          <div style={{ textAlign: block.align || 'center', padding: '24px 16px' }}>
            <span className="admin-badge admin-badge-purple" style={{ marginBottom: '10px' }}>
              MSK Labs
            </span>
            <h1 style={{ fontSize: device === 'mobile' ? '1.6rem' : '2.2rem', fontWeight: 800, margin: '0 0 12px 0', color: 'var(--text-primary)' }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
                {subtitle}
              </p>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: block.align === 'left' ? 'flex-start' : block.align === 'right' ? 'flex-end' : 'center', flexWrap: 'wrap' }}>
              <button type="button" className="admin-btn admin-btn-primary">
                Hemen Keşfet
              </button>
              <button type="button" className="admin-btn admin-btn-secondary">
                Daha Fazla Bilgi
              </button>
            </div>
          </div>
        );

      case 'features_grid':
        return (
          <div>
            <div style={{ textAlign: block.align || 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {title}
              </h2>
              {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>{subtitle}</p>}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: device === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >
              {(block.items || []).map((it) => (
                <div
                  key={it.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '16px',
                  }}
                >
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-primary)', opacity: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', marginBottom: '10px' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                    {it.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                    {it.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'faq_accordion':
        return (
          <div>
            <div style={{ textAlign: block.align || 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {title}
              </h2>
              {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>{subtitle}</p>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(block.items || []).map((it) => (
                <div
                  key={it.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {it.title}
                    </span>
                    <HelpCircle size={15} className="text-cyan" />
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '8px 0 0 0', lineHeight: 1.6 }}>
                    {it.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'contact_card':
        return (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              {title}
            </h3>
            {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>{subtitle}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(block.items || []).map((it) => (
                <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)' }}>
                  <Mail size={15} className="text-cyan" />
                  <strong>{it.title}:</strong>
                  <span>{it.text}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cta_banner':
        return (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(99, 102, 241, 0.15))',
              border: '1px solid rgba(2, 132, 199, 0.3)',
              borderRadius: '14px',
              padding: '32px 24px',
              textAlign: block.align || 'center',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 8px 0' }}>
              {title}
            </h2>
            {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 20px 0' }}>{subtitle}</p>}
            <button type="button" className="admin-btn admin-btn-primary" style={{ padding: '8px 24px', fontSize: '13px' }}>
              <Send size={14} style={{ marginRight: '6px' }} />
              İletişime Geç
            </button>
          </div>
        );

      case 'ad_hook':
        return (
          <div
            style={{
              border: '2px dashed var(--accent-cyan)',
              background: 'rgba(2, 132, 199, 0.05)',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Megaphone size={20} className="text-cyan" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              {title || 'Sayfa Ortası Reklam Yuvası'}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              Bağlı Yuva: {block.ad_slot_key || 'ad_in_content'}
            </span>
          </div>
        );

      case 'rich_text':
      default:
        return (
          <div>
            {title && <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>{title}</h2>}
            <div
              style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--text-primary)' }}
              dangerouslySetInnerHTML={{ __html: content || '<p><em>Metin bloğu içeriği...</em></p>' }}
            />
          </div>
        );
    }
  };

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
              const paddingVal =
                block.padding_y === 'none'
                  ? '0'
                  : block.padding_y === 'sm'
                  ? '16px'
                  : block.padding_y === 'lg'
                  ? '48px'
                  : '28px';

              return (
                <React.Fragment key={block.id}>
                  <div
                    onClick={() => onSelectBlock(block.id)}
                    style={{
                      position: 'relative',
                      padding: `${paddingVal} 24px`,
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

                    {renderBlockContent(block)}
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
