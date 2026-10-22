import React from 'react';
import { LayoutTemplate, X, ArrowRight } from 'lucide-react';
import type { StudioBlock } from '../../types';
import { STUDIO_TEMPLATES, type TemplatePreset } from './studioTemplatePresets';

export { STUDIO_TEMPLATES, type TemplatePreset };

export interface StudioTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (blocks: StudioBlock[], templateName: string) => void;
}

export const StudioTemplatesModal: React.FC<StudioTemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  if (!isOpen) return null;

  const handleSelect = (tmpl: TemplatePreset) => {
    if (confirm(`"${tmpl.name}" şablonu tuval üzerine yüklensin mi?\nMevcut bloklar değiştirilecektir (Geri alabilirsiniz).`)) {
      onApplyTemplate(tmpl.blocks, tmpl.name);
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        style={{
          width: '840px',
          maxWidth: '96vw',
          maxHeight: '90vh',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst Başlık */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <LayoutTemplate size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Hazır Sayfa Şablonları (Presets)
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Kurumsal sayfalarınız için önceden tasarlanmış, çok dilli ve optimize edilmiş blok setleri.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-btn-icon" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Şablon Kartları Izgarası */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {STUDIO_TEMPLATES.map((tmpl) => (
            <div
              key={tmpl.id}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px',
                transition: 'all 0.15s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="admin-badge admin-badge-cyan" style={{ fontSize: '10px' }}>
                    {tmpl.badge}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {tmpl.blockCount} Blok Seti
                  </span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  {tmpl.name}
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                  {tmpl.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {tmpl.tags.map((tg, idx) => (
                    <span key={idx} style={{ fontSize: '10px', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelect(tmpl)}
                className="admin-btn admin-btn-primary admin-btn-sm"
                style={{ width: '100%', padding: '8px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <span>Şablonu Tuvale Uygula</span>
                <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
