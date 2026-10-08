import React, { useState } from 'react';
import { Sidebar, type TabType } from '../Sidebar';
import { Topbar } from './Topbar';
import { MobileBottomNav } from './MobileBottomNav';
import { GlobalSearchModal } from '../modals/GlobalSearchModal';
import { ErrorBoundary, OfflineBanner } from './ErrorBoundary';
import { useTranslation } from '../../context/I18nContext';

export interface AppShellProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingTicketCount?: number;
  pendingCommentCount?: number;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  setActiveTab,
  pendingTicketCount = 0,
  pendingCommentCount = 0,
  children,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { language } = useTranslation();

  return (
    <ErrorBoundary>
      <div
        className="app-container"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}
      >
        <OfflineBanner />

        {/* Sidebar for Desktop / Tablet */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingTicketCount={pendingTicketCount}
          pendingCommentCount={pendingCommentCount}
        />

        <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Topbar
            activeTab={activeTab}
            onOpenSearch={() => setIsSearchOpen(true)}
            pendingCount={pendingTicketCount + pendingCommentCount}
          />
          <div className="page-content" style={{ padding: '24px', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation (<640px) */}
        <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Global Cmd+K Search Modal */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={setActiveTab}
        />
      </div>
    </ErrorBoundary>
  );
};
