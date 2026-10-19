import React from 'react';
import { Edit2 } from 'lucide-react';
import type { AppStoreLinks } from '../../../types';
import type { CanvasLang, StudioSectionType } from './types';

interface AppStudioDownloadsSectionProps {
  storeLinks: AppStoreLinks;
  canvasLang: CanvasLang;
  onSelectSection: (section: StudioSectionType) => void;
}

export const AppStudioDownloadsSection: React.FC<AppStudioDownloadsSectionProps> = ({
  storeLinks,
  canvasLang,
  onSelectSection,
}) => {
  const isAr = canvasLang === 'ar';
  const isEn = canvasLang === 'en';

  const sectionTitle = isAr ? 'خيارات التنزيل والمتاجر' : (isEn ? 'Download Options & Stores' : 'İndirme Seçenekleri ve Mağazalar');
  const tagVisit = isAr ? 'انتقل إلى المتجر' : (isEn ? 'Visit Store' : 'Mağazaya Git');
  const tagDirect = isAr ? 'تنزيل مباشر' : (isEn ? 'Direct Download' : 'Doğrudan İndir');
  const tagSoon = isAr ? 'قيد التحضير' : (isEn ? 'In Progress' : 'Hazırlanıyor');

  const appleNoteText = isAr
    ? 'غير متوفر حالياً بسبب الإجراءات المعقدة والصارمة لشركة Apple.'
    : (isEn
      ? "Not available yet due to Apple's strict and irrational store policies."
      : "Apple'a ait katı ve anlamsız prosedürler gereği henüz hazırlanamıyor.");

  return (
    <div 
      id="download-section"
      className="studio-download-section studio-editable-zone"
      onClick={() => onSelectSection('store_links')}
      title="Mağaza ve indirme linklerini düzenlemek için tıklayın"
      style={{ padding: '8px 10px' }}
    >
      <div className="studio-edit-badge">
        <Edit2 size={12} />
        <span>Mağaza Bağlantıları</span>
      </div>

      <div className="studio-download-title">
        <span>📥</span> {sectionTitle}
      </div>

      <div className="studio-download-grid">
        {/* 1. Google Play */}
        {storeLinks.google_play ? (
          <div className="studio-download-card">
            <div className="studio-download-card-header">
              <span style={{ fontSize: '1.25rem' }}>▶️</span>
              <div>
                <div className="studio-download-card-title">Google Play</div>
                <div className="studio-download-card-status">Play Store</div>
              </div>
            </div>
            <span className="studio-download-tag tag-active">⚡ {tagVisit}</span>
          </div>
        ) : (
          <div className="studio-download-card disabled">
            <div className="studio-download-card-header">
              <span style={{ fontSize: '1.25rem', opacity: 0.6 }}>▶️</span>
              <div>
                <div className="studio-download-card-title">Google Play</div>
                <div className="studio-download-card-status">{tagSoon}</div>
              </div>
            </div>
            <span className="studio-download-tag tag-soon">🛠️ {tagSoon}</span>
          </div>
        )}

        {/* 2. GitHub Doğrudan APK */}
        {storeLinks.github ? (
          <div className="studio-download-card">
            <div className="studio-download-card-header">
              <span style={{ fontSize: '1.25rem' }}>🐙</span>
              <div>
                <div className="studio-download-card-title">GitHub (APK)</div>
                <div className="studio-download-card-status">Doğrudan APK</div>
              </div>
            </div>
            <span className="studio-download-tag tag-active">⚡ {tagDirect}</span>
          </div>
        ) : (
          <div className="studio-download-card disabled">
            <div className="studio-download-card-header">
              <span style={{ fontSize: '1.25rem', opacity: 0.6 }}>🐙</span>
              <div>
                <div className="studio-download-card-title">GitHub (APK)</div>
                <div className="studio-download-card-status">{tagSoon}</div>
              </div>
            </div>
            <span className="studio-download-tag tag-soon">🛠️ {tagSoon}</span>
          </div>
        )}

        {/* 3. Google Drive APK */}
        {storeLinks.google_drive ? (
          <div className="studio-download-card">
            <div className="studio-download-card-header">
              <span style={{ fontSize: '1.25rem' }}>📁</span>
              <div>
                <div className="studio-download-card-title">Google Drive (APK)</div>
                <div className="studio-download-card-status">Alternatif İndirme</div>
              </div>
            </div>
            <span className="studio-download-tag tag-active">⚡ {tagDirect}</span>
          </div>
        ) : null}

        {/* 4. Apple App Store */}
        {storeLinks.app_store ? (
          <div className="studio-download-card">
            <div className="studio-download-card-header">
              <svg style={{ width: '20px', height: '20px', fill: 'currentColor' }} viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.31-7.15-10.88-12.77-23.71-16.86-38.51-4.09-14.8-6.13-28.79-6.13-41.97 0-17.18 4.35-31.51 13.06-43 8.71-11.49 19.82-17.38 33.34-17.67 4.58 0 9.85 1.25 15.82 3.75 5.97 2.5 10.14 3.75 12.51 3.75 2.16 0 6.47-1.31 12.93-3.92 6.46-2.61 11.83-3.81 16.12-3.6 12.01.63 21.84 5.38 29.49 14.25-10.45 6.32-15.56 15.16-15.34 26.52.22 9.03 3.65 16.59 10.3 22.68 6.64 6.09 14.54 9.64 23.68 10.66-2.52 7.74-5.69 15.39-9.51 22.95zm-33.32-113.88c0 7.39-2.73 14.37-8.19 20.94-5.46 6.57-12.09 10.59-19.89 12.06-.44-1.32-.66-2.6-.66-3.84 0-7.39 2.87-14.39 8.61-21 5.74-6.61 12.44-10.63 20.13-12.06z"/>
              </svg>
              <div>
                <div className="studio-download-card-title">App Store</div>
                <div className="studio-download-card-status">iOS Sürümü</div>
              </div>
            </div>
            <span className="studio-download-tag tag-active">⚡ {tagVisit}</span>
          </div>
        ) : (
          <div className="studio-download-card disabled" style={{ background: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>
            <div className="studio-download-card-header">
              <svg style={{ width: '20px', height: '20px', fill: '#f59e0b' }} viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.31-7.15-10.88-12.77-23.71-16.86-38.51-4.09-14.8-6.13-28.79-6.13-41.97 0-17.18 4.35-31.51 13.06-43 8.71-11.49 19.82-17.38 33.34-17.67 4.58 0 9.85 1.25 15.82 3.75 5.97 2.5 10.14 3.75 12.51 3.75 2.16 0 6.47-1.31 12.93-3.92 6.46-2.61 11.83-3.81 16.12-3.6 12.01.63 21.84 5.38 29.49 14.25-10.45 6.32-15.56 15.16-15.34 26.52.22 9.03 3.65 16.59 10.3 22.68 6.64 6.09 14.54 9.64 23.68 10.66-2.52 7.74-5.69 15.39-9.51 22.95zm-33.32-113.88c0 7.39-2.73 14.37-8.19 20.94-5.46 6.57-12.09 10.59-19.89 12.06-.44-1.32-.66-2.6-.66-3.84 0-7.39 2.87-14.39 8.61-21 5.74-6.61 12.44-10.63 20.13-12.06z"/>
              </svg>
              <div>
                <div className="studio-download-card-title" style={{ color: '#fcd34d' }}>App Store</div>
                <div className="studio-download-card-status" style={{ color: '#f59e0b' }}>iOS Sürümü</div>
              </div>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#fde68a', lineHeight: 1.4, marginTop: '2px' }}>
              {appleNoteText}
            </div>
          </div>
        )}

        {/* 5. Web / PWA */}
        {storeLinks.web_url ? (
          <div className="studio-download-card">
            <div className="studio-download-card-header">
              <span style={{ fontSize: '1.25rem' }}>🌐</span>
              <div>
                <div className="studio-download-card-title">Web / PWA</div>
                <div className="studio-download-card-status">Tarayıcıda Aç</div>
              </div>
            </div>
            <span className="studio-download-tag tag-active">⚡ {tagVisit}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
