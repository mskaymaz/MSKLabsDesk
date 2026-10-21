import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Monitor, Smartphone, ShieldCheck, Eye, Check, Sliders, Sun, Moon } from 'lucide-react';
import { useTranslation } from '../../context/I18nContext';
import { useTheme } from '../../context/ThemeContext';
import type { AdPlacementSetting, AdDeviceConfig } from '../../types';
import { resolveAdDimensions } from '../../utils/adDimensions';

interface AdPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  adSetting: AdPlacementSetting | any | null;
  initialDevice?: 'desktop' | 'mobile';
  onPublish?: (setting: any) => Promise<void>;
}

export const AdPreviewModal: React.FC<AdPreviewModalProps> = ({
  isOpen,
  onClose,
  adSetting,
  initialDevice = 'desktop',
  onPublish,
}) => {
  const { t } = useTranslation();
  const { theme: appTheme } = useTheme();

  const [previewTheme, setPreviewTheme] = useState<'light' | 'dark'>('light');
  const [device, setDevice] = useState<'desktop' | 'mobile'>(initialDevice);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (initialDevice) setDevice(initialDevice);
  }, [initialDevice, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setPreviewTheme(appTheme === 'dark' ? 'dark' : 'light');
    }
  }, [isOpen, appTheme]);

  if (!adSetting) return null;

  const deviceConfig: AdDeviceConfig =
    device === 'desktop'
      ? adSetting.desktop || {
          is_enabled: Boolean(adSetting.is_enabled),
          preset_size: adSetting.preset_size || 'RESPONSIVE',
          custom_width: adSetting.custom_width,
          custom_height: adSetting.custom_height,
          margin_top: adSetting.margin_top ?? 16,
          margin_right: 0,
          margin_bottom: adSetting.margin_bottom ?? 16,
          margin_left: 0,
          align: 'center',
          is_sticky: Boolean(adSetting.is_sticky),
        }
      : adSetting.mobile || {
          is_enabled: Boolean(adSetting.is_enabled),
          preset_size: '320x50',
          custom_width: null,
          custom_height: null,
          margin_top: 12,
          margin_right: 0,
          margin_bottom: 12,
          margin_left: 0,
          align: 'center',
        };

  const dim = resolveAdDimensions(
    deviceConfig.preset_size,
    deviceConfig.custom_width,
    deviceConfig.custom_height,
    device === 'mobile'
  );

  const isLight = previewTheme === 'light';
  const slotKey = adSetting.slot_key || '';
  const isSidebarRight = slotKey.includes('sidebar_right');
  const isSidebarLeft = slotKey.includes('sidebar_left');
  const isInContent = slotKey.includes('in_content');
  const isFooter = slotKey.includes('footer');

  const alignStyles = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  // Reklam kutusunun genişliği (Sidebar ise sütun genişliğini, yatay ise banner genişliğini alır)
  const calcBoxWidth = () => {
    if (device === 'mobile') {
      if (dim.isResponsive) return '100%';
      return `${Math.min(dim.w, 335)}px`;
    }
    if (dim.isResponsive) {
      if (isSidebarRight) return '300px';
      if (isSidebarLeft) return '160px';
      return '100%';
    }
    return `${dim.w}px`;
  };

  const calcBoxHeight = () => {
    if (dim.isResponsive) {
      if (isSidebarLeft) return '600px';
      if (isSidebarRight) return '250px';
      return device === 'mobile' ? '50px' : '90px';
    }
    return `${dim.h}px`;
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

  // Reklam Görsel Bloğu Render Fonksiyonu
  const renderAdCreative = () => {
    if (!deviceConfig.is_enabled) {
      return (
        <div
          style={{
            width: '100%',
            padding: '16px',
            textAlign: 'center',
            background: isLight ? '#fef2f2' : 'rgba(239, 68, 68, 0.08)',
            border: isLight ? '1px dashed #f87171' : '1px dashed rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            color: isLight ? '#b91c1c' : '#f87171',
            fontSize: '0.76rem',
            marginTop: `${deviceConfig.margin_top || 0}px`,
            marginBottom: `${deviceConfig.margin_bottom || 0}px`,
          }}
        >
          {device === 'desktop' ? 'Masaüstünde' : 'Mobilde'} Pasif
        </div>
      );
    }

    return (
      <div
        style={{
          marginTop: `${deviceConfig.margin_top || 0}px`,
          marginRight: `${deviceConfig.margin_right || 0}px`,
          marginBottom: `${deviceConfig.margin_bottom || 0}px`,
          marginLeft: `${deviceConfig.margin_left || 0}px`,
          display: 'flex',
          justifyContent: alignStyles[deviceConfig.align || 'center'] || 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            width: calcBoxWidth(),
            maxWidth: '100%',
            minHeight: calcBoxHeight(),
            background: isLight
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(16, 185, 129, 0.08))'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(16, 185, 129, 0.12))',
            border: '2px dashed var(--accent-primary, #6366f1)',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-primary, #6366f1)', fontWeight: 700, fontSize: '0.78rem' }}>
            <ShieldCheck size={14} />
            <span>{isSidebarRight || isSidebarLeft ? 'DİKEY REKLAM' : 'YATAY REKLAM'}</span>
            {deviceConfig.is_sticky && (
              <span className="badge badge-resolved" style={{ fontSize: '0.65rem', padding: '1px 4px' }}>
                STICKY
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.75rem', color: isLight ? '#0f172a' : '#FFF', margin: '4px 0 2px', fontWeight: 600 }}>
            {adSetting.title} — {calcBoxWidth()} x {calcBoxHeight()}
          </p>
          <div style={{ fontSize: '0.68rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>
            Client: {adSetting.ad_client || 'ca-pub-XXXXXXXX'} | Slot: {adSetting.ad_slot || 'XXXXXXXX'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.65rem', color: isLight ? '#4f46e5' : 'var(--accent-cyan)' }}>
            <Sliders size={10} />
            <span>
              Marj: T:{deviceConfig.margin_top} R:{deviceConfig.margin_right} B:{deviceConfig.margin_bottom} L:{deviceConfig.margin_left}px
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderContentParagraph = (title: string) => (
    <div
      style={{
        background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.02)',
        border: isLight ? '1px solid #e2e8f0' : 'none',
        borderRadius: '6px',
        padding: '12px',
        color: isLight ? '#475569' : 'var(--text-muted)',
        fontSize: '0.72rem',
        lineHeight: 1.5,
      }}
    >
      <strong>{title}</strong>: Makale ve vitrin içerik gövdesi... Kullanıcı içerikte gezinirken reklamın oluşturduğu konumlanma ve boşluklar burada gerçekçi simüle edilir.
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${adSetting.title} — Canlı Simülasyon Önizlemesi`} maxWidth="940px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Toolbar: Cihaz ve Tema Seçimi */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg-secondary, #0f172a)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-md, 8px)',
            border: '1px solid var(--border-subtle, #334155)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-in_progress" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
              <Eye size={12} /> CANLI ÖNİZLEME
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              {adSetting.title}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Cihaz Seçici */}
            <div style={{ display: 'inline-flex', background: isLight ? '#e2e8f0' : 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '6px' }}>
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', padding: '4px 8px',
                  borderRadius: '4px', border: 'none', cursor: 'pointer',
                  background: device === 'desktop' ? 'var(--accent-primary, #6366f1)' : 'transparent',
                  color: device === 'desktop' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: device === 'desktop' ? 600 : 400,
                }}
              >
                <Monitor size={12} /> Masaüstü
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', padding: '4px 8px',
                  borderRadius: '4px', border: 'none', cursor: 'pointer',
                  background: device === 'mobile' ? 'var(--accent-primary, #6366f1)' : 'transparent',
                  color: device === 'mobile' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: device === 'mobile' ? 600 : 400,
                }}
              >
                <Smartphone size={12} /> Mobil
              </button>
            </div>

            {/* Tema Seçici */}
            <div style={{ display: 'inline-flex', background: isLight ? '#e2e8f0' : 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '6px' }}>
              <button
                type="button"
                onClick={() => setPreviewTheme('light')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', padding: '4px 8px',
                  borderRadius: '4px', border: 'none', cursor: 'pointer',
                  background: isLight ? '#ffffff' : 'transparent',
                  color: isLight ? '#0f172a' : 'var(--text-secondary)',
                  fontWeight: isLight ? 600 : 400,
                  boxShadow: isLight ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <Sun size={12} color={isLight ? '#f59e0b' : 'currentColor'} /> Açık
              </button>
              <button
                type="button"
                onClick={() => setPreviewTheme('dark')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', padding: '4px 8px',
                  borderRadius: '4px', border: 'none', cursor: 'pointer',
                  background: !isLight ? 'var(--accent-primary, #6366f1)' : 'transparent',
                  color: !isLight ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: !isLight ? 600 : 400,
                }}
              >
                <Moon size={12} /> Koyu
              </button>
            </div>
          </div>
        </div>

        {/* Gerçekçi Web Sayfası Simülatörü */}
        <div
          style={{
            background: 'transparent',
            borderRadius: 'var(--radius-lg, 12px)',
            border: isLight ? '1px dashed #cbd5e1' : '1px dashed var(--border-subtle, #334155)',
            padding: '16px 10px',
            display: 'flex',
            justifyContent: 'center',
            overflowX: 'auto',
            minHeight: '340px',
          }}
        >
          <div
            style={{
              width: device === 'mobile' ? '375px' : '100%',
              transition: 'all 0.25s ease',
              background: isLight ? '#ffffff' : '#121826',
              borderRadius: '8px',
              border: isLight ? '1px solid #e2e8f0' : '1px dashed rgba(255,255,255,0.12)',
              boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxSizing: 'border-box',
            }}
          >
            {/* Sayfa Üst Başlığı (Header) */}
            <div
              style={{
                height: '32px',
                background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.04)',
                border: isLight ? '1px solid #e2e8f0' : 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                color: isLight ? '#475569' : 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              MSKLabs Vitrin — Üst Menü & Navigasyon
            </div>

            {/* 1. Sayfa Başı Yatay Reklam ise */}
            {!isSidebarRight && !isSidebarLeft && !isInContent && !isFooter && renderAdCreative()}

            {/* 2. Sağ Dikey Reklam Düzeni (İki Kolon: İçerik Sol + Dikey Reklam Sağ) */}
            {device === 'desktop' && isSidebarRight ? (
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {renderContentParagraph('Ana Makale / İçerik Bloğu')}
                  {renderContentParagraph('İkinci Bölüm')}
                </div>
                <div style={{ width: calcBoxWidth(), flexShrink: 0 }}>
                  {renderAdCreative()}
                </div>
              </div>
            ) : device === 'desktop' && isSidebarLeft ? (
              /* 3. Sol Dikey Reklam Düzeni (İki Kolon: Dikey Reklam Sol + İçerik Sağ) */
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: calcBoxWidth(), flexShrink: 0 }}>
                  {renderAdCreative()}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {renderContentParagraph('Ana Makale / İçerik Bloğu')}
                  {renderContentParagraph('İkinci Bölüm')}
                </div>
              </div>
            ) : isInContent ? (
              /* 4. Bölümler Arası Akış İçi Düzen */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {renderContentParagraph('Makale Giriş Paragrafı')}
                {renderAdCreative()}
                {renderContentParagraph('Makale Devamı ve Detaylar')}
              </div>
            ) : (
              /* 5. Mobilde veya Sayfa Sonunda Standart Akış */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {renderContentParagraph('Ana İçerik Bloğu')}
                {(isSidebarRight || isSidebarLeft || isFooter) && renderAdCreative()}
              </div>
            )}

            {/* Sayfa Sonu Alt Bilgi (Footer) */}
            <div
              style={{
                height: '28px',
                background: isLight ? '#f8fafc' : 'rgba(255,255,255,0.03)',
                border: isLight ? '1px solid #e2e8f0' : 'none',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                color: isLight ? '#64748b' : 'var(--text-muted)',
                fontSize: '0.68rem',
              }}
            >
              © MSKLabs — Footer Bilgisi
            </div>
          </div>
        </div>

        {/* Footer Butonları */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Kapat
          </button>
          {onPublish && (
            <button type="button" className="btn btn-primary btn-sm" onClick={handlePublish} disabled={publishing}>
              {published ? <Check size={13} /> : null}
              <span>{published ? 'Yayınlandı' : publishing ? 'Kaydediliyor...' : 'Değişiklikleri Yayınla'}</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
