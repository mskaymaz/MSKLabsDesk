import React from 'react';
import { Sparkles } from 'lucide-react';

interface AppModalLangFieldsProps {
  langTab: 'tr' | 'en' | 'ar';
  setLangTab: (lang: 'tr' | 'en' | 'ar') => void;
  formData: {
    name_tr: string;
    name_en: string;
    name_ar: string;
    description_tr: string;
    description_en: string;
    description_ar: string;
    features_tr: string;
    features_en: string;
    features_ar: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onAiTranslate: () => void;
  aiTranslating: boolean;
}

export const AppModalLangFields: React.FC<AppModalLangFieldsProps> = ({
  langTab,
  setLangTab,
  formData,
  setFormData,
  onAiTranslate,
  aiTranslating,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['tr', 'en', 'ar'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setLangTab(lang)}
              className="admin-btn admin-btn-sm"
              style={{
                background: langTab === lang ? 'var(--accent-primary)' : 'transparent',
                color: langTab === lang ? '#fff' : 'var(--text-secondary)',
                fontWeight: 600,
                padding: '4px 12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onAiTranslate}
          disabled={aiTranslating}
          className="admin-btn admin-btn-sm admin-btn-sparkle"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles size={14} />
          <span>{aiTranslating ? 'Gemini AI Çeviriyor...' : 'AI ile EN & AR Çevir'}</span>
        </button>
      </div>

      {langTab === 'tr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>Uygulama Adı (TR) *</label>
            <input
              type="text"
              required
              placeholder="HaydiNamaza"
              value={formData.name_tr}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, name_tr: e.target.value }))}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>Tanıtım & Açıklama (TR) *</label>
            <textarea
              rows={5}
              required
              placeholder="Uygulamanın öne çıkan amacı ve kullanıcıya sundukları..."
              value={formData.description_tr}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, description_tr: e.target.value }))}
              className="form-input"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </div>
      )}

      {langTab === 'en' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>Application Name (EN)</label>
            <input
              type="text"
              placeholder="HaydiNamaza - Prayer Times"
              value={formData.name_en}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, name_en: e.target.value }))}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>Description (EN)</label>
            <textarea
              rows={5}
              placeholder="Application overview in English..."
              value={formData.description_en}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, description_en: e.target.value }))}
              className="form-input"
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
        </div>
      )}

      {langTab === 'ar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} dir="rtl">
          <div>
            <label className="form-label" style={{ fontWeight: 600, textAlign: 'right' }}>اسم التطبيق (AR)</label>
            <input
              type="text"
              placeholder="حي على الصلاة"
              value={formData.name_ar}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, name_ar: e.target.value }))}
              className="form-input"
              style={{ width: '100%', textAlign: 'right' }}
            />
          </div>
          <div>
            <label className="form-label" style={{ fontWeight: 600, textAlign: 'right' }}>الوصف والتعريف (AR)</label>
            <textarea
              rows={5}
              placeholder="نظرة عامة على التطبيق باللغة العربية الفصحى..."
              value={formData.description_ar}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, description_ar: e.target.value }))}
              className="form-input"
              style={{ width: '100%', resize: 'vertical', textAlign: 'right' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
