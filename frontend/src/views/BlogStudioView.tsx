import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Eye,
  FileText,
  Layout,
  Save,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { BlogPost, BlogChannel } from '../types';
import type { PostFormData } from '../components/posts/PostEditorModal';
import { LayoutBuilder } from '../components/posts/LayoutBuilder';
import { PostPreviewModal } from '../components/posts/PostPreviewModal';
import { RichTextEditor } from '../components/ui/RichTextEditor';
import { EditorVerticalToolbar } from '../components/editor/EditorVerticalToolbar';
import { FloatingTableInspector } from '../components/editor/FloatingTableInspector';

export interface BlogStudioViewProps {
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

const CANVAS_WIDTHS = [
  { label: '780px', value: '780px', title: 'Standart Makale Okuma Genişliği' },
  { label: '920px', value: '920px', title: 'Geniş Doküman Düzeni' },
  { label: '1080px', value: '1080px', title: 'Geniş Masaüstü Düzeni' },
  { label: '100%', value: '100%', title: 'Akışkan / Tam Genişlik' },
];

export const BlogStudioView: React.FC<BlogStudioViewProps> = ({
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
  const [canvasWidth, setCanvasWidth] = useState<string>('840px');
  const [isMetaOpen, setIsMetaOpen] = useState(false);
  const [isFloatingTableOpen, setIsFloatingTableOpen] = useState(false);
  const [autosaveState, setAutosaveState] = useState<'idle' | 'dirty' | 'saving' | 'saved'>('idle');

  const editorRef = useRef<any>(null);

  // 3000ms Debounced Autosave State Machine
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

  const currentTitle =
    activeTab === 'tr' ? formData.title_tr : activeTab === 'en' ? formData.title_en : formData.title_ar;
  const currentSummary =
    activeTab === 'tr' ? formData.summary_tr : activeTab === 'en' ? formData.summary_en : formData.summary_ar;
  const currentContent =
    activeTab === 'tr' ? formData.content_tr : activeTab === 'en' ? formData.content_en : formData.content_ar;

  return (
    <div className="studio-container animate-fade-in">
      {/* 1. Üst Stüdyo Çubuğu */}
      <header className="studio-header">
        {/* Sol Eylemler: Geri Dönüş ve Başlık */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Listeye Geri Dön"
          >
            <ArrowLeft size={14} />
            <span>Makaleler</span>
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {editingPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}
              </h2>
              <span
                className={`admin-badge ${
                  autosaveState === 'saved'
                    ? 'admin-badge-emerald'
                    : autosaveState === 'saving'
                    ? 'admin-badge-cyan'
                    : autosaveState === 'dirty'
                    ? 'admin-badge-amber'
                    : ''
                }`}
                style={{ fontSize: '10px', padding: '1px 6px' }}
              >
                {autosaveState.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Orta: Dil Sekmeleri ve Tuval Genişliği */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Yalın TR / EN / AR Sekmeleri */}
          <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-secondary)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-card)' }}>
            {(['tr', 'en', 'ar'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveTab(lang)}
                style={{
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: activeTab === lang ? 700 : 500,
                  border: 'none',
                  borderRadius: '4px',
                  background: activeTab === lang ? 'var(--accent-primary)' : 'transparent',
                  color: activeTab === lang ? '#FFFFFF' : 'var(--text-secondary)',
                  cursor: 'pointer',
                }}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tuval Genişlik Seçici */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span>Genişlik:</span>
            <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-secondary)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-card)' }}>
              {CANVAS_WIDTHS.map((cw) => (
                <button
                  key={cw.value}
                  type="button"
                  onClick={() => setCanvasWidth(cw.value)}
                  title={cw.title}
                  style={{
                    padding: '3px 6px',
                    fontSize: '10px',
                    fontWeight: canvasWidth === cw.value ? 700 : 500,
                    border: 'none',
                    borderRadius: '4px',
                    background: canvasWidth === cw.value ? 'var(--accent-cyan)' : 'transparent',
                    color: canvasWidth === cw.value ? '#000000' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {cw.label}
                </button>
              ))}
            </div>
          </div>

          {/* Editör Modu (Zengin vs Blok) */}
          <div style={{ display: 'flex', gap: '2px', background: 'var(--bg-secondary)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-card)' }}>
            <button
              type="button"
              onClick={() => setEditorMode('rich')}
              style={{
                padding: '3px 8px',
                fontSize: '11px',
                border: 'none',
                borderRadius: '4px',
                background: editorMode === 'rich' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: editorMode === 'rich' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: editorMode === 'rich' ? 700 : 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <FileText size={12} /> Word
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('layout')}
              style={{
                padding: '3px 8px',
                fontSize: '11px',
                border: 'none',
                borderRadius: '4px',
                background: editorMode === 'layout' ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                color: editorMode === 'layout' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: editorMode === 'layout' ? 700 : 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Layout size={12} /> Bloklar
            </button>
          </div>
        </div>

        {/* Sağ: Eylem Butonları */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsMetaOpen(!isMetaOpen)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            title="Makale Ayarları (Kanal, Slug, Kapak vb.)"
          >
            <SlidersHorizontal size={13} />
            <span>Ayarlar</span>
            {isMetaOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-view admin-btn-sm"
            onClick={() => setIsPreviewOpen(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Eye size={13} /> Canlı Önizle
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-ai admin-btn-sm"
            onClick={onAiTranslate}
            disabled={aiTranslating}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Sparkles size={13} /> {aiTranslating ? 'Çevriliyor...' : '✨ AI Çevir'}
          </button>

          <button
            type="button"
            onClick={onSave}
            className="admin-btn admin-btn-primary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Save size={13} /> Kaydet
          </button>
        </div>
      </header>

      {/* 2. Açılır Makale Üst Bilgileri (Metadata Drawer) */}
      {isMetaOpen && (
        <section
          aria-label="Makale Meta Ayarları"
          style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '12px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            zIndex: 15,
          }}
        >
          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '3px' }}>
              Blog Kanalı
            </label>
            <select
              value={formData.channel_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, channel_id: e.target.value }))}
              className="admin-filter-select"
              style={{ width: '100%', height: '30px' }}
            >
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name_tr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '3px' }}>
              URL Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              className="admin-filter-input"
              style={{ width: '100%', height: '30px', padding: '0 8px', color: 'var(--accent-cyan)' }}
            />
          </div>

          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '3px' }}>
              Kapak Görseli URL
            </label>
            <input
              type="text"
              placeholder="https://.../cover.webp"
              value={formData.cover_image || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, cover_image: e.target.value }))}
              className="admin-filter-input"
              style={{ width: '100%', height: '30px', padding: '0 8px' }}
            />
          </div>

          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '3px' }}>
              Video / YouTube URL
            </label>
            <input
              type="text"
              placeholder="https://youtube.com/..."
              value={formData.video_url || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
              className="admin-filter-input"
              style={{ width: '100%', height: '30px', padding: '0 8px' }}
            />
          </div>

          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '3px' }}>
              Yayın Durumu
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
              className="admin-filter-select"
              style={{ width: '100%', height: '30px' }}
            >
              <option value="draft">📝 Taslak (Draft)</option>
              <option value="published">✅ Yayında (Published)</option>
              <option value="unpublished">⏸️ Yayından Kaldırıldı</option>
            </select>
          </div>
        </section>
      )}

      {/* 3. Ana Gövde: Sol Dikey Araç Çubuğu + Gri Masaüstü + Kağıt Tuval */}
      <div className="studio-body">
        {editorMode === 'rich' && (
          <EditorVerticalToolbar
            editor={editorRef.current}
            onToggleFloatingTable={() => setIsFloatingTableOpen(!isFloatingTableOpen)}
          />
        )}

        <div className="studio-desk-surface">
          <div
            className="word-paper-canvas"
            style={{
              maxWidth: canvasWidth,
              direction: activeTab === 'ar' ? 'rtl' : 'ltr',
            }}
          >
            {editorMode === 'layout' ? (
              <LayoutBuilder
                blocks={formData.blocks || []}
                onChange={(blocks) => {
                  setFormData((prev) => ({ ...prev, blocks }));
                  setAutosaveState('dirty');
                }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Büyük Belge Başlığı (Word Başlık Alanı) */}
                <input
                  type="text"
                  placeholder={
                    activeTab === 'tr'
                      ? 'Makale Başlığı...'
                      : activeTab === 'en'
                      ? 'Article Title...'
                      : 'عنوان المقال...'
                  }
                  value={currentTitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      [activeTab === 'tr' ? 'title_tr' : activeTab === 'en' ? 'title_en' : 'title_ar']: val,
                    }));
                    setAutosaveState('dirty');
                  }}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px solid var(--border-subtle)',
                    padding: '8px 0',
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontFamily: activeTab === 'ar' ? 'Cairo' : 'inherit',
                  }}
                />

                {/* Kısa Özet / SEO Açıklaması */}
                <textarea
                  rows={2}
                  placeholder={
                    activeTab === 'tr'
                      ? 'Kısa Özet / SEO Açıklaması...'
                      : activeTab === 'en'
                      ? 'Short Summary / SEO Description...'
                      : 'ملخص المقال / وصف SEO...'
                  }
                  value={currentSummary || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      [activeTab === 'tr' ? 'summary_tr' : activeTab === 'en' ? 'summary_en' : 'summary_ar']: val,
                    }));
                    setAutosaveState('dirty');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontFamily: activeTab === 'ar' ? 'Cairo' : 'inherit',
                    outline: 'none',
                  }}
                />

                {/* Zengin Metin Editörü */}
                <RichTextEditor
                  label={activeTab === 'tr' ? 'Makale İçeriği' : activeTab === 'en' ? 'Article Content' : 'محتوى المقال'}
                  value={currentContent}
                  onChange={(val) => handleContentChange(val, activeTab)}
                  dir={activeTab === 'ar' ? 'rtl' : 'ltr'}
                  editorRef={editorRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Yüzen Tablo Paleti (Canlı, Sürüklenebilir) */}
      <FloatingTableInspector
        editor={editorRef.current}
        isOpen={isFloatingTableOpen}
        onClose={() => setIsFloatingTableOpen(false)}
      />

      {/* Canlı Önizleme Modalı */}
      <PostPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
      />
    </div>
  );
};
