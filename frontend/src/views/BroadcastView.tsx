import React, { useState } from 'react';
import { api } from '../services/api';
import { Send, CheckCircle2, Eye, FileText, Globe } from 'lucide-react';
import { ConfirmationDialog } from '../components/ui/Modal';

export const BroadcastView: React.FC = () => {
  const [lang, setLang] = useState<'tr' | 'en' | 'ar'>('tr');
  const [template, setTemplate] = useState('custom');
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [targetPreference, setTargetPreference] = useState('ALL');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const templates: Record<string, { title: string; body: string }> = {
    custom: { title: '', body: '' },
    announcement: {
      title: 'MSK Labs — Yeni Özellik ve Sistem Duyurusu',
      body: '<h2>Sayın Abonemiz,</h2><p>MSK Labs platformumuzda geliştirdiğimiz yeni özellikleri sizlere sunmaktan mutluluk duyuyoruz.</p><p>Detaylı bilgi için sitemizi ziyaret edebilirsiniz.</p>',
    },
    newsletter: {
      title: 'MSK Labs Aylık Teknoloji ve Geliştirici Bülteni',
      body: '<h2>Aylık Geliştirici Özeti</h2><p>Bu ay Cloudflare Workers, Edge Computing ve Gemini AI entegrasyonları konularında hazırladığımız blog yazıları yayında!</p>',
    },
  };

  const handleTemplateChange = (tmplKey: string) => {
    setTemplate(tmplKey);
    if (tmplKey !== 'custom' && templates[tmplKey]) {
      setTitle(templates[tmplKey].title);
      setContentHtml(templates[tmplKey].body);
    }
  };

  const audienceCounts: Record<string, number> = {
    ALL: 1450,
    VERIFIED_ONLY: 1200,
    blog: 850,
    apps: 600,
  };

  const targetCount = audienceCounts[targetPreference] || 1450;

  const handleConfirmSend = async () => {
    setShowConfirmModal(false);
    setSending(true);
    setProgress(15);
    setSuccessMsg(null);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? 90 : prev + 25));
    }, 300);

    try {
      await api.broadcastNewsletter({
        title,
        content: contentHtml,
        target_preference: targetPreference === 'ALL' ? undefined : targetPreference,
      });
      clearInterval(interval);
      setProgress(100);
      setSuccessMsg(`Bülten başarıyla kuyruğa eklendi. ${targetCount} aktif aboneye iletiliyor.`);
      setTitle('');
      setContentHtml('');
      setTemplate('custom');
    } catch {
      clearInterval(interval);
      setProgress(0);
      alert('Bülten gönderilemedi.');
    } finally {
      setTimeout(() => setSending(false), 800);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div>
        <h1 className="page-title">Bülten & E-Posta Yayın Motoru</h1>
        <p className="page-subtitle">Abonelerinize çok dilli duyuru, canlı şablon ve canlı HTML önizleme ile e-posta gönderin.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Sol Panel: Form ve Ayarlar */}
        <div className="glass-card" style={{ padding: '24px' }}>
          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              color: '#6EE7B7',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem'
            }}>
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); setShowConfirmModal(true); }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={14} /> Dil Seçimi
                </label>
                <select className="form-select" value={lang} onChange={(e) => setLang(e.target.value as 'tr'|'en'|'ar')}>
                  <option value="tr">Türkçe (TR)</option>
                  <option value="en">English (EN)</option>
                  <option value="ar">العربية (AR)</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={14} /> Hazır Şablon
                </label>
                <select className="form-select" value={template} onChange={(e) => handleTemplateChange(e.target.value)}>
                  <option value="custom">Özel İçerik</option>
                  <option value="announcement">Sistem Duyurusu</option>
                  <option value="newsletter">Aylık Bülten</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">E-Posta Başlığı / Konusu</label>
              <input
                type="text"
                className="form-input"
                placeholder="Örn: MSK Labs Sürüm Notları"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hedef Kitle (Toplam: {targetCount} Alıcı)</label>
              <select
                className="form-select"
                value={targetPreference}
                onChange={(e) => setTargetPreference(e.target.value)}
              >
                <option value="ALL">Tüm Aboneler (1,450)</option>
                <option value="VERIFIED_ONLY">Sadece Doğrulanmış Aboneler (1,200)</option>
                <option value="blog">Blog Takipçileri (850)</option>
                <option value="apps">Uygulama Kullanıcıları (600)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">E-Posta HTML İçeriği</label>
              <textarea
                className="form-textarea"
                rows={7}
                placeholder="<h2>Başlık</h2><p>Mesaj içeriği...</p>"
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
                required
              />
            </div>

            {sending && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>Gönderiliyor...</span>
                  <span>%{progress}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-primary)', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={sending || !title || !contentHtml}>
                <Send size={16} /> Gönderim Onayı İste
              </button>
            </div>
          </form>
        </div>

        {/* Sağ Panel: Canlı HTML Önizleme */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} color="var(--accent-cyan)" /> Canlı E-Posta Önizleme ({lang.toUpperCase()})
          </h3>
          <div style={{
            background: '#FFFFFF',
            color: '#1F2937',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            minHeight: '300px',
            boxShadow: 'var(--shadow-md)',
            fontFamily: lang === 'ar' ? 'Cairo, sans-serif' : 'sans-serif',
            direction: lang === 'ar' ? 'rtl' : 'ltr',
          }}>
            <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.75rem', color: '#6B7280', display: 'block' }}>Kime: {targetCount} Aktif Abone</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#111827' }}>{title || 'E-Posta Konu Başlığı'}</h3>
            </div>
            <div
              style={{ fontSize: '0.9rem', lineHeight: '1.6' }}
              dangerouslySetInnerHTML={{ __html: contentHtml || '<p style="color:#9CA3AF;">E-posta içeriği burada canlı olarak görüntülenecektir.</p>' }}
            />
            <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '0.75rem', color: '#9CA3AF' }}>
              <p>Bu e-posta MSK Labs bülten aboneliğinize istinaden gönderilmiştir. <a href="#unsub" style={{ color: '#3B82F6' }}>Bültenden Çık</a></p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmModal}
        title="Duyuru Gönderim Onayı"
        message={`"${title}" başlıklı bülteni ${targetCount} aktif aboneye toplu olarak göndermek istediğinizden emin misiniz?`}
        confirmText="Evet, Gönder"
        cancelText="İptal"
        onConfirm={handleConfirmSend}
        onClose={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
