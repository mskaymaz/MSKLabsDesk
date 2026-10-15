import React, { useState, useEffect } from 'react';
import { Smartphone, Plus } from 'lucide-react';
import type { AppItem } from '../types';
import { api } from '../services/api';
import { useTranslation } from '../context/I18nContext';

export const AppsCMSView: React.FC = () => {
  const { t } = useTranslation();
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAppModal, setShowAppModal] = useState<boolean>(false);
  const [_showVersionModal, setShowVersionModal] = useState<boolean>(false);
  const [_selectedApp, setSelectedApp] = useState<AppItem | null>(null);

  const [appForm, setAppForm] = useState({
    app_id: '',
    name_tr: '',
    name_en: '',
    name_ar: '',
    description_tr: '',
    description_en: '',
    description_ar: '',
    icon_url: '',
    cover_url: '',
    category: 'utility',
    platform: 'all',
  });

  const [_versionForm] = useState({
    version_name: '',
    version_code: 1,
    download_url: '',
    changelog_tr: '',
    changelog_en: '',
    changelog_ar: '',
    platform: 'android',
    is_mandatory: false,
  });

  const loadApps = async () => {
    setLoading(true);
    try {
      const res = await api.getApps();
      setApps(res.apps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createApp(appForm);
      setShowAppModal(false);
      loadApps();
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="admin-page-title">{t('apps.title')}</h1>
          <p className="admin-page-desc">
            Mobil ve masaüstü uygulama kataloğunu, mağaza bağlantılarını ve sürümleri yönetin
          </p>
        </div>
        <button
          onClick={() => setShowAppModal(true)}
          className="admin-btn admin-btn-primary admin-btn-md"
        >
          <Plus size={16} />
          <span>{t('apps.newApp')}</span>
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
          {apps.map((app) => (
            <div key={app.id} className="admin-list-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '42px', height: '42px', background: 'rgba(99, 102, 241, 0.12)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)', flexShrink: 0 }}>
                    <Smartphone size={22} />
                  </div>
                  <div>
                    <h3 className="admin-card-title">{app.name_tr}</h3>
                    <span className="admin-link-subtle">{app.app_id}</span>
                  </div>
                </div>

                <p className="admin-card-desc line-clamp-2">
                  {app.description_tr || t('common.error')}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                <span className="admin-badge admin-badge-index">{app.platform}</span>
                <button
                  onClick={() => { setSelectedApp(app); setShowVersionModal(true); }}
                  className="admin-btn admin-btn-sm admin-btn-view"
                >
                  + {t('common.add')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create App Modal */}
      {showAppModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="admin-list-card" style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-card)', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h2 className="admin-card-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{t('apps.newApp')}</h2>

            <form onSubmit={handleCreateApp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">{t('apps.appName')}</label>
                <input
                  type="text"
                  value={appForm.name_tr}
                  onChange={(e) => setAppForm({ ...appForm, name_tr: e.target.value })}
                  required
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAppModal(false)} className="admin-btn admin-btn-refresh admin-btn-md">{t('common.cancel')}</button>
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-md">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
