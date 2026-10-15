import React, { useState } from 'react';
import type { CommentItem } from '../types';
import { api } from '../services/api';
import { CheckCircle, XCircle, Clock, RotateCw, Eye } from 'lucide-react';
import { useTranslation } from '../context/I18nContext';
import { CommentDetailModal } from '../components/CommentDetailModal';
import { getBlogTypeLabel, formatBlogSlug } from '../utils/blogMeta';

interface CommentsViewProps {
  comments: CommentItem[];
  onRefresh: () => void;
}

export const CommentsView: React.FC<CommentsViewProps> = ({ comments, onRefresh }) => {
  const { t, language } = useTranslation();
  const [filter, setFilter] = useState<string>('pending');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedComment, setSelectedComment] = useState<CommentItem | null>(null);

  const locale = language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR';
  const filteredComments = comments.filter((c) => filter === 'all' || c.status === filter);

  const handleModerate = async (id: string, status: 'approved' | 'rejected') => {
    setLoadingId(id);
    try {
      await api.moderateComment(id, status);
      setSelectedComment((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
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
        {/* Tek Satır Başlık: Başlık + Sayaç + Durum Açılır Listesi (Sol) & Yenile Butonu (Sağ) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1px 2px',
          marginBottom: '2px',
          flexWrap: 'wrap',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 className="admin-page-title">
              {t('common.comments')}
            </h1>
            <span className="admin-badge admin-badge-counter">
              {filteredComments.length} yorum
            </span>

            {/* Durum Açılır Listesi (Blog Yorumları Başlığının Sağında) */}
            <select
              className="form-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: 'auto',
                maxWidth: '220px',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '8px',
                paddingRight: '22px',
                fontSize: '0.78rem',
                height: '26px',
                marginLeft: '4px'
              }}
              title="Yorum Durumuna Göre Filtrele"
            >
              <option value="pending">⏳ Bekleyenler ({comments.filter((c) => c.status === 'pending').length})</option>
              <option value="approved">✅ Onaylananlar ({comments.filter((c) => c.status === 'approved').length})</option>
              <option value="rejected">❌ Reddedilenler ({comments.filter((c) => c.status === 'rejected').length})</option>
              <option value="unverified">✉️ E-Posta Onayı Bekleyenler ({comments.filter((c) => c.status === 'unverified').length})</option>
              <option value="all">📋 Tüm Yorumlar ({comments.length})</option>
            </select>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn-sm admin-btn-refresh"
            onClick={handleManualRefresh}
            disabled={refreshing}
            title="Yorumları Yenile (Yalnızca Listeyi Günceller)"
          >
            <RotateCw size={12} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Yenileniyor...' : 'Yenile'}
          </button>
        </div>
      </div>

      {/* Comments List */}
      {filteredComments.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>💬</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
            {filter !== 'all' ? 'Bu Filtreye Uygun Yorum Bulunamadı' : 'Henüz Kayıtlı Blog Yorumu Bulunmuyor'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.45 }}>
            {filter !== 'all'
              ? 'Açılır listeden "Tüm Yorumlar" seçeneğini belirleyerek tüm kayıtları listeleyebilirsiniz.'
              : 'Web sitemizdeki blog makalelerine okuyuculardan gelen yorumlar anlık olarak burada listelenecektir.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className="admin-list-card"
              onDoubleClick={() => setSelectedComment(comment)}
              style={{ cursor: 'pointer' }}
              title="Çift tıklayarak yorum detayını okuyabilirsiniz"
            >
              {/* 1. Satır: Yorum Kodu + Rozetler + Metaveriler (Sol) & Aksiyon Butonları (Sağ) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
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
                      : comment.status === 'unverified'
                      ? { label: '✉️ Onay Bekliyor', bg: 'rgba(148, 163, 184, 0.25)', border: 'rgba(148, 163, 184, 0.45)' }
                      : { label: '⏳ Bekliyor', bg: 'rgba(245, 158, 11, 0.25)', border: 'rgba(245, 158, 11, 0.45)' };
                    const typeLabel = getBlogTypeLabel(comment.post_type);
                    const topicLabel = formatBlogSlug(comment.post_slug, comment.post_id);
                    const fullInfo = `${typeLabel} / ${topicLabel}`;
                    return (
                      <>
                        <span className="admin-badge" style={{ background: sBadge.bg, color: 'var(--text-primary)', border: `1px solid ${sBadge.border}`, minWidth: '60px', justifyContent: 'center' }}>
                          {sBadge.label}
                        </span>
                        <span
                          className="admin-badge"
                          style={{
                            background: 'rgba(99, 102, 241, 0.18)',
                            color: 'var(--accent-primary)',
                            border: '1px solid rgba(99, 102, 241, 0.38)',
                            maxWidth: '260px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={fullInfo}
                        >
                          📰 {fullInfo}
                        </span>
                      </>
                    );
                  })()}

                  <div className="admin-meta-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginLeft: '4px', flexWrap: 'wrap' }}>
                    <strong>{comment.author_name}</strong>
                    <span>•</span>
                    <span>{comment.author_email}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                      <Clock size={11} /> {new Date(comment.created_at).toLocaleDateString(locale)}
                    </span>
                  </div>
                </div>

                {/* Sağ: Aksiyon Butonları */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', flexShrink: 0 }}>
                  <button
                    className="admin-btn admin-btn-sm admin-btn-view"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedComment(comment);
                    }}
                    title="Yorumu İncele"
                  >
                    <Eye size={12} /> {t('common.view')}
                  </button>
                  {comment.status !== 'approved' && (
                    <button
                      className="admin-btn admin-btn-sm admin-btn-success"
                      disabled={loadingId === comment.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModerate(comment.id, 'approved');
                      }}
                      title="Onayla"
                    >
                      <CheckCircle size={12} /> Onayla
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button
                      className="admin-btn admin-btn-sm admin-btn-danger"
                      disabled={loadingId === comment.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleModerate(comment.id, 'rejected');
                      }}
                      title="Reddet"
                    >
                      <XCircle size={12} /> Reddet
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Satır: Başlık (Yazarın Yorum Başlığı) */}
              <h3 className="admin-card-title">
                {comment.author_name} — Yorum
              </h3>

              {/* 3. Satır: Yorum İçerik Açıklaması (Tam genişlik, kutusuz, standart line-clamp-2) */}
              <p className="admin-card-desc line-clamp-2">
                "{comment.content}"
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Yorum İnceleme Modalı */}
      {selectedComment && (
        <CommentDetailModal
          comment={selectedComment}
          loading={loadingId === selectedComment.id}
          onClose={() => setSelectedComment(null)}
          onModerate={handleModerate}
        />
      )}
    </div>
  );
};
