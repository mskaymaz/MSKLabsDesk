import React, { useState, useEffect } from 'react';
import { Megaphone, DollarSign, CheckCircle, Save, PlusCircle, Check, Info, Layers, Trash2 } from 'lucide-react';
import type { SiteTemplate, AdPlacementSetting } from '../types';
import { api } from '../services/api';
import { useTranslation } from '../context/I18nContext';
import { AdStudioControls } from '../components/ads/AdStudioControls';
import { AdLiveCanvas } from '../components/ads/AdLiveCanvas';
import { NewAdSlotModal } from '../components/modals/NewAdSlotModal';
import { AdSizeCatalogModal } from '../components/ads/AdSizeCatalogModal';
import { Switch } from '../components/ui/Input';
import { ADSENSE_MASTER_CATALOG, getEnabledPresets } from '../utils/adDimensions';

export const TemplatesView: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'ads' | 'announcement'>('ads');
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  // 1. Duyuru Bandı State
  const [announcementText, setAnnouncementText] = useState({ tr: '', en: '', ar: '' });
  const [announcementActive, setAnnouncementActive] = useState<boolean>(true);

  // 2. AdSense Reklam State
  const [ads, setAds] = useState<AdPlacementSetting[]>([]);
  const [selectedSlotKey, setSelectedSlotKey] = useState<string>('');
  const [studioDevice, setStudioDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [savingSlot, setSavingSlot] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [deletingSlot, setDeletingSlot] = useState<boolean>(false);

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
      }

      const adsList: AdPlacementSetting[] = (adsRes as any)?.ads || (adsRes as any)?.data?.ads || [];
      setAds(adsList);

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
        is_active: announcementActive,
      });
      setMessage('Duyuru bandı başarıyla kaydedildi.');
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
              Şablon & Reklam Stüdyosu
            </h1>
            <p className="admin-page-desc" style={{ margin: '2px 0 0', fontSize: '0.76rem' }}>
              Google AdSense yerleşimleri (Açılır liste & canlı sahne) ve çok dilli duyuru bandı
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
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'ads' ? 600 : 500,
              background: activeTab === 'ads' ? 'var(--bg-card, #1e293b)' : 'transparent',
              color: activeTab === 'ads' ? 'var(--accent-primary, #6366f1)' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: activeTab === 'ads' ? 'var(--border-subtle, #334155)' : 'transparent',
              borderBottom: activeTab === 'ads' ? '2px solid var(--accent-primary, #6366f1)' : '2px solid transparent',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
            }}
          >
            <DollarSign size={14} />
            <span>Google AdSense Reklam Stüdyosu</span>
            <span className="admin-badge admin-badge-counter">{ads.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('announcement')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              fontSize: '0.84rem',
              fontWeight: activeTab === 'announcement' ? 600 : 500,
              background: activeTab === 'announcement' ? 'var(--bg-card, #1e293b)' : 'transparent',
              color: activeTab === 'announcement' ? 'var(--accent-primary, #6366f1)' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: activeTab === 'announcement' ? 'var(--border-subtle, #334155)' : 'transparent',
              borderBottom: activeTab === 'announcement' ? '2px solid var(--accent-primary, #6366f1)' : '2px solid transparent',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
            }}
          >
            <Megaphone size={14} />
            <span>Duyuru Bandı (Header Banner)</span>
          </button>
        </div>

        {/* 3. Reklam Yerleşimi Kontrol Barı (Açılır Liste + Yeni Reklam + Sil + Aktiflik + Kaydet) */}
        {activeTab === 'ads' && !loading && (
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
                    onChange={(e) => handleCurrentAdChange({ ...currentAd, is_enabled: e.target.checked })}
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
              onDeviceChange={setStudioDevice}
            />
          )}
        </div>
      ) : (
        /* ================= 4. DUYURU BANDI ================= */
        <div className="admin-list-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle, #334155)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Megaphone size={18} color="var(--accent-amber, #f59e0b)" />
              <div>
                <h2 className="admin-card-title" style={{ margin: 0 }}>
                  Çok Dilli Site Üst Duyuru Bandı
                </h2>
                <p style={{ margin: '1px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Web sitesinin en üstünde kullanıcılara gösterilecek duyuru metinleri
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {announcementActive ? 'Yayında' : 'Pasif'}
              </span>
              <Switch
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                aria-label="Duyuru aktiflik anahtarı"
              />
            </div>
          </div>

          <form onSubmit={handleSaveAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>TR (Türkçe Duyuru)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Örn: Yeni DeskPilot 2.0 sürümü yayınlandı!"
                  value={announcementText.tr}
                  onChange={(e) => setAnnouncementText({ ...announcementText, tr: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>EN (English Announcement)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. New DeskPilot 2.0 has been released!"
                  value={announcementText.en}
                  onChange={(e) => setAnnouncementText({ ...announcementText, en: e.target.value })}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>AR (العربية - إعلان الموقع)</label>
                <input
                  type="text"
                  dir="rtl"
                  className="form-input"
                  placeholder="تم إطلاق الإصدار الجديد من ديسك بايلوت 2.0!"
                  value={announcementText.ar}
                  onChange={(e) => setAnnouncementText({ ...announcementText, ar: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button type="submit" className="admin-btn admin-btn-primary admin-btn-md">
                <Save size={14} /> {t('common.save')}
              </button>
            </div>
          </form>
        </div>
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
