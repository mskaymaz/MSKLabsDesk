import React from 'react';
import { Edit2, Sparkles } from 'lucide-react';
import type { AppFeatureCard } from '../../../types';
import type { CanvasLang, StudioSectionType } from './types';

interface AppStudioFeaturesSectionProps {
  featureCards?: AppFeatureCard[];
  canvasLang: CanvasLang;
  activeSection?: StudioSectionType | null;
  selectedSection?: StudioSectionType | null;
  onSelectSection: (section: StudioSectionType) => void;
}

export const AppStudioFeaturesSection: React.FC<AppStudioFeaturesSectionProps> = ({
  featureCards = [],
  canvasLang,
  activeSection,
  selectedSection,
  onSelectSection,
}) => {
  const currentActive = selectedSection ?? activeSection;
  const isActive = currentActive === 'features';

  const featTitle = canvasLang === 'ar' 
    ? 'الميزات البارزة' 
    : (canvasLang === 'en' ? 'Highlighted Features' : 'Öne Çıkan Özellikler');

  return (
    <section
      role="button"
      tabIndex={0}
      onClick={() => onSelectSection('features')}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectSection('features'); }}
      className={`studio-clickable-section ${isActive ? 'active' : ''}`}
      style={{
        padding: '16px',
        borderRadius: '14px',
        position: 'relative',
        cursor: 'pointer',
        marginTop: '10px',
      }}
      title="Öne çıkan özellik kartlarını eklemek, silmek ve 3 dilde düzenlemek için tıklayın"
    >
      <span className="studio-section-badge">
        <Edit2 size={12} />
        <span>Özellik Kartları ({featureCards.length})</span>
      </span>

      <div style={{
        fontSize: '1.25rem',
        fontWeight: 700,
        marginBottom: '1rem',
        color: 'var(--text-main, #0f172a)',
        borderBottom: '2px solid var(--border-color, #e2e8f0)',
        paddingBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>{featTitle}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary, #2563eb)', fontWeight: 600 }}>
          {featureCards.length} Kart
        </span>
      </div>

      {featureCards.length === 0 ? (
        <div style={{
          padding: '32px',
          textAlign: 'center',
          background: 'var(--bg-surface, #f8fafc)',
          borderRadius: '12px',
          border: '1px dashed var(--border-color, #cbd5e1)',
          color: 'var(--text-muted, #64748b)',
        }}>
          <Sparkles size={28} style={{ margin: '0 auto 8px', color: '#f59e0b' }} />
          <p style={{ margin: '0 0 8px', fontSize: '0.9rem', fontWeight: 600 }}>Henüz özellik kartı eklenmemiş.</p>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary, #2563eb)' }}>
            Kart eklemek ve AI ile çevirmek için buraya tıklayın.
          </span>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px',
        }}>
          {featureCards.map((card, idx) => {
            const title = canvasLang === 'ar'
              ? (card.title_ar || card.title_tr)
              : (canvasLang === 'en' ? (card.title_en || card.title_tr) : card.title_tr);

            const desc = canvasLang === 'ar'
              ? (card.description_ar || card.description_tr)
              : (canvasLang === 'en' ? (card.description_en || card.description_tr) : card.description_tr);

            return (
              <div
                key={card.id || idx}
                style={{
                  background: 'var(--bg-surface, #f8fafc)',
                  border: '1px solid var(--border-color, #e2e8f0)',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <h4 style={{
                  margin: '0 0 8px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-main, #0f172a)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>{card.icon || '⭐'}</span>
                  <span>{title || 'Özellik Başlığı'}</span>
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '0.88rem',
                  color: 'var(--text-muted, #475569)',
                  lineHeight: 1.5,
                }}>
                  {desc || 'Özellik açıklaması girilmemiş.'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
