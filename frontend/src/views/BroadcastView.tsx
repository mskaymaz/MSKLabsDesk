import React, { useState } from 'react';
import { api } from '../services/api';
import { Send, CheckCircle2 } from 'lucide-react';

export const BroadcastView: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetPreference, setTargetPreference] = useState('ALL');
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setSending(true);
    setProgress(15);
    setSuccessMsg(null);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 300);

    try {
      await api.broadcastNewsletter({
        title,
        content,
        target_preference: targetPreference === 'ALL' ? undefined : targetPreference,
      });
      clearInterval(interval);
      setProgress(100);
      setSuccessMsg('Bülten kuyruğa eklendi ve abonelere iletilmeye başlandı.');
      setTitle('');
      setContent('');
    } catch (err: unknown) {
      clearInterval(interval);
      setProgress(0);
      alert('Bülten gönderilemedi.');
    } finally {
      setTimeout(() => setSending(false), 800);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
      <div>
        <h1 className="page-title">Bülten & E-Posta Yayın Motoru</h1>
        <p className="page-subtitle">Abonelerinize özel duyuru, yeni uygulama veya blog güncellemeleri gönderin.</p>
      </div>

      <div className="glass-card" style={{ padding: '28px' }}>
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
            gap: '10px'
          }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleBroadcast}>
          <div className="form-group">
            <label className="form-label">E-Posta Başlığı / Konusu</label>
            <input
              type="text"
              className="form-input"
              placeholder="Örn: MSK Labs Yeni Sürüm Notları ve Güncellemeler"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Hedef Kitle Tercihi</label>
            <select
              className="form-select"
              value={targetPreference}
              onChange={(e) => setTargetPreference(e.target.value)}
            >
              <option value="ALL">Tüm Aktif Aboneler</option>
              <option value="blog">Blog Yazısı Takipçileri</option>
              <option value="apps">Yeni Uygulama Duyuruları</option>
              <option value="updates">Sürüm Güncellemeleri</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">E-Posta İçeriği (Markdown veya Düz Metin)</label>
            <textarea
              className="form-textarea"
              rows={8}
              placeholder="Abonelerinize iletilecek mesaj metni..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {sending && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>E-Postalar Kuyruğa Ekleniyor...</span>
                <span>%{progress}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-cyan))', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={sending || !title || !content}
            >
              <Send size={16} /> Duyuruyu Gönder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
