import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import type { AppItem, AppStoreLinks, AppFeatureCard } from '../../../types';
import type { StudioSectionType } from './types';
import { AppStudioFeatureCardEditor } from './AppStudioFeatureCardEditor';

interface AppStudioFloatingModalProps {
  section: StudioSectionType;
  app: AppItem;
  onApply: (updated: Partial<AppItem>) => void;
  onClose: () => void;
}

export const AppStudioFloatingModal: React.FC<AppStudioFloatingModalProps> = ({
  section,
  app,
  onApply,
  onClose,
}) => {
  // 1. Bölüme göre geçici (draft) state
  const [draftAppId, setDraftAppId] = useState(app.app_id || app.slug || '');
  const [draftNameTr, setDraftNameTr] = useState(app.name_tr || app.name || '');
  const [draftNameEn, setDraftNameEn] = useState(app.name_en || '');
  const [draftNameAr, setDraftNameAr] = useState(app.name_ar || '');
  const [draftIconUrl, setDraftIconUrl] = useState(app.icon_url || '');
  const [draftCategory, setDraftCategory] = useState(app.category || 'Mobil');
  const [draftPlatform, setDraftPlatform] = useState(app.platform || 'Android');
  const [draftStatus, setDraftStatus] = useState(app.status || 'active');

  const [draftDescTr, setDraftDescTr] = useState(app.description_tr || app.description || '');
  const [draftDescEn, setDraftDescEn] = useState(app.description_en || '');
  const [draftDescAr, setDraftDescAr] = useState(app.description_ar || '');

  const [draftGuideUrl, setDraftGuideUrl] = useState(app.guide_url || app.store_links?.guide_url || '');

  const [draftStoreLinks, setDraftStoreLinks] = useState<AppStoreLinks>({ ...(app.store_links || {}) });
  const [draftFeatureCards, setDraftFeatureCards] = useState<AppFeatureCard[]>([
    ...(app.feature_cards || [])
  ]);

  // Kart ekleme / silme / düzenleme
  const [activeCardIdx, setActiveCardIdx] = useState<number>(0);

  const handleAddFeatureCard = () => {
    const newCard: AppFeatureCard = {
      icon: '✨',
      title_tr: 'Yeni Özellik',
      title_en: 'New Feature',
      title_ar: 'ميزة جديدة',
      description_tr: 'Özellik detay açıklaması...',
      description_en: 'Feature description in English...',
      description_ar: 'وصف تفصيلي للميزة...',
    };
    setDraftFeatureCards([...draftFeatureCards, newCard]);
    setActiveCardIdx(draftFeatureCards.length);
  };

  const handleUpdateCard = (idx: number, field: keyof AppFeatureCard, val: string) => {
    const updated = [...draftFeatureCards];
    updated[idx] = { ...updated[idx], [field]: val };
    setDraftFeatureCards(updated);
  };

  const handleRemoveCard = (idx: number) => {
    const updated = draftFeatureCards.filter((_, i) => i !== idx);
    setDraftFeatureCards(updated);
    setActiveCardIdx(Math.max(0, idx - 1));
  };

  // Tamam / Uygula tıklandığında
  const handleApply = () => {
    if (section === 'header') {
      onApply({
        app_id: draftAppId || app.app_id,
        name_tr: draftNameTr,
        name: draftNameTr,
        name_en: draftNameEn,
        name_ar: draftNameAr,
        icon_url: draftIconUrl,
        category: draftCategory,
        platform: draftPlatform,
        status: draftStatus as any,
      });
    } else if (section === 'description') {
      onApply({
        description_tr: draftDescTr,
        description: draftDescTr,
        description_en: draftDescEn,
        description_ar: draftDescAr,
      });
    } else if (section === 'guide') {
      onApply({
        guide_url: draftGuideUrl,
        store_links: {
          ...draftStoreLinks,
          guide_url: draftGuideUrl,
        },
      });
    } else if (section === 'features') {
      onApply({
        feature_cards: draftFeatureCards,
      });
    } else if (section === 'store_links') {
      onApply({
        store_links: draftStoreLinks,
      });
    }
    onClose();
  };

  // Bölüm başlık ve açıklamaları
  const titles: Record<StudioSectionType, string> = {
    header: 'Uygulama İkonu, Başlık ve Meta Bilgileri',
    description: 'Uygulama Tanıtım & Açıklama Metni (3 Dilli)',
    features: 'Öne Çıkan Özellik Kartları (3xN Grid)',
    store_links: 'İndirme ve Mağaza Kanalları',
    guide: 'Kullanım Kılavuzu (PDF) ve Hızlı İndir Butonu',
    versions: 'Sürüm Yönetimi',
  };

  return (
    <div className="studio-floating-backdrop" onClick={onClose}>
      <div 
        className="studio-floating-dialog" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Başlık Çubuğu */}
        <div className="studio-floating-header">
          <div className="studio-floating-title">
            <span>✏️ {titles[section] || 'Bölüm Düzenle'}</span>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="studio-floating-close-btn"
            title="Kapat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Gövde Form Alanları */}
        <div className="studio-floating-body">
          {/* 1. HEADER (İkon, Başlık, Platform, Kategori) */}
          {section === 'header' && (
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

              {/* 3 Dilli Başlıklar */}
              <div className="studio-lang-box">
                <span className="studio-lang-tag" style={{ background: '#1e3a8a', color: '#bfdbfe' }}>
                  TR (Türkçe Başlık)
                </span>
                <input
                  type="text"
                  value={draftNameTr}
                  onChange={(e) => setDraftNameTr(e.target.value)}
                  placeholder="Uygulama adı..."
                  className="studio-input"
                />
              </div>

              <div className="studio-lang-box">
                <span className="studio-lang-tag" style={{ background: '#075985', color: '#bae6fd' }}>
                  EN (English Name)
                </span>
                <input
                  type="text"
                  value={draftNameEn}
                  onChange={(e) => setDraftNameEn(e.target.value)}
                  placeholder="App name in English..."
                  className="studio-input"
                />
              </div>

              <div className="studio-lang-box" dir="rtl">
                <span className="studio-lang-tag" style={{ background: '#065f46', color: '#a7f3d0' }}>
                  AR (العربية - اسم التطبيق)
                </span>
                <input
                  type="text"
                  value={draftNameAr}
                  onChange={(e) => setDraftNameAr(e.target.value)}
                  placeholder="اسم التطبيق بالعربية..."
                  className="studio-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="studio-form-group">
                  <label className="studio-label">Kategori</label>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value)}
                    className="studio-select"
                  >
                    <option value="Mobil">Mobil</option>
                    <option value="Masaüstü">Masaüstü</option>
                    <option value="Web">Web</option>
                    <option value="Araçlar">Araçlar</option>
                  </select>
                </div>

                <div className="studio-form-group">
                  <label className="studio-label">Platform</label>
                  <select
                    value={draftPlatform}
                    onChange={(e) => setDraftPlatform(e.target.value)}
                    className="studio-select"
                  >
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                    <option value="Android & iOS">Android & iOS</option>
                    <option value="Windows">Windows</option>
                    <option value="Web">Web</option>
                    <option value="all">Tüm Platformlar</option>
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
              </div>
            </>
          )}

          {/* 2. DESCRIPTION (Açıklama Metinleri) */}
          {section === 'description' && (
            <>
              <div className="studio-lang-box">
                <span className="studio-lang-tag" style={{ background: '#1e3a8a', color: '#bfdbfe' }}>
                  TR (Türkçe Açıklama)
                </span>
                <textarea
                  rows={4}
                  value={draftDescTr}
                  onChange={(e) => setDraftDescTr(e.target.value)}
                  placeholder="Uygulama hakkında detaylı açıklama..."
                  className="studio-textarea"
                />
              </div>

              <div className="studio-lang-box">
                <span className="studio-lang-tag" style={{ background: '#075985', color: '#bae6fd' }}>
                  EN (English Description)
                </span>
                <textarea
                  rows={4}
                  value={draftDescEn}
                  onChange={(e) => setDraftDescEn(e.target.value)}
                  placeholder="Application description in English..."
                  className="studio-textarea"
                />
              </div>

              <div className="studio-lang-box" dir="rtl">
                <span className="studio-lang-tag" style={{ background: '#065f46', color: '#a7f3d0' }}>
                  AR (العربية - الوصف)
                </span>
                <textarea
                  rows={4}
                  value={draftDescAr}
                  onChange={(e) => setDraftDescAr(e.target.value)}
                  placeholder="وصف التطبيق بالعربية..."
                  className="studio-textarea"
                />
              </div>
            </>
          )}

          {/* 3. GUIDE & DİLLER (Kılavuz ve İndir Butonu) */}
          {section === 'guide' && (
            <>
              <div className="studio-form-group">
                <label className="studio-label">Kullanım Kılavuzu (PDF) İndirme Linki</label>
                <input
                  type="url"
                  value={draftGuideUrl}
                  onChange={(e) => setDraftGuideUrl(e.target.value)}
                  placeholder="https://msklabs.org/docs/rehber.pdf"
                  className="studio-input"
                />
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                  Geçerli bir URL girildiğinde vitrindeki "📖 Kullanım Kılavuzu İndir" butonu aktif olur.
                </span>
              </div>
            </>
          )}

          {/* 4. FEATURES (3xN Özellik Kartları) */}
          {section === 'features' && (
            <AppStudioFeatureCardEditor
              cards={draftFeatureCards}
              activeIdx={activeCardIdx}
              onSelectIdx={setActiveCardIdx}
              onAddCard={handleAddFeatureCard}
              onRemoveCard={handleRemoveCard}
              onUpdateCard={handleUpdateCard}
            />
          )}

          {/* 5. STORE LINKS (Mağaza ve İndirme Bağlantıları) */}
          {section === 'store_links' && (
            <>
              <div className="studio-form-group">
                <label className="studio-label">▶️ Google Play Store URL</label>
                <input
                  type="url"
                  value={draftStoreLinks.google_play || ''}
                  onChange={(e) => setDraftStoreLinks({ ...draftStoreLinks, google_play: e.target.value })}
                  placeholder="https://play.google.com/store/apps/details?id=..."
                  className="studio-input"
                />
              </div>

              <div className="studio-form-group">
                <label className="studio-label">🐙 GitHub Doğrudan APK URL</label>
                <input
                  type="url"
                  value={draftStoreLinks.github || ''}
                  onChange={(e) => setDraftStoreLinks({ ...draftStoreLinks, github: e.target.value })}
                  placeholder="https://github.com/.../app.apk"
                  className="studio-input"
                />
              </div>

              <div className="studio-form-group">
                <label className="studio-label">📁 Google Drive Doğrudan APK URL</label>
                <input
                  type="url"
                  value={draftStoreLinks.google_drive || ''}
                  onChange={(e) => setDraftStoreLinks({ ...draftStoreLinks, google_drive: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="studio-input"
                />
              </div>

              <div className="studio-form-group">
                <label className="studio-label">🍏 Apple App Store URL (Varsa)</label>
                <input
                  type="url"
                  value={draftStoreLinks.app_store || ''}
                  onChange={(e) => setDraftStoreLinks({ ...draftStoreLinks, app_store: e.target.value })}
                  placeholder="Boş bırakılırsa katı prosedür notu gösterilir"
                  className="studio-input"
                />
              </div>

              <div className="studio-form-group">
                <label className="studio-label">🌐 Web / PWA Çalıştırma URL</label>
                <input
                  type="url"
                  value={draftStoreLinks.web_url || ''}
                  onChange={(e) => setDraftStoreLinks({ ...draftStoreLinks, web_url: e.target.value })}
                  placeholder="https://..."
                  className="studio-input"
                />
              </div>
            </>
          )}
        </div>

        {/* Aksiyon Butonları (Vazgeç & Tamam / Uygula) */}
        <div className="studio-floating-footer">
          <button 
            type="button" 
            onClick={onClose} 
            className="studio-btn studio-btn-subtle"
          >
            Vazgeç
          </button>
          <button 
            type="button" 
            onClick={handleApply} 
            className="studio-btn studio-btn-primary"
          >
            <Check size={14} />
            <span>Tamam, Sayfaya Yerleştir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
