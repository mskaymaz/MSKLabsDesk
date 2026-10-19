import React, { useState } from 'react';
import type { AppFeatureCard } from '../../../types';

interface AppStudioFeaturesDrawerProps {
  featureCards: AppFeatureCard[];
  onChangeFeatureCards: (cards: AppFeatureCard[]) => void;
}

export const AppStudioFeaturesDrawer: React.FC<AppStudioFeaturesDrawerProps> = ({
  featureCards,
  onChangeFeatureCards,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  const handleAddCard = () => {
    const newCard: AppFeatureCard = {
      icon: '✨',
      title_tr: 'Yeni Özellik',
      title_en: 'New Feature',
      title_ar: 'ميزة جديدة',
      description_tr: 'Özellik detay açıklaması...',
      description_en: 'Feature detail description...',
      description_ar: 'وصف تفصيلي للميزة...',
      desc_tr: 'Özellik detay açıklaması...',
      desc_en: 'Feature detail description...',
      desc_ar: 'وصف تفصيلي للميزة...',
    };
    const updated = [...featureCards, newCard];
    onChangeFeatureCards(updated);
    setActiveCardIndex(updated.length - 1);
  };

  const handleRemoveCard = (index: number) => {
    const updated = featureCards.filter((_, i) => i !== index);
    onChangeFeatureCards(updated);
    if (activeCardIndex >= updated.length) {
      setActiveCardIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleUpdateCard = (index: number, field: keyof AppFeatureCard, value: string) => {
    const updated = [...featureCards];
    const card = { ...updated[index], [field]: value };
    // desc_tr ve description_tr senkronizasyonu
    if (field === 'desc_tr' || field === 'description_tr') {
      card.desc_tr = value;
      card.description_tr = value;
    } else if (field === 'desc_en' || field === 'description_en') {
      card.desc_en = value;
      card.description_en = value;
    } else if (field === 'desc_ar' || field === 'description_ar') {
      card.desc_ar = value;
      card.description_ar = value;
    }
    updated[index] = card;
    onChangeFeatureCards(updated);
  };

  const currentCard = featureCards[activeCardIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300">
          Özellik Kartları Listesi ({featureCards.length})
        </label>
        <button
          type="button"
          onClick={handleAddCard}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition"
        >
          <span>+ Yeni Kart</span>
        </button>
      </div>

      {/* Kart Seçici Hap Butonlar */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {featureCards.map((card, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveCardIndex(idx)}
            className={`px-2.5 py-1 text-xs rounded-lg whitespace-nowrap transition flex items-center gap-1.5 border ${
              activeCardIndex === idx
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750'
            }`}
          >
            <span>{card.icon || '📌'}</span>
            <span>{card.title_tr || `Kart ${idx + 1}`}</span>
          </button>
        ))}
      </div>

      {currentCard ? (
        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/70 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200">
              Kart #{activeCardIndex + 1} Düzenleme
            </span>
            <button
              type="button"
              onClick={() => handleRemoveCard(activeCardIndex)}
              className="text-xs text-rose-400 hover:text-rose-300 transition"
            >
              Kartı Sil
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              İkon (Emoji veya Kısa Metin)
            </label>
            <input
              type="text"
              value={currentCard.icon || ''}
              onChange={(e) => handleUpdateCard(activeCardIndex, 'icon', e.target.value)}
              placeholder="Örn: ⏱️, 🔔, 📍"
              className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* TR Başlık & Açıklama */}
          <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/40 space-y-2">
            <span className="text-[11px] font-bold text-emerald-400">TR (Türkçe)</span>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Başlık (TR)</label>
              <input
                type="text"
                value={currentCard.title_tr || ''}
                onChange={(e) => handleUpdateCard(activeCardIndex, 'title_tr', e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Açıklama (TR)</label>
              <textarea
                rows={2}
                value={currentCard.desc_tr || ''}
                onChange={(e) => handleUpdateCard(activeCardIndex, 'desc_tr', e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* EN Başlık & Açıklama */}
          <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/40 space-y-2">
            <span className="text-[11px] font-bold text-sky-400">EN (English)</span>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Başlık (EN)</label>
              <input
                type="text"
                value={currentCard.title_en || ''}
                onChange={(e) => handleUpdateCard(activeCardIndex, 'title_en', e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Açıklama (EN)</label>
              <textarea
                rows={2}
                value={currentCard.desc_en || ''}
                onChange={(e) => handleUpdateCard(activeCardIndex, 'desc_en', e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* AR Başlık & Açıklama */}
          <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-950/40 space-y-2" dir="rtl">
            <span className="text-[11px] font-bold text-emerald-400">AR (العربية)</span>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">العنوان (AR)</label>
              <input
                type="text"
                value={currentCard.title_ar || ''}
                onChange={(e) => handleUpdateCard(activeCardIndex, 'title_ar', e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">الوصف (AR)</label>
              <textarea
                rows={2}
                value={currentCard.desc_ar || ''}
                onChange={(e) => handleUpdateCard(activeCardIndex, 'desc_ar', e.target.value)}
                className="w-full px-2.5 py-1 text-xs rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
          Henüz özellik kartı tanımlanmamış. Yukarıdaki butondan yeni kart ekleyebilirsiniz.
        </div>
      )}
    </div>
  );
};
