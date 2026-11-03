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

  // Kapsül Yuva Butonu
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
          padding: '3px 8px',
          borderRadius: '16px',
          fontSize: '10px',
          fontWeight: isSelected ? 800 : 600,
          cursor: 'pointer',
          border: isSelected ? '2px solid #2563eb' : '1.5px solid #cbd5e1',
          background: isSelected ? '#eff6ff' : '#ffffff',
          color: isSelected ? '#1d4ed8' : '#334155',
          boxShadow: isSelected ? '0 0 10px rgba(37, 99, 235, 0.35)' : '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'all 0.15s ease',
          userSelect: 'none',
          zIndex: 2,
          ...extraStyle,
        }}
      >
        {axis === 'horizontal' && <ArrowLeft size={10} color={isSelected ? '#2563eb' : '#64748b'} strokeWidth={2.5} />}
        {axis === 'vertical' && <ArrowUp size={10} color={isSelected ? '#2563eb' : '#64748b'} strokeWidth={2.5} />}
        
        {/* Yuva Checkbox Kutucuğu */}
        <span style={{
          width: '12px',
          height: '12px',
          borderRadius: '3px',
          border: isSelected ? '1.5px solid #2563eb' : '1.5px solid #94a3b8',
          background: isSelected ? '#2563eb' : '#f8fafc',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isSelected && <Check size={9} color="#FFFFFF" strokeWidth={3.5} />}
        </span>

        <span>{title}</span>

        {axis === 'horizontal' && <ArrowRight size={10} color={isSelected ? '#2563eb' : '#64748b'} strokeWidth={2.5} />}
        {axis === 'vertical' && <ArrowDown size={10} color={isSelected ? '#2563eb' : '#64748b'} strokeWidth={2.5} />}
      </button>
    );
  };

  if (isWeb) {
    return (
      <div style={{
        background: '#FFFFFF',
        border: '2px solid #cbd5e1',
        borderRadius: '10px',
        padding: '10px 14px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        color: '#0f172a',
      }}>
        {/* Üst Tam Bant (Klasik Şerit) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {renderCapsule('top_hanging', '↑ Üst Tam Bant (Klasik Şerit) ↑', 'none', {
            width: '100%',
            maxWidth: '320px',
            padding: '2px 10px',
            fontSize: '9.5px',
            background: currentPlacement === 'top_hanging' ? '#eff6ff' : '#f1f5f9',
          })}
        </div>

        {/* 1. Üst Bar: Sol/Sağ Yuvalar ve Merkez MSK Labs Logosu */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px',
          position: 'relative',
        }}>
          {/* Sol Üst Kapsülü */}
          {renderCapsule('top_left', 'Sol Üst', 'horizontal')}

          {/* Merkez: MSK Labs Puzzle Logosu ve Marka İsmi */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f97316' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#3b82f6' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }} />
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px', marginTop: '1px' }}>
              MSK Labs
            </span>
          </div>

          {/* Sağ Üst Kapsülü */}
          {renderCapsule('top_right', 'Sağ Üst', 'horizontal')}
        </div>

        {/* 2. Temsili Header Menü Şeridi (Referans Görseldeki Gibi) */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          padding: '3px 8px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          fontSize: '9px',
          color: '#64748b',
          userSelect: 'none',
        }}>
          <span style={{ color: '#2563eb', fontWeight: 700 }}>Ana Sayfa</span>
          <span>•</span>
          <span>Bizce</span>
          <span>•</span>
          <span>Güncel</span>
          <span>•</span>
          <span>Uygulamalarımız</span>
          <span>•</span>
          <span>Destek</span>
        </div>

        {/* 3. İçerik Gövdesi & Yan AdSense Kule Alanları (160x600 Temsili) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'stretch',
          gap: '10px',
          minHeight: '75px',
          position: 'relative',
        }}>
          {/* Sol AdSense Kule Reklamı Silüeti */}
          <div style={{
            width: '85px',
            background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
            border: '1.5px dashed #cbd5e1',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            userSelect: 'none',
          }} title="Google AdSense 160x600 Kule Reklam Bölgesi (Duyuru konulmaz)">
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748b' }}>AdSense</span>
            <span style={{ fontSize: '7.5px', color: '#94a3b8' }}>160 x 600</span>
          </div>

          {/* Orta İçerik Tuvali */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
            borderRadius: '6px',
            border: '1px solid #f1f5f9',
            padding: '6px',
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
              MSK Labs
            </h3>
            <span style={{ fontSize: '8.5px', color: '#94a3b8', marginTop: '2px' }}>
              Masaüstü Web Arayüzü İçerik Alanı
            </span>
          </div>

          {/* Sağ AdSense Kule Reklamı Silüeti */}
          <div style={{
            width: '85px',
            background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)',
            border: '1.5px dashed #cbd5e1',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            userSelect: 'none',
          }} title="Google AdSense 160x600 Kule Reklam Bölgesi (Duyuru konulmaz)">
            <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748b' }}>AdSense</span>
            <span style={{ fontSize: '7.5px', color: '#94a3b8' }}>160 x 600</span>
          </div>
        </div>

        {/* 4. Alt Bölüm (3 Yuva: Sol Alt, Orta Alt, Sağ Alt) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px',
          paddingTop: '6px',
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
      borderRadius: '24px',
      padding: '10px 8px 8px 8px',
      position: 'relative',
      maxWidth: '280px',
      margin: '0 auto',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
    }}>
      {/* Üst Ahize & Ön Kamera Donanım Çentiği */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '6px',
      }}>
        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#475569' }} />
        <span style={{ width: '32px', height: '3.5px', borderRadius: '3px', background: '#475569' }} />
      </div>

      {/* Telefon Ekran Tuvali (Beyaz Aydınlık Ekran) */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '8px 6px',
        position: 'relative',
        minHeight: '190px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 4px rgba(0,0,0,0.06)',
      }}>
        {/* Üst Bant Seçeneği */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {renderCapsule('top_hanging', '↑ Üst Tam Bant ↑', 'none', {
            width: '100%',
            fontSize: '9px',
            padding: '2px 4px',
            background: currentPlacement === 'top_hanging' ? '#eff6ff' : '#f1f5f9',
          })}
        </div>

        {/* Ekran Ortası: Sol Kulakçık ve Sağ Kulakçık (Kenara Yapışık Dikey Kapsüller) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '14px 0',
          position: 'relative',
        }}>
          {/* Sol Kenar Kulakçık */}
          {renderCapsule('left_floating', 'Sol Kulakçık', 'vertical', {
            borderRadius: '0 12px 12px 0',
            borderLeft: 'none',
            padding: '5px 4px',
          })}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none', opacity: 0.7 }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>MSK Labs</span>
            <span style={{ fontSize: '8px', color: '#94a3b8' }}>Mobil Ekran</span>
          </div>

          {/* Sağ Kenar Kulakçık */}
          {renderCapsule('right_floating', 'Sağ Kulakçık', 'vertical', {
            borderRadius: '12px 0 0 12px',
            borderRight: 'none',
            padding: '5px 4px',
          })}
        </div>

        {/* Mobil Alt Kart Seçeneği */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          {renderCapsule('bottom_center', '↓ Alt Kart Yuvası ↓', 'horizontal', {
            width: '100%',
            fontSize: '9.5px',
          })}
        </div>
      </div>

      {/* Telefon Alt Home Çubuğu */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
        <span style={{ width: '42px', height: '3px', borderRadius: '2px', background: '#64748b' }} />
      </div>
    </div>
  );
};
