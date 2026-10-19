import React, { useState } from 'react';
import type { AppItem } from '../types';
import type { CanvasLang, StudioSectionType } from '../components/apps/studio/types';
import { AppStudioTopBar } from '../components/apps/studio/AppStudioTopBar';
import { AppStudioCanvas } from '../components/apps/studio/AppStudioCanvas';
import { AppStudioDrawer } from '../components/apps/studio/AppStudioDrawer';
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
  const [app, setApp] = useState<AppItem>({ ...initialApp });
  const [canvasLang, setCanvasLang] = useState<CanvasLang>('tr');
  const [selectedSection, setSelectedSection] = useState<StudioSectionType | null>('header');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAppChange = (updated: AppItem) => {
    setApp(updated);
    setIsDirty(true);
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
        app_id: app.app_id || app.slug || app.id,
        name_tr: app.name_tr || app.name || '',
        name_en: app.name_en || null,
        name_ar: app.name_ar || null,
        description_tr: app.description_tr || app.description || '',
        description_en: app.description_en || null,
        description_ar: app.description_ar || null,
        features_tr: Array.isArray(app.features) ? app.features.join('\n') : (app.features || null),
        features_en: app.features_en || null,
        features_ar: app.features_ar || null,
        icon_url: app.icon_url || null,
        cover_url: app.cover_url || null,
        category: app.category || 'Mobil',
        platform: app.platform || 'Android',
        display_order: app.sort_order ?? app.display_order ?? 0,
        is_active: app.status === 'active' || app.is_active === true ? 1 : 0,
        store_links_json: JSON.stringify(app.store_links || {}),
        feature_cards_json: JSON.stringify(app.feature_cards || []),
      };

      await api.updateApp(app.id, payload);
      setIsDirty(false);
      showToast('Uygulama başarıyla güncellendi ve vitrine yansıtıldı.');
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
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* 1. Stüdyo Üst Kontrol Çubuğu */}
      <AppStudioTopBar
        app={app}
        canvasLang={canvasLang}
        isDirty={isDirty}
        isSaving={isSaving}
        onLanguageChange={(lang: CanvasLang) => setCanvasLang(lang)}
        onBack={onBack}
        onSave={handleSave}
      />

      {/* 2. Ana Çalışma Tuvali ve Yan Çekmece */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Canlı Önizleme Tuvali */}
        <AppStudioCanvas
          app={app}
          canvasLang={canvasLang}
          selectedSection={selectedSection}
          onSelectSection={(sec) => setSelectedSection(sec)}
          onBackToCatalog={onBack}
        />

        {/* Bağlamsal Düzenleme Çekmecesi */}
        {selectedSection && (
          <AppStudioDrawer
            selectedSection={selectedSection}
            app={app}
            onChangeApp={handleAppChange}
            onClose={() => setSelectedSection(null)}
          />
        )}
      </div>

      {/* Başarı / Bilgi Bildirimi Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-2xl animate-fade-in border border-emerald-400/30">
          <span>✅</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
