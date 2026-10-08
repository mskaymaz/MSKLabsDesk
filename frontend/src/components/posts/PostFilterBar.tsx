import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export interface PostFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onNewPost: () => void;
}

export const PostFilterBar: React.FC<PostFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onNewPost,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 'var(--space-4)',
      }}
    >
      <div>
        <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: '#FFF' }}>Blog Yazıları & Editör</h1>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
          3 dilli blog yazılarınızı oluşturun, taslak kaydedin ve Gemini AI ile anında çevirin.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '220px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Yazı ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontSize: 'var(--font-xs)',
              outline: 'none',
              minHeight: '44px',
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          style={{
            minHeight: '44px',
            padding: '8px 12px',
            background: '#0F1522',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-xs)',
            outline: 'none',
          }}
        >
          <option value="all">Tüm Durumlar</option>
          <option value="draft">Taslak</option>
          <option value="published">Yayında</option>
        </select>

        <Button onClick={onNewPost} icon={<Plus size={18} />}>
          Yeni Blog Yazısı Yaz
        </Button>
      </div>
    </div>
  );
};
