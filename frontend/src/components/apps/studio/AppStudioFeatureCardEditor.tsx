import React, { useState } from 'react';
import { Plus, Trash2, Globe, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import type { AppFeatureCard } from '../../../types';

export const QUICK_FEATURE_ICONS = [
  '🕋', '⏰', '🧭', '📖', '🔇', '⚙️', 
  '📍', '⚡', '🔔', '📅', '🤲', '💡', 
  '📊', '🛡️', '🌙', '☀️', '🔍', '📱', 
  '🎯', '⏳', '🔢', '📡', '🌓', '🏷️', 
  '➕', '⚠️', '⭐', '✨'
];

interface AppStudioFeatureCardEditorProps {
  cards: AppFeatureCard[];
  activeIdx: number;
  onSelectIdx: (idx: number) => void;
  onAddCard: () => void;
  onRemoveCard: (idx: number) => void;
  onUpdateCard: (idx: number, field: keyof AppFeatureCard, val: string) => void;
}

export const AppStudioFeatureCardEditor: React.FC<AppStudioFeatureCardEditorProps> = ({
  cards,
  activeIdx,
  onSelectIdx,
  onAddCard,
  onRemoveCard,
  onUpdateCard,
}) => {
  const [showCustomIconInput, setShowCustomIconInput] = useState(false);
  const [showTranslations, setShowTranslations] = useState(false);

  const activeCard = cards[activeIdx] || null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Üst Bar: Kart Sayısı & Yeni Kart Ekle Butonu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
            Özellik Kartları
          </span>
          <span className="admin-badge admin-badge-counter">{cards.length}</span>
        </div>
        <button
          type="button"
          onClick={onAddCard}
          className="admin-btn admin-btn-primary"
          style={{ padding: '3px 10px', fontSize: '0.74rem', gap: '4px' }}
        >
          <Plus size={13} />
          <span>Yeni Kart Ekle</span>
        </button>
      </div>

      {/* Kart Seçici Yatay Sekmeler */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        {cards.map((card, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectIdx(idx)}
            className="admin-btn"
            style={{
              padding: '4px 10px',
              fontSize: '0.74rem',
              background: activeIdx === idx ? '#2563eb' : '#f8fafc',
              color: activeIdx === idx ? '#ffffff' : '#334155',
              borderColor: activeIdx === idx ? '#2563eb' : '#cbd5e1',
              fontWeight: activeIdx === idx ? 700 : 500,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span>{card.icon || '📌'}</span>
            <span>{card.title_tr || `Kart #${idx + 1}`}</span>
          </button>
        ))}
      </div>

      {/* Aktif Kart Düzenleme Formu */}
      {activeCard ? (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Kart Başlığı ve Silme Butonu */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '6px', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b' }}>
              Kart #{activeIdx + 1} Düzenleniyor
            </span>
            <button
              type="button"
              onClick={() => onRemoveCard(activeIdx)}
              className="admin-btn"
              style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.74rem', padding: '2px 6px', gap: '4px' }}
              title="Bu kartı sil"
            >
              <Trash2 size={13} />
              <span>Kartı Sil</span>
            </button>
          </div>

          {/* 1. İkon Seçici Bölümü */}
          <div className="studio-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="studio-label" style={{ margin: 0 }}>Hazır İkon Paleti</label>
              <button
                type="button"
                onClick={() => setShowCustomIconInput(!showCustomIconInput)}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                <ImageIcon size={12} />
                <span>{showCustomIconInput ? 'Hazır İkonlara Dön' : 'Özel SVG / URL Gir'}</span>
              </button>
            </div>

            {!showCustomIconInput ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))', gap: '4px', background: '#ffffff', padding: '6px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                {QUICK_FEATURE_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => onUpdateCard(activeIdx, 'icon', ic)}
                    style={{
                      border: (activeCard.icon === ic) ? '2px solid #2563eb' : '1px solid transparent',
                      background: (activeCard.icon === ic) ? '#dbeafe' : 'transparent',
                      borderRadius: '6px',
                      fontSize: '1.15rem',
                      height: '32px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      lineHeight: 1,
                    }}
                    title={ic}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <input
                  type="text"
                  value={activeCard.icon || ''}
                  onChange={(e) => onUpdateCard(activeIdx, 'icon', e.target.value)}
                  placeholder="SVG kodu, emoji veya ikon URL (https://...)"
                  className="studio-input"
                />
                <span style={{ fontSize: '0.70rem', color: '#64748b' }}>
                  Önerilen: 48x48px şeffaf PNG/SVG veya tekil emoji karakteri.
                </span>
              </div>
            )}
          </div>

          {/* 2. İkon ve Başlık Yan Yana (Kullanıcı Talebi Standardı) */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}>
              {activeCard.icon || '✨'}
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <label className="studio-label" style={{ margin: 0 }}>Özellik Başlığı (TR) *</label>
              <input
                type="text"
                value={activeCard.title_tr || ''}
                onChange={(e) => onUpdateCard(activeIdx, 'title_tr', e.target.value)}
                placeholder="Örn: Kerahat Vakitleri & Akıllı Uyarı"
                className="studio-input"
              />
            </div>
          </div>

          {/* 3. Açıklama Satırları (TR) */}
          <div className="studio-form-group">
            <label className="studio-label">Açıklama (TR) *</label>
            <textarea
              rows={3}
              value={activeCard.description_tr || activeCard.desc_tr || ''}
              onChange={(e) => onUpdateCard(activeIdx, 'description_tr', e.target.value)}
              placeholder="Özelliğin sağladığı faydayı ve işlevini açıklayın..."
              className="studio-textarea"
            />
          </div>

          {/* 4. Çok Dilli Çeviriler (EN / AR) Açılır Panel */}
          <div>
            <button
              type="button"
              onClick={() => setShowTranslations(!showTranslations)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <Globe size={13} />
              <span>İngilizce (EN) ve Arapça (AR) Çevirilerini {showTranslations ? 'Gizle' : 'Düzenle'}</span>
              {showTranslations ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {showTranslations && (
              <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px', background: '#ffffff', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div className="studio-form-group">
                  <label className="studio-label">Title (EN)</label>
                  <input
                    type="text"
                    value={activeCard.title_en || ''}
                    onChange={(e) => onUpdateCard(activeIdx, 'title_en', e.target.value)}
                    placeholder="Feature title in English"
                    className="studio-input"
                  />
                </div>
                <div className="studio-form-group">
                  <label className="studio-label">Description (EN)</label>
                  <textarea
                    rows={2}
                    value={activeCard.description_en || activeCard.desc_en || ''}
                    onChange={(e) => onUpdateCard(activeIdx, 'description_en', e.target.value)}
                    placeholder="Feature description in English"
                    className="studio-textarea"
                  />
                </div>
                <div className="studio-form-group" dir="rtl">
                  <label className="studio-label">العنوان (AR)</label>
                  <input
                    type="text"
                    value={activeCard.title_ar || ''}
                    onChange={(e) => onUpdateCard(activeIdx, 'title_ar', e.target.value)}
                    placeholder="عنوان الميزة بالعربية"
                    className="studio-input"
                  />
                </div>
                <div className="studio-form-group" dir="rtl">
                  <label className="studio-label">الوصف (AR)</label>
                  <textarea
                    rows={2}
                    value={activeCard.description_ar || activeCard.desc_ar || ''}
                    onChange={(e) => onUpdateCard(activeIdx, 'description_ar', e.target.value)}
                    placeholder="وصف الميزة بالعربية"
                    className="studio-textarea"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Canlı Mini Kart Önizlemesi */}
          <div style={{ marginTop: '4px', background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '12px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
              Canlı Kart Önizlemesi
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>{activeCard.icon || '✨'}</span>
              <strong style={{ fontSize: '0.88rem', color: '#0f172a', lineHeight: 1.3 }}>
                {activeCard.title_tr || 'Özellik Başlığı'}
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.80rem', color: '#64748b', lineHeight: 1.45 }}>
              {activeCard.description_tr || activeCard.desc_tr || 'Açıklama metni burada görünecektir.'}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px', color: '#64748b', fontSize: '0.82rem', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
          Henüz özellik kartı tanımlanmamış. "Yeni Kart Ekle" butonuna basarak başlayabilirsiniz.
        </div>
      )}
    </div>
  );
};
