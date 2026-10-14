import React from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '../ui/Button';
import type { BlogChannel } from '../../types';

export interface PostFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  channelFilter: string;
  onChannelFilterChange: (channel: string) => void;
  channels: BlogChannel[];
  totalCount: number;
  filteredCount: number;
  onNewPost: () => void;
}

export const PostFilterBar: React.FC<PostFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  channelFilter,
  onChannelFilterChange,
  channels,
  totalCount,
  filteredCount,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, color: 'var(--text-primary)' }}>
            Blog Yazıları & Editör
          </h1>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '12px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: 'var(--accent-primary)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            {filteredCount} / {totalCount} Yazı
          </span>
        </div>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
          3 dilli blog yazılarınızı yönetin, filtreleyin, taslak kaydedin ve Gemini AI ile çevirin.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        {/* Arama Çubuğu */}
        <div style={{ position: 'relative', width: '220px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Yazı veya slug ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '36px',
              minHeight: '42px',
              fontSize: '0.85rem',
            }}
          />
        </div>

        {/* Blog Kanalı (Bizce, Anıltılar, Güncel) Açılır Listesi */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <select
            className="form-select"
            value={channelFilter}
            onChange={(e) => onChannelFilterChange(e.target.value)}
            style={{
              minHeight: '42px',
              padding: '8px 14px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              minWidth: '160px',
            }}
            title="Blog Kanalına Göre Filtrele"
          >
            <option value="all">📚 Tüm Blog Türleri</option>
            {channels.map((ch) => (
              <option key={ch.id} value={ch.id}>
                {ch.slug === 'bizce' ? '✍️ ' : ch.slug === 'aniltilar' ? '📖 ' : ch.slug === 'guncel' ? '📰 ' : ch.slug === 'vlog' ? '🎬 ' : ''}
                {ch.name_tr} {ch.is_active === 0 ? '(Pasif)' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Durum Filtresi (Yayında, Taslak) */}
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          style={{
            minHeight: '42px',
            padding: '8px 14px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            minWidth: '135px',
          }}
          title="Yayın Durumuna Göre Filtrele"
        >
          <option value="all">📋 Tüm Durumlar</option>
          <option value="published">✅ Yayında</option>
          <option value="draft">📝 Taslak</option>
        </select>

        {/* Yeni Blog Yazısı Ekle Butonu */}
        <Button onClick={onNewPost} icon={<Plus size={18} />}>
          Yeni Blog Yazısı
        </Button>
      </div>
    </div>
  );
};
