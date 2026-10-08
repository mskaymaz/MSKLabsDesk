import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Monitor, Tablet, Smartphone, ShieldCheck, Eye, Check, ExternalLink } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';

export interface AdSetting {
  id?: number;
  slot_key: string;
  title: string;
  is_enabled: boolean | number;
  ad_client?: string | null;
  ad_slot?: string | null;
  preset_size?: string;
  custom_width?: number | null;
  custom_height?: number | null;
  margin_top?: number;
  margin_bottom?: number;
  is_sticky?: boolean | number;
}

interface AdPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  adSetting: AdSetting | null;
  onPublish?: (setting: AdSetting) => Promise<void>;
}

export const AdPreviewModal: React.FC<AdPreviewModalProps> = ({
  isOpen,
  onClose,
  adSetting,
  onPublish,
}) => {
  const { t } = useTranslation();
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  if (!adSetting) return null;

  const presetDimensions: Record<string, { w: number; h: number }> = {
    '728x90': { w: 728, h: 90 },
    '300x250': { w: 300, h: 250 },
    '336x280': { w: 336, h: 280 },
    '320x50': { w: 320, h: 50 },
    '300x600': { w: 300, h: 600 },
    '160x600': { w: 160, h: 600 },
    '970x90': { w: 970, h: 90 },
    '970x250': { w: 970, h: 250 },
    '320x100': { w: 320, h: 100 },
    'RESPONSIVE': { w: 728, h: 90 },
  };

  const preset = adSetting.preset_size || 'RESPONSIVE';
  const dim = presetDimensions[preset] || {
    w: adSetting.custom_width || 300,
    h: adSetting.custom_height || 250,
  };

  const containerWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const handlePublish = async () => {
    if (!onPublish || !adSetting) return;
    setPublishing(true);
    try {
      await onPublish(adSetting);
      setPublished(true);
      setTimeout(() => {
        setPublished(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      alert(err.message || t('common.error'));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t('templates.title')} — DRAFT Preview`} maxWidth="900px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Device Switcher Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.3)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-in_progress" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={12} /> DRAFT PREVIEW
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {adSetting.title} ({adSetting.slot_key})
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className={`btn btn-sm ${device === 'desktop' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDevice('desktop')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Monitor size={14} /> Desktop (&gt;1024px)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${device === 'tablet' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDevice('tablet')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Tablet size={14} /> Tablet (640–1024px)
            </button>
            <button
              type="button"
              className={`btn btn-sm ${device === 'mobile' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDevice('mobile')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Smartphone size={14} /> Mobile (&lt;640px)
            </button>
          </div>
        </div>

        {/* Sandboxed Mock Site Screen */}
        <div style={{
          background: '#0B0F19',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          padding: '24px 16px',
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto',
          minHeight: '360px'
        }}>
          <div style={{
            width: containerWidths[device],
            transition: 'width 0.3s ease',
            background: '#121826',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(255,255,255,0.1)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxSizing: 'border-box'
          }}>
            {/* Header Placeholder */}
            <div style={{ height: '36px', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', display: 'flex', alignItems: 'center', padding: '0 12px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
              MSKLabs Public Website Header
            </div>

            {/* Margin Top Indicator */}
            {adSetting.margin_top ? (
              <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--accent-cyan)', borderTop: '1px dashed var(--accent-cyan)', borderBottom: '1px dashed var(--accent-cyan)', padding: '2px 0' }}>
                ↑ Margin Top: {adSetting.margin_top}px
              </div>
            ) : null}

            {/* CSS/SVG Mock Ad Creative Container (No 3rd-party JS) */}
            <div style={{
              margin: '0 auto',
              width: preset === 'RESPONSIVE' ? '100%' : `${Math.min(dim.w, device === 'mobile' ? 335 : 728)}px`,
              maxWidth: '100%',
              minHeight: `${dim.h}px`,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.12))',
              border: '2px dashed var(--accent-primary)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px',
              textAlign: 'center',
              boxSizing: 'border-box',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                <ShieldCheck size={16} />
                <span>AD CREATIVE MOCK</span>
                {adSetting.is_sticky ? <span className="badge badge-resolved" style={{ fontSize: '0.7rem' }}>STICKY</span> : null}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#FFF', marginTop: '4px', fontWeight: 600 }}>
                {adSetting.title} ({preset === 'RESPONSIVE' ? 'Responsive Auto' : `${dim.w}x${dim.h}px`})
              </p>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Client: {adSetting.ad_client || 'ca-pub-XXXXXXXXXXXXXXXX'} | Slot: {adSetting.ad_slot || 'XXXXXXX'}
              </div>
            </div>

            {/* Margin Bottom Indicator */}
            {adSetting.margin_bottom ? (
              <div style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--accent-cyan)', borderTop: '1px dashed var(--accent-cyan)', borderBottom: '1px dashed var(--accent-cyan)', padding: '2px 0' }}>
                ↓ Margin Bottom: {adSetting.margin_bottom}px
              </div>
            ) : null}

            {/* Article Content Mock */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.4 }}>
              <div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', width: '90%' }} />
              <div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', width: '95%' }} />
              <div style={{ height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', width: '80%' }} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            * Sandboxed preview — 3rd-party AdSense script is NOT executed in Admin panel.
          </span>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('common.close')}
            </button>
            {onPublish && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePublish}
                disabled={publishing}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                {published ? <Check size={16} /> : <ExternalLink size={16} />}
                <span>{published ? t('common.success') : 'Canlıya Al (Publish)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
