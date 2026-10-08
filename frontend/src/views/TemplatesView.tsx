import React, { useState, useEffect } from 'react';
import { Megaphone, DollarSign, CheckCircle, Eye, Save, Settings } from 'lucide-react';
import type { SiteTemplate } from '../types';
import { api } from '../services/api';
import { useTranslation } from '../context/I18nContext';
import { AdPreviewModal, type AdSetting } from '../components/modals/AdPreviewModal';
import { Switch } from '../components/ui/Input';

const PRESET_SIZES = [
  'RESPONSIVE',
  '728x90',
  '300x250',
  '336x280',
  '320x50',
  '300x600',
  '160x600',
  '970x90',
  '970x250',
  '320x100',
];

export const TemplatesView: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  const [announcementText, setAnnouncementText] = useState({ tr: '', en: '', ar: '' });
  const [ads, setAds] = useState<AdSetting[]>([]);
  const [selectedAd, setSelectedAd] = useState<AdSetting | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tmplRes, adsRes] = await Promise.all([
        api.getTemplates().catch(() => ({ templates: [] })),
        api.getAds().catch(() => ({ data: { ads: [] } }))
      ]);

      const list: SiteTemplate[] = tmplRes.templates || [];
      const ann = list.find((tItem) => tItem.key_name === 'announcement_bar');
      if (ann) {
        setAnnouncementText({
          tr: ann.content_tr || '',
          en: ann.content_en || '',
          ar: ann.content_ar || '',
        });
      }

      const adsList = adsRes.data?.ads || adsRes.ads || [];
      setAds(adsList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  const handleUpdateAdSetting = async (ad: AdSetting) => {
    if (!ad.id) return;
    try {
      await api.updateAd(ad.id, {
        title: ad.title,
        is_enabled: ad.is_enabled ? 1 : 0,
        ad_client: ad.ad_client,
        ad_slot: ad.ad_slot,
        preset_size: ad.preset_size,
        custom_width: ad.custom_width ? Number(ad.custom_width) : null,
        custom_height: ad.custom_height ? Number(ad.custom_height) : null,
        margin_top: Number(ad.margin_top || 16),
        margin_bottom: Number(ad.margin_bottom || 16),
        is_sticky: ad.is_sticky ? 1 : 0
      });
      setMessage(t('common.success'));
      setTimeout(() => setMessage(''), 3000);
      loadData();
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  const handleAdFieldChange = (id: number | undefined, field: keyof AdSetting, val: any) => {
    if (!id) return;
    setAds((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>{t('templates.title')}</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          {t('templates.title')} — AdSense Settings & Announcement Bar
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Announcement Bar Form */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <Megaphone size={20} color="var(--accent-amber)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{t('templates.newTemplate')}</h2>
            </div>

            <form onSubmit={handleSaveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>TR</label>
                  <input
                    type="text"
                    className="form-input"
                    value={announcementText.tr}
                    onChange={(e) => setAnnouncementText({ ...announcementText, tr: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>EN</label>
                  <input
                    type="text"
                    className="form-input"
                    value={announcementText.en}
                    onChange={(e) => setAnnouncementText({ ...announcementText, en: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>AR</label>
                  <input
                    type="text"
                    className="form-input"
                    value={announcementText.ar}
                    onChange={(e) => setAnnouncementText({ ...announcementText, ar: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Save size={16} /> {t('common.save')}
                </button>
              </div>
            </form>
          </div>

          {/* AdSense Settings Section (ADS-001 & ADS-002) */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <DollarSign size={20} color="var(--accent-emerald)" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>
                AdSense Placement & Config (ADS-001)
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {ads.map((ad) => (
                <div
                  key={ad.id || ad.slot_key}
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  {/* Slot Title & Toggle Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Settings size={18} color="var(--accent-primary)" />
                      <strong style={{ color: '#FFF', fontSize: '0.95rem' }}>{ad.title}</strong>
                      <span className="badge badge-resolved" style={{ fontSize: '0.75rem' }}>{ad.slot_key}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {ad.is_enabled ? 'Aktif' : 'Pasif'}
                      </span>
                      <Switch
                        checked={Boolean(ad.is_enabled)}
                        onChange={(e) => handleAdFieldChange(ad.id, 'is_enabled', e.target.checked)}
                        aria-label={`Toggle ${ad.title}`}
                      />
                    </div>
                  </div>

                  {/* Form Inputs Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        AdSense Client ID (ca-pub-xxx)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="ca-pub-1234567890123456"
                        value={ad.ad_client || ''}
                        onChange={(e) => handleAdFieldChange(ad.id, 'ad_client', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        AdSense Slot ID
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="1234567890"
                        value={ad.ad_slot || ''}
                        onChange={(e) => handleAdFieldChange(ad.id, 'ad_slot', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Preset Size
                      </label>
                      <select
                        className="form-select"
                        value={ad.preset_size || 'RESPONSIVE'}
                        onChange={(e) => handleAdFieldChange(ad.id, 'preset_size', e.target.value)}
                      >
                        {PRESET_SIZES.map((sz) => (
                          <option key={sz} value={sz}>{sz}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        Margin Top / Bottom (px)
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          className="form-input"
                          value={ad.margin_top ?? 16}
                          onChange={(e) => handleAdFieldChange(ad.id, 'margin_top', Number(e.target.value))}
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          className="form-input"
                          value={ad.margin_bottom ?? 16}
                          onChange={(e) => handleAdFieldChange(ad.id, 'margin_bottom', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '8px' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setSelectedAd(ad);
                        setShowPreviewModal(true);
                      }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={14} /> DRAFT Preview (ADS-002)
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdateAdSetting(ad)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Save size={14} /> {t('common.save')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AdPreviewModal Component (ADS-002) */}
      <AdPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        adSetting={selectedAd}
        onPublish={async (ad) => {
          await handleUpdateAdSetting(ad);
        }}
      />
    </div>
  );
};
