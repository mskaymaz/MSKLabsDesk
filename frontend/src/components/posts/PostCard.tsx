import React from 'react';
import {
  Eye,
  Video,
  Calendar,
  ExternalLink,
  User,
} from 'lucide-react';
import type { BlogPost, BlogChannel } from '../../types';
import { PostCardActions } from './PostCardActions';

export interface PostCardProps {
  post: BlogPost;
  index: number;
  channels?: BlogChannel[];
  onEdit: (post: BlogPost) => void;
  onDelete?: (id: string) => void;
  onPublish?: (post: BlogPost) => void;
  onUnpublish?: (post: BlogPost) => void;
  onMoveToTrash?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
}

const getChannelInfo = (post: BlogPost, channels?: BlogChannel[]) => {
  const ch = channels?.find((c) => c.id === post.channel_id) || {
    name_tr: post.channel_name || 'Genel',
    slug: post.channel_slug || 'bizce',
  };

  const slug = (post.channel_slug || ch.slug || '').toLowerCase();
  switch (slug) {
    case 'bizce':
      return {
        name: ch.name_tr || 'Bizce',
        icon: '✍️',
        bg: 'rgba(99, 102, 241, 0.12)',
        color: 'var(--accent-primary)',
        border: 'rgba(99, 102, 241, 0.25)',
      };
    case 'aniltilar':
    case 'anilts':
      return {
        name: ch.name_tr || 'Anıltılar',
        icon: '📖',
        bg: 'rgba(16, 185, 129, 0.12)',
        color: 'var(--accent-emerald)',
        border: 'rgba(16, 185, 129, 0.25)',
      };
    case 'guncel':
      return {
        name: ch.name_tr || 'Güncel',
        icon: '📰',
        bg: 'rgba(245, 158, 11, 0.12)',
        color: 'var(--accent-amber)',
        border: 'rgba(245, 158, 11, 0.25)',
      };
    case 'vlog':
      return {
        name: ch.name_tr || 'Vlog',
        icon: '🎬',
        bg: 'rgba(239, 68, 68, 0.12)',
        color: 'var(--accent-rose)',
        border: 'rgba(239, 68, 68, 0.25)',
      };
    default:
      return {
        name: ch.name_tr || 'Genel',
        icon: '💡',
        bg: 'rgba(99, 102, 241, 0.12)',
        color: 'var(--accent-primary)',
        border: 'rgba(99, 102, 241, 0.25)',
      };
  }
};

