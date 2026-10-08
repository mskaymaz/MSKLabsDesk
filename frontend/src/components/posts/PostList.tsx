import React from 'react';
import { Edit, Trash2, Eye, FileText } from 'lucide-react';
import type { BlogPost } from '../../types';
import { EmptyState } from '../ui/CommonUI';

export interface PostListProps {
  posts: BlogPost[];
  loading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
}

export const PostList: React.FC<PostListProps> = ({ posts, loading, onEdit, onDelete }) => {
  if (loading) {
    return <p style={{ color: 'var(--text-muted)' }}>Yazılar yükleniyor...</p>;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={40} />}
        title="Henüz Blog Yazısı Yok"
        description="Aramanıza uygun yazı bulunamadı veya henüz hiç blog yazısı eklenmedi."
      />
    );
  }

  return (
    <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
            >
              <th style={{ padding: '14px 18px' }}>Başlık & Slug</th>
              <th style={{ padding: '14px 18px' }}>Blog Kanalı</th>
              <th style={{ padding: '14px 18px' }}>Diller</th>
              <th style={{ padding: '14px 18px' }}>Durum</th>
              <th style={{ padding: '14px 18px' }}>Okunma</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: 700, color: '#FFF' }}>{post.title_tr}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>/blog/{post.slug}</div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: 'var(--accent-primary)',
                      fontWeight: 700,
                    }}
                  >
                    {post.channel_name || 'Genel'}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: '#10B981' }}>🇹🇷 TR</span>
                    <span style={{ fontSize: '0.7rem', color: post.title_en ? '#10B981' : 'var(--text-muted)' }}>🇬🇧 EN</span>
                    <span style={{ fontSize: '0.7rem', color: post.title_ar ? '#10B981' : 'var(--text-muted)' }}>🇸🇦 AR</span>
                  </div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: post.status === 'published' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: post.status === 'published' ? 'var(--accent-emerald)' : 'var(--accent-amber)',
                    }}
                  >
                    {post.status === 'published' ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Eye size={14} />
                    <span>{post.views_count || 0}</span>
                  </div>
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => onEdit(post)}
                    aria-label="Düzenle"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      cursor: 'pointer',
                      marginRight: '10px',
                      minWidth: '36px',
                      minHeight: '36px',
                    }}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(post.id)}
                    aria-label="Sil"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-rose)',
                      cursor: 'pointer',
                      minWidth: '36px',
                      minHeight: '36px',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
