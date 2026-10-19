import React, { useState, useEffect } from 'react';
import {
  Smartphone, Plus, Edit2, Trash2, Rocket,
  Copy, Check, Download, Search, Layers, RefreshCw, Sparkles
} from 'lucide-react';
import type { AppItem } from '../types';
import { api } from '../services/api';
import { AppModal } from '../components/apps/AppModal';
import { AppVersionModal } from '../components/apps/AppVersionModal';
import { AppDetailStudioView } from './AppDetailStudioView';

export const AppsCMSView: React.FC = () => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  
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

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.name_tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.app_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.description_tr && app.description_tr.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = platformFilter === 'all' || app.platform === 'all' || app.platform === platformFilter;
    return matchesSearch && matchesPlatform;
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
            onClick={() => { setEditingApp(null); setShowAppModal(true); }}
            className="admin-btn admin-btn-primary admin-btn-md"
          >
            <Plus size={16} />
            <span>Yeni Uygulama Ekle</span>
          </button>
        </div>
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
          <button onClick={() => { setEditingApp(null); setShowAppModal(true); }} className="admin-btn admin-btn-primary admin-btn-md">
            <Plus size={16} />
            <span>Yeni Uygulama Ekle</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="admin-list-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                padding: '18px',
                border: '1px solid var(--border-color)',
              }}
            >
              <div>
                {/* Kart Üst Bilgisi */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                  <div 
                    onClick={() => setStudioApp(app)}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                    title="Görsel Stüdyo'da Aç"
                  >
                    {app.icon_url ? (
                      <img
                        src={app.icon_url.startsWith('/media/') ? `https://msklabs.org${app.icon_url}` : app.icon_url}
                        alt={app.name_tr}
                        style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '12px',
                          background: 'rgba(99, 102, 241, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        <Smartphone size={24} />
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 className="admin-card-title hover:text-blue-400 transition" style={{ margin: 0, fontSize: '1.05rem' }}>{app.name_tr}</h3>
                        <span
                          style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: app.is_active !== false ? '#10b981' : '#94a3b8',
                          }}
                          title={app.is_active !== false ? 'Yayında' : 'Taslak'}
                        />
                      </div>
                      <span className="admin-link-subtle" style={{ fontSize: '0.8rem' }}>slug: {app.app_id}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-end', maxWidth: '160px' }}>
                    {app.category ? app.category.split(',').map((c) => (
                      <span key={c.trim()} className="admin-badge admin-badge-index" style={{ textTransform: 'capitalize', fontSize: '0.72rem' }}>
                        {c.trim()}
                      </span>
                    )) : (
                      <span className="admin-badge admin-badge-index" style={{ fontSize: '0.72rem' }}>Araç</span>
                    )}
                  </div>
                </div>

                {/* Açıklama */}
                <p className="admin-card-desc" style={{ fontSize: '0.85rem', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {app.description_tr || 'Açıklama belirtilmemiş.'}
                </p>

                {/* Mağaza ve Platform Rozetleri */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="admin-badge admin-badge-view" style={{ fontSize: '0.72rem' }}>
                    {app.platform === 'all' ? 'Tüm Platformlar' : app.platform?.toUpperCase()}
                  </span>

                  {app.store_links?.google_play && (
                    <a href={app.store_links.google_play} target="_blank" rel="noreferrer" className="admin-link-subtle" style={{ fontSize: '0.75rem' }} title="Google Play">
                      Play Store ↗
                    </a>
                  )}
                  {app.store_links?.app_store && (
                    <a href={app.store_links.app_store} target="_blank" rel="noreferrer" className="admin-link-subtle" style={{ fontSize: '0.75rem' }} title="App Store">
                      App Store ↗
                    </a>
                  )}
                  {app.store_links?.github && (
                    <a href={app.store_links.github} target="_blank" rel="noreferrer" className="admin-link-subtle" style={{ fontSize: '0.75rem' }} title="GitHub">
                      GitHub ↗
                    </a>
                  )}
                </div>

                {/* Sürüm & Kalıcı İndirme Çubuğu */}
                <div style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>
                      v{app.latest_version || '1.0.0'}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>•</span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {app.downloads_count || 0} indirme
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyDownloadUrl(app.app_id)}
                    className="admin-btn admin-btn-sm"
                    style={{ padding: '3px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Kalıcı indirme bağlantısını kopyala"
                  >
                    {copiedSlug === app.app_id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiedSlug === app.app_id ? 'Kopyalandı' : 'Kalıcı URL'}</span>
                  </button>
                </div>
              </div>

              {/* Sürümler Geçmişi Akordeonu */}
              {expandedVersionsAppId === app.id && (
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Sürüm Geçmişi ({app.versions?.length || 0}):</span>
                  {(!app.versions || app.versions.length === 0) ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Henüz sürüm kaydı yok.</span>
                  ) : (
                    <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {app.versions.map((ver) => (
                        <div key={ver.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: 'rgba(0,0,0,0.15)', borderRadius: '4px', fontSize: '0.75rem' }}>
                          <div>
                            <strong>v{ver.version_name}</strong>
                            <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>(b:{ver.version_code})</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <a href={ver.download_url} target="_blank" rel="noreferrer" className="admin-link-subtle" title="İndirme Linki">
                              <Download size={12} />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteVersion(app.id, ver.id, ver.version_name)}
                              style={{ border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer', padding: '2px' }}
                              title="Sürümü Sil"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Aksiyon Butonları */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setExpandedVersionsAppId(expandedVersionsAppId === app.id ? null : app.id)}
                  className="admin-btn admin-btn-sm"
                  style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Layers size={13} />
                  <span>Sürümler ({app.versions?.length || 0})</span>
                </button>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setStudioApp(app)}
                    className="admin-btn admin-btn-sm"
                    style={{ background: '#2563eb', color: '#fff', borderColor: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="Görsel Stüdyo ile Vitrin Sayfasını Canlı Düzenle"
                  >
                    <Sparkles size={13} />
                    <span>Görsel Stüdyo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedAppForVersion(app); setShowVersionModal(true); }}
                    className="admin-btn admin-btn-sm admin-btn-primary"
                    style={{ background: '#10b981', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}
                    title="30 saniyede yeni sürüm yayınla"
                  >
                    <Rocket size={13} />
                    <span>+ Sürüm</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setEditingApp(app); setShowAppModal(true); }}
                    className="admin-btn admin-btn-sm admin-btn-view"
                    title="Hızlı Form Düzenle"
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteApp(app)}
                    className="admin-btn admin-btn-sm admin-btn-delete"
                    title="Uygulamayı Sil"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
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
