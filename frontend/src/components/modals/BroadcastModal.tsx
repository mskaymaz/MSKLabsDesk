import React, { useState } from 'react';
import { X, Send, Mail, Users, CheckCircle2, AlertCircle, Loader2, Eye, Sparkles } from 'lucide-react';
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
<p style="margin: 20px 0;"><a href="https://msklabs.org/blog" style="background:#0284c7;color:#fff;padding:10px 22px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:700;">Yazıyı Oku</a></p>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
<p style="font-size:0.75rem;color:#94a3b8;">Bu e-posta, bülten aboneliğiniz kapsamında gönderilmiştir. Ayrılmak için <a href="https://msklabs.org/bulten-ayril" style="color:#0284c7;">buraya tıklayın</a>.</p>`);
    } else if (type === 'weekly') {
      setSubject('[MSK Labs] Haftalık Teknoloji ve Fikir Özeti');
      setContentHtml(`<h2>Haftalık MSK Labs Özeti</h2>
<p>Bu hafta ekosistemimizde öne çıkan gelişmeler, yeni özellikler ve paylaşımlar:</p>
<ul>
  <li><strong>1. Gelişme:</strong> Detaylı açıklama...</li>
  <li><strong>2. Gelişme:</strong> Detaylı açıklama...</li>
</ul>
<p>Tüm içeriklere web sitemizden ulaşabilirsiniz.</p>
<p style="margin-top:20px;"><a href="https://msklabs.org" style="background:#0284c7;color:#fff;padding:8px 18px;text-decoration:none;border-radius:6px;font-weight:700;">Siteyi Ziyaret Et</a></p>`);
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
        background: 'rgba(0, 0, 0, 0.80)',
        backdropFilter: 'blur(5px)',
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
          maxWidth: '740px',
          maxHeight: '90vh',
          background: 'var(--bg-card, #1e293b)',
          color: 'var(--text-primary, #f8fafc)',
          borderRadius: '12px',
          border: '1px solid var(--border-card, #334155)',
          boxShadow: '0 25px 35px -5px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Üst Başlık Çubuğu */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: '1px solid var(--border-subtle, #334155)', background: 'rgba(0,0,0,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={18} color="#0284c7" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Toplu E-Bülten Gönderimi (Broadcast)</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* 2. Kaydırılabilir İçerik Alanı */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {errorMsg && (
              <div style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px 14px', borderRadius: '6px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={15} /> {errorMsg}
              </div>
            )}
            {successMsg && (
              <div style={{ background: 'rgba(22, 163, 74, 0.15)', border: '1px solid #22c55e', color: '#86efac', padding: '10px 14px', borderRadius: '6px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={15} /> {successMsg}
              </div>
            )}

            {/* Üst Ayarlar: Hedef Segment & Hızlı Şablonlar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ flex: '1 1 240px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>Hedef Segment:</label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', height: '34px', fontSize: '0.82rem' }}
                >
                  <option value="all">Tüm Aktif Aboneler (~{activeSubscriberCount} Alıcı)</option>
                  <option value="weekly">Haftalık Bülten Tercihi</option>
                  <option value="tech">Yazılım & Teknoloji</option>
                  <option value="announcements">Genel Duyurular</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.76rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}><Sparkles size={12} /> Şablonlar:</span>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('article')}
                  style={{ background: 'rgba(2, 132, 199, 0.15)', border: '1px solid rgba(2, 132, 199, 0.35)', color: '#38bdf8', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Yeni Makale
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('weekly')}
                  style={{ background: 'rgba(2, 132, 199, 0.15)', border: '1px solid rgba(2, 132, 199, 0.35)', color: '#38bdf8', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Haftalık Özet
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('announcement')}
                  style={{ background: 'rgba(2, 132, 199, 0.15)', border: '1px solid rgba(2, 132, 199, 0.35)', color: '#38bdf8', padding: '4px 10px', borderRadius: '4px', fontSize: '0.74rem', cursor: 'pointer', fontWeight: 600 }}
                >
                  Sistem Duyurusu
                </button>
              </div>
            </div>

            {/* 1. KADEME: E-Posta Konusu (Subject) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                E-Posta Konusu (Subject):
              </label>
              <input
                type="text"
                className="form-input"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Örn: [MSK Labs] Yeni Özellikler ve Güncelleme Bildirimi"
                style={{ width: '100%', height: '36px', fontSize: '0.88rem', fontWeight: 600 }}
                required
              />
            </div>

            {/* 2. KADEME: Bülten Gövde Metni (HTML / İçerik Girişi) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '4px', fontWeight: 600 }}>
                Bülten HTML / Metin Gövdesi:
              </label>
              <textarea
                className="form-input"
                rows={6}
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                placeholder="<p>Bülten içeriğini HTML formatında buraya yazınız veya yukarıdan hazır bir şablon seçiniz...</p>"
                style={{ width: '100%', fontSize: '0.82rem', fontFamily: 'monospace', resize: 'vertical' }}
                required
              />
            </div>

            {/* 3. KADEME: ALT ALTA CANLI E-POSTA ÖNİZLEME VİTRİNİ */}
            <div style={{ marginTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Eye size={15} color="#0284c7" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Canlı E-Posta Önizlemesi (Gelen Kutusu Görünümü)
                </span>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  color: '#0f172a',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                {/* E-Posta Başlık Şeridi */}
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <strong style={{ color: '#64748b', minWidth: '55px' }}>Kimden:</strong>
                    <span style={{ color: '#0284c7', fontWeight: 600 }}>MSK Labs Bildirim &lt;bildirim@msklabs.org&gt;</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <strong style={{ color: '#64748b', minWidth: '55px' }}>Konu:</strong>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>
                      {subject.trim() || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>[Konu henüz yazılmadı]</span>}
                    </span>
                  </div>
                </div>

                {/* E-Posta Gövde Önizlemesi */}
                <div
                  style={{
                    padding: '20px 24px',
                    fontSize: '0.90rem',
                    lineHeight: '1.6',
                    minHeight: '120px',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    background: '#ffffff',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: contentHtml.trim() || '<p style="color:#94a3b8;font-style:italic;margin:0;">Bülten gövdesi buraya canlı olarak yansıyacaktır...</p>',
                  }}
                />
              </div>
            </div>

            {/* 4. Alt İşlem Çubuğu */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle, #334155)' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Users size={13} /> Gönderim kuyruğu Cloudflare Workers & D1 ile asenkron iletilir.
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
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
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700, padding: '8px 18px' }}
                >
                  {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  Kuyruğa Al ve Gönder
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
