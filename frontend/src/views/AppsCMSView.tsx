import React, { useState, useEffect } from 'react';
import { Smartphone, Plus } from 'lucide-react';
import type { AppItem } from '../types';
import { api } from '../services/api';

export const AppsCMSView: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAppModal, setShowAppModal] = useState<boolean>(false);
  const [showVersionModal, setShowVersionModal] = useState<boolean>(false);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);

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

  const [versionForm, setVersionForm] = useState({
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
      alert(err.message || 'Uygulama eklenemedi');
    }
  };

  const handleAddVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await api.addAppVersion(selectedApp.id, versionForm);
      setShowVersionModal(false);
      loadApps();
    } catch (err: any) {
      alert(err.message || 'Sürüm eklenemedi');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>Uygulamalar & Versiyon Yönetimi</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            webMSKLabs ve mobil mağazalar için uygulama kataloğunu (`app_catalog.json` muadili) yönetin.
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
          <span>Yeni Uygulama Ekle</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Uygulamalar yükleniyor...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {apps.map((app) => (
            <div key={app.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                    <Smartphone size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{app.name_tr}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>ID: {app.app_id}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {app.description_tr}
                </p>

                {/* Versions */}
                <div style={{ marginTop: '14px', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 700 }}>Yayınlanmış Sürümler:</div>
                  {app.versions && app.versions.length > 0 ? (
                    app.versions.map((ver) => (
                      <div key={ver.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#FFF', padding: '3px 0' }}>
                        <span>v{ver.version_name} ({ver.platform})</span>
                        <a href={ver.download_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>İndir 🔗</a>
                      </div>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Henüz sürüm yok.</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedApp(app);
                  setShowVersionModal(true);
                }}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: 'var(--accent-primary)',
                  borderRadius: '6px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={14} />
                <span>Yeni APK / Sürüm Yayınla</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* App Modal */}
      {showAppModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', background: '#0F1522' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>Yeni Uygulama Kaydet</h2>

            <form onSubmit={handleCreateApp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uygulama ID (Örn: al-mushaf)</label>
                <input type="text" value={appForm.app_id} onChange={(e) => setAppForm({ ...appForm, app_id: e.target.value })} required style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Uygulama Adı (TR)</label>
                <input type="text" value={appForm.name_tr} onChange={(e) => setAppForm({ ...appForm, name_tr: e.target.value })} required style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Açıklama (TR)</label>
                <textarea rows={3} value={appForm.description_tr} onChange={(e) => setAppForm({ ...appForm, description_tr: e.target.value })} required style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAppModal(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px' }}>İptal</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--accent-primary)', border: 'none', color: '#FFF', borderRadius: '6px', fontWeight: 700 }}>Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Version Modal */}
      {showVersionModal && selectedApp && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', background: '#0F1522' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>{selectedApp.name_tr} için Sürüm Ekle</h2>

            <form onSubmit={handleAddVersion} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sürüm Adı (Örn: 2.1.0)</label>
                <input type="text" value={versionForm.version_name} onChange={(e) => setVersionForm({ ...versionForm, version_name: e.target.value })} required style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>İndirme Bağlantısı (APK / Store URL)</label>
                <input type="text" value={versionForm.download_url} onChange={(e) => setVersionForm({ ...versionForm, download_url: e.target.value })} required style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--accent-cyan)' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowVersionModal(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px' }}>İptal</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--accent-primary)', border: 'none', color: '#FFF', borderRadius: '6px', fontWeight: 700 }}>Yayınla</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
