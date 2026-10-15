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
          className="admin-btn admin-btn-sm admin-btn-warning"
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
            className="admin-btn admin-btn-sm admin-btn-success"
            title="Makaleyi Webde Yayına Al"
          >
            <CheckCircle size={12} /> Yayına Al
          </button>

          <button
            type="button"
            onClick={() => (onMoveToTrash ? onMoveToTrash(post.id) : onDelete?.(post.id))}
            className="admin-btn admin-btn-sm admin-btn-danger"
            style={{ padding: '0 6px' }}
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
            className="admin-btn admin-btn-sm admin-btn-view"
            title="Çöp Kutusundan Geri Kurtar"
          >
            <RotateCcw size={12} /> Geri Kurtar
          </button>

          <button
            type="button"
            onClick={() => onPermanentDelete?.(post.id)}
            className="admin-btn admin-btn-sm admin-btn-danger"
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
          className="admin-btn admin-btn-sm admin-btn-edit"
          title="Yazıyı Düzenle"
        >
          <Edit size={12} /> Düzenle
        </button>
      )}
    </div>
  );
};
