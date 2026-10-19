import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Sparkles, ChevronUp, ChevronDown, Check, X } from 'lucide-react';
import type { AppFeatureCard } from '../../types';

interface AppModalFeatureCardsProps {
  cards: AppFeatureCard[];
  onChange: (cards: AppFeatureCard[]) => void;
  onAiTranslate: (data: { title_tr: string; content_tr: string }) => Promise<any>;
}

const QUICK_EMOJIS = ['🕋', '➕', '⚠️', '🧭', '📖', '🔇', '⚙️', '📍', '⚡', '🔔', '📱', '🎯', '⏳', '🔢', '📡', '🌓'];

const EMPTY_CARD: AppFeatureCard = {
  icon: '⭐',
  title_tr: '',
  title_en: '',
  title_ar: '',
  description_tr: '',
  description_en: '',
  description_ar: '',
};

export const AppModalFeatureCards: React.FC<AppModalFeatureCardsProps> = ({
  cards,
  onChange,
  onAiTranslate,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftCard, setDraftCard] = useState<AppFeatureCard>(EMPTY_CARD);
  const [cardLangTab, setCardLangTab] = useState<'tr' | 'en' | 'ar'>('tr');
  const [aiTranslating, setAiTranslating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const startNewCard = () => {
    setDraftCard({ ...EMPTY_CARD, id: `card_${Date.now()}` });
    setCardLangTab('tr');
    setValidationError(null);
    setEditingIndex(-1); // -1 = yeni kart ekleme modu
  };

  const startEditCard = (index: number) => {
    setDraftCard({ ...cards[index] });
    setCardLangTab('tr');
    setValidationError(null);
    setEditingIndex(index);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setDraftCard(EMPTY_CARD);
    setValidationError(null);
  };

  const handleCardAiTranslate = async () => {
    if (!draftCard.title_tr.trim() || !draftCard.description_tr.trim()) {
      setValidationError('AI çevirisi için Türkçe Başlık ve Alt Açıklama doldurulmalıdır.');
      return;
    }
    try {
      setAiTranslating(true);
      setValidationError(null);
      const res = await onAiTranslate({
        title_tr: draftCard.title_tr,
        content_tr: draftCard.description_tr,
      });
      if (res?.translation) {
        setDraftCard((prev) => ({
          ...prev,
          title_en: res.translation.title_en || prev.title_en,
          title_ar: res.translation.title_ar || prev.title_ar,
          description_en: res.translation.content_en || prev.description_en,
          description_ar: res.translation.content_ar || prev.description_ar,
        }));
      }
    } catch (err: any) {
      setValidationError(err.message || 'AI çevirisi tamamlanamadı.');
    } finally {
      setAiTranslating(false);
    }
  };

  const saveDraftCard = () => {
    if (!draftCard.title_tr.trim()) {
      setValidationError('Türkçe Başlık zorunludur.');
      return;
    }
    if (!draftCard.description_tr.trim()) {
      setValidationError('Türkçe Alt Açıklama zorunludur.');
      return;
    }

    const updated = [...cards];
    if (editingIndex === -1) {
      updated.push(draftCard);
    } else if (editingIndex !== null) {
      updated[editingIndex] = draftCard;
    }
    onChange(updated);
    cancelEdit();
  };

  const removeCard = (index: number) => {
    if (window.confirm('Bu özellik kartını silmek istediğinize emin misiniz?')) {
      const updated = cards.filter((_, i) => i !== index);
      onChange(updated);
      if (editingIndex === index) cancelEdit();
    }
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= cards.length) return;
    const updated = [...cards];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Üst Bilgi ve Yeni Ekle Butonu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Öne Çıkan Özellik Kartları ({cards.length})</span>
          <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Uygulama tanıtım sayfasındaki ızgara (grid) kartları. Her bir kart ayrı başlık, ikon ve açıklamadan oluşur.
          </p>
        </div>
        {editingIndex === null && (
          <button
            type="button"
            onClick={startNewCard}
            className="admin-btn admin-btn-sm admin-btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus size={14} />
            <span>+ Yeni Kart Ekle</span>
          </button>
        )}
      </div>

      {/* Kart Ekleme / Düzenleme Formu */}
      {editingIndex !== null && (
        <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--accent-primary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
              {editingIndex === -1 ? '➕ Yeni Özellik Kartı Tanımla' : `✏️ Kartı Düzenle (#${editingIndex + 1})`}
            </span>
            <button type="button" onClick={cancelEdit} className="admin-btn admin-btn-sm" style={{ padding: '4px' }}>
              <X size={14} />
            </button>
          </div>

          {validationError && (
            <div style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '6px', color: '#f87171', fontSize: '0.82rem' }}>
              {validationError}
            </div>
          )}

          {/* İkon / Emoji Seçimi */}
          <div>
            <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Kart İkonu / Emoji</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                value={draftCard.icon}
                onChange={(e) => setDraftCard({ ...draftCard, icon: e.target.value })}
                className="form-input"
                style={{ width: '60px', textAlign: 'center', fontSize: '1.2rem', padding: '4px' }}
                placeholder="⭐"
              />
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', flex: 1 }}>
                {QUICK_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setDraftCard({ ...draftCard, icon: emoji })}
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.95rem' }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Çok Dilli Sekmeler & AI Çeviri */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['tr', 'en', 'ar'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setCardLangTab(lang)}
                    className="admin-btn admin-btn-sm"
                    style={{
                      background: cardLangTab === lang ? 'var(--accent-primary)' : 'transparent',
                      color: cardLangTab === lang ? '#fff' : 'var(--text-secondary)',
                      fontWeight: 600,
                      padding: '3px 10px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCardAiTranslate}
                disabled={aiTranslating}
                className="admin-btn admin-btn-sm admin-btn-sparkle"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
              >
                <Sparkles size={13} />
                <span>{aiTranslating ? 'Çeviriyor...' : 'AI Çevir (EN/AR)'}</span>
              </button>
            </div>

            {cardLangTab === 'tr' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Özellik Başlığı (TR) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Namaz Vakitleri & Canlı Sayaç"
                    value={draftCard.title_tr}
                    onChange={(e) => setDraftCard({ ...draftCard, title_tr: e.target.value })}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Alt Açıklama Metni (TR) *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Örn: İmsak, Güneş, Öğle, İkindi vakitleri, canlı geri sayım ve Diyanet uyumlu vakit desteği."
                    value={draftCard.description_tr}
                    onChange={(e) => setDraftCard({ ...draftCard, description_tr: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {cardLangTab === 'en' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Feature Title (EN)</label>
                  <input
                    type="text"
                    placeholder="Prayer Times & Live Countdown"
                    value={draftCard.title_en || ''}
                    onChange={(e) => setDraftCard({ ...draftCard, title_en: e.target.value })}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Sub-Description (EN)</label>
                  <textarea
                    rows={3}
                    placeholder="Track daily prayer times with live countdown..."
                    value={draftCard.description_en || ''}
                    onChange={(e) => setDraftCard({ ...draftCard, description_en: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {cardLangTab === 'ar' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} dir="rtl">
                <div>
                  <label className="form-label" style={{ fontWeight: 600, textAlign: 'right' }}>عنوان الميزة (AR)</label>
                  <input
                    type="text"
                    placeholder="أوقات الصلاة والعداد التنازلي"
                    value={draftCard.title_ar || ''}
                    onChange={(e) => setDraftCard({ ...draftCard, title_ar: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', textAlign: 'right' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, textAlign: 'right' }}>الوصف والتعريف (AR)</label>
                  <textarea
                    rows={3}
                    placeholder="متابعة أوقات الصلاة اليومية مع عداد تنازلي مباشر..."
                    value={draftCard.description_ar || ''}
                    onChange={(e) => setDraftCard({ ...draftCard, description_ar: e.target.value })}
                    className="form-input"
                    style={{ width: '100%', resize: 'vertical', textAlign: 'right' }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Aksiyon Butonları */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button type="button" onClick={cancelEdit} className="admin-btn admin-btn-sm admin-btn-refresh">
              İptal
            </button>
            <button type="button" onClick={saveDraftCard} className="admin-btn admin-btn-sm admin-btn-primary">
              <Check size={14} />
              <span>{editingIndex === -1 ? 'Kartı Ekle' : 'Kartı Güncelle'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Kart Listesi */}
      {cards.length === 0 ? (
        <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--border-subtle)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Henüz özellik kartı eklenmedi. "Yeni Kart Ekle" butonuna basarak başlık ve açıklamaları parçalı olarak ekleyebilirsiniz.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cards.map((card, idx) => (
            <div
              key={card.id || idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: editingIndex === idx ? 'rgba(99, 102, 241, 0.08)' : 'rgba(0,0,0,0.15)',
                border: editingIndex === idx ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{card.icon || '⭐'}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {card.title_tr || 'İsimsiz Kart'}
                    </strong>
                    {card.title_en && <span className="admin-badge" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>EN</span>}
                    {card.title_ar && <span className="admin-badge" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>AR</span>}
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {card.description_tr || 'Açıklama girilmedi.'}
                  </p>
                </div>
              </div>

              {/* Sıralama & Düzenleme Butonları */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveCard(idx, 'up')}
                  className="admin-btn admin-btn-sm"
                  style={{ padding: '4px', opacity: idx === 0 ? 0.3 : 1 }}
                  title="Yukarı Taşı"
                >
                  <ChevronUp size={13} />
                </button>
                <button
                  type="button"
                  disabled={idx === cards.length - 1}
                  onClick={() => moveCard(idx, 'down')}
                  className="admin-btn admin-btn-sm"
                  style={{ padding: '4px', opacity: idx === cards.length - 1 ? 0.3 : 1 }}
                  title="Aşağı Taşı"
                >
                  <ChevronDown size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => startEditCard(idx)}
                  className="admin-btn admin-btn-sm admin-btn-view"
                  style={{ padding: '4px' }}
                  title="Düzenle"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => removeCard(idx)}
                  className="admin-btn admin-btn-sm admin-btn-delete"
                  style={{ padding: '4px' }}
                  title="Sil"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
