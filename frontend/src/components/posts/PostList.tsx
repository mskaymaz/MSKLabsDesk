import React from 'react';
import { Edit, Trash2, Eye, FileText, Video, Calendar, ExternalLink, User } from 'lucide-react';
import type { BlogPost, BlogChannel } from '../../types';
import { EmptyState } from '../ui/CommonUI';

export interface PostListProps {
  posts: BlogPost[];
  channels?: BlogChannel[];
  loading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
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
        name: ch.name_tr || 'BİZCE',
        icon: '✍️',
        bg: 'rgba(99, 102, 241, 0.12)',
        color: 'var(--accent-primary)',
        border: 'rgba(99, 102, 241, 0.25)',
      };
    case 'aniltilar':
    case 'anilts':
      return {
        name: ch.name_tr || 'ANILTILAR',
        icon: '📖',
        bg: 'rgba(16, 185, 129, 0.12)',
        color: 'var(--accent-emerald)',
        border: 'rgba(16, 185, 129, 0.25)',
      };
    case 'guncel':
      return {
        name: ch.name_tr || 'GÜNCEL',
        icon: '📰',
        bg: 'rgba(245, 158, 11, 0.12)',
        color: 'var(--accent-amber)',
        border: 'rgba(245, 158, 11, 0.25)',
      };
    case 'vlog':
      return {
        name: ch.name_tr || 'VLOG',
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

export const PostList: React.FC<PostListProps> = ({ posts, channels, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Blog yazıları yükleniyor...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={40} />}
        title="Henüz Blog Yazısı Yok"
        description="Seçili filtrelere uygun blog yazısı bulunamadı veya henüz hiç makale eklenmedi."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {posts.map((post, index) => {
        const chInfo = getChannelInfo(post, channels);
        const isPublished = post.status === 'published';

        return (
          <div
            key={post.id}
            className="glass-card glass-card-hover"
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
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
                {/* Kibar ve İnce Sıra Numarası Rozeti */}
                <span
                  style={{
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-color)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                  }}
                  title={`Blog Sıra Numarası: ${index + 1}`}
                >
                  #{index + 1}
                </span>

                {/* Kanal Rozeti (Bizce, Anıltılar, Güncel) */}
                <span
                  style={{
                    padding: '1px 6px',
                    borderRadius: '4px',
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    background: chInfo.bg,
                    color: chInfo.color,
                    border: `1px solid ${chInfo.border}`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <span>{chInfo.icon}</span>
                  <span>{chInfo.name}</span>
                </span>

                {/* Yayın Durumu Rozeti */}
                <span
                  style={{
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    background: isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: isPublished ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                    border: `1px solid ${isPublished ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                  }}
                >
                  {isPublished ? '✅ Yayında' : '📝 Taslak'}
                </span>

                {/* Video Rozeti */}
                {post.video_url && (
                  <span
                    title={`Video Bağlantısı: ${post.video_url}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
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
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: 'var(--accent-emerald)',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      padding: '1px 4px',
                      borderRadius: '3px',
                    }}
                    title="Türkçe: Yayında / Mevcut"
                  >
                    TR
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: post.title_en ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      background: post.title_en ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${post.title_en ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                      padding: '1px 4px',
                      borderRadius: '3px',
                      opacity: post.title_en ? 1 : 0.6,
                    }}
                    title={post.title_en ? 'İngilizce: Çeviri Mevcut' : 'İngilizce: Henüz Çevrilmedi (Eksik)'}
                  >
                    EN
                  </span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: post.title_ar ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      background: post.title_ar ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${post.title_ar ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                      padding: '1px 4px',
                      borderRadius: '3px',
                      opacity: post.title_ar ? 1 : 0.6,
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
                      fontWeight: 600,
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

              {/* Sağ Taraf: Meta Bilgiler (30px Boşluk) + İşlemler (Düzenle & Sil) */}
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

                {/* İşlemler: Düzenle & Sil */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
                    }}
                    title="Yazıyı Düzenle"
                  >
                    <Edit size={12} /> Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(post.id)}
                    className="btn btn-sm btn-danger"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: '2px 6px',
                      fontSize: '0.75rem',
                      height: '24px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    title="Yazıyı Sil"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
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
              <h2
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3,
                  margin: 0,
                  flex: '1 1 auto',
                  letterSpacing: '-0.01em',
                }}
              >
                {post.title_tr || '(Başlıksız Makale)'}
              </h2>

              {/* Web Bağlantı Yolu */}
              <span
                style={{
                  fontSize: '0.76rem',
                  fontWeight: 500,
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

            {/* Özet Metni: Sol menü linklerinin font ve özelliklerinde */}
            {post.summary_tr && (
              <p
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {post.summary_tr}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
