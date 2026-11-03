import React, { useState } from 'react';
import { X, Send, Mail, Users, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSubscriberCount: number;
  onBroadcastSuccess?: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  activeSubscriberCount,
  onBroadcastSuccess,
}) => {
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('all');
  const [contentHtml, setContentHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApplyTemplate = (type: 'article' | 'weekly' | 'announcement') => {
    if (type === 'article') {
      setSubject('[MSK Labs] Yeni Makale: ');
      setContentHtml(`<h2>Yeni Makalemiz Yayında!</h2>
<p>Merhaba değerli okurumuz,</p>
<p>MSK Labs blogunda yeni bir makale yayınladık. İncelemek ve okumak için aşağıdaki bağlantıya tıklayabilirsiniz:</p>
<p><a href="https://msklabs.org/blog" style="background:#0284c7;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:700;">Yazıyı Oku</a></p>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
<p style="font-size:0.75rem;color:#94a3b8;">Bu e-posta, bülten aboneliğiniz kapsamında gönderilmiştir. Ayrılmak için <a href="https://msklabs.org/bulten-ayril">buraya tıklayın</a>.</p>`);
    } else if (type === 'weekly') {
      setSubject('[MSK Labs] Haftalık Teknoloji ve Fikir Özeti');
      setContentHtml(`<h2>Haftalık MSK Labs Özeti</h2>
<p>Bu hafta ekosistemimizde öne çıkan gelişmeler, yeni özellikler ve paylaşımlar:</p>
<ul>
  <li><strong>1. Gelişme:</strong> Detaylı açıklama...</li>
  <li><strong>2. Gelişme:</strong> Detaylı açıklama...</li>
</ul>
<p>Tüm içeriklere web sitemizden ulaşabilirsiniz.</p>`);
    } else if (type === 'announcement') {
      setSubject('[Önemli Duyuru] MSK Labs Sistem Güncellemesi');
      setContentHtml(`<h2>Önemli Sistem Bilgilendirmesi</h2>
<p>Sayın kullanıcımız,</p>
<p>Altyapımızda gerçekleştirilen son optimizasyonlar ve yenilikler hakkında sizi bilgilendirmek isteriz.</p>
<p>Saygılarımızla,<br/><strong>MSK Labs Ekibi</strong></p>`);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !contentHtml.trim()) {
      setErrorMsg('Lütfen konu ve içerik alanlarını eksiksiz doldurun.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.broadcastNewsletter({
        subject: subject.trim(),
        content_html: contentHtml.trim(),
        category,
      });

      if (res.success) {
        setSuccessMsg(res.message || 'Bülten başarıyla gönderim kuyruğuna alındı.');
        onBroadcastSuccess?.();
        setTimeout(() => {
          onClose();
          setSubject('');
          setContentHtml('');
          setSuccessMsg(null);
        }, 1800);
      } else {
        setErrorMsg(res.error || 'Bülten gönderilemedi.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gönderim sırasında bağlantı hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'var(--bg-card, #1e293b)',
          color: 'var(--text-primary, #f8fafc)',
          borderRadius: '12px',
          border: '1px solid var(--border-card, #334155)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst Başlık */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border-subtle, #334155)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} color="#0284c7" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Toplu E-Bülten Gönderimi (Broadcast)</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Form Alanı */}
        <form onSubmit={handleSend} style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {errorMsg && (
            <div style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} /> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div style={{ background: 'rgba(22, 163, 74, 0.15)', border: '1px solid #22c55e', color: '#86efac', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> {successMsg}
            </div>
          )}

          {/* Hızlı Şablonlar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Hazır Şablonlar:</span>
            <button
              type="button"
              onClick={() => handleApplyTemplate('article')}
              style={{ background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(2, 132, 199, 0.3)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer' }}
            >
              Yeni Makale
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate('weekly')}
              style={{ background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(2, 132, 199, 0.3)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer' }}
            >
              Haftalık Özet
            </button>
            <button
              type="button"
              onClick={() => handleApplyTemplate('announcement')}
              style={{ background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(2, 132, 199, 0.3)', color: '#38bdf8', padding: '3px 8px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer' }}
            >
              Sistem Duyurusu
            </button>
          </div>

          {/* Hedef Kitle & Kategori */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Hedef Segment:</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', height: '32px', fontSize: '0.82rem' }}
              >
                <option value="all">Tüm Aktif Aboneler (~{activeSubscriberCount} Alıcı)</option>
                <option value="weekly">Haftalık Bülten Tercihi</option>
                <option value="tech">Yazılım & Teknoloji</option>
                <option value="announcements">Genel Duyurular</option>
              </select>
            </div>
          </div>

          {/* Konu */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>E-Posta Konusu (Subject):</label>
            <input
              type="text"
              className="form-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Örn: [MSK Labs] Yeni Özellikler Yayında"
              style={{ width: '100%', height: '32px', fontSize: '0.85rem' }}
              required
            />
          </div>

          {/* İçerik */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px' }}>Bülten HTML / Metin Gövdesi:</label>
            <textarea
              className="form-input"
              rows={7}
              value={contentHtml}
              onChange={(e) => setContentHtml(e.target.value)}
              placeholder="<p>Bülten içeriğini HTML veya düz metin olarak buraya yazınız...</p>"
              style={{ width: '100%', fontSize: '0.82rem', fontFamily: 'monospace', resize: 'vertical' }}
              required
            />
          </div>

          {/* Alt Butonlar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Users size={12} /> Toplu gönderim kuyruğu Cloudflare D1 + Worker üzerinden işlenir.
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={onClose}
                className="admin-btn admin-btn-secondary admin-btn-sm"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="admin-btn admin-btn-primary admin-btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                Kuyruğa Al ve Gönder
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
