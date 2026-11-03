import React, { useState } from 'react';
import type { Subscriber } from '../types';
import { Mail, CheckCircle2, XCircle, Search, ShieldCheck, Download, Send, Tag, Filter } from 'lucide-react';
import { useTranslation } from '../context/I18nContext';
import { BroadcastModal } from '../components/modals/BroadcastModal';

interface SubscribersViewProps {
  subscribers: Subscriber[];
}

export const SubscribersView: React.FC<SubscribersViewProps> = ({ subscribers }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified' | 'unsubscribed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  // Tanımlı Kategori ve İlgi Alanları
  const CATEGORIES = [
    { id: 'all', label: 'Tüm Aboneler', color: '#38bdf8' },
    { id: 'blog', label: 'Blog & Fikir', color: '#0284c7' },
    { id: 'apps', label: 'Uygulamalar', color: '#a855f7' },
    { id: 'tech', label: 'Yazılım & Teknoloji', color: '#10b981' },
    { id: 'announcements', label: 'Duyurular', color: '#f59e0b' },
  ];

  // Aktif (Ayrılmamış ve Doğrulanmış) Aboneler
  const activeSubscribers = subscribers.filter((s) => {
    const isVerified = (s as any).status === 'active' || s.is_verified;
    const isUnsubscribed = (s as any).status === 'unsubscribed' || !!s.unsubscribed_at;
    return isVerified && !isUnsubscribed;
  });

  // Kategori Bazlı Abone Sayımı
  const getCountForCategory = (catId: string) => {
    if (catId === 'all') return activeSubscribers.length;
    return activeSubscribers.filter((s) => {
      const cats = s.categories || (s.preferences ? s.preferences.split(',').map((c) => c.trim()) : ['all']);
      return cats.includes(catId) || cats.includes('all');
    }).length;
  };

  // Dinamik Filtreleme (Arama + Durum + Kategori)
  const filtered = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    const isVerified = (s as any).status === 'active' || s.is_verified;
    const isUnsubscribed = (s as any).status === 'unsubscribed' || !!s.unsubscribed_at;

    if (statusFilter === 'verified' && (!isVerified || isUnsubscribed)) return false;
    if (statusFilter === 'unverified' && isVerified) return false;
    if (statusFilter === 'unsubscribed' && !isUnsubscribed) return false;

    // Kategori Filtresi
    if (selectedCategory !== 'all') {
      const cats = s.categories || (s.preferences ? s.preferences.split(',').map((c) => c.trim()) : ['all']);
      if (!cats.includes(selectedCategory) && !cats.includes('all')) {
        return false;
      }
    }
    return true;
  });

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      alert('Dışa aktarılacak abone kaydı bulunamadı.');
      return;
    }

    const headers = ['E-Posta', 'Durum', 'İlgi Alanları / Tercihler', 'KVKK Onayı', 'Kayıt Tarihi', 'Ayrılma Tarihi'];
    const rows = filtered.map((s) => {
      const statusText = s.unsubscribed_at ? 'Ayrıldı' : s.is_verified ? 'Doğrulanmış' : 'Onay Bekliyor';
      const cats = s.categories || (s.preferences ? s.preferences.split(',').map((c) => c.trim()) : ['all']);
      const prefText = cats.map((c) => CATEGORIES.find((item) => item.id === c)?.label || c).join(', ');
      const createdStr = s.created_at ? new Date(s.created_at).toLocaleDateString('tr-TR') : '';
      const unsubStr = s.unsubscribed_at ? new Date(s.unsubscribed_at).toLocaleDateString('tr-TR') : '-';
      return [
        `"${s.email.replace(/"/g, '""')}"`,
        `"${statusText}"`,
        `"${prefText}"`,
        '"Evet"',
        `"${createdStr}"`,
        `"${unsubStr}"`,
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const today = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `msklabs_aboneler_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      {/* 1. Üst Başlık & Aksiyon Butonları */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="admin-page-title">{t('subscribers.title')}</h1>
          <p className="admin-page-desc">
            {t('dashboard.totalSubscribers')}: <strong>{subscribers.length}</strong> (Aktif Doğrulanmış: <strong>{activeSubscribers.length}</strong>)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleExportCsv}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Listeyi Excel / CSV Olarak İndir"
          >
            <Download size={13} /> CSV İndir
          </button>

          <button
            type="button"
            onClick={() => setIsBroadcastOpen(true)}
            className="admin-btn admin-btn-primary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
            title="Abonelere Toplu Bülten Gönder"
          >
            <Send size={13} /> Bülten Gönder
          </button>
        </div>
      </div>

      {/* 2. Kategori Dağılım Kartları (İlgi Alanı Sayımları ve Tek Tık Filtre) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '16px' }}>
        {CATEGORIES.map((cat) => {
          const count = getCountForCategory(cat.id);
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'var(--bg-card, #1e293b)',
                border: isSelected ? '1px solid #38bdf8' : '1px solid var(--border-subtle, #334155)',
                borderRadius: '8px',
                padding: '10px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', color: isSelected ? '#38bdf8' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={11} style={{ color: cat.color }} /> {cat.label}
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary, #f8fafc)', marginTop: '2px' }}>
                  {count} <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 400 }}>abone</span>
                </div>
              </div>
              {isSelected && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }} />}
            </button>
          );
        })}
      </div>

      {/* 3. Arama & Filtre Çubuğu */}
      <div className="admin-list-card" style={{ padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder={t('common.search')}
            style={{ paddingLeft: '32px', height: '30px', fontSize: '13px', width: '100%' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Kategori Seçim Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={13} style={{ color: '#94a3b8' }} />
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '160px', height: '30px', fontSize: '12px' }}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label} ({getCountForCategory(c.id)})</option>
              ))}
            </select>
          </div>

          {/* Durum Seçim Dropdown */}
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ width: '150px', height: '30px', fontSize: '12px' }}
          >
            <option value="all">{t('common.all')}</option>
            <option value="verified">Doğrulanmış</option>
            <option value="unverified">Onay Bekliyor</option>
            <option value="unsubscribed">Ayrılanlar</option>
          </select>

          <span className="admin-badge admin-badge-counter">
            {filtered.length} Kayıt
          </span>
        </div>
      </div>

      {/* 4. Tablo Listesi */}
      <div className="admin-list-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>{t('subscribers.email')}</th>
                <th style={{ padding: '12px 16px' }}>{t('common.status')}</th>
                <th style={{ padding: '12px 16px' }}>İlgi Alanları / Tercihler</th>
                <th style={{ padding: '12px 16px' }}>KVKK</th>
                <th style={{ padding: '12px 16px' }}>{t('subscribers.subscribedAt')}</th>
                <th style={{ padding: '12px 16px' }}>Ayrılma Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Filtreye uygun abone kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const cats = sub.categories || (sub.preferences ? sub.preferences.split(',').map((c) => c.trim()) : ['all']);
                  const isVerified = (sub as any).status === 'active' || sub.is_verified;
                  const isUnsubscribed = (sub as any).status === 'unsubscribed' || !!sub.unsubscribed_at;

                  return (
                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={15} color="var(--accent-primary)" /> {sub.email}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {isUnsubscribed ? (
                          <span className="admin-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-rose)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                            <XCircle size={12} /> Ayrıldı
                          </span>
                        ) : isVerified ? (
                          <span className="admin-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                            <CheckCircle2 size={12} /> Doğrulanmış
                          </span>
                        ) : (
                          <span className="admin-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                            <XCircle size={12} /> Onay Bekliyor
                          </span>
                        )}
                      </td>
                      {/* İlgi Alanları / Tercihler Sütunu */}
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {cats.map((c) => {
                            const cat = CATEGORIES.find((item) => item.id === c) || { label: c, color: '#64748b' };
                            return (
                              <span
                                key={c}
                                style={{
                                  fontSize: '0.70rem',
                                  padding: '2px 8px',
                                  borderRadius: '4px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: `1px solid ${cat.color}40`,
                                  color: cat.color,
                                  fontWeight: 600,
                                }}
                              >
                                {cat.label}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={14} /> Evet
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {new Date(sub.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {sub.unsubscribed_at ? new Date(sub.unsubscribed_at).toLocaleDateString('tr-TR') : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Toplu Bülten Gönderim Modalı */}
      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        activeSubscriberCount={activeSubscribers.length}
      />
    </div>
  );
};
