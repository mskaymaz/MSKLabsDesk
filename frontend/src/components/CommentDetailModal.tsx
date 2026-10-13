import React, { useState } from 'react';
import type { CommentItem } from '../types';
import { X, CheckCircle, XCircle, Clock, User, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useTranslation } from '../context/I18nContext';
import { getBlogTypeLabel, formatBlogSlug } from '../utils/blogMeta';

interface CommentDetailModalProps {
  comment: CommentItem;
  onClose: () => void;
  onModerate: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  loading: boolean;
}

export const CommentDetailModal: React.FC<CommentDetailModalProps> = ({
  comment,
  onClose,
  onModerate,
  loading,
}) => {
  const { language } = useTranslation();
  const [contentFontSize, setContentFontSize] = useState<number>(0.9);

  const locale = language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR';

  const sBadge = comment.status === 'approved'
    ? { label: '✅ Onaylandı', bg: 'rgba(16, 185, 129, 0.25)', border: 'rgba(16, 185, 129, 0.45)' }
    : comment.status === 'rejected'
    ? { label: '❌ Reddedildi', bg: 'rgba(239, 68, 68, 0.25)', border: 'rgba(239, 68, 68, 0.45)' }
    : { label: '⏳ Bekliyor', bg: 'rgba(245, 158, 11, 0.25)', border: 'rgba(245, 158, 11, 0.45)' };

  const typeLabel = getBlogTypeLabel(comment.post_type);
  const topicLabel = formatBlogSlug(comment.post_slug, comment.post_id);
  const fullInfo = `${typeLabel} / ${topicLabel}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'ui-monospace, monospace' }}>
                #{comment.id.length > 10 ? comment.id.slice(-8).toUpperCase() : comment.id}
              </span>
              <span className="ticket-badge" style={{ fontSize: '0.74rem', background: sBadge.bg, border: `1px solid ${sBadge.border}`, padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                {sBadge.label}
              </span>
              <span className="ticket-badge" style={{ fontSize: '0.74rem', background: 'rgba(99, 102, 241, 0.18)', border: '1px solid rgba(99, 102, 241, 0.38)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                📰 {fullInfo}
              </span>
            </div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Blog Yorum Detayı
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Kapat">
            <X size={20} />
          </button>
        </div>

        {/* Sender Info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 14px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '16px',
          fontSize: '0.85rem',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={15} color="var(--accent-primary)" />
            <strong style={{ color: 'var(--text-primary)' }}>{comment.author_name}</strong>
            <span style={{ color: 'var(--text-secondary)' }}>({comment.author_email})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <Clock size={13} />
            {new Date(comment.created_at).toLocaleString(locale)}
          </div>
        </div>

        {/* Comment Message Body */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Yorum İçeriği
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 6px', borderRadius: '6px' }}>
              <button
                type="button"
                onClick={() => setContentFontSize((prev) => Math.max(0.75, Number((prev - 0.05).toFixed(2))))}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                title="Yazıyı Küçült"
              >
                <ZoomOut size={13} />
              </button>
              <button
                type="button"
                onClick={() => setContentFontSize(0.9)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                title="Sıfırla"
              >
                <RotateCcw size={11} />
              </button>
              <button
                type="button"
                onClick={() => setContentFontSize((prev) => Math.min(1.25, Number((prev + 0.05).toFixed(2))))}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '2px', display: 'flex' }}
                title="Yazıyı Büyüt"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>
          <div className="ticket-message-content" style={{ fontSize: `${contentFontSize}rem`, minHeight: '90px' }}>
            "{comment.content}"
          </div>
        </div>

        {/* Modal Actions Toolbar */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
          {comment.status !== 'approved' && (
            <button
              type="button"
              className="btn btn-success btn-sm"
              style={{ padding: '6px 14px', fontSize: '0.82rem', color: '#000000', fontWeight: 700 }}
              disabled={loading}
              onClick={() => onModerate(comment.id, 'approved')}
            >
              <CheckCircle size={14} color="#000000" /> Onayla
            </button>
          )}
          {comment.status !== 'rejected' && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              style={{ padding: '6px 14px', fontSize: '0.82rem', color: '#000000', fontWeight: 700 }}
              disabled={loading}
              onClick={() => onModerate(comment.id, 'rejected')}
            >
              <XCircle size={14} color="#000000" /> Reddet
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
            onClick={onClose}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
