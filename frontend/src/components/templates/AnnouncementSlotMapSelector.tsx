import React from 'react';
import { Check, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { type AnnouncementPlacement } from './announcementConfig';

export interface AnnouncementSlotMapSelectorProps {
  device: 'desktop' | 'mobile';
  currentPlacement: AnnouncementPlacement;
  onSelectPlacement: (placement: AnnouncementPlacement) => void;
}

export const AnnouncementSlotMapSelector: React.FC<AnnouncementSlotMapSelectorProps> = ({
  device,
  currentPlacement,
  onSelectPlacement,
}) => {
  const isWeb = device === 'desktop';

  // Yatay veya Standart Kapsül Yuva Butonu (Web ve Mobil Üst/Alt için)
  const renderCapsule = (
    placement: AnnouncementPlacement,
    title: string,
    axis: 'horizontal' | 'vertical' | 'none',
    extraStyle?: React.CSSProperties
  ) => {
    const isSelected = currentPlacement === placement;
    return (
      <button
        type="button"
        onClick={() => onSelectPlacement(placement)}
        title={`${title} yuvasını seçmek için tıklayın`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '3px 7px',
          borderRadius: '16px',
          fontSize: '9.5px',
          fontWeight: isSelected ? 800 : 600,
          cursor: 'pointer',
          border: isSelected ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
          background: isSelected ? '#eff6ff' : '#ffffff',
          color: isSelected ? '#1d4ed8' : '#334155',
          boxShadow: isSelected ? '0 0 8px rgba(37, 99, 235, 0.35)' : '0 1px 2px rgba(0,0,0,0.06)',
          transition: 'all 0.15s ease',
          userSelect: 'none',
          zIndex: 2,
          ...extraStyle,
        }}
      >
        {axis === 'horizontal' && <ArrowLeft size={9} color={isSelected ? '#2563eb' : '#64748b'} strokeWidth={2.5} />}
        {axis === 'vertical' && <ArrowUp size={9} color={isSelected ? '#2563eb' : '#64748b'} strokeWidth={2.5} />}
        
        {/* Yuva Checkbox Kutucuğu */}
        <span style={{
          width: '11px',
          height: '11px',
          borderRadius: '3px',
          border: isSelected ? '1.5px solid #2563eb' : '1.5px solid #94a3b8',
          background: isSelected ? '#2563eb' : '#f8fafc',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isSelected && <Check size={8} color="#FFFFFF" strokeWidth={3.5} />}
        </span>

        <span>{title}</span>

        {axis === 'horizontal' && <ArrowRight size={9} color={isSelected ? '#2563eb' : '#64748b'} strokeWidth={2.5} />}
        {axis === 'vertical' && <ArrowDown size={9} color={isSelected ? '#2563eb' : '#64748b'} strokeWidth={2.5} />}
      </button>
    );
  };

  // Mobil Sol ve Sağ Kenar Dikey Kapsülü: [Üst Ok] -> [Çekbox] -> [Metin] -> [Alt Ok]
  const renderVerticalMobilePill = (
    placement: 'left_floating' | 'right_floating',
    label: 'Sol' | 'Sağ',
    align: 'left' | 'right'
  ) => {
    const isSelected = currentPlacement === placement;
    return (
      <button
        type="button"
        onClick={() => onSelectPlacement(placement)}
        title={`Mobil ${label} kenar yuvasını seçin`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '6px 3px',
          width: '26px',
          minHeight: '78px',
          borderRadius: align === 'left' ? '0 10px 10px 0' : '10px 0 0 10px',
          border: isSelected ? '2px solid #2563eb' : '1.5px solid #94a3b8',
          ...(align === 'left' ? { borderLeft: 'none' } : { borderRight: 'none' }),
          background: isSelected ? '#eff6ff' : '#f8fafc',
          color: isSelected ? '#1d4ed8' : '#334155',
          boxShadow: isSelected ? '0 0 10px rgba(37, 99, 235, 0.4)' : '0 1px 3px rgba(0,0,0,0.08)',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          userSelect: 'none',
          zIndex: 3,
        }}
      >
        {/* 1. Üst Ok */}
        <ArrowUp size={10} color={isSelected ? '#2563eb' : '#64748b'} strokeWidth={2.5} />

        {/* 2. Yuva Checkbox Kutucuğu */}
        <span style={{
          width: '11px',
          height: '11px',
          borderRadius: '2.5px',
          border: isSelected ? '1.5px solid #2563eb' : '1.5px solid #94a3b8',
          background: isSelected ? '#2563eb' : '#ffffff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isSelected && <Check size={8} color="#FFFFFF" strokeWidth={3.5} />}
        </span>

        {/* 3. Metin: Sadece "Sol" veya "Sağ" */}
        <span style={{
          fontSize: '9px',
          fontWeight: isSelected ? 800 : 700,
          lineHeight: 1,
        }}>
          {label}
        </span>

        {/* 4. Alt Ok */}
        <ArrowDown size={10} color={isSelected ? '#2563eb' : '#64748b'} strokeWidth={2.5} />
      </button>
    );
  };

  if (isWeb) {
    return (
      <div style={{
        background: '#FFFFFF',
        border: '2px solid #cbd5e1',
        borderRadius: '8px',
        padding: '8px 10px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
        color: '#0f172a',
        maxWidth: '380px',
      }}>
        {/* Üst Tam Bant (Klasik Şerit) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {renderCapsule('top_hanging', '↑ Üst Tam Bant (Klasik) ↑', 'none', {
            width: '100%',
            maxWidth: '280px',
            padding: '2px 8px',
            fontSize: '9px',
            background: currentPlacement === 'top_hanging' ? '#eff6ff' : '#f1f5f9',
          })}
        </div>

        {/* 1. Üst Bar: Sol/Sağ Yuvalar ve Merkez MSK Labs Logosu */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px',
          position: 'relative',
        }}>
          {/* Sol Üst Kapsülü */}
          {renderCapsule('top_left', 'Sol Üst', 'horizontal')}

          {/* Merkez: MSK Labs Logosu */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: '#f97316' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: '#3b82f6' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '2px', background: '#10b981' }} />
            </div>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
              MSK Labs
            </span>
          </div>

          {/* Sağ Üst Kapsülü */}
          {renderCapsule('top_right', 'Sağ Üst', 'horizontal')}
        </div>

        {/* 2. Temsili Header Menü Şeridi */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          padding: '2px 6px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          fontSize: '8.5px',
          color: '#64748b',
          userSelect: 'none',
        }}>
          <span style={{ color: '#2563eb', fontWeight: 700 }}>Ana Sayfa</span>
          <span>•</span>
          <span>Bizce</span>
          <span>•</span>
          <span>Güncel</span>
          <span>•</span>
          <span>Uygulamalar</span>
          <span>•</span>
          <span>Destek</span>
        </div>

        {/* 3. İçerik Gövdesi & Yan AdSense Kule Alanları (160x600 Temsili) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '6px',
          minHeight: '65px',
          position: 'relative',
        }}>
          {/* Sol AdSense Kule Reklamı Silüeti */}
          <div style={{
            width: '65px',
            background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
            border: '1px dashed #cbd5e1',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }} title="Google AdSense 160x600 Kule Reklam Bölgesi (Duyuru burayı örtmez)">
            <span style={{ fontSize: '8px', fontWeight: 800, color: '#64748b' }}>AdSense</span>
            <span style={{ fontSize: '7px', color: '#94a3b8' }}>160x600</span>
          </div>

          {/* Orta İçerik Tuvali */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            borderRadius: '4px',
            border: '1px solid #f1f5f9',
            padding: '4px',
          }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.4px' }}>
              MSK Labs
            </span>
            <span style={{ fontSize: '7.5px', color: '#94a3b8' }}>
              Masaüstü Web Arayüzü
            </span>
          </div>

          {/* Sağ AdSense Kule Reklamı Silüeti */}
          <div style={{
            width: '65px',
            background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
            border: '1px dashed #cbd5e1',
            borderRadius: '4px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none',
          }} title="Google AdSense 160x600 Kule Reklam Bölgesi (Duyuru burayı örtmez)">
            <span style={{ fontSize: '8px', fontWeight: 800, color: '#64748b' }}>AdSense</span>
            <span style={{ fontSize: '7px', color: '#94a3b8' }}>160x600</span>
          </div>
        </div>

        {/* 4. Alt Bölüm (3 Yuva: Sol Alt, Orta Alt, Sağ Alt) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '4px',
          paddingTop: '4px',
          borderTop: '1px solid #e2e8f0',
        }}>
          {renderCapsule('bottom_left', 'Sol Alt', 'horizontal')}
          {renderCapsule('bottom_center', 'Orta Alt', 'horizontal')}
          {renderCapsule('bottom_right', 'Sağ Alt', 'horizontal')}
        </div>
      </div>
    );
  }

  // Mobil Cihaz Haritası (Akıllı Telefon Kasası)
  return (
    <div style={{
      background: '#1e293b',
      border: '3px solid #334155',
      borderRadius: '22px',
      padding: '8px 6px 6px 6px',
      position: 'relative',
      width: '180px',
      margin: '0 auto',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.22)',
    }}>
      {/* Üst Ahize & Ön Kamera Donanım Çentiği */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5px',
        marginBottom: '5px',
      }}>
        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#475569' }} />
        <span style={{ width: '28px', height: '3px', borderRadius: '2px', background: '#475569' }} />
      </div>

      {/* Telefon Ekran Tuvali (Beyaz Aydınlık Ekran) */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        padding: '6px 0',
        position: 'relative',
        minHeight: '180px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.06)',
      }}>
        {/* Üst Bant Seçeneği */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 6px' }}>
          {renderCapsule('top_hanging', '↑ Üst Tam Bant ↑', 'none', {
            width: '100%',
            fontSize: '8.5px',
            padding: '2px 4px',
            background: currentPlacement === 'top_hanging' ? '#eff6ff' : '#f1f5f9',
          })}
        </div>

        {/* Ekran Ortası: Sağa ve Sola Yaslı Dikey Kapsüller (Sol ve Sağ) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '8px 0',
          position: 'relative',
          width: '100%',
        }}>
          {/* Sol Kenara Yaslı Dikey Kapsül */}
          {renderVerticalMobilePill('left_floating', 'Sol', 'left')}

          {/* Merkez Bilgi */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', opacity: 0.8 }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a' }}>MSK Labs</span>
            <span style={{ fontSize: '7.5px', color: '#94a3b8' }}>Mobil Ekran</span>
          </div>

          {/* Sağ Kenara Yaslı Dikey Kapsül */}
          {renderVerticalMobilePill('right_floating', 'Sağ', 'right')}
        </div>

        {/* Mobil Alt Kart Seçeneği */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '0 6px' }}>
          {renderCapsule('bottom_center', '↓ Alt Kart Yuvası ↓', 'none', {
            width: '100%',
            fontSize: '8.5px',
            padding: '2px 4px',
          })}
        </div>
      </div>

      {/* Telefon Alt Home Çubuğu */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
        <span style={{ width: '36px', height: '2.5px', borderRadius: '2px', background: '#64748b' }} />
      </div>
    </div>
  );
};

