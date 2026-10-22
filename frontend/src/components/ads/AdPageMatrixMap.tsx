import React, { useState } from 'react';
import { Layers, CheckCircle2, Save, RotateCcw, CheckCheck, Plus, Info } from 'lucide-react';
import type { AdPlacementSetting, AdPageMatrixConfig } from '../../types';

interface AdPageMatrixMapProps {
  ads: AdPlacementSetting[];
  matrix: AdPageMatrixConfig;
  onSaveMatrix: (newMatrix: AdPageMatrixConfig) => Promise<void>;
  isSaving?: boolean;
}

const PREDEFINED_PAGES = [
  { key: 'index.html', label: 'Ana Sayfa', icon: '🏠' },
  { key: 'blog.html', label: 'Blog & Makale Sayfaları', icon: '✍️' },
  { key: 'apps.html', label: 'Uygulamalarımız Vitrini', icon: '📱' },
  { key: 'about.html', label: 'Hakkımızda', icon: 'ℹ️' },
  { key: 'destek.html', label: 'Destek & Talep', icon: '🎫' },
  { key: 'contact.html', label: 'İletişim', icon: '📞' },
  { key: 'who-we-are.html', label: 'Biz Kimiz', icon: '👥' },
  { key: 'faq.html', label: 'SSS', icon: '❓' },
  { key: 'privacy.html', label: 'Gizlilik Politikası', icon: '🔒' },
  { key: 'terms.html', label: 'Kullanım Koşulları', icon: '📜' },
];

const SLOT_META: Record<string, { title: string; defaultSize: string }> = {
  ad_header_top: { title: 'Sayfa Başı Reklam (Top Banner)', defaultSize: '728x90' },
  ad_sidebar_left: { title: 'Sol Dikey Reklam 1', defaultSize: '120x600' },
  ad_sidebar_left_2: { title: 'Sol Dikey Reklam 2 (Askılı)', defaultSize: '120x600' },
  ad_sidebar_right: { title: 'Sağ Dikey Reklam 1', defaultSize: '120x600' },
  ad_sidebar_right_2: { title: 'Sağ Dikey Reklam 2 (Askılı)', defaultSize: '120x600' },
  ad_in_content: { title: 'Sayfa Ortası Reklam 1 (Akış İçi)', defaultSize: '728x90' },
  ad_in_content_2: { title: 'Sayfa Ortası Reklam 2 (Akış İçi 2)', defaultSize: '728x90' },
  ad_footer_bottom: { title: 'Sayfa Sonu Reklamı (Bottom Banner)', defaultSize: '728x90' },
};

