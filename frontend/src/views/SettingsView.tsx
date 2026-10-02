import React, { useState } from 'react';
import { Bell, Mail, Save, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [senderName, setSenderName] = useState('MSK Labs');
  const [senderEmail, setSenderEmail] = useState('msklabs.org@gmail.com');
  const [pushEnabled, setPushEnabled] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const togglePush = () => {
    if (!pushEnabled) {
      if ('Notification' in window) {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            setPushEnabled(true);
          } else {
            alert('Bildirim izni reddedildi.');
          }
        });
      } else {
        alert('Bu tarayıcı Web Push bildirimlerini desteklemiyor.');
      }
    } else {
      setPushEnabled(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px' }}>
      <div>
        <h1 className="page-title">Sistem Ayarları</h1>
        <p className="page-subtitle">E-Posta gönderici bilgileri ve PWA bildirim tercihleri.</p>
      </div>

      <div className="glass-card" style={{ padding: '28px' }}>
        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={18} color="var(--accent-cyan)" /> E-Posta Servis Ayarları
            </h3>
            
            <div className="form-group">
              <label className="form-label">Gönderici Adı</label>
              <input
                type="text"
                className="form-input"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gönderici E-Posta Adresi</label>
              <input
                type="email"
                className="form-input"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#FFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} color="var(--accent-amber)" /> Web Push Bildirimleri (VAPID)
            </h3>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              background: 'rgba(0,0,0,0.2)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#FFF', display: 'block' }}>Yeni Bilet & Yorum Anlık Bildirimleri</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Masaüstü ve mobil PWA'ya anlık bildirimler gönderilir.</span>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${pushEnabled ? 'btn-success' : 'btn-secondary'}`}
                onClick={togglePush}
              >
                {pushEnabled ? 'Etkin' : 'Etkinleştir'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary">
              {saved ? <Check size={16} /> : <Save size={16} />} {saved ? 'Kaydedildi' : 'Ayarları Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
