import React, { useState, useEffect } from 'react';
import { Megaphone, DollarSign, CheckCircle } from 'lucide-react';
import type { SiteTemplate } from '../types';
import { api } from '../services/api';
import { useTranslation } from '../context/I18nContext';

export const TemplatesView: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  const [announcementText, setAnnouncementText] = useState({ tr: '', en: '', ar: '' });
  const [adTopText, setAdTopText] = useState({ tr: '', en: '', ar: '' });

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await api.getTemplates();
      const list: SiteTemplate[] = res.templates || [];

      const ann = list.find((tItem) => tItem.key_name === 'announcement_bar');
      if (ann) {
        setAnnouncementText({
          tr: ann.content_tr || '',
          en: ann.content_en || '',
          ar: ann.content_ar || '',
        });
      }

      const ad = list.find((tItem) => tItem.key_name === 'ad_banner_top');
      if (ad) {
        setAdTopText({
          tr: ad.content_tr || '',
          en: ad.content_en || '',
          ar: ad.content_ar || '',
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateTemplate({
        key_name: 'announcement_bar',
        content_tr: announcementText.tr,
        content_en: announcementText.en,
        content_ar: announcementText.ar,
        is_active: true,
      });
      setMessage(t('common.success'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateTemplate({
        key_name: 'ad_banner_top',
        content_tr: adTopText.tr,
        content_en: adTopText.en,
        content_ar: adTopText.ar,
        is_active: true,
      });
      setMessage(t('common.success'));
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>{t('templates.title')}</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          {t('templates.title')}
        </p>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
          {/* Announcement Bar Form */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Megaphone size={20} color="var(--accent-amber)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{t('templates.newTemplate')}</h2>
            </div>

            <form onSubmit={handleSaveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>TR</label>
                <input
                  type="text"
                  value={announcementText.tr}
                  onChange={(e) => setAnnouncementText({ ...announcementText, tr: e.target.value })}
                  style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>EN</label>
                <input
                  type="text"
                  value={announcementText.en}
                  onChange={(e) => setAnnouncementText({ ...announcementText, en: e.target.value })}
                  style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>AR</label>
                <input
                  type="text"
                  value={announcementText.ar}
                  onChange={(e) => setAnnouncementText({ ...announcementText, ar: e.target.value })}
                  style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <button type="submit" style={{ marginTop: '8px', padding: '10px', background: 'var(--accent-primary)', border: 'none', color: '#FFF', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                {t('common.save')}
              </button>
            </form>
          </div>

          {/* Ad Top Form */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <DollarSign size={20} color="var(--accent-emerald)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{t('templates.title')}</h2>
            </div>

            <form onSubmit={handleSaveAd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>TR HTML / Code</label>
                <textarea
                  rows={3}
                  value={adTopText.tr}
                  onChange={(e) => setAdTopText({ ...adTopText, tr: e.target.value })}
                  style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <button type="submit" style={{ marginTop: '8px', padding: '10px', background: 'var(--accent-emerald)', border: 'none', color: '#FFF', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>
                {t('common.save')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
