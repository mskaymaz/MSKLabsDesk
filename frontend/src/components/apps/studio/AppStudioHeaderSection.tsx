import React from 'react';
import { Edit2 } from 'lucide-react';
import type { AppItem } from '../../../types';
import type { CanvasLang, StudioSectionType } from './types';

interface AppStudioHeaderSectionProps {
  app: AppItem;
  canvasLang: CanvasLang;
  onSelectSection: (section: StudioSectionType) => void;
}

export const AppStudioHeaderSection: React.FC<AppStudioHeaderSectionProps> = ({
  app,
  canvasLang,
  onSelectSection,
}) => {
  const isAr = canvasLang === 'ar';
  const isEn = canvasLang === 'en';

  // Seçili dile göre isim
  const appName = isAr
    ? (app.name_ar || app.name_tr)
    : (isEn ? (app.name_en || app.name_tr) : app.name_tr);

  // Dil paneli metinleri
  const langLabel = isAr ? 'حالة اللغة:' : (isEn ? 'Language Status:' : 'Dil Durumu:');
  const langActiveText = isAr ? 'نشط' : (isEn ? 'Active' : 'Aktif');
  const dlBtnText = isAr ? 'تنزيل التطبيق' : (isEn ? 'Download App' : 'Uygulamayı İndir');
  const guideBtnText = isAr ? 'دليل الاستخدام (PDF)' : (isEn ? 'User Guide (PDF)' : 'Kullanım Kılavuzu İndir');

  const guideUrl = app.guide_url || app.store_links?.guide_url;

  return (
    <div className="studio-app-header">
      {/* 1. Sol Başlık ve İkon Bölgesi (Tıklanabilir) */}
      <div 
        className="studio-app-header-left studio-editable-zone"
        onClick={() => onSelectSection('header')}
        title="Başlık ve ikonu düzenlemek için tıklayın"
      >
        <div className="studio-edit-badge">
          <Edit2 size={12} />
          <span>Başlık & İkon</span>
        </div>

        <div className="studio-big-icon">
          {app.icon_url ? (
            <img src={app.icon_url} alt={appName} onError={(e) => { (e.target as any).style.display = 'none'; }} />
          ) : (
            <span>📱</span>
          )}
        </div>

        <div className="studio-title-group">
          <h1>{appName || 'Uygulama Adı'}</h1>
          <div className="studio-badges">
            <span className="studio-badge studio-badge-platform">
              {app.platform || 'Android'}
            </span>
            <span className="studio-badge studio-badge-status">
              {app.category || 'Mobil'}
            </span>
            {app.status === 'in_development' && (
              <span className="studio-badge" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d' }}>
                Geliştiriliyor
              </span>
            )}
            {app.status === 'planned' && (
              <span className="studio-badge" style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#cbd5e1' }}>
                Planlanıyor
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Sağ Dil ve Kılavuz Paneli (Tıklanabilir) */}
      <div 
        className="studio-header-right studio-editable-zone"
        onClick={() => onSelectSection('guide')}
        title="Kılavuz ve indirme butonunu düzenlemek için tıklayın"
        style={{ padding: '4px 6px' }}
      >
        <div className="studio-edit-badge">
          <Edit2 size={12} />
          <span>Kılavuz & İndirme</span>
        </div>

        <div className="studio-status-panel">
          <span>🌐 {langLabel} <strong className="studio-status-tag">TR ({langActiveText})</strong></span>
        </div>

        <a 
          href="#download-section" 
          onClick={(e) => {
            e.stopPropagation();
            const target = document.getElementById('download-section');
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="studio-hero-download-btn"
        >
          <span>{dlBtnText}</span>
        </a>

        <div className="studio-hero-guide-btn" title={guideBtnText}>
          <span>📖 {guideBtnText}</span>
          {!guideUrl && <small style={{ opacity: 0.6, fontSize: '10px' }}>(Yakında)</small>}
        </div>
      </div>
    </div>
  );
};
