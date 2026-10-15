import React, { useState } from 'react';
import type { Subscriber } from '../types';
import { Mail, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../context/I18nContext';

interface SubscribersViewProps {
  subscribers: Subscriber[];
}

export const SubscribersView: React.FC<SubscribersViewProps> = ({ subscribers }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified' | 'unsubscribed'>('all');

  const filtered = subscribers.filter((s) => {
    const matchesSearch = s.email.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'verified') return s.is_verified;
    if (statusFilter === 'unverified') return !s.is_verified;
    if (statusFilter === 'unsubscribed') return !!s.unsubscribed_at;
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '16px' }}>
        <h1 className="admin-page-title">{t('subscribers.title')}</h1>
        <p className="admin-page-desc">{t('dashboard.totalSubscribers')}: {subscribers.length}</p>
      </div>

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
                  {t('common.loading')}
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
    </div>
  );
};
