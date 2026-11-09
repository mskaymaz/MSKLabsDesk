import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ExternalLink, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Settings2, 
  Globe2, 
  CheckCircle2, 
  Info, 
  X,
  PieChart
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { NativeStatsDashboard } from '../components/analytics/NativeStatsDashboard';

const STORAGE_KEY = 'msklabs_analytics_embed_url';
const GA_CONSOLE_URL = 'https://analytics.google.com/';

export const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'native' | 'looker'>('native');
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Ayarları D1 ve LocalStorage üzerinden çek
  useEffect(() => {
    const localSaved = localStorage.getItem(STORAGE_KEY) || '';
    if (localSaved) {
      setEmbedUrl(localSaved);
      setInputUrl(localSaved);
    }

    api.getTemplates()
      .then((res) => {
        const list = res.templates || [];
        const siteTpl = list.find((t: any) => t.key_name === 'site_settings');
        if (siteTpl && siteTpl.meta_json) {
          try {
            const meta = typeof siteTpl.meta_json === 'string' ? JSON.parse(siteTpl.meta_json) : siteTpl.meta_json;
            if (meta.analytics_embed_url) {
              setEmbedUrl(meta.analytics_embed_url);
              setInputUrl(meta.analytics_embed_url);
              localStorage.setItem(STORAGE_KEY, meta.analytics_embed_url);
            }
          } catch {
            /* JSON ayrıştırma hatasını yut */
          }
        }
      })
      .catch((err) => {
        console.error('Analytics ayar yükleme hatası:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. URL'yi D1'e ve LocalStorage'a kaydet
  const handleSaveUrl = async (urlToSave: string) => {
    const cleaned = urlToSave.trim();
    setSaving(true);
    setFeedback(null);

    try {
      localStorage.setItem(STORAGE_KEY, cleaned);
      setEmbedUrl(cleaned);

      const res = await api.getTemplates();
      const list = res.templates || [];
      const siteTpl = list.find((t: any) => t.key_name === 'site_settings');
      let currentMeta: any = {};
      if (siteTpl && siteTpl.meta_json) {
        currentMeta = typeof siteTpl.meta_json === 'string' ? JSON.parse(siteTpl.meta_json) : siteTpl.meta_json;
      }

      currentMeta.analytics_embed_url = cleaned;

      await api.updateTemplate({
        key_name: 'site_settings',
        meta_json: JSON.stringify(currentMeta),
        content_tr: siteTpl?.content_tr || 'Site Genel Ayarları',
        is_active: 1,
      });

      setFeedback({ type: 'success', message: 'Looker Studio bağlantısı başarıyla kaydedildi.' });
      setShowConfigModal(false);
      setActiveTab('looker');
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Kayıt sırasında bir hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'looker') {
      setIframeLoading(true);
    }
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className={`analytics-view-container animate-fade-in ${isFullscreen ? 'fullscreen-mode' : ''}`} style={{
      display: 'flex',
      flexDirection: 'column',
      height: isFullscreen ? '100vh' : 'calc(100vh - 40px)',
      position: isFullscreen ? 'fixed' : 'relative',
      top: isFullscreen ? 0 : 'auto',
      left: isFullscreen ? 0 : 'auto',
      right: isFullscreen ? 0 : 'auto',
      bottom: isFullscreen ? 0 : 'auto',
      zIndex: isFullscreen ? 9999 : 'auto',
      background: 'var(--bg-primary, #0f172a)',
      padding: isFullscreen ? '16px 20px' : '0 0 16px 0',
      boxSizing: 'border-box'
    }}>
      {/* Üst Başlık & Sekmeler Barı */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '14px',
        background: 'var(--bg-card, #1e293b)',
        padding: '12px 18px',
        borderRadius: '12px',
        border: '1px solid var(--border-color, #334155)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
                Ziyaretçi & Bölgesel İstatistikler
              </h1>
              <span style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                Canlı Analitik
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)' }}>
              Türkiye ve dünya geneli yöresel ziyaretler, anlık etkileşim ve sayfa dökümü ($0 maliyet).
            </p>
          </div>
        </div>

        {/* Görünüm Sekmeleri & Aksiyonlar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* İki Görünüm Modu: Yerleşik vs Looker Studio */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <button
              onClick={() => setActiveTab('native')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'native' ? '#3b82f6' : 'transparent',
                color: activeTab === 'native' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <PieChart size={14} />
              <span>Canlı Genel Bakış</span>
            </button>
            <button
              onClick={() => setActiveTab('looker')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'looker' ? '#3b82f6' : 'transparent',
                color: activeTab === 'looker' ? '#fff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Globe2 size={14} />
              <span>Google Looker Studio</span>
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            title="Verileri Yenile"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={iframeLoading && activeTab === 'looker' ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Yenile</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Tam Ekrandan Çık' : 'Tam Ekran'}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </Button>

          {activeTab === 'looker' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowConfigModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Settings2 size={14} />
              <span>Bağlantı Ayarı</span>
            </Button>
          )}

          <a
            href={GA_CONSOLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)'
            }}
          >
            <ExternalLink size={14} />
            <span className="hidden md:inline">GA4 Konsolu</span>
          </a>
        </div>
      </div>

      {/* Geri Bildirim */}
      {feedback && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          marginBottom: '12px',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: feedback.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: feedback.type === 'success' ? '#4ade80' : '#f87171',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
        }}>
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <Info size={16} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Ana Gövde */}
      <div style={{
        flex: 1,
        background: 'var(--bg-card, #1e293b)',
        borderRadius: '12px',
        border: '1px solid var(--border-color, #334155)',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {activeTab === 'native' ? (
          /* 1. SEÇENEK: Hemen Çalışan Canlı Ziyaretçi & Yöresel İl Dağılımı */
          <NativeStatsDashboard key={refreshKey} />
        ) : (
          /* 2. SEÇENEK: Looker Studio Embed veya Kurulum Kutusu */
          loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text-muted)' }}>
              <RefreshCw size={28} className="animate-spin text-blue-500" />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>Ayar bilgileri yükleniyor...</p>
            </div>
          ) : embedUrl ? (
            <>
              {iframeLoading && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(3px)',
                  zIndex: 2,
                  gap: '10px'
                }}>
                  <RefreshCw size={32} className="animate-spin" style={{ color: '#60a5fa' }} />
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 500 }}>
                    Google Looker Studio Raporu Yükleniyor...
                  </p>
                </div>
              )}
              <iframe
                key={refreshKey}
                src={embedUrl}
                title="Google Analytics Looker Studio Raporu"
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px', background: '#ffffff' }}
                loading="lazy"
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                onLoad={() => setIframeLoading(false)}
              />
            </>
          ) : (
            <div style={{ maxWidth: '640px', margin: 'auto', padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe2 size={26} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Looker Studio Haritası Henüz Bağlanmadı
              </h2>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Google Analytics mülkünüz için oluşturduğunuz Looker Studio embed bağlantısını buraya yapıştırarak Google haritanızı ekleyebilirsiniz. Dilerseniz <strong>"Canlı Genel Bakış"</strong> sekmesinden yerleşik bölgesel analizi hemen inceleyebilirsiniz.
              </p>
              <div style={{ width: '100%', display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://lookerstudio.google.com/embed/reporting/..."
                  style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input, #0f172a)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
                />
                <Button variant="primary" onClick={() => handleSaveUrl(inputUrl)} disabled={saving || !inputUrl.trim()}>
                  {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </div>
          )
        )}
      </div>

      {/* URL Düzenleme Modalı */}
      {showConfigModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '16px'
        }}>
          <div style={{
            background: 'var(--bg-card, #1e293b)',
            borderRadius: '14px',
            border: '1px solid var(--border-color, #334155)',
            width: '100%',
            maxWidth: '500px',
            padding: '20px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings2 size={18} style={{ color: '#60a5fa' }} />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Looker Studio Rapor Bağlantısı
                </h3>
              </div>
              <button onClick={() => setShowConfigModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Google Looker Studio üzerinden alınan "Raporu Göm" iframe adresini giriniz.
            </p>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://lookerstudio.google.com/embed/reporting/..."
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-input, #0f172a)', color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '16px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button variant="secondary" size="sm" onClick={() => setShowConfigModal(false)}>Vazgeç</Button>
              <Button variant="primary" size="sm" onClick={() => handleSaveUrl(inputUrl)} disabled={saving}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
