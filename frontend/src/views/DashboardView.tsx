import React from 'react';
import type { Ticket, CommentItem, Subscriber } from '../types';
import { useTranslation } from '../context/I18nContext';
import { 
  Sparkles, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import type { TabType } from '../components/Sidebar';

interface DashboardViewProps {
  tickets: Ticket[];
  comments: CommentItem[];
  subscribers: Subscriber[];
  onNavigate: (tab: TabType) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tickets,
  comments,
  subscribers,
  onNavigate,
}) => {
  const { t, language } = useTranslation();
  const pendingTickets = tickets.filter((t) => t.status === 'new' || t.status === 'in_progress');
  const pendingComments = comments.filter((c) => c.status === 'pending');

  const locale = language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR';

  const getStatusBadgeLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Yeni';
      case 'in_progress': return 'İşlemde';
      case 'resolved': return 'Çözüldü';
      case 'rejected': return 'Reddedildi';
      default: return status;
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '16px' }}>
        <h1 className="admin-page-title">{t('dashboard.quickStats')}</h1>
        <p className="admin-page-desc">{t('common.welcome', { name: 'Admin' })}</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="dashboard-metrics-grid" style={{ gap: '10px', marginBottom: '16px' }}>
        {/* 1. Destek Talepleri */}
        <div
          className="admin-list-card"
          onClick={() => onNavigate('tickets')}
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '4px',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Bekleyen Talepler
            </span>
            <span className="admin-badge admin-badge-counter">
              {tickets.length} Toplam
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {pendingTickets.length}
            </span>
            <span style={{ fontSize: '0.70rem', color: 'var(--accent-cyan)' }}>
              incelenmeyi bekliyor
            </span>
          </div>
        </div>

        {/* 2. Blog Yorumları */}
        <div
          className="admin-list-card"
          onClick={() => onNavigate('comments')}
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '4px',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Bekleyen Yorumlar
            </span>
            <span className="admin-badge admin-badge-counter">
              {comments.length} Toplam
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {pendingComments.length}
            </span>
            <span style={{ fontSize: '0.70rem', color: 'var(--accent-amber)' }}>
              onay bekliyor
            </span>
          </div>
        </div>

        {/* 3. E-Bülten Aboneleri */}
        <div
          className="admin-list-card"
          onClick={() => onNavigate('subscribers')}
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '4px',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Kayıtlı Aboneler
            </span>
            <span className="admin-badge admin-badge-counter">
              {subscribers.filter((s) => s.is_verified).length} Doğrulanmış
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
              {subscribers.length}
            </span>
            <span style={{ fontSize: '0.70rem', color: 'var(--accent-emerald)' }}>
              aktif abone
            </span>
          </div>
        </div>

        {/* 4. Toplu E-Bülten Duyurusu */}
        <div
          className="admin-list-card"
          onClick={() => onNavigate('broadcast')}
          style={{
            cursor: 'pointer',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '4px',
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Toplu E-Bülten
            </span>
            <span className="admin-badge admin-badge-index">
              {subscribers.length} Abone
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="admin-btn admin-btn-sm admin-btn-primary"
              style={{ height: '22px', fontSize: '0.72rem', padding: '0 8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Duyuru Gönder <ArrowRight size={11} />
            </span>
            <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>
              anlık bülten yayını
            </span>
          </div>
        </div>
      </div>

      {/* Recent Tickets Overview */}
      <div className="dashboard-panels-grid">
        <div className="admin-panel-card" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 className="admin-card-title">{t('dashboard.recentTickets')}</h3>
            <button className="admin-btn admin-btn-view admin-btn-sm" onClick={() => onNavigate('tickets')}>{t('common.all')}</button>
          </div>

          {pendingTickets.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('common.loading')}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingTickets.slice(0, 4).map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="admin-list-card"
                  onClick={() => onNavigate('tickets')}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    minWidth: 0,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="admin-token-id">{ticket.id}</span>
                    <span className="admin-badge admin-badge-counter">{getStatusBadgeLabel(ticket.status)}</span>
                  </div>
                  <h4 className="admin-card-title line-clamp-1">{ticket.subject}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ minWidth: 0, overflowWrap: 'anywhere' }}>{ticket.sender_name} ({ticket.sender_email})</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                      <Clock size={12} /> {new Date(ticket.created_at).toLocaleDateString(locale)}
                    </span>
                  </div>
                  {ticket.ai_summary && (
                    <div style={{
                      fontSize: '0.78rem',
                      background: 'rgba(99, 102, 241, 0.08)',
                      borderLeft: '3px solid var(--accent-primary)',
                      padding: '6px 10px',
                      borderRadius: 'var(--admin-badge-radius, 4px)',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '4px',
                      wordBreak: 'break-word'
                    }}>
                      <Sparkles size={14} color="var(--accent-primary)" style={{ flexShrink: 0 }} />
                      <span style={{ minWidth: 0 }}>{ticket.ai_summary}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Comments Overview */}
        <div className="admin-panel-card" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 className="admin-card-title">{t('dashboard.pendingComments')}</h3>
            <button className="admin-btn admin-btn-view admin-btn-sm" onClick={() => onNavigate('comments')}>{t('common.view')}</button>
          </div>

          {pendingComments.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('comments.pendingCount', { count: 0 })}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingComments.slice(0, 4).map((comment) => (
                <div 
                  key={comment.id}
                  className="admin-list-card"
                  onClick={() => onNavigate('comments')}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    minWidth: 0,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="admin-token-id" style={{ minWidth: 'auto' }}>
                        #{comment.id.length > 10 ? comment.id.slice(-8).toUpperCase() : comment.id}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{comment.author_name}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>{new Date(comment.created_at).toLocaleDateString(locale)}</span>
                  </div>
                  <p className="admin-card-desc line-clamp-2">"{comment.content}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
