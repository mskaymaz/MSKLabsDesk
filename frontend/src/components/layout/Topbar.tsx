import React from 'react';
import { Search, Bell, User, Sun, Moon } from 'lucide-react';
import type { TabType } from '../Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export interface TopbarProps {
  activeTab: TabType;
  onOpenSearch: () => void;
  pendingCount?: number;
}

export const Topbar: React.FC<TopbarProps> = ({ activeTab, onOpenSearch, pendingCount = 0 }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-topbar)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div>
        <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>MSKLabsDesk / {activeTab}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          type="button"
          onClick={onOpenSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: 'var(--font-xs)',
            cursor: 'pointer',
            minHeight: '44px',
          }}
        >
          <Search size={16} />
          <span>Hızlı Arama (Cmd+K)</span>
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
              padding: '8px',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={20} />
            {pendingCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
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
            padding: '8px',
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            transition: 'transform 0.2s ease',
          }}
        >
          {theme === 'dark' ? (
            <Sun size={20} color="var(--accent-amber)" />
          ) : (
            <Moon size={20} color="var(--accent-primary)" />
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
            }}
          >
            <User size={16} />
          </div>
          <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
            {user?.name || 'Admin'}
          </span>
        </div>
      </div>
    </header>
  );
};
