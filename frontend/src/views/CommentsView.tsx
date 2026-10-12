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
                  color: isActive ? '#000000' : 'var(--text-secondary)',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredComments.map((comment) => (
            <div key={comment.id} className="glass-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>{comment.author_name}</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({comment.author_email})</span>
                    <span className={`badge badge-${comment.status}`}>{comment.status}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '2px', display: 'inline-block' }}>
                    {t('comments.postUrl')}: {comment.post_id}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {new Date(comment.created_at).toLocaleString(locale)}
                </span>
              </div>

              <div style={{
                padding: '12px 16px',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.88rem',
                color: '#E5E7EB',
                marginBottom: '14px',
                lineHeight: 1.5
              }}>
                "{comment.content}"
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                {comment.status !== 'approved' && (
                  <button
                    className="btn btn-success btn-sm"
                    disabled={loadingId === comment.id}
                    onClick={() => handleModerate(comment.id, 'approved')}
                  >
                    <CheckCircle size={14} /> {t('comments.approveComment')}
                  </button>
                )}
                {comment.status !== 'rejected' && (
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={loadingId === comment.id}
                    onClick={() => handleModerate(comment.id, 'rejected')}
                  >
                    <XCircle size={14} /> {t('comments.rejectComment')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
