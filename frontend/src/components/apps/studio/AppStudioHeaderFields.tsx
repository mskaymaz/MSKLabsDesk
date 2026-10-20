import React from 'react';
import { parseAppTitle, buildAppTitle } from '../../../utils/appTitleHelper';

export interface AppStudioHeaderFieldsProps {
  draftAppId: string;
  setDraftAppId: (val: string) => void;
  draftIconUrl: string;
  setDraftIconUrl: (val: string) => void;
  draftNameTr: string;
  setDraftNameTr: (val: string) => void;
  draftNameEn: string;
  setDraftNameEn: (val: string) => void;
  draftNameAr: string;
  setDraftNameAr: (val: string) => void;
  draftCategory: string;
  setDraftCategory: (val: string) => void;
  draftPlatform: string;
  setDraftPlatform: (val: string) => void;
  draftStatus: string;
  setDraftStatus: (val: 'active' | 'in_development' | 'planned') => void;
  draftDisplayOrder: number;
  setDraftDisplayOrder: (val: number) => void;
}

export const AppStudioHeaderFields: React.FC<AppStudioHeaderFieldsProps> = ({
  draftAppId,
  setDraftAppId,
  draftIconUrl,
  setDraftIconUrl,
  draftNameTr,
  setDraftNameTr,
  draftNameEn,
  setDraftNameEn,
  draftNameAr,
  setDraftNameAr,
  draftCategory,
  setDraftCategory,
  draftPlatform,
  setDraftPlatform,
  draftStatus,
  setDraftStatus,
  draftDisplayOrder,
  setDraftDisplayOrder,
}) => {
  return (
    <>
      <div className="studio-form-group">
        <label className="studio-label">Uygulama Kimliği (Slug / ID)</label>
        <input
          type="text"
          value={draftAppId}
          onChange={(e) => setDraftAppId(e.target.value)}
          placeholder="örn: haydinamaza"
          className="studio-input"
        />
      </div>

      <div className="studio-form-group">
        <label className="studio-label">İkon Görsel URL (125px)</label>
        <input
          type="text"
          value={draftIconUrl}
          onChange={(e) => setDraftIconUrl(e.target.value)}
          placeholder="assets/img/apps/haydinamaza.png veya https://..."
          className="studio-input"
        />
      </div>

      {/* 3 Dilli Başlıklar ve Parantez İçi Alt Açıklamalar */}
      <div className="studio-lang-box">
        <span className="studio-lang-tag" style={{ background: '#1e3a8a', color: '#bfdbfe' }}>
          TR (Türkçe)
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: '2px' }}>
              Ana Uygulama Adı
            </label>
            <input
              type="text"
              value={parseAppTitle(draftNameTr).mainTitle}
              onChange={(e) => {
                const sub = parseAppTitle(draftNameTr).subtitle;
                setDraftNameTr(buildAppTitle(e.target.value, sub));
              }}
              placeholder="Örn: Date Counter"
              className="studio-input"
            />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: '2px' }}>
              Alt Açıklama (Parantez içi — %30 küçük ve normal ağırlıkta görünür)
            </label>
            <input
              type="text"
              value={parseAppTitle(draftNameTr).subtitle}
              onChange={(e) => {
                const main = parseAppTitle(draftNameTr).mainTitle;
                setDraftNameTr(buildAppTitle(main, e.target.value));
              }}
              placeholder="Örn: Tarih & Hedef Sayacı"
              className="studio-input"
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      <div className="studio-lang-box">
        <span className="studio-lang-tag" style={{ background: '#075985', color: '#bae6fd' }}>
          EN (English)
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: '2px' }}>
              Main Application Name
            </label>
            <input
              type="text"
              value={parseAppTitle(draftNameEn).mainTitle}
              onChange={(e) => {
                const sub = parseAppTitle(draftNameEn).subtitle;
                setDraftNameEn(buildAppTitle(e.target.value, sub));
              }}
              placeholder="e.g. Date Counter"
              className="studio-input"
            />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: '2px' }}>
              Subtitle / Sub-heading (shown 30% smaller, normal weight)
            </label>
            <input
              type="text"
              value={parseAppTitle(draftNameEn).subtitle}
              onChange={(e) => {
                const main = parseAppTitle(draftNameEn).mainTitle;
                setDraftNameEn(buildAppTitle(main, e.target.value));
              }}
              placeholder="e.g. Date & Target Counter"
              className="studio-input"
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      <div className="studio-lang-box" dir="rtl">
        <span className="studio-lang-tag" style={{ background: '#065f46', color: '#a7f3d0' }}>
          AR (العربية)
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: '2px' }}>
              اسم التطبيق الرئيسي
            </label>
            <input
              type="text"
              value={parseAppTitle(draftNameAr).mainTitle}
              onChange={(e) => {
                const sub = parseAppTitle(draftNameAr).subtitle;
                setDraftNameAr(buildAppTitle(e.target.value, sub));
              }}
              placeholder="اسم التطبيق بالعربية..."
              className="studio-input"
            />
          </div>
          <div>
            <label style={{ fontSize: '0.72rem', color: 'var(--text-muted, #94a3b8)', display: 'block', marginBottom: '2px' }}>
              العنوان الفرعي التوضيحي (بين قوسين — بخط أصغر بنسبة 30%)
            </label>
            <input
              type="text"
              value={parseAppTitle(draftNameAr).subtitle}
              onChange={(e) => {
                const main = parseAppTitle(draftNameAr).mainTitle;
                setDraftNameAr(buildAppTitle(main, e.target.value));
              }}
              placeholder="العنوان الفرعي بالعربية..."
              className="studio-input"
              style={{ fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px', gap: '10px' }}>
        <div className="studio-form-group">
          <label className="studio-label">Kategori</label>
          <select
            value={draftCategory}
            onChange={(e) => setDraftCategory(e.target.value)}
            className="studio-select"
          >
            <option value="utility">Araçlar & Yardımcılar</option>
            <option value="islamic">İslami / Dinî</option>
            <option value="productivity">Üretkenlik & Takip</option>
            <option value="education">Eğitim & İlim</option>
            <option value="lifestyle">Yaşam & Sağlık</option>
            <option value="multimedia">Multimedya & Ses</option>
            <option value="ai">Yapay Zekâ</option>
            <option value="system">Sistem & Güvenlik</option>
            {!['utility', 'islamic', 'productivity', 'education', 'lifestyle', 'multimedia', 'ai', 'system'].includes(draftCategory.toLowerCase()) && (
              <option value={draftCategory}>{draftCategory}</option>
            )}
          </select>
        </div>

        <div className="studio-form-group">
          <label className="studio-label">Platform</label>
          <select
            value={draftPlatform.toLowerCase()}
            onChange={(e) => setDraftPlatform(e.target.value)}
            className="studio-select"
          >
            <option value="android">Android</option>
            <option value="ios">iOS</option>
            <option value="android / ios">Android & iOS</option>
            <option value="desktop">Windows Masaüstü</option>
            <option value="web">Web (PWA)</option>
            <option value="all">Tüm Platformlar</option>
            {!['android', 'ios', 'android / ios', 'android & ios', 'desktop', 'windows', 'web', 'all'].includes(draftPlatform.toLowerCase()) && (
              <option value={draftPlatform}>{draftPlatform}</option>
            )}
          </select>
        </div>

        <div className="studio-form-group">
          <label className="studio-label">Yayın Durumu</label>
          <select
            value={draftStatus}
            onChange={(e) => setDraftStatus(e.target.value as any)}
            className="studio-select"
          >
            <option value="active">Yayında</option>
            <option value="in_development">Geliştiriliyor</option>
            <option value="planned">Planlanıyor</option>
          </select>
        </div>

        <div className="studio-form-group">
          <label className="studio-label" title="Küçük sayılar daha önce listelenir">Vitrin Sırası</label>
          <input
            type="number"
            min={0}
            value={draftDisplayOrder}
            onChange={(e) => setDraftDisplayOrder(parseInt(e.target.value) || 0)}
            className="studio-input"
            title="Ana sayfada listelenme sırası (Örn: 1, 2, 3...)"
          />
        </div>
      </div>
    </>
  );
};
