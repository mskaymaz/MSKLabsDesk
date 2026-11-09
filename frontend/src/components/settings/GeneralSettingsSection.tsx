import React from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import { Input } from '../ui/Input';
import { useTheme } from '../../context/ThemeContext';

interface GeneralSettingsSectionProps {
  siteTitle: string;
  setSiteTitle: (val: string) => void;
  siteUrl: string;
  setSiteUrl: (val: string) => void;
}

export const GeneralSettingsSection: React.FC<GeneralSettingsSectionProps> = ({
  siteTitle,
  setSiteTitle,
  siteUrl,
  setSiteUrl,
}) => {
  const { theme, setTheme } = useTheme();

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
        <Globe size={16} color="var(--accent-primary)" /> Genel Site Bilgileri
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <Input
          label="Site Başlığı"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          placeholder="MSK Labs Desk"
        />

        <Input
          label="Site URL"
          type="url"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          placeholder="https://msklabs.org"
        />
      </div>

      <div className="form-group">
        <label className="form-label" style={{ display: 'block', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Yönetici Paneli Teması
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`admin-btn admin-btn-sm ${theme === 'dark' ? 'admin-btn-primary' : 'admin-btn-refresh'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Moon size={13} /> Karanlık (Dark)
          </button>
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`admin-btn admin-btn-sm ${theme === 'light' ? 'admin-btn-primary' : 'admin-btn-refresh'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Sun size={13} /> Aydınlık (Light)
          </button>
        </div>
      </div>
    </div>
  );
};
