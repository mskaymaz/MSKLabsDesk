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

  const executeSave = async (targetApp: AppItem) => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const payload = {
        ...targetApp,
        app_id: targetApp.app_id || targetApp.slug || targetApp.id || `app_${Date.now()}`,
        name_tr: targetApp.name_tr || targetApp.name || 'Yeni Uygulama',
        name_en: targetApp.name_en || null,
        name_ar: targetApp.name_ar || null,
        summary_tr: targetApp.summary_tr || null,
        summary_en: targetApp.summary_en || null,
        summary_ar: targetApp.summary_ar || null,
        description_tr: targetApp.description_tr || targetApp.description || '',
        description_en: targetApp.description_en || null,
        description_ar: targetApp.description_ar || null,
        features_tr: Array.isArray(targetApp.features) ? targetApp.features.join('\n') : (targetApp.features || null),
        features_en: targetApp.features_en || null,
        features_ar: targetApp.features_ar || null,
        icon_url: targetApp.icon_url || null,
        cover_url: targetApp.cover_url || null,
        category: targetApp.category || 'utility',
        platform: targetApp.platform || 'all',
        display_order: targetApp.display_order ?? targetApp.sort_order ?? 0,
        status: targetApp.status || (targetApp.is_active === 1 || targetApp.is_active === true ? 'active' : 'in_development'),
        is_active: targetApp.status
          ? (targetApp.status === 'active' ? 1 : 0)
          : (targetApp.is_active === 1 || targetApp.is_active === true ? 1 : 0),
        store_links_json: JSON.stringify(targetApp.store_links || {}),
        feature_cards_json: JSON.stringify(targetApp.feature_cards || []),
      };

      if (targetApp.id) {
        await api.updateApp(targetApp.id, payload);
      } else {
        const res = await api.createApp(payload);
        if (res && res.id) {
          setApp((prev) => ({ ...prev, id: res.id }));
        }
      }

      setIsDirty(false);
      showToast('Değişiklikler kaydedildi ve vitrin şablonuna yansıtıldı.');
      if (onSaveSuccess) {
        onSaveSuccess(targetApp);
      }
    } catch (err: any) {
      console.error('Kaydetme hatası:', err);
      showToast(`Hata: ${err.message || 'Kayıt sırasında bir hata oluştu.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = () => executeSave(app);

  const handleDirectSaveFromModal = async (updatedPartial: Partial<AppItem>) => {
    const merged = { ...app, ...updatedPartial };
    setApp(merged);
    setActiveSection(null);
    await executeSave(merged);
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
          onSaveDirect={handleDirectSaveFromModal}
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
