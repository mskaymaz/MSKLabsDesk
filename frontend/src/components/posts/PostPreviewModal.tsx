import React, { useState } from 'react';
import { X, Smartphone, Tablet, Monitor } from 'lucide-react';
import type { BlogPost } from '../../types';

export interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Partial<BlogPost> | null;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({ isOpen, onClose, post }) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  if (!isOpen || !post) return null;

  const getMaxWidth = () => {
    if (deviceMode === 'mobile') return '375px';
    if (deviceMode === 'tablet') return '768px';
    return '1100px';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 'var(--z-modal)',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: getMaxWidth(),
          height: '85vh',
          background: 'var(--bg-modal, var(--bg-card))',
          border: '1px solid var(--border-card)',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'max-width 0.3s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span id="preview-modal-title" style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
              Canlı Cihaz Önizleme
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', padding: '4px', borderRadius: '6px' }}>
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              style={{
                padding: '4px 8px',
                border: 'none',
                borderRadius: '4px',
                background: deviceMode === 'mobile' ? 'var(--accent-primary)' : 'transparent',
                color: deviceMode === 'mobile' ? '#FFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Smartphone size={16} /> <span style={{ fontSize: '0.75rem' }}>Mobil (&lt;640)</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('tablet')}
              style={{
                padding: '4px 8px',
                border: 'none',
                borderRadius: '4px',
                background: deviceMode === 'tablet' ? 'var(--accent-primary)' : 'transparent',
                color: deviceMode === 'tablet' ? '#FFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Tablet size={16} /> <span style={{ fontSize: '0.75rem' }}>Tablet (640-1024)</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('desktop')}
              style={{
                padding: '4px 8px',
                border: 'none',
                borderRadius: '4px',
                background: deviceMode === 'desktop' ? 'var(--accent-primary)' : 'transparent',
                color: deviceMode === 'desktop' ? '#FFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Monitor size={16} /> <span style={{ fontSize: '0.75rem' }}>Masaüstü (&gt;1024)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            aria-label="Kapat"
            className="admin-btn admin-btn-refresh admin-btn-sm"
            style={{ width: '28px', height: '28px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', color: 'var(--text-primary)' }}>
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title_tr || 'Kapak'}
              style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
            />
          )}

          <h1 style={{ fontSize: deviceMode === 'mobile' ? '1.4rem' : '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {post.title_tr || 'Untitled Post'}
          </h1>

          <div
            style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: post.content_tr || '<p style="color:var(--text-muted)">İçerik boş...</p>' }}
          />
        </div>
      </div>
    </div>
  );
};
