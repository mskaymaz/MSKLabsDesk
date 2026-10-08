import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import type { BlogPost, BlogChannel } from '../../types';
import { Button } from '../ui/Button';

export interface PostFormData {
  channel_id: string;
  slug: string;
  title_tr: string;
  title_en: string;
  title_ar: string;
  content_tr: string;
  content_en: string;
  content_ar: string;
  summary_tr: string;
  summary_en: string;
  summary_ar: string;
  cover_image: string;
  meta_keywords: string;
  status: 'draft' | 'published';
}

export interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPost: BlogPost | null;
  channels: BlogChannel[];
  formData: PostFormData;
  setFormData: React.Dispatch<React.SetStateAction<PostFormData>>;
  onSave: (e: React.FormEvent) => void;
  onAiTranslate: () => void;
  aiTranslating: boolean;
}

export const PostEditorModal: React.FC<PostEditorModalProps> = ({
  isOpen,
  onClose,
  editingPost,
  channels,
  formData,
  setFormData,
  onSave,
  onAiTranslate,
  aiTranslating,
}) => {
  const [activeTab, setActiveTab] = useState<'tr' | 'en' | 'ar'>('tr');

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 'var(--z-modal)',
        padding: '20px',
      }}
    >
      <div
        className="glass-card"
        style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', background: '#0D1320' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
          }}
        >
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFF' }}>
            {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Oluştur'}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Button variant="secondary" onClick={onAiTranslate} loading={aiTranslating} icon={<Sparkles size={16} />}>
              {aiTranslating ? 'Gemini AI Çeviriyor...' : '✨ AI ile EN & AR Çevir'}
            </Button>
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Blog Kanalı
              </label>
              <select
                value={formData.channel_id}
                onChange={(e) => setFormData((prev) => ({ ...prev, channel_id: e.target.value }))}
                required
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF' }}
              >
                {channels.map((ch) => (
                  <option key={ch.id} value={ch.id} style={{ background: '#0F1522' }}>
                    {ch.name_tr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                URL Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                required
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--accent-cyan)' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('tr')}
              style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === 'tr' ? 'var(--accent-primary)' : 'transparent', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
            >
              🇹🇷 Türkçe (TR)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('en')}
              style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === 'en' ? 'var(--accent-primary)' : 'transparent', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
            >
              🇬🇧 İngilizce (EN)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ar')}
              style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', background: activeTab === 'ar' ? 'var(--accent-primary)' : 'transparent', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
            >
              🇸🇦 Arapça (AR)
            </button>
          </div>

          {activeTab === 'tr' && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Türkçe Başlık</label>
                <input
                  type="text"
                  value={formData.title_tr}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val.toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9]/g, '-');
                    setFormData((prev) => ({ ...prev, title_tr: val, slug: prev.slug || autoSlug }));
                  }}
                  required
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Türkçe İçerik (Markdown / HTML)</label>
                <textarea
                  rows={6}
                  value={formData.content_tr}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content_tr: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontFamily: 'monospace' }}
                />
              </div>
            </>
          )}

          {activeTab === 'en' && (
            <>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>English Title</label>
                <input
                  type="text"
                  value={formData.title_en}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>English Content</label>
                <textarea
                  rows={6}
                  value={formData.content_en}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content_en: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontFamily: 'monospace' }}
                />
              </div>
            </>
          )}

          {activeTab === 'ar' && (
            <>
              <div dir="rtl">
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>العنوان باللغة العربية</label>
                <input
                  type="text"
                  value={formData.title_ar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title_ar: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontFamily: 'Cairo' }}
                />
              </div>
              <div dir="rtl">
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>المحتوى باللغة العربية</label>
                <textarea
                  rows={6}
                  value={formData.content_ar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content_ar: e.target.value }))}
                  style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontFamily: 'Cairo' }}
                />
              </div>
            </>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Kapak Resmi URL</label>
              <input
                type="text"
                value={formData.cover_image}
                onChange={(e) => setFormData((prev) => ({ ...prev, cover_image: e.target.value }))}
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Yayın Durumu</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF' }}
              >
                <option value="draft" style={{ background: '#0F1522' }}>Taslak</option>
                <option value="published" style={{ background: '#0F1522' }}>Canlıda Yayınla</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <Button variant="secondary" onClick={onClose}>İptal</Button>
            <Button type="submit">Kaydet & Gönder</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
