import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  MessageSquare,
  Mail,
  MessageCircle,
  RotateCw,
  X,
  ExternalLink,
  Inbox,
  AlertTriangle,
  Loader2,
  Clock,
} from 'lucide-react';
import { api } from '../../services/api';
import type { UnifiedInboxItem, UnifiedInboxResponse } from '../../types';
import type { TabType } from '../Sidebar';

export interface UnifiedInboxPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
  onCountUpdate?: (count: number) => void;
}

export const UnifiedInboxPopover: React.FC<UnifiedInboxPopoverProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onCountUpdate,
}) => {
  const [items, setItems] = useState<UnifiedInboxItem[]>([]);
  const [counts, setCounts] = useState<UnifiedInboxResponse['counts']>({
    total_unread: 0,
    tickets: 0,
    emails: 0,
    comments: 0,
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'ticket' | 'email' | 'comment'>('all');
  const [loading, setLoading] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const fetchInbox = async (type = activeFilter) => {
    setLoading(true);
    try {
      const data = await api.getUnifiedInbox(type);
      setItems(data.items || []);
      setCounts(data.counts);
      if (onCountUpdate) {
        onCountUpdate(data.counts.total_unread);
      }
    } catch (err) {
      console.warn('Inbox verisi yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchInbox(activeFilter);
    }
  }, [isOpen, activeFilter]);

  // Dışarı tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Göreceli Zaman Hesaplayıcı
  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Az önce';
      if (diffMins < 60) return `${diffMins} dk önce`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} sa önce`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} gün önce`;
    } catch {
      return dateStr;
    }
  };

  const handleItemClick = (item: UnifiedInboxItem) => {
    onNavigate(item.target_route);
    onClose();
  };

  return (
    <div
      ref={popoverRef}
      className="animate-fade-in"
      style={{
        position: 'absolute',
        top: '46px',
        right: '12px',
        width: '380px',
        maxWidth: 'calc(100vw - 24px)',
        maxHeight: '520px',
        background: 'var(--bg-card, #1e293b)',
        color: 'var(--text-primary, #f8fafc)',
        borderRadius: '10px',
        border: '1px solid var(--border-card, #334155)',
        boxShadow: '0 18px 30px -4px rgba(0, 0, 0, 0.5), 0 8px 12px -2px rgba(0, 0, 0, 0.3)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Başlık Çubuğu */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle, #334155)',
          background: 'rgba(255, 255, 255, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} style={{ color: 'var(--accent-cyan, #06b6d4)' }} />
          <strong style={{ fontSize: '0.88rem' }}>Bildirim Merkezi</strong>
          {counts.total_unread > 0 && (
            <span
              style={{
                fontSize: '0.72rem',
                padding: '1px 6px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                fontWeight: 700,
                border: '1px solid rgba(245, 158, 11, 0.4)',
              }}
            >
              {counts.total_unread} Yeni
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => fetchInbox(activeFilter)}
            disabled={loading}
            title="Yenile"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #94a3b8)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RotateCw size={13} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Kapat"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted, #94a3b8)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* 2. Filtre Sekmeleri */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border-subtle, #334155)',
          background: 'rgba(0, 0, 0, 0.1)',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'all' as const, label: 'Tümü', count: counts.total_unread },
          { id: 'ticket' as const, label: 'Destek', count: counts.tickets },
          { id: 'email' as const, label: 'E-Posta', count: counts.emails },
          { id: 'comment' as const, label: 'Yorumlar', count: counts.comments },
        ].map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              style={{
                background: isActive ? 'var(--accent-primary, #0284c7)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#ffffff' : 'var(--text-secondary, #cbd5e1)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 9px',
                fontSize: '0.74rem',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    padding: '0 4px',
                    borderRadius: '8px',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                    fontWeight: 700,
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. Bildirim Listesi */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '360px',
          padding: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        {loading && items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8' }}>
            <Loader2 size={22} className="animate-spin" style={{ margin: '0 auto 8px', color: '#38bdf8' }} />
            <p style={{ fontSize: '0.80rem' }}>Bildirimler taranıyor...</p>
          </div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: '#94a3b8' }}>
            <Inbox size={30} style={{ margin: '0 auto 8px', opacity: 0.5, color: '#38bdf8' }} />
            <p style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary, #f8fafc)', margin: '0 0 4px 0' }}>
              Bekleyen Bildirim Yok
            </p>
            <p style={{ fontSize: '0.74rem', margin: 0, opacity: 0.8 }}>
              Tüm destek talepleri, e-postalar ve yorumlar güncel.
            </p>
          </div>
        ) : (
          items.map((item) => {
            const isTicket = item.type === 'ticket';
            const isEmail = item.type === 'email';
            const isComment = item.type === 'comment';

            const iconColor = isEmail ? '#818cf8' : isTicket ? '#38bdf8' : '#f59e0b';
            const typeLabel = isEmail ? 'E-Posta' : isTicket ? 'Destek' : 'Yorum';

            return (
              <div
                key={`${item.type}_${item.id}`}
                onClick={() => handleItemClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '9px 10px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                {/* Sol Tip İkonu */}
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    background: `${iconColor}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  {isEmail && <Mail size={14} style={{ color: iconColor }} />}
                  {isTicket && <MessageSquare size={14} style={{ color: iconColor }} />}
                  {isComment && <MessageCircle size={14} style={{ color: iconColor }} />}
                </div>

                {/* Orta Metin */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '0.70rem', color: iconColor, fontWeight: 700 }}>
                      {typeLabel}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Clock size={10} /> {formatTimeAgo(item.created_at)}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.80rem', fontWeight: 600, color: 'var(--text-primary, #f8fafc)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>

                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', margin: '2px 0 3px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <strong>{item.sender_name}</strong> {item.sender_email ? `(${item.sender_email})` : ''}
                  </div>

                  <div style={{ fontSize: '0.73rem', color: 'var(--text-secondary, #cbd5e1)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.snippet}
                  </div>

                  {item.urgency === 'high' || item.urgency === 'urgent' ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.66rem',
                        marginTop: '4px',
                        padding: '1px 5px',
                        borderRadius: '4px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        fontWeight: 700,
                      }}
                    >
                      <AlertTriangle size={10} /> Acil İnceleme
                    </span>
                  ) : null}
                </div>

                <ExternalLink size={12} style={{ color: '#64748b', flexShrink: 0, marginTop: '4px' }} />
              </div>
            );
          })
        )}
      </div>

      {/* 4. Alt Bilgi Çubuğu */}
      <div
        style={{
          padding: '8px 14px',
          borderTop: '1px solid var(--border-subtle, #334155)',
          background: 'rgba(0, 0, 0, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.72rem',
          color: '#94a3b8',
        }}
      >
        <span>Bildirime tıklayarak ilgili ekrana gidebilirsiniz.</span>
        <button
          type="button"
          onClick={() => {
            onNavigate('tickets');
            onClose();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-cyan, #06b6d4)',
            cursor: 'pointer',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: 0,
          }}
        >
          Destek Masası &rarr;
        </button>
      </div>
    </div>
  );
};
