import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Sparkles, Eye } from 'lucide-react';
import type { BlogPost, BlogChannel } from '../types';
import { api } from '../services/api';

export const PostsView: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [channels, setChannels] = useState<BlogChannel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [aiTranslating, setAiTranslating] = useState<boolean>(false);
  const [showEditor, setShowEditor] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'ar'>('tr');

  const [formData, setFormData] = useState({
    channel_id: '',
    slug: '',
    title_tr: '',
    title_en: '',
    title_ar: '',
    content_tr: '',
    content_en: '',
    content_ar: '',
    summary_tr: '',
    summary_en: '',
    summary_ar: '',
    cover_image: '',
    meta_keywords: '',
    status: 'draft' as 'draft' | 'published',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([api.getPosts(), api.getChannels()]);
      setPosts(pRes.posts || []);
      setChannels(cRes.channels || []);
      if (cRes.channels && cRes.channels.length > 0 && !formData.channel_id) {
        setFormData((prev) => ({ ...prev, channel_id: cRes.channels[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAiTranslate = async () => {
    if (!formData.title_tr || !formData.content_tr) {
      alert('Lütfen önce Türkçe başlık ve içerik alanlarını doldurun!');
      return;
    }

    setAiTranslating(true);
    try {
      const res = await api.translatePostAI({
        title_tr: formData.title_tr,
        content_tr: formData.content_tr,
        summary_tr: formData.summary_tr,
      });

      if (res.success && res.translation) {
        const t = res.translation;
        setFormData((prev) => ({
          ...prev,
          title_en: t.title_en || prev.title_en,
          title_ar: t.title_ar || prev.title_ar,
          summary_tr: t.summary_tr || prev.summary_tr,
          summary_en: t.summary_en || prev.summary_en,
          summary_ar: t.summary_ar || prev.summary_ar,
          content_en: t.content_en || prev.content_en,
          content_ar: t.content_ar || prev.content_ar,
          meta_keywords: t.meta_keywords || prev.meta_keywords,
        }));
        alert('✨ Gemini AI ile İngilizce ve Arapça çevirileri ile SEO özetleri başarıyla üretildi!');
      }
    } catch (err: any) {
      alert(err.message || 'AI Çevirisi başarısız oldu');
    } finally {
      setAiTranslating(false);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.channel_id || !formData.title_tr || !formData.slug) return;

    try {
      if (editingPost) {
        await api.updatePost(editingPost.id, formData);
      } else {
        await api.createPost(formData);
      }
      setShowEditor(false);
      setEditingPost(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Kaydedilemedi');
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinize emin misiniz?')) return;
    try {
      await api.deletePost(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Silinemedi');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>Blog Yazıları & Editör</h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            3 dilli blog yazılarınızı oluşturun, taslak kaydedin ve Gemini AI ile anında çevirin.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPost(null);
            setFormData({
              channel_id: channels[0]?.id || '',
              slug: '',
              title_tr: '',
              title_en: '',
              title_ar: '',
              content_tr: '',
              content_en: '',
              content_ar: '',
              summary_tr: '',
              summary_en: '',
              summary_ar: '',
              cover_image: '',
              meta_keywords: '',
              status: 'draft',
            });
            setShowEditor(true);
          }}
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
          <span>Yeni Blog Yazısı Yaz</span>
        </button>
      </div>

      {/* Posts Table / Grid */}
      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Yazılar yükleniyor...</p>
      ) : (
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '14px 18px' }}>Başlık & Slug</th>
                <th style={{ padding: '14px 18px' }}>Blog Kanalı</th>
                <th style={{ padding: '14px 18px' }}>Diller</th>
                <th style={{ padding: '14px 18px' }}>Durum</th>
                <th style={{ padding: '14px 18px' }}>Okunma</th>
                <th style={{ padding: '14px 18px', textAlign: 'right' }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ fontWeight: 700, color: '#FFF' }}>{post.title_tr}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>/blog/{post.slug}</div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ padding: '4px 10px', background: 'rgba(99, 102, 241, 0.15)', borderRadius: '12px', fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {post.channel_name || 'Genel'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ fontSize: '0.7rem', color: '#10B981' }}>🇹🇷 TR</span>
                      <span style={{ fontSize: '0.7rem', color: post.title_en ? '#10B981' : 'var(--text-muted)' }}>🇬🇧 EN</span>
                      <span style={{ fontSize: '0.7rem', color: post.title_ar ? '#10B981' : 'var(--text-muted)' }}>🇸🇦 AR</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, background: post.status === 'published' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: post.status === 'published' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
                      {post.status === 'published' ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={14} />
                      <span>{post.views_count || 0}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setFormData({
                          channel_id: post.channel_id,
                          slug: post.slug,
                          title_tr: post.title_tr,
                          title_en: post.title_en || '',
                          title_ar: post.title_ar || '',
                          content_tr: post.content_tr,
                          content_en: post.content_en || '',
                          content_ar: post.content_ar || '',
                          summary_tr: post.summary_tr || '',
                          summary_en: post.summary_en || '',
                          summary_ar: post.summary_ar || '',
                          cover_image: post.cover_image || '',
                          meta_keywords: post.meta_keywords || '',
                          status: post.status === 'published' ? 'published' : 'draft',
                        });
                        setShowEditor(true);
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', marginRight: '10px' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Blog Editor Modal */}
      {showEditor && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', background: '#0D1320' }}>
            
            {/* Editor Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>
                {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Oluştur'}
              </h2>

              <button
                type="button"
                onClick={handleAiTranslate}
                disabled={aiTranslating}
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: aiTranslating ? 0.7 : 1,
                }}
              >
                <Sparkles size={16} />
                <span>{aiTranslating ? 'Gemini AI Çeviriyor...' : '✨ AI ile EN & AR Çevir'}</span>
              </button>
            </div>

            <form onSubmit={handleSavePost} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Channel & Slug */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Blog Kanalı</label>
                  <select
                    value={formData.channel_id}
                    onChange={(e) => setFormData({ ...formData, channel_id: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                  >
                    {channels.map((ch) => (
                      <option key={ch.id} value={ch.id} style={{ background: '#0F1522' }}>{ch.name_tr}</option>
                    ))}
                  </select>
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
              </div>

              {/* Language Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('tr')}
                  style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeLangTab === 'tr' ? 'var(--accent-primary)' : 'transparent', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  🇹🇷 Türkçe (TR)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeLangTab === 'en' ? 'var(--accent-primary)' : 'transparent', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  🇬🇧 İngilizce (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('ar')}
                  style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeLangTab === 'ar' ? 'var(--accent-primary)' : 'transparent', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  🇸🇦 Arapça (AR)
                </button>
              </div>

              {/* Language Content Form */}
              {activeLangTab === 'tr' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Türkçe Başlık</label>
                    <input
                      type="text"
                      value={formData.title_tr}
                      onChange={(e) => {
                        const val = e.target.value;
                        const autoSlug = val.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '-');
                        setFormData({ ...formData, title_tr: val, slug: formData.slug || autoSlug });
                      }}
                      required
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Türkçe İçerik (Markdown / HTML)</label>
                    <textarea
                      rows={8}
                      value={formData.content_tr}
                      onChange={(e) => setFormData({ ...formData, content_tr: e.target.value })}
                      required
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF', fontFamily: 'monospace' }}
                    />
                  </div>
                </>
              )}

              {activeLangTab === 'en' && (
                <>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>English Title</label>
                    <input
                      type="text"
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>English Content</label>
                    <textarea
                      rows={8}
                      value={formData.content_en}
                      onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF', fontFamily: 'monospace' }}
                    />
                  </div>
                </>
              )}

              {activeLangTab === 'ar' && (
                <>
                  <div dir="rtl">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>العنوان باللغة العربية</label>
                    <input
                      type="text"
                      value={formData.title_ar}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF', fontFamily: 'Cairo' }}
                    />
                  </div>
                  <div dir="rtl">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>المحتوى باللغة العربية</label>
                    <textarea
                      rows={8}
                      value={formData.content_ar}
                      onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                      style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF', fontFamily: 'Cairo' }}
                    />
                  </div>
                </>
              )}

              {/* Cover & Options */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Kapak Resmi URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.cover_image}
                    onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Yayın Durumu</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#FFF' }}
                  >
                    <option value="draft" style={{ background: '#0F1522' }}>Taslak</option>
                    <option value="published" style={{ background: '#0F1522' }}>Canlıda Yayınla</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowEditor(false)} style={{ padding: '10px 20px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '6px', cursor: 'pointer' }}>İptal</button>
                <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent-primary)', border: 'none', color: '#FFF', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>Kaydet & Gönder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
