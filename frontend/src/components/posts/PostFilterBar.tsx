import React from 'react';
import { Plus, Search } from 'lucide-react';
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
        position: 'sticky',
        top: '40px',
        zIndex: 20,
        background: 'var(--bg-main)',
        backdropFilter: 'blur(16px)',
        padding: '3px 0 7px 0',
        marginBottom: '6px',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
      }}
    >
      {/* 1. Satır: Başlık + Sayaç + Sağındaki Açıklama */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '1px 2px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <h1
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              margin: 0,
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}
          >
            Blog Yazıları & Editör
          </h1>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--accent-cyan)',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              padding: '1px 6px',
              borderRadius: '10px',
            }}
          >
            {filteredCount} / {totalCount} Yazı
          </span>

          {/* Açıklama: Sol menü linkleri ile aynı font büyüklüğü ve karakteri */}
          <span
            style={{
              fontSize: '0.88rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginLeft: '4px',
            }}
          >
            Çok dilli blog yazılarınızı yönetin
          </span>
        </div>
      </div>

      {/* 2. Satır: Tek Satırda Arama + Türler + Durumlar (Sol) & Yeni Blog Yazısı Butonu (Sağ) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '1px 2px',
        }}
      >
        {/* Sol Grup: Arama, Blog Türleri, Durumlar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Arama Kutusu */}
          <div style={{ position: 'relative', width: '210px' }}>
            <Search
              size={13}
              style={{
                position: 'absolute',
                left: '9px',
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
                height: '28px',
                paddingLeft: '28px',
                paddingRight: '8px',
                fontSize: '0.88rem',
                fontWeight: 500,
              }}
            />
          </div>

          {/* Blog Türleri Açılır Listesi */}
          <select
            className="form-select"
            value={channelFilter}
            onChange={(e) => onChannelFilterChange(e.target.value)}
            style={{
              height: '28px',
              padding: '2px 24px 2px 8px',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: 'pointer',
              width: 'auto',
              maxWidth: '190px',
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

          {/* Durum Açılır Listesi */}
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            style={{
              height: '28px',
              padding: '2px 24px 2px 8px',
              fontSize: '0.88rem',
              fontWeight: 500,
              cursor: 'pointer',
              width: 'auto',
              maxWidth: '150px',
            }}
            title="Yayın Durumuna Göre Filtrele"
          >
            <option value="all">📋 Tüm Durumlar</option>
            <option value="published">✅ Yayında</option>
            <option value="draft">📝 Taslak</option>
          </select>
        </div>

        {/* Sağ Grup: Yeni Blog Yazısı Butonu */}
        <button
          type="button"
          onClick={onNewPost}
          className="btn btn-primary"
          style={{
            height: '28px',
            padding: '0 12px',
            fontSize: '0.85rem',
            fontWeight: 650,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            borderRadius: '6px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
          title="Yeni Blog Yazısı Oluştur"
        >
          <Plus size={14} />
          <span>Yeni Blog Yazısı</span>
        </button>
      </div>
    </div>
  );
};
