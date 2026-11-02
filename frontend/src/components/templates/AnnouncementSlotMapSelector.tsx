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

  const renderSlotButton = (
    placement: AnnouncementPlacement,
    title: string,
    axis: 'horizontal' | 'vertical' | 'none',
    style?: React.CSSProperties
  ) => {
    const isSelected = currentPlacement === placement;
    return (
      <button
        type="button"
        onClick={() => onSelectPlacement(placement)}
        title={`${title} yuvasını seçin`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          padding: '2px 5px',
          borderRadius: '4px',
          fontSize: '9px',
          fontWeight: 700,
          cursor: 'pointer',
          border: isSelected ? '1.5px solid var(--accent-primary, #3b82f6)' : '1px dashed var(--border-subtle, #475569)',
          background: isSelected ? 'rgba(59, 130, 246, 0.25)' : 'rgba(15, 23, 42, 0.5)',
          color: isSelected ? 'var(--accent-primary, #60a5fa)' : 'var(--text-secondary, #94a3b8)',
          boxShadow: isSelected ? '0 0 8px rgba(59, 130, 246, 0.35)' : 'none',
          transition: 'all 0.15s ease',
          userSelect: 'none',
          ...style,
        }}
      >
        {axis === 'horizontal' && <ArrowLeft size={8} style={{ opacity: 0.6 }} />}
        {axis === 'vertical' && <ArrowUp size={8} style={{ opacity: 0.6 }} />}
        <span style={{
          width: '10px',
          height: '10px',
          borderRadius: '2px',
          border: isSelected ? '1.5px solid #60a5fa' : '1px solid #64748b',
          background: isSelected ? '#3b82f6' : 'transparent',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {isSelected && <Check size={8} color="#FFFFFF" strokeWidth={3} />}
        </span>
        <span>{title}</span>
        {axis === 'horizontal' && <ArrowRight size={8} style={{ opacity: 0.6 }} />}
        {axis === 'vertical' && <ArrowDown size={8} style={{ opacity: 0.6 }} />}
      </button>
    );
  };

  if (isWeb) {
    return (
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border-subtle, #334155)',
        borderRadius: '6px',
        padding: '6px 8px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        {/* Üst Bant (Klasik Şerit) */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {renderSlotButton('top_hanging', 'Üst Tam Bant (Klasik)', 'none', { width: '100%', maxWidth: '240px', padding: '1px 6px', fontSize: '8.5px' })}
        </div>

        {/* Web Ekranı Üst Bölümü (Header Silüeti + Sol/Sağ Üst Yuvalar) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2px 4px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '4px',
        }}>
          {renderSlotButton('top_left', 'Sol Üst', 'horizontal')}
          <span style={{ fontSize: '9px', fontWeight: 700, opacity: 0.4, letterSpacing: '1px' }}>MSK LABS</span>
          {renderSlotButton('top_right', 'Sağ Üst', 'horizontal')}
        </div>

        {/* Orta Gövde (Google AdSense Kule Reklamları Silüeti) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '28px',
          padding: '0 2px',
        }}>
          <div style={{
            width: '42px',
            height: '100%',
            background: 'rgba(148, 163, 184, 0.08)',
            border: '1px dashed rgba(148, 163, 184, 0.2)',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '7.5px',
            color: 'var(--text-muted)',
          }} title="Google AdSense Kule Reklam Alanı (Duyuru konulmaz)">
            AdSense
          </div>
          <span style={{ fontSize: '8px', color: 'var(--text-muted)', opacity: 0.5 }}>İçerik Tuvali</span>
          <div style={{
            width: '42px',
            height: '100%',
            background: 'rgba(148, 163, 184, 0.08)',
            border: '1px dashed rgba(148, 163, 184, 0.2)',
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '7.5px',
            color: 'var(--text-muted)',
          }} title="Google AdSense Kule Reklam Alanı (Duyuru konulmaz)">
            AdSense
          </div>
        </div>

        {/* Alt Bölüm (3 Yuva: Sol Alt, Orta Alt, Sağ Alt) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '4px',
          paddingTop: '3px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          {renderSlotButton('bottom_left', 'Sol Alt', 'horizontal')}
          {renderSlotButton('bottom_center', 'Orta Alt', 'horizontal')}
          {renderSlotButton('bottom_right', 'Sağ Alt', 'horizontal')}
        </div>
      </div>
    );
  }

  // Mobil Cihaz Silüeti
  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.25)',
      border: '1.5px solid var(--border-subtle, #334155)',
      borderRadius: '12px',
      padding: '6px 8px',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      maxWidth: '260px',
      margin: '0 auto',
    }}>
      {/* Mobil Üst Çentik */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3px' }}>
        <span style={{ width: '22px', height: '3px', borderRadius: '2px', background: 'rgba(255,255,255,0.2)' }} />
      </div>

      {/* Üst Tam Bant Seçeneği */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {renderSlotButton('top_hanging', 'Üst Bant', 'none', { width: '100%', fontSize: '8.5px', padding: '1px 4px' })}
      </div>

      {/* Mobil Orta Ekran (Sol Kulakçık & Sağ Kulakçık) */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '42px',
        padding: '0 2px',
        border: '1px dashed rgba(255,255,255,0.08)',
        borderRadius: '6px',
        background: 'rgba(255,255,255,0.015)',
      }}>
        {renderSlotButton('left_floating', 'Sol Kulakçık', 'vertical')}
        <span style={{ fontSize: '8px', color: 'var(--text-muted)', opacity: 0.4 }}>Mobil Ekran</span>
        {renderSlotButton('right_floating', 'Sağ Kulakçık', 'vertical')}
      </div>

      {/* Mobil Alt Bölüm (Orta Alt Kart) */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {renderSlotButton('bottom_center', 'Alt Kart', 'horizontal', { width: '100%' })}
      </div>
    </div>
  );
};
