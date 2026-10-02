import React, { useState } from 'react';
import type { Ticket, TicketDetailResponse } from '../types';
import { Search, Filter, Sparkles, Eye, Clock } from 'lucide-react';
import { api } from '../services/api';
import { TicketDetailModal } from '../components/TicketDetailModal';

interface TicketsViewProps {
  tickets: Ticket[];
  onRefresh: () => void;
  onOpenCoupon: (ticketNo: string, email: string, name: string) => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets,
  onRefresh,
  onOpenCoupon,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTicketDetail, setSelectedTicketDetail] = useState<TicketDetailResponse | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sender_email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenDetail = async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await api.getTicketDetail(id);
      setSelectedTicketDetail(res);
    } catch (err) {
      alert('Bilet detayı yüklenemedi.');
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

  return (
    <div className="animate-fade-in">
      <div>
        <h1 className="page-title">Destek & Talep Yönetimi</h1>
        <p className="page-subtitle">Kullanıcılardan gelen destek taleplerini inceleyin, AI taslaklarıyla yanıtlayın.</p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Bilet no, konu, kişi veya e-posta ile ara..."
            style={{ paddingLeft: '38px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} color="var(--text-muted)" />
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="new">Yeni (New)</option>
            <option value="in_progress">İşlemde (In Progress)</option>
            <option value="resolved">Çözüldü (Resolved)</option>
            <option value="rejected">Reddedildi (Rejected)</option>
            <option value="closed">Kapatıldı (Closed)</option>
          </select>
        </div>
      </div>

      {/* Tickets Table / Cards */}
      {filteredTickets.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Filtrelere uygun destek bilet kaydı bulunamadı.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="glass-card glass-card-hover"
              style={{ padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{ticket.id}</span>
                  <span className={`badge badge-${ticket.status}`}>{ticket.status}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                    {ticket.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '4px' }}>{ticket.subject}</h3>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <strong>{ticket.sender_name}</strong> • {ticket.sender_email}
                </div>
              </div>

              {ticket.ai_summary && (
                <div style={{
                  flex: 1,
                  minWidth: '240px',
                  background: 'rgba(99, 102, 241, 0.08)',
                  borderLeft: '3px solid var(--accent-primary)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  color: '#D1D5DB'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.75rem', marginBottom: '2px' }}>
                    <Sparkles size={12} /> AI Özeti
                  </div>
                  {ticket.ai_summary}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {new Date(ticket.created_at).toLocaleDateString('tr-TR')}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleOpenDetail(ticket.id)}
                  disabled={loadingDetail}
                >
                  <Eye size={14} /> İncele & Yanıtla
                </button>
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
          onOpenCoupon={onOpenCoupon}
        />
      )}
    </div>
  );
};
