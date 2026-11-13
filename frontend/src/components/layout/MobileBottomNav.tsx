import React from 'react';
import { LayoutDashboard, Inbox, HelpCircle, MessageSquare, Menu, Settings } from 'lucide-react';
import type { TabType } from '../Sidebar';

export interface MobileBottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingTicketCount?: number;
  pendingCommentCount?: number;
  onOpenMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingTicketCount = 0,
  pendingCommentCount = 0,
  onOpenMenu,
}) => {
  const totalInboxCount = pendingTicketCount + pendingCommentCount;

  const items: { id: TabType; label: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', label: 'Özet', icon: LayoutDashboard },
    { id: 'inbox', label: 'İstasyon', icon: Inbox, badge: totalInboxCount > 0 ? totalInboxCount : undefined },
    { id: 'tickets', label: 'Destek', icon: HelpCircle, badge: pendingTicketCount > 0 ? pendingTicketCount : undefined },
    { id: 'comments', label: 'Yorumlar', icon: MessageSquare, badge: pendingCommentCount > 0 ? pendingCommentCount : undefined },
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
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={18} />
              {item.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-9px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    borderRadius: '9px',
                    padding: '0 4px',
                    fontSize: '8.5px',
                    fontWeight: 700,
                    lineHeight: '13px',
                    minWidth: '13px',
                    textAlign: 'center',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
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
