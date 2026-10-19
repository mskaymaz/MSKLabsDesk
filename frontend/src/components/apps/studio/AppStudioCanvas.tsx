import React from 'react';
import type { AppItem } from '../../../types';
import type { CanvasLang, StudioSectionType } from './types';
import { AppStudioHeaderSection } from './AppStudioHeaderSection';
import { AppStudioFeaturesSection } from './AppStudioFeaturesSection';
import { AppStudioDownloadsSection } from './AppStudioDownloadsSection';

interface AppStudioCanvasProps {
  app: AppItem;
  canvasLang: CanvasLang;
  selectedSection: StudioSectionType | null;
  onSelectSection: (section: StudioSectionType) => void;
  onBackToCatalog: () => void;
}

export const AppStudioCanvas: React.FC<AppStudioCanvasProps> = ({
  app,
  canvasLang,
  selectedSection,
  onSelectSection,
  onBackToCatalog,
}) => {
  const isRtl = canvasLang === 'ar';

  // Seçilen dile göre metin çözümleyici
  const getAppDesc = (): string => {
    if (canvasLang === 'ar') return app.description_ar || app.description_tr || '';
    if (canvasLang === 'en') return app.description_en || app.description_tr || '';
    return app.description_tr || '';
  };

  const backBtnText = canvasLang === 'ar' 
    ? '← العودة إلى صفحة تطبيقاتنا' 
    : (canvasLang === 'en' ? '← Back to Our Apps Page' : '← Uygulamalarımız Sayfasına Dön');

  const descSectionTitle = canvasLang === 'ar' ? 'حول التطبيق' : (canvasLang === 'en' ? 'About Application' : 'Uygulama Hakkında');
  const isDescSelected = selectedSection === 'description';

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950/70 p-4 sm:p-6 lg:p-8">
      {/* Tuval Konteyneri - Vitrin Birebir Genişliği ve Stili */}
      <div 
        dir={isRtl ? 'rtl' : 'ltr'} 
        className={`max-w-4xl mx-auto space-y-6 transition-all ${
          isRtl ? 'font-arabic' : 'font-sans'
        }`}
      >
        {/* Hızlı Geri Dön Butonu - 20px Üst Boşluk Kuralı */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white transition shadow-sm"
          >
            {backBtnText}
          </button>
        </div>

        {/* 1. Üst Başlık & Kahraman Bölümü */}
        <AppStudioHeaderSection
          app={app}
          canvasLang={canvasLang}
          selectedSection={selectedSection}
          onSelectSection={onSelectSection}
        />

        {/* 2. Açıklama & Tanıtım Bölümü (Tıklanabilir Alan) */}
        <section
          onClick={() => onSelectSection('description')}
          className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer group bg-slate-900/60 backdrop-blur-sm ${
            isDescSelected
              ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20'
              : 'border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900/80'
          }`}
        >
          {/* Düzenleme Rozeti */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500/25 transition">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Açıklama Metni</span>
          </div>

          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-2">
            <span>📝</span> {descSectionTitle}
          </h3>

          <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
            {getAppDesc() ? (
              getAppDesc()
            ) : (
              <span className="text-slate-500 italic">
                {canvasLang === 'ar' 
                  ? 'لا يوجد وصف متاح بهذه اللغة حتى الآن. انقر هنا لإضافة وصف.' 
                  : (canvasLang === 'en' 
                    ? 'No description available in this language yet. Click to add one.' 
                    : 'Bu dilde henüz bir açıklama girilmemiş. Eklemek için tıklayın.')}
              </span>
            )}
          </div>
        </section>

        {/* 3. Öne Çıkan Özellikler Bölümü */}
        <AppStudioFeaturesSection
          featureCards={app.feature_cards || []}
          canvasLang={canvasLang}
          selectedSection={selectedSection}
          onSelectSection={onSelectSection}
        />

        {/* 4. İndirme ve Mağaza Kanalları Bölümü */}
        <AppStudioDownloadsSection
          storeLinks={app.store_links || {}}
          canvasLang={canvasLang}
          selectedSection={selectedSection}
          onSelectSection={onSelectSection}
        />
      </div>
    </div>
  );
};
