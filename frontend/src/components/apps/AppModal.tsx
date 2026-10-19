import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Smartphone, Check, AlertCircle } from 'lucide-react';
import type { AppItem, AppStoreLinks, AppFeatureCard } from '../../types';
import { api } from '../../services/api';
import { AppModalLangFields } from './AppModalLangFields';
import { AppModalFeatureCards } from './AppModalFeatureCards';
import { AppModalCategorySelect } from './AppModalCategorySelect';

const normalizeMediaUrl = (url?: string) => (!url ? '' : url.startsWith('/media/') ? 'https://msklabs.org' + url : url);

interface AppModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingApp: AppItem | null;
  onSaved: () => void;
}

const INITIAL_APP_FORM = {
  app_id: '',
  name_tr: '',
  name_en: '',
  name_ar: '',
  description_tr: '',
  description_en: '',
  description_ar: '',
  features_tr: '',
  features_en: '',
  features_ar: '',
  icon_url: '',
  cover_url: '',
  category: 'utility',
  platform: 'all',
  display_order: 0,
  is_active: true,
  store_links: { google_play: '', app_store: '', github: '', web_url: '', direct_apk: '' } as AppStoreLinks,
  feature_cards: [] as AppFeatureCard[],
};

export const AppModal: React.FC<AppModalProps> = ({
  isOpen,
  onClose,
  editingApp,
  onSaved,
}) => {
  const [langTab, setLangTab] = useState<'tr' | 'en' | 'ar'>('tr');
  const [activeSection, setActiveSection] = useState<'general' | 'content' | 'features' | 'stores'>('general');
  const [loading, setLoading] = useState(false);
  const [aiTranslating, setAiTranslating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const iconFileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(INITIAL_APP_FORM);

  useEffect(() => {
    if (editingApp) {
      setFormData({
        app_id: editingApp.app_id || '',
        name_tr: editingApp.name_tr || '',
        name_en: editingApp.name_en || '',
        name_ar: editingApp.name_ar || '',
        description_tr: editingApp.description_tr || '',
        description_en: editingApp.description_en || '',
        description_ar: editingApp.description_ar || '',
        features_tr: editingApp.features_tr || '',
        features_en: editingApp.features_en || '',
        features_ar: editingApp.features_ar || '',
        icon_url: editingApp.icon_url || '',
        cover_url: editingApp.cover_url || '',
        category: editingApp.category || 'utility',
        platform: editingApp.platform || 'all',
        display_order: editingApp.display_order ?? 0,
        is_active: editingApp.is_active !== false,
        store_links: {
          google_play: editingApp.store_links?.google_play || '',
          app_store: editingApp.store_links?.app_store || '',
          github: editingApp.store_links?.github || '',
          web_url: editingApp.store_links?.web_url || '',
          direct_apk: editingApp.store_links?.direct_apk || '',
        },
        feature_cards: editingApp.feature_cards || [],
      });
    } else {
      setFormData(INITIAL_APP_FORM);
    }
    setErrorMsg(null);
  }, [editingApp, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'icon_url' | 'cover_url') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      const res = await api.uploadMedia(file, `${formData.name_tr || 'app'} ${field}`);
      if (res.data?.url) {
        setFormData((prev) => ({ ...prev, [field]: res.data.url }));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Görsel yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAiTranslate = async () => {
    if (!formData.name_tr || !formData.description_tr) {
      setErrorMsg('AI çevirisi için en azından Türkçe Başlık ve Açıklama doldurulmalıdır.');
      return;
    }
    try {
      setAiTranslating(true);
      setErrorMsg(null);
      const res = await api.translatePostAI({
        title_tr: formData.name_tr,
        content_tr: formData.description_tr,
        summary_tr: formData.features_tr || undefined,
      });
      if (res?.translation) {
        setFormData((prev) => ({
          ...prev,
          name_en: res.translation.title_en || prev.name_en,
          name_ar: res.translation.title_ar || prev.name_ar,
          description_en: res.translation.content_en || prev.description_en,
          description_ar: res.translation.content_ar || prev.description_ar,
          features_en: res.translation.summary_en || prev.features_en,
          features_ar: res.translation.summary_ar || prev.features_ar,
        }));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'AI çeviri işlemi tamamlanamadı.');
    } finally {
      setAiTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.app_id.trim() || !formData.name_tr.trim()) {
      setErrorMsg('Uygulama Kimliği (Slug) ve Türkçe Ad zorunludur.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      const payload = {
        ...formData,
        app_id: formData.app_id.toLowerCase().trim(),
        store_links_json: formData.store_links,
        feature_cards_json: formData.feature_cards,
      };

      if (editingApp) {
        await api.updateApp(editingApp.id, payload);
      } else {
        await api.createApp(payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050, padding: '16px' }}>
      <div className="admin-list-card" style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', padding: '0', overflow: 'hidden', boxShadow: '0 20px 45px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)' }}>
        
        {/* Modal Başlığı */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
              <Smartphone size={20} />
            </div>
            <div>
              <h2 className="admin-card-title" style={{ fontSize: '1.15rem', margin: 0 }}>
                {editingApp ? `Uygulamayı Düzenle: ${editingApp.name_tr}` : 'Yeni Uygulama Tanımla'}
              </h2>
              <span className="admin-link-subtle" style={{ fontSize: '0.8rem' }}>
                Vitrin tanıtımı, çok dilli metinler ve mağaza bağlantıları
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-btn admin-btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Sekme Seçici */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.15)', padding: '0 20px', flexWrap: 'wrap' }}>
          {[
            { id: 'general', label: '1. Temel Kimlik & Medya' },
            { id: 'content', label: '2. Tanıtım Metinleri' },
            { id: 'features', label: `3. Özellik Kartları (${formData.feature_cards?.length || 0})` },
            { id: 'stores', label: '4. Mağaza & İndirme' },
          ].map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id as any)}
              style={{
                padding: '12px 14px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: activeSection === sec.id ? 'var(--accent-primary)' : 'var(--text-muted)',
                borderBottom: activeSection === sec.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
              }}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {/* Hata Bildirimi */}
        {errorMsg && (
          <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Alanı (Kaydırılabilir) */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* BÖLÜM 1: TEMEL KİMLİK & MEDYA */}
          {activeSection === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Benzersiz ID / Slug *</label>
                  <input
                    type="text"
                    required
                    placeholder="haydinamaza"
                    value={formData.app_id}
                    onChange={(e) => setFormData({ ...formData, app_id: e.target.value })}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>URL: /api/v1/apps/{formData.app_id || ':slug'}/download</span>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600 }}>Hedef Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="form-input"
                    style={{ width: '100%' }}
                  >
                    <option value="all">Evrensel (Tüm Platformlar)</option>
                    <option value="android">Yalnızca Android</option>
                    <option value="ios">Yalnızca iOS</option>
                    <option value="windows">Windows Masaüstü</option>
                    <option value="web">Web Uygulaması (PWA)</option>
                  </select>
                </div>
              </div>

              {/* Çoklu Kategori Seçimi & Özel Kategori Ekleme */}
              <AppModalCategorySelect
                value={formData.category}
                onChange={(cat) => setFormData({ ...formData, category: cat })}
              />

              {/* Görsel Yüklemeleri */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '6px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>Uygulama İkonu</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {formData.icon_url ? (
                      <img src={normalizeMediaUrl(formData.icon_url)} alt="Icon" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Smartphone size={20} /></div>
                    )}
                    <input
                      type="text"
                      placeholder="https://.../icon.png"
                      value={formData.icon_url}
                      onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                      className="form-input"
                      style={{ flex: 1 }}
                    />
                    <input type="file" ref={iconFileRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'icon_url')} />
                    <button type="button" onClick={() => iconFileRef.current?.click()} className="admin-btn admin-btn-sm admin-btn-view" title="Cihazdan Yükle">
                      <Upload size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <label className="form-label" style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>Tanıtım Kapağı / Banner</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="https://.../cover.webp"
                      value={formData.cover_url}
                      onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                      className="form-input"
                      style={{ flex: 1 }}
                    />
                    <input type="file" ref={coverFileRef} accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, 'cover_url')} />
                    <button type="button" onClick={() => coverFileRef.current?.click()} className="admin-btn admin-btn-sm admin-btn-view" title="Cihazdan Yükle">
                      <Upload size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Durum & Sıralama */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Web Vitrinde Yayınlansın (Aktif)</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sıralama:</span>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    className="form-input"
                    style={{ width: '70px', padding: '4px 8px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* BÖLÜM 2: ÇOK DİLLİ TANITIM */}
          {activeSection === 'content' && (
            <AppModalLangFields
              langTab={langTab}
              setLangTab={setLangTab}
              formData={formData}
              setFormData={setFormData}
              onAiTranslate={handleAiTranslate}
              aiTranslating={aiTranslating}
            />
          )}

          {/* BÖLÜM 3: ÖZELLİK KARTLARI */}
          {activeSection === 'features' && (
            <AppModalFeatureCards
              cards={formData.feature_cards || []}
              onChange={(cards) => setFormData((prev) => ({ ...prev, feature_cards: cards }))}
              onAiTranslate={api.translatePostAI}
            />
          )}

          {/* BÖLÜM 4: MAĞAZA VE İNDİRME LİNKLERİ */}
          {activeSection === 'stores' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>
                Ziyaretçilerin doğrudan mağazalara veya depoya yönlendirilmesi için ilgili bağlantıları girin. Boş bırakılanlar web vitrininde gizlenir.
              </p>

              {[
                { key: 'google_play', label: 'Google Play Store URL', ph: 'https://play.google.com/store/apps/details?id=...' },
                { key: 'app_store', label: 'Apple App Store URL', ph: 'https://apps.apple.com/app/...' },
                { key: 'github', label: 'GitHub Deposu URL', ph: 'https://github.com/mskaymaz/...' },
                { key: 'direct_apk', label: 'Doğrudan APK / İndirme URL (Örn: R2 Sabit Link)', ph: 'https://media.msklabs.com/apps/...apk' },
                { key: 'web_url', label: 'Web Canlı Vitrin / PWA URL', ph: 'https://haydinamaza.msklabs.com' },
              ].map((item) => (
                <div key={item.key}>
                  <label className="form-label" style={{ fontWeight: 600 }}>{item.label}</label>
                  <input
                    type="url"
                    placeholder={item.ph}
                    value={(formData.store_links as any)[item.key] || ''}
                    onChange={(e) => setFormData({ ...formData, store_links: { ...formData.store_links, [item.key]: e.target.value } })}
                    className="form-input"
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Alt Aksiyon Butonları */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" onClick={onClose} className="admin-btn admin-btn-refresh admin-btn-md">
              Vazgeç
            </button>
            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary admin-btn-md">
              <Check size={16} />
              <span>{loading ? 'Kaydediliyor...' : editingApp ? 'Değişiklikleri Güncelle' : 'Uygulamayı Kaydet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
