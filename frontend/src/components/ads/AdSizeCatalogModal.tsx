import React, { useState } from 'react';
import { Layers, CheckSquare, Square, RotateCcw, Check, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import {
  ADSENSE_MASTER_CATALOG,
  DEFAULT_ENABLED_PRESETS,
  saveEnabledPresets,
  type AdSenseCatalogItem,
} from '../../utils/adDimensions';

interface AdSizeCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  enabledKeys: string[];
  onSave: (keys: string[]) => void;
}

export const AdSizeCatalogModal: React.FC<AdSizeCatalogModalProps> = ({
  isOpen,
  onClose,
  enabledKeys,
  onSave,
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(enabledKeys);

  // Modal her açıldığında mevcut enabledKeys ile senkronize et
  React.useEffect(() => {
    if (isOpen) {
      setSelectedKeys(enabledKeys);
    }
  }, [isOpen, enabledKeys]);

  const toggleKey = (key: string) => {
    // CUSTOM ve RESPONSIVE her zaman açık kalmalıdır
    if (key === 'CUSTOM' || key === 'RESPONSIVE') return;

    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSelectAll = () => {
    setSelectedKeys(ADSENSE_MASTER_CATALOG.map((item) => item.key));
  };

  const handleResetDefault = () => {
    setSelectedKeys(DEFAULT_ENABLED_PRESETS);
  };

  const handleApply = () => {
    saveEnabledPresets(selectedKeys);
    onSave(selectedKeys);
    onClose();
  };

  const horizontalItems = ADSENSE_MASTER_CATALOG.filter((i) => i.category === 'horizontal');
  const verticalRectItems = ADSENSE_MASTER_CATALOG.filter((i) => i.category === 'vertical_rect');
  const specialItems = ADSENSE_MASTER_CATALOG.filter((i) => i.category === 'special');

  const renderCard = (item: AdSenseCatalogItem) => {
    const isChecked = selectedKeys.includes(item.key);
    const isLocked = item.key === 'CUSTOM' || item.key === 'RESPONSIVE';

    return (
      <div
        key={item.key}
        onClick={() => toggleKey(item.key)}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          padding: '8px 10px',
          borderRadius: '6px',
          border: '1px solid',
          borderColor: isChecked ? 'var(--accent-primary, #6366f1)' : 'var(--border-subtle, #334155)',
          background: isChecked ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card, #1e293b)',
          cursor: isLocked ? 'default' : 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ marginTop: '2px', color: isChecked ? 'var(--accent-primary, #6366f1)' : 'var(--text-muted)' }}>
          {isChecked ? <CheckSquare size={16} /> : <Square size={16} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {item.label}
            </span>
            {item.isCommon && (
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--accent-emerald, #10b981)',
                }}
              >
                Standart
              </span>
            )}
            {isLocked && (
              <span
                style={{
                  fontSize: '0.65rem',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  background: 'rgba(100, 116, 139, 0.2)',
                  color: 'var(--text-secondary)',
                }}
              >
                Zorunlu
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.3 }}>
            {item.desc}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Google AdSense Ebat & Format Kataloğu"
      maxWidth="720px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Açıklama ve Hızlı Butonlar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            paddingBottom: '10px',
            borderBottom: '1px solid var(--border-subtle, #334155)',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Ebat açılır listesinde görünmesini istediğiniz Google standart formatlarını işaretleyin.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={handleSelectAll}
              style={{ fontSize: '0.74rem', padding: '4px 8px' }}
            >
              <Layers size={13} />
              <span>Tümünü Seç</span>
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={handleResetDefault}
              style={{ fontSize: '0.74rem', padding: '4px 8px' }}
            >
              <RotateCcw size={13} />
              <span>Varsayılana Dön</span>
            </button>
          </div>
        </div>

        {/* 2 Sütunlu Katalog: Sol Yatay, Sağ Dikey & Kare */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '12px',
            maxHeight: '52vh',
            overflowY: 'auto',
            paddingRight: '4px',
          }}
        >
          {/* Sol: Yatay Reklamlar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                paddingBottom: '4px',
                borderBottom: '1px solid var(--border-subtle, #334155)',
              }}
            >
              <span>Yatay Reklamlar (Leaderboard & Banner)</span>
            </div>
            {horizontalItems.map(renderCard)}
          </div>

          {/* Sağ: Dikey ve Kare Reklamlar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                paddingBottom: '4px',
                borderBottom: '1px solid var(--border-subtle, #334155)',
              }}
            >
              <span>Dikey & Kare Reklamlar (Skyscraper & Rectangle)</span>
            </div>
            {verticalRectItems.map(renderCard)}

            {/* Özel & Dinamik */}
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                color: 'var(--text-secondary)',
                marginTop: '4px',
                paddingBottom: '2px',
              }}
            >
              <Sparkles size={12} style={{ display: 'inline', marginRight: '4px' }} />
              Dinamik & Özel Ebatlar
            </div>
            {specialItems.map(renderCard)}
          </div>
        </div>

        {/* Alt Çubuk: Sayaç ve Onay Butonu */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-subtle, #334155)',
          }}
        >
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Seçili Ebat: <strong>{selectedKeys.length}</strong> / {ADSENSE_MASTER_CATALOG.length}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={onClose}
              style={{ fontSize: '0.8rem' }}
            >
              İptal
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={handleApply}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}
            >
              <Check size={14} />
              <span>Seçimleri Menüye Uygula</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
