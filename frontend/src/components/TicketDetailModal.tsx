import React, { useState } from 'react';
import type { TicketDetailResponse } from '../types';
import { Sparkles, Send, Gift, X, User, Clock, CheckCircle, Ban } from 'lucide-react';
import { api } from '../services/api';

interface TicketDetailModalProps {
  ticketDetail: TicketDetailResponse | null;
  onClose: () => void;
  onRefresh: () => void;
  onOpenCoupon: (ticketNo: string, email: string, name: string) => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticketDetail,
  onClose,
  onRefresh,
  onOpenCoupon,
}) => {
  const [replyMessage, setReplyMessage] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  if (!ticketDetail) return null;
  const { ticket, replies } = ticketDetail;

  const handleUseAiDraft = () => {
    if (ticket.ai_suggested_reply) {
      setReplyMessage(ticket.ai_suggested_reply);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    setLoadingReply(true);
    try {
      await api.replyTicket(ticket.id, replyMessage);
      setReplyMessage('');
      onRefresh();
    } catch (err) {
      alert('Cevap gönderilemedi.');
    } finally {
      setLoadingReply(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoadingStatus(true);
    try {
      await api.updateTicketStatus(ticket.id, newStatus);
      onRefresh();
    } catch (err) {
      alert('Durum güncellenemedi.');
    } finally {
      setLoadingStatus(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{ticket.id}</span>
              <span className={`badge badge-${ticket.status}`}>{ticket.status}</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{ticket.category}</span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFF' }}>{ticket.subject}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Sender Info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} color="var(--accent-primary)" />
            <strong style={{ color: '#FFF' }}>{ticket.sender_name}</strong> ({ticket.sender_email})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Clock size={14} />
            {new Date(ticket.created_at).toLocaleString('tr-TR')}
          </div>
        </div>

        {/* AI Summary Banner */}
        {ticket.ai_summary && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.85rem' }}>
              <Sparkles size={16} /> Yapay Zeka Özeti
            </div>
            <p style={{ fontSize: '0.85rem', color: '#E5E7EB' }}>{ticket.ai_summary}</p>
          </div>
        )}

        {/* Message Body */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>Gelen Mesaj</h4>
          <div style={{
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            color: '#F3F4F6',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5
          }}>
            {ticket.message_content}
          </div>
        </div>

        {/* Previous Replies */}
        {replies && replies.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '10px' }}>Yanıt Geçmişi</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {replies.map((reply) => (
                <div key={reply.id} style={{
                  padding: '12px 14px',
                  background: 'rgba(139, 92, 246, 0.08)',
                  borderLeft: '3px solid var(--accent-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <strong>{reply.admin_name}</strong>
                    <span>{new Date(reply.sent_at).toLocaleString('tr-TR')}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#FFF' }}>{reply.reply_content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls & Reply Box */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Yanıt Yaz</h4>
            {ticket.ai_suggested_reply && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleUseAiDraft}
                style={{ color: 'var(--accent-cyan)', borderColor: 'rgba(6, 182, 212, 0.3)' }}
              >
                <Sparkles size={14} /> AI Cevap Taslağını Aktar
              </button>
            )}
          </div>

          <textarea
            className="form-textarea"
            rows={4}
            placeholder="Kullanıcıya iletilecek yanıt mesajı..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            style={{ marginBottom: '12px' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-success btn-sm"
                disabled={loadingStatus}
                onClick={() => handleStatusChange('resolved')}
              >
                <CheckCircle size={14} /> Çözüldü İşaretle
              </button>
              <button
                className="btn btn-danger btn-sm"
                disabled={loadingStatus}
                onClick={() => handleStatusChange('rejected')}
              >
                <Ban size={14} /> Reddet
              </button>
              <button
                className="btn btn-secondary btn-sm"
                style={{ color: 'var(--accent-amber)' }}
                onClick={() => onOpenCoupon(ticket.id, ticket.sender_email, ticket.sender_name)}
              >
                <Gift size={14} /> Kupon Tanımla
              </button>
            </div>

            <button
              className="btn btn-primary"
              disabled={loadingReply || !replyMessage.trim()}
              onClick={handleSendReply}
            >
              <Send size={16} /> Yanıtı Gönder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
