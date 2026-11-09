import React, { useState, useEffect } from 'react';
import {
  Globe,
  Mail,
  Shield,
  AlertTriangle,
  Cpu,
  Save,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Tabs } from '../components/ui/CommonUI';
import { GeneralSettingsSection } from '../components/settings/GeneralSettingsSection';
import { EmailSettingsSection } from '../components/settings/EmailSettingsSection';
import { SecuritySettingsSection } from '../components/settings/SecuritySettingsSection';
import { MaintenanceSettingsSection } from '../components/settings/MaintenanceSettingsSection';
import { InfrastructureHealthSection } from '../components/settings/InfrastructureHealthSection';
import type { MaintenanceConfig, MaintenanceRoute } from '../types';

const DEFAULT_MAINTENANCE_ROUTES: MaintenanceRoute[] = [
  { path: '/', title: 'Ana Sayfa (Portal)', enabled: false },
  { path: '/apps.html', title: 'Uygulamalar Kataloğu', enabled: false },
  { path: '/blog', title: 'Blog & Fikir Platformu', enabled: false },
  { path: '/destek.html', title: 'Destek Masası', enabled: false },
  { path: '/about.html', title: 'Hakkımızda', enabled: false },
  { path: '/contact.html', title: 'İletişim & Kurumsal', enabled: false },
  { path: '/faq.html', title: 'Sıkça Sorulan Sorular (SSS)', enabled: false },
  { path: '/cookies.html', title: 'Çerez Politikası', enabled: false },
  { path: '/privacy.html', title: 'Gizlilik Politikası', enabled: false },
  { path: '/terms.html', title: 'Kullanım Koşulları', enabled: false },
  { path: '/kvkk.html', title: 'KVKK Aydınlatma Metni', enabled: false },
];

