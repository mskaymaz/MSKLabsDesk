import React, { useState, useEffect } from 'react';
import { Sparkles, X, Eye, Layout, FileText } from 'lucide-react';
import type { BlogPost, BlogChannel } from '../../types';
import type { LayoutBlock } from './LayoutBuilder';
import { LayoutBuilder } from './LayoutBuilder';
import { PostPreviewModal } from './PostPreviewModal';
import { PostEditorLangFields } from './PostEditorLangFields';

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
  video_url?: string;
  meta_keywords: string;
  status: 'draft' | 'published' | 'unpublished' | 'trash';
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
          background: 'rgba(0, 0, 0, 0.72)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 'var(--z-modal, 999)',
          padding: '20px',
        }}
      >
        <div
          className="admin-panel-card"
          style={{
            width: '100%',
            maxWidth: '960px',
            maxHeight: '90vh',
            overflowY: 'auto',
            background: 'var(--bg-modal, var(--bg-card))',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          {/* Modal Üst Barı */}
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
              <h2 id="editor-modal-title" className="admin-modal-title">
                {editingPost ? 'Blog Yazısını Düzenle' : 'Yeni Blog Yazısı Oluştur'}
              </h2>
              <div className="admin-meta-text" style={{ marginTop: '2px' }}>
                Autosave Durumu:{' '}
                <span
                  style={{
                    fontWeight: 700,
                    color:
                      autosaveState === 'saved'
                        ? 'var(--success, #10b981)'
                        : autosaveState === 'saving'
                        ? 'var(--accent-cyan)'
                        : autosaveState === 'dirty'
                        ? 'var(--accent-amber, #f59e0b)'
                        : 'var(--text-secondary)',
                  }}
                >
                  {autosaveState.toUpperCase()} (3000ms debounce)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="admin-btn admin-btn-view admin-btn-sm"
                onClick={() => setIsPreviewOpen(true)}
              >
                <Eye size={14} /> Canlı Önizle
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ai admin-btn-sm"
                onClick={onAiTranslate}
                disabled={aiTranslating}
              >
                <Sparkles size={14} /> {aiTranslating ? 'Gemini AI...' : '✨ AI Çevir'}
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="admin-btn admin-btn-refresh admin-btn-sm"
                style={{ width: '28px', height: '28px', padding: 0 }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Blog Kanalı
                </label>
                <select
                  value={formData.channel_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, channel_id: e.target.value }))}
                  required
                  className="admin-filter-select"
                  style={{ width: '100%', height: '34px' }}
                >
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.name_tr}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  required
                  className="admin-filter-input"
                  style={{ width: '100%', height: '34px', padding: '0 10px', color: 'var(--accent-cyan)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Kapak Görseli URL
                </label>
                <input
                  type="text"
                  placeholder="https://.../cover.webp"
                  value={formData.cover_image || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cover_image: e.target.value }))}
                  className="admin-filter-input"
                  style={{ width: '100%', height: '34px', padding: '0 10px' }}
                />
              </div>

              <div>
                <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Video / YouTube URL (Vlog)
                </label>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
                  className="admin-filter-input"
                  style={{ width: '100%', height: '34px', padding: '0 10px' }}
                />
              </div>

              <div>
                <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Yayın Durumu
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                  className="admin-filter-select"
                  style={{ width: '100%', height: '34px' }}
                >
                  <option value="draft">📝 Taslak (Draft)</option>
                  <option value="published">✅ Yayında (Published)</option>
                  <option value="unpublished">⏸️ Yayından Kaldırıldı (Unpublished)</option>
                </select>
              </div>
            </div>

            {/* Dil ve Editör Modu Sekmeleri */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('tr')}
                  className="admin-btn admin-btn-sm"
                  style={{
                    background: activeTab === 'tr' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTab === 'tr' ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: activeTab === 'tr' ? 700 : 500,
                  }}
                >
                  🇹🇷 Türkçe
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('en')}
                  className="admin-btn admin-btn-sm"
                  style={{
                    background: activeTab === 'en' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTab === 'en' ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: activeTab === 'en' ? 700 : 500,
                  }}
                >
                  🇬🇧 EN
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ar')}
                  className="admin-btn admin-btn-sm"
                  style={{
                    background: activeTab === 'ar' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTab === 'ar' ? '#FFFFFF' : 'var(--text-secondary)',
                    fontWeight: activeTab === 'ar' ? 700 : 500,
                  }}
                >
                  🇸🇦 AR (RTL)
                </button>
              </div>

              <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-card)', padding: '2px', borderRadius: '6px' }}>
                <button
                  type="button"
                  onClick={() => setEditorMode('rich')}
                  style={{
                    padding: '4px 10px',
                    border: 'none',
                    borderRadius: '4px',
                    background: editorMode === 'rich' ? 'var(--accent-cyan)' : 'transparent',
                    color: editorMode === 'rich' ? '#000000' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                  }}
                >
                  <FileText size={13} /> TipTap Editör
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('layout')}
                  style={{
                    padding: '4px 10px',
                    border: 'none',
                    borderRadius: '4px',
                    background: editorMode === 'layout' ? 'var(--accent-cyan)' : 'transparent',
                    color: editorMode === 'layout' ? '#000000' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                  }}
                >
                  <Layout size={13} /> Modüler Düzen
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
              <PostEditorLangFields
                lang={activeTab}
                formData={formData}
                setFormData={setFormData}
                onContentChange={handleContentChange}
              />
            )}

            {/* Alt Eylem Butonları */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button
                type="button"
                className="admin-btn admin-btn-view admin-btn-sm"
                onClick={onClose}
              >
                İptal
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn-primary admin-btn-sm"
              >
                Kaydet & Gönder
              </button>
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
