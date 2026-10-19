import React from 'react';
import { ArrowLeft, Save, ExternalLink, Globe } from 'lucide-react';
import type { CanvasLang } from './types';
import type { AppItem } from '../../../types';

interface AppStudioTopBarProps {
  app: AppItem;
  canvasLang: CanvasLang;
  onLanguageChange: (lang: CanvasLang) => void;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  isDirty: boolean;
}

export const AppStudioTopBar: React.FC<AppStudioTopBarProps> = ({
  app,
  canvasLang,
  onLanguageChange,
  onBack,
  onSave,
  isSaving,
  isDirty,
}) => {
  const previewUrl = `http://localhost:5174/app.html?id=${encodeURIComponent(app.app_id || app.id)}`;

  return (
    <header className="app-studio-topbar" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 20px',
      background: 'var(--bg-card, #1e293b)',
      borderBottom: '1px solid var(--border-color, #334155)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: '16px',
      flexWrap: 'wrap',
    }}>
      {/* Sol: Geri Dön & Uygulama Başlığı */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          onClick={onBack}
          className="admin-btn admin-btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          title="Uygulama listesine dön"
        >
          <ArrowLeft size={16} />
          <span>Kataloğa Dön</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong style={{ fontSize: '1rem', color: 'var(--text-main, #f8fafc)' }}>
            {app.name_tr || 'Uygulama Detay Stüdyosu'}
          </strong>
          <span className="admin-badge admin-badge-view" style={{ fontSize: '0.72rem' }}>
            {app.app_id}
          </span>
          {isDirty && (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.74rem',
              color: '#f59e0b',
              fontWeight: 600,
            }}>
              ● Kaydedilmemiş Değişiklikler
            </span>
          )}
        </div>
      </div>

      {/* Orta: Canlı Tuval Dil Anahtarı (TR | EN | AR Yalın Standart) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Globe size={14} />
          <span>Tuval Dili:</span>
        </span>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(0, 0, 0, 0.25)',
          borderRadius: '8px',
          padding: '3px',
          border: '1px solid var(--border-subtle, #334155)',
        }}>
          {(['tr', 'en', 'ar'] as CanvasLang[]).map((lang) => {
            const isActive = canvasLang === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                style={{
                  padding: '4px 12px',
                  fontSize: '0.78rem',
                  fontWeight: isActive ? 700 : 500,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: isActive ? 'var(--accent-primary, #2563eb)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted, #94a3b8)',
                  transition: 'all 0.15s ease',
                  textTransform: 'uppercase',
                }}
              >
                {lang.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sağ: Vitrin Önizleme & Kaydet */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="admin-btn admin-btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
          title="Kullanıcı vitrininde canlı önizle"
        >
          <ExternalLink size={15} />
          <span>Vitrinde Gör</span>
        </a>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="admin-btn admin-btn-sm admin-btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: isDirty ? '#10b981' : undefined,
            borderColor: isDirty ? '#10b981' : undefined,
            cursor: isSaving || !isDirty ? 'not-allowed' : 'pointer',
            opacity: !isDirty ? 0.6 : 1,
          }}
          title={isDirty ? 'Değişiklikleri veritabanına kaydet' : 'Değişiklik bulunmuyor'}
        >
          <Save size={15} />
          <span>{isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
        </button>
      </div>
    </header>
  );
};
