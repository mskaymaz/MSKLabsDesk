import React, { useState } from 'react';
import type { Subscriber } from '../types';
import { Mail, CheckCircle2, XCircle, Search, ShieldCheck, Download, Send } from 'lucide-react';
import { useTranslation } from '../context/I18nContext';
import { BroadcastModal } from '../components/modals/BroadcastModal';

interface SubscribersViewProps {
  subscribers: Subscriber[];
}

export const SubscribersView: React.FC<SubscribersViewProps> = ({ subscribers }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified' | 'unsubscribed'>('all');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  const filtered = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    const isVerified = (s as any).status === 'active' || s.is_verified;
    const isUnsubscribed = (s as any).status === 'unsubscribed' || !!s.unsubscribed_at;
    if (statusFilter === 'verified') return isVerified && !isUnsubscribed;
    if (statusFilter === 'unverified') return !isVerified;
    if (statusFilter === 'unsubscribed') return isUnsubscribed;
    return true;
  });

  const activeSubscribersCount = subscribers.filter((s) => {
    const isVerified = (s as any).status === 'active' || s.is_verified;
    const isUnsubscribed = (s as any).status === 'unsubscribed' || !!s.unsubscribed_at;
    return isVerified && !isUnsubscribed;
  }).length;

  const handleExportCsv = () => {
    if (filtered.length === 0) {
      alert('Dışa aktarılacak abone kaydı bulunamadı.');
      return;
    }

    const headers = ['E-Posta', 'Durum', 'KVKK Onayı', 'Kayıt Tarihi', 'Ayrılma Tarihi'];
    const rows = filtered.map((s) => {
      const statusText = s.unsubscribed_at ? 'Ayrıldı' : s.is_verified ? 'Doğrulanmış' : 'Onay Bekliyor';
      const createdStr = s.created_at ? new Date(s.created_at).toLocaleDateString('tr-TR') : '';
      const unsubStr = s.unsubscribed_at ? new Date(s.unsubscribed_at).toLocaleDateString('tr-TR') : '-';
      return [
        `"${s.email.replace(/"/g, '""')}"`,
        `"${statusText}"`,
        '"Evet"',
        `"${createdStr}"`,
        `"${unsubStr}"`,
      ].join(';');
    });

    // UTF-8 BOM ekleyerek Türkçe karakterlerin Excel'de bozulmasını önle
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
      {/* Üst Başlık & Aksiyon Butonları */}
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="admin-page-title">{t('subscribers.title')}</h1>
          <p className="admin-page-desc">
            {t('dashboard.totalSubscribers')}: <strong>{subscribers.length}</strong> (Aktif Doğrulanmış: <strong>{activeSubscribersCount}</strong>)
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

      {/* Arama & Filtre Çubuğu */}
      <div className="admin-list-card" style={{ padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder={t('common.search')}
            style={{ paddingLeft: '32px', height: '28px', fontSize: '13px', width: '100%' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ width: '180px', height: '28px', fontSize: '13px', padding: '0 22px 0 8px' }}
          >
            <option value="all">{t('common.all')}</option>
            <option value="verified">Doğrulanmış</option>
            <option value="unverified">Doğrulanmamış</option>
            <option value="unsubscribed">Ayrılanlar</option>
          </select>
          <span className="admin-badge admin-badge-counter">
            {filtered.length}
          </span>
        </div>
      </div>

      {/* Tablo Listesi */}
      <div className="admin-list-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 16px' }}>{t('subscribers.email')}</th>
                <th style={{ padding: '12px 16px' }}>{t('common.status')}</th>
                <th style={{ padding: '12px 16px' }}>KVKK</th>
                <th style={{ padding: '12px 16px' }}>{t('subscribers.subscribedAt')}</th>
                <th style={{ padding: '12px 16px' }}>Ayrılma Tarihi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--text-primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={15} color="var(--accent-primary)" /> {sub.email}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {sub.unsubscribed_at ? (
                        <span className="admin-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-rose)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                          <XCircle size={12} /> Ayrıldı
                        </span>
                      ) : sub.is_verified ? (
                        <span className="admin-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                          <CheckCircle2 size={12} /> Doğrulanmış
                        </span>
                      ) : (
                        <span className="admin-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                          <XCircle size={12} /> Onay Bekliyor
                        </span>
                      )}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toplu Bülten Gönderim Modalı */}
      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        activeSubscriberCount={activeSubscribersCount}
      />
    </div>
  );
};
