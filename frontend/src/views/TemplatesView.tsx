import React, { useState, useEffect } from 'react';
import { Megaphone, LayoutTemplate, CheckCircle, Save, PlusCircle, Check, Info, Layers, Trash2, Sliders, Map } from 'lucide-react';
import type { SiteTemplate, AdPlacementSetting, AdPageMatrixConfig } from '../types';
import { api } from '../services/api';
import { useTranslation } from '../context/I18nContext';
import { AdStudioControls } from '../components/ads/AdStudioControls';
import { AdLiveCanvas } from '../components/ads/AdLiveCanvas';
import { AdPageMatrixMap } from '../components/ads/AdPageMatrixMap';
import { NewAdSlotModal } from '../components/modals/NewAdSlotModal';
import { AdSizeCatalogModal } from '../components/ads/AdSizeCatalogModal';
import { Switch } from '../components/ui/Input';
import { ADSENSE_MASTER_CATALOG, getEnabledPresets } from '../utils/adDimensions';
import { AnnouncementBarSection, type AnnouncementMeta } from '../components/templates/AnnouncementBarSection';

export const TemplatesView: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'ads' | 'announcement'>('ads');
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  // 1. Duyurular State
  const [announcementText, setAnnouncementText] = useState({ tr: '', en: '', ar: '' });
  const [announcementActive, setAnnouncementActive] = useState<boolean>(true);
  const [announcementMeta, setAnnouncementMeta] = useState<AnnouncementMeta>({
    bannerType: 'info',
    placement: 'top_hanging',
    isDismissable: true,
  });

  // 2. AdSense Reklam State
  const [ads, setAds] = useState<AdPlacementSetting[]>([]);
  const [selectedSlotKey, setSelectedSlotKey] = useState<string>('');
  const [studioDevice, setStudioDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [savingSlot, setSavingSlot] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [deletingSlot, setDeletingSlot] = useState<boolean>(false);

  // Sayfa-Reklam Dağılım Matrisi State
  const [adSubTab, setAdSubTab] = useState<'matrix' | 'controls'>('matrix');
  const [adMatrix, setAdMatrix] = useState<AdPageMatrixConfig>({});
  const [isSavingMatrix, setIsSavingMatrix] = useState<boolean>(false);

  // 3. AdSense Boyut Kataloğu ve Yeni Reklam Modalları
  const [enabledPresets, setEnabledPresets] = useState<string[]>(getEnabledPresets());
  const [showCatalogModal, setShowCatalogModal] = useState<boolean>(false);
  const [showNewSlotModal, setShowNewSlotModal] = useState<boolean>(false);

  // Global Publisher ID Yardımcısı
  const [globalClient, setGlobalClient] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [tmplRes, adsRes] = await Promise.all([
        api.getTemplates().catch(() => ({ templates: [] })),
        api.getAds().catch(() => ({ ads: [] })),
      ]);

      const list: SiteTemplate[] = tmplRes.templates || [];
      const ann = list.find((tItem) => tItem.key_name === 'announcement_bar');
      if (ann) {
        setAnnouncementText({
          tr: ann.content_tr || '',
          en: ann.content_en || '',
          ar: ann.content_ar || '',
        });
        setAnnouncementActive(ann.is_active !== undefined ? Boolean(ann.is_active) : true);
        if (ann.meta_json) {
          try {
            const parsed = typeof ann.meta_json === 'string' ? JSON.parse(ann.meta_json) : ann.meta_json;
            setAnnouncementMeta((prev) => ({ ...prev, ...parsed }));
          } catch (err) {
            console.error('Announcement meta_json parse error:', err);
          }
        }
      }

      const adsList: AdPlacementSetting[] = (adsRes as any)?.ads || (adsRes as any)?.data?.ads || [];
      setAds(adsList);
      if ((adsRes as any)?.matrix || (adsRes as any)?.data?.matrix) {
        setAdMatrix((adsRes as any).matrix || (adsRes as any).data.matrix);
      }

      if (adsList.length > 0 && !selectedSlotKey) {
        setSelectedSlotKey(adsList[0].slot_key);
      }

      const firstWithClient = adsList.find((a: any) => a.ad_client);
      if (firstWithClient) setGlobalClient(firstWithClient.ad_client);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentAd = ads.find((a) => a.slot_key === selectedSlotKey) || ads[0];

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateTemplate({
        key_name: 'announcement_bar',
        content_tr: announcementText.tr,
        content_en: announcementText.en,
        content_ar: announcementText.ar,
        meta_json: announcementMeta,
        is_active: announcementActive,
      });
      setMessage('Duyurular başarıyla kaydedildi.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || t('common.error'));
    }
  };

  const handleSaveCurrentAd = async () => {
    if (!currentAd) return;
    setSavingSlot(true);
    try {
      await api.updateAd(currentAd.slot_key, currentAd);
      setSavedSuccess(true);
      setMessage(`"${currentAd.title}" reklam ayarları kaydedildi.`);
      setTimeout(() => {
        setSavedSuccess(false);
        setMessage('');
      }, 3000);
    } catch (err: any) {
      alert(err.message || t('common.error'));
    } finally {
      setSavingSlot(false);
    }
  };

  const handleCurrentAdChange = (updated: AdPlacementSetting) => {
    setAds((prev) => prev.map((item) => (item.slot_key === updated.slot_key ? updated : item)));
  };

  const handleSaveMatrix = async (newMatrix: AdPageMatrixConfig) => {
    setIsSavingMatrix(true);
    try {
      await api.updateAdMatrix(newMatrix);
      setAdMatrix(newMatrix);
      setMessage('Sayfa reklam dağılım matrisi başarıyla kaydedildi.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Matris kaydedilemedi.');
    } finally {
      setIsSavingMatrix(false);
    }
  };

  const handleAddNewSlot = async (newSlot: AdPlacementSetting) => {
    await api.updateAd(newSlot.slot_key, newSlot);
    setAds((prev) => [...prev, newSlot]);
    setSelectedSlotKey(newSlot.slot_key);
    setMessage(`"${newSlot.title}" reklam alanı başarıyla oluşturuldu.`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDeleteCurrentAd = async () => {
    if (!currentAd) return;
    const ok = window.confirm(
      `"${currentAd.title}" reklam alanını silmek istediğinizden emin misiniz?`
    );
    if (!ok) return;

    setDeletingSlot(true);
    try {
      await api.deleteAd(currentAd.slot_key);
      const remaining = ads.filter((item) => item.slot_key !== currentAd.slot_key);
      setAds(remaining);
      setSelectedSlotKey(remaining.length > 0 ? remaining[0].slot_key : '');
      setMessage(`"${currentAd.title}" reklam alanı silindi.`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Reklam alanı silinemedi.');
    } finally {
      setDeletingSlot(false);
    }
  };

  const handleApplyGlobalClient = () => {
    if (!globalClient.trim()) return;
    setAds((prev) =>
      prev.map((item) => ({
        ...item,
        ad_client: globalClient.trim(),
      }))
    );
    setMessage(`Tüm alanlara "${globalClient.trim()}" uygulandı. Seçtiğiniz alanı kaydetmeyi unutmayın.`);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
      {/* ================= SABİT ÜST BÖLÜM (KULLANICININ İŞARET ETTİĞİ TÜM ALAN) ================= */}
      <div
        style={{
          position: 'sticky',
          top: '40px', // Topbar'ın hemen altı
          zIndex: 25,
          background: 'var(--bg-primary, #0B0F19)',
          paddingTop: '8px',
          paddingBottom: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {/* 1. Başlık ve AdSense Boyut Kataloğu Butonu */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1 className="admin-page-title" style={{ margin: 0, fontSize: '1.2rem' }}>
              Reklam & Duyuru Stüdyosu
            </h1>
            <p className="admin-page-desc" style={{ margin: '2px 0 0', fontSize: '0.76rem' }}>
              Reklam yerleşimleri (Açılır liste & canlı sahne) ve çok dilli duyurular
            </p>
          </div>

          {activeTab === 'ads' && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary admin-btn-sm"
              onClick={() => setShowCatalogModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '5px 12px' }}
              title="Google AdSense standart ebat kataloğunu yönet"
            >
              <Layers size={14} color="var(--accent-primary)" />
              <span>AdSense Boyut Kataloğu</span>
              <span className="admin-badge admin-badge-counter" style={{ fontSize: '0.7rem' }}>
                {enabledPresets.length}/{ADSENSE_MASTER_CATALOG.length}
              </span>
            </button>
          )}
        </div>

        {/* 2. Ana Sekmeler */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle, #334155)', paddingBottom: '2px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('ads')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', fontSize: '0.84rem',
              fontWeight: activeTab === 'ads' ? 600 : 500, background: activeTab === 'ads' ? 'var(--bg-card, #1e293b)' : 'transparent',
              color: activeTab === 'ads' ? 'var(--accent-primary, #6366f1)' : 'var(--text-secondary)', border: '1px solid',
              borderColor: activeTab === 'ads' ? 'var(--border-subtle, #334155)' : 'transparent',
              borderBottom: activeTab === 'ads' ? '2px solid var(--accent-primary, #6366f1)' : '2px solid transparent',
              borderRadius: '6px 6px 0 0', cursor: 'pointer',
            }}
          >
            <LayoutTemplate size={14} />
            <span>Reklam Stüdyosu</span>
            <span className="admin-badge admin-badge-counter">{ads.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcement')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', fontSize: '0.84rem',
              fontWeight: activeTab === 'announcement' ? 600 : 500, background: activeTab === 'announcement' ? 'var(--bg-card, #1e293b)' : 'transparent',
              color: activeTab === 'announcement' ? 'var(--accent-primary, #6366f1)' : 'var(--text-secondary)', border: '1px solid',
              borderColor: activeTab === 'announcement' ? 'var(--border-subtle, #334155)' : 'transparent',
              borderBottom: activeTab === 'announcement' ? '2px solid var(--accent-primary, #6366f1)' : '2px solid transparent',
              borderRadius: '6px 6px 0 0', cursor: 'pointer',
            }}
          >
            <Megaphone size={14} />
            <span>Duyurular</span>
          </button>
        </div>

        {/* 3. Reklam Yönetimi Alt Sekmeler & İçerik */}
        {activeTab === 'ads' && !loading && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <button
              type="button"
              onClick={() => setAdSubTab('matrix')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '0.84rem',
                fontWeight: adSubTab === 'matrix' ? 700 : 500, borderRadius: '6px', border: '1px solid',
                borderColor: adSubTab === 'matrix' ? 'var(--accent-primary, #6366f1)' : 'var(--border-subtle, #334155)',
                background: adSubTab === 'matrix' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                color: adSubTab === 'matrix' ? 'var(--accent-primary, #6366f1)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <Map size={15} /> 🗺️ Sayfa Dağılım Haritası
            </button>
            <button
              type="button"
              onClick={() => setAdSubTab('controls')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '0.84rem',
                fontWeight: adSubTab === 'controls' ? 700 : 500, borderRadius: '6px', border: '1px solid',
                borderColor: adSubTab === 'controls' ? 'var(--accent-primary, #6366f1)' : 'var(--border-subtle, #334155)',
                background: adSubTab === 'controls' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                color: adSubTab === 'controls' ? 'var(--accent-primary, #6366f1)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <Sliders size={15} /> ⚙️ Reklam Ebat & Marj Ayarları
            </button>
          </div>
        )}

        {/* 3.A: Sayfa Dağılım Haritası Görünümü */}
        {activeTab === 'ads' && !loading && adSubTab === 'matrix' && (
          <AdPageMatrixMap
            ads={ads}
            matrix={adMatrix}
            onSaveMatrix={handleSaveMatrix}
            isSaving={isSavingMatrix}
          />
        )}

        {/* 3.B: Reklam Ebat & Marj Ayarları Görünümü */}
        {activeTab === 'ads' && !loading && adSubTab === 'controls' && (
          <div
            style={{
              background: 'var(--bg-card, #1e293b)',
              border: '1px solid var(--border-subtle, #334155)',
              borderRadius: 'var(--radius-md, 8px)',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            {/* Sol: Açılır Liste, Yeni Reklam ve Sil */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                📌 Reklam Yerleşimi:
              </label>
              <select
                className="form-select"
                value={selectedSlotKey}
                onChange={(e) => setSelectedSlotKey(e.target.value)}
                style={{ width: '270px', fontSize: '0.82rem', fontWeight: 600, padding: '4px 8px' }}
              >
                {ads.map((adItem) => (
                  <option key={adItem.slot_key} value={adItem.slot_key}>
                    {adItem.title} {adItem.is_enabled ? '●' : '○'}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={() => setShowNewSlotModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem' }}
                title="Yeni bir reklam alanı tanımla"
              >
                <PlusCircle size={13} />
                <span>+ Yeni Reklam</span>
              </button>

              {currentAd && (
                <button
                  type="button"
                  className="admin-btn admin-btn-danger admin-btn-sm"
                  onClick={handleDeleteCurrentAd}
                  disabled={deletingSlot}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', padding: '4px 8px' }}
                  title={`"${currentAd.title}" reklam alanını sil`}
                >
                  <Trash2 size={13} />
                  <span>{deletingSlot ? 'Siliniyor...' : 'Sil'}</span>
                </button>
              )}
            </div>

            {/* Sağ: Genel Aktiflik ve Kaydet Butonu */}
            {currentAd && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {currentAd.is_enabled ? 'Genel: Aktif' : 'Genel: Pasif'}
                  </span>
                  <Switch
                    checked={Boolean(currentAd.is_enabled)}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      const isVert = currentAd.slot_key.includes('sidebar');
                      handleCurrentAdChange({
                        ...currentAd,
                        is_enabled: checked,
                        desktop: { ...currentAd.desktop, is_enabled: checked ? true : currentAd.desktop?.is_enabled },
                        mobile: { ...currentAd.mobile, is_enabled: checked ? (!isVert) : currentAd.mobile?.is_enabled },
                      });
                    }}
                    aria-label="Genel aktiflik"
                  />
                </div>

                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={handleSaveCurrentAd}
                  disabled={savingSlot}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '5px 14px' }}
                >
                  {savedSuccess ? <Check size={14} color="#fff" /> : <Save size={14} />}
                  <span>{savedSuccess ? 'Kaydedildi' : savingSlot ? 'Kaydediliyor...' : 'Kaydet'}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {message && (
        <div
          style={{
            padding: '8px 14px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid var(--accent-emerald)',
            color: 'var(--accent-emerald)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
          }}
        >
          <CheckCircle size={15} />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>{t('common.loading')}</p>
      ) : activeTab === 'ads' ? (
        /* ================= HAREKETLİ ALT BÖLÜM (SCROLLABLE CONTENT) ================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Hızlı ca-pub-xxx Yardımcı Şeridi (Kibar, Tek Satırda) */}
          <div
            style={{
              background: 'var(--bg-secondary, #0f172a)',
              border: '1px solid var(--border-subtle, #334155)',
              borderRadius: '6px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Info size={14} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Tüm alanlara aynı <code>ca-pub-xxx</code> kimliğini uygulamak için:
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="ca-pub-1234567890"
                value={globalClient}
                onChange={(e) => setGlobalClient(e.target.value)}
                style={{ fontSize: '0.76rem', padding: '3px 8px', width: '180px' }}
              />
              <button
                type="button"
                className="admin-btn admin-btn-secondary admin-btn-sm"
                onClick={handleApplyGlobalClient}
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                Tümüne Dağıt
              </button>
            </div>
          </div>

          {/* Seçili Reklamın Kompakt Ayar Kontrolleri */}
          {currentAd && (
            <AdStudioControls
              ad={currentAd}
              onChange={handleCurrentAdChange}
              activeDevice={studioDevice}
              onDeviceChange={setStudioDevice}
              enabledPresets={enabledPresets}
            />
          )}

          {/* Gömülü Canlı Önizleme Sahnesi */}
          {currentAd && (
            <AdLiveCanvas
              ad={currentAd}
              activeDevice={studioDevice}
            />
          )}
        </div>
      ) : (
        /* ================= 4. ÇOK DİLLİ ZENGİN DUYURULAR ================= */
        <AnnouncementBarSection
          announcementText={announcementText}
          setAnnouncementText={setAnnouncementText}
          announcementActive={announcementActive}
          setAnnouncementActive={setAnnouncementActive}
          announcementMeta={announcementMeta}
          setAnnouncementMeta={setAnnouncementMeta}
          onSave={handleSaveAnnouncement}
        />
      )}

      {/* 5. Modallar */}
      <NewAdSlotModal
        isOpen={showNewSlotModal}
        onClose={() => setShowNewSlotModal(false)}
        onAdd={handleAddNewSlot}
        existingKeys={ads.map((a) => a.slot_key)}
      />

      <AdSizeCatalogModal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        enabledKeys={enabledPresets}
        onSave={(keys) => setEnabledPresets(keys)}
      />
    </div>
  );
};
