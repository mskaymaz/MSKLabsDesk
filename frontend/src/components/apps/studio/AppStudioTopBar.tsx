import React from 'react';
import { ArrowLeft, Save, ExternalLink, Sun, Moon } from 'lucide-react';
import type { CanvasLang } from './types';
import type { AppItem } from '../../../types';

interface AppStudioTopBarProps {
  app: AppItem;
  canvasLang: CanvasLang;
  theme: 'light' | 'dark';
  onLanguageChange: (lang: CanvasLang) => void;
  onToggleTheme: () => void;
  onBack: () => void;
  onSave: () => void;
  isSaving: boolean;
  isDirty: boolean;
}

export const AppStudioTopBar: React.FC<AppStudioTopBarProps> = ({
  app,
  canvasLang,
  theme,
  onLanguageChange,
  onToggleTheme,
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
            <span className="admin-badge admin-badge-amber">
              Değişiklik Var
            </span>
          ) : (
            <span className="admin-badge admin-badge-emerald">
              Kayıtlı
            </span>
          )}
        </div>
      </div>

      {/* Orta: Canlı Dil Önizleme Seçicisi & Canlı Tema Değiştirici */}
      <div className="studio-bar-center">
        {/* Dil Seçici (TR, EN, AR Yalın Standart - Emojisiz) */}
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

        {/* Canlı Açık / Koyu Tema Seçicisi */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="studio-theme-toggle-btn"
          title={theme === 'dark' ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}</span>
        </button>
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
