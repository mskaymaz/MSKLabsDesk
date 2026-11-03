import React, { useState } from 'react';
import { api } from '../services/api';
import { Send, CheckCircle2, Eye, Sparkles, Mail, Users, Loader2 } from 'lucide-react';
import { ConfirmationDialog } from '../components/ui/Modal';
import { useTranslation } from '../context/I18nContext';
import { RichTextEditor } from '../components/ui/RichTextEditor';

export const BroadcastView: React.FC = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [targetPreference, setTargetPreference] = useState('ALL');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Hızlı Hazır E-Posta Şablonları
  const applyTemplate = (type: 'article' | 'weekly' | 'announcement') => {
    if (type === 'article') {
      setTitle('[MSK Labs] Yeni Makalemiz Yayında: Teknoloji ve Gelecek');
      setContentHtml(`<h2>Yeni Makalemiz Yayında!</h2>
<p>Merhaba değerli okurumuz,</p>
<p>MSK Labs blogunda yeni bir makale yayınladık. İncelemek ve okumak için aşağıdaki bağlantıya tıklayabilirsiniz:</p>
<p style="margin: 20px 0;"><a href="https://msklabs.org/blog" style="background:#0284c7;color:#fff;padding:10px 22px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:700;">Yazıyı Oku</a></p>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
<p style="font-size:0.75rem;color:#94a3b8;">Bu e-posta, bülten aboneliğiniz kapsamında gönderilmiştir. Ayrılmak için <a href="https://msklabs.org/bulten-ayril" style="color:#0284c7;">buraya tıklayın</a>.</p>`);
    } else if (type === 'weekly') {
      setTitle('[MSK Labs] Haftalık Teknoloji ve Fikir Özeti');
      setContentHtml(`<h2>Haftalık MSK Labs Özeti</h2>
<p>Bu hafta laboratuvarımızda ve açık kaynak dünyasında öne çıkan gelişmeler:</p>
<ul>
  <li><strong>1. Gelişme:</strong> Detaylı açıklama ve teknik notlar...</li>
  <li><strong>2. Gelişme:</strong> Yeni mimari incelemesi...</li>
</ul>
<p>Tüm içeriklere web sitemizden ulaşabilirsiniz.</p>
<p style="margin-top:20px;"><a href="https://msklabs.org" style="background:#0284c7;color:#fff;padding:8px 18px;text-decoration:none;border-radius:6px;font-weight:700;">Siteyi Ziyaret Et</a></p>`);
    } else if (type === 'announcement') {
      setTitle('[Önemli Duyuru] MSK Labs Sistem Güncellemesi');
      setContentHtml(`<h2>Önemli Sistem Bilgilendirmesi</h2>
<p>Değerli kullanıcılarımız,</p>
<p>Altyapımızda planlanan kararlılık ve performans güncellemesi hakkında sizleri bilgilendirmek isteriz.</p>
<p>Herhangi bir kesinti beklenmemektedir. Anlayışınız için teşekkür ederiz.</p>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0;" />
<p style="font-size:0.75rem;color:#94a3b8;">MSK Labs Operasyon Ekibi</p>`);
    }
  };

  const handleConfirmSend = async () => {
    setShowConfirmModal(false);
    setSending(true);
    setSuccessMsg(null);

    try {
      await api.broadcastNewsletter({
        subject: title,
        content_html: contentHtml,
        category: targetPreference === 'ALL' ? 'all' : targetPreference,
      });
      setSuccessMsg(t('common.success'));
      setTitle('');
      setContentHtml('');
    } catch {
      alert(t('broadcast.sendError'));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      {/* 1. Sayfa Başlığı ve Hızlı Şablonlar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
        <div>
          <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={22} style={{ color: 'var(--accent-cyan)' }} />
            {t('broadcast.broadcastTitle')}
          </h1>
          <p className="admin-page-desc">Tüm abonelerinize veya hedef kategorilere kurumsal e-bülten gönderin.</p>
        </div>

        {/* Hızlı Şablon Butonları */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={13} style={{ color: '#f59e0b' }} /> Hızlı Şablon:
          </span>
          <button
            type="button"
            onClick={() => applyTemplate('article')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            Yeni Makale
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('weekly')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            Haftalık Özet
          </button>
          <button
            type="button"
            onClick={() => applyTemplate('announcement')}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ fontSize: '0.75rem' }}
          >
            Duyuru
          </button>
        </div>
      </div>

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          color: 'var(--accent-emerald)',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.88rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg} — E-postalar başarıyla Cloudflare D1 gönderim kuyruğuna alındı.</span>
        </div>
      )}

      {/* 2. DİKEY FORUM AKIŞI (Alt Alta Kurgu) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Form Kartı */}
        <div className="admin-list-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Hedef Kategori & Segment */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} /> Hedef Kitle / Segment
              </label>
              <select
                className="form-input"
                style={{ width: '100%', marginTop: '4px' }}
                value={targetPreference}
                onChange={(e) => setTargetPreference(e.target.value)}
              >
                <option value="ALL">Tüm Aktif Aboneler (Varsayılan)</option>
                <option value="tech">Yalnızca Teknoloji & Yazılım İlgilileri</option>
                <option value="announcements">Yalnızca Önemli Sistem Duyuruları</option>
              </select>
            </div>

            {/* E-Posta Konusu */}
            <div>
              <label className="form-label">{t('broadcast.broadcastSubject')}</label>
              <input
                type="text"
                className="form-input"
                placeholder="Örn: [MSK Labs] Yeni Makale: Yerel Öncelikli Mimari..."
                style={{ width: '100%', marginTop: '4px', fontSize: '0.92rem' }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* E-Posta Editörü (Email Preset — Sıkıntılı Araçlar Pasif) */}
            <div>
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{t('broadcast.broadcastContent')}</span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>E-posta uyumlu biçimlendirme araçları devrede</span>
              </label>
              <div style={{ marginTop: '4px' }}>
                <RichTextEditor
                  preset="email"
                  value={contentHtml}
                  onChange={setContentHtml}
                  placeholder="Bülten içeriğinizi buraya yazın veya yukarıdan hızlı şablon seçin..."
                  minHeight="220px"
                  hideHeader={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Canlı E-Posta Önizleme Vitrini (Konu ve Editörün Hemen Altında) */}
        <div className="admin-list-card" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', color: 'var(--accent-cyan)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Eye size={17} />
              <h3 className="admin-card-title" style={{ margin: 0 }}>Canlı E-Posta Önizlemesi (Gelen Kutusu Görünümü)</h3>
            </div>
            <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Alıcıların e-posta kutusunda göreceği canlı simülasyon</span>
          </div>

          <div
            style={{
              background: '#ffffff',
              color: '#0f172a',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            }}
          >
            {/* E-Posta Üst Şeridi */}
            <div style={{ background: '#f8fafc', padding: '12px 18px', borderBottom: '1px solid #e2e8f0', fontSize: '0.80rem', display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <strong style={{ color: '#64748b', minWidth: '60px' }}>Kimden:</strong>
                <span style={{ color: '#0284c7', fontWeight: 600 }}>MSK Labs Bildirim &lt;bildirim@msklabs.org&gt;</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <strong style={{ color: '#64748b', minWidth: '60px' }}>Kime:</strong>
                <span style={{ color: '#64748b' }}>Değerli Abonemiz &lt;abone@alanadi.com&gt;</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <strong style={{ color: '#64748b', minWidth: '60px' }}>Konu:</strong>
                <span style={{ color: '#0f172a', fontWeight: 700 }}>
                  {title.trim() || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>[Konu henüz yazılmadı]</span>}
                </span>
              </div>
            </div>

            {/* E-Posta Gövde Render Alanı */}
            <div
              style={{
                padding: '24px 28px',
                fontSize: '0.92rem',
                lineHeight: '1.65',
                minHeight: '140px',
                background: '#ffffff',
              }}
              dangerouslySetInnerHTML={{
                __html: contentHtml.trim() || '<p style="color:#94a3b8;font-style:italic;margin:0;">Bülten içeriği buraya canlı olarak yansıyacaktır...</p>',
              }}
            />
          </div>
        </div>

        {/* 4. Alt Gönderim İşlem Çubuğu */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card, #1e293b)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-card, #334155)' }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={14} /> Gönderimler Cloudflare Workers & D1 ile asenkron kuyruk üzerinden iletilir.
          </span>
          <button
            type="button"
            className="admin-btn admin-btn-primary admin-btn-md"
            disabled={!title.trim() || !contentHtml.trim() || sending}
            onClick={() => setShowConfirmModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700, padding: '8px 24px', cursor: (!title.trim() || !contentHtml.trim() || sending) ? 'not-allowed' : 'pointer' }}
          >
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            <span>Kuyruğa Al ve Gönder</span>
          </button>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSend}
        title={t('broadcast.sendBroadcast')}
        message="Bu bülten tüm seçili abonelerinize gönderilmek üzere kuyruğa alınacaktır. Onaylıyor musunuz?"
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
        variant="warning"
      />
    </div>
  );
};
