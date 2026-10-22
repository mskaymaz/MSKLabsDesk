import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Inbox,
  MessageSquare,
  Send,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  BookOpen,
  FileText,
  Smartphone,
  Layers,
  Layout,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import type { TabType } from '../Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../context/I18nContext';

export interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingTicketCount?: number;
  pendingCommentCount?: number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  pendingTicketCount = 0,
  pendingCommentCount = 0,
}) => {
  const { user, logout } = useAuth();
  const { language, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    { id: 'dashboard' as TabType, label: t('dashboard') || 'Özet', icon: LayoutDashboard },
    {
      id: 'tickets' as TabType,
      label: t('tickets') || 'Destek Biletleri',
      icon: Inbox,
      badge: pendingTicketCount > 0 ? pendingTicketCount : undefined,
    },
    {
      id: 'comments' as TabType,
      label: t('comments') || 'Yorum Yönetimi',
      icon: MessageSquare,
      badge: pendingCommentCount > 0 ? pendingCommentCount : undefined,
    },
    { id: 'channels' as TabType, label: 'Blog Türleri', icon: BookOpen },
    { id: 'posts' as TabType, label: 'Blog Yazıları', icon: FileText },
    { id: 'apps' as TabType, label: 'Uygulamalar', icon: Smartphone },
    { id: 'pages' as TabType, label: 'Kurumsal Sayfalar', icon: Layers },
    { id: 'templates' as TabType, label: 'Şablon & Reklam', icon: Layout },
    { id: 'broadcast' as TabType, label: t('broadcasts') || 'Duyuru Gönder', icon: Send },
    { id: 'subscribers' as TabType, label: t('subscribers') || 'Aboneler', icon: Users },
    { id: 'settings' as TabType, label: t('settings') || 'Ayarlar', icon: Settings },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobil Navigasyon Menüsü"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        display: 'flex',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Drawer Content */}
      <div
        style={{
          position: 'relative',
          width: '290px',
          maxWidth: '85vw',
          height: '100%',
          background: 'var(--bg-sidebar)',
          borderRight: language === 'ar' ? 'none' : '1px solid var(--border-color)',
          borderLeft: language === 'ar' ? '1px solid var(--border-color)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.6)',
          zIndex: 1201,
          animation: 'slideRight 0.22s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                MSKLabsDesk
              </h2>
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                Yönetim Menüsü
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Items */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                  color: isActive ? '#FFF' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={17} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    style={{
                      background: 'var(--accent-amber)',
                      color: '#000',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {user?.name || 'Yönetici'}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              @{user?.username || 'admin'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {theme === 'dark' ? (
                <Sun size={17} color="var(--accent-amber)" />
              ) : (
                <Moon size={17} color="var(--accent-primary)" />
              )}
            </button>
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              title={t('logout') || 'Çıkış'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-rose)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
