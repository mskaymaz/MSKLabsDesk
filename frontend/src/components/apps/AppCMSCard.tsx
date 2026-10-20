import React from 'react';
import {
  Smartphone, Edit2, Trash2, Rocket,
  Copy, Check, Download, Layers
} from 'lucide-react';
import type { AppItem } from '../../types';
import { getAppIconUrl } from '../../utils/appIcons';
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
            {getAppIconUrl(app.icon_url, app.app_id) ? (
              <img
                src={getAppIconUrl(app.icon_url, app.app_id)}
                alt={app.name_tr}
                style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
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

      {/* Aksiyon Butonları */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
        <button
          type="button"
          onClick={() => onToggleVersions(app.id)}
          className="admin-btn admin-btn-sm"
          style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
          title="Tüm sürümleri gör"
        >
          <Layers size={13} />
          <span>Sürümler ({app.versions?.length || 0})</span>
        </button>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => onOpenVersionModal(app)}
            className="admin-btn admin-btn-sm admin-btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
            title="Hızlıca yeni APK / Dağıtım sürümü yayınla"
          >
            <Rocket size={13} />
            <span>Yeni Sürüm</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenStudio(app)}
            className="admin-btn admin-btn-sm admin-btn-primary"
            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
            title="Görsel Tuval Stüdyosunu Başlat"
          >
            <Edit2 size={13} />
            <span>Görsel Stüdyo</span>
          </button>

          <button
            type="button"
            onClick={() => onEditAppModal(app)}
            className="admin-btn admin-btn-sm"
            style={{ padding: '4px 8px', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
            title="Hızlı Ayarlar Modalı"
          >
            Ayarlar
          </button>

          <button
            type="button"
            onClick={() => onDeleteApp(app)}
            className="admin-btn admin-btn-sm admin-btn-delete"
            style={{ flexShrink: 0 }}
            title="Uygulamayı Sil"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
