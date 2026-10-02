import React, { useState, useEffect } from 'react';
import { Megaphone, DollarSign, CheckCircle } from 'lucide-react';
import type { SiteTemplate } from '../types';
import { api } from '../services/api';

export const TemplatesView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  const [announcementText, setAnnouncementText] = useState({ tr: '', en: '', ar: '' });
  const [adTopText, setAdTopText] = useState({ tr: '', en: '', ar: '' });

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const res = await api.getTemplates();
      const list: SiteTemplate[] = res.templates || [];

      const ann = list.find((t) => t.key_name === 'announcement_bar');
      if (ann) {
        setAnnouncementText({
          tr: ann.content_tr || '',
          en: ann.content_en || '',
          ar: ann.content_ar || '',
        });
      }


      const ad = list.find((t) => t.key_name === 'ad_banner_top');
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
      setMessage('Header Duyuru Bandı Kaydedildi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Hata oluştu');
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
      setMessage('Üst Reklam Alanı Kaydedildi!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Hata oluştu');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>Şablon & Reklam Alanları Yönetimi</h1>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          Web sitenizin üst duyuru bantlarını, reklam kodlarını ve 3 dilli kurumsal alanlarını canlıda yönetin.
        </p>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Şablonlar yükleniyor...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Announcement Bar Form */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.15)', borderRadius: '8px', color: 'var(--accent-amber)' }}>
                <Megaphone size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>Header Duyuru Bandı (Announcement Bar)</h3>
            </div>

            <form onSubmit={handleSaveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Türkçe Duyuru Metni (TR)</label>
                <input type="text" placeholder="Örn: 🎉 Yeni mobil uygulamamız yayınlandı!" value={announcementText.tr} onChange={(e) => setAnnouncementText({ ...announcementText, tr: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>İngilizce Duyuru Metni (EN)</label>
                <input type="text" placeholder="Örn: 🎉 Our new mobile app is live!" value={announcementText.en} onChange={(e) => setAnnouncementText({ ...announcementText, en: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }} />
              </div>
              <div dir="rtl">
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Arapça Duyuru Metni (AR)</label>
                <input type="text" placeholder="مثال: 🎉 تم إطلاق تطبيقنا الجديد!" value={announcementText.ar} onChange={(e) => setAnnouncementText({ ...announcementText, ar: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF', fontFamily: 'Cairo' }} />
              </div>
              <button type="submit" style={{ padding: '10px', background: 'var(--accent-primary)', border: 'none', color: '#FFF', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>Duyuru Bandını Kaydet</button>
            </form>
          </div>

          {/* Ad Banner Top Form */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', color: 'var(--accent-emerald)' }}>
                <DollarSign size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>Üst Reklam Alanı (Ad Banner Top)</h3>
            </div>

            <form onSubmit={handleSaveAd} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>AdSense / HTML Reklam Kodu (TR)</label>
                <textarea rows={4} placeholder="<script>...</script> veya <img> reklam kodu" value={adTopText.tr} onChange={(e) => setAdTopText({ ...adTopText, tr: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF', fontFamily: 'monospace' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>AdSense / HTML Reklam Kodu (EN)</label>
                <textarea rows={4} placeholder="English Ad Banner HTML" value={adTopText.en} onChange={(e) => setAdTopText({ ...adTopText, en: e.target.value })} style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF', fontFamily: 'monospace' }} />
              </div>
              <button type="submit" style={{ padding: '10px', background: 'var(--accent-emerald)', border: 'none', color: '#FFF', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', marginTop: '8px' }}>Reklam Alanını Kaydet</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
