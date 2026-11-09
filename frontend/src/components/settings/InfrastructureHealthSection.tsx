import React, { useState } from 'react';
import { Cpu, CheckCircle2, RotateCw, Database, Zap, AlertCircle } from 'lucide-react';

export const InfrastructureHealthSection: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setErrorMsg(null);
    const start = performance.now();
    try {
      // API Health Ping
      const res = await fetch('/api/health');
      const diff = Math.round(performance.now() - start);
      if (res.ok) {
        setLatency(diff);
        setLastCheckTime(new Date().toLocaleTimeString('tr-TR'));
      } else {
        throw new Error('API HTTP ' + res.status + ' hatası verdi.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Bağlantı kurulamadı.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="admin-list-card" style={{ padding: '24px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3
          className="admin-card-title"
          style={{
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Cpu size={16} color="var(--accent-primary)" /> Altyapı & API Entegrasyon Durumu
        </h3>

        <button
          type="button"
          onClick={handleTestConnection}
          disabled={testing}
          className="admin-btn admin-btn-sm admin-btn-refresh"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RotateCw size={13} className={testing ? 'animate-spin' : ''} />
          {testing ? 'Sınanıyor...' : 'Bağlantıyı Sına'}
        </button>
      </div>

      {/* Canlı Ping Göstergesi */}
      {latency !== null && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            background: 'rgba(22, 163, 74, 0.08)',
            border: '1px solid rgba(22, 163, 74, 0.25)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.84rem',
            color: '#16a34a',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <Zap size={14} /> Cloudflare Worker API Canlı Yanıt Süresi: <strong>{latency} ms</strong>
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Son Test: {lastCheckTime}
          </span>
        </div>
      )}

      {errorMsg && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '16px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.84rem',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={15} />
          <span>Bağlantı Hatası: {errorMsg}</span>
        </div>
      )}

      {/* Entegrasyon Rozetleri */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Resend (Birincil Mail)</span>
          <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
            <CheckCircle2 size={12} /> AKTİF (100/g)
          </span>
        </div>

        <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Brevo (Yedek Mail)</span>
          <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
            <CheckCircle2 size={12} /> AKTİF (300/g)
          </span>
        </div>

        <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Cloudflare D1 & R2</span>
          <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
            <CheckCircle2 size={12} /> AKTİF (Edge)
          </span>
        </div>

        <div style={{ padding: '12px 14px', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Gemini AI & TTS</span>
          <span style={{ fontSize: '0.72rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 700 }}>
            <CheckCircle2 size={12} /> AKTİF (Çok Dilli)
          </span>
        </div>
      </div>

      {/* D1 Sistem Telemetrisi & Veritabanı Bilgi Kartı */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={14} color="var(--accent-primary)" /> D1 Veritabanı & Telemetri Bilgisi
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Veritabanı Adı</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>msklabsdesk_db</div>
          </div>

          <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Migration Seviyesi</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16a34a' }}>19/19 Uygulandı (Senkron)</div>
          </div>

          <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Medya Deposu</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>msklabs-media (R2)</div>
          </div>

          <div style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Mimari & Maliyet</div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>Zero-Cost ($0 / Ay)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
