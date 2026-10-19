import React, { useRef } from 'react';
import { AppStudioRichTextToolbar } from './AppStudioRichTextToolbar';

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
  const trRef = useRef<HTMLTextAreaElement>(null);
  const enRef = useRef<HTMLTextAreaElement>(null);
  const arRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="studio-description-editor">
      {/* 1. KART VİZYON ÖZET METNİ */}
      <div style={{ padding: '8px 12px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#60a5fa' }}>📌 1. Ana Sayfa Kart Vizyonu (Kısa Özet - 1 Cümle)</span>
        <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
          Ana uygulamalarımız sayfasındaki kutularda dikey şişmeyi önleyen, öz ve vurucu tek cümlelik metindir.
        </p>
      </div>

      <div className="studio-lang-box">
        <span className="studio-lang-tag" style={{ background: '#1e3a8a', color: '#bfdbfe' }}>
          TR (Özet Vizyon - TR)
        </span>
        <input
          type="text"
          value={summaryTr}
          onChange={(e) => setSummaryTr(e.target.value)}
          placeholder="Lokasyon bazlı ibadet planlaması ve zaman yönetimi otomasyonu."
          className="studio-input"
        />
      </div>

      <div className="studio-lang-box" style={{ marginTop: '8px' }}>
        <span className="studio-lang-tag" style={{ background: '#075985', color: '#bae6fd' }}>
          EN (Vision Summary - EN)
        </span>
        <input
          type="text"
          value={summaryEn}
          onChange={(e) => setSummaryEn(e.target.value)}
          placeholder="Location-based worship planning and time management automation."
          className="studio-input"
        />
      </div>

      <div className="studio-lang-box" dir="rtl" style={{ marginTop: '8px' }}>
        <span className="studio-lang-tag" style={{ background: '#065f46', color: '#a7f3d0' }}>
          AR (العربية - ملخص البطاقة)
        </span>
        <input
          type="text"
          value={summaryAr}
          onChange={(e) => setSummaryAr(e.target.value)}
          placeholder="تخطيط العبادة القائم على الموقع وأتمتة إدارة الوقت."
          className="studio-input"
        />
      </div>

      {/* 2. UYGULAMA DETAY AÇIKLAMASI */}
      <div style={{ padding: '8px 12px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)', margin: '14px 0 8px' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#34d399' }}>📖 2. Uygulama Detay Tanıtımı (Zengin Biçimli Metin)</span>
        <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#94a3b8' }}>
          Tekil tanıtım sayfasında görünen detaylı açıklama paragrafıdır. Kalın, italik, liste ve başlık araçlarını kullanabilirsiniz.
        </p>
      </div>

      {/* Türkçe Açıklama */}
      <div className="studio-lang-box">
        <span className="studio-lang-tag" style={{ background: '#1e3a8a', color: '#bfdbfe' }}>
          TR (Türkçe Açıklama)
        </span>
        <AppStudioRichTextToolbar
          textareaRef={trRef}
          value={descTr}
          onChange={setDescTr}
        />
        <textarea
          ref={trRef}
          rows={4}
          value={descTr}
          onChange={(e) => setDescTr(e.target.value)}
          placeholder="Uygulama hakkında detaylı açıklama..."
          className="studio-textarea"
        />
      </div>

      {/* İngilizce Açıklama */}
      <div className="studio-lang-box" style={{ marginTop: '8px' }}>
        <span className="studio-lang-tag" style={{ background: '#075985', color: '#bae6fd' }}>
          EN (English Description)
        </span>
        <AppStudioRichTextToolbar
          textareaRef={enRef}
          value={descEn}
          onChange={setDescEn}
        />
        <textarea
          ref={enRef}
          rows={4}
          value={descEn}
          onChange={(e) => setDescEn(e.target.value)}
          placeholder="Application description in English..."
          className="studio-textarea"
        />
      </div>

      {/* Arapça Açıklama */}
      <div className="studio-lang-box" dir="rtl" style={{ marginTop: '8px' }}>
        <span className="studio-lang-tag" style={{ background: '#065f46', color: '#a7f3d0' }}>
          AR (العربية - الوصف)
        </span>
        <AppStudioRichTextToolbar
          textareaRef={arRef}
          value={descAr}
          onChange={setDescAr}
        />
        <textarea
          ref={arRef}
          rows={4}
          value={descAr}
          onChange={(e) => setDescAr(e.target.value)}
          placeholder="وصف التطبيق بالعربية..."
          className="studio-textarea"
        />
      </div>
    </div>
  );
};
