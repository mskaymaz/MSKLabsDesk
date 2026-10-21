import React, { useState, useEffect, useRef } from 'react';
import {
  Trash2, Rocket,
  Copy, Check, Download, Layers
} from 'lucide-react';
import type { AppItem } from '../../types';
import { resolveAppIcon } from '../../utils/appIcons';
import { getLocalizedPlatform, getLocalizedCategory, getLocalizedStatus } from '../../utils/appLocalization';
import { parseAppTitle } from '../../utils/appTitleHelper';

interface AppCMSCardProps {
  app: AppItem;
  copiedSlug: string | null;
  expandedVersionsAppId: string | null;
  onOpenStudio: (app: AppItem) => void;
  onDirectOrderChange: (app: AppItem, val: number) => void;
  onReorderApp: (appId: string, direction: 'up' | 'down') => void;
  onCopyDownloadUrl: (slug: string) => void;
  onToggleVersions: (appId: string) => void;
  onOpenVersionModal: (app: AppItem) => void;
  onEditAppModal: (app: AppItem) => void;
  onDeleteApp: (app: AppItem) => void;
  onDeleteVersion: (appId: string, versionId: string, versionName: string) => void;
}

export const AppCMSCard: React.FC<AppCMSCardProps> = ({
  app,
  copiedSlug,
  expandedVersionsAppId,
  onOpenStudio,
  onDirectOrderChange,
  onReorderApp,
  onCopyDownloadUrl,
  onToggleVersions,
  onOpenVersionModal,
  onEditAppModal,
  onDeleteApp,
  onDeleteVersion,
}) => {
  const currentStatus: 'active' | 'in_development' | 'planned' =
    app.status === 'planned' || app.status === 'in_development' || app.status === 'active'
      ? app.status
      : (app.is_active === 1 || app.is_active === true ? 'active' : 'in_development');

  const statusBadge = getLocalizedStatus(currentStatus, 'tr');

  // Sürümler açılır menü kontrolü
  const [showVersionsMenu, setShowVersionsMenu] = useState(false);
  const versionsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showVersionsMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (versionsMenuRef.current && !versionsMenuRef.current.contains(e.target as Node)) {
        setShowVersionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showVersionsMenu]);

  return (
    <div
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
            onClick={() => onOpenStudio(app)}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            title="Görsel Stüdyo'da Aç"
          >
            {(() => {
              const icon = resolveAppIcon(app.icon_url, app.app_id);
              if (icon.type === 'emoji') {
                return (
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(99, 102, 241, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '26px',
                      border: '1px solid var(--border-subtle)',
                      flexShrink: 0,
                    }}
                  >
                    {icon.value}
                  </div>
                );
              }
              return (
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={icon.value}
                    alt={app.name_tr}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      e.currentTarget.style.display = 'none';
                      if (parent) {
                        parent.innerHTML = '<span style="font-size:24px;">📱</span>';
                      }
                    }}
                  />
                </div>
              );
            })()}
            <div>
              {(() => {
                const parsed = parseAppTitle(app.name_tr);
                return (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <h3 className="admin-card-title hover:text-blue-400 transition" style={{ margin: 0, fontSize: '1.05rem' }}>
                        {parsed.mainTitle}
                      </h3>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '1px 6px',
                          borderRadius: '10px',
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          background: currentStatus === 'active' ? 'rgba(16, 185, 129, 0.12)' : currentStatus === 'planned' ? 'rgba(139, 92, 246, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          color: currentStatus === 'active' ? '#10b981' : currentStatus === 'planned' ? '#a78bfa' : '#f59e0b',
                          border: `1px solid ${currentStatus === 'active' ? 'rgba(16, 185, 129, 0.25)' : currentStatus === 'planned' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
                        }}
                      >
                        {statusBadge.full}
                      </span>
                    </div>
                    {parsed.subtitle && (
                      <div style={{ fontSize: '0.74rem', fontWeight: 400, color: 'var(--text-muted, #94a3b8)', marginTop: '2px' }}>
                        {parsed.subtitle}
                      </div>
                    )}
                  </div>
                );
              })()}
              <span className="admin-link-subtle" style={{ fontSize: '0.8rem' }}>slug: {app.app_id}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sıra:</span>
              <input
                type="number"
                min={1}
                defaultValue={app.display_order ?? 0}
                key={`${app.id}_${app.display_order}`}
                onBlur={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val !== app.display_order) {
                    onDirectOrderChange(app, val);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                className="form-input"
                style={{
                  width: '46px',
                  padding: '2px 4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  borderRadius: '6px',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  background: 'rgba(99, 102, 241, 0.08)',
                  color: '#818cf8',
                }}
                title="Vitrin Sırası — Değiştirmek için sayıyı yazıp Enter'a basın veya dışarı tıklayın"
              />
              <button
                type="button"
                onClick={() => onReorderApp(app.id, 'up')}
                className="admin-btn admin-btn-xs"
                style={{ padding: '2px 5px', fontSize: '0.68rem', lineHeight: 1 }}
                title="Sırayı Yukarı Al (Öne Çıkar)"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => onReorderApp(app.id, 'down')}
                className="admin-btn admin-btn-xs"
                style={{ padding: '2px 5px', fontSize: '0.68rem', lineHeight: 1 }}
                title="Sırayı Aşağı Al"
              >
                ▼
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'flex-end', maxWidth: '160px' }}>
              <span className="admin-badge admin-badge-index" style={{ fontSize: '0.72rem' }}>
                {getLocalizedCategory(app.category, 'tr').full}
              </span>
            </div>
          </div>
        </div>

        {/* Kart Özeti ve Açıklama */}
        {app.summary_tr && (
          <div style={{ fontSize: '0.8rem', color: '#60a5fa', marginBottom: '4px', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            📌 {app.summary_tr}
          </div>
        )}
        <p className="admin-card-desc" style={{ fontSize: '0.84rem', marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {app.description_tr || 'Açıklama belirtilmemiş.'}
        </p>

        {/* Mağaza ve Platform Rozetleri */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', marginBottom: '10px' }}>
          <span className="admin-badge admin-badge-view" style={{ fontSize: '0.72rem' }}>
            {getLocalizedPlatform(app.platform, 'tr').full}
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
            onClick={() => onCopyDownloadUrl(app.app_id)}
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
                      onClick={() => onDeleteVersion(app.id, ver.id, ver.version_name)}
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

      {/* Aksiyon Butonları (Sadeleştirilmiş Tek Satır) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        {/* Sol: Sürümler Açılır Menüsü */}
        <div ref={versionsMenuRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowVersionsMenu(!showVersionsMenu)}
            className="admin-btn admin-btn-sm"
            style={{ padding: '4px 8px', fontSize: '0.74rem', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px' }}
            title="Sürüm Yayınlama ve Geçmiş Menüsü"
          >
            <span>Sürümler</span>
            <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>▾</span>
          </button>

          {showVersionsMenu && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 0,
                marginBottom: '6px',
                background: 'var(--bg-modal, #1e293b)',
                border: '1px solid var(--border-subtle, #334155)',
                borderRadius: '8px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                padding: '4px',
                zIndex: 50,
                minWidth: '170px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowVersionsMenu(false);
                  onOpenVersionModal(app);
                }}
                className="admin-btn admin-btn-sm"
                style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.75rem', fontWeight: 500, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', cursor: 'pointer', width: '100%' }}
              >
                <Rocket size={13} color="var(--accent-primary, #6366f1)" />
                <span>Son Sürüm</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowVersionsMenu(false);
                  onToggleVersions(app.id);
                }}
                className="admin-btn admin-btn-sm"
                style={{ textAlign: 'left', justifyContent: 'flex-start', padding: '6px 10px', fontSize: '0.75rem', fontWeight: 500, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', cursor: 'pointer', width: '100%' }}
              >
                <Layers size={13} color="var(--text-muted, #9ca3af)" />
                <span>Eski Sürümler ({app.versions?.length || 0})</span>
              </button>
            </div>
          )}
        </div>

        {/* Sağ: Düzenle (eski Stüdyo), Ayarlar (eski Çark) ve Sil */}
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => onOpenStudio(app)}
            className="admin-btn admin-btn-sm admin-btn-primary"
            style={{ padding: '4px 10px', fontSize: '0.74rem', whiteSpace: 'nowrap', fontWeight: 600 }}
            title="Uygulama İçeriğini ve Görsel Sayfasını Düzenle"
          >
            Düzenle
          </button>

          <button
            type="button"
            onClick={() => onEditAppModal(app)}
            className="admin-btn admin-btn-sm"
            style={{ padding: '4px 8px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
            title="Temel Form Ayarları (Kategori, Platform, Slug, Mağaza Linkleri)"
          >
            Ayarlar
          </button>

          <button
            type="button"
            onClick={() => onDeleteApp(app)}
            className="admin-btn admin-btn-sm admin-btn-delete"
            style={{ padding: '4px 7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Uygulamayı Sil"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