export const SettingsView: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Durumları
  const [siteTitle, setSiteTitle] = useState('MSK Labs Desk');
  const [siteUrl, setSiteUrl] = useState('https://msklabs.org');
  const [senderName, setSenderName] = useState('MSK Labs Bildirim');
  const [senderEmail, setSenderEmail] = useState('bildirim@msklabs.org');
  const [turnstileEnabled, setTurnstileEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [maintenance, setMaintenance] = useState<MaintenanceConfig>({
    global: false,
    message: 'Sistemimiz şu anda planlı bakım ve iyileştirme çalışmaları nedeniyle geçici olarak hizmet verememektedir.',
    eta: '',
    routes: DEFAULT_MAINTENANCE_ROUTES,
    allowed_ips: [],
  });

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.role === 'SUPER_ADMIN' ||
    hasPermission('settings.manage');

  useEffect(() => {
    setLoading(true);
    api
      .getTemplates()
      .then((res) => {
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

            // Bakım Modu Konfigürasyonu
            if (cfg.maintenance) {
              const loadedRoutes: MaintenanceRoute[] = Array.isArray(cfg.maintenance.routes)
                ? cfg.maintenance.routes
                : [];

              // Sistemdeki eksik yeni rotaları varsayılanlarla tamamla
              const mergedRoutes = DEFAULT_MAINTENANCE_ROUTES.map((defRoute) => {
                const found = loadedRoutes.find((r) => r.path === defRoute.path);
                return found || defRoute;
              });

              setMaintenance({
                global: typeof cfg.maintenance.global === 'boolean' ? cfg.maintenance.global : !!cfg.maintenanceMode,
                message: cfg.maintenance.message || maintenance.message,
                eta: cfg.maintenance.eta || '',
                routes: mergedRoutes,
                allowed_ips: Array.isArray(cfg.maintenance.allowed_ips) ? cfg.maintenance.allowed_ips : [],
              });
            } else if (cfg.maintenanceMode !== undefined) {
              setMaintenance((prev) => ({
                ...prev,
                global: !!cfg.maintenanceMode,
              }));
            }
          } catch (e) {
            console.warn('[SettingsView] meta_json okunamadı:', e);
          }
        }
      })
      .catch((err) => {
        setFeedback({ type: 'error', message: 'Ayarlar yüklenirken hata oluştu: ' + err.message });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
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
          maintenanceMode: maintenance.global, // geriye dönük uyum
          maintenance,
        },
        is_active: true,
      });

      setFeedback({ type: 'success', message: 'Sistem ayarları başarıyla kaydedildi.' });
      setTimeout(() => setFeedback(null), 3500);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Ayarlar kaydedilemedi.' });
    } finally {
      setSaving(false);
    }
  };

  const togglePush = () => {
    if (!pushEnabled) {
      if ('Notification' in window) {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            setPushEnabled(true);
            setFeedback({ type: 'success', message: 'Tarayıcı bildirim izni başarıyla verildi.' });
            setTimeout(() => setFeedback(null), 3000);
          } else {
            setFeedback({ type: 'error', message: 'Bildirim izni tarayıcı tarafından reddedildi.' });
          }
        });
      } else {
        setFeedback({ type: 'error', message: 'Tarayıcınız Web Push bildirimlerini desteklemiyor.' });
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

  const tabs = [
    { id: 'general', label: 'Genel Site', icon: <Globe size={15} /> },
    { id: 'email', label: 'E-Posta & İletişim', icon: <Mail size={15} /> },
    { id: 'security', label: 'Güvenlik & Bot', icon: <Shield size={15} /> },
    { id: 'maintenance', label: 'Bakım & Rota Matrisi', icon: <AlertTriangle size={15} /> },
    { id: 'infrastructure', label: 'Altyapı & API Sağlık', icon: <Cpu size={15} /> },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '940px' }}>
      {/* Üst Başlık & Eylem Çubuğu */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 className="admin-page-title">Sistem Ayarları</h1>
          <p className="admin-page-desc">Site yapılandırması, çok katmanlı bakım modu, güvenlik ve altyapı kontrolleri</p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="admin-btn admin-btn-primary admin-btn-md"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : feedback?.type === 'success' ? <Check size={15} /> : <Save size={15} />}
          {saving ? 'Kaydediliyor...' : feedback?.type === 'success' ? 'Kaydedildi' : 'Ayarları Kaydet'}
        </button>
      </div>

      {/* Geri Bildirim Bildirimi (Toast / Banner) */}
      {feedback && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            fontSize: '0.86rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: feedback.type === 'success' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: feedback.type === 'success' ? '1px solid rgba(22, 163, 74, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
            color: feedback.type === 'success' ? '#16a34a' : '#ef4444',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Sekmeler Navigasyonu */}
      <div style={{ marginBottom: '20px' }}>
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Sekme İçerikleri */}
      {loading ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
          <div>Sistem ayarları yükleniyor...</div>
        </div>
      ) : (
        <form onSubmit={handleSave}>
          {activeTab === 'general' && (
            <GeneralSettingsSection
              siteTitle={siteTitle}
              setSiteTitle={setSiteTitle}
              siteUrl={siteUrl}
              setSiteUrl={setSiteUrl}
            />
          )}

          {activeTab === 'email' && (
            <EmailSettingsSection
              senderName={senderName}
              setSenderName={setSenderName}
              senderEmail={senderEmail}
              setSenderEmail={setSenderEmail}
              pushEnabled={pushEnabled}
              togglePush={togglePush}
            />
          )}

          {activeTab === 'security' && (
            <SecuritySettingsSection
              turnstileEnabled={turnstileEnabled}
              setTurnstileEnabled={setTurnstileEnabled}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceSettingsSection
              maintenance={maintenance}
              setMaintenance={setMaintenance}
            />
          )}

          {activeTab === 'infrastructure' && <InfrastructureHealthSection />}

          {/* Alt Kaydet Butonu */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button
              type="submit"
              disabled={saving}
              className="admin-btn admin-btn-primary admin-btn-md"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
