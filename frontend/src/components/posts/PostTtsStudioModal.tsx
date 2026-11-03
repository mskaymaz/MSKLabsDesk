import React, { useState, useEffect } from 'react';
import { X, Volume2, CheckCircle2, RotateCcw, EyeOff, Loader2, Sparkles, Clock, FileText } from 'lucide-react';
import { api } from '../../services/api';

export interface PostTtsStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number | string;
  postTitle: string;
}

interface AudioAsset {
  id: number;
  post_id: string;
  language: 'TR' | 'EN' | 'AR';
  article_version: number;
  audio_version: number;
  status: 'GENERATING' | 'DRAFT' | 'APPROVED' | 'STALE' | 'FAILED';
  duration_seconds: number;
  r2_object_key: string;
  validation?: any;
  created_at: string;
}

export const PostTtsStudioModal: React.FC<PostTtsStudioModalProps> = ({
  isOpen,
  onClose,
  postId,
  postTitle,
}) => {
  const [activeLang, setActiveLang] = useState<'TR' | 'EN' | 'AR'>('TR');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [assets, setAssets] = useState<AudioAsset[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    if (!postId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getTtsStatus(postId);
      if (res.success && res.data) {
        setAssets(res.data.assets || []);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ses durumları yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [isOpen, postId]);

  if (!isOpen) return null;

  const currentAsset = assets.find((a) => a.language === activeLang);

  const handleGenerate = async (isRegenerate = false) => {
    setActionLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      if (isRegenerate) {
        await api.regenerateTts(postId, activeLang);
        setSuccessMsg(`${activeLang} için ses yeniden üretimi başlatıldı.`);
      } else {
        await api.generateTts(postId, activeLang);
        setSuccessMsg(`${activeLang} için ses üretimi başlatıldı.`);
      }
      await fetchStatus();
    } catch (err: any) {
      setErrorMsg(err.message || 'İşlem başarısız oldu.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!currentAsset) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      await api.approveTts(currentAsset.id, postId, activeLang);
      setSuccessMsg(`${activeLang} ses kaydı onaylandı ve yayına alındı.`);
      await fetchStatus();
    } catch (err: any) {
      setErrorMsg(err.message || 'Onaylama başarısız.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!currentAsset) return;
    setActionLoading(true);
    setErrorMsg(null);
    try {
      await api.unpublishTts(currentAsset.id, postId, activeLang);
      setSuccessMsg(`${activeLang} ses kaydı yayından kaldırıldı (Taslağa alındı).`);
      await fetchStatus();
    } catch (err: any) {
      setErrorMsg(err.message || 'Yayından kaldırma başarısız.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return <span style={{ background: '#15803d', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>YAYINDA</span>;
      case 'DRAFT':
        return <span style={{ background: '#ca8a04', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>TASLAK (ONAY BEKLİYOR)</span>;
      case 'GENERATING':
        return <span style={{ background: '#0284c7', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>ÜRETİLİYOR</span>;
      case 'STALE':
        return <span style={{ background: '#dc2626', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>GÜNCELLEME GEREKLİ</span>;
      default:
        return <span style={{ background: '#64748b', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>SES YOK</span>;
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
          maxWidth: '560px',
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
        {/* Başlık Çubuğu */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid var(--border-subtle, #334155)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={20} color="#0284c7" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Stüdyo Kalitesinde Ses & MP3 Yönetimi</span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Gövde */}
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Makale: <strong style={{ color: '#f8fafc' }}>{postTitle || `#${postId}`}</strong>
          </div>

          {/* Dil Seçici */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {(['TR', 'EN', 'AR'] as const).map((lang) => {
              const langAsset = assets.find((a) => a.language === lang);
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: activeLang === lang ? '#0284c7' : 'var(--border-card, #334155)',
                    background: activeLang === lang ? 'rgba(2, 132, 199, 0.15)' : 'transparent',
                    color: activeLang === lang ? '#38bdf8' : '#94a3b8',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{lang === 'TR' ? 'Türkçe (TR)' : lang === 'EN' ? 'English (EN)' : 'العربية (AR)'}</span>
                  {langAsset && getStatusBadge(langAsset.status)}
                </button>
              );
            })}
          </div>

          {/* Bildirimler */}
          {errorMsg && <div style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem' }}>{errorMsg}</div>}
          {successMsg && <div style={{ background: 'rgba(22, 163, 74, 0.15)', border: '1px solid #22c55e', color: '#86efac', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem' }}>{successMsg}</div>}

          {/* Durum Kartı */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', border: '1px solid var(--border-card, #334155)', borderRadius: '8px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Aktif Durum:</span>
              {getStatusBadge(currentAsset?.status)}
            </div>

            {currentAsset?.duration_seconds ? (
              <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '10px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} /> ~{currentAsset.duration_seconds} sn</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={13} /> Sürüm: v{currentAsset.audio_version}</span>
              </div>
            ) : null}

            {/* Ön Dinleme Oynatıcı */}
            {currentAsset && currentAsset.status !== 'FAILED' && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '4px' }}>Stüdyo Ön Dinleme (HTTP 206 Stream):</div>
                <audio
                  controls
                  style={{ width: '100%', height: '36px', borderRadius: '6px' }}
                  src={`/api/v1/public/audio/${postId}/${activeLang}`}
                />
              </div>
            )}

            {!currentAsset && (
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                Bu dil için henüz sunucu taraflı MP3 ses dosyası üretilmedi. Metin temizleme ve telaffuz süzgecinden geçirerek stüdyo ses üretimini başlatabilirsiniz.
              </p>
            )}
          </div>

          {/* Aksiyon Butonları */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '6px' }}>
            {!currentAsset ? (
              <button
                type="button"
                onClick={() => handleGenerate(false)}
                disabled={actionLoading || loading}
                className="admin-btn admin-btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Stüdyo Sesi Üret
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleGenerate(true)}
                  disabled={actionLoading || loading}
                  className="admin-btn admin-btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.78rem' }}
                >
                  <RotateCcw size={13} /> Yeniden Üret
                </button>

                {currentAsset.status === 'APPROVED' ? (
                  <button
                    type="button"
                    onClick={handleUnpublish}
                    disabled={actionLoading || loading}
                    className="admin-btn admin-btn-warning"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', fontSize: '0.78rem' }}
                  >
                    <EyeOff size={13} /> Yayından Kaldır
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={actionLoading || loading}
                    className="admin-btn admin-btn-success"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: 700 }}
                  >
                    <CheckCircle2 size={13} /> Onayla ve Yayına Al
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
