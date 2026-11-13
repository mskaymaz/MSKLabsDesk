import React, { useState, useEffect } from 'react';
import {
  Inbox,
  RotateCw,
  MessageSquare,
  Mail,
  AlertTriangle,
  Sparkles,
  Heart,
  Lightbulb,
  Archive,
  HelpCircle,
  Shield,
  ChevronRight,
  BookOpen,
  Feather,
  Newspaper,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import type { InboxSummaryResponse } from '../types';
import type { TabType } from '../components/Sidebar';
import { INBOX_BADGE_STYLES } from '../config/inboxConfig';

export interface InboxNavigationParams {
  category?: string;
  status?: string;
  channel?: string;
}

interface InboxViewProps {
  onNavigate: (tab: TabType, params?: InboxNavigationParams) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({ onNavigate }) => {
  const [data, setData] = useState<InboxSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await api.getInboxSummary();
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Özet verileri alınamadı.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'alert-triangle': return <AlertTriangle size={15} style={{ color: '#ef4444', flexShrink: 0 }} />;
      case 'sparkles': return <Sparkles size={15} style={{ color: '#6366f1', flexShrink: 0 }} />;
      case 'heart': return <Heart size={15} style={{ color: '#10b981', flexShrink: 0 }} />;
      case 'lightbulb': return <Lightbulb size={15} style={{ color: '#f59e0b', flexShrink: 0 }} />;
      case 'archive': return <Archive size={15} style={{ color: '#94a3b8', flexShrink: 0 }} />;
      case 'mail': return <Mail size={15} style={{ color: '#06b6d4', flexShrink: 0 }} />;
      case 'help-circle': return <HelpCircle size={15} style={{ color: '#3b82f6', flexShrink: 0 }} />;
      case 'shield': return <Shield size={15} style={{ color: '#8b5cf6', flexShrink: 0 }} />;
      case 'feather': return <Feather size={15} style={{ color: '#ec4899', flexShrink: 0 }} />;
      case 'newspaper': return <Newspaper size={15} style={{ color: '#14b8a6', flexShrink: 0 }} />;
      case 'layers': return <Layers size={15} style={{ color: '#a855f7', flexShrink: 0 }} />;
      default: return <BookOpen size={15} style={{ color: '#64748b', flexShrink: 0 }} />;
    }
  };

  const renderBadge = (
    code: string,
    count: number,
    tooltip: string,
    variant: 'danger' | 'warning' | 'info' | 'neutral',
    onClick?: (e: React.MouseEvent) => void
  ) => {
    const isZero = count === 0;
    const style = INBOX_BADGE_STYLES[variant] || INBOX_BADGE_STYLES.neutral;

    return (
      <button
        type="button"
        className="inbox-station-badge"
        onClick={onClick}
        title={`${tooltip}: ${count}`}
        style={{
          border: isZero ? '1px solid var(--border-subtle, rgba(148, 163, 184, 0.25))' : `1px solid ${style.border}`,
          backgroundColor: isZero ? 'var(--bg-secondary, rgba(148, 163, 184, 0.08))' : style.bg,
          color: isZero ? 'var(--text-muted)' : style.color,
          cursor: isZero ? 'default' : 'pointer',
        }}
      >
        <span style={{ opacity: isZero ? 0.7 : 0.95 }}>{code}:</span>
        <span style={{ fontWeight: 700 }}>{count}</span>
      </button>
    );
  };

  return (
    <div className="inbox-station-container">
      {/* 1. Üst Bar: Başlık, Özet Sayaç ve Yenileme Butonu */}
      <div className="inbox-station-header">
        <div className="inbox-station-header-left">
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#06b6d4',
              flexShrink: 0,
            }}
          >
            <Inbox size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                İletişim & Yanıtlama İstasyonu
              </h1>
              {data && (
                <span
                  style={{
                    backgroundColor: data.totals.all_actionable > 0 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: data.totals.all_actionable > 0 ? '#ef4444' : '#10b981',
                    border: `1px solid ${data.totals.all_actionable > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '1px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {data.totals.all_actionable > 0 ? `${data.totals.all_actionable} Bekleyen` : 'Tümü Güncel'}
                </span>
              )}
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Blog yorumları, destek talepleri ve kurumsal postalar için operasyonel özet.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="admin-btn admin-btn-sm admin-btn-refresh"
          onClick={() => fetchSummary(true)}
          disabled={loading || refreshing}
          title="Verileri Yenile"
        >
          <RotateCw size={13} className={refreshing ? 'spin' : ''} />
          <span>{refreshing ? 'Yenileniyor...' : 'Yenile'}</span>
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '0.85rem',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      {/* 2. Dikey Kaydırılabilir / Mobilde Doğal Akışlı Liste Alanı */}
      <div className="inbox-station-list">
        {/* GRUP 1: BLOG YORUMLARI & MODERASYON */}
        <div className="inbox-station-card">
          <div className="inbox-station-group-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} style={{ color: '#6366f1', flexShrink: 0 }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Blog Yorumları & Moderasyon
              </span>
            </div>
            <span className="inbox-station-legend">
              O: Onay Bekleyen • D: Doğrulama Bekleyen
            </span>
          </div>

          <div className="inbox-station-rows">
            {data?.blog_channels.map((ch) => (
              <div
                key={ch.id}
                className="inbox-station-row"
                onClick={() => onNavigate('comments', { channel: ch.slug, status: 'pending' })}
              >
                <div className="inbox-station-row-left">
                  <div className="inbox-icon-box">
                    {getCategoryIcon(ch.icon)}
                  </div>
                  <div className="inbox-station-row-title-wrap">
                    <span className="inbox-station-row-title">{ch.name}</span>
                  </div>
                </div>

                <div className="inbox-station-badges-wrap">
                  {renderBadge('O', ch.pending, 'Onay Bekleyen', 'warning', (e) => {
                    e.stopPropagation();
                    onNavigate('comments', { channel: ch.slug, status: 'pending' });
                  })}
                  {renderBadge('D', ch.unverified, 'Doğrulama Bekleyen', 'info', (e) => {
                    e.stopPropagation();
                    onNavigate('comments', { channel: ch.slug, status: 'unverified' });
                  })}
                  <ChevronRight size={13} style={{ color: 'var(--text-muted)', opacity: 0.6, marginLeft: '2px', flexShrink: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRUP 2: DESTEK MASASI & BİLETLER */}
        <div className="inbox-station-card">
          <div className="inbox-station-group-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={16} style={{ color: '#06b6d4', flexShrink: 0 }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Destek Masası & Biletler
              </span>
            </div>
            <span className="inbox-station-legend">
              Y: Yeni • İ: İşlemde • !: Acil / Kritik
            </span>
          </div>

          <div className="inbox-station-rows">
            {data?.support_categories.map((cat) => (
              <div
                key={cat.key}
                className="inbox-station-row"
                onClick={() => onNavigate('tickets', { category: cat.key })}
              >
                <div className="inbox-station-row-left">
                  <div className="inbox-icon-box">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <div className="inbox-station-row-title-wrap">
                    <span className="inbox-station-row-title">{cat.name}</span>
                  </div>
                </div>

                <div className="inbox-station-badges-wrap">
                  {renderBadge('Y', cat.new, 'Yeni Talepler', 'info', (e) => {
                    e.stopPropagation();
                    onNavigate('tickets', { category: cat.key, status: 'new' });
                  })}
                  {renderBadge('İ', cat.in_progress, 'İşlemdeki Talepler', 'warning', (e) => {
                    e.stopPropagation();
                    onNavigate('tickets', { category: cat.key, status: 'in_progress' });
                  })}
                  {renderBadge('!', cat.urgent, 'Acil & Öncelikli', 'danger', (e) => {
                    e.stopPropagation();
                    onNavigate('tickets', { category: cat.key, status: 'urgent' });
                  })}
                  <ChevronRight size={13} style={{ color: 'var(--text-muted)', opacity: 0.6, marginLeft: '2px', flexShrink: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GRUP 3: KURUMSAL GELEN E-POSTALAR */}
        <div className="inbox-station-card">
          <div className="inbox-station-group-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} style={{ color: '#10b981', flexShrink: 0 }} />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                Kurumsal Gelen E-Postalar
              </span>
            </div>
            <span className="inbox-station-legend">
              Y: Cevap Bekleyen / Yeni
            </span>
          </div>

          <div className="inbox-station-rows">
            {data?.email_boxes.map((box) => (
              <div
                key={box.key}
                className="inbox-station-row"
                onClick={() => onNavigate('tickets', { category: 'email' })}
              >
                <div className="inbox-station-row-left">
                  <div className="inbox-icon-box">
                    {getCategoryIcon(box.icon)}
                  </div>
                  <div className="inbox-station-row-title-wrap">
                    <span className="inbox-station-row-title">{box.name}</span>
                    <span className="inbox-station-row-subtitle">({box.address})</span>
                  </div>
                </div>

                <div className="inbox-station-badges-wrap">
                  {renderBadge('Y', box.new, 'Cevap Bekleyen E-Posta', 'info', (e) => {
                    e.stopPropagation();
                    onNavigate('tickets', { category: 'email', status: 'new' });
                  })}
                  <ChevronRight size={13} style={{ color: 'var(--text-muted)', opacity: 0.6, marginLeft: '2px', flexShrink: 0 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
