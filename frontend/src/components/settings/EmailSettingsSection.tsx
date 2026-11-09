import React from 'react';
import { Mail, Bell, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';

interface EmailSettingsSectionProps {
  senderName: string;
  setSenderName: (val: string) => void;
  senderEmail: string;
  setSenderEmail: (val: string) => void;
  pushEnabled: boolean;
  togglePush: () => void;
}

export const EmailSettingsSection: React.FC<EmailSettingsSectionProps> = ({
  senderName,
  setSenderName,
  senderEmail,
  setSenderEmail,
  pushEnabled,
  togglePush,
}) => {
  return (
    <div className="admin-list-card" style={{ padding: '24px', marginBottom: '20px' }}>
      <h3
        className="admin-card-title"
        style={{
          fontSize: '0.95rem',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Mail size={16} color="var(--accent-cyan)" /> E-Posta & İletişim Yapılandırması
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Input
          label="Gönderici Adı"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          placeholder="MSK Labs Bildirim"
        />

        <Input
          label="Gönderici E-Postası"
          type="email"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
          placeholder="bildirim@msklabs.org"
          helperText="Kurumsal mimari gereği @gmail.com kullanılamaz; @msklabs.org adresleri geçerlidir."
        />
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bell size={15} color="var(--accent-amber)" /> Web Push Bildirimleri
          </strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Masaüstü ve mobil PWA arayüzüne anlık bildirim iletimini yönetir.
          </span>
        </div>
        <button
          type="button"
          className={`admin-btn admin-btn-sm ${pushEnabled ? 'admin-btn-success' : 'admin-btn-refresh'}`}
          onClick={togglePush}
        >
          {pushEnabled ? 'Etkin' : 'Bildirimleri Aç'}
        </button>
      </div>

      <div style={{ marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <AlertCircle size={13} />
        Gelen tüm kurumsal e-postalar Cloudflare Email Routing ile merkezi kutuya akar, giden onay postaları Resend/Brevo ile çıkar.
      </div>
    </div>
  );
};
