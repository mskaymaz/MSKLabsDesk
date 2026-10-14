import React from 'react';
import { FileText } from 'lucide-react';
import type { BlogPost, BlogChannel } from '../../types';
import { EmptyState } from '../ui/CommonUI';
import { PostCard } from './PostCard';

export interface PostListProps {
  posts: BlogPost[];
  channels?: BlogChannel[];
  loading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete?: (id: string) => void;
  onPublish?: (post: BlogPost) => void;
  onUnpublish?: (post: BlogPost) => void;
  onMoveToTrash?: (id: string) => void;
  onRestore?: (id: string) => void;
  onPermanentDelete?: (id: string) => void;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  channels,
  loading,
  onEdit,
  onDelete,
  onPublish,
  onUnpublish,
  onMoveToTrash,
  onRestore,
  onPermanentDelete,
}) => {
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
        description="Seçili filtrelere uygun blog yazısı bulunamadı veya bu durumda makale bulunmuyor."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
          channels={channels}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
          onMoveToTrash={onMoveToTrash}
          onRestore={onRestore}
          onPermanentDelete={onPermanentDelete}
        />
      ))}
    </div>
  );
};
