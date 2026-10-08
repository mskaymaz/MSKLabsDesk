import React, { useState, useEffect } from 'react';
import { Sparkles, X, Eye, Layout, FileText } from 'lucide-react';
import type { BlogPost, BlogChannel } from '../../types';
import { Button } from '../ui/Button';
import { RichTextEditor } from '../ui/RichTextEditor';
import type { LayoutBlock } from './LayoutBuilder';
import { LayoutBuilder } from './LayoutBuilder';
import { PostPreviewModal } from './PostPreviewModal';

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
  blocks?: LayoutBlock[];
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
  const [editorMode, setEditorMode] = useState<'rich' | 'layout'>('rich');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [autosaveState, setAutosaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved' | 'error' | 'offline' | 'conflict'>('idle');

  // 3000ms Debounced Autosave State Machine Simulation
  useEffect(() => {
    if (autosaveState === 'dirty') {
      const timer = setTimeout(() => {
        setAutosaveState('saving');
        setTimeout(() => setAutosaveState('saved'), 600);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autosaveState]);

  if (!isOpen) return null;

  const handleContentChange = (val: string, lang: 'tr' | 'en' | 'ar') => {
    setFormData((prev) => ({
      ...prev,
      [lang === 'tr' ? 'content_tr' : lang === 'en' ? 'content_en' : 'content_ar']: val,
    }));
    setAutosaveState('dirty');
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-modal-title"
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
          style={{ width: '100%', maxWidth: '960px', maxHeight: '90vh', overflowY: 'auto', background: '#0D1320' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '12px',
            }}
          >
            <div>
              <h2 id="editor-modal-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFF' }}>
                {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Oluştur'}
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Autosave Durumu:{' '}
                <span
                  style={{
                    fontWeight: 700,
                    color:
                      autosaveState === 'saved'
                        ? 'var(--success)'
                        : autosaveState === 'saving'
                        ? 'var(--accent-cyan)'
                        : autosaveState === 'dirty'
                        ? '#F59E0B'
                        : 'var(--text-secondary)',
                  }}
                >
                  {autosaveState.toUpperCase()} (3000ms debounce)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setIsPreviewOpen(true)} icon={<Eye size={16} />}>
                Canlı Önizle
              </Button>
              <Button variant="secondary" onClick={onAiTranslate} loading={aiTranslating} icon={<Sparkles size={16} />}>
                {aiTranslating ? 'Gemini AI...' : '✨ AI Çevir'}
              </Button>
              <button onClick={onClose} aria-label="Kapat" style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
          </div>

          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Blog Kanalı
                </label>
                <select
                  value={formData.channel_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, channel_id: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF' }}
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
                  style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--accent-cyan)' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('tr')}
                  style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: activeTab === 'tr' ? 'var(--accent-primary)' : 'transparent', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  🇹🇷 Türkçe
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: activeTab === 'en' ? 'var(--accent-primary)' : 'transparent', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  🇬🇧 EN
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ar')}
                  style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: activeTab === 'ar' ? 'var(--accent-primary)' : 'transparent', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}
                >
                  🇸🇦 AR (RTL)
                </button>
              </div>

              <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '6px' }}>
                <button
                  type="button"
                  onClick={() => setEditorMode('rich')}
                  style={{ padding: '4px 10px', border: 'none', borderRadius: '4px', background: editorMode === 'rich' ? 'var(--accent-cyan)' : 'transparent', color: '#000', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <FileText size={14} /> TipTap Editör
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('layout')}
                  style={{ padding: '4px 10px', border: 'none', borderRadius: '4px', background: editorMode === 'layout' ? 'var(--accent-cyan)' : 'transparent', color: '#000', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Layout size={14} /> Modüler Düzen
                </button>
              </div>
            </div>

            {editorMode === 'layout' ? (
              <LayoutBuilder
                blocks={formData.blocks || []}
                onChange={(blocks) => setFormData((prev) => ({ ...prev, blocks }))}
                isRtl={activeTab === 'ar'}
              />
            ) : (
              <>
                {activeTab === 'tr' && (
                  <>
                    <input
                      type="text"
                      placeholder="Türkçe Başlık"
                      value={formData.title_tr}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title_tr: e.target.value }))}
                      required
                      style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF' }}
                    />
                    <RichTextEditor
                      label="Türkçe İçerik (TipTap + XSS Dezenfeksiyonu)"
                      value={formData.content_tr}
                      onChange={(val) => handleContentChange(val, 'tr')}
                    />
                  </>
                )}

                {activeTab === 'en' && (
                  <>
                    <input
                      type="text"
                      placeholder="English Title"
                      value={formData.title_en}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
                      style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF' }}
                    />
                    <RichTextEditor
                      label="English Content"
                      value={formData.content_en}
                      onChange={(val) => handleContentChange(val, 'en')}
                    />
                  </>
                )}

                {activeTab === 'ar' && (
                  <div dir="rtl">
                    <input
                      type="text"
                      placeholder="العنوان باللغة العربية"
                      value={formData.title_ar}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title_ar: e.target.value }))}
                      style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#FFF', fontFamily: 'Cairo' }}
                    />
                    <RichTextEditor
                      label="المحتوى باللغة العربية"
                      value={formData.content_ar}
                      onChange={(val) => handleContentChange(val, 'ar')}
                    />
                  </div>
                )}
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <Button variant="secondary" onClick={onClose}>İptal</Button>
              <Button type="submit">Kaydet & Gönder</Button>
            </div>
          </form>
        </div>
      </div>

      <PostPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        post={{
          title_tr: formData.title_tr,
          content_tr: formData.content_tr,
          cover_image: formData.cover_image,
        }}
      />
    </>
  );
};
