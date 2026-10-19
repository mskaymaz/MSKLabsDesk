import React from 'react';
import { ArrowLeft, Save, ExternalLink } from 'lucide-react';
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
  const previewSlug = app.slug || app.app_id || app.id;
  const previewUrl = `http://localhost:5174/app.html?id=${encodeURIComponent(previewSlug)}`;

  return (
    <header className="app-studio-bar">
      {/* Sol: Geri Dönüş ve Uygulama Bilgisi */}
      <div className="studio-bar-left">
        <button
          type="button"
          onClick={onBack}
          className="studio-btn studio-btn-subtle"
          title="Kataloğa Dön"
        >
          <ArrowLeft size={14} />
          <span>Kataloğa Dön</span>
        </button>

        <div className="studio-bar-title">
          <span>{app.name_tr || app.name || 'Yeni Uygulama'}</span>
          {isDirty ? (
            <span style={{ fontSize: '0.72rem', background: '#f59e0b', color: '#000', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              Değişiklik Var
            </span>
          ) : (
            <span style={{ fontSize: '0.72rem', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
              Kayıtlı
            </span>
          )}
        </div>
      </div>

      {/* Orta: Canlı Dil Önizleme Seçicisi (Yalın TR, EN, AR - Emojisiz) */}
      <div className="studio-bar-center">
        <div className="studio-lang-switch">
          <button
            type="button"
            onClick={() => onLanguageChange('tr')}
            className={`studio-lang-btn ${canvasLang === 'tr' ? 'active' : ''}`}
          >
            TR
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('en')}
            className={`studio-lang-btn ${canvasLang === 'en' ? 'active' : ''}`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onLanguageChange('ar')}
            className={`studio-lang-btn ${canvasLang === 'ar' ? 'active' : ''}`}
          >
            AR
          </button>
        </div>
      </div>

      {/* Sağ: Vitrinde Önizle & Kaydet */}
      <div className="studio-bar-right">
        {previewSlug && (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="studio-btn studio-btn-subtle"
            title="webMSKLabs vitrininde canlı önizle"
          >
            <ExternalLink size={14} />
            <span>Vitrinde Gör</span>
          </a>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="studio-btn studio-btn-primary"
        >
          <Save size={14} />
          <span>{isSaving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}</span>
        </button>
      </div>
    </header>
  );
};
