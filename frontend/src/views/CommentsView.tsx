import React, { useState } from 'react';
import type { CommentItem } from '../types';
import { api } from '../services/api';
import { CheckCircle, XCircle, Clock, RotateCw } from 'lucide-react';
import { useTranslation } from '../context/I18nContext';

interface CommentsViewProps {
  comments: CommentItem[];
  onRefresh: () => void;
}

export const CommentsView: React.FC<CommentsViewProps> = ({ comments, onRefresh }) => {
  const { t, language } = useTranslation();
  const [filter, setFilter] = useState<string>('pending');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const locale = language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR';
  const filteredComments = comments.filter((c) => filter === 'all' || c.status === filter);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    setLoadingId(id);
    try {
      await api.moderateComment(id, status);
      onRefresh();
    } catch (err) {
      alert(t('comments.updateError'));
    } finally {
      setLoadingId(null);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setRefreshing(false), 350);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Sticky Ultra-Compact Header for Comments */}
      <div style={{
        position: 'sticky',
        top: '40px',
        zIndex: 20,
        background: 'var(--bg-main)',
        backdropFilter: 'blur(16px)',
        padding: '1px 0 6px 0',
        marginBottom: '8px',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Row 1: Title + Counter (Left) & Refresh Action (Right) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1px 2px',
          marginBottom: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {t('common.comments')}
            </h1>
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--accent-cyan)',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              padding: '1px 6px',
              borderRadius: '10px',
              fontWeight: 700
            }}>
              {filteredComments.length} yorum
            </span>
          </div>

          <button
            type="button"
            className="btn btn-sm btn-secondary"
            style={{
              padding: '3px 9px',
              fontSize: '0.74rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              borderRadius: '6px',
              fontWeight: 600,
              color: 'var(--text-secondary)'
            }}
            onClick={handleManualRefresh}
            disabled={refreshing}
            title="Yorumları Yenile (Yalnızca Listeyi Günceller)"
          >
            <RotateCw size={12} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Yenileniyor...' : 'Yenile'}
          </button>
        </div>

        {/* Row 2: Status Filter Tabs (Minimal vertical padding) */}
        <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', padding: '1px 0' }}>
          {[
            { id: 'pending', label: t('tickets.pending') },
            { id: 'approved', label: t('tickets.resolved') },
            { id: 'rejected', label: t('tickets.rejected') },
            { id: 'all', label: t('common.all') },
          ].map((tab) => {
            const count = tab.id === 'all'
              ? comments.length
              : comments.filter((c) => c.status === tab.id).length;
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  borderRadius: '14px',
                  padding: '2px 8px',
                  fontSize: '0.74rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  whiteSpace: 'nowrap',
                  lineHeight: '1.2'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  background: isActive ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.08)',
                  padding: '0 5px',
                  borderRadius: '8px',
                  fontSize: '0.68rem',
                  marginLeft: '4px',
                  fontWeight: 700
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('common.loading')}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="glass-card glass-card-hover"
              style={{
                padding: '4px 14px',
                borderRadius: '8px'
              }}
            >
              {/* Kart Üst Satırı: Yorum Kodu + Durum Rozeti + Yazı Rozeti (Sol) & Tarih (Sağ) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', minWidth: 0 }}>
                  <span
                    style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'ui-monospace, monospace', letterSpacing: '-0.02em', minWidth: '76px', flexShrink: 0 }}
                    title={comment.id}
                  >
                    #{comment.id.length > 10 ? comment.id.slice(-8).toUpperCase() : comment.id}
                  </span>
                  {(() => {
                    const sBadge = comment.status === 'approved'
                      ? { label: '✅ Onaylandı', bg: 'rgba(16, 185, 129, 0.25)', border: 'rgba(16, 185, 129, 0.45)' }
                      : comment.status === 'rejected'
                      ? { label: '❌ Reddedildi', bg: 'rgba(239, 68, 68, 0.25)', border: 'rgba(239, 68, 68, 0.45)' }
                      : { label: '⏳ Bekliyor', bg: 'rgba(245, 158, 11, 0.25)', border: 'rgba(245, 158, 11, 0.45)' };
                    return (
                      <>
                        <span className="ticket-badge" style={{ fontSize: '0.68rem', background: sBadge.bg, border: `1px solid ${sBadge.border}`, padding: '1px 6px', borderRadius: '4px', fontWeight: 700, minWidth: '60px', textAlign: 'center', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                          {sBadge.label}
                        </span>
                        <span className="ticket-badge" style={{ fontSize: '0.68rem', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', flexShrink: 0, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={comment.post_id}>
                          📰 {comment.post_id}
                        </span>
                      </>
                    );
                  })()}
                </div>

                {/* Sağ: Tarih (Üst satırın sağ tarafına kilitli, asla kaymaz) */}
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginLeft: 'auto', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  <Clock size={11} /> {new Date(comment.created_at).toLocaleDateString(locale)}
                </span>
              </div>

              {/* Kart Alt Satırı: Yazar & E-Posta (Sol) + Yorum Önizleme (Desktop) + Aksiyon Butonları (Sağ) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="ticket-subject-col" style={{ minWidth: 0 }}>
                  <h3 style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '1px',
                    lineHeight: 1.25,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word'
                  }}>
                    {comment.author_name}
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {comment.author_email}
                  </div>
                </div>

                {/* Yorum Önizleme (Sadece Masaüstü) */}
                <div className="hidden-mobile" style={{ flex: 1, minWidth: 0 }}>
                  <div className="ticket-message-preview">
                    <span style={{ color: 'var(--text-muted)', marginRight: '4px' }}>💬</span>
                    "{comment.content}"
                  </div>
                </div>

                {/* Sağ: Aksiyon Butonları (Başlık ile aynı hizada kilitli) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', flexShrink: 0 }}>
                  {comment.status !== 'approved' && (
                    <button
                      className="btn btn-success btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.74rem', borderRadius: '5px', whiteSpace: 'nowrap' }}
                      disabled={loadingId === comment.id}
                      onClick={() => handleModerate(comment.id, 'approved')}
                      title={t('comments.approveComment')}
                    >
                      <CheckCircle size={12} /> {t('comments.approveComment')}
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ padding: '3px 8px', fontSize: '0.74rem', borderRadius: '5px', whiteSpace: 'nowrap' }}
                      disabled={loadingId === comment.id}
                      onClick={() => handleModerate(comment.id, 'rejected')}
                      title={t('comments.rejectComment')}
                    >
                      <XCircle size={12} /> {t('comments.rejectComment')}
                    </button>
                  )}
                </div>
              </div>

              {/* Mobilde Kart Altına Tam Genişlikte 2 Satırlık Yorum Önizlemesi */}
              <div className="visible-mobile ticket-message-preview" style={{
                marginTop: '6px',
                width: '100%',
                maxHeight: '2.8em',
                lineHeight: 1.35,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                display: '-webkit-box'
              }}>
                <span style={{ color: 'var(--text-muted)', marginRight: '4px' }}>💬</span>
                "{comment.content}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
