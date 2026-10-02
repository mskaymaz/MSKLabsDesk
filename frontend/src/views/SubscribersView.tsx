import React, { useState } from 'react';
import type { Subscriber } from '../types';
import { Mail, CheckCircle2, XCircle, Search } from 'lucide-react';

interface SubscribersViewProps {
  subscribers: Subscriber[];
}

export const SubscribersView: React.FC<SubscribersViewProps> = ({ subscribers }) => {
  const [search, setSearch] = useState('');

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div>
        <h1 className="page-title">Bülten Aboneleri</h1>
        <p className="page-subtitle">Sisteme kayıtlı aktif e-posta aboneleri ve bildirim tercihleri.</p>
      </div>

      <div className="glass-card" style={{ padding: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
          Toplam {filtered.length} Abone
        </span>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '14px 20px' }}>E-Posta Adresi</th>
              <th style={{ padding: '14px 20px' }}>Doğrulama Durumu</th>
              <th style={{ padding: '14px 20px' }}>Kayıt Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Abone bulunamadı.
                </td>
              </tr>
            ) : (
              filtered.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 20px', color: '#FFF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Mail size={16} color="var(--accent-primary)" /> {sub.email}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {sub.is_verified ? (
                      <span className="badge badge-resolved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={12} /> Doğrulanmış
                      </span>
                    ) : (
                      <span className="badge badge-in_progress" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <XCircle size={12} /> Bekliyor
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--text-muted)' }}>
                    {new Date(sub.created_at).toLocaleDateString('tr-TR')}
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
