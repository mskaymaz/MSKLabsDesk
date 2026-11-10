/**
 * MSKLabsDesk — Kompakt Hızlı İletişim İstasyonu Konfigürasyonu (INBOX-APP-001)
 * File: frontend/src/config/inboxConfig.ts
 */

import type { TabType } from '../components/Sidebar';

export interface InboxMetricBadge {
  code: string;       // Örn: 'O', 'D', 'Y', 'İ', '!'
  tooltip: string;    // Açıklama: 'Onay Bekleyen', 'Yeni', 'Acil'
  variant: 'danger' | 'warning' | 'info' | 'neutral';
}

export interface InboxGroupConfig {
  id: 'blog' | 'support' | 'email';
  title: string;
  icon: string;
  description: string;
  targetTab: TabType;
}

export const INBOX_GROUPS: InboxGroupConfig[] = [
  {
    id: 'blog',
    title: 'Blog Yorumları & Moderasyon',
    icon: 'MessageSquare',
    description: 'Yayın ve e-posta teyidi bekleyen blog etkileşimleri',
    targetTab: 'comments',
  },
  {
    id: 'support',
    title: 'Destek Masası & Biletler',
    icon: 'Inbox',
    description: 'Konu bazlı kullanıcı yardım ve arıza çağrıları',
    targetTab: 'tickets',
  },
  {
    id: 'email',
    title: 'Kurumsal Gelen E-Postalar',
    icon: 'Mail',
    description: '@msklabs.org adreslerine düşen resmi yazışmalar',
    targetTab: 'tickets',
  },
];

export const INBOX_BADGE_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  danger: {
    bg: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    border: 'rgba(239, 68, 68, 0.35)',
  },
  warning: {
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#f59e0b',
    border: 'rgba(245, 158, 11, 0.35)',
  },
  info: {
    bg: 'rgba(6, 182, 212, 0.15)',
    color: '#06b6d4',
    border: 'rgba(6, 182, 212, 0.35)',
  },
  neutral: {
    bg: 'rgba(148, 163, 184, 0.1)',
    color: '#94a3b8',
    border: 'rgba(148, 163, 184, 0.25)',
  },
};
