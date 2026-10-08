import React, { useState } from 'react';
import type { Subscriber } from '../types';
import { Mail, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';

interface SubscribersViewProps {
  subscribers: Subscriber[];
}

export const SubscribersView: React.FC<SubscribersViewProps> = ({ subscribers }) => {
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
      <div>
        <h1 className="page-title">Bülten Aboneleri</h1>
        <p className="page-subtitle">Sisteme kayıtlı aktif e-posta aboneleri, KVKK onay durumu ve bülten ayrılma kayıtları.</p>
      </div>

      <div className="glass-card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ position: 'relative', width: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Abone e-postası ara..."
            style={{ paddingLeft: '38px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ width: '180px' }}
          >
            <option value="all">Tüm Durumlar</option>
            <option value="verified">Doğrulanmış (Aktif)</option>
            <option value="unverified">Doğrulanmamış</option>
            <option value="unsubscribed">Ayrılanlar (Pasif)</option>
          </select>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Toplam {filtered.length} Abone
          </span>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '14px 20px' }}>E-Posta Adresi</th>
              <th style={{ padding: '14px 20px' }}>Doğrulama Durumu</th>
              <th style={{ padding: '14px 20px' }}>KVKK Onayı</th>
              <th style={{ padding: '14px 20px' }}>Kayıt Tarihi</th>
              <th style={{ padding: '14px 20px' }}>Ayrılma Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Kriterlere uygun abone bulunamadı.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 20px', color: '#FFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={16} color="var(--accent-primary)" /> {sub.email}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {sub.unsubscribed_at ? (
                      <span className="badge badge-closed" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={12} /> Ayrıldı
                      </span>
                    ) : sub.is_verified ? (
                      <span className="badge badge-resolved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> Doğrulanmış
                      </span>
                    ) : (
                      <span className="badge badge-in_progress" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={12} /> Onay Bekliyor
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={14} /> Evet (Kabul)
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                    {new Date(sub.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                    {sub.unsubscribed_at ? new Date(sub.unsubscribed_at).toLocaleDateString('tr-TR') : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
