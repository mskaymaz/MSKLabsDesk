import React, { useState } from 'react';
import type { Ticket, TicketDetailResponse } from '../types';
import { Search, Sparkles, Eye, Clock, RotateCw } from 'lucide-react';
import { api } from '../services/api';
import { TicketDetailModal } from '../components/TicketDetailModal';
import { useTranslation } from '../context/I18nContext';

interface TicketsViewProps {
  tickets: Ticket[];
  onRefresh: () => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  onRefresh,
}) => {
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTicketDetail, setSelectedTicketDetail] = useState<TicketDetailResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [openedIds, setOpenedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('msk_opened_tickets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const markAsOpened = (id: string) => {
    setOpenedIds((prev) => {
      if (!prev.includes(id)) {
        const next = [...prev, id];
        try { localStorage.setItem('msk_opened_tickets', JSON.stringify(next)); } catch {}
        return next;
      }
      return prev;
    });
  };

  const locale = language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'tr-TR';

  const normalizeCategory = (category?: string): string => {
    const cat = (category || '').toLowerCase();
    if (cat === 'hata' || cat === 'bug') return 'hata';
    if (cat === 'istek' || cat === 'feature') return 'istek';
    if (cat === 'tesekkur' || cat === 'feedback' || cat === 'general') return 'tesekkur';
    if (cat === 'fikir' || cat === 'idea') return 'fikir';
    if (cat === 'email') return 'email';
    return 'diger';
  };

  const getCategoryBadge = (category?: string) => {
    const norm = normalizeCategory(category);
    switch (norm) {
      case 'hata':
        return { label: '🐛 Hata Bildirimi', bg: 'rgba(239, 68, 68, 0.25)', border: 'rgba(239, 68, 68, 0.45)' };
      case 'istek':
        return { label: '✨ Özellik Talebi', bg: 'rgba(99, 102, 241, 0.25)', border: 'rgba(99, 102, 241, 0.45)' };
      case 'tesekkur':
        return { label: '❤️ Teşekkür & Övgü', bg: 'rgba(16, 185, 129, 0.25)', border: 'rgba(16, 185, 129, 0.45)' };
      case 'fikir':
        return { label: '💡 Yeni Fikir', bg: 'rgba(245, 158, 11, 0.25)', border: 'rgba(245, 158, 11, 0.45)' };
      case 'email':
        return { label: '✉️ E-Posta', bg: 'rgba(56, 189, 248, 0.25)', border: 'rgba(56, 189, 248, 0.45)' };
      default:
        return { label: '💬 Genel Talep', bg: 'rgba(156, 163, 175, 0.25)', border: 'rgba(156, 163, 175, 0.45)' };
    }
  };

  const getUnifiedStatusBadge = (ticket: Ticket) => {
    if (ticket.status === 'resolved') return { label: 'Çözüldü', bg: 'rgba(16, 185, 129, 0.25)', border: 'rgba(16, 185, 129, 0.45)' };
    if (ticket.status === 'in_progress') return { label: 'İşlemde', bg: 'rgba(245, 158, 11, 0.25)', border: 'rgba(245, 158, 11, 0.45)' };
    if (ticket.status === 'rejected' || ticket.status === 'closed') return { label: 'Reddedildi', bg: 'rgba(239, 68, 68, 0.25)', border: 'rgba(239, 68, 68, 0.45)' };
    if (openedIds.includes(ticket.id)) return { label: '👁️ Açıldı', bg: 'rgba(156, 163, 175, 0.25)', border: 'rgba(156, 163, 175, 0.45)' };
    return { label: '🔔 Yeni', bg: 'rgba(6, 182, 212, 0.25)', border: 'rgba(6, 182, 212, 0.45)' };
  };

  const filteredTickets = tickets.filter((tItem) => {
    const matchesCategory =
      categoryFilter === 'all' || normalizeCategory(tItem.category) === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      tItem.status === statusFilter ||
      (statusFilter === 'new' && tItem.status === 'open');
    const matchesSearch =
      tItem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tItem.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tItem.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tItem.sender_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleOpenDetail = async (id: string) => {
    markAsOpened(id);
    setLoadingDetail(true);
    try {
      const res = await api.getTicketDetail(id);
      setSelectedTicketDetail(res);
    } catch (err) {
      alert(t('tickets.loadError'));
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleRefreshDetail = async () => {
    if (selectedTicketDetail) {
      const res = await api.getTicketDetail(selectedTicketDetail.ticket.id);
      setSelectedTicketDetail(res);
    }
    onRefresh();
  };

  const handleAnalyzeAll = async () => {
    setLoadingAnalyze(true);
    try {
      const res = await api.analyzeAllTickets();
      alert(res.message || 'Tüm bekleyen biletler yapay zeka ile analiz edildi.');
      onRefresh();
    } catch {
      alert('Toplu analiz sırasında bir hata oluştu.');
    } finally {
      setLoadingAnalyze(false);
    }
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setRefreshing(false), 350);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Sticky Ultra-Compact Header & Control Cluster */}
      <div style={{
        position: 'sticky',
        top: '40px',
        zIndex: 20,
        background: 'var(--bg-main)',
        backdropFilter: 'blur(16px)',
        padding: '1px 0 6px 0',
        marginBottom: '8px',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Row 1: Title + Counter + Category Dropdown (Left) & Actions (Right) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1px 2px',
          marginBottom: '4px',
          flexWrap: 'wrap',
          gap: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {t('common.tickets')}
            </h1>
            <span style={{
              fontSize: '0.72rem',
              color: 'var(--accent-cyan)',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              padding: '1px 6px',
              borderRadius: '10px',
              fontWeight: 700
            }}>
              {filteredTickets.length} talep
            </span>

            {/* Durum Açılır Listesi (Destek & Talepler Başlığının Hizası) */}
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: 'auto',
                maxWidth: '210px',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '8px',
                paddingRight: '22px',
                fontSize: '0.78rem',
                height: '26px',
                marginLeft: '4px'
              }}
              title="İşlem Durumuna Göre Filtrele"
            >
              <option value="all">📋 Tüm Talepler ({tickets.length})</option>
              <option value="new">🆕 Yeni ({tickets.filter((t) => t.status === 'new' || t.status === 'open').length})</option>
              <option value="in_progress">⏳ İşlemde ({tickets.filter((t) => t.status === 'in_progress').length})</option>
              <option value="resolved">✅ Çözüldü / Yanıtlandı ({tickets.filter((t) => t.status === 'resolved').length})</option>
              <option value="rejected">❌ Kapatıldı / Reddedildi ({tickets.filter((t) => t.status === 'rejected').length})</option>
            </select>

            {/* Kategori Açılır Listesi (Destek & Talepler Başlığı Hizasında) */}
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{
                width: 'auto',
                maxWidth: '170px',
                paddingTop: '2px',
                paddingBottom: '2px',
                paddingLeft: '8px',
                paddingRight: '22px',
                fontSize: '0.78rem',
                height: '26px',
                marginLeft: '2px'
              }}
              title="Talep Konusuna Göre Filtrele"
            >
              <option value="all">📁 Tüm Konular ({tickets.length})</option>
              <option value="hata">🐛 Hata ({tickets.filter((t) => normalizeCategory(t.category) === 'hata').length})</option>
              <option value="istek">✨ İstek ({tickets.filter((t) => normalizeCategory(t.category) === 'istek').length})</option>
              <option value="tesekkur">❤️ Teşekkür ({tickets.filter((t) => normalizeCategory(t.category) === 'tesekkur').length})</option>
              <option value="fikir">💡 Fikir ({tickets.filter((t) => normalizeCategory(t.category) === 'fikir').length})</option>
              <option value="email">✉️ E-Posta ({tickets.filter((t) => normalizeCategory(t.category) === 'email').length})</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              style={{
                padding: '3px 9px',
                fontSize: '0.74rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                borderRadius: '6px',
                fontWeight: 600,
                color: 'var(--text-secondary)'
              }}
              onClick={handleManualRefresh}
              disabled={refreshing}
              title="Mesajları Yenile (Yalnızca Listeyi Günceller)"
            >
              <RotateCw size={12} className={refreshing ? 'spin' : ''} />
              {refreshing ? 'Yenileniyor...' : 'Yenile'}
            </button>

            <button
              type="button"
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #A78BFA, #38BDF8)',
                color: '#000000',
                fontWeight: 700,
                border: 'none',
                boxShadow: '0 2px 8px rgba(56, 189, 248, 0.35)',
                padding: '3px 10px',
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '6px'
              }}
              onClick={handleAnalyzeAll}
              disabled={loadingAnalyze}
            >
              <Sparkles size={13} color="#000000" />
              <span>{loadingAnalyze ? 'Analiz...' : '🤖 AI Analiz'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Search Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          padding: '1px 0'
        }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={14} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Taleplerde hızlı ara (konu, mesaj, gönderen)..."
              style={{
                paddingLeft: '28px',
                paddingTop: '3px',
                paddingBottom: '3px',
                fontSize: '0.78rem',
                height: '28px',
                width: '100%'
              }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tickets Table / Cards */}
      {filteredTickets.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' ? 'Arama Kriterine Uygun Destek Talebi Bulunamadı' : 'Henüz Kayıtlı Destek Talebi Bulunmuyor'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto', lineHeight: 1.5 }}>
            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
              ? 'Arama kelimesini, konu grubunu veya durum filtresini temizleyerek tüm talepleri tekrar listeleyebilirsiniz.'
              : 'Web sitemizin Destek & Talep Formu üzerinden veya kurumsal e-postadan gelen tüm talepler anlık olarak burada listelenecektir.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="glass-card glass-card-hover"
              onDoubleClick={() => handleOpenDetail(ticket.id)}
              style={{
                padding: '4px 14px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              title="Çift tıklayarak mesaj detayını okuyabilirsiniz"
            >
              {/* Kart Üst Satırı: Bilet No + Rozetler (Sol) & Tarih (Sağ) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', minWidth: 0 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'ui-monospace, monospace', letterSpacing: '-0.02em', minWidth: '76px', flexShrink: 0 }}>
                    {ticket.id}
                  </span>
                  {(() => {
                    const sBadge = getUnifiedStatusBadge(ticket);
                    const cBadge = getCategoryBadge(ticket.category);
                    return (
                      <>
                        <span className="ticket-badge" style={{ fontSize: '0.68rem', background: sBadge.bg, border: `1px solid ${sBadge.border}`, padding: '1px 6px', borderRadius: '4px', fontWeight: 700, minWidth: '60px', textAlign: 'center', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                          {sBadge.label}
                        </span>
                        <span className="ticket-badge" style={{ fontSize: '0.68rem', background: cBadge.bg, border: `1px solid ${cBadge.border}`, padding: '1px 6px', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                          {cBadge.label}
                        </span>
                      </>
                    );
                  })()}
                </div>

                {/* Sağ: Tarih (Üst satırın sağ tarafına kilitli) */}
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginLeft: 'auto', flexShrink: 0, whiteSpace: 'nowrap' }}>
                  <Clock size={11} /> {new Date(ticket.created_at).toLocaleDateString(locale)}
                </span>
              </div>

              {/* Kart Alt Satırı: Konu & Gönderen (Sol) + Mesaj Önizleme (Desktop) + İncele Butonu (Sağ) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="ticket-subject-col" style={{ minWidth: 0 }}>
                  <h3 style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: '1px',
                    lineHeight: 1.25,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    wordBreak: 'break-word'
                  }}>
                    {ticket.subject}
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <strong>{ticket.sender_name}</strong> • {ticket.sender_email}
                  </div>
                </div>

                <div className="hidden-mobile" style={{ flex: 1, minWidth: 0 }}>
                  <div className="ticket-message-preview">
                    <span style={{ color: 'var(--text-muted)', marginRight: '4px' }}>💬</span>
                    {ticket.message_content || (ticket as any).content || '(İçerik belirtilmemiş)'}
                  </div>
                </div>

                {/* Sağ: İncele Butonu (Başlık ile aynı hizada kilitli) */}
                <button
                  className="btn btn-primary btn-sm"
                  style={{ padding: '3px 10px', fontSize: '0.74rem', borderRadius: '5px', marginLeft: 'auto', flexShrink: 0, whiteSpace: 'nowrap' }}
                  onClick={() => handleOpenDetail(ticket.id)}
                  disabled={loadingDetail}
                >
                  <Eye size={12} /> {t('common.view')}
                </button>
              </div>

              {/* Mobilde Kart Altına Tam Genişlikte 2 Satırlık Mesaj Önizlemesi */}
              <div className="visible-mobile ticket-message-preview" style={{
                marginTop: '6px',
                width: '100%',
                maxHeight: '2.8em',
                lineHeight: 1.35,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                display: '-webkit-box'
              }}>
                <span style={{ color: 'var(--text-muted)', marginRight: '4px' }}>💬</span>
                {ticket.message_content || (ticket as any).content || '(İçerik belirtilmemiş)'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicketDetail && (
        <TicketDetailModal
          ticketDetail={selectedTicketDetail}
          onClose={() => setSelectedTicketDetail(null)}
          onRefresh={handleRefreshDetail}
        />
      )}
    </div>
  );
};
