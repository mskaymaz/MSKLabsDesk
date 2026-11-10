import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ExternalLink, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Settings2, 
  Globe2, 
  Users, 
  MapPin, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  Mail, 
  BookOpen, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';

const STORAGE_KEY = 'msklabs_analytics_embed_url';
const GA_CONSOLE_URL = 'https://analytics.google.com/analytics/web/#/realtime';

const isValidEmbedUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return trimmed.startsWith('https://lookerstudio.google.com/embed/') || trimmed.startsWith('https://datastudio.google.com/embed/');
};

export const AnalyticsView: React.FC = () => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [inputUrl, setInputUrl] = useState<string>('');
  const [iframeLoading, setIframeLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Platform canlı telemetrisi
  const [platformStats, setPlatformStats] = useState({
    tickets: 0,
    comments: 0,
    subscribers: 0,
    posts: 0
  });

  useEffect(() => {
    // 1. LocalStorage kontrolü ve geçersiz göreli URL'leri temizleme
    const localSaved = localStorage.getItem(STORAGE_KEY) || '';
    if (isValidEmbedUrl(localSaved)) {
      setEmbedUrl(localSaved);
      setInputUrl(localSaved);
    } else if (localSaved) {
      localStorage.removeItem(STORAGE_KEY);
    }

    // 2. D1 üzerinden site_settings çekme
    api.getTemplates()
      .then((res) => {
        const list = res.templates || [];
        const siteTpl = list.find((t: any) => t.key_name === 'site_settings');
        if (siteTpl && siteTpl.meta_json) {
          try {
            const meta = typeof siteTpl.meta_json === 'string' ? JSON.parse(siteTpl.meta_json) : siteTpl.meta_json;
            if (isValidEmbedUrl(meta.analytics_embed_url)) {
              setEmbedUrl(meta.analytics_embed_url);
              setInputUrl(meta.analytics_embed_url);
              localStorage.setItem(STORAGE_KEY, meta.analytics_embed_url);
            }
          } catch {
            /* JSON ayrıştırma hatasını yut */
          }
        }
      })
      .catch((err) => console.error('Analytics ayar hatası:', err));

    // 3. Canlı D1 telemetrisini çekme
    Promise.allSettled([
      api.getTickets().then(r => r.tickets?.length || 0),
      api.getComments().then(r => r.comments?.length || 0),
      api.getSubscribers().then(r => r.subscribers?.length || 0),
      api.getPosts().then(r => r.posts?.length || 0)
    ]).then(([t, c, s, p]) => {
      setPlatformStats({
        tickets: t.status === 'fulfilled' ? t.value : 0,
        comments: c.status === 'fulfilled' ? c.value : 0,
        subscribers: s.status === 'fulfilled' ? s.value : 0,
        posts: p.status === 'fulfilled' ? p.value : 0
      });
    });
  }, []);

  const handleSaveUrl = async (urlToSave: string) => {
    const cleaned = urlToSave.trim();
    setSaving(true);
    setFeedback(null);

    if (cleaned !== '' && !isValidEmbedUrl(cleaned)) {
      setSaving(false);
      setFeedback({
        type: 'error',
        message: 'Geçersiz bağlantı! Bağlantı https://lookerstudio.google.com/embed/ ile başlamalıdır. Mülk kodu (G-...) gömme linki değildir.'
      });
      return;
    }

    try {
      if (cleaned === '') {
        localStorage.removeItem(STORAGE_KEY);
      } else {
        localStorage.setItem(STORAGE_KEY, cleaned);
      }
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

      setFeedback({ 
        type: 'success', 
        message: cleaned === '' ? 'Rapor bağlantısı temizlendi.' : 'Looker Studio bağlantısı başarıyla kaydedildi.' 
      });
      setShowConfigModal(false);
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Kayıt sırasında hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: isFullscreen ? 'fixed' : 'relative',
      inset: isFullscreen ? '0' : 'auto',
      zIndex: isFullscreen ? 9999 : 'auto',
      background: isFullscreen ? '#0f172a' : 'transparent',
      padding: isFullscreen ? '16px 20px' : '0 0 20px 0',
      minHeight: isFullscreen ? '100vh' : 'auto',
      boxSizing: 'border-box'
    }}>
      {/* Üst Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        background: 'var(--bg-card, #1e293b)',
        padding: '14px 20px',
        borderRadius: '12px',
        border: '1px solid var(--border-color, #334155)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>
                Ziyaretçi & Platform İstatistikleri
              </h1>
              <span style={{
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={12} /> GA4 Canlı: G-MQZ4CDTHWD
              </span>
            </div>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)' }}>
              40 web sayfası, arama motoru indeksleri ve platform telemetrisi ($0 maliyet).
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {embedUrl && (
            <>
              <Button variant="secondary" size="sm" onClick={() => { setIframeLoading(true); setRefreshKey(k => k + 1); }}>
                <RefreshCw size={14} className={iframeLoading ? 'animate-spin' : ''} />
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowConfigModal(true)}>
                <Settings2 size={14} /> <span>Rapor Ayarı</span>
              </Button>
            </>
          )}

          <a
            href={GA_CONSOLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#fff',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)'
            }}
          >
            <ExternalLink size={14} />
            <span>Google Analytics Aç</span>
          </a>
        </div>
      </div>

      {feedback && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: feedback.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          border: `1px solid ${feedback.type === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: feedback.type === 'success' ? '#4ade80' : '#f87171'
        }}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* İframe Varsa Göster */}
      {embedUrl ? (
        <div style={{
          background: 'var(--bg-card, #1e293b)',
          border: '1px solid var(--border-color, #334155)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          height: isFullscreen ? 'calc(100vh - 100px)' : '720px'
        }}>
          {iframeLoading && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(3px)',
              zIndex: 10,
              gap: '8px'
            }}>
              <RefreshCw size={28} className="animate-spin" style={{ color: '#60a5fa' }} />
              <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 500, color: '#e2e8f0' }}>Looker Studio Raporu Yükleniyor...</p>
            </div>
          )}
          <iframe
            key={refreshKey}
            src={embedUrl}
            title="Google Analytics Looker Studio Raporu"
            style={{ width: '100%', height: '100%', border: 'none', background: '#fff', borderRadius: '12px' }}
            loading="lazy"
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            onLoad={() => setIframeLoading(false)}
          />
        </div>
      ) : (
        /* Standalone İstatistik ve Rapor Merkezi */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* GA4 Canlı Hızlı Erişim Kartları */}
          <div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--text-muted, #94a3b8)' }}>
              Google Analytics 4 — Doğrudan Canlı Raporlar
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '12px'
            }}>
              <a
                href="https://analytics.google.com/analytics/web/#/realtime"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--bg-card, #1e293b)',
                  border: '1px solid var(--border-color, #334155)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={18} />
                  </div>
                  <ExternalLink size={14} style={{ color: '#64748b' }} />
                </div>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>Anlık Ziyaretçiler</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.4 }}>Son 30 dakikadaki canlı kullanıcılar ve aktif sayfalar</p>
              </a>

              <a
                href="https://analytics.google.com/analytics/web/#/reports/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--bg-card, #1e293b)',
                  border: '1px solid var(--border-color, #334155)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={18} />
                  </div>
                  <ExternalLink size={14} style={{ color: '#64748b' }} />
                </div>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>Bölgesel Harita</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.4 }}>Türkiye illeri ve dünya genelinde ziyaretçi yoğunluğu</p>
              </a>

              <a
                href="https://analytics.google.com/analytics/web/#/reports/reportinghub"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--bg-card, #1e293b)',
                  border: '1px solid var(--border-color, #334155)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={18} />
                  </div>
                  <ExternalLink size={14} style={{ color: '#64748b' }} />
                </div>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>Popüler Sayfalar</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.4 }}>Blog makaleleri, uygulamalar ve sayfa görüntüleme sayıları</p>
              </a>

              <a
                href="https://analytics.google.com/analytics/web/#/reports/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: 'var(--bg-card, #1e293b)',
                  border: '1px solid var(--border-color, #334155)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'border-color 0.2s',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={18} />
                  </div>
                  <ExternalLink size={14} style={{ color: '#64748b' }} />
                </div>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>Trafik & Arama</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.4 }}>Google organik arama, doğrudan ve yönlendiren kaynaklar</p>
              </a>
            </div>
          </div>

          {/* Platform Canlı Telemetrisi (D1 Veritabanı) */}
          <div>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--text-muted, #94a3b8)' }}>
              MSK Labs — Canlı Platform Telemetrisi
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px'
            }}>
              <div style={{ background: 'var(--bg-card, #1e293b)', border: '1px solid var(--border-color, #334155)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <BookOpen size={15} style={{ color: '#60a5fa' }} />
                  <span>Blog Yazıları</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>{platformStats.posts}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>Yayında içerikler</div>
              </div>

              <div style={{ background: 'var(--bg-card, #1e293b)', border: '1px solid var(--border-color, #334155)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <MessageSquare size={15} style={{ color: '#4ade80' }} />
                  <span>Yorumlar</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>{platformStats.comments}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>Okuyucu etkileşimi</div>
              </div>

              <div style={{ background: 'var(--bg-card, #1e293b)', border: '1px solid var(--border-color, #334155)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <Mail size={15} style={{ color: '#c084fc' }} />
                  <span>Destek Talepleri</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>{platformStats.tickets}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>Gelen biletler</div>
              </div>

              <div style={{ background: 'var(--bg-card, #1e293b)', border: '1px solid var(--border-color, #334155)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.82rem', marginBottom: '6px' }}>
                  <Users size={15} style={{ color: '#fbbf24' }} />
                  <span>Bülten Aboneleri</span>
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>{platformStats.subscribers}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>Kayıtlı e-posta</div>
              </div>
            </div>
          </div>

          {/* İsteğe Bağlı Looker Studio Gömme Kutusu */}
          <div style={{
            background: 'var(--bg-card, #1e293b)',
            border: '1px solid var(--border-color, #334155)',
            borderRadius: '12px',
            padding: '16px 20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary, #f8fafc)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Globe2 size={16} style={{ color: '#60a5fa' }} /> Looker Studio Raporunu Bu Sayfaya Sabitlemek İsterseniz:
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #94a3b8)' }}>Opsiyonel</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://lookerstudio.google.com/embed/reporting/..."
                style={{
                  flex: 1,
                  minWidth: '260px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, #475569)',
                  background: 'var(--bg-input, #0f172a)',
                  color: 'var(--text-primary, #f8fafc)',
                  fontSize: '0.85rem'
                }}
              />
              <Button size="sm" onClick={() => handleSaveUrl(inputUrl)} disabled={saving}>
                {saving ? 'Kaydediliyor...' : 'Bağla & Göster'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rapor Bağlantısı Değiştirme Modalı */}
      {showConfigModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: 'var(--bg-card, #1e293b)',
            border: '1px solid var(--border-color, #334155)',
            borderRadius: '14px',
            padding: '20px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>Looker Studio Bağlantısı</h3>
              <button onClick={() => setShowConfigModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.4 }}>
              Mevcut gömülü rapor bağlantısını güncelleyebilir veya boş bırakıp kaydederek raporu kaldırabilirsiniz.
            </p>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://lookerstudio.google.com/embed/reporting/..."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '8px',
                border: '1px solid var(--border-color, #475569)',
                background: 'var(--bg-input, #0f172a)',
                color: 'var(--text-primary, #f8fafc)',
                fontSize: '0.85rem',
                boxSizing: 'border-box'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '6px' }}>
              <Button variant="secondary" size="sm" onClick={() => setShowConfigModal(false)}>İptal</Button>
              <Button size="sm" onClick={() => handleSaveUrl(inputUrl)} disabled={saving}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
