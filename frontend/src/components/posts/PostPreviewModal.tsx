import React, { useState } from 'react';
import { X, Smartphone, Tablet, Monitor, Sun, Moon } from 'lucide-react';
import type { PostFormData } from '../../types';

export interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: PostFormData | null;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  isOpen,
  onClose,
  formData,
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');
  const [previewLang, setPreviewLang] = useState<'tr' | 'en' | 'ar'>('tr');

  if (!isOpen || !formData) return null;

  const getMaxWidth = () => {
    if (deviceMode === 'mobile') return '375px';
    if (deviceMode === 'tablet') return '768px';
    return '1100px';
  };

  const currentTitle =
    previewLang === 'tr'
      ? formData.title_tr
      : previewLang === 'en'
      ? formData.title_en
      : formData.title_ar;

  const currentSummary =
    previewLang === 'tr'
      ? formData.summary_tr
      : previewLang === 'en'
      ? formData.summary_en
      : formData.summary_ar;

  const currentContent =
    previewLang === 'tr'
      ? formData.content_tr
      : previewLang === 'en'
      ? formData.content_en
      : formData.content_ar;

  const isRtl = previewLang === 'ar';
  const isDark = previewTheme === 'dark';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 'var(--z-modal, 999)',
        padding: '16px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: getMaxWidth(),
          height: '88vh',
          background: 'var(--bg-modal, var(--bg-card))',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'max-width 0.25s ease',
        }}
      >
        {/* Üst Önizleme Kontrol Çubuğu */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span id="preview-modal-title" className="admin-page-title" style={{ fontSize: '0.86rem' }}>
              Web Önizleme
            </span>
            <span className="admin-badge admin-badge-info" style={{ fontSize: '0.66rem' }}>
              {isDark ? 'Koyu Web' : 'Açık Web'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Dil Seçici (Standart TR, EN, AR) */}
            <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', padding: '2px', borderRadius: '6px' }}>
              {(['tr', 'en', 'ar'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setPreviewLang(lang)}
                  style={{
                    padding: '3px 8px',
                    border: 'none',
                    borderRadius: '4px',
                    background: previewLang === lang ? 'var(--accent-primary)' : 'transparent',
                    color: previewLang === lang ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                  }}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Ziyaretçi Web Teması Simülatörü (Açık / Koyu) */}
            <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', padding: '2px', borderRadius: '6px' }}>
              <button
                type="button"
                onClick={() => setPreviewTheme('light')}
                title="Açık Web Teması Simülasyonu"
                style={{
                  padding: '3px 7px',
                  border: 'none',
                  borderRadius: '4px',
                  background: !isDark ? 'var(--accent-primary)' : 'transparent',
                  color: !isDark ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.70rem',
                }}
              >
                <Sun size={12} /> Açık
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme('dark')}
                title="Koyu Web Teması Simülasyonu"
                style={{
                  padding: '3px 7px',
                  border: 'none',
                  borderRadius: '4px',
                  background: isDark ? 'var(--accent-primary)' : 'transparent',
                  color: isDark ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.70rem',
                }}
              >
                <Moon size={12} /> Koyu
              </button>
            </div>

            {/* Cihaz Boyut Simülasyonu */}
            <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', padding: '2px', borderRadius: '6px' }}>
              <button
                type="button"
                onClick={() => setDeviceMode('mobile')}
                title="Mobil Ekran (<640px)"
                style={{
                  padding: '3px 7px',
                  border: 'none',
                  borderRadius: '4px',
                  background: deviceMode === 'mobile' ? 'var(--accent-primary)' : 'transparent',
                  color: deviceMode === 'mobile' ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.70rem',
                }}
              >
                <Smartphone size={13} /> Mobil
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('tablet')}
                title="Tablet Ekran (768px)"
                style={{
                  padding: '3px 7px',
                  border: 'none',
                  borderRadius: '4px',
                  background: deviceMode === 'tablet' ? 'var(--accent-primary)' : 'transparent',
                  color: deviceMode === 'tablet' ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.70rem',
                }}
              >
                <Tablet size={13} /> Tablet
              </button>
              <button
                type="button"
                onClick={() => setDeviceMode('desktop')}
                title="Masaüstü Ekran (1100px)"
                style={{
                  padding: '3px 7px',
                  border: 'none',
                  borderRadius: '4px',
                  background: deviceMode === 'desktop' ? 'var(--accent-primary)' : 'transparent',
                  color: deviceMode === 'desktop' ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.70rem',
                }}
              >
                <Monitor size={13} /> Masaüstü
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Kapat"
              className="admin-btn admin-btn-refresh admin-btn-sm"
              style={{ width: '26px', height: '26px', padding: 0 }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Ziyaretçi Makale Okuma Alanı (Web Simülasyonu) */}
        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: deviceMode === 'mobile' ? '16px' : '28px',
            background: isDark ? '#0B0F19' : '#FFFFFF',
            color: isDark ? '#E2E8F0' : '#1E293B',
            fontFamily: isRtl ? "'Cairo', sans-serif" : 'inherit',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
        >
          {formData.cover_image && (
            <img
              src={formData.cover_image}
              alt={currentTitle || 'Kapak'}
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '20px',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
              }}
            />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span
              className="admin-badge admin-badge-info"
              style={{ fontSize: '0.70rem', fontWeight: 700 }}
            >
              {previewLang.toUpperCase()}
            </span>
            {formData.video_url && (
              <span className="admin-badge admin-badge-indigo" style={{ fontSize: '0.70rem' }}>
                Video İçerik
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: deviceMode === 'mobile' ? '1.35rem' : '2.1rem',
              fontWeight: 800,
              lineHeight: 1.3,
              color: isDark ? '#F8FAFC' : '#0F172A',
              marginBottom: '14px',
            }}
          >
            {currentTitle || (
              <span style={{ fontStyle: 'italic', opacity: 0.5 }}>
                (Bu dilde başlık henüz girilmedi)
              </span>
            )}
          </h1>

          {currentSummary && (
            <p
              style={{
                fontSize: '1rem',
                lineHeight: 1.6,
                color: isDark ? '#94A3B8' : '#475569',
                marginBottom: '20px',
                fontStyle: 'italic',
                borderLeft: isRtl ? 'none' : '3px solid var(--accent-primary)',
                borderRight: isRtl ? '3px solid var(--accent-primary)' : 'none',
                paddingLeft: isRtl ? 0 : '12px',
                paddingRight: isRtl ? '12px' : 0,
              }}
            >
              {currentSummary}
            </p>
          )}

          <div
            className="tiptap-content"
            style={{
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: isDark ? '#CBD5E1' : '#334155',
            }}
            dangerouslySetInnerHTML={{
              __html:
                currentContent ||
                `<p style="color: ${
                  isDark ? '#64748B' : '#94A3B8'
                }; font-style: italic;">(Bu dilde içerik henüz girilmedi)</p>`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
