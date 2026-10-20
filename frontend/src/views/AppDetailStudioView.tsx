import React, { useState } from 'react';
import type { AppItem } from '../types';
import type { CanvasLang, StudioSectionType } from '../components/apps/studio/types';
import { AppStudioTopBar } from '../components/apps/studio/AppStudioTopBar';
import { AppStudioCanvas } from '../components/apps/studio/AppStudioCanvas';
import { AppStudioFloatingModal } from '../components/apps/studio/AppStudioFloatingModal';
import { api } from '../services/api';

interface AppDetailStudioViewProps {
  app: AppItem;
  onBack: () => void;
  onSaveSuccess?: (updatedApp: AppItem) => void;
}

export const AppDetailStudioView: React.FC<AppDetailStudioViewProps> = ({
  app: initialApp,
  onBack,
  onSaveSuccess,
}) => {
  const [app, setApp] = useState<AppItem>(() => ({
    ...initialApp,
    status: initialApp.status || ((initialApp.is_active === 1 || initialApp.is_active === true) ? 'active' : 'in_development'),
  }));
  const [canvasLang, setCanvasLang] = useState<CanvasLang>('tr');
  const [studioTheme, setStudioTheme] = useState<'light' | 'dark'>('light');
  const [activeSection, setActiveSection] = useState<StudioSectionType | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Uçar pencereden "Tamam, Sayfaya Yerleştir" dendiğinde
  const handleApplySectionChanges = (updatedPartial: Partial<AppItem>) => {
    setApp((prev) => ({ ...prev, ...updatedPartial }));
    setIsDirty(true);
    setActiveSection(null);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = {
        ...app,
        app_id: app.app_id || app.slug || app.id || `app_${Date.now()}`,
        name_tr: app.name_tr || app.name || 'Yeni Uygulama',
        name_en: app.name_en || null,
        name_ar: app.name_ar || null,
        summary_tr: app.summary_tr || null,
        summary_en: app.summary_en || null,
        summary_ar: app.summary_ar || null,
        description_tr: app.description_tr || app.description || '',
        description_en: app.description_en || null,
        description_ar: app.description_ar || null,
        features_tr: Array.isArray(app.features) ? app.features.join('\n') : (app.features || null),
        features_en: app.features_en || null,
        features_ar: app.features_ar || null,
        icon_url: app.icon_url || null,
        cover_url: app.cover_url || null,
        category: app.category || 'utility',
        platform: app.platform || 'all',
        display_order: app.display_order ?? app.sort_order ?? 0,
        status: app.status || (app.is_active === 1 || app.is_active === true ? 'active' : 'in_development'),
        is_active: app.status
          ? (app.status === 'active' ? 1 : 0)
          : (app.is_active === 1 || app.is_active === true ? 1 : 0),
        store_links_json: JSON.stringify(app.store_links || {}),
        feature_cards_json: JSON.stringify(app.feature_cards || []),
      };

      if (app.id) {
        await api.updateApp(app.id, payload);
      } else {
        const res = await api.createApp(payload);
        if (res && res.id) {
          setApp((prev) => ({ ...prev, id: res.id }));
        }
      }

      setIsDirty(false);
      showToast('Değişiklikler kaydedildi ve vitrin şablonuna yansıtıldı.');
      if (onSaveSuccess) {
        onSaveSuccess(app);
      }
    } catch (err: any) {
      console.error('Kaydetme hatası:', err);
      showToast(`Hata: ${err.message || 'Kayıt sırasında bir hata oluştu.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="app-studio-wrapper" data-studio-theme={studioTheme}>
      {/* 1. Stüdyo Üst Kontrol Çubuğu */}
      <AppStudioTopBar
        app={app}
        canvasLang={canvasLang}
        theme={studioTheme}
        onLanguageChange={(lang: CanvasLang) => setCanvasLang(lang)}
        onToggleTheme={() => setStudioTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        onBack={onBack}
        onSave={handleSave}
        isDirty={isDirty}
        isSaving={isSaving}
      />

      {/* 2. Canlı Önizleme Tuvali (Arkadaki Sayfa Asla Kaybolmaz) */}
      <AppStudioCanvas
        app={app}
        canvasLang={canvasLang}
        onSelectSection={(sec) => setActiveSection(sec)}
        onBackToCatalog={onBack}
      />

      {/* 3. Uçar / Hareketli Edit Dialog'u (Tıklanınca Açılır) */}
      {activeSection && (
        <AppStudioFloatingModal
          section={activeSection}
          app={app}
          onApply={handleApplySectionChanges}
          onClose={() => setActiveSection(null)}
        />
      )}

      {/* Başarı Toast Bildirimi */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 1000,
          background: '#16a34a',
          color: '#fff',
          padding: '10px 18px',
          borderRadius: '10px',
          fontSize: '0.82rem',
          fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
