import React from 'react';
import { Shield, Lock } from 'lucide-react';
import { Switch } from '../ui/Input';

interface SecuritySettingsSectionProps {
  turnstileEnabled: boolean;
  setTurnstileEnabled: (val: boolean) => void;
}

export const SecuritySettingsSection: React.FC<SecuritySettingsSectionProps> = ({
  turnstileEnabled,
  setTurnstileEnabled,
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
        <Shield size={16} color="var(--accent-emerald)" /> Bot Koruması & Güvenlik Politikası
      </h3>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '16px',
        }}
      >
        <div>
          <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)', display: 'block' }}>
            Cloudflare Turnstile Bot Koruması
          </strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Destek ve yorum formlarında otomatik bot doğrulama filtresini etkinleştirir.
          </span>
        </div>
        <Switch
          checked={turnstileEnabled}
          onChange={(e) => setTurnstileEnabled(e.target.checked)}
          aria-label="Cloudflare Turnstile Anahtarı"
        />
      </div>

      <div
        style={{
          padding: '14px 16px',
          background: 'rgba(56, 189, 248, 0.05)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <Lock size={16} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '2px' }}>
            Yönetici Oturum Güvencesi & Rate Limiting
          </strong>
          Oturumlar WebCrypto PBKDF2 ve HMAC-SHA256 imzasıyla korunur. Giriş denemeleri için 5 hatalı denemede 15 dakika kilitleme uygulanır.
        </div>
      </div>
    </div>
  );
};
