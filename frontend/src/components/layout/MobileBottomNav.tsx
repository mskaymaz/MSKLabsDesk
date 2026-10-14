import React from 'react';
import { LayoutDashboard, Inbox, MessageSquare, Settings, FileText, Menu } from 'lucide-react';
import type { TabType } from '../Sidebar';

export interface MobileBottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMenu,
}) => {
  const items = [
    { id: 'dashboard' as TabType, label: 'Özet', icon: LayoutDashboard },
    { id: 'tickets' as TabType, label: 'Biletler', icon: Inbox },
    { id: 'comments' as TabType, label: 'Yorumlar', icon: MessageSquare },
    { id: 'posts' as TabType, label: 'Blog', icon: FileText },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        background: 'var(--bg-topbar)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-color)',
        padding: '6px 0',
        zIndex: 900,
      }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              background: 'transparent',
              border: 'none',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
              fontSize: '10px',
              fontWeight: isActive ? 700 : 400,
              minWidth: '44px',
              minHeight: '44px',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {onOpenMenu ? (
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Tüm Menüyü Aç"
          title="Tüm Menü"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-primary)',
            fontSize: '10px',
            fontWeight: 700,
            minWidth: '44px',
            minHeight: '44px',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Menu size={18} />
          <span>Menü ☰</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'settings' ? 'var(--accent-primary)' : 'var(--text-muted)',
            fontSize: '10px',
            fontWeight: activeTab === 'settings' ? 700 : 400,
            minWidth: '44px',
            minHeight: '44px',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Settings size={18} />
          <span>Ayarlar</span>
        </button>
      )}
    </nav>
  );
};
