import React, { useState, useEffect } from 'react';
import { X, Sparkles, Rocket, AlertCircle, Check, Info } from 'lucide-react';
import type { AppItem } from '../../types';
import { api } from '../../services/api';

interface AppVersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  app: AppItem | null;
  onSaved: () => void;
}

export const AppVersionModal: React.FC<AppVersionModalProps> = ({
  isOpen,
  onClose,
  app,
  onSaved,
}) => {
  const [langTab, setLangTab] = useState<'tr' | 'en' | 'ar'>('tr');
  const [loading, setLoading] = useState(false);
  const [aiTranslating, setAiTranslating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    version_name: '',
    version_code: 1,
    download_url: '',
    platform: 'android',
    file_size_mb: 0,
    is_mandatory: false,
    changelog_tr: '',
    changelog_en: '',
    changelog_ar: '',
  });

  useEffect(() => {
    if (app && isOpen) {
      // Önceki en son sürümü tespit et
      const latestVer = app.versions && app.versions.length > 0 ? app.versions[0] : null;
      let nextCode = 1;
      let prevDownloadUrl = app.latest_download_url || '';

      if (latestVer) {
        nextCode = (latestVer.version_code || 1) + 1;
        if (!prevDownloadUrl && latestVer.download_url) {
          prevDownloadUrl = latestVer.download_url;
        }
      }

      setFormData({
        version_name: '',
        version_code: nextCode,
        download_url: prevDownloadUrl,
        platform: app.platform === 'all' ? 'android' : app.platform || 'android',
        file_size_mb: latestVer?.file_size_mb || 0,
        is_mandatory: false,
        changelog_tr: '',
        changelog_en: '',
        changelog_ar: '',
      });
      setErrorMsg(null);
    }
  }, [app, isOpen]);

  if (!isOpen || !app) return null;

  const handleAiTranslate = async () => {
    if (!formData.changelog_tr.trim()) {
      setErrorMsg('AI çevirisi için lütfen önce Türkçe Değişiklik Notlarını (Changelog) yazın.');
      return;
    }

    try {
      setAiTranslating(true);
      setErrorMsg(null);
      const res = await api.translatePostAI({
        title_tr: `Sürüm ${formData.version_name || 'Güncellemesi'} Notları`,
        content_tr: formData.changelog_tr,
      });

      if (res?.translation) {
        setFormData((prev) => ({
          ...prev,
          changelog_en: res.translation.content_en || prev.changelog_en,
          changelog_ar: res.translation.content_ar || prev.changelog_ar,
        }));
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'AI çevirisi tamamlanamadı.');
    } finally {
      setAiTranslating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.version_name.trim() || !formData.download_url.trim()) {
      setErrorMsg('Sürüm Adı (Örn: 1.2.0) ve İndirme Linki zorunludur.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg(null);
      await api.addAppVersion(app.id, formData);
      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Sürüm yayınlanırken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1060, padding: '16px' }}>
      <div className="admin-list-card" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', padding: '0', overflow: 'hidden', boxShadow: '0 20px 45px rgba(0,0,0,0.5)', border: '1px solid var(--border-color)' }}>
        
        {/* Başlık */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Rocket size={20} />
            </div>
            <div>
              <h2 className="admin-card-title" style={{ fontSize: '1.15rem', margin: 0 }}>
                Hızlı Sürüm Yayını: {app.name_tr}
              </h2>
              <span className="admin-link-subtle" style={{ fontSize: '0.8rem' }}>
                Kalıcı indirme linki değişmez, ziyaretçiler otomatik bu sürüme yönlendirilir
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="admin-btn admin-btn-sm" style={{ padding: '6px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Hata Mesajı */}
        {errorMsg && (
          <div style={{ margin: '12px 20px 0', padding: '10px 14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          <div style={{ padding: '10px 12px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
            <Info size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
            <span>Mevcut Yayındaki Sürüm: <strong>v{app.latest_version || '1.0.0'}</strong></span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Yeni Sürüm Adı *</label>
              <input
                type="text"
                required
                placeholder="Örn: 1.3.0"
                value={formData.version_name}
                onChange={(e) => setFormData({ ...formData, version_name: e.target.value })}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Sürüm Kodu (Build)</label>
              <input
                type="number"
                required
                value={formData.version_code}
                onChange={(e) => setFormData({ ...formData, version_code: parseInt(e.target.value) || 1 })}
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ fontWeight: 600 }}>Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="form-input"
                style={{ width: '100%' }}
              >
                <option value="android">Android (APK)</option>
                <option value="ios">iOS (IPA/TestFlight)</option>
                <option value="windows">Windows (EXE/MSI)</option>
                <option value="macos">macOS (DMG/PKG)</option>
                <option value="all">Evrensel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontWeight: 600 }}>İndirme Linki (Doğrudan URL / R2) *</label>
            <input
              type="url"
              required
              placeholder="https://media.msklabs.com/apps/haydinamaza-v1.3.0.apk"
              value={formData.download_url}
              onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
              className="form-input"
              style={{ width: '100%' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Önceki indirme bağlantısı varsayılan olarak korunmuştur. Sabit link kullanıyorsanız değiştirmeden bırakabilirsiniz.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dosya Boyutu (MB):</span>
              <input
                type="number"
                step="0.1"
                value={formData.file_size_mb}
                onChange={(e) => setFormData({ ...formData, file_size_mb: parseFloat(e.target.value) || 0 })}
                className="form-input"
                style={{ width: '80px', padding: '4px 8px' }}
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.is_mandatory}
                onChange={(e) => setFormData({ ...formData, is_mandatory: e.target.checked })}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Zorunlu Güncelleme (Force Update)</span>
            </label>
          </div>

          {/* Değişiklik Notları (Changelog) Çok Dilli & AI */}
          <div style={{ marginTop: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
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
                      padding: '4px 10px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAiTranslate}
                disabled={aiTranslating}
                className="admin-btn admin-btn-sm admin-btn-sparkle"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Sparkles size={14} />
                <span>{aiTranslating ? 'Gemini Çeviriyor...' : 'AI ile EN & AR Çevir'}</span>
              </button>
            </div>

            {langTab === 'tr' && (
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>Neler Yeni? (TR Değişiklik Notları)</label>
                <textarea
                  rows={4}
                  placeholder="- Ezan vakitleri bildirim motoru optimize edildi.&#10;- Kıble pusulası kalibrasyon hatası giderildi."
                  value={formData.changelog_tr}
                  onChange={(e) => setFormData({ ...formData, changelog_tr: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
            )}

            {langTab === 'en' && (
              <div>
                <label className="form-label" style={{ fontWeight: 600 }}>What's New? (EN Changelog)</label>
                <textarea
                  rows={4}
                  placeholder="- Optimized notification engine for prayer times.&#10;- Fixed Qibla compass calibration bug."
                  value={formData.changelog_en}
                  onChange={(e) => setFormData({ ...formData, changelog_en: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>
            )}

            {langTab === 'ar' && (
              <div dir="rtl">
                <label className="form-label" style={{ fontWeight: 600, textAlign: 'right' }}>ما الجديد في هذا الإصدار؟ (AR)</label>
                <textarea
                  rows={4}
                  placeholder="- تحسين محرك تنبيهات أوقات الصلاة.&#10;- إصلاح خطأ معايرة بوصلة القبلة."
                  value={formData.changelog_ar}
                  onChange={(e) => setFormData({ ...formData, changelog_ar: e.target.value })}
                  className="form-input"
                  style={{ width: '100%', resize: 'vertical', textAlign: 'right' }}
                />
              </div>
            )}
          </div>

          {/* Alt Butonlar */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <button type="button" onClick={onClose} className="admin-btn admin-btn-refresh admin-btn-md">
              Vazgeç
            </button>
            <button type="submit" disabled={loading} className="admin-btn admin-btn-primary admin-btn-md" style={{ background: '#10b981', borderColor: '#10b981' }}>
              <Check size={16} />
              <span>{loading ? 'Yayınlanıyor...' : 'Yeni Sürümü Anında Yayınla'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
