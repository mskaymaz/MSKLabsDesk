import React from 'react';
import { History, X, RotateCcw, Clock, Layers } from 'lucide-react';
import type { PageRevision } from '../../types';

export interface StudioRevisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  revisions: PageRevision[];
  onRestore: (rev: PageRevision) => void;
}

export const StudioRevisionsModal: React.FC<StudioRevisionsModalProps> = ({
  isOpen,
  onClose,
  revisions,
  onRestore,
}) => {
  if (!isOpen) return null;

  const handleRestore = (rev: PageRevision) => {
    if (confirm(`${rev.formattedDate} tarihli revizyon tuval üzerine geri yüklensin mi?\nMevcut durum değiştirilecektir (Geri alabilirsiniz).`)) {
      onRestore(rev);
      onClose();
    }
  };

  const sortedRevisions = [...revisions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      className="animate-fade-in"
      onClick={onClose}
    >
      <div
        style={{
          width: '640px',
          maxWidth: '96vw',
          maxHeight: '85vh',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Üst Başlık */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple, #818cf8)' }}>
              <History size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Revizyon Geçmişi ve Sürüm Kontrolü
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                Kaydedilen son 15 sürüm arasından seçim yapıp tek tıkla geri dönebilirsiniz.
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-btn-icon" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Revizyon Listesi */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedRevisions.length === 0 ? (
            <div style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Clock size={32} style={{ opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '13px' }}>Henüz kaydedilmiş bir revizyon bulunmuyor.</p>
              <span style={{ fontSize: '11px', maxWidth: '380px' }}>
                Sayfayı stüdyo üzerinden kaydettiğinizde veya şablon uyguladığınızda otomatik olarak yeni revizyon noktaları oluşturulacaktır.
              </span>
            </div>
          ) : (
            sortedRevisions.map((rev, idx) => (
              <div
                key={rev.id || idx}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {rev.formattedDate}
                    </span>
                    {idx === 0 && (
                      <span className="admin-badge admin-badge-emerald" style={{ fontSize: '9px' }}>
                        En Güncel
                      </span>
                    )}
                    <span className="admin-badge admin-badge-purple" style={{ fontSize: '9px' }}>
                      {rev.note || 'Kayıt'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                      <Layers size={11} /> {rev.blocks_count || (rev.blocks || []).length} Blok
                    </span>
                    <span>•</span>
                    <span>Yazar: {rev.author || 'Yönetici'}</span>
                  </div>

                  {/* Blok Tipleri Önizleme Rozetleri */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {(rev.blocks || []).map((b, bIdx) => (
                      <span
                        key={bIdx}
                        style={{
                          fontSize: '9px',
                          background: 'var(--bg-card)',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-secondary)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {b.type.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRestore(rev)}
                  className="admin-btn admin-btn-secondary admin-btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', fontSize: '11px', flexShrink: 0 }}
                  title="Bu sürüme geri dön"
                >
                  <RotateCcw size={12} className="text-cyan" />
                  <span>Geri Yükle</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
