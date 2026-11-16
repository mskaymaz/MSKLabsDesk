import React, { useState, useEffect } from 'react';
import {
  Globe2,
  TrendingUp,
  RotateCw,
  Clock,
  Users,
  Eye,
  MapPin,
  ChevronDown,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { api } from '../../services/api';
import type { AnalyticsSummaryResponse } from '../../types';

export const AnalyticsSummaryCard: React.FC = () => {
  const [period, setPeriod] = useState<'realtime' | 'today' | '7d' | '30d'>('today');
  const [data, setData] = useState<AnalyticsSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeBreakdown, setActiveBreakdown] = useState<'countries' | 'cities'>('countries');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (selectedPeriod: 'realtime' | 'today' | '7d' | '30d', forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else if (!data) setLoading(true);
    setError(null);
    try {
      const res = await api.getAnalyticsSummary(selectedPeriod, forceRefresh);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Analitik verileri yüklenemedi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const periods: { key: 'realtime' | 'today' | '7d' | '30d'; label: string; icon?: React.ReactNode }[] = [
    { key: 'realtime', label: 'Anlık (Son 30 dk)', icon: <Activity size={12} style={{ color: 'var(--success, #10b981)' }} /> },
    { key: 'today', label: 'Bugün' },
    { key: '7d', label: 'Son 7 Gün' },
    { key: '30d', label: 'Son 30 Gün' },
  ];

  return (
    <div
      className="admin-panel-card"
      style={{
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Kart Başlığı ve Yenileme */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, var(--accent-primary, #3b82f6) 0%, var(--accent-secondary, #6366f1) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <TrendingUp size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Ziyaretçi & Coğrafi Analitik Özeti
              </h3>
              {period === 'realtime' && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--success, #10b981)',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--success, #10b981)' }}></span>
                  Canlı
                </span>
              )}
            </div>
            {data?.lastUpdated && (
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} /> Son Güncelleme: {data.lastUpdated}
              </span>
            )}
          </div>
        </div>

        {/* Aksiyonlar: Periyot Filtreleri + Yenile Butonu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '6px',
              padding: '2px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {periods.map((p) => {
              const active = period === p.key;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPeriod(p.key)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '11px',
                    fontWeight: active ? 600 : 500,
                    backgroundColor: active ? 'var(--accent-primary)' : 'transparent',
                    color: active ? '#fff' : 'var(--text-secondary)',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.icon}
                  {p.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="admin-btn admin-btn-sm"
            onClick={() => fetchAnalytics(period, true)}
            disabled={refreshing}
            title="Analitik Verilerini Yenile"
            style={{
              padding: '5px 8px',
              fontSize: '11px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RotateCw size={12} className={refreshing ? 'spin-animation' : ''} />
            <span>Yenile</span>
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger, #ef4444)', borderRadius: '6px', fontSize: '12px' }}>
          {error}
        </div>
      )}

      {/* 4'lü Sayısal Özet Metrikleri */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
        <div
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-md, 8px)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Users size={12} style={{ color: 'var(--accent-primary, #3b82f6)' }} />
            <span>{period === 'realtime' ? 'Anlık Kullanıcı' : 'Ziyaretçi Sayısı'}</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {loading && !data ? '...' : (data?.activeUsers ?? 0).toLocaleString('tr-TR')}
          </div>
        </div>

        <div
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-md, 8px)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Eye size={12} style={{ color: 'var(--success, #10b981)' }} />
            <span>Sayfa Görüntüleme</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {loading && !data ? '...' : (data?.pageViews ?? 0).toLocaleString('tr-TR')}
          </div>
        </div>

        <div
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-md, 8px)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <Globe2 size={12} style={{ color: 'var(--accent-amber, #f59e0b)' }} />
            <span>Farklı Ülke</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {loading && !data ? '...' : (data?.totalCountries ?? 0)}
          </div>
        </div>

        <div
          style={{
            padding: '8px 10px',
            borderRadius: 'var(--radius-md, 8px)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
            <MapPin size={12} style={{ color: 'var(--accent-secondary, #a855f7)' }} />
            <span>Farklı Şehir</span>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {loading && !data ? '...' : (data?.totalCities ?? 0)}
          </div>
        </div>
      </div>

      {/* Ayrıntılı Kırılım (Ülkeler & Şehirler Akordeon Listesi) */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div
            onClick={() => setIsExpanded(prev => !prev)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', userSelect: 'none' }}
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Ayrıntılı Dağılım Listesi
            </span>
          </div>

          {isExpanded && (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setActiveBreakdown('countries')}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: activeBreakdown === 'countries' ? 'var(--accent-primary, #3b82f6)' : 'var(--bg-secondary)',
                  color: activeBreakdown === 'countries' ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: activeBreakdown === 'countries' ? 600 : 400,
                }}
              >
                Ülkeler ({data?.countries.length ?? 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveBreakdown('cities')}
                style={{
                  padding: '3px 8px',
                  fontSize: '11px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: activeBreakdown === 'cities' ? 'var(--accent-secondary, #a855f7)' : 'var(--bg-secondary)',
                  color: activeBreakdown === 'cities' ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: activeBreakdown === 'cities' ? 600 : 400,
                }}
              >
                Şehirler ({data?.cities.length ?? 0})
              </button>
            </div>
          )}
        </div>

        {isExpanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
            {(activeBreakdown === 'countries' ? (data?.countries || []) : (data?.cities || [])).map((item, idx) => {
              const maxUsers = Math.max(1, (activeBreakdown === 'countries' ? data?.countries[0]?.users : data?.cities[0]?.users) || 1);
              const barWidth = Math.min(100, Math.round((item.users / maxUsers) * 100));
              const barColor = activeBreakdown === 'countries' ? 'var(--accent-primary, #3b82f6)' : 'var(--accent-secondary, #a855f7)';

              return (
                <div
                  key={`${item.name}_${idx}`}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm, 4px)',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{item.users.toLocaleString('tr-TR')}</strong> kişi ({item.percentage}%)
                    </span>
                  </div>
                  {/* Progress bar track */}
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: '100%',
                        backgroundColor: barColor,
                        borderRadius: '2px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
