import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  RotateCw,
  Download,
  Activity,
  Layers,
  AlertTriangle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../services/api';
import type { DownloadsSummaryResponse, TelemetryOverviewResponse } from '../../types';

export const TelemetryView: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryOverviewResponse | null>(null);
  const [downloads, setDownloads] = useState<DownloadsSummaryResponse | null>(null);
  const [selectedApp, setSelectedApp] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else if (!telemetry) setLoading(true);
    setError(null);
    try {
      const [tRes, dRes] = await Promise.all([
        api.getTelemetryOverview(forceRefresh),
        api.getDownloadsSummary(forceRefresh),
      ]);
      setTelemetry(tRes);
      setDownloads(dRes);
      if (!selectedApp && tRes.appLeague.length > 0) {
        setSelectedApp(tRes.appLeague[0].appId);
      }
    } catch (err: any) {
      setError(err.message || 'Ekosistem verileri yüklenemedi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, []);

  if (loading && !telemetry) {
    return (
      <div className="admin-panel-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Ekosistem telemetri ve indirme verileri yükleniyor...
      </div>
    );
  }

  const totals = telemetry?.totals || { totalDevices: 0, totalInstallations: 0, totalLaunches: 0, unresolvedCrashes: 0 };
  const league = telemetry?.appLeague || [];
  const buckets = telemetry?.crossApp?.multiAppBuckets || { twoPlus: 0, threePlus: 0, fivePlus: 0 };
  const correlations = (selectedApp && telemetry?.crossApp?.appCorrelations?.[selectedApp]) || [];
  const combinations = telemetry?.crossApp?.topCombinations || [];
  const dlVersions = downloads?.versions || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Üst Başlık & Granüler Yenile */}
      <div className="admin-panel-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Uygulama Ligi & Ekosistem Telemetrisi
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
            Kişisel veri içermeyen anonim cihaz kimliği (eco_device_id) ile kurulum, kalıcılık ve çapraz uygulama kullanımı
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {telemetry?.lastUpdated && (
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Son Güncelleme: {new Date(telemetry.lastUpdated).toLocaleTimeString('tr-TR')}
            </span>
          )}
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: refreshing ? 'wait' : 'pointer',
            }}
          >
            <RotateCw size={13} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Yenileniyor...' : 'Yenile'}
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-panel-card" style={{ borderColor: 'var(--danger, #ef4444)', color: 'var(--danger, #ef4444)', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* 4 Özet KPI Kartı */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <div className="admin-panel-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Smartphone size={14} /> Tekil Cihaz (Kurulu)
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{totals.totalDevices.toLocaleString('tr-TR')}</div>
        </div>
        <div className="admin-panel-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Activity size={14} /> Toplam Açılış
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{totals.totalLaunches.toLocaleString('tr-TR')}</div>
        </div>
        <div className="admin-panel-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <Download size={14} /> Web / R2 İndirmeleri
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{(downloads?.totalDownloads || 0).toLocaleString('tr-TR')}</div>
        </div>
        <div className="admin-panel-card" style={{ padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <AlertTriangle size={14} /> Açık Çökme Kaydı
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, marginTop: '6px' }}>{totals.unresolvedCrashes.toLocaleString('tr-TR')}</div>
        </div>
      </div>

      {/* Uygulama Ligi Tablosu */}
      <div className="admin-panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>Uygulama Ligi (Kurulum & Gerçek Kullanım)</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Birlikte kullanılanları görmek için satıra tıklayın</span>
        </div>
        {league.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Henüz telemetri verisi gelmedi. Uygulamalara IST-017 SDK eklendikçe burada listelenecektir.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  <th style={{ padding: '8px' }}>Uygulama</th>
                  <th style={{ padding: '8px' }}>Kurulu Cihaz</th>
                  <th style={{ padding: '8px' }}>Ort. Kurulu Kalma</th>
                  <th style={{ padding: '8px' }}>Toplam Açılış</th>
                  <th style={{ padding: '8px' }}>Cihaz Baş. Açılış</th>
                  <th style={{ padding: '8px' }}>Yeniden Kurulum</th>
                </tr>
              </thead>
              <tbody>
                {league.map((item) => {
                  const isSelected = selectedApp === item.appId;
                  return (
                    <tr
                      key={item.appId}
                      onClick={() => setSelectedApp(item.appId)}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--bg-secondary)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>{item.appId}</td>
                      <td style={{ padding: '10px 8px' }}>{item.deviceCount.toLocaleString('tr-TR')}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {item.avgRetentionDays} gün
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>{item.totalLaunches.toLocaleString('tr-TR')}</td>
                      <td style={{ padding: '10px 8px' }}>{item.avgLaunchesPerDevice}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <RefreshCw size={12} /> {item.reinstallCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Çapraz Uygulama Korelasyonu & Popüler Kombinasyonlar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <div className="admin-panel-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <Layers size={15} />
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700 }}>
              Aynı Cihazdaki Diğer Uygulamalar {selectedApp ? `(${selectedApp})` : ''}
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px', fontSize: '11px' }}>
            <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-secondary)' }}>2+ Uygulama: <b>{buckets.twoPlus}</b></span>
            <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-secondary)' }}>3+ Uygulama: <b>{buckets.threePlus}</b></span>
            <span style={{ padding: '4px 8px', borderRadius: '6px', background: 'var(--bg-secondary)' }}>5+ Uygulama: <b>{buckets.fivePlus}</b></span>
          </div>
          {correlations.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Seçili uygulama için henüz çapraz cihaz eşleşmesi yok.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {correlations.map((c) => (
                <div key={c.coAppId} style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span><b>{c.coAppId}</b> ({c.sharedDevices} cihaz)</span>
                    <span>%{c.percentage}</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '4px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(100, c.percentage)}%`, height: '100%', background: 'var(--accent-primary, #3b82f6)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* En Popüler Kombinasyonlar & Web/R2 İndirme Özeti */}
        <div className="admin-panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 700 }}>Popüler Uygulama Paketleri</h3>
            {combinations.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Henüz çoklu uygulama paketi oluşmadı.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                {combinations.slice(0, 5).map((combo, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'var(--bg-secondary)' }}>
                    <span>{combo.apps.join(' + ')}</span>
                    <b>{combo.deviceCount} cihaz</b>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 700 }}>Web / R2 Sürüm İndirmeleri</h3>
            {dlVersions.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Henüz /dl/ üzerinden indirme kaydı yok.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                {dlVersions.slice(0, 8).map((v) => (
                  <div key={`${v.appSlug}-${v.version}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', background: 'var(--bg-secondary)' }}>
                    <span><b>{v.appSlug}</b> ({v.version})</span>
                    <b>{v.downloadCount.toLocaleString('tr-TR')}</b>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
