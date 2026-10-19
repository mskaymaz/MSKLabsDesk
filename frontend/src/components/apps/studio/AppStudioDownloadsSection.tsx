import React from 'react';
import type { AppStoreLinks } from '../../../types';
import type { CanvasLang, StudioSectionType } from './types';

interface AppStudioDownloadsSectionProps {
  storeLinks: AppStoreLinks;
  canvasLang: CanvasLang;
  selectedSection: StudioSectionType | null;
  onSelectSection: (section: StudioSectionType) => void;
}

export const AppStudioDownloadsSection: React.FC<AppStudioDownloadsSectionProps> = ({
  storeLinks,
  canvasLang,
  selectedSection,
  onSelectSection,
}) => {
  const isSelected = selectedSection === 'store_links';

  // Çok dilli etiketler
  const sectionTitle = canvasLang === 'ar' ? 'خيارات التنزيل والمتاجر' : (canvasLang === 'en' ? 'Download Options & Stores' : 'İndirme Seçenekleri ve Mağazalar');
  const sectionSub = canvasLang === 'ar' ? 'احصل على التطبيق مباشرة عبر القنوات الرسمية:' : (canvasLang === 'en' ? 'Get the app directly through official channels:' : 'Uygulamayı resmi kanallar üzerinden doğrudan temin edin:');
  const appleNoteText = canvasLang === 'ar' 
    ? 'غير متوفر حالياً بسبب الإجراءات المعقدة والصارمة لشركة Apple.' 
    : (canvasLang === 'en' 
      ? "Not available yet due to Apple's strict and irrational store policies." 
      : "Apple'a ait katı ve anlamsız prosedürler gereği henüz hazırlanamıyor.");

  const tagVisit = canvasLang === 'ar' ? 'انتقل إلى المتجر' : (canvasLang === 'en' ? 'Visit Store' : 'Mağazaya Git');
  const tagDirect = canvasLang === 'ar' ? 'تنزيل مباشر' : (canvasLang === 'en' ? 'Direct Download' : 'Doğrudan İndir');
  const tagSoon = canvasLang === 'ar' ? 'قيد التحضير' : (canvasLang === 'en' ? 'In Progress' : 'Hazırlanıyor');

  return (
    <section
      id="download-section"
      onClick={() => onSelectSection('store_links')}
      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer group bg-slate-900/60 backdrop-blur-sm ${
        isSelected
          ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20'
          : 'border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900/80'
      }`}
    >
      {/* Düzenleme Rozeti */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 group-hover:bg-emerald-500/25 transition">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <span>Mağaza Bağlantıları</span>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <span>📥</span> {sectionTitle}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{sectionSub}</p>
      </div>

      {/* İndirme Kartları Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* 1. Google Play */}
        {storeLinks.google_play ? (
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xl">▶️</span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Google Play</h4>
                <p className="text-[11px] text-slate-400">Play Store</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
              ⚡ {tagVisit}
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 opacity-70 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xl opacity-60">▶️</span>
              <div>
                <h4 className="text-xs font-bold text-slate-400">Google Play</h4>
                <p className="text-[11px] text-slate-500">{tagSoon}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-400">
              🛠️ {tagSoon}
            </span>
          </div>
        )}

        {/* 2. GitHub Doğrudan APK */}
        {storeLinks.github ? (
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xl">🐙</span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">GitHub (APK)</h4>
                <p className="text-[11px] text-slate-400">Android APK</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
              ⚡ {tagDirect}
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/40 opacity-70 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xl opacity-60">🐙</span>
              <div>
                <h4 className="text-xs font-bold text-slate-400">GitHub (APK)</h4>
                <p className="text-[11px] text-slate-500">{tagSoon}</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-400">
              🛠️ {tagSoon}
            </span>
          </div>
        )}

        {/* 3. Google Drive Doğrudan APK */}
        {storeLinks.google_drive ? (
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xl">📁</span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Google Drive (APK)</h4>
                <p className="text-[11px] text-slate-400">Alternatif APK</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
              ⚡ {tagDirect}
            </span>
          </div>
        ) : null}

        {/* 4. Apple App Store (Özel Prosedür Notu) */}
        {storeLinks.app_store ? (
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <svg className="w-5 h-5 text-slate-200" viewBox="0 0 170 170" fill="currentColor">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.31-7.15-10.88-12.77-23.71-16.86-38.51-4.09-14.8-6.13-28.79-6.13-41.97 0-17.18 4.35-31.51 13.06-43 8.71-11.49 19.82-17.38 33.34-17.67 4.58 0 9.85 1.25 15.82 3.75 5.97 2.5 10.14 3.75 12.51 3.75 2.16 0 6.47-1.31 12.93-3.92 6.46-2.61 11.83-3.81 16.12-3.6 12.01.63 21.84 5.38 29.49 14.25-10.45 6.32-15.56 15.16-15.34 26.52.22 9.03 3.65 16.59 10.3 22.68 6.64 6.09 14.54 9.64 23.68 10.66-2.52 7.74-5.69 15.39-9.51 22.95zm-33.32-113.88c0 7.39-2.73 14.37-8.19 20.94-5.46 6.57-12.09 10.59-19.89 12.06-.44-1.32-.66-2.6-.66-3.84 0-7.39 2.87-14.39 8.61-21 5.74-6.61 12.44-10.63 20.13-12.06z"/>
              </svg>
              <div>
                <h4 className="text-xs font-bold text-slate-200">App Store</h4>
                <p className="text-[11px] text-slate-400">iOS Sürümü</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
              ⚡ {tagVisit}
            </span>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl border border-amber-900/40 bg-amber-950/10 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <svg className="w-5 h-5 text-amber-400/80" viewBox="0 0 170 170" fill="currentColor">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.31-7.15-10.88-12.77-23.71-16.86-38.51-4.09-14.8-6.13-28.79-6.13-41.97 0-17.18 4.35-31.51 13.06-43 8.71-11.49 19.82-17.38 33.34-17.67 4.58 0 9.85 1.25 15.82 3.75 5.97 2.5 10.14 3.75 12.51 3.75 2.16 0 6.47-1.31 12.93-3.92 6.46-2.61 11.83-3.81 16.12-3.6 12.01.63 21.84 5.38 29.49 14.25-10.45 6.32-15.56 15.16-15.34 26.52.22 9.03 3.65 16.59 10.3 22.68 6.64 6.09 14.54 9.64 23.68 10.66-2.52 7.74-5.69 15.39-9.51 22.95zm-33.32-113.88c0 7.39-2.73 14.37-8.19 20.94-5.46 6.57-12.09 10.59-19.89 12.06-.44-1.32-.66-2.6-.66-3.84 0-7.39 2.87-14.39 8.61-21 5.74-6.61 12.44-10.63 20.13-12.06z"/>
              </svg>
              <div>
                <h4 className="text-xs font-bold text-amber-300">App Store</h4>
                <p className="text-[11px] text-amber-400/80">iOS Sürümü</p>
              </div>
            </div>
            <p className="text-[11px] text-amber-200/70 leading-relaxed mt-1">
              {appleNoteText}
            </p>
          </div>
        )}

        {/* 5. Web / PWA Sürümü */}
        {storeLinks.web_url ? (
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xl">🌐</span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Web / PWA</h4>
                <p className="text-[11px] text-slate-400">Tarayıcıda Çalıştır</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
              ⚡ {tagVisit}
            </span>
          </div>
        ) : null}

        {/* 6. Windows Store Sürümü */}
        {storeLinks.windows_store ? (
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xl">🪟</span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Windows Store</h4>
                <p className="text-[11px] text-slate-400">Masaüstü Uygulaması</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
              ⚡ {tagVisit}
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
};
