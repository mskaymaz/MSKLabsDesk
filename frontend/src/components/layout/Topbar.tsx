import React from 'react';
import { Search, Bell, User, Sun, Moon, Menu, Palette } from 'lucide-react';
import type { TabType } from '../Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCustomizer } from '../../context/CustomizerContext';

export interface TopbarProps {
  activeTab: TabType;
  onOpenSearch: () => void;
  pendingCount?: number;
  onToggleMobileMenu?: () => void;
}

const tabLabels: Record<TabType, string> = {
  dashboard: 'Özet',
  tickets: 'Destek Biletleri',
  comments: 'Yorum Yönetimi',
  channels: 'Blog Türleri',
  posts: 'Blog Yazıları',
  apps: 'Uygulamalar',
  templates: 'Şablon & Reklam',
  broadcast: 'Duyuru Gönder',
  subscribers: 'Aboneler',
  settings: 'Ayarlar',
};

export const Topbar: React.FC<TopbarProps> = ({
  activeTab,
  onOpenSearch,
  pendingCount = 0,
  onToggleMobileMenu,
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openCustomizer } = useCustomizer();

  return (
    <header
      className="topbar-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        height: '40px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-topbar)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        {onToggleMobileMenu && (
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={onToggleMobileMenu}
            aria-label="Menüyü Aç"
            title="Tüm Menü"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '4px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Menu size={18} />
          </button>
        )}
        <div style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            <span className="hidden-mobile">MSKLabsDesk / </span>
            {tabLabels[activeTab] || activeTab}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          type="button"
          onClick={onOpenSearch}
          title="Hızlı Arama (Cmd+K)"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '3px 8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontSize: '0.74rem',
            cursor: 'pointer',
            height: '28px',
          }}
        >
          <Search size={13} />
          <span className="hidden-mobile">Hızlı Arama (Cmd+K)</span>
        </button>

        <div style={{ position: 'relative' }}>
          <button
            type="button"
            aria-label="Bildirimler"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={16} />
            {pendingCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  right: '3px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--accent-amber)',
                }}
              />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
          title={theme === 'dark' ? 'Açık Mod / Light Mode' : 'Koyu Mod / Dark Mode'}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'transform 0.2s ease',
          }}
        >
          {theme === 'dark' ? (
            <Sun size={16} color="var(--accent-amber)" />
          ) : (
            <Moon size={16} color="var(--accent-primary)" />
          )}
        </button>

        <button
          type="button"
          onClick={openCustomizer}
          aria-label="Görünüm Stüdyosu"
          title="Görünüm Stüdyosu (Yazı Tipi, Renk, Dolgu, Boyut)"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-sm)',
            transition: 'transform 0.2s ease',
          }}
        >
          <Palette size={16} color="var(--accent-primary)" />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
            }}
          >
            <User size={13} />
          </div>
          <span className="hidden-mobile" style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};
