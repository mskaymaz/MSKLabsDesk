import React, { useEffect } from 'react';
import { Palette, X, RotateCcw, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import {
  useCustomizer,
  FONT_OPTIONS,
  ACCENT_OPTIONS,
  PADDING_OPTIONS,
  RADIUS_OPTIONS,
  TITLE_SIZE_OPTIONS,
  TITLE_WEIGHT_OPTIONS,
  FONT_SCALE_OPTIONS,
} from '../context/CustomizerContext';

export const ThemeCustomizerDrawer: React.FC = () => {
  const { theme } = useTheme();
  const {
    isOpen,
    closeCustomizer,
    settings,
    updateSetting,
    resetDefaults,
  } = useCustomizer();

  // ESC tuşuyla çekmeceyi kapatma
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCustomizer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCustomizer]);

  if (!isOpen) return null;

  return (
    <>
      {/* Yarı saydam karartma (Backdrop) */}
      <div
        role="presentation"
        onClick={closeCustomizer}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(3px)',
          zIndex: 1040,
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* Sağdan açılan çekmece paneli */}
      <aside
        aria-label="Görünüm ve Tema Stüdyosu"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '360px',
          maxWidth: '92vw',
          background: 'var(--bg-modal, #121826)',
          borderLeft: '1px solid var(--border-card)',
          boxShadow: '-8px 0 28px rgba(0, 0, 0, 0.35)',
          zIndex: 1050,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Başlık ve Kapat Butonu */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Palette size={16} color="var(--accent-primary)" />
            <div>
              <h3 className="admin-page-title" style={{ fontSize: '0.92rem' }}>
                Görünüm Stüdyosu
              </h3>
              <span className="admin-meta-text" style={{ fontSize: '0.70rem' }}>
                Aktif Tema: {theme === 'dark' ? 'Koyu Mod' : 'Açık Mod'} (Bağımsız Saklanır)
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCustomizer}
            aria-label="Kapat"
            className="admin-btn admin-btn-refresh admin-btn-sm"
            style={{ width: '26px', height: '26px', padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Kaydırılabilir Ayar Alanı */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Canlı Önizleme Kartı */}
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md, 8px)',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed var(--border-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span className="admin-meta-text" style={{ fontWeight: 600 }}>CANLI ÖNİZLEME</span>
              <span className="admin-badge admin-badge-success">Örnek</span>
            </div>
            <div className="admin-list-card" style={{ boxShadow: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 className="admin-card-title">Örnek Başlık: Sistem Tasarımı</h4>
                <span className="admin-badge admin-badge-info">Aktif</span>
              </div>
              <p className="admin-card-desc">
                Seçtiğiniz font, renk, dolgu ve yuvarlaklık tüm admin paneline anlık yansıtılır.
              </p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <button type="button" className="admin-btn admin-btn-primary admin-btn-xs">
                  Kaydet
                </button>
                <button type="button" className="admin-btn admin-btn-edit admin-btn-xs">
                  İncele
                </button>
              </div>
            </div>
          </div>

          {/* 1. Font Ailesi */}
          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Yazı Tipi Ailesi (Türkçe Destekli)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {FONT_OPTIONS.map((f) => {
                const isSelected = settings.fontFamily === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateSetting('fontFamily', f.id)}
                    className="admin-btn"
                    style={{
                      height: '32px',
                      fontFamily: f.family,
                      fontSize: '0.80rem',
                      fontWeight: isSelected ? 600 : 400,
                      justifyContent: 'center',
                      background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-card)'}`,
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Vurgu Rengi (Accent) */}
          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Vurgu Rengi
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ACCENT_OPTIONS.map((a) => {
                const isSelected = settings.accentColor === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => updateSetting('accentColor', a.id)}
                    title={a.label}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: a.hex,
                      border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(0,0,0,0.2)',
                      boxShadow: isSelected ? `0 0 0 2px ${a.hex}` : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'transform 0.15s ease',
                      transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                    }}
                  >
                    {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Kart Dolgusu (Padding) */}
          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Kart Dikey Dolgu Payı
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {PADDING_OPTIONS.map((p) => {
                const isSelected = settings.cardPadding === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => updateSetting('cardPadding', p.id as any)}
                    className="admin-btn admin-btn-xs"
                    style={{
                      height: '28px',
                      fontSize: '0.74rem',
                      background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-card)'}`,
                    }}
                  >
                    {p.id === 'compact' ? 'Kompakt' : p.id === 'standard' ? 'Standart' : 'Ferah'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Yuvarlaklık (Radius) */}
          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Köşe Yuvarlaklığı
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {RADIUS_OPTIONS.map((r) => {
                const isSelected = settings.borderRadius === r.id;
                const labels: Record<string, string> = {
                  sharp: 'Keskin',
                  standard: 'Standart',
                  rounded: 'Yumuşak',
                  pill: 'Oval',
                };
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => updateSetting('borderRadius', r.id as any)}
                    className="admin-btn admin-btn-xs"
                    style={{
                      height: '28px',
                      fontSize: '0.72rem',
                      background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-card)'}`,
                      borderRadius: r.card,
                    }}
                  >
                    {labels[r.id] || r.id}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Kart Başlık Boyutu & Kalınlığı */}
          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Kart Başlık Yapısı
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {TITLE_SIZE_OPTIONS.map((s) => {
                  const isSelected = settings.titleSize === s.id;
                  const labelMap: Record<string, string> = {
                    small: 'Küçük',
                    standard: 'Standart',
                    large: 'Büyük',
                  };
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => updateSetting('titleSize', s.id as any)}
                      className="admin-btn admin-btn-xs"
                      style={{
                        height: '26px',
                        fontSize: '0.72rem',
                        background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                        border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-card)'}`,
                      }}
                    >
                      {labelMap[s.id]}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {TITLE_WEIGHT_OPTIONS.map((w) => {
                  const isSelected = settings.titleWeight === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => updateSetting('titleWeight', w.id as any)}
                      className="admin-btn admin-btn-xs"
                      style={{
                        height: '26px',
                        fontSize: '0.72rem',
                        fontWeight: Number(w.id),
                        background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                        color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                        border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-card)'}`,
                      }}
                    >
                      {w.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 6. Genel Font Ölçeği */}
          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Genel Yazı Boyutu Ölçeği
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
              {FONT_SCALE_OPTIONS.map((sc) => {
                const isSelected = settings.fontScale === sc.id;
                const labels: Record<string, string> = {
                  compact: '%92 (Kompakt)',
                  standard: '%100 (Normal)',
                  large: '%108 (Büyük)',
                };
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => updateSetting('fontScale', sc.id as any)}
                    className="admin-btn admin-btn-xs"
                    style={{
                      height: '28px',
                      fontSize: '0.72rem',
                      background: isSelected ? 'var(--accent-primary)' : 'var(--bg-card)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-card)'}`,
                    }}
                  >
                    {labels[sc.id]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alt Butonlar */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-card)',
          }}
        >
          <button
            type="button"
            onClick={resetDefaults}
            className="admin-btn admin-btn-refresh admin-btn-sm"
          >
            <RotateCcw size={13} />
            Varsayılana Sıfırla
          </button>
          <button
            type="button"
            onClick={closeCustomizer}
            className="admin-btn admin-btn-primary admin-btn-sm"
          >
            Kapat
          </button>
        </div>
      </aside>
    </>
  );
};
