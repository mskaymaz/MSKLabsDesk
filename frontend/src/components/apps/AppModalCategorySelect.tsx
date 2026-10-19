import React, { useState } from 'react';
import { Plus, X, Tag } from 'lucide-react';

export const PRESET_CATEGORIES: { id: string; label: string }[] = [
  { id: 'islamic', label: 'İslami / Dinî' },
  { id: 'utility', label: 'Araçlar & Yardımcılar' },
  { id: 'productivity', label: 'Üretkenlik & Takip' },
  { id: 'education', label: 'Eğitim & İlim' },
  { id: 'lifestyle', label: 'Yaşam & Sağlık' },
  { id: 'multimedia', label: 'Multimedya & Ses' },
  { id: 'ai', label: 'Yapay Zekâ' },
  { id: 'system', label: 'Sistem & Güvenlik' },
];

interface AppModalCategorySelectProps {
  value: string;
  onChange: (val: string) => void;
}

export const AppModalCategorySelect: React.FC<AppModalCategorySelectProps> = ({
  value,
  onChange,
}) => {
  const [customInput, setCustomInput] = useState('');

  // Virgülle ayrılmış kategorileri diziye dönüştür
  const selectedList = value
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const toggleCategory = (catId: string) => {
    let next: string[];
    if (selectedList.includes(catId)) {
      next = selectedList.filter((c) => c !== catId);
    } else {
      next = [...selectedList, catId];
    }
    onChange(next.join(', '));
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (!selectedList.includes(trimmed)) {
      const next = [...selectedList, trimmed];
      onChange(next.join(', '));
    }
    setCustomInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="form-label" style={{ fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Tag size={14} />
          <span>Kategoriler (Çoklu Seçim)</span>
        </label>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {selectedList.length} seçili
        </span>
      </div>

      {/* Hazır ve Özel Kategori Rozetleri */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '34px', alignItems: 'center' }}>
        {PRESET_CATEGORIES.map((cat) => {
          const isSelected = selectedList.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggleCategory(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 600 : 500,
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255,255,255,0.03)',
                color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{cat.label}</span>
              {isSelected && <X size={12} />}
            </button>
          );
        })}

        {/* Önceden tanımlı olmayan özel eklenmiş kategoriler */}
        {selectedList
          .filter((cat) => !PRESET_CATEGORIES.some((p) => p.id === cat))
          .map((customCat) => (
            <button
              key={customCat}
              type="button"
              onClick={() => toggleCategory(customCat)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '16px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid #10b981',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
              }}
            >
              <span>{customCat}</span>
              <X size={12} />
            </button>
          ))}
      </div>

      {/* Yeni Özel Kategori Girişi */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
        <input
          type="text"
          placeholder="Listede yoksa yeni kategori yazıp Enter'a basın..."
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="form-input"
          style={{ flex: 1, fontSize: '0.82rem', padding: '6px 10px' }}
        />
        <button
          type="button"
          onClick={() => handleAddCustom()}
          className="admin-btn admin-btn-sm admin-btn-view"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px' }}
          title="Özel kategori ekle"
        >
          <Plus size={14} />
          <span>Ekle</span>
        </button>
      </div>
    </div>
  );
};
