import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { PlusCircle } from 'lucide-react';
import type { AdPlacementSetting } from '../../types';

interface NewAdSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newSlot: AdPlacementSetting) => Promise<void>;
  existingKeys: string[];
}

export const NewAdSlotModal: React.FC<NewAdSlotModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingKeys,
}) => {
  const [title, setTitle] = useState('');
  const [keySuffix, setKeySuffix] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fullSlotKey = `ad_${keySuffix.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !keySuffix.trim()) {
      setError('Lütfen reklam başlığı ve anahtar adını girin.');
      return;
    }

    if (existingKeys.includes(fullSlotKey)) {
      setError(`"${fullSlotKey}" anahtarı zaten mevcut. Lütfen farklı bir isim seçin.`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const newSlot: AdPlacementSetting = {
        slot_key: fullSlotKey,
        title: title.trim(),
        description: description.trim() || undefined,
        ad_client: '',
        ad_slot: '',
        is_enabled: false,
        desktop: {
          is_enabled: false,
          preset_size: 'RESPONSIVE',
          custom_width: null,
          custom_height: null,
          margin_top: 16,
          margin_right: 0,
          margin_bottom: 16,
          margin_left: 0,
          align: 'center',
          is_sticky: false,
        },
        mobile: {
          is_enabled: false,
          preset_size: 'RESPONSIVE',
          custom_width: null,
          custom_height: null,
          margin_top: 12,
          margin_right: 0,
          margin_bottom: 12,
          margin_left: 0,
          align: 'center',
        },
      };

      await onAdd(newSlot);
      setTitle('');
      setKeySuffix('');
      setDescription('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Reklam alanı eklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Reklam Alanı Tanımla" maxWidth="500px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {error && (
          <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', fontSize: '0.82rem' }}>
            {error}
          </div>
        )}

        <div>
          <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            Reklam Başlığı / Tanımı *
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Örn: Yorumlar Arası Reklam"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!keySuffix) {
                const autoKey = e.target.value
                  .toLowerCase()
                  .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
                  .replace(/[^a-z0-9]/g, '_')
                  .replace(/_+/g, '_')
                  .slice(0, 24);
                setKeySuffix(autoKey);
              }
            }}
            required
          />
        </div>

        <div>
          <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            Sistem Anahtarı (Slot Key) *
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>ad_</span>
            <input
              type="text"
              className="form-input"
              placeholder="between_comments"
              value={keySuffix}
              onChange={(e) => setKeySuffix(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              required
            />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
            Tam kod: <code>{fullSlotKey}</code>
          </span>
        </div>

        <div>
          <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            Yerleşim Açıklaması (İsteğe bağlı)
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Örn: Makale altındaki yorumların 3. sırasından sonra gösterilir"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
          <button type="button" className="admin-btn admin-btn-secondary admin-btn-sm" onClick={onClose}>
            İptal
          </button>
          <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm" disabled={loading}>
            <PlusCircle size={14} />
            <span>{loading ? 'Ekleniyor...' : 'Reklam Alanını Oluştur'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