const getStatusBadge = (status: string) => {
  if (status === 'published') {
    return {
      label: '✅ Yayında',
      bg: 'rgba(16, 185, 129, 0.15)',
      color: 'var(--accent-emerald)',
      border: 'rgba(16, 185, 129, 0.3)',
    };
  }
  if (status === 'unpublished' || status === 'archived') {
    return {
      label: '⏸️ Yayından Kaldırıldı',
      bg: 'rgba(245, 158, 11, 0.15)',
      color: 'var(--accent-amber)',
      border: 'rgba(245, 158, 11, 0.3)',
    };
  }
  if (status === 'trash') {
    return {
      label: '🗑️ Çöp Kutusu',
      bg: 'rgba(239, 68, 68, 0.15)',
      color: 'var(--accent-rose)',
      border: 'rgba(239, 68, 68, 0.3)',
    };
  }
  return {
    label: '📝 Taslak',
    bg: 'rgba(99, 102, 241, 0.15)',
    color: 'var(--accent-primary)',
    border: 'rgba(99, 102, 241, 0.3)',
  };
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  index,
  channels,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onMoveToTrash,
  onRestore,
  onPermanentDelete,
}) => {
  const chInfo = getChannelInfo(post, channels);
  const sBadge = getStatusBadge(post.status);

  return (
    <div className="admin-list-card">
      {/* Üst Satır: Sıra No + Kanal + Durum + Video + Diller & İşlem Butonları */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
          {/* Sıra Numarası Rozeti */}
          <span
            className="admin-badge admin-badge-index"
            title={`Blog Sıra Numarası: ${index + 1}`}
          >
            #{index + 1}
          </span>

          {/* Kanal Rozeti (Bizce, Anıltılar, Güncel, Vlog) */}
          <span
            className="admin-badge"
            style={{
              background: chInfo.bg,
              color: chInfo.color,
              border: `1px solid ${chInfo.border}`,
            }}
          >
            <span>{chInfo.icon}</span>
            <span>{chInfo.name}</span>
          </span>

          {/* Yayın Durumu Rozeti */}
          <span
            className="admin-badge"
            style={{
              background: sBadge.bg,
              color: sBadge.color,
              border: `1px solid ${sBadge.border}`,
            }}
          >
            {sBadge.label}
          </span>

          {/* Video Rozeti */}
          {post.video_url && (
            <span
              className="admin-badge"
              title={`Video Bağlantısı: ${post.video_url}`}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                color: 'var(--accent-rose)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <Video size={11} /> Video
            </span>
          )}

          {/* Diller (TR, EN, AR) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: '2px' }}>
            <span
              className="admin-badge"
              style={{
                color: 'var(--accent-emerald)',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                minWidth: '22px',
                justifyContent: 'center',
              }}
              title="Türkçe: Yayında / Mevcut"
            >
              TR
            </span>
            <span
              className="admin-badge"
              style={{
                color: post.title_en ? 'var(--accent-emerald)' : 'var(--text-muted)',
                background: post.title_en ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${post.title_en ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                opacity: post.title_en ? 1 : 0.6,
                minWidth: '22px',
                justifyContent: 'center',
              }}
              title={post.title_en ? 'İngilizce: Çeviri Mevcut' : 'İngilizce: Henüz Çevrilmedi (Eksik)'}
            >
              EN
            </span>
            <span
              className="admin-badge"
              style={{
                color: post.title_ar ? 'var(--accent-emerald)' : 'var(--text-muted)',
                background: post.title_ar ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${post.title_ar ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                opacity: post.title_ar ? 1 : 0.6,
                minWidth: '22px',
                justifyContent: 'center',
              }}
              title={post.title_ar ? 'Arapça: Çeviri Mevcut' : 'Arapça: Henüz Çevrilmedi (Eksik)'}
            >
              AR
            </span>
          </div>

          {/* Kapak Görseli Rozeti */}
          {post.cover_image && (
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 400,
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                padding: '1px 4px',
                borderRadius: '3px',
              }}
              title="Kapak Görseli Tanımlı"
            >
              🖼️ Görsel
            </span>
          )}
        </div>

        {/* Sağ Taraf: Meta Bilgiler (30px Boşluk) + İşlemler (3 Aşamalı Yaşam Döngüsü) */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
          {/* Meta Bilgiler: Okunma + Tarih + Yazar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.74rem',
              color: 'var(--text-muted)',
              marginRight: '30px',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }} title="Okunma Sayısı">
              <Eye size={12} />
              <span>{post.views_count || 0} okuma</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }} title="Yayın Tarihi">
              <Calendar size={12} />
              <span>
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'Taslak'}
              </span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }} title="Yazar">
              <User size={12} />
              <span>{post.author_name || 'MSK Labs'}</span>
            </span>
          </div>

          {/* İşlemler: 3 Aşamalı Yaşam Döngüsü Butonları */}
          <PostCardActions
            post={post}
            onEdit={onEdit}
            onDelete={onDelete}
            onPublish={onPublish}
            onUnpublish={onUnpublish}
            onMoveToTrash={onMoveToTrash}
            onRestore={onRestore}
            onPermanentDelete={onPermanentDelete}
          />
        </div>
      </div>

      {/* Orta Satır: Blog Başlığı (Sol Menünün Kalın Fontu) ve Bağlantı Yolu */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '4px 10px',
        }}
      >
        <h2 className="admin-card-title" style={{ flex: '1 1 auto' }}>
          {post.title_tr || '(Başlıksız Makale)'}
        </h2>

        {/* Web Bağlantı Yolu */}
        <span
          style={{
            fontSize: '0.76rem',
            fontWeight: 400,
            color: 'var(--text-muted)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            whiteSpace: 'nowrap',
          }}
          title={`Web Bağlantısı: /blog/${post.slug}`}
        >
          <ExternalLink size={11} style={{ opacity: 0.7 }} />
          /blog/{post.slug}
        </span>
      </div>

      {/* Özet Metni: Standart admin-card-desc ile line-clamp-2 */}
      {post.summary_tr && (
        <p className="admin-card-desc line-clamp-2">
          {post.summary_tr}
        </p>
      )}
    </div>
  );
};
