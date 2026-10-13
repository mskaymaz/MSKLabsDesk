import React, { useState } from 'react';
import type { TicketDetailResponse } from '../types';
import { Sparkles, Send, Gift, X, User, Clock, CheckCircle, Ban, Eye, Languages, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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
  const [loadingAi, setLoadingAi] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedData, setTranslatedData] = useState<{ subject: string; content: string; lang: string } | null>(null);
  const [loadingTranslate, setLoadingTranslate] = useState(false);
  const [messageFontSize, setMessageFontSize] = useState<number>(0.9);

  if (!ticketDetail) return null;
  const { ticket, replies } = ticketDetail;

  const handleTriggerAi = async () => {
    setLoadingAi(true);
    try {
      await api.analyzeTicket(ticket.id);
      onRefresh();
    } catch {
      alert('Yapay zeka analizi çalıştırılamadı.');
    } finally {
      setLoadingAi(false);
    }
  };

  const getStatusBadgeLabel = (s: string) =>
    s === 'new' || s === 'open' ? 'Yeni' : s === 'in_progress' ? 'İşlemde' : s === 'resolved' ? 'Çözüldü' : s === 'rejected' || s === 'closed' ? 'Reddedildi' : s;

  const btnStyle = (bg: string, shadow: string): React.CSSProperties => ({
    background: bg, color: '#000000', fontWeight: 700, border: 'none', boxShadow: `0 2px 8px ${shadow}`
  });

  const handleUseAiDraft = () => {
    const draft = ticket.ai_suggested_reply || (ticket as any).ai_draft;
    if (draft) {
      setReplyMessage(draft);
    }
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;
    setLoadingReply(true);
    try {
      await api.replyTicket(ticket.id, replyMessage);
      setReplyMessage('');
      setShowReplyBox(false);
      onRefresh();
    } catch (err) {
      alert('Cevap gönderilemedi.');
    } finally {
      setLoadingReply(false);
    }
  };

  const handleToggleTranslate = async () => {
    if (isTranslated) {
      setIsTranslated(false);
      return;
    }
    if (translatedData) {
      setIsTranslated(true);
      return;
    }
    setLoadingTranslate(true);
    try {
      const res = await api.translateTicket(ticket.id);
      if (res.success) {
        setTranslatedData({
          subject: res.translated_subject,
          content: res.translated_content,
          lang: res.detected_language,
        });
        setIsTranslated(true);
      }
    } catch {
      alert('Çeviri yapılamadı.');
    } finally {
      setLoadingTranslate(false);
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
              <span className={`badge badge-${ticket.status}`}>{getStatusBadgeLabel(ticket.status)}</span>
              {ticket.category === 'email' ? (
                <span className="ticket-badge" style={{ fontSize: '0.78rem', background: 'rgba(56, 189, 248, 0.25)', border: '1px solid rgba(56, 189, 248, 0.45)', padding: '2px 8px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                  ✉️ E-Posta
                </span>
              ) : (
                <span className="ticket-badge" style={{ fontSize: '0.78rem', background: 'rgba(156, 163, 175, 0.25)', border: '1px solid rgba(156, 163, 175, 0.45)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>{ticket.category}</span>
              )}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isTranslated && translatedData ? translatedData.subject : ticket.subject}
            </h2>
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
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          marginBottom: '20px',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={16} color="var(--accent-primary)" />
            <strong style={{ color: 'var(--text-primary)' }}>{ticket.sender_name}</strong> ({ticket.sender_email})
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <Clock size={14} />
            {new Date(ticket.created_at).toLocaleString('tr-TR')}
          </div>
        </div>

        {/* AI Summary Banner or Trigger Button */}
        {ticket.ai_summary ? (
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
            <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{ticket.ai_summary}</p>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px dashed rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 16px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              🤖 Bu talep için henüz yapay zeka analizi yapılmadı.
            </span>
            <button
              type="button"
              className="btn btn-sm"
              style={{
                background: 'linear-gradient(135deg, #A78BFA, #38BDF8)',
                color: '#000000',
                fontWeight: 700,
                border: 'none',
                padding: '4px 12px',
                fontSize: '0.78rem'
              }}
              disabled={loadingAi}
              onClick={handleTriggerAi}
            >
              <Sparkles size={13} color="#000000" /> {loadingAi ? 'Analiz Ediliyor...' : 'Yapay Zeka Analizi Çalıştır'}
            </button>
          </div>
        )}

        {/* Message Body */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>Gelen Mesaj</h4>

              {/* Yazı Boyutu Kontrol Butonları (30px mesafede, ikonlu) */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', marginLeft: '30px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1px 3px' }}>
                <button
                  type="button"
                  onClick={() => setMessageFontSize((p) => Math.max(0.75, Number((p - 0.1).toFixed(2))))}
                  disabled={messageFontSize <= 0.75}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: messageFontSize <= 0.75 ? 'not-allowed' : 'pointer', padding: '3px 5px', display: 'flex', alignItems: 'center', borderRadius: '4px', opacity: messageFontSize <= 0.75 ? 0.35 : 1 }}
                  title="Yazı Boyutunu Küçült"
                >
                  <ZoomOut size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setMessageFontSize(0.9)}
                  disabled={messageFontSize === 0.9}
                  style={{ background: 'transparent', border: 'none', color: messageFontSize === 0.9 ? 'var(--text-muted)' : 'var(--accent-primary)', cursor: messageFontSize === 0.9 ? 'default' : 'pointer', padding: '3px 5px', display: 'flex', alignItems: 'center', borderRadius: '4px', opacity: messageFontSize === 0.9 ? 0.5 : 1 }}
                  title="Standart Boyut"
                >
                  <RotateCcw size={12} />
                </button>
                <button
                  type="button"
                  onClick={() => setMessageFontSize((p) => Math.min(1.4, Number((p + 0.1).toFixed(2))))}
                  disabled={messageFontSize >= 1.4}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: messageFontSize >= 1.4 ? 'not-allowed' : 'pointer', padding: '3px 5px', display: 'flex', alignItems: 'center', borderRadius: '4px', opacity: messageFontSize >= 1.4 ? 0.35 : 1 }}
                  title="Yazı Boyutunu Büyüt"
                >
                  <ZoomIn size={13} />
                </button>
              </div>

              {isTranslated && (
                <span style={{
                  fontSize: '0.72rem',
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontWeight: 700
                }}>
                  🌐 Türkçe Çeviri ({translatedData?.lang.toUpperCase() || 'TR'})
                </span>
              )}
            </div>
            <button
              type="button"
              className="btn btn-sm"
              onClick={handleToggleTranslate}
              disabled={loadingTranslate}
              style={{
                fontSize: '0.78rem',
                padding: '4px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: isTranslated ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: isTranslated ? '#10B981' : 'var(--text-secondary)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                cursor: 'pointer',
                borderRadius: '6px',
                fontWeight: 600
              }}
            >
              <Languages size={13} />
              {loadingTranslate ? 'Çevriliyor...' : isTranslated ? '↩️ Orijinal Metin' : '🌐 Türkçe\'ye Çevir'}
            </button>
          </div>
          <div
            className={`ticket-message-content ${isTranslated ? 'is-translated' : ''}`}
            style={{ fontSize: `${messageFontSize}rem` }}
          >
            {isTranslated && translatedData
              ? translatedData.content
              : (ticket.message_content || (ticket as any).content || '(İçerik bulunamadı)')}
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
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderLeft: '3px solid var(--accent-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px', color: 'var(--text-secondary)' }}>
                    <strong>{reply.admin_name}</strong>
                    <span>{new Date(reply.sent_at).toLocaleString('tr-TR')}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{reply.reply_content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Post-Reply Confirmation Banner & Follow-Up Toggle */}
        {replies && replies.length > 0 && !showReplyBox && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontWeight: 600, fontSize: '0.85rem' }}>
              <CheckCircle size={16} /> Bu talebe yanıt başarıyla iletildi.
            </div>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              style={{ fontSize: '0.78rem', padding: '5px 12px', fontWeight: 600 }}
              onClick={() => setShowReplyBox(true)}
            >
              ✉️ Ek Yanıt / Takip Mesajı Yaz
            </button>
          </div>
        )}

        {/* Reply Box (Shown when fresh ticket or explicitly opened) */}
        {((!replies || replies.length === 0) || showReplyBox) && (
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', margin: 0 }}>
                  {replies && replies.length > 0 ? 'Ek Yanıt / Takip Mesajı' : 'Yanıt Yaz'}
                </h4>
                {replies && replies.length > 0 && (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                    onClick={() => setShowReplyBox(false)}
                  >
                    (Gizle)
                  </button>
                )}
              </div>
              {ticket.ai_suggested_reply && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={handleUseAiDraft}
                  style={{
                    background: '#67E8F9',
                    color: '#000000',
                    fontWeight: 700,
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(103, 232, 249, 0.3)',
                    padding: '3px 10px',
                    fontSize: '0.78rem'
                  }}
                >
                  <Sparkles size={13} color="#000000" /> AI Cevap Taslağını Aktar
                </button>
              )}
            </div>

            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Kullanıcıya iletilecek yanıt mesajı..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              style={{ marginBottom: '10px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-sm"
                style={{
                  background: 'linear-gradient(135deg, #A78BFA, #38BDF8)',
                  color: '#000000',
                  fontWeight: 700,
                  border: 'none',
                  boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
                  padding: '6px 16px'
                }}
                disabled={loadingReply || !replyMessage.trim()}
                onClick={handleSendReply}
              >
                <Send size={15} color="#000000" /> {loadingReply ? 'Gönderiliyor...' : 'Yanıtı Gönder'}
              </button>
            </div>
          </div>
        )}

        {/* Status Action Buttons Toolbar */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-sm" style={btnStyle('#38BDF8', 'rgba(56, 189, 248, 0.4)')} disabled={loadingStatus} onClick={() => handleStatusChange('in_progress')}>
            <Eye size={14} color="#000000" /> Okundu İşaretle
          </button>
          <button type="button" className="btn btn-sm" style={btnStyle('#10B981', 'rgba(16, 185, 129, 0.4)')} disabled={loadingStatus} onClick={() => handleStatusChange('resolved')}>
            <CheckCircle size={14} color="#000000" /> Çözüldü İşaretle
          </button>
          <button type="button" className="btn btn-sm" style={btnStyle('#EF4444', 'rgba(239, 68, 68, 0.4)')} disabled={loadingStatus} onClick={() => handleStatusChange('rejected')}>
            <Ban size={14} color="#000000" /> Reddet
          </button>
          <button type="button" className="btn btn-sm" style={btnStyle('#F59E0B', 'rgba(245, 158, 11, 0.4)')} onClick={() => onOpenCoupon(ticket.id, ticket.sender_email, ticket.sender_name)}>
            <Gift size={14} color="#000000" /> Kupon Tanımla
          </button>
        </div>
      </div>
    </div>
  );
};
