import React, { useState } from 'react';
import type { CommentItem } from '../types';
import { api } from '../services/api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface CommentsViewProps {
  comments: CommentItem[];
  onRefresh: () => void;
}

export const CommentsView: React.FC<CommentsViewProps> = ({ comments, onRefresh }) => {
  const [filter, setFilter] = useState<string>('pending');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredComments = comments.filter((c) => filter === 'all' || c.status === filter);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    setLoadingId(id);
    try {
      await api.moderateComment(id, status);
      onRefresh();
    } catch (err) {
      alert('Yorum durumu güncellenemedi.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div>
        <h1 className="page-title">Blog Yorum Yönetimi</h1>
        <p className="page-subtitle">Sitede yayınlanan veya onay bekleyen blog yorumlarını denetleyin.</p>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card" style={{ padding: '12px 16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'pending', label: 'Bekleyenler' },
            { id: 'approved', label: 'Onaylananlar' },
            { id: 'rejected', label: 'Reddedilenler' },
            { id: 'all', label: 'Tümü' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`btn btn-sm ${filter === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toplam {filteredComments.length} yorum</span>
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bu filtrede yorum bulunmuyor.</p>
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
                    Yazı ID: {comment.post_id}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {new Date(comment.created_at).toLocaleString('tr-TR')}
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
                    <CheckCircle size={14} /> Onayla & Yayınla
                  </button>
                )}
                {comment.status !== 'rejected' && (
                  <button
                    className="btn btn-danger btn-sm"
                    disabled={loadingId === comment.id}
                    onClick={() => handleModerate(comment.id, 'rejected')}
                  >
                    <XCircle size={14} /> Reddet (Spam)
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
