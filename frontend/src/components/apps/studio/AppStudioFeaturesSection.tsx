import React from 'react';
import { Edit2 } from 'lucide-react';
import type { AppFeatureCard } from '../../../types';
import type { CanvasLang, StudioSectionType } from './types';

interface AppStudioFeaturesSectionProps {
  featureCards?: AppFeatureCard[];
  canvasLang: CanvasLang;
  onSelectSection: (section: StudioSectionType) => void;
}

export const AppStudioFeaturesSection: React.FC<AppStudioFeaturesSectionProps> = ({
  featureCards = [],
  canvasLang,
  onSelectSection,
}) => {
  const isAr = canvasLang === 'ar';
  const isEn = canvasLang === 'en';

  const featTitle = isAr
    ? 'الميزات البارزة'
    : (isEn ? 'Highlighted Features' : 'Öne Çıkan Özellikler');

  return (
    <div 
      className="studio-editable-zone"
      onClick={() => onSelectSection('features')}
      title="Öne çıkan özellikleri düzenlemek için tıklayın"
      style={{ padding: '6px 8px', marginTop: '14px' }}
    >
      <div className="studio-edit-badge">
        <Edit2 size={12} />
        <span>Özellik Kartları</span>
      </div>

      <div className="studio-features-title">{featTitle}</div>

      {featureCards && featureCards.length > 0 ? (
        <div className="studio-features-grid">
          {featureCards.map((card, idx) => {
            const title = isAr
              ? (card.title_ar || card.title_tr)
              : (isEn ? (card.title_en || card.title_tr) : card.title_tr);

            const desc = isAr
              ? (card.description_ar || card.desc_ar || card.description_tr || card.desc_tr)
              : (isEn ? (card.description_en || card.desc_en || card.description_tr || card.desc_tr) : (card.description_tr || card.desc_tr));

            return (
              <div key={idx} className="studio-feature-box">
                <h4>
                  <span className="studio-feature-icon">{card.icon || '✨'}</span>
                  <span className="studio-feature-title">{title}</span>
                </h4>
                <p>{desc}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px' }}>
          {isAr 
            ? 'لا توجد ميزات محددة بعد. انقر لإضافة ميزات.' 
            : (isEn 
              ? 'No features added yet. Click to add feature cards.' 
              : 'Henüz özellik kartı eklenmemiş. Eklemek için tıklayın.')}
        </div>
      )}
    </div>
  );
};
