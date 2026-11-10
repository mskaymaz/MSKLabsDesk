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
const GA_CONSOLE_URL = 'https://analytics.google.com/';

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
    <div className={`analytics-view-container ${isFullscreen ? 'fixed inset-0 z-50 p-4 bg-slate-900' : 'space-y-4'}`}>
      {/* Üst Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <BarChart3 size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-slate-100 m-0">Ziyaretçi & Platform İstatistikleri</h1>
              <span className="bg-emerald-500/15 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={12} /> GA4 Canlı: G-MQZ4CDTHWD
              </span>
            </div>
            <p className="text-xs text-slate-400 m-0 mt-0.5">
              40 web sayfası, arama motoru indeksleri ve platform telemetrisi ($0 maliyet).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-sm transition-all"
          >
            <ExternalLink size={14} />
            <span>Google Analytics Aç</span>
          </a>
        </div>
      </div>

      {feedback && (
        <div className={`p-3 rounded-lg text-xs font-medium flex items-center justify-between ${feedback.type === 'success' ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200' : 'bg-rose-950/60 border border-rose-800 text-rose-200'}`}>
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {/* İframe Varsa Göster */}
      {embedUrl ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden relative" style={{ height: isFullscreen ? 'calc(100vh - 100px)' : '720px' }}>
          {iframeLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm z-10 gap-2">
              <RefreshCw size={28} className="animate-spin text-blue-400" />
              <p className="text-sm font-medium text-slate-200">Looker Studio Raporu Yükleniyor...</p>
            </div>
          )}
          <iframe
            key={refreshKey}
            src={embedUrl}
            title="Google Analytics Looker Studio Raporu"
            className="w-full h-full border-none bg-white rounded-xl"
            loading="lazy"
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            onLoad={() => setIframeLoading(false)}
          />
        </div>
      ) : (
        /* Standalone İstatistik ve Rapor Merkezi */
        <div className="space-y-4">
          {/* GA4 Canlı Hızlı Erişim Kartları */}
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5">
              Google Analytics 4 — Doğrudan Canlı Raporlar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <a
                href="https://analytics.google.com/analytics/web/#/realtime"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-blue-500/50 rounded-xl p-3.5 transition-all group shadow-sm block"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Users size={18} />
                  </div>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0">Anlık Ziyaretçiler</h3>
                <p className="text-xs text-slate-400 m-0 mt-1">Son 30 dakikadaki canlı kullanıcılar ve aktif sayfalar</p>
              </a>

              <a
                href="https://analytics.google.com/analytics/web/#/reports/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl p-3.5 transition-all group shadow-sm block"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0">Bölgesel Harita</h3>
                <p className="text-xs text-slate-400 m-0 mt-1">Türkiye illeri ve dünya genelinde ziyaretçi yoğunluğu</p>
              </a>

              <a
                href="https://analytics.google.com/analytics/web/#/reports/reportinghub"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-purple-500/50 rounded-xl p-3.5 transition-all group shadow-sm block"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0">Popüler Sayfalar</h3>
                <p className="text-xs text-slate-400 m-0 mt-1">Blog makaleleri, uygulamalar ve sayfa görüntüleme sayıları</p>
              </a>

              <a
                href="https://analytics.google.com/analytics/web/#/reports/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 hover:border-amber-500/50 rounded-xl p-3.5 transition-all group shadow-sm block"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center">
                    <TrendingUp size={18} />
                  </div>
                  <ExternalLink size={14} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <h3 className="text-sm font-bold text-slate-200 m-0">Trafik & Arama</h3>
                <p className="text-xs text-slate-400 m-0 mt-1">Google organik arama, doğrudan ve yönlendiren kaynaklar</p>
              </a>
            </div>
          </div>

          {/* Platform Canlı Telemetrisi (D1 Veritabanı) */}
          <div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-2.5">
              MSK Labs — Canlı Platform Telemetrisi
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <BookOpen size={14} className="text-blue-400" />
                  <span>Blog Yazıları</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">{platformStats.posts}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Yayında içerikler</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <MessageSquare size={14} className="text-emerald-400" />
                  <span>Yorumlar</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">{platformStats.comments}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Okuyucu etkileşimi</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Mail size={14} className="text-purple-400" />
                  <span>Destek Talepleri</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">{platformStats.tickets}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Gelen biletler</div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Users size={14} className="text-amber-400" />
                  <span>Bülten Aboneleri</span>
                </div>
                <div className="text-2xl font-bold text-slate-100">{platformStats.subscribers}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Kayıtlı e-posta</div>
              </div>
            </div>
          </div>

          {/* İsteğe Bağlı Looker Studio Gömme Kutusu */}
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe2 size={14} className="text-blue-400" /> Looker Studio Raporunu Bu Sayfaya Sabitlemek İsterseniz:
              </span>
              <span className="text-[11px] text-slate-500">Opsiyonel</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://lookerstudio.google.com/embed/reporting/..."
                className="flex-1 min-w-[260px] bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
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
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 m-0">Looker Studio Bağlantısı</h3>
              <button onClick={() => setShowConfigModal(false)} className="text-slate-400 hover:text-white"><X size={16} /></button>
            </div>
            <p className="text-xs text-slate-400">
              Mevcut gömülü rapor bağlantısını güncelleyebilir veya boş bırakıp kaydederek raporu kaldırabilirsiniz.
            </p>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://lookerstudio.google.com/embed/reporting/..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 pt-2">
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
