import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle, Video, Eye, EyeOff } from 'lucide-react';
import type { BlogChannel } from '../types';
import { api } from '../services/api';
import { useTranslation } from '../context/I18nContext';

export const ChannelsView: React.FC = () => {
  const { t } = useTranslation();
  const [channels, setChannels] = useState<BlogChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [formData, setFormData] = useState({
    slug: '',
    name_tr: '',
    name_en: '',
    name_ar: '',
    description_tr: '',
    description_en: '',
    description_ar: '',
    icon: 'book-open',
    display_order: 0,
    is_active: 1,
  });

  const loadChannels = async () => {
    setLoading(true);
    try {
      const res = await api.getChannels();
      setChannels(res.channels || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChannels();
  }, []);

  const handleCreateChannel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_tr || !formData.slug) return;

    try {
      await api.createChannel(formData);
      setMessage(t('common.success'));
      setShowModal(false);
      setFormData({
        slug: '',
        name_tr: '',
        name_en: '',
        name_ar: '',
        description_tr: '',
        description_en: '',
        description_ar: '',
        icon: 'book-open',
        display_order: 0,
        is_active: 1,
      });
      loadChannels();
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  const handleDeleteChannel = async (id: string) => {
    if (!confirm(t('common.confirm'))) return;
    try {
      await api.deleteChannel(id);
      loadChannels();
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  const handleToggleActive = async (ch: BlogChannel) => {
    const isCurrentlyActive = ch.is_active === 1 || ch.is_active === true;
    const nextState = !isCurrentlyActive;
    try {
      await api.updateChannel(ch.id, { is_active: nextState ? 1 : 0 });
      setChannels((prev) =>
        prev.map((c) => (c.id === ch.id ? { ...c, is_active: nextState ? 1 : 0 } : c))
      );
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="admin-page-title">{t('channels.title')}</h1>
          <p className="admin-page-desc">Blog kategorilerini, dillerini ve görünürlük durumlarını yönetin</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="admin-btn admin-btn-primary admin-btn-md"
        >
          <Plus size={16} />
          <span>{t('channels.addChannel')}</span>
        </button>
      </div>

      {message && (
        <div style={{ padding: '10px 14px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
          <CheckCircle size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {channels.map((ch) => {
            const isActive = ch.is_active === 1 || ch.is_active === true;
            return (
              <div key={ch.id} className="admin-list-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        padding: '7px',
                        background: ch.icon === 'video' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                        borderRadius: '6px',
                        color: ch.icon === 'video' ? 'var(--accent-rose)' : 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {ch.icon === 'video' ? <Video size={18} /> : <BookOpen size={18} />}
                      </div>
                      <div>
                        <h3 className="admin-card-title">{ch.name_tr}</h3>
                        <span className="admin-link-subtle">/blog/{ch.slug}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => handleToggleActive(ch)}
                        className={`admin-btn admin-btn-sm ${isActive ? 'admin-btn-success' : 'admin-btn-warning'}`}
                        title={isActive ? 'Kanalı Pasife Al' : 'Kanalı Aktife Al'}
                      >
                        {isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        {isActive ? 'Aktif' : 'Pasif'}
                      </button>
                      <button
                        onClick={() => handleDeleteChannel(ch.id)}
                        className="admin-btn admin-btn-sm admin-btn-danger"
                        title="Kanalı Sil"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <p className="admin-card-desc line-clamp-2">
                    {ch.description_tr || 'Açıklama girilmedi.'}
                  </p>

                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <span className="admin-badge admin-badge-index">EN: {ch.name_en || 'İngilizce'}</span>
                    <span className="admin-badge admin-badge-index">AR: {ch.name_ar || 'Arapça'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="admin-list-card" style={{ width: '100%', maxWidth: '500px', background: 'var(--bg-card)', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h2 className="admin-card-title" style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{t('channels.addChannel')}</h2>

            <form onSubmit={handleCreateChannel} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label className="form-label">{t('channels.channelName')} (TR)</label>
                <input
                  type="text"
                  placeholder="Kanal Adı"
                  value={formData.name_tr}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '-');
                    setFormData({ ...formData, name_tr: val, slug: autoSlug });
                  }}
                  required
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label className="form-label">{t('channels.slug')}</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="form-input"
                  style={{ width: '100%', color: 'var(--accent-cyan)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">{t('channels.channelName')} (EN)</label>
                  <input
                    type="text"
                    placeholder="English Name"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label className="form-label">{t('channels.channelName')} (AR)</label>
                  <input
                    type="text"
                    placeholder="Arabic Name"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Açıklama (TR)</label>
                <textarea
                  rows={2}
                  value={formData.description_tr}
                  onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label">İkon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="form-select"
                    style={{ width: '100%' }}
                  >
                    <option value="book-open">Yazı / Kitap (BookOpen)</option>
                    <option value="video">Video / Vlog (Video)</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Başlangıç Durumu</label>
                  <select
                    value={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: parseInt(e.target.value) })}
                    className="form-select"
                    style={{ width: '100%' }}
                  >
                    <option value={1}>Aktif (Yayında)</option>
                    <option value={0}>Pasif (Gizli)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="admin-btn admin-btn-refresh admin-btn-md">{t('common.cancel')}</button>
                <button type="submit" className="admin-btn admin-btn-primary admin-btn-md">{t('common.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
