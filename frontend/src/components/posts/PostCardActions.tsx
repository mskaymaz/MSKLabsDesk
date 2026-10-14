import React from 'react';
import {
  Edit,
  Trash2,
  CheckCircle,
  PauseCircle,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import type { BlogPost } from '../../types';

export interface PostCardActionsProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete?: (id: string) => void;
  onPublish?: (post: BlogPost) => void;
  onUnpublish?: (post: BlogPost) => void;
  onMoveToTrash?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
}

export const PostCardActions: React.FC<PostCardActionsProps> = ({
  post,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onMoveToTrash,
  onRestore,
  onPermanentDelete,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      {/* 1. Aşama: Yayında ise -> YALNIZCA 'Yayından Kaldır' ve 'Düzenle' (SİLME BUTONU KESİNLİKLE YOK) */}
      {post.status === 'published' && (
        <button
          type="button"
          onClick={() => onUnpublish?.(post)}
          className="btn btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            padding: '2px 8px',
            fontSize: '0.74rem',
            height: '24px',
            borderRadius: '5px',
            cursor: 'pointer',
            background: 'rgba(245, 158, 11, 0.12)',
            color: 'var(--accent-amber)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            fontWeight: 500,
          }}
          title="Makaleyi Web Yayından Kaldır (Arşive Al)"
        >
          <PauseCircle size={12} /> Yayından Kaldır
        </button>
      )}

      {/* 2. Aşama: Yayından Kalkmış, Arşiv veya Taslak ise -> 'Yayına Al', 'Düzenle' ve 'Çöpe Gönder' */}
      {(post.status === 'unpublished' || post.status === 'archived' || post.status === 'draft') && (
        <>
          <button
            type="button"
            onClick={() => onPublish?.(post)}
            className="btn btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '2px 8px',
              fontSize: '0.74rem',
              height: '24px',
              borderRadius: '5px',
              cursor: 'pointer',
              background: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--accent-emerald)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontWeight: 500,
            }}
            title="Makaleyi Webde Yayına Al"
          >
            <CheckCircle size={12} /> Yayına Al
          </button>

          <button
            type="button"
            onClick={() => (onMoveToTrash ? onMoveToTrash(post.id) : onDelete?.(post.id))}
            className="btn btn-sm btn-danger"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '2px 6px',
              fontSize: '0.74rem',
              height: '24px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            title="Çöp Kutusuna Gönder (Geri Alınabilir)"
          >
            <Trash2 size={12} />
          </button>
        </>
      )}

      {/* 3. Aşama: Çöp Kutusunda ise -> 'Geri Kurtar' ve 'Kalıcı Sil' */}
      {post.status === 'trash' && (
        <>
          <button
            type="button"
            onClick={() => onRestore?.(post.id)}
            className="btn btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '2px 8px',
              fontSize: '0.74rem',
              height: '24px',
              borderRadius: '5px',
              cursor: 'pointer',
              background: 'rgba(6, 182, 212, 0.12)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              fontWeight: 500,
            }}
            title="Çöp Kutusundan Geri Kurtar"
          >
            <RotateCcw size={12} /> Geri Kurtar
          </button>

          <button
            type="button"
            onClick={() => onPermanentDelete?.(post.id)}
            className="btn btn-sm btn-danger"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              padding: '2px 8px',
              fontSize: '0.74rem',
              height: '24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
            title="Veritabanından Kalıcı Olarak Sil"
          >
            <AlertTriangle size={12} /> Kalıcı Sil
          </button>
        </>
      )}

      {/* Düzenle Butonu (Çöp Kutusu hariç her zaman aktif) */}
      {post.status !== 'trash' && (
        <button
          type="button"
          onClick={() => onEdit(post)}
          className="btn btn-sm btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            fontSize: '0.75rem',
            height: '24px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
          title="Yazıyı Düzenle"
        >
          <Edit size={12} /> Düzenle
        </button>
      )}
    </div>
  );
};
