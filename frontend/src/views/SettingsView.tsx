import React, { useState, useEffect } from 'react';
import { Bell, Mail, Save, Check, Shield, Globe, Sun, Moon } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Switch } from '../components/ui/Input';
import { useTranslation } from '../context/I18nContext';

export const SettingsView: React.FC = () => {
  const { t } = useTranslation();
  const { user, hasPermission } = useAuth();
  const { theme, setTheme } = useTheme();
  const [siteTitle, setSiteTitle] = useState('MSK Labs Desk');
  const [siteUrl, setSiteUrl] = useState('https://msklabs.org');
  const [senderName, setSenderName] = useState('MSK Labs');
  const [senderEmail, setSenderEmail] = useState('msklabs.org@gmail.com');
  const [turnstileEnabled, setTurnstileEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'SUPER_ADMIN' || hasPermission('settings.manage');

  useEffect(() => {
    api.getTemplates().then((res) => {
      const list = res.templates || [];
      const item = list.find((tItem: any) => tItem.key_name === 'site_settings');
      if (item && item.meta_json) {
        try {
          const cfg = typeof item.meta_json === 'string' ? JSON.parse(item.meta_json) : item.meta_json;
          if (cfg.siteTitle) setSiteTitle(cfg.siteTitle);
          if (cfg.siteUrl) setSiteUrl(cfg.siteUrl);
          if (cfg.senderName) setSenderName(cfg.senderName);
          if (cfg.senderEmail) setSenderEmail(cfg.senderEmail);
          if (cfg.turnstileEnabled !== undefined) setTurnstileEnabled(cfg.turnstileEnabled);
          if (cfg.pushEnabled !== undefined) setPushEnabled(cfg.pushEnabled);
        } catch {}
      }
    }).catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateTemplate({
        key_name: 'site_settings',
        content_tr: siteTitle,
        meta_json: {
          siteTitle,
          siteUrl,
          senderName,
          senderEmail,
          turnstileEnabled,
          pushEnabled,
        },
        is_active: true,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      alert(err.message || 'Ayarlar kaydedilemedi.');
    }
  };

  const togglePush = () => {
    if (!pushEnabled) {
      if ('Notification' in window) {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            setPushEnabled(true);
          } else {
            alert(t('settings.pushDenied'));
          }
        });
      } else {
        alert(t('settings.pushUnsupported'));
      }
    } else {
      setPushEnabled(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="glass-card" style={{ padding: '32px', textAlign: 'center', margin: '40px auto', maxWidth: '600px' }}>
        <Shield size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Erişim Engellendi</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
          Sistem ayarlarını değiştirme yetkiniz (`settings.manage`) bulunmamaktadır. Lütfen Super Admin ile iletişime geçin.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '16px' }}>
        <h1 className="admin-page-title">{t('settings.title')}</h1>
        <p className="admin-page-desc">Sistem yapılandırması, bildirimler ve arayüz seçenekleri</p>
      </div>

      <div className="admin-list-card" style={{ padding: '24px' }}>
        <form onSubmit={handleSave}>
          {/* Site Bilgileri */}
          <div style={{ marginBottom: '24px' }}>
            <h3 className="admin-card-title" style={{ fontSize: '0.95rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={16} color="var(--accent-primary)" /> Genel Site Bilgileri
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Site Başlığı</label>
                <input
                  type="text"
                  className="form-input"
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Site URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={siteUrl}
                  onChange={(e) => setSiteUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Arayüz Teması</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`admin-btn admin-btn-sm ${theme === 'dark' ? 'admin-btn-primary' : 'admin-btn-refresh'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Moon size={13} /> Karanlık (Dark)
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`admin-btn admin-btn-sm ${theme === 'light' ? 'admin-btn-primary' : 'admin-btn-refresh'}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Sun size={13} /> Aydınlık (Light)
                </button>
              </div>
            </div>
          </div>

          {/* E-Posta Servisi */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} color="var(--accent-cyan)" /> E-Posta Servis Ayarları
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{t('settings.senderName')}</label>
                <input
                  type="text"
                  className="form-input"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('settings.senderEmail')}</label>
                <input
                  type="email"
                  className="form-input"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Güvenlik & Turnstile */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} color="var(--accent-emerald)" /> Bot Koruması & Güvenlik
            </h3>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '14px'
            }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>Cloudflare Turnstile Bot Koruması</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Destek ve yorum formlarında otomatik bot doğrulama filtresini etkinleştirir.</span>
              </div>
              <Switch
                checked={turnstileEnabled}
                onChange={(e) => setTurnstileEnabled(e.target.checked)}
                aria-label="Cloudflare Turnstile Toggle"
              />
            </div>
          </div>

          {/* Push Bildirimleri */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--accent-amber)" /> {t('settings.pushNotifications')}
            </h3>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              background: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>{t('settings.enablePush')}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Masaüstü ve mobil PWA'ya anlık bildirimler gönderilir.</span>
              </div>
              <button
                type="button"
                className={`admin-btn admin-btn-sm ${pushEnabled ? 'admin-btn-success' : 'admin-btn-refresh'}`}
                onClick={togglePush}
              >
                {pushEnabled ? 'Etkin' : t('settings.enablePush')}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="submit" className="admin-btn admin-btn-primary admin-btn-md">
              {saved ? <Check size={15} /> : <Save size={15} />} {saved ? t('common.save') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
