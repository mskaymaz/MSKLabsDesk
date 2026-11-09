import React from 'react';
import { AlertTriangle, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Switch, Input } from '../ui/Input';
import type { MaintenanceConfig, MaintenanceRoute } from '../../types';

interface MaintenanceSettingsSectionProps {
  maintenance: MaintenanceConfig;
  setMaintenance: React.Dispatch<React.SetStateAction<MaintenanceConfig>>;
}

export const MaintenanceSettingsSection: React.FC<MaintenanceSettingsSectionProps> = ({
  maintenance,
  setMaintenance,
}) => {
  const handleGlobalToggle = (checked: boolean) => {
    setMaintenance((prev) => ({
      ...prev,
      global: checked,
    }));
  };

  const handleRouteToggle = (path: string, checked: boolean) => {
    setMaintenance((prev) => ({
      ...prev,
      routes: prev.routes.map((r) => (r.path === path ? { ...r, enabled: checked } : r)),
    }));
  };

  const handleMessageChange = (val: string) => {
    setMaintenance((prev) => ({
      ...prev,
      message: val,
    }));
  };

  const handleEtaChange = (val: string) => {
    setMaintenance((prev) => ({
      ...prev,
      eta: val,
    }));
  };

  return (
    <div className="admin-list-card" style={{ padding: '24px', marginBottom: '20px' }}>
      <h3
        className="admin-card-title"
        style={{
          fontSize: '0.95rem',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <AlertTriangle size={16} color="var(--accent-rose)" /> Çok Katmanlı Bakım Modu & Rota Matrisi
      </h3>

      {/* 1. Global Bakım Anahtarı */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: maintenance.global ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: maintenance.global ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border-color)',
          marginBottom: '20px',
        }}
      >
        <div>
          <strong
            style={{
              fontSize: '0.92rem',
              color: maintenance.global ? 'var(--accent-rose)' : 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AlertTriangle size={15} /> Genel Site Bakım Modu (Tüm Sayfalar)
          </strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {maintenance.global
              ? 'Tüm web sitesi ziyaretçilere HTTP 503 bakım sayfası verir; yönetici paneli ve yöneticiler erişebilir kalır.'
              : 'Web sitesi genel yayındadır. Sayfa bazlı bakım aşağıdan yönetilir.'}
          </span>
        </div>
        <Switch
          checked={maintenance.global}
          onChange={(e) => handleGlobalToggle(e.target.checked)}
          aria-label="Genel Bakım Modu Anahtarı"
        />
      </div>

      {/* 2. Özel Mesaj ve ETA Saati */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '16px', marginBottom: '20px' }}>
        <Input
          label="Bakım Açıklaması / Duyuru Metni"
          value={maintenance.message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="Sistemimiz şu anda planlı bakım çalışmaları nedeniyle geçici olarak hizmet verememektedir."
        />

        <Input
          label="Tahmini Bitiş (ETA)"
          value={maintenance.eta}
          onChange={(e) => handleEtaChange(e.target.value)}
          placeholder="Örn: 18:30 veya 1 Saat"
          helperText="Ziyaretçiye gösterilecek tahmini süre"
        />
      </div>

      {/* 3. Sayfa/Rota Bazlı Granular Seçim Matrisi */}
      <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={14} color="var(--accent-cyan)" /> Sayfa / Rota Bazlı Bakım Seçim Matrisi
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Tüm siteyi kapatmadan yalnızca üzerinde çalıştığınız modülü izole edebilirsiniz.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#16a34a' }}>
            <ShieldCheck size={14} /> Yönetici Muafiyeti Aktif
          </div>
        </div>

        <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>Sayfa / Modül Adı</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>Rota Yolu (URL)</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)' }}>Canlı Durum</th>
                <th style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--text-muted)', textAlign: 'right' }}>Bakım Kilidi</th>
              </tr>
            </thead>
            <tbody>
              {maintenance.routes.map((route: MaintenanceRoute) => {
                const isUnderMaintenance = maintenance.global || route.enabled;

                return (
                  <tr
                    key={route.path}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      background: route.enabled ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {route.title}
                    </td>
                    <td style={{ padding: '10px 14px', color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>
                      {route.path}
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      {isUnderMaintenance ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f87171', fontWeight: 700, fontSize: '0.74rem' }}>
                          <AlertTriangle size={12} /> {maintenance.global ? 'Genel Bakımda' : 'Bakımda'}
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 700, fontSize: '0.74rem' }}>
                          <CheckCircle2 size={12} /> Yayında
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                      <Switch
                        checked={route.enabled}
                        onChange={(e) => handleRouteToggle(route.path, e.target.checked)}
                        disabled={maintenance.global}
                        aria-label={`${route.title} Bakım Anahtarı`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
