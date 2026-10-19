import React from 'react';
import { Edit2 } from 'lucide-react';
import type { AppItem } from '../../../types';
import type { CanvasLang, StudioSectionType } from './types';
import { AppStudioHeaderSection } from './AppStudioHeaderSection';
import { AppStudioFeaturesSection } from './AppStudioFeaturesSection';
import { AppStudioDownloadsSection } from './AppStudioDownloadsSection';

interface AppStudioCanvasProps {
  app: AppItem;
  canvasLang: CanvasLang;
  onSelectSection: (section: StudioSectionType) => void;
  onBackToCatalog: () => void;
}

export const AppStudioCanvas: React.FC<AppStudioCanvasProps> = ({
  app,
  canvasLang,
  onSelectSection,
  onBackToCatalog,
}) => {
  const isAr = canvasLang === 'ar';
  const isEn = canvasLang === 'en';

  const desc = isAr
    ? (app.description_ar || app.description_tr)
    : (isEn ? (app.description_en || app.description_tr) : (app.description_tr || app.description));

  const backBtnText = isAr
    ? '‹ العودة إلى صفحة تطبيقاتنا'
    : (isEn ? '‹ Back to Our Apps Page' : '‹ Uygulamalarımız Sayfasına Dön');

  return (
    <div className="app-studio-canvas-area">
      <div 
        dir={isAr ? 'rtl' : 'ltr'} 
        className="app-studio-container"
      >
        {/* Hızlı Dönüş Butonu (Vitrindeki 20px Boşluk) */}
        <div style={{ marginBottom: '14px' }}>
          <button
            type="button"
            onClick={onBackToCatalog}
            className="studio-btn studio-btn-subtle"
            style={{ fontSize: '0.78rem', padding: '4px 10px' }}
          >
            {backBtnText}
          </button>
        </div>

        {/* Vitrin Kahraman Kartı */}
        <div className="studio-hero-card">
          {/* 1. Başlık & İkon & Sağ Dil/Kılavuz Paneli */}
          <AppStudioHeaderSection
            app={app}
            canvasLang={canvasLang}
            onSelectSection={onSelectSection}
          />

          {/* 2. Açıklama Bölümü (Tıklanabilir) */}
          <div 
            className="studio-editable-zone"
            onClick={() => onSelectSection('description')}
            title="Açıklama metnini düzenlemek için tıklayın"
            style={{ padding: '8px 10px', marginTop: '10px' }}
          >
            <div className="studio-edit-badge">
              <Edit2 size={12} />
              <span>Açıklama Metni</span>
            </div>

            <div className="studio-app-description">
              {desc ? (
                desc
              ) : (
                <span style={{ color: '#64748b', fontStyle: 'italic' }}>
                  {isAr 
                    ? 'انقر هنا لإضافة وصف التطبيق باللغة العربية...' 
                    : (isEn 
                      ? 'Click here to add application description in English...' 
                      : 'Uygulama açıklama metnini girmek için buraya tıklayın...')}
                </span>
              )}
            </div>
          </div>

          {/* 3. Öne Çıkan Özellikler Bölümü */}
          <AppStudioFeaturesSection
            featureCards={app.feature_cards || []}
            canvasLang={canvasLang}
            onSelectSection={onSelectSection}
          />

          {/* 4. İndirme Kanalları Bölümü */}
          <AppStudioDownloadsSection
            storeLinks={app.store_links || {}}
            canvasLang={canvasLang}
            onSelectSection={onSelectSection}
          />
        </div>
      </div>
    </div>
  );
};
