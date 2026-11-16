import React, { useState, useEffect } from 'react';
import {
  Inbox, RotateCw, MessageSquare, Mail, AlertTriangle, Sparkles, Heart,
  Lightbulb, Archive, HelpCircle, Shield, ChevronRight, ChevronDown, BookOpen, Clock, ExternalLink, Globe,
} from 'lucide-react';
import { api } from '../services/api';
import type { InboxSummaryResponse } from '../types';

const S = {
  card: { backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg, 10px)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' } as React.CSSProperties,
  head: { padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' as const },
  row: { padding: '7px 10px', borderRadius: 'var(--radius-md, 6px)', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontSize: '11px', transition: 'background-color 0.15s' } as React.CSSProperties,
  badge: { fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'var(--border-subtle)', color: 'var(--text-secondary)' } as React.CSSProperties,
  btn: (bg: string, color = '#fff', border = 'none'): React.CSSProperties => ({ padding: '3px 6px', backgroundColor: bg, color, border, borderRadius: '4px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }),
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
      case 'alert-triangle': return <AlertTriangle size={14} style={{ color: 'var(--danger, #ef4444)' }} />;
      case 'sparkles': return <Sparkles size={14} style={{ color: 'var(--accent-secondary, #6366f1)' }} />;
      case 'heart': return <Heart size={14} style={{ color: 'var(--success, #10b981)' }} />;
      case 'lightbulb': return <Lightbulb size={14} style={{ color: 'var(--accent-amber, #f59e0b)' }} />;
      case 'archive': return <Archive size={14} style={{ color: 'var(--text-muted)' }} />;
      case 'shield': return <Shield size={14} style={{ color: 'var(--accent-primary, #3b82f6)' }} />;
      default: return <HelpCircle size={14} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box' }}>
      {/* Mini Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg, 10px)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            <Inbox size={16} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              MSK Labs İstasyon
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--success, #10b981)' }}></span>
            </div>
            {lastUpdated && (
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={10} /> Son: {lastUpdated}
              </div>
            )}
          </div>
        </div>

        <button onClick={() => fetchSummary('all')} disabled={refreshingModule === 'all'} title="Tümünü Yenile" style={S.btn('var(--accent-primary)')}>
          <RotateCw size={12} className={refreshingModule === 'all' ? 'spin-animation' : ''} />
          Yenile
        </button>
      </div>

      {error && <div style={{ padding: '8px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger, #ef4444)', borderRadius: '8px', fontSize: '12px' }}>{error}</div>}

      {loading && !data ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '12px' }}>İletişim verileri yükleniyor...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Modül 1: Blog Yorumları */}
          <div style={S.card}>
            <div onClick={() => setExpanded(p => ({ ...p, blog: !p.blog }))} style={S.head}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {expanded.blog ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <MessageSquare size={14} style={{ color: 'var(--accent-primary, #3b82f6)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Blog Yorumları</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={S.badge}>
                  O: {data?.totals.blog_pending ?? 0} &nbsp;|&nbsp; D: {data?.totals.blog_unverified ?? 0}
                </span>
                <button onClick={(e) => { e.stopPropagation(); fetchSummary('blog'); }} disabled={refreshingModule === 'blog'} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}>
                  <RotateCw size={11} className={refreshingModule === 'blog' ? 'spin-animation' : ''} />
                </button>
              </div>
            </div>

            {expanded.blog && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(data?.blog_channels || []).map((ch) => {
                  const rowKey = `blog_${ch.slug}`;
                  const isOpening = openingBridge === rowKey;
                  return (
                    <div key={ch.slug} onClick={() => openPanelViaBridge('comments', { channel: ch.slug, status: 'pending' }, rowKey)} style={S.row}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BookOpen size={13} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{ch.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                          O: <strong style={{ color: ch.pending > 0 ? 'var(--accent-amber, #f59e0b)' : 'var(--text-primary)' }}>{ch.pending}</strong> &nbsp;|&nbsp; D: <strong style={{ color: ch.unverified > 0 ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{ch.unverified}</strong>
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button onClick={(e) => { e.stopPropagation(); openPanelViaBridge('comments', { channel: ch.slug, status: 'pending' }, rowKey); }} disabled={isOpening} title="Panelde Aç (Şifresiz)" style={S.btn('var(--accent-primary, #3b82f6)')}>
                            <ExternalLink size={10} /> Panel
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); window.open(`https://msklabs.org/blog/${ch.slug}`, '_blank'); }} title="Web Sayfasını Aç" style={S.btn('var(--bg-card)', 'var(--text-primary)', '1px solid var(--border-subtle)')}>
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
                <HelpCircle size={14} style={{ color: 'var(--success, #10b981)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Destek Talepleri</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={S.badge}>
                  Y: {data?.totals.support_new ?? 0} &nbsp;|&nbsp; İ: {data?.totals.support_in_progress ?? 0}
                </span>
                <button onClick={(e) => { e.stopPropagation(); fetchSummary('support'); }} disabled={refreshingModule === 'support'} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}>
                  <RotateCw size={11} className={refreshingModule === 'support' ? 'spin-animation' : ''} />
                </button>
              </div>
            </div>

            {expanded.support && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(data?.support_categories || []).map((cat) => {
                  const rowKey = `support_${cat.key}`;
                  const isOpening = openingBridge === rowKey;
                  return (
                    <div key={cat.key} onClick={() => openPanelViaBridge('tickets', { category: cat.key, status: 'new' }, rowKey)} style={S.row}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {getCategoryIcon(cat.icon)}
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{cat.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                          Y: <strong style={{ color: cat.new > 0 ? 'var(--success, #10b981)' : 'var(--text-primary)' }}>{cat.new}</strong> &nbsp;|&nbsp; İ: <strong style={{ color: cat.in_progress > 0 ? 'var(--accent-primary, #3b82f6)' : 'var(--text-primary)' }}>{cat.in_progress}</strong>
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); openPanelViaBridge('tickets', { category: cat.key, status: 'new' }, rowKey); }} disabled={isOpening} title="Panelde Aç (Şifresiz)" style={S.btn('var(--success, #10b981)')}>
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
                <Mail size={14} style={{ color: 'var(--accent-secondary, #a855f7)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>Kurumsal E-Posta</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={S.badge}>
                  Y: {data?.totals.email_new ?? 0}
                </span>
                <button onClick={(e) => { e.stopPropagation(); fetchSummary('email'); }} disabled={refreshingModule === 'email'} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}>
                  <RotateCw size={11} className={refreshingModule === 'email' ? 'spin-animation' : ''} />
                </button>
              </div>
            </div>

            {expanded.email && (
              <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {(data?.email_boxes || []).map((box) => {
                  const rowKey = `email_${box.key}`;
                  const isOpening = openingBridge === rowKey;
                  return (
                    <div key={box.key} onClick={() => openPanelViaBridge('tickets', { category: 'email', status: 'new' }, rowKey)} style={S.row}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} style={{ color: 'var(--accent-secondary, #a855f7)' }} />
                        <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{box.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                          Y: <strong style={{ color: box.new > 0 ? 'var(--accent-secondary, #a855f7)' : 'var(--text-primary)' }}>{box.new}</strong>
                        </span>
                        <button onClick={(e) => { e.stopPropagation(); openPanelViaBridge('tickets', { category: 'email', status: 'new' }, rowKey); }} disabled={isOpening} title="Panelde Aç (Şifresiz)" style={S.btn('var(--accent-secondary, #a855f7)')}>
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
