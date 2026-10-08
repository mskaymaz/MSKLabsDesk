import React from 'react';
import { LayoutDashboard, Inbox, MessageSquare, Settings, FileText } from 'lucide-react';
import type { TabType } from '../Sidebar';

export interface MobileBottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard' as TabType, label: 'Özet', icon: LayoutDashboard },
    { id: 'tickets' as TabType, label: 'Biletler', icon: Inbox },
    { id: 'comments' as TabType, label: 'Yorumlar', icon: MessageSquare },
    { id: 'posts' as TabType, label: 'Blog', icon: FileText },
    { id: 'settings' as TabType, label: 'Ayarlar', icon: Settings },
  ];

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#0F1522',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
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
    </nav>
  );
};
