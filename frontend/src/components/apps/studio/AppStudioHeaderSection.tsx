import React from 'react';
import { Edit2, Smartphone, BookOpen, Download } from 'lucide-react';
import type { AppItem } from '../../../types';
import type { CanvasLang, StudioSectionType } from './types';

interface AppStudioHeaderSectionProps {
  app: AppItem;
  canvasLang: CanvasLang;
  activeSection?: StudioSectionType | null;
  selectedSection?: StudioSectionType | null;
  onSelectSection: (section: StudioSectionType) => void;
}

export const AppStudioHeaderSection: React.FC<AppStudioHeaderSectionProps> = ({
  app,
  canvasLang,
  activeSection,
  selectedSection,
  onSelectSection,
}) => {
  const currentActive = selectedSection ?? activeSection;
  const isHeaderActive = currentActive === 'header';
  const isGuideActive = currentActive === 'guide';

  // Dinamik dil metinleri
  const appName = canvasLang === 'ar' 
    ? (app.name_ar || app.name_tr) 
    : (canvasLang === 'en' ? (app.name_en || app.name_tr) : app.name_tr);

  const categories = (app.category || 'utility').split(',').map((c) => c.trim()).filter(Boolean);

  const formatPlatform = (p?: string) => {
    if (!p || p === 'all') return canvasLang === 'ar' ? 'جميع المنصات' : (canvasLang === 'en' ? 'All Platforms' : 'Tüm Platformlar');
    if (p === 'mobile') return canvasLang === 'ar' ? 'الهاتف' : (canvasLang === 'en' ? 'Mobile' : 'Mobil');
    if (p === 'desktop') return canvasLang === 'ar' ? 'سطح المكتب' : (canvasLang === 'en' ? 'Desktop' : 'Masaüstü');
    if (p === 'web') return 'Web';
    return p.toUpperCase();
  };

  const dlBtnText = canvasLang === 'ar' ? 'تنزيل التطبيق' : (canvasLang === 'en' ? 'Download App' : 'Uygulamayı İndir');
  const guideBtnText = canvasLang === 'ar' ? 'دليل الاستخدام (PDF)' : (canvasLang === 'en' ? 'User Guide (PDF)' : 'Kullanım Kılavuzu İndir');

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
      
      {/* Sol: İkon, İsim, Rozetler (Tıklanabilir Başlık Bölümü) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectSection('header')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectSection('header'); }}
        className={`studio-clickable-section ${isHeaderActive ? 'active' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flex: 1,
          minWidth: '280px',
          padding: '12px',
          borderRadius: '14px',
          position: 'relative',
          cursor: 'pointer',
        }}
        title="Başlık, İkon, Kategori ve Platform bilgilerini düzenlemek için tıklayın"
      >
        <span className="studio-section-badge">
          <Edit2 size={12} />
          <span>Başlık & İkon</span>
        </span>

        {/* 125px Büyük İkon */}
        <div style={{
          width: '125px',
          height: '125px',
          borderRadius: '24px',
          background: 'var(--bg-surface, #f1f5f9)',
          border: '1px solid var(--border-color, #e2e8f0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          padding: '8px',
          boxSizing: 'border-box',
          boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
        }}>
          {app.icon_url ? (
            <img
              src={app.icon_url.startsWith('/media/') ? `https://msklabs.org${app.icon_url}` : app.icon_url}
              alt={appName}
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '18px' }}
            />
          ) : (
            <Smartphone size={56} style={{ color: 'var(--accent-primary, #2563eb)' }} />
          )}
        </div>

        {/* Başlık ve Rozetler Grubu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{
            fontSize: '1.85rem',
            fontWeight: 700,
            margin: 0,
            color: 'var(--text-main, #0f172a)',
            lineHeight: 1.2,
          }}>
            {appName || 'Uygulama Adı'}
          </h1>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '20px',
              background: '#eef2ff',
              color: '#2563eb',
              border: '1px solid #cbd5e1',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              📱 {formatPlatform(app.platform)}
            </span>

            <span style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '20px',
              background: '#fffbeb',
              color: '#b45309',
              border: '1px solid #fef3c7',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              🛠️ {canvasLang === 'ar' ? 'التطوير قيد التقدم' : (canvasLang === 'en' ? 'Development In Progress' : 'Geliştirme Devam Ediyor')}
            </span>

            {categories.map((cat) => (
              <span key={cat} style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'var(--bg-surface, #f8fafc)',
                color: 'var(--text-muted, #64748b)',
                border: '1px solid var(--border-color, #cbd5e1)',
              }}>
                🏷️ {cat}
              </span>
            ))}

            <span style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'var(--bg-surface, #f8fafc)',
              color: '#2563eb',
              border: '1px solid var(--border-color, #cbd5e1)',
            }}>
              v{app.latest_version || '1.0.0'}
            </span>
          </div>
        </div>
      </div>

      {/* Sağ: Dil Durumu, İndir ve Kılavuz Paneli (%15-20 Küçültülmüş) */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectSection('guide')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectSection('guide'); }}
        className={`studio-clickable-section ${isGuideActive ? 'active' : ''}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '5px',
          padding: '10px 14px',
          borderRadius: '12px',
          position: 'relative',
          cursor: 'pointer',
        }}
        title="Kullanım Kılavuzu PDF ve İndirme linklerini düzenlemek için tıklayın"
      >
        <span className="studio-section-badge">
          <Edit2 size={12} />
          <span>Kılavuz & İndirme</span>
        </span>

        {/* Dil Durumu Rozeti */}
        <div style={{
          background: 'var(--bg-surface, #f8fafc)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '8px',
          padding: '5px 10px',
          fontSize: '0.74rem',
          color: 'var(--text-main, #0f172a)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <span>🌐 {canvasLang === 'ar' ? 'حالة اللغة:' : (canvasLang === 'en' ? 'Language Status:' : 'Dil Durumu:')}</span>
          <strong style={{
            background: '#dbeafe',
            color: '#1d4ed8',
            padding: '1px 6px',
            fontSize: '0.72rem',
            borderRadius: '5px',
            fontWeight: 700,
          }}>
            TR ({canvasLang === 'ar' ? 'نشط' : (canvasLang === 'en' ? 'Active' : 'Aktif')})
          </strong>
        </div>

        {/* Hızlı İndir Butonu (%20 Küçültülmüş) */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#16a34a',
          color: '#ffffff',
          padding: '6px 16px',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.78rem',
          marginTop: '4px',
          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
          gap: '5px',
        }}>
          <Download size={13} />
          <span>{dlBtnText}</span>
        </div>

        {/* Kullanım Kılavuzu İndir Butonu (%20 Küçültülmüş) */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
          background: 'var(--bg-surface, #f8fafc)',
          color: 'var(--text-main, #334155)',
          border: '1px solid var(--border-color, #cbd5e1)',
          padding: '5px 14px',
          borderRadius: '8px',
          fontWeight: 600,
          fontSize: '0.76rem',
          marginTop: '2px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
        }}>
          <BookOpen size={13} />
          <span>📖 {guideBtnText}</span>
        </div>
      </div>

    </div>
  );
};
