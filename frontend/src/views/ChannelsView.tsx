import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle } from 'lucide-react';
import type { BlogChannel } from '../types';
import { api } from '../services/api';

export const ChannelsView: React.FC = () => {
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
      setMessage('Blog Türü Başarıyla Oluşturuldu!');
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
      });
      loadChannels();
    } catch (err: any) {
      alert(err.message || 'Hata oluştu');
    }
  };

  const handleDeleteChannel = async (id: string) => {
    if (!confirm('Bu blog kanalını ve altındaki kategorileri silmek istediğinize emin misiniz?')) return;
    try {
      await api.deleteChannel(id);
      loadChannels();
    } catch (err: any) {
      alert(err.message || 'Silinemedi');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>Dinamik Blog Türleri & Kanalları</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Sitede yayınlanacak yeni blog kanallarını (BİZCE, HİKAYELER, ŞİİRLER vb.) 3 dilde yönetin.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            color: '#FFF',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '10px 18px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Plus size={18} />
          <span>Yeni Blog Türü Aç</span>
        </button>
      </div>

      {message && (
        <div style={{ padding: '12px 16px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} />
          <span>{message}</span>
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Kanallar yükleniyor...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {channels.map((ch) => (
            <div key={ch.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '8px', color: 'var(--accent-primary)' }}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>{ch.name_tr}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>/blog/{ch.slug}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteChannel(ch.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {ch.description_tr || 'Açıklama girilmedi.'}
                </p>

                <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>🇬🇧 {ch.name_en || 'Çeviri Yok'}</span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', color: 'var(--text-muted)' }}>🇸🇦 {ch.name_ar || 'لا يوجد'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', background: '#0F1522' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF', marginBottom: '16px' }}>Sırfıdan Yeni Blog Türü Oluştur</h2>

            <form onSubmit={handleCreateChannel} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Blog Adı (Türkçe - Zorunlu)</label>
                <input
                  type="text"
                  placeholder="Örn: Hikayeler, Şiirler, Gezi Notları"
                  value={formData.name_tr}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '-');
                    setFormData({ ...formData, name_tr: val, slug: autoSlug });
                  }}
                  required
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: 'var(--accent-cyan)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>İngilizce Adı (EN)</label>
                  <input
                    type="text"
                    placeholder="Örn: Stories"
                    value={formData.name_en}
                    onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Arapça Adı (AR)</label>
                  <input
                    type="text"
                    placeholder="Örn: قصص"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Kanal Açıklaması (TR)</label>
                <textarea
                  rows={2}
                  value={formData.description_tr}
                  onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}>İptal</button>
                <button type="submit" style={{ padding: '8px 16px', background: 'var(--accent-primary)', border: 'none', color: '#FFF', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>Oluştur</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
