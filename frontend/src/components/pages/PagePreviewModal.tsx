import React, { useState } from 'react';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import type { PageFormData, StudioBlock } from '../../types';
import { BlockRenderer } from './BlockRenderer';

export interface PagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: PageFormData;
  blocks?: StudioBlock[];
  activeLanguage: 'tr' | 'en' | 'ar';
}

export const PagePreviewModal: React.FC<PagePreviewModalProps> = ({
  isOpen,
  onClose,
  formData,
  blocks,
  activeLanguage,
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewLang, setPreviewLang] = useState<'tr' | 'en' | 'ar'>(activeLanguage);

  if (!isOpen) return null;

  const title = previewLang === 'tr' ? formData.title_tr : previewLang === 'en' ? formData.title_en : formData.title_ar;
  const summary = previewLang === 'tr' ? formData.summary_tr : previewLang === 'en' ? formData.summary_en : formData.summary_ar;
  const content = previewLang === 'tr' ? formData.content_tr : previewLang === 'en' ? formData.content_en : formData.content_ar;

  const isRtl = previewLang === 'ar';
  const widthStyle =
    device === 'mobile' ? '390px' : device === 'tablet' ? '768px' : '1000px';

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Üst Önizleme Çubuğu */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          background: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="admin-badge admin-badge-cyan" style={{ fontSize: '11px' }}>
            Canlı Vitrin Simülasyonu
          </span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
            /{formData.slug || 'kurumsal-sayfa'}
          </span>
        </div>

        {/* Cihaz & Dil Seçicileri */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Cihaz Değiştirici */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '3px', gap: '3px' }}>
            <button
              type="button"
              onClick={() => setDevice('desktop')}
              className={`admin-btn-icon ${device === 'desktop' ? 'active text-cyan' : ''}`}
              title="Masaüstü (1140px)"
              style={{ padding: '6px 10px', background: device === 'desktop' ? 'var(--bg-card)' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              <Monitor size={16} />
            </button>
            <button
              type="button"
              onClick={() => setDevice('tablet')}
              className={`admin-btn-icon ${device === 'tablet' ? 'active text-cyan' : ''}`}
              title="Tablet (768px)"
              style={{ padding: '6px 10px', background: device === 'tablet' ? 'var(--bg-card)' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              <Tablet size={16} />
            </button>
            <button
              type="button"
              onClick={() => setDevice('mobile')}
              className={`admin-btn-icon ${device === 'mobile' ? 'active text-cyan' : ''}`}
              title="Mobil (390px)"
              style={{ padding: '6px 10px', background: device === 'mobile' ? 'var(--bg-card)' : 'transparent', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              <Smartphone size={16} />
            </button>
          </div>

          {/* Dil Değiştirici (Yalın TR, EN, AR - Bayrak Emojisi Yasak) */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderRadius: '8px', padding: '3px', gap: '3px' }}>
            {(['tr', 'en', 'ar'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setPreviewLang(l)}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: '6px',
                  background: previewLang === l ? 'var(--accent-primary)' : 'transparent',
                  color: previewLang === l ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Kapat Butonu */}
        <button
          type="button"
          onClick={onClose}
          className="admin-btn admin-btn-secondary admin-btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <X size={15} />
          <span>Kapat</span>
        </button>
      </header>

      {/* Önizleme Kanvası */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          padding: device === 'desktop' ? '24px 40px' : '24px 12px',
          background: '#0b1120',
        }}
      >
        <div
          style={{
            width: widthStyle,
            maxWidth: '100%',
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: device === 'desktop' ? '12px' : '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.25s ease-in-out',
          }}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {/* Sahte Tarayıcı Başlığı */}
          <div
            style={{
              padding: '10px 16px',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#64748b',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308', display: 'inline-block' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
            <span style={{ marginLeft: '12px', fontFamily: 'monospace', color: '#334155' }}>
              https://msklabs.org/{formData.slug || 'sayfa'}
            </span>
          </div>

          {/* Sayfa Gövdesi */}
          <main style={{ padding: '32px 28px', flex: 1 }}>
            {formData.hero_image && (
              <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', maxHeight: '320px' }}>
                <img
                  src={formData.hero_image}
                  alt={title || 'Kapak'}
                  style={{ width: '100%', height: 'auto', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            {blocks && blocks.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {blocks.map((block) => (
                  <BlockRenderer
                    key={block.id}
                    block={block}
                    lang={previewLang}
                    device={device}
                    isInteractive={true}
                  />
                ))}
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px', lineHeight: 1.25 }}>
                  {title || 'Başlıksız Kurumsal Sayfa'}
                </h1>

                {summary && (
                  <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6, marginBottom: '24px', borderLeft: isRtl ? 'none' : '4px solid #0284c7', borderRight: isRtl ? '4px solid #0284c7' : 'none', paddingLeft: isRtl ? 0 : '16px', paddingRight: isRtl ? '16px' : 0 }}>
                    {summary}
                  </p>
                )}

                <div
                  className="static-page-card-content"
                  style={{ fontSize: '0.95rem', lineHeight: 1.75, color: '#1e293b' }}
                  dangerouslySetInnerHTML={{ __html: content || '<p><em>İçerik henüz girilmedi...</em></p>' }}
                />
              </>
            )}
          </main>

          {/* Sahte Footer */}
          <footer
            style={{
              padding: '16px 28px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              fontSize: '12px',
              color: '#94a3b8',
              textAlign: 'center',
            }}
          >
            © {new Date().getFullYear()} MSK Labs. Tüm Hakları Saklıdır.
          </footer>
        </div>
      </div>
    </div>
  );
};
