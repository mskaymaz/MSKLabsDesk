import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import { type TabType } from './components/Sidebar';
import { AppShell } from './components/layout/AppShell';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { TicketsView } from './views/TicketsView';
import { CommentsView } from './views/CommentsView';
import { BroadcastView } from './views/BroadcastView';
import { SubscribersView } from './views/SubscribersView';
import { SettingsView } from './views/SettingsView';
import { ChannelsView } from './views/ChannelsView';
import { PostsView } from './views/PostsView';
import { AppsCMSView } from './views/AppsCMSView';
import { TemplatesView } from './views/TemplatesView';
import { CouponModal } from './components/CouponModal';
import type { Ticket, CommentItem, Subscriber } from './types';
import { api } from './services/api';

const AdminPanelContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const [couponModalData, setCouponModalData] = useState<{
    isOpen: boolean;
    ticketNo: string;
    email: string;
    name: string;
  }>({
    isOpen: false,
    ticketNo: '',
    email: '',
    name: '',
  });

  const loadData = async () => {
    if (!isAuthenticated) return;
    try {
      const [tRes, cRes, sRes] = await Promise.allSettled([
        api.getTickets(),
        api.getComments(),
        api.getSubscribers(),
      ]);

      if (tRes.status === 'fulfilled') setTickets(tRes.value.tickets || []);
      if (cRes.status === 'fulfilled') setComments(cRes.value.comments || []);
      if (sRes.status === 'fulfilled') setSubscribers(sRes.value.subscribers || []);
    } catch (err) {
      console.error('Veri yükleme hatası:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const pendingTickets = tickets.filter((t) => t.status === 'new' || t.status === 'in_progress').length;
  const pendingComments = comments.filter((c) => c.status === 'pending').length;

  const handleOpenCoupon = (ticketNo: string, email: string, name: string) => {
    setCouponModalData({
      isOpen: true,
      ticketNo,
      email,
      name,
    });
  };

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      pendingTicketCount={pendingTickets}
      pendingCommentCount={pendingComments}
    >
      {activeTab === 'dashboard' && (
        <DashboardView
          tickets={tickets}
          comments={comments}
          subscribers={subscribers}
          onNavigate={setActiveTab}
        />
      )}

      {activeTab === 'tickets' && (
        <TicketsView
          tickets={tickets}
          onRefresh={loadData}
          onOpenCoupon={handleOpenCoupon}
        />
      )}

      {activeTab === 'comments' && (
        <CommentsView
          comments={comments}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'channels' && <ChannelsView />}
      {activeTab === 'posts' && <PostsView />}
      {activeTab === 'apps' && <AppsCMSView />}
      {activeTab === 'templates' && <TemplatesView />}
      {activeTab === 'broadcast' && <BroadcastView />}
      {activeTab === 'subscribers' && <SubscribersView subscribers={subscribers} />}
      {activeTab === 'settings' && <SettingsView />}

      <CouponModal
        isOpen={couponModalData.isOpen}
        onClose={() => setCouponModalData((prev) => ({ ...prev, isOpen: false }))}
        ticketNo={couponModalData.ticketNo}
        userEmail={couponModalData.email}
        userName={couponModalData.name}
      />
    </AppShell>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AdminPanelContent />
      </AuthProvider>
    </I18nProvider>
  );
}
