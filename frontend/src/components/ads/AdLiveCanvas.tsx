import React, { useState } from 'react';
import { ShieldCheck, Sliders, Sun, Moon, Eye, Monitor, Smartphone, BookOpen, AlertCircle } from 'lucide-react';
import type { AdPlacementSetting, AdDeviceConfig } from '../../types';
import { resolveAdDimensions } from '../../utils/adDimensions';

interface AdLiveCanvasProps {
  ad: AdPlacementSetting;
  activeDevice: 'desktop' | 'mobile';
  onDeviceChange?: (device: 'desktop' | 'mobile') => void;
}

export const AdLiveCanvas: React.FC<AdLiveCanvasProps> = ({
  ad,
  activeDevice,
  onDeviceChange,
}) => {
  const [canvasTheme, setCanvasTheme] = useState<'light' | 'dark'>('light');
  const isLight = canvasTheme === 'light';

  const deviceConfig: AdDeviceConfig = activeDevice === 'desktop' ? ad.desktop : ad.mobile;
  const isMobile = activeDevice === 'mobile';

  // Dinamik Boyut Çözümleyici
  const dim = resolveAdDimensions(
    deviceConfig.preset_size,
    deviceConfig.custom_width,
    deviceConfig.custom_height,
    isMobile
  );

  const slotKey = ad.slot_key || '';
  const isSidebarRight = slotKey.includes('sidebar_right');
  const isSidebarLeft = slotKey.includes('sidebar_left');
  const isVerticalSlot = isSidebarRight || isSidebarLeft;
  const isInContent = slotKey.includes('in_content');
  const isFooter = slotKey.includes('footer');

  const alignStyles = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
  };

  // Piksel Kesinliğinde Genişlik ve Yükseklik
  const calcBoxWidth = () => {
    if (isMobile) {
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
      return isMobile ? '50px' : '90px';
    }
    return `${dim.h}px`;
  };

  const boxW = calcBoxWidth();
  const boxH = calcBoxHeight();

  // Reklam Kutusu
  const renderAdCreative = () => (
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
      {!deviceConfig.is_enabled ? (
        <div
          style={{
            width: boxW,
            maxWidth: '100%',
            height: boxH,
            minHeight: boxH,
            background: isLight ? '#fef2f2' : 'rgba(239, 68, 68, 0.08)',
            border: isLight ? '2px dashed #f87171' : '2px dashed rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            color: isLight ? '#b91c1c' : '#f87171',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <ShieldCheck size={16} />
          <span style={{ marginTop: '4px' }}>{ad.title}</span>
          <span style={{ fontSize: '0.72rem', color: isLight ? '#dc2626' : '#f87171', marginTop: '2px' }}>
            ({boxW} x {boxH}) — Pasife Alınmıştır
          </span>
        </div>
      ) : (
        <div
          style={{
            width: boxW,
            maxWidth: '100%',
            height: boxH,
            minHeight: boxH,
            background: isLight
              ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.09), rgba(16, 185, 129, 0.09))'
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(16, 185, 129, 0.15))',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary, #6366f1)', fontWeight: 700, fontSize: '0.76rem' }}>
            <ShieldCheck size={14} />
            <span>{isVerticalSlot ? 'DİKEY REKLAM' : 'YATAY REKLAM'}</span>
            {deviceConfig.is_sticky && (
              <span className="badge badge-resolved" style={{ fontSize: '0.62rem', padding: '1px 4px' }}>
                STICKY
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.78rem', color: isLight ? '#0f172a' : '#FFF', margin: '4px 0 2px', fontWeight: 700 }}>
            {boxW} x {boxH}
          </p>
          <div style={{ fontSize: '0.68rem', color: isLight ? '#475569' : 'var(--text-muted)', fontWeight: 600 }}>
            {ad.title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.65rem', color: isLight ? '#4338ca' : 'var(--accent-cyan)', fontWeight: 600 }}>
            <Sliders size={10} />
            <span>
              M: {deviceConfig.margin_top}T {deviceConfig.margin_right}R {deviceConfig.margin_bottom}B {deviceConfig.margin_left}L
            </span>
          </div>
        </div>
      )}
    </div>
  );

  // Köşeleri Yuvarlatılmış Sınırlı Kart Stili
  const cardBorder = {
    background: isLight ? '#ffffff' : '#1e293b',
    border: isLight ? '1px solid #e2e8f0' : '1px solid #334155',
    borderRadius: '10px',
    padding: '16px 18px',
    boxShadow: isLight ? '0 1px 4px rgba(0,0,0,0.04)' : 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  };

  const renderSection1 = () => (
    <div style={cardBorder}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: isLight ? '1px solid #f1f5f9' : '1px solid #334155', paddingBottom: '8px' }}>
        <BookOpen size={14} color="var(--accent-primary)" />
        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)' }}>
          BÖLÜM 1 • TEKNOLOJİ & YAZILIM
        </span>
        <span style={{ fontSize: '0.72rem', color: isLight ? '#64748b' : 'var(--text-muted)' }}>• 3 dk okuma süresi</span>
      </div>
      <h2 style={{ fontSize: '1.02rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', margin: 0, lineHeight: 1.35 }}>
        MSK Labs: Geleceğin Web ve Masaüstü Yazılım Mimarileri
      </h2>
      <p style={{ fontSize: '0.76rem', color: isLight ? '#334155' : 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
        Modern bulut teknolojileri ve sunucusuz mimariler, sıfır maliyetli altyapı ile kurumsal seviyede güvenilir sistemler inşa etmeye olanak tanır. Cloudflare Workers ve D1 SQLite veritabanı sayesinde mikro saniyeler mertebesinde yanıt sürelerine ulaşmak mümkündür.
      </p>
    </div>
  );

  const renderSection2 = () => (
    <div style={cardBorder}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: isLight ? '1px solid #f1f5f9' : '1px solid #334155', paddingBottom: '8px' }}>
        <BookOpen size={14} color="var(--accent-emerald)" />
        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)' }}>
          BÖLÜM 2 • DİJİTAL DENEYİM
        </span>
      </div>
      <h3 style={{ fontSize: '0.94rem', fontWeight: 700, color: isLight ? '#0f172a' : '#ffffff', margin: 0, lineHeight: 1.3 }}>
        Akıllı Tasarım ve Kullanıcı Dostu Dijital Deneyim
      </h3>
      <p style={{ fontSize: '0.76rem', color: isLight ? '#334155' : 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
        Web vitrininde kullanılan reklam yerleşimlerinin ana okuma akışını bölmemesi, kullanıcı deneyimini korumanın en kritik şartıdır. Yan sütunlarda dikey gökdelen ebatlarının kullanılması metin gövdesini ferah tutar.
      </p>
      <p style={{ fontSize: '0.76rem', color: isLight ? '#334155' : 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
        Geliştirilen dinamik stüdyo paneli sayesinde hem masaüstü hem de mobil ekranlarda marj boşlukları piksel hassasiyetinde yapılandırılabilir.
      </p>
    </div>
  );

  // Köşeleri Yuvarlatılmış Sınırlı Makale Bölümleri
  const renderArticleCard = () => {
    if (isInContent) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          {renderSection1()}
          {renderAdCreative()}
          {renderSection2()}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
        {renderSection1()}
        {renderSection2()}
      </div>
    );
  };

  return (
    <div
      style={{
        background: 'var(--bg-card, #1e293b)',
        border: '1px solid var(--border-subtle, #334155)',
        borderRadius: 'var(--radius-md, 8px)',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Araç Çubuğu: Sol Başlık + Sağda [Masaüstü/Mobil] ve [Açık/Koyu] Düğmeleri */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle, #334155)', paddingBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Eye size={15} color="var(--accent-primary)" />
          <strong style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Canlı Önizleme Sahnesi
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Cihaz Seçimi */}
          <div style={{ display: 'inline-flex', background: isLight ? '#e2e8f0' : 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '5px' }}>
            <button
              type="button"
              onClick={() => onDeviceChange && onDeviceChange('desktop')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', padding: '3px 8px',
                borderRadius: '3px', border: 'none', cursor: 'pointer',
                background: !isMobile ? 'var(--accent-primary, #6366f1)' : 'transparent',
                color: !isMobile ? '#ffffff' : 'var(--text-primary)',
                fontWeight: !isMobile ? 700 : 500,
              }}
            >
              <Monitor size={12} /> Masaüstü
            </button>
            <button
              type="button"
              onClick={() => onDeviceChange && onDeviceChange('mobile')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', padding: '3px 8px',
                borderRadius: '3px', border: 'none', cursor: 'pointer',
                background: isMobile ? 'var(--accent-primary, #6366f1)' : 'transparent',
                color: isMobile ? '#ffffff' : 'var(--text-primary)',
                fontWeight: isMobile ? 700 : 500,
              }}
            >
              <Smartphone size={12} /> Mobil
            </button>
          </div>

          {/* Tema Seçimi */}
          <div style={{ display: 'inline-flex', background: isLight ? '#e2e8f0' : 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '5px' }}>
            <button
              type="button"
              onClick={() => setCanvasTheme('light')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', padding: '3px 8px',
                borderRadius: '3px', border: 'none', cursor: 'pointer',
                background: isLight ? '#ffffff' : 'transparent',
                color: isLight ? '#0f172a' : 'var(--text-primary)',
                fontWeight: isLight ? 700 : 500,
                boxShadow: isLight ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Sun size={12} color={isLight ? '#f59e0b' : 'currentColor'} /> Açık
            </button>
            <button
              type="button"
              onClick={() => setCanvasTheme('dark')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', padding: '3px 8px',
                borderRadius: '3px', border: 'none', cursor: 'pointer',
                background: !isLight ? 'var(--accent-primary, #6366f1)' : 'transparent',
                color: !isLight ? '#ffffff' : 'var(--text-primary)',
                fontWeight: !isLight ? 700 : 500,
              }}
            >
              <Moon size={12} /> Koyu
            </button>
          </div>
        </div>
      </div>

      {/* Simülatör Sahnesi: Dış Çerçeve ve Web Sayfa Gövdesi */}
      <div
        style={{
          background: isLight ? '#f1f5f9' : '#0B0F19',
          borderRadius: '8px',
          border: isLight ? '1px solid #cbd5e1' : '1px solid var(--border-subtle, #334155)',
          padding: '14px 10px',
          display: 'flex',
          justifyContent: 'center',
          overflowX: 'auto',
          minHeight: '340px',
        }}
      >
        <div
          style={{
            width: isMobile ? '375px' : '100%',
            maxWidth: '1040px',
            transition: 'all 0.2s ease',
            background: isLight ? '#f8fafc' : '#121826',
            borderRadius: '8px',
            border: isLight ? '1px solid #e2e8f0' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: isLight ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxSizing: 'border-box',
          }}
        >
          {/* Web Vitrin Header Çubuğu */}
          <div
            style={{
              height: '34px',
              background: isLight ? '#ffffff' : '#1e293b',
              border: isLight ? '1px solid #e2e8f0' : '1px solid #334155',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              boxShadow: isLight ? '0 1px 2px rgba(0,0,0,0.03)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
              <strong style={{ fontSize: '0.78rem', color: isLight ? '#0f172a' : '#fff' }}>MSKLabs</strong>
            </div>
            <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem', color: isLight ? '#475569' : 'var(--text-muted)' }}>
              <span>Ana Sayfa</span>
              <span>Uygulamalar</span>
              <span>Blog</span>
              <span>İletişim</span>
            </div>
          </div>

          {/* Mobil Görünümde Dikey Reklam Bilgilendirme Rozeti */}
          {isMobile && isVerticalSlot && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: isLight ? 'rgba(234, 179, 8, 0.12)' : 'rgba(234, 179, 8, 0.18)',
                border: '1px solid rgba(234, 179, 8, 0.35)',
                borderRadius: '6px',
                fontSize: '0.74rem',
                color: isLight ? '#854d0e' : '#facc15',
                lineHeight: 1.4,
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>
                <strong>Mobil Simülasyon:</strong> Dikey yan sütun reklamları ({boxW}x{boxH}) responsive tasarım gereği mobil ekranlarda otomatik olarak gizlenir (<code>display: none</code>).
              </span>
            </div>
          )}

          {/* 1. Sağ Dikey Düzen (Desktop: Makale Kartı Sol + Sağ Sütun) */}
          {!isMobile && isSidebarRight ? (
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>{renderArticleCard()}</div>
              <aside style={{ width: boxW, minWidth: boxW, flexShrink: 0, position: deviceConfig.is_sticky ? 'sticky' : 'static', top: '10px' }}>
                {renderAdCreative()}
              </aside>
            </div>
          ) : !isMobile && isSidebarLeft ? (
            /* 2. Sol Dikey Düzen (Desktop: Sol Sütun + Makale Kartı Sağ) */
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <aside style={{ width: boxW, minWidth: boxW, flexShrink: 0, position: deviceConfig.is_sticky ? 'sticky' : 'static', top: '10px' }}>
                {renderAdCreative()}
              </aside>
              <div style={{ flex: 1 }}>{renderArticleCard()}</div>
            </div>
          ) : (
            /* 3. Standart Akış (Mobilde veya Sayfa Sonu / Akış İçi) */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {renderArticleCard()}
              {(!isMobile || !isVerticalSlot) && (isSidebarRight || isSidebarLeft || isFooter) && renderAdCreative()}
            </div>
          )}

          {/* Web Vitrin Footer Çubuğu */}
          <div
            style={{
              height: '30px',
              background: isLight ? '#ffffff' : '#1e293b',
              border: isLight ? '1px solid #e2e8f0' : '1px solid #334155',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 12px',
              fontSize: '0.7rem',
              color: isLight ? '#64748b' : 'var(--text-muted)',
            }}
          >
            <span>© 2026 MSKLabs. Tüm hakları saklıdır.</span>
            <span>Gizlilik Politikası • Çerez Tercihleri</span>
          </div>
        </div>
      </div>
    </div>
  );
};