export const AdPageMatrixMap: React.FC<AdPageMatrixMapProps> = ({
  ads,
  matrix,
  onSaveMatrix,
  isSaving = false,
}) => {
  const [selectedPage, setSelectedPage] = useState<string>('index.html');
  const [localMatrix, setLocalMatrix] = useState<AdPageMatrixConfig>(matrix);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [customPathInput, setCustomPathInput] = useState('');
  const [showAddCustom, setShowAddCustom] = useState(false);

  const allPageKeys = Array.from(new Set([...PREDEFINED_PAGES.map((p) => p.key), ...Object.keys(localMatrix)]));
  const pageSlots = localMatrix[selectedPage] || {};

  const getAdSize = (slotKey: string) => {
    const found = ads.find((a) => a.slot_key === slotKey);
    if (!found) return SLOT_META[slotKey]?.defaultSize || 'Standart';
    const cfg = found.desktop;
    if (cfg.preset_size === 'CUSTOM' && cfg.custom_width && cfg.custom_height) {
      return `${cfg.custom_width}x${cfg.custom_height} px`;
    }
    return cfg.preset_size || SLOT_META[slotKey]?.defaultSize || 'Standart';
  };

  const toggleSlot = (slotKey: string) => {
    setLocalMatrix((prev) => {
      const current = prev[selectedPage] || {};
      return {
        ...prev,
        [selectedPage]: { ...current, [slotKey]: !current[slotKey] },
      };
    });
    setSaveSuccess(false);
  };

  const setAllForPage = (enabled: boolean) => {
    setLocalMatrix((prev) => {
      const updated: Record<string, boolean> = {};
      Object.keys(SLOT_META).forEach((key) => { updated[key] = enabled; });
      return { ...prev, [selectedPage]: updated };
    });
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    await onSaveMatrix(localMatrix);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddCustomPage = () => {
    let clean = customPathInput.trim().toLowerCase();
    if (!clean) return;
    if (!clean.endsWith('.html') && clean.indexOf('.') === -1) clean += '.html';
    if (clean.startsWith('/')) clean = clean.substring(1);

    if (!localMatrix[clean]) {
      setLocalMatrix((prev) => ({
        ...prev,
        [clean]: {
          ad_header_top: false, ad_sidebar_left: true, ad_sidebar_left_2: false,
          ad_sidebar_right: true, ad_sidebar_right_2: false, ad_in_content: true,
          ad_in_content_2: false, ad_footer_bottom: true,
        },
      }));
    }
    setSelectedPage(clean);
    setCustomPathInput('');
    setShowAddCustom(false);
  };

  const activeCount = Object.values(pageSlots).filter(Boolean).length;
  const totalSlots = Object.keys(SLOT_META).length;

  const renderSlotBox = (slotKey: string, style?: React.CSSProperties) => {
    const isActive = Boolean(pageSlots[slotKey]);
    const meta = SLOT_META[slotKey] || { title: slotKey, defaultSize: 'Auto' };
    const size = getAdSize(slotKey);

    return (
      <button
        type="button"
        onClick={() => toggleSlot(slotKey)}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.18s ease',
          border: isActive ? '2px solid var(--accent-primary, #6366f1)' : '2px dashed #94a3b8',
          background: isActive ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card, #f8fafc)',
          outline: 'none', boxSizing: 'border-box', ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => {}}
            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#6366f1' }}
          />
          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: isActive ? '#6366f1' : 'var(--text-secondary)' }}>
            {meta.title}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem' }}>
          <span style={{ padding: '2px 6px', borderRadius: '4px', fontWeight: 600, background: isActive ? '#6366f1' : '#64748b', color: '#fff' }}>
            {size}
          </span>
          <span style={{ color: isActive ? '#10b981' : '#94a3b8', fontWeight: 600 }}>
            {isActive ? '✓ Aktif' : '✗ Pasif (Kalıntısız)'}
          </span>
        </div>
      </button>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* 1. Üst Kontrol & Sayfa Seçim Çubuğu */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px',
        padding: '12px 16px', background: 'var(--bg-card, #ffffff)', borderRadius: '10px', border: '1px solid var(--border-primary, #e2e8f0)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>📄 Hedef Sayfa:</label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            style={{
              padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1',
              background: 'var(--bg-surface, #f8fafc)', color: 'var(--text-primary)', fontSize: '0.86rem', fontWeight: 600,
            }}
          >
            {allPageKeys.map((pKey) => {
              const matched = PREDEFINED_PAGES.find((p) => p.key === pKey);
              return <option key={pKey} value={pKey}>{matched ? `${matched.icon} ${matched.label} (${pKey})` : `📄 ${pKey}`}</option>;
            })}
          </select>
          <button
            type="button"
            onClick={() => setShowAddCustom(!showAddCustom)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 8px', borderRadius: '5px',
              border: '1px dashed #6366f1', background: 'transparent', color: '#6366f1', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Plus size={13} /> Yeni Sayfa Ekle
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setAllForPage(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'var(--bg-surface)', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <CheckCheck size={13} /> Tümünü Aç
          </button>
          <button
            type="button"
            onClick={() => setAllForPage(false)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'var(--bg-surface)', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <RotateCcw size={13} /> Tümünü Kapat
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '6px',
              border: 'none', background: saveSuccess ? '#10b981' : '#6366f1', color: '#ffffff',
              fontSize: '0.84rem', fontWeight: 700, cursor: isSaving ? 'wait' : 'pointer',
            }}
          >
            {saveSuccess ? <CheckCircle2 size={15} /> : <Save size={15} />}
            {saveSuccess ? 'Kaydedildi!' : isSaving ? 'Kaydediliyor...' : 'Matrisi Kaydet'}
          </button>
        </div>
      </div>

      {/* Özel Sayfa Ekleme Alanı */}
      {showAddCustom && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'var(--bg-surface, #f8fafc)', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Özel Sayfa Dosya Adı / Yolu:</span>
          <input
            type="text" placeholder="Örn: rehber.html" value={customPathInput} onChange={(e) => setCustomPathInput(e.target.value)}
            style={{ padding: '6px 8px', borderRadius: '5px', border: '1px solid #cbd5e1', fontSize: '0.82rem', width: '220px' }}
          />
          <button type="button" onClick={handleAddCustomPage} style={{ padding: '6px 12px', borderRadius: '5px', background: '#6366f1', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}>Ekle</button>
        </div>
      )}

      {/* Durum Rozeti */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={14} color="#6366f1" />
          <span><strong>{selectedPage}</strong> için <strong style={{ color: activeCount > 0 ? '#10b981' : '#ef4444' }}>{activeCount} Aktif</strong> / {totalSlots - activeCount} Pasif yuva seçili.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}>
          <Info size={13} /> Pasif yuvalar sayfada kesinlikle sıfır boşluk (0px margin/padding) ile gizlenir.
        </div>
      </div>

      {/* 2. GÖRSEL ŞEMA (KULLANICI DİYAGRAMI BİREBİR YERLEŞİM) */}
      <div style={{ border: '2px solid #cbd5e1', borderRadius: '12px', background: 'var(--bg-canvas, #ffffff)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Antet Kısmı */}
        <div style={{ border: '2px solid #cbd5e1', borderRadius: '8px', padding: '14px', textAlign: 'center', fontWeight: 700, fontSize: '1rem', background: 'var(--bg-surface, #f8fafc)', color: 'var(--text-primary)' }}>
          Sabit Duran Antet Kısmı (Header & Navigasyon)
        </div>

        {/* Sayfa Başı Reklam */}
        {renderSlotBox('ad_header_top', { width: '100%', minHeight: '48px' })}

        {/* 3 Sütunlu Ana Gövde */}
        <div style={{ display: 'grid', gridTemplateColumns: '170px 1fr 170px', gap: '12px', alignItems: 'stretch' }}>
          {/* SOL SÜTUN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {renderSlotBox('ad_sidebar_left', { minHeight: '170px' })}
            {renderSlotBox('ad_sidebar_left_2', { minHeight: '170px' })}
          </div>

          {/* ORTA İÇERİK & AKIŞ İÇİ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ flex: 1, minHeight: '110px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'var(--bg-surface, #f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>
              Makale Metin & İçerik Bölümü 1
            </div>
            {renderSlotBox('ad_in_content', { minHeight: '48px' })}
            <div style={{ flex: 1, minHeight: '110px', border: '1px solid #e2e8f0', borderRadius: '8px', background: 'var(--bg-surface, #f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>
              Makale Metin & İçerik Bölümü 2
            </div>
            {renderSlotBox('ad_in_content_2', { minHeight: '48px' })}
          </div>

          {/* SAĞ SÜTUN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {renderSlotBox('ad_sidebar_right', { minHeight: '170px' })}
            {renderSlotBox('ad_sidebar_right_2', { minHeight: '170px' })}
          </div>
        </div>

        {/* Sayfa Sonu Reklamı */}
        {renderSlotBox('ad_footer_bottom', { width: '100%', minHeight: '48px' })}
      </div>
    </div>
  );
};
