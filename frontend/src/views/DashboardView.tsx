import React from 'react';
import type { Ticket, CommentItem, Subscriber } from '../types';
import { useTranslation } from '../context/I18nContext';
import { 
  Inbox, 
  MessageSquare, 
  Users, 
  Sparkles, 
  Clock, 
  ArrowRight,
  Send
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
      <div className="dashboard-metrics-grid">
        <div className="glass-card glass-card-hover" onClick={() => onNavigate('tickets')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('dashboard.totalTickets')}</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{pendingTickets.length}</h3>
            </div>
            <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
              <Inbox size={24} />
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
            {t('tickets.count', { count: tickets.length })}
          </div>
        </div>

        <div className="glass-card glass-card-hover" onClick={() => onNavigate('comments')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('dashboard.pendingComments')}</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{pendingComments.length}</h3>
            </div>
            <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '12px', color: 'var(--accent-amber)' }}>
              <MessageSquare size={24} />
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {t('comments.pendingCount', { count: comments.length })}
          </div>
        </div>

        <div className="glass-card glass-card-hover" onClick={() => onNavigate('subscribers')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('dashboard.totalSubscribers')}</span>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{subscribers.length}</h3>
            </div>
            <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', color: 'var(--accent-emerald)' }}>
              <Users size={24} />
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
            {t('subscribers.title')}
          </div>
        </div>

        <div className="glass-card glass-card-hover" onClick={() => onNavigate('broadcast')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{t('broadcast.broadcastTitle')}</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>{t('broadcast.sendBroadcast')}</h3>
            </div>
            <div style={{ padding: '10px', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '12px', color: 'var(--accent-secondary)' }}>
              <Send size={24} />
            </div>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {t('common.view')} <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Recent Tickets Overview */}
      <div className="dashboard-panels-grid">
        <div className="glass-card" style={{ minWidth: 0 }}>
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
                  style={{
                    padding: '12px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    minWidth: 0,
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{ticket.id}</span>
                    <span className="admin-badge admin-badge-counter">{getStatusBadgeLabel(ticket.status)}</span>
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{ticket.subject}</h4>
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
                      borderRadius: '4px',
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
        <div className="glass-card" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 className="admin-card-title">{t('dashboard.pendingComments')}</h3>
            <button className="admin-btn admin-btn-view admin-btn-sm" onClick={() => onNavigate('comments')}>{t('common.view')}</button>
          </div>

          {pendingComments.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('comments.pendingCount', { count: 0 })}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingComments.slice(0, 4).map((comment) => (
                <div key={comment.id} style={{
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  minWidth: 0,
                  overflow: 'hidden'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{comment.author_name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>{new Date(comment.created_at).toLocaleDateString(locale)}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', wordBreak: 'break-word' }}>"{comment.content}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
