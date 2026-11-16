import React, { useState, useEffect } from 'react';
import {
  Inbox, RotateCw, MessageSquare, Mail, AlertTriangle, Sparkles, Heart,
  Lightbulb, Archive, HelpCircle, Shield, ChevronRight, ChevronDown, BookOpen, Clock, ExternalLink, Globe,
} from 'lucide-react';
import { api } from '../services/api';
import type { InboxSummaryResponse } from '../types';

const S = {
  card: { backgroundColor: 'var(--card-bg, #1e293b)', borderRadius: '10px', border: '1px solid var(--border-color, #334155)', overflow: 'hidden' } as React.CSSProperties,
  head: { padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' as const },
  row: { padding: '7px 10px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '11px', transition: 'background-color 0.15s' } as React.CSSProperties,
  btn: (bg: string, color = '#fff'): React.CSSProperties => ({ padding: '3px 6px', backgroundColor: bg, color, border: 'none', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }),
};

export const InboxMiniStation: React.FC = () => {
  const [data, setData] = useState<InboxSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingModule, setRefreshingModule] = useState<'all' | 'blog' | 'support' | 'email' | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [openingBridge, setOpeningBridge] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<{ blog: boolean; support: boolean; email: boolean }>({ blog: true, support: true, email: true });

  const getFormattedTime = () => new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const fetchSummary = async (module: 'all' | 'blog' | 'support' | 'email' = 'all') => {
    setRefreshingModule(module);
    if (module === 'all' && !data) setLoading(true);
    setError(null);
    try {
      const res = await api.getInboxSummary();
      if (module === 'all' || !data) {
        setData(res);
      } else if (module === 'blog') {
        setData(prev => prev ? { ...prev, blog_channels: res.blog_channels, totals: { ...prev.totals, blog_pending: res.totals.blog_pending, blog_unverified: res.totals.blog_unverified, all_actionable: res.totals.blog_pending + prev.totals.support_new + prev.totals.support_urgent + prev.totals.email_new } } : res);
      } else if (module === 'support') {
        setData(prev => prev ? { ...prev, support_categories: res.support_categories, totals: { ...prev.totals, support_new: res.totals.support_new, support_in_progress: res.totals.support_in_progress, support_urgent: res.totals.support_urgent, all_actionable: prev.totals.blog_pending + res.totals.support_new + res.totals.support_urgent + prev.totals.email_new } } : res);
      } else if (module === 'email') {
        setData(prev => prev ? { ...prev, email_boxes: res.email_boxes, totals: { ...prev.totals, email_new: res.totals.email_new, all_actionable: prev.totals.blog_pending + prev.totals.support_new + prev.totals.support_urgent + res.totals.email_new } } : res);
      }
      setLastUpdated(getFormattedTime());
    } catch (err: any) {
      setError(err.message || 'Özet verileri alınamadı.');
    } finally {
      setLoading(false);
      setRefreshingModule(null);
    }
  };

  useEffect(() => { fetchSummary('all'); }, []);

  const openPanelViaBridge = async (targetTab: string, targetParams?: Record<string, any>, rowKey?: string) => {
    if (openingBridge) return;
    setOpeningBridge(rowKey || targetTab);
    try {
      const res = await api.createBridgeTicket(targetTab, targetParams);
      if (res.bridge_url) window.open(res.bridge_url, '_blank');
    } catch (err: any) {
      alert(err.message || 'Panel köprüsü açılamadı.');
    } finally {
      setOpeningBridge(null);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'alert-triangle': return <AlertTriangle size={14} style={{ color: '#ef4444' }} />;
      case 'sparkles': return <Sparkles size={14} style={{ color: '#6366f1' }} />;
      case 'heart': return <Heart size={14} style={{ color: '#10b981' }} />;
      case 'lightbulb': return <Lightbulb size={14} style={{ color: '#f59e0b' }} />;
      case 'archive': return <Archive size={14} style={{ color: '#94a3b8' }} />;
      case 'shield': return <Shield size={14} style={{ color: '#3b82f6' }} />;
      default: return <HelpCircle size={14} style={{ color: '#64748b' }} />;
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--bg-main, #0f172a)', color: 'var(--text-primary, #f8fafc)', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box' }}>
      {/* Mini Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--card-bg, #1e293b)', borderRadius: '10px', border: '1px solid var(--border-color, #334155)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Inbox size={16} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              MSK Labs İstasyon
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            </div>
            {lastUpdated && (
              <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} /> Son: {lastUpdated}
              </div>
            )}
          </div>
        </div>

        <button onClick={() => fetchSummary('all')} disabled={refreshingModule === 'all'} title="Tümünü Yenile" style={S.btn('#3b82f6')}>
          <RotateCw size={12} className={refreshingModule === 'all' ? 'spin-animation' : ''} />
          Yenile
        </button>
      </div>

      {error && <div style={{ padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', fontSize: '12px' }}>{error}</div>}

      {loading && !data ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '12px' }}>İletişim verileri yükleniyor...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Modül 1: Blog Yorumları */}
          <div style={S.card}>
            <div onClick={() => setExpanded(p => ({ ...p, blog: !p.blog }))} style={S.head}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {expanded.blog ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <MessageSquare size={14} style={{ color: '#3b82f6' }} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Blog Yorumları</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#334155', color: '#cbd5e1' }}>
                  O: {data?.totals.blog_pending ?? 0} &nbsp;|&nbsp; D: {data?.totals.blog_unverified ?? 0}
                </span>
                <button onClick={(e) => { e.stopPropagation(); fetchSummary('blog'); }} disabled={refreshingModule === 'blog'} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}>
                  <RotateCw size={11} className={refreshingModule === 'blog' ? 'spin-animation' : ''} />
                </button>
              </div>
            </div>

            {expanded.blog && (
              <div style={{ borderTop: '1px solid var(--border-color, #334155)', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(data?.blog_channels || []).map((ch) => {
                  const rowKey = `blog_${ch.slug}`;
                  const isOpening = openingBridge === rowKey;
                  return (
                    <div key={ch.slug} onClick={() => openPanelViaBridge('comments', { channel: ch.slug, status: 'pending' }, rowKey)} style={S.row}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BookOpen size={13} style={{ color: '#94a3b8' }} />
                        <span style={{ fontWeight: 500 }}>{ch.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '10px' }}>
                          O: <strong style={{ color: ch.pending > 0 ? '#f59e0b' : '#cbd5e1' }}>{ch.pending}</strong> &nbsp;|&nbsp; D: <strong style={{ color: ch.unverified > 0 ? '#64748b' : '#cbd5e1' }}>{ch.unverified}</strong>
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button onClick={(e) => { e.stopPropagation(); openPanelViaBridge('comments', { channel: ch.slug, status: 'pending' }, rowKey); }} disabled={isOpening} title="Panelde Aç (Şifresiz)" style={S.btn('#3b82f6')}>
                            <ExternalLink size={10} /> Panel
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); window.open(`https://msklabs.org/blog/${ch.slug}`, '_blank'); }} title="Web Sayfasını Aç" style={S.btn('#334155', '#cbd5e1')}>
                            <Globe size={10} /> Web
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modül 2: Destek Talepleri */}
          <div style={S.card}>
            <div onClick={() => setExpanded(p => ({ ...p, support: !p.support }))} style={S.head}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {expanded.support ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <HelpCircle size={14} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Destek Talepleri</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#334155', color: '#cbd5e1' }}>
                  Y: {data?.totals.support_new ?? 0} &nbsp;|&nbsp; İ: {data?.totals.support_in_progress ?? 0}
                </span>
                <button onClick={(e) => { e.stopPropagation(); fetchSummary('support'); }} disabled={refreshingModule === 'support'} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}>
                  <RotateCw size={11} className={refreshingModule === 'support' ? 'spin-animation' : ''} />
                </button>
              </div>
            </div>

            {expanded.support && (
              <div style={{ borderTop: '1px solid var(--border-color, #334155)', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(data?.support_categories || []).map((cat) => {
                  const rowKey = `support_${cat.key}`;
                  const isOpening = openingBridge === rowKey;
                  return (
                    <div key={cat.key} onClick={() => openPanelViaBridge('tickets', { category: cat.key, status: 'new' }, rowKey)} style={S.row}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getCategoryIcon(cat.icon)}
                        <span style={{ fontWeight: 500 }}>{cat.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '10px' }}>
                          Y: <strong style={{ color: cat.new > 0 ? '#10b981' : '#cbd5e1' }}>{cat.new}</strong> &nbsp;|&nbsp; İ: <strong style={{ color: cat.in_progress > 0 ? '#3b82f6' : '#cbd5e1' }}>{cat.in_progress}</strong>
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); openPanelViaBridge('tickets', { category: cat.key, status: 'new' }, rowKey); }} disabled={isOpening} title="Panelde Aç (Şifresiz)" style={S.btn('#10b981')}>
                          <ExternalLink size={10} /> Panel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Modül 3: E-Posta Kutusu */}
          <div style={S.card}>
            <div onClick={() => setExpanded(p => ({ ...p, email: !p.email }))} style={S.head}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {expanded.email ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Mail size={14} style={{ color: '#a855f7' }} />
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Kurumsal E-Posta</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#334155', color: '#cbd5e1' }}>
                  Y: {data?.totals.email_new ?? 0}
                </span>
                <button onClick={(e) => { e.stopPropagation(); fetchSummary('email'); }} disabled={refreshingModule === 'email'} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}>
                  <RotateCw size={11} className={refreshingModule === 'email' ? 'spin-animation' : ''} />
                </button>
              </div>
            </div>

            {expanded.email && (
              <div style={{ borderTop: '1px solid var(--border-color, #334155)', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(data?.email_boxes || []).map((box) => {
                  const rowKey = `email_${box.key}`;
                  const isOpening = openingBridge === rowKey;
                  return (
                    <div key={box.key} onClick={() => openPanelViaBridge('tickets', { category: 'email', status: 'new' }, rowKey)} style={S.row}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} style={{ color: '#a855f7' }} />
                        <span style={{ fontWeight: 500 }}>{box.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '10px' }}>
                          Y: <strong style={{ color: box.new > 0 ? '#a855f7' : '#cbd5e1' }}>{box.new}</strong>
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); openPanelViaBridge('tickets', { category: 'email', status: 'new' }, rowKey); }} disabled={isOpening} title="Panelde Aç (Şifresiz)" style={S.btn('#a855f7')}>
                          <ExternalLink size={10} /> Panel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
