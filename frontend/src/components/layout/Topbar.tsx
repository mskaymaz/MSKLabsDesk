import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Sun, Moon, Menu, Palette } from 'lucide-react';
import type { TabType } from '../Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCustomizer } from '../../context/CustomizerContext';
import { UnifiedInboxPopover } from '../inbox/UnifiedInboxPopover';

export interface TopbarProps {
  activeTab: TabType;
  onOpenSearch: () => void;
  pendingCount?: number;
  onToggleMobileMenu?: () => void;
  onNavigate?: (tab: TabType) => void;
}

const tabLabels: Record<TabType, string> = {
  dashboard: 'Özet',
  tickets: 'Destek Biletleri',
  comments: 'Yorum Yönetimi',
  channels: 'Blog Türleri',
  posts: 'Blog Yazıları',
  apps: 'Uygulamalar',
  pages: 'Kurumsal Sayfalar',
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
  onNavigate,
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openCustomizer } = useCustomizer();
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [inboxCount, setInboxCount] = useState(pendingCount);

  useEffect(() => {
    setInboxCount(pendingCount);
  }, [pendingCount]);

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
            onClick={() => setIsInboxOpen((prev) => !prev)}
            aria-label="Bildirimler"
            title="Birleşik Bildirim Merkezi"
            style={{
              background: isInboxOpen ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
              border: isInboxOpen ? '1px solid var(--accent-cyan)' : 'none',
              borderRadius: 'var(--radius-sm)',
              color: isInboxOpen ? 'var(--accent-cyan)' : 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '4px',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
          >
            <Bell size={16} />
            {inboxCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-3px',
                  minWidth: '15px',
                  height: '15px',
                  borderRadius: '10px',
                  background: 'var(--accent-amber, #f59e0b)',
                  color: '#0f172a',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  border: '1.5px solid var(--bg-topbar)',
                  lineHeight: 1,
                }}
              >
                {inboxCount > 99 ? '99+' : inboxCount}
              </span>
            )}
          </button>

          <UnifiedInboxPopover
            isOpen={isInboxOpen}
            onClose={() => setIsInboxOpen(false)}
            onNavigate={(tab) => {
              if (onNavigate) onNavigate(tab);
            }}
            onCountUpdate={(cnt) => setInboxCount(cnt)}
          />
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
