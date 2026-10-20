import React, { useState, useEffect } from 'react';
import { Smartphone, Plus, Search, RefreshCw } from 'lucide-react';
import type { AppItem } from '../types';
import { api } from '../services/api';
import { AppModal } from '../components/apps/AppModal';
import { AppVersionModal } from '../components/apps/AppVersionModal';
import { AppCMSCard } from '../components/apps/AppCMSCard';
import { AppDetailStudioView } from './AppDetailStudioView';

export const AppsCMSView: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in_development' | 'planned'>('all');
  
  // Stüdyo Modu
  const [studioApp, setStudioApp] = useState<AppItem | null>(null);

  // Modallar
  const [showAppModal, setShowAppModal] = useState<boolean>(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);
  const [showVersionModal, setShowVersionModal] = useState<boolean>(false);
  const [selectedAppForVersion, setSelectedAppForVersion] = useState<AppItem | null>(null);
  const [expandedVersionsAppId, setExpandedVersionsAppId] = useState<string | null>(null);

  // Kopyalama bildirimi
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const loadApps = async () => {
    setLoading(true);
    try {
      const res = await api.getApps();
      setApps(res.apps || []);
    } catch (err) {
      console.error('Uygulamalar yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleDeleteApp = async (app: AppItem) => {
    if (!window.confirm(`"${app.name_tr}" uygulamasını ve bağlı tüm sürümlerini silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await api.deleteApp(app.id);
      loadApps();
    } catch (err: any) {
      alert(err.message || 'Uygulama silinemedi.');
    }
  };

  const handleDeleteVersion = async (appId: string, versionId: string, versionName: string) => {
    if (!window.confirm(`v${versionName} sürümünü silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      await api.deleteAppVersion(appId, versionId);
      loadApps();
    } catch (err: any) {
      alert(err.message || 'Sürüm silinemedi.');
    }
  };

  const handleCopyDownloadUrl = (slug: string) => {
    const origin = window.location.origin;
    const downloadUrl = `${origin}/api/v1/apps/${slug}/download`;
    navigator.clipboard.writeText(downloadUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleDirectOrderChange = async (targetApp: AppItem, newOrder: number) => {
    try {
      await api.updateApp(targetApp.id, { ...targetApp, display_order: newOrder });
      loadApps();
    } catch (err: any) {
      alert(`Sıralama kaydedilemedi: ${err.message || 'Bilinmeyen hata'}`);
    }
  };

  const handleReorderApp = async (appId: string, direction: 'up' | 'down') => {
    const currentApp = apps.find((a) => a.id === appId);
    if (!currentApp) return;

    const currentOrder = currentApp.display_order ?? 0;
    const newOrder = direction === 'up' ? Math.max(1, currentOrder - 1) : currentOrder + 1;
    if (newOrder === currentOrder) return;

    const conflictApp = apps.find((a) => a.id !== appId && (a.display_order ?? 0) === newOrder);

    try {
      if (conflictApp) {
        await Promise.all([
          api.updateApp(currentApp.id, { ...currentApp, display_order: newOrder }),
          api.updateApp(conflictApp.id, { ...conflictApp, display_order: currentOrder }),
        ]);
      } else {
        await api.updateApp(currentApp.id, { ...currentApp, display_order: newOrder });
      }
      loadApps();
    } catch (err: any) {
      alert(`Sıralama güncellenemedi: ${err.message || 'Bilinmeyen hata'}`);
    }
  };

  const getAppStatus = (app: AppItem): 'active' | 'in_development' | 'planned' => {
    if (app.status === 'planned' || app.status === 'in_development' || app.status === 'active') {
      return app.status;
    }
    return (app.is_active === 1 || app.is_active === true) ? 'active' : 'in_development';
  };

  const activeCount = apps.filter((a) => getAppStatus(a) === 'active').length;
  const devCount = apps.filter((a) => getAppStatus(a) === 'in_development').length;
  const plannedCount = apps.filter((a) => getAppStatus(a) === 'planned').length;

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name_tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.app_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.description_tr && app.description_tr.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = platformFilter === 'all' || app.platform === 'all' || app.platform === platformFilter;
    const matchesStatus = statusFilter === 'all' || getAppStatus(app) === statusFilter;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  if (studioApp) {
    return (
      <AppDetailStudioView
        app={studioApp}
        onBack={() => {
          setStudioApp(null);
          loadApps();
        }}
        onSaveSuccess={() => {
          loadApps();
        }}
      />
    );
  }

  const handleAddNewAppInStudio = () => {
    const newApp: AppItem = {
      id: '',
      app_id: '',
      name_tr: 'Yeni Uygulama',
      name_en: 'New Application',
      name_ar: 'تطبيق جديد',
      summary_tr: 'Kısa uygulama vizyon özeti...',
      summary_en: 'Short application vision summary...',
      summary_ar: 'ملخص رؤية التطبيق الموجز...',
      description_tr: '<p>Uygulama hakkında detaylı açıklama...</p>',
      description_en: '<p>Detailed description in English...</p>',
      description_ar: '<p>الوصف التفصيلي للتطبيق...</p>',
      category: 'utility',
      platform: 'all',
      status: 'in_development',
      icon_url: '',
      store_links: {
        google_play: '',
        github: '',
        google_drive: '',
        app_store: '',
        web_url: '',
      },
      feature_cards: [
        {
          icon: '✨',
          title_tr: 'Öne Çıkan Özellik',
          title_en: 'Featured Item',
          title_ar: 'الميزة البارزة',
          description_tr: 'Özellik hakkında açıklama...',
          description_en: 'Description about feature...',
          description_ar: 'وصف عن الميزة...',
        }
      ],
    };
    setStudioApp(newApp);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Üst Başlık & Ekleme Butonu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>Uygulama Kataloğu ve Sürüm Stüdyosu</span>
          </h1>
          <p className="admin-page-desc">
            Mobil, masaüstü ve web uygulamalarınızı yönetin; sabit kalıcı indirme yönlendirmesiyle 30 saniyede yeni sürüm yayınlayın.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={loadApps} className="admin-btn admin-btn-refresh admin-btn-md" title="Yenile">
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleAddNewAppInStudio}
            className="admin-btn admin-btn-primary admin-btn-md"
            title="Görsel Stüdyo Tuvali ile Yeni Uygulama Ekle"
          >
            <Plus size={16} />
            <span>Yeni Uygulama Ekle</span>
          </button>
        </div>
      </div>

      {/* Yayın ve Geliştirme Durumu Sekmeleri */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          style={statusTabStyle(statusFilter === 'all')}
        >
          Tümü ({apps.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('active')}
          style={statusTabStyle(statusFilter === 'active')}
        >
          🚀 Yayında ({activeCount})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('in_development')}
          style={statusTabStyle(statusFilter === 'in_development')}
        >
          🛠️ Yapım Aşamasında ({devCount})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('planned')}
          style={statusTabStyle(statusFilter === 'planned')}
        >
          📋 Planlama Aşamasında ({plannedCount})
        </button>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Uygulama adı veya slug ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '100%', paddingLeft: '36px' }}
          />
        </div>

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="form-input"
          style={{ width: 'auto', minWidth: '160px' }}
        >
          <option value="all">Tüm Platformlar</option>
          <option value="android">Android</option>
          <option value="ios">iOS</option>
          <option value="windows">Windows</option>
          <option value="web">Web (PWA)</option>
        </select>
      </div>

      {/* Grid Liste */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Yükleniyor...
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="admin-list-card" style={{ padding: '48px', textAlign: 'center' }}>
          <Smartphone size={40} style={{ margin: '0 auto 12px', color: 'var(--text-muted)' }} />
          <h3 className="admin-card-title">Henüz Uygulama Bulunmuyor</h3>
          <p className="admin-card-desc" style={{ marginBottom: '16px' }}>
            {searchQuery ? 'Arama kriterlerinize uyan bir uygulama bulunamadı.' : 'Vitrin için ilk uygulamanızı ekleyerek başlayın.'}
          </p>
          <button onClick={handleAddNewAppInStudio} className="admin-btn admin-btn-primary admin-btn-md">
            <Plus size={16} />
            <span>Yeni Uygulama Ekle</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {filteredApps.map((app) => (
            <AppCMSCard
              key={app.id}
              app={app}
              copiedSlug={copiedSlug}
              expandedVersionsAppId={expandedVersionsAppId}
              onOpenStudio={(selectedApp) => setStudioApp(selectedApp)}
              onDirectOrderChange={handleDirectOrderChange}
              onReorderApp={handleReorderApp}
              onCopyDownloadUrl={handleCopyDownloadUrl}
              onToggleVersions={(appId) => setExpandedVersionsAppId(expandedVersionsAppId === appId ? null : appId)}
              onOpenVersionModal={(selectedApp) => {
                setSelectedAppForVersion(selectedApp);
                setShowVersionModal(true);
              }}
              onEditAppModal={(selectedApp) => {
                setEditingApp(selectedApp);
                setShowAppModal(true);
              }}
              onDeleteApp={handleDeleteApp}
              onDeleteVersion={handleDeleteVersion}
            />
          ))}
        </div>
      )}

      {/* Uygulama Ekle/Düzenle Modalı */}
      <AppModal
        isOpen={showAppModal}
        onClose={() => setShowAppModal(false)}
        editingApp={editingApp}
        onSaved={loadApps}
      />

      {/* Hızlı Sürüm Yayını Modalı */}
      <AppVersionModal
        isOpen={showVersionModal}
        onClose={() => setShowVersionModal(false)}
        app={selectedAppForVersion}
        onSaved={loadApps}
      />

    </div>
  );
};

function statusTabStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: isActive ? 700 : 500,
    border: isActive ? '1px solid var(--accent-primary, #3b82f6)' : '1px solid var(--border-color, #cbd5e1)',
    background: isActive ? 'var(--accent-primary, #3b82f6)' : 'var(--bg-surface, #f8fafc)',
    color: isActive ? '#ffffff' : 'var(--text-main, #334155)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };
}
