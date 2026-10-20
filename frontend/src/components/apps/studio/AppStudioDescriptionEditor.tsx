import React, { useState } from 'react';
import { AppStudioTipTapEditor } from './AppStudioTipTapEditor';

interface AppStudioDescriptionEditorProps {
  summaryTr: string;
  setSummaryTr: (val: string) => void;
  summaryEn: string;
  setSummaryEn: (val: string) => void;
  summaryAr: string;
  setSummaryAr: (val: string) => void;

  descTr: string;
  setDescTr: (val: string) => void;
  descEn: string;
  setDescEn: (val: string) => void;
  descAr: string;
  setDescAr: (val: string) => void;
}

export const AppStudioDescriptionEditor: React.FC<AppStudioDescriptionEditorProps> = ({
  summaryTr,
  setSummaryTr,
  summaryEn,
  setSummaryEn,
  summaryAr,
  setSummaryAr,
  descTr,
  setDescTr,
  descEn,
  setDescEn,
  descAr,
  setDescAr,
}) => {
  const [activeLang, setActiveLang] = useState<'tr' | 'en' | 'ar'>('tr');

  return (
    <div className="studio-description-editor" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      
      {/* Dil Değiştirici Sekmeler */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color, #cbd5e1)', paddingBottom: '8px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted, #64748b)' }}>
          Düzenleme Dili:
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveLang('tr')}
            style={langTabStyle(activeLang === 'tr')}
          >
            TR (Türkçe)
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            style={langTabStyle(activeLang === 'en')}
          >
            EN (English)
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('ar')}
            style={langTabStyle(activeLang === 'ar')}
          >
            AR (العربية)
          </button>
        </div>
      </div>

      {/* TÜRKÇE SEKMESİ */}
      {activeLang === 'tr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="studio-label" style={{ margin: 0 }}>
                📌 1. Ana Sayfa Kart Vizyonu (Kısa Özet — 1 Cümle)
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Maks 100-120 karakter</span>
            </div>
            <input
              type="text"
              value={summaryTr}
              onChange={(e) => setSummaryTr(e.target.value)}
              placeholder="Lokasyon bazlı ibadet planlaması ve zaman yönetimi otomasyonu."
              className="studio-input"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="studio-label" style={{ margin: 0 }}>
                📖 2. Uygulama Detay Tanıtımı (Görsel Zengin Editör)
              </label>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 500 }}>
                ✓ Canlı Görsel Editör (Tag'ler gizlidir)
              </span>
            </div>
            <AppStudioTipTapEditor
              value={descTr}
              onChange={setDescTr}
              placeholder="Uygulama hakkında detaylı açıklama..."
              dir="ltr"
            />
          </div>
        </div>
      )}

      {/* İNGİLİZCE SEKMESİ */}
      {activeLang === 'en' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="studio-label" style={{ margin: 0 }}>
                📌 1. Homepage Card Vision (Short Summary — 1 Sentence)
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Max 100-120 chars</span>
            </div>
            <input
              type="text"
              value={summaryEn}
              onChange={(e) => setSummaryEn(e.target.value)}
              placeholder="Location-based worship planning and time management automation."
              className="studio-input"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="studio-label" style={{ margin: 0 }}>
                📖 2. Detailed Application Description (Visual WYSIWYG)
              </label>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 500 }}>
                ✓ Live Visual Editor (Tags hidden)
              </span>
            </div>
            <AppStudioTipTapEditor
              value={descEn}
              onChange={setDescEn}
              placeholder="Application description in English..."
              dir="ltr"
            />
          </div>
        </div>
      )}

      {/* ARAPÇA SEKMESİ */}
      {activeLang === 'ar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} dir="rtl">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="studio-label" style={{ margin: 0 }}>
                📌 1. ملخص بطاقة التطبيق (رؤية موجزة — جملة واحدة)
              </label>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>أقصى حد 100-120 حرف</span>
            </div>
            <input
              type="text"
              value={summaryAr}
              onChange={(e) => setSummaryAr(e.target.value)}
              placeholder="تخطيط العبادة القائم على الموقع وأتمتة إدارة الوقت."
              className="studio-input"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="studio-label" style={{ margin: 0 }}>
                📖 2. الوصف التفصيلي للتطبيق (محرر مرئي منسق)
              </label>
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 500 }}>
                ✓ محرر مرئي مباشر (بدون وسوم برمجية)
              </span>
            </div>
            <AppStudioTipTapEditor
              value={descAr}
              onChange={setDescAr}
              placeholder="وصف التطبيق بالعربية..."
              dir="rtl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

function langTabStyle(isActive: boolean): React.CSSProperties {
  return {
    padding: '4px 12px',
    fontSize: '0.76rem',
    fontWeight: isActive ? 700 : 500,
    borderRadius: '6px',
    border: isActive ? '1px solid var(--accent-primary, #3b82f6)' : '1px solid var(--border-color, #cbd5e1)',
    background: isActive ? 'var(--accent-primary, #3b82f6)' : 'transparent',
    color: isActive ? '#ffffff' : 'var(--text-muted, #64748b)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };
}
