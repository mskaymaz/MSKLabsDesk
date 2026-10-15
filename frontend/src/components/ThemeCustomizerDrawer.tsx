import React, { useEffect } from 'react';
import { Palette, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCustomizer } from '../context/CustomizerContext';
import { InspectorSections } from './customizer/InspectorSections';
import { type CustomizerSection } from './customizer/types';

export const ThemeCustomizerDrawer: React.FC = () => {
  const { theme } = useTheme();
  const {
    isOpen,
    closeCustomizer,
    metrics,
    updateMetric,
    resetDefaults,
    exportJSON,
    importJSON,
    activeSection,
    setActiveSection,
  } = useCustomizer();

  // ESC tuşuyla paneli kapatma
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCustomizer();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeCustomizer]);

  if (!isOpen) return null;

  // Seçilen hedef bileşene özel dinamik Canlı Önizleme
  const renderContextualPreview = () => {
    if (activeSection === 'buttons') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="admin-meta-text" style={{ fontSize: '0.66rem', fontWeight: 700 }}>CANLI ÖNİZLEME: BUTON AİLESİ</span>
            <span className="admin-badge admin-badge-info">5 Buton Rolü</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm, 6px)', border: '1px solid var(--border-card)' }}>
            <button type="button" className="admin-btn admin-btn-primary admin-btn-sm">Kaydet</button>
            <button type="button" className="admin-btn admin-btn-view admin-btn-sm">İncele</button>
            <button type="button" className="admin-btn admin-btn-success admin-btn-sm">Onayla</button>
            <button type="button" className="admin-btn admin-btn-danger admin-btn-sm">Reddet</button>
            <button type="button" className="admin-btn admin-btn-edit admin-btn-sm">Düzenle</button>
          </div>
        </div>
      );
    }

    if (activeSection === 'badges') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="admin-meta-text" style={{ fontSize: '0.66rem', fontWeight: 700 }}>CANLI ÖNİZLEME: ROZETLER & ETİKETLER</span>
            <span className="admin-badge admin-badge-success">Rozet Örnekleri</span>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm, 6px)', border: '1px solid var(--border-card)' }}>
            <span className="admin-badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.4)' }}>⏳ Bekliyor</span>
            <span className="admin-badge" style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.4)' }}>✅ Onaylandı</span>
            <span className="admin-badge" style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-rose)', border: '1px solid rgba(239, 68, 68, 0.4)' }}>❌ Reddedildi</span>
            <span className="admin-badge" style={{ background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-cyan)', border: '1px solid rgba(6, 182, 212, 0.4)' }}>✉️ Onay Bekliyor</span>
            <span className="admin-badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-primary)', border: '1px solid rgba(99, 102, 241, 0.4)' }}>📰 Güncel / Blog</span>
          </div>
        </div>
      );
    }

    if (activeSection === 'headings') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className="admin-meta-text" style={{ fontSize: '0.66rem', fontWeight: 700 }}>CANLI ÖNİZLEME: BAŞLIKLAR</span>
          <div style={{ padding: '8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm, 6px)', border: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 className="admin-page-title">Örnek Sayfa Başlığı</h2>
            <h4 className="admin-card-title">Örnek Liste Kartı Başlığı</h4>
          </div>
        </div>
      );
    }

    if (activeSection === 'body') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span className="admin-meta-text" style={{ fontSize: '0.66rem', fontWeight: 700 }}>CANLI ÖNİZLEME: GÖVDE & AÇIKLAMALAR</span>
          <div style={{ padding: '8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm, 6px)', border: '1px solid var(--border-card)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p className="admin-card-desc">
              Kart açıklamaları ve gövde metinleri belirlenen font, boyut ve renkte burada görüntülenir.
            </p>
            <span className="admin-meta-text">Ziyaretçi • ziyaretci@example.com • 15.10.2026</span>
          </div>
        </div>
      );
    }

    // Kartlar veya Genel Renkler / Paket
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="admin-meta-text" style={{ fontSize: '0.66rem', fontWeight: 700 }}>CANLI ÖNİZLEME: LİSTE KARTI</span>
          <span className="admin-badge admin-badge-success">Örnek Kart</span>
        </div>
        <div className="admin-list-card" style={{ boxShadow: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 className="admin-card-title">Örnek Başlık: Sistem Tasarımı</h4>
            <span className="admin-badge admin-badge-info">Bilgi</span>
          </div>
          <p className="admin-card-desc line-clamp-2">
            Seçtiğiniz font, renk, dolgu ve yuvarlaklık arka plandaki tüm sayfalara anlık uygulanır.
          </p>
          <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
            <button type="button" className="admin-btn admin-btn-primary admin-btn-xs">
              Kaydet
            </button>
            <button type="button" className="admin-btn admin-btn-view admin-btn-xs">
              İncele
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside
      aria-label="Arayüz ve Tema Motoru"
      style={{
        position: 'fixed',
        top: '40px',
        right: 0,
        bottom: 0,
        width: '380px',
        maxWidth: '92vw',
        background: 'var(--bg-modal, #121826)',
        borderLeft: '1px solid var(--border-card)',
        boxShadow: '-6px 0 24px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Üst Bar: Başlık & Kapat Butonu */}
      <div
        style={{
          padding: '10px 14px',
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
            <h3 className="admin-page-title" style={{ fontSize: '0.88rem' }}>
              Tema & Arayüz Motoru
            </h3>
            <span className="admin-meta-text" style={{ fontSize: '0.68rem' }}>
              Aktif: {theme === 'dark' ? 'Koyu Mod' : 'Açık Mod'} (Bağımsız Saklanır)
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

      {/* Hedef Bileşen Seçici Açılır Menü */}
      <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border-card)', background: 'rgba(255, 255, 255, 0.02)' }}>
        <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
          MÜDAHALE EDİLECEK BİLEŞEN:
        </label>
        <select
          value={activeSection}
          onChange={(e) => setActiveSection(e.target.value as CustomizerSection)}
          className="admin-filter-select"
          style={{ width: '100%', height: '32px', fontWeight: 600 }}
        >
          <option value="colors">🎨 Genel Vurgu & Renkler</option>
          <option value="headings">🔤 Başlık Tipografisi</option>
          <option value="body">📝 Gövde & Açıklama Tipografisi</option>
          <option value="cards">🗂️ Liste & İçerik Kartları</option>
          <option value="buttons">🔘 Butonlar (Dolgular, Renkler & Emniyet)</option>
          <option value="badges">🏷️ Rozetler & Etiketler (Dolgular & Emniyet)</option>
          <option value="package">💾 Tema Paketi (İçe / Dışa Aktar)</option>
        </select>
      </div>

      {/* Kaydırılabilir Denetim Alanı */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Seçilen Bileşene Uygun Canlı Önizleme */}
        <div
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-md, 8px)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed var(--border-card)',
          }}
        >
          {renderContextualPreview()}
        </div>

        {/* Seçilen Hedef Bileşenin Ayar Paneli */}
        <InspectorSections
          section={activeSection}
          metrics={metrics}
          onUpdateMetric={updateMetric}
          onReset={resetDefaults}
          onExportJSON={exportJSON}
          onImportJSON={importJSON}
        />
      </div>

      {/* Alt Çubuk */}
      <div
        style={{
          padding: '8px 14px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          background: 'var(--bg-card)',
        }}
      >
        <button
          type="button"
          onClick={closeCustomizer}
          className="admin-btn admin-btn-primary admin-btn-sm"
        >
          Paneli Kapat
        </button>
      </div>
    </aside>
  );
};
