import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  MessageSquare, 
  Send, 
  Users, 
  Settings, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type TabType = 'dashboard' | 'tickets' | 'comments' | 'broadcast' | 'subscribers' | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingTicketCount?: number;
  pendingCommentCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingTicketCount = 0,
  pendingCommentCount = 0,
}) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard' as TabType, label: 'Özet Ekranı', icon: LayoutDashboard },
    { 
      id: 'tickets' as TabType, 
      label: 'Destek & Talepler', 
      icon: Inbox, 
      badge: pendingTicketCount > 0 ? pendingTicketCount : undefined 
    },
    { 
      id: 'comments' as TabType, 
      label: 'Blog Yorumları', 
      icon: MessageSquare, 
      badge: pendingCommentCount > 0 ? pendingCommentCount : undefined 
    },
    { id: 'broadcast' as TabType, label: 'Bülten & E-Posta', icon: Send },
    { id: 'subscribers' as TabType, label: 'Aboneler', icon: Users },
    { id: 'settings' as TabType, label: 'Ayarlar', icon: Settings },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 16px',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', marginBottom: '28px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF',
          fontWeight: 800
        }}>
          <ShieldCheck size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF', letterSpacing: '-0.01em' }}>MSKLabsDesk</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Yönetici Paneli</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: isActive ? '#FFF' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.88rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span style={{
                  background: 'var(--accent-amber)',
                  color: '#000',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '10px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer */}
      <div style={{
        padding: '14px',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFF' }}>{user?.name || 'Yönetici'}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{user?.username || 'admin'}</span>
        </div>
        <button
          onClick={logout}
          title="Çıkış Yap"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-rose)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};
