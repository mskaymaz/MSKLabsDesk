import React from 'react';
import {
  ExternalLink,
  Users,
  MapPin,
  FileText,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Mail,
} from 'lucide-react';

interface PlatformStats {
  tickets: number;
  comments: number;
  subscribers: number;
  posts: number;
}

const GA_CARDS = [
  {
    href: 'https://analytics.google.com/analytics/web/#/realtime',
    title: 'Anlık Ziyaretçiler',
    desc: 'Son 30 dakikadaki canlı kullanıcılar ve aktif sayfalar',
    bg: 'rgba(59, 130, 246, 0.15)',
    color: '#60a5fa',
    Icon: Users,
  },
  {
    href: 'https://analytics.google.com/analytics/web/#/reports/dashboard',
    title: 'Bölgesel Harita',
    desc: 'Türkiye illeri ve dünya genelinde ziyaretçi yoğunluğu',
    bg: 'rgba(34, 197, 94, 0.15)',
    color: '#4ade80',
    Icon: MapPin,
  },
  {
    href: 'https://analytics.google.com/analytics/web/#/reports/reportinghub',
    title: 'Popüler Sayfalar',
    desc: 'Blog makaleleri, uygulamalar ve sayfa görüntüleme sayıları',
    bg: 'rgba(168, 85, 247, 0.15)',
    color: '#c084fc',
    Icon: FileText,
  },
  {
    href: 'https://analytics.google.com/analytics/web/#/reports/dashboard',
    title: 'Trafik & Arama',
    desc: 'Google organik arama, doğrudan ve yönlendiren kaynaklar',
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    Icon: TrendingUp,
  },
];

export const WebAnalyticsCards: React.FC<{ platformStats: PlatformStats }> = ({ platformStats }) => {
  const statItems = [
    { label: 'Blog Yazıları', value: platformStats.posts, sub: 'Yayında içerikler', color: '#60a5fa', Icon: BookOpen },
    { label: 'Yorumlar', value: platformStats.comments, sub: 'Okuyucu etkileşimi', color: '#4ade80', Icon: MessageSquare },
    { label: 'Destek Talepleri', value: platformStats.tickets, sub: 'Gelen biletler', color: '#c084fc', Icon: Mail },
    { label: 'Bülten Aboneleri', value: platformStats.subscribers, sub: 'Kayıtlı e-posta', color: '#fbbf24', Icon: Users },
  ];

  return (
    <>
      <div>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--text-muted, #94a3b8)' }}>
          Google Analytics 4 — Doğrudan Canlı Raporlar
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          {GA_CARDS.map(({ href, title, desc, bg, color, Icon }) => (
            <a
              key={title}
              href={href}
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
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: bg, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} />
                </div>
                <ExternalLink size={14} style={{ color: '#64748b' }} />
              </div>
              <h3 style={{ margin: '6px 0 0 0', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>{title}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted, #94a3b8)', lineHeight: 1.4 }}>{desc}</p>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, color: 'var(--text-muted, #94a3b8)' }}>
          MSK Labs — Canlı Platform Telemetrisi
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {statItems.map(({ label, value, sub, color, Icon }) => (
            <div key={label} style={{ background: 'var(--bg-card, #1e293b)', border: '1px solid var(--border-color, #334155)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted, #94a3b8)', fontSize: '0.82rem', marginBottom: '6px' }}>
                <Icon size={15} style={{ color }} />
                <span>{label}</span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)' }}>{value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', marginTop: '2px' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
