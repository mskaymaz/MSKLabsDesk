import React, { useState } from 'react';
import { api } from '../services/api';
import { Send, CheckCircle2, Eye } from 'lucide-react';
import { ConfirmationDialog } from '../components/ui/Modal';
import { useTranslation } from '../context/I18nContext';

export const BroadcastView: React.FC = () => {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [targetPreference] = useState('ALL');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
      setSuccessMsg(t('common.success'));
      setTitle('');
      setContentHtml('');
    } catch {
      clearInterval(interval);
      setProgress(0);
      alert(t('broadcast.sendError'));
    } finally {
      setTimeout(() => setSending(false), 800);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div>
        <h1 className="page-title">{t('broadcast.broadcastTitle')}</h1>
        <p className="page-subtitle">{t('broadcast.broadcastSubject')}</p>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t('broadcast.broadcastSubject')}</label>
              <input
                type="text"
                className="form-input"
                style={{ width: '100%', marginTop: '4px' }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t('broadcast.broadcastContent')}</label>
              <textarea
                className="form-input"
                rows={8}
                style={{ width: '100%', marginTop: '4px', fontFamily: 'monospace', fontSize: '0.85rem' }}
                value={contentHtml}
                onChange={(e) => setContentHtml(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary"
              disabled={!title || !contentHtml || sending}
              onClick={() => setShowConfirmModal(true)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Send size={16} />
              <span>{t('broadcast.sendBroadcast')}</span>
            </button>
          </div>
        </div>

        {/* Sağ Panel: HTML Önizleme */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--accent-cyan)' }}>
            <Eye size={18} />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFF' }}>{t('posts.preview')}</h3>
          </div>

          <div style={{
            background: '#FFF',
            color: '#111827',
            padding: '20px',
            borderRadius: 'var(--radius-md)',
            minHeight: '260px',
            fontSize: '0.9rem',
            lineHeight: 1.6
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid #E5E7EB', paddingBottom: '8px' }}>
              {title || t('broadcast.broadcastSubject')}
            </h2>
            <div dangerouslySetInnerHTML={{ __html: contentHtml || `<p style="color: #9CA3AF;">${t('broadcast.broadcastContent')}</p>` }} />
          </div>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSend}
        title={t('broadcast.sendBroadcast')}
        message={t('common.confirm')}
        confirmText={t('common.confirm')}
        cancelText={t('common.cancel')}
        variant="warning"
      />
    </div>
  );
};
