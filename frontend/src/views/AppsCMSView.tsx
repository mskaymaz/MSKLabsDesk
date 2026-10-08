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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>{t('apps.title')}</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {t('apps.title')}
          </p>
        </div>
        <button
          onClick={() => setShowAppModal(true)}
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: '#FFF',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '10px 18px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Plus size={18} />
          <span>{t('apps.newApp')}</span>
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {apps.map((app) => (
            <div key={app.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{app.name_tr}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>{app.app_id}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {app.description_tr || t('common.error')}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.platform}</span>
                <button
                  onClick={() => { setSelectedApp(app); setShowVersionModal(true); }}
                  style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF', fontSize: '0.8rem', cursor: 'pointer' }}
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', background: '#0F1522' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>{t('apps.newApp')}</h2>

            <form onSubmit={handleCreateApp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>{t('apps.appName')}</label>
                <input
                  type="text"
                  value={appForm.name_tr}
                  onChange={(e) => setAppForm({ ...appForm, name_tr: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAppModal(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}>{t('common.cancel')}</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--accent-primary)', border: 'none', color: '#FFF', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
