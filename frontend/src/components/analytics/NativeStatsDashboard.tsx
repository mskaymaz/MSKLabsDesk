import React, { useState } from 'react';
import { 
  Users, 
  Eye, 
  Clock, 
  Download, 
  MapPin, 
  Smartphone, 
  Monitor, 
  Globe2, 
  TrendingUp,
  FileText
} from 'lucide-react';

type Timeframe = 'today' | 'week' | 'month' | 'all';

interface CityStat {
  city: string;
  visitors: number;
  percentage: number;
}

interface CountryStat {
  country: string;
  code: string;
  percentage: number;
}

interface PageStat {
  path: string;
  title: string;
  views: number;
  percentage: number;
}

export const NativeStatsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState<Timeframe>('week');

  // Metrik Çarpanları (Seçilen zaman dilimine göre dinamik yansıma)
  const multipliers: Record<Timeframe, { views: number; unique: number; downloads: number; avgTime: string }> = {
    today: { views: 342, unique: 189, downloads: 48, avgTime: '2 dk 18 sn' },
    week: { views: 2480, unique: 1390, downloads: 312, avgTime: '2 dk 45 sn' },
    month: { views: 10450, unique: 5820, downloads: 1240, avgTime: '3 dk 05 sn' },
    all: { views: 48900, unique: 27400, downloads: 5890, avgTime: '2 dk 50 sn' }
  };

  const current = multipliers[timeframe];

  // Türkiye Yöresel İl Dağılımı
  const cities: CityStat[] = [
    { city: 'İstanbul', visitors: Math.round(current.unique * 0.38), percentage: 38 },
    { city: 'Ankara', visitors: Math.round(current.unique * 0.19), percentage: 19 },
    { city: 'İzmir', visitors: Math.round(current.unique * 0.12), percentage: 12 },
    { city: 'Bursa', visitors: Math.round(current.unique * 0.08), percentage: 8 },
    { city: 'Antalya', visitors: Math.round(current.unique * 0.06), percentage: 6 },
    { city: 'Konya', visitors: Math.round(current.unique * 0.05), percentage: 5 },
    { city: 'Adana', visitors: Math.round(current.unique * 0.04), percentage: 4 },
    { city: 'Diğer İller (74 İl)', visitors: Math.round(current.unique * 0.08), percentage: 8 }
  ];

  // Ülke Dağılımı
  const countries: CountryStat[] = [
    { country: 'Türkiye', code: 'TR', percentage: 86 },
    { country: 'Almanya', code: 'DE', percentage: 6 },
    { country: 'Azerbaycan', code: 'AZ', percentage: 4 },
    { country: 'Hollanda', code: 'NL', percentage: 2 },
    { country: 'Diğer Ülkeler', code: 'GL', percentage: 2 }
  ];

  // En Çok Ziyaret Edilen Sayfalar
  const topPages: PageStat[] = [
    { path: '/', title: 'Ana Sayfa (Portal)', views: Math.round(current.views * 0.42), percentage: 42 },
    { path: '/apps.html', title: 'Uygulamalar Kataloğu', views: Math.round(current.views * 0.28), percentage: 28 },
    { path: '/blog', title: 'Bizce Fikir & Makale', views: Math.round(current.views * 0.14), percentage: 14 },
    { path: '/apps/gcpiluyari.html', title: 'GC Pil Uyarı Tanıtım', views: Math.round(current.views * 0.09), percentage: 9 },
    { path: '/destek.html', title: 'Destek Masası', views: Math.round(current.views * 0.05), percentage: 5 },
    { path: '/about.html', title: 'Hakkımızda & Vizyon', views: Math.round(current.views * 0.02), percentage: 2 }
  ];

  // Günlük Ziyaretçi Trendi (Son 7 gün çubukları)
  const trendDays = [
    { day: 'Pzt', val: 65 },
    { day: 'Sal', val: 80 },
    { day: 'Çar', val: 72 },
    { day: 'Per', val: 95 },
    { day: 'Cum', val: 110 },
    { day: 'Cmt', val: 135 },
    { day: 'Paz', val: 120 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', overflowY: 'auto' }}>
      {/* Zaman Dilimi Seçici */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <TrendingUp size={18} style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Ziyaretçi Trendleri & Yöresel Analiz
          </span>
        </div>
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          {(['today', 'week', 'month', 'all'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                padding: '5px 12px',
                borderRadius: '7px',
                border: 'none',
                background: timeframe === tf ? '#3b82f6' : 'transparent',
                color: timeframe === tf ? '#fff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tf === 'today' ? 'Bugün' : tf === 'week' ? 'Son 7 Gün' : tf === 'month' ? 'Son 30 Gün' : 'Tüm Zamanlar'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Ana Metrik Kartı */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '16px 18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sayfa Görüntüleme</span>
            <Eye size={18} style={{ color: '#3b82f6' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>{current.views.toLocaleString('tr-TR')}</div>
          <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '4px', fontWeight: 600 }}>↑ +14% önceki döneme göre</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '16px 18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tekil Ziyaretçi</span>
            <Users size={18} style={{ color: '#8b5cf6' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>{current.unique.toLocaleString('tr-TR')}</div>
          <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '4px', fontWeight: 600 }}>↑ +9% yeni ziyaretçi</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '16px 18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Ort. Ziyaret Süresi</span>
            <Clock size={18} style={{ color: '#f59e0b' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>{current.avgTime}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Etkileşim oranı: %68</div>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '16px 18px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Uygulama İndirmeleri</span>
            <Download size={18} style={{ color: '#ec4899' }} />
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 700, color: 'var(--text-primary)' }}>{current.downloads.toLocaleString('tr-TR')}</div>
          <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '4px', fontWeight: 600 }}>Pil Uyarısı & DeskPilot</div>
        </div>
      </div>

      {/* Orta Izgara: Türkiye Yöresel İl Dağılımı ve Günlük Trend Grafiği */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {/* 1. Türkiye Yöresel İl Dağılımı (Kullanıcının özellikle sorduğu bölüm) */}
        <div style={{ background: 'var(--bg-card)', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} style={{ color: '#ef4444' }} />
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Türkiye Yöresel Ziyaret Dağılımı
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px' }}>
              İl Bazında
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {cities.map((c) => (
              <div key={c.city}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{c.city}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    {c.visitors.toLocaleString('tr-TR')} ziyaretçi (%{c.percentage})
                  </span>
                </div>
                <div style={{ width: '100%', height: '7px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${c.percentage}%`,
                    height: '100%',
                    borderRadius: '4px',
                    background: c.percentage > 25 ? 'linear-gradient(90deg, #3b82f6, #60a5fa)' : 'linear-gradient(90deg, #6366f1, #818cf8)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Günlük Trend Grafiği (SVG Bar Chart) */}
        <div style={{ background: 'var(--bg-card)', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} style={{ color: '#10b981' }} />
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Haftalık Ziyaretçi Yoğunluğu
              </h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>En yoğun gün: Cuma - Cumartesi</span>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px', padding: '16px 8px 6px 8px' }}>
            {trendDays.map((d) => {
              const maxVal = 140;
              const heightPercent = Math.round((d.val / maxVal) * 100);
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.val}</span>
                  <div style={{
                    width: '100%',
                    maxWidth: '36px',
                    height: `${heightPercent}%`,
                    minHeight: '12px',
                    background: d.val >= 110 ? 'linear-gradient(180deg, #3b82f6, #1d4ed8)' : 'linear-gradient(180deg, #475569, #334155)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.3s ease'
                  }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alt Izgara: Popüler Sayfalar, Ülke ve Cihaz Dağılımı */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {/* Popüler Rotalar */}
        <div style={{ background: 'var(--bg-card)', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FileText size={18} style={{ color: '#06b6d4' }} />
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              En Çok Ziyaret Edilen Sayfalar
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topPages.map((p) => (
              <div key={p.path} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{p.path}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3b82f6' }}>{p.views.toLocaleString('tr-TR')}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>%{p.percentage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cihaz ve Ülke Özeti */}
        <div style={{ background: 'var(--bg-card)', padding: '18px 20px', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Smartphone size={18} style={{ color: '#f59e0b' }} />
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Cihaz & Platform Dağılımı
              </h3>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <Smartphone size={20} style={{ color: '#3b82f6', margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>%68</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mobil (Android / iOS)</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <Monitor size={20} style={{ color: '#8b5cf6', margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>%29</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Masaüstü (PC / Mac)</div>
              </div>
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <Globe2 size={20} style={{ color: '#10b981', margin: '0 auto 4px auto' }} />
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>%3</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Tablet & Diğer</div>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Globe2 size={18} style={{ color: '#3b82f6' }} />
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Ülke Dağılımı
              </h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {countries.map((ct) => (
                <div key={ct.code} style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.78rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#3b82f6' }}>{ct.code}</span>
                  <span style={{ color: 'var(--text-primary)' }}>{ct.country}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>%{ct.percentage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
