import React from 'react';
import type { PostFormData } from './PostEditorModal';
import { RichTextEditor } from '../ui/RichTextEditor';

interface PostEditorLangFieldsProps {
  lang: 'tr' | 'en' | 'ar';
  formData: PostFormData;
  setFormData: React.Dispatch<React.SetStateAction<PostFormData>>;
  onContentChange: (val: string, lang: 'tr' | 'en' | 'ar') => void;
}

export const PostEditorLangFields: React.FC<PostEditorLangFieldsProps> = ({
  lang,
  formData,
  setFormData,
  onContentChange,
}) => {
  if (lang === 'tr') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Türkçe Başlık"
          value={formData.title_tr}
          onChange={(e) => setFormData((prev) => ({ ...prev, title_tr: e.target.value }))}
          required
          className="admin-filter-input"
          style={{ width: '100%', height: '36px', padding: '0 12px', fontSize: '14px', fontWeight: 600 }}
        />
        <textarea
          rows={2}
          placeholder="Türkçe Kısa Özet / SEO Özeti"
          value={formData.summary_tr || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, summary_tr: e.target.value }))}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-md, 6px)',
            color: 'var(--text-primary)',
            fontSize: '13px',
          }}
        />
        <RichTextEditor
          label="Türkçe İçerik"
          value={formData.content_tr}
          onChange={(val) => onContentChange(val, 'tr')}
        />
      </div>
    );
  }

  if (lang === 'en') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="English Title"
          value={formData.title_en}
          onChange={(e) => setFormData((prev) => ({ ...prev, title_en: e.target.value }))}
          className="admin-filter-input"
          style={{ width: '100%', height: '36px', padding: '0 12px', fontSize: '14px', fontWeight: 600 }}
        />
        <textarea
          rows={2}
          placeholder="English Short Summary / SEO Summary"
          value={formData.summary_en || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, summary_en: e.target.value }))}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-md, 6px)',
            color: 'var(--text-primary)',
            fontSize: '13px',
          }}
        />
        <RichTextEditor
          label="English Content"
          value={formData.content_en}
          onChange={(val) => onContentChange(val, 'en')}
        />
      </div>
    );
  }

  // Arapça (RTL)
  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input
        type="text"
        placeholder="العنوان باللغة العربية"
        value={formData.title_ar}
        onChange={(e) => setFormData((prev) => ({ ...prev, title_ar: e.target.value }))}
        className="admin-filter-input"
        style={{ width: '100%', height: '36px', padding: '0 12px', fontSize: '14px', fontWeight: 600, fontFamily: 'Cairo' }}
      />
      <textarea
        rows={2}
        placeholder="ملخص المقال / وصف SEO"
        value={formData.summary_ar || ''}
        onChange={(e) => setFormData((prev) => ({ ...prev, summary_ar: e.target.value }))}
        style={{
          width: '100%',
          padding: '8px 12px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-md, 6px)',
          color: 'var(--text-primary)',
          fontSize: '13px',
          fontFamily: 'Cairo',
        }}
      />
      <RichTextEditor
        label="المحتوى باللغة العربية"
        value={formData.content_ar}
        onChange={(val) => onContentChange(val, 'ar')}
        dir="rtl"
      />
    </div>
  );
};
