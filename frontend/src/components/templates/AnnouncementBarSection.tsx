import React, { useState } from 'react';
import {
  Megaphone,
  Save,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Flame,
  X,
  ExternalLink,
  Sun,
  Moon,
  PanelTop,
  SidebarClose,
} from 'lucide-react';
import { Switch } from '../ui/Input';
import { RichTextEditor } from '../ui/RichTextEditor';

export interface AnnouncementMeta {
  bannerType: 'info' | 'success' | 'warning' | 'purple';
  placement?: 'top_hanging' | 'right_floating';
  isDismissable: boolean;
  ctaText?: string;
  ctaUrl?: string;
  targetUrl?: string;
}

export interface AnnouncementBarSectionProps {
  announcementText: { tr: string; en: string; ar: string };
  setAnnouncementText: React.Dispatch<React.SetStateAction<{ tr: string; en: string; ar: string }>>;
  announcementActive: boolean;
  setAnnouncementActive: React.Dispatch<React.SetStateAction<boolean>>;
  announcementMeta: AnnouncementMeta;
  setAnnouncementMeta: React.Dispatch<React.SetStateAction<AnnouncementMeta>>;
  onSave: (e: React.FormEvent) => void;
  saving?: boolean;
}

const BANNER_THEMES = [
  { id: 'info' as const, name: 'Bilgi (Mavi)', bgDark: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', bgLight: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', textColorDark: '#bfdbfe', textColorLight: '#1e3a8a', borderDark: '1px solid rgba(59, 130, 246, 0.4)', borderLight: '1px solid #93c5fd', icon: <Info size={14} /> },
  { id: 'success' as const, name: 'Kampanya (Yeşil)', bgDark: 'linear-gradient(135deg, #022c22 0%, #065f46 100%)', bgLight: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', textColorDark: '#a7f3d0', textColorLight: '#065f46', borderDark: '1px solid rgba(16, 185, 129, 0.4)', borderLight: '1px solid #6ee7b7', icon: <CheckCircle2 size={14} /> },
  { id: 'warning' as const, name: 'Uyarı (Sarı)', bgDark: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)', bgLight: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', textColorDark: '#fef08a', textColorLight: '#92400e', borderDark: '1px solid rgba(245, 158, 11, 0.4)', borderLight: '1px solid #fde047', icon: <AlertTriangle size={14} /> },
  { id: 'purple' as const, name: 'Lansman (Mor)', bgDark: 'linear-gradient(135deg, #2e1065 0%, #581c87 100%)', bgLight: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)', textColorDark: '#e9d5ff', textColorLight: '#581c87', borderDark: '1px solid rgba(168, 85, 247, 0.4)', borderLight: '1px solid #d8b4fe', icon: <Flame size={14} /> },
];

export const AnnouncementBarSection: React.FC<AnnouncementBarSectionProps> = ({
  announcementText,
  setAnnouncementText,
  announcementActive,
  setAnnouncementActive,
  announcementMeta,
  setAnnouncementMeta,
  onSave,
  saving = false,
}) => {
  const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'ar'>('tr');
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('light');

  const currentThemeObj =
    BANNER_THEMES.find((b) => b.id === announcementMeta.bannerType) || BANNER_THEMES[0];

  const currentPlacement = announcementMeta.placement || 'top_hanging';
  const currentPreviewHtml = announcementText[activeLangTab];
  const isDark = previewTheme === 'dark';

  return (
    <div className="admin-list-card" style={{ padding: '18px' }}>
      {/* 1. Üst Bar: Başlık ve Kaydet */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle, #334155)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Megaphone size={18} color="var(--accent-amber, #f59e0b)" />
          <div>
            <h2 className="admin-card-title" style={{ margin: 0, fontSize: '14px' }}>Duyuru ve Kampanya Yönetimi</h2>
            <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
              Web sitesinde üst askılı şerit veya sağ reklam üzeri kayan zengin duyuru paneli
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {announcementActive ? 'Yayında' : 'Pasif'}
            </span>
            <Switch
              checked={announcementActive}
              onChange={(e: any) => setAnnouncementActive(e.target.checked)}
              aria-label="Duyuru aktiflik anahtarı"
            />
          </div>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="admin-btn admin-btn-primary admin-btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
          >
            <Save size={13} />
            <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>

      {/* 2. Canlı Şerit Önizlemesi */}
      <div style={{ background: isDark ? '#0B0F19' : '#F1F5F9', border: '1px solid var(--border-subtle, #334155)', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
            <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
            <span>Canlı Önizleme ({currentPlacement === 'top_hanging' ? 'Üst Panel Altı Askılı' : 'Sağ Kenar Kayan Kart'})</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'inline-flex', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              {(['tr', 'en', 'ar'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLangTab(lang)}
                  style={{
                    padding: '2px 7px',
                    fontSize: '10px',
                    fontWeight: activeLangTab === lang ? 700 : 500,
                    border: 'none',
                    background: activeLangTab === lang ? 'var(--accent-primary)' : 'transparent',
                    color: activeLangTab === lang ? '#FFFFFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setPreviewTheme(isDark ? 'light' : 'dark')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 7px', fontSize: '10px', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              {isDark ? <Sun size={11} /> : <Moon size={11} />}
              <span>{isDark ? 'Açık' : 'Koyu'}</span>
            </button>
          </div>
        </div>

        {/* Simülasyon Konteyneri */}
        {currentPlacement === 'top_hanging' ? (
          /* A) ÜST ASKI DÜZENİ */
          <div
            dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
            style={{
              background: isDark ? currentThemeObj.bgDark : currentThemeObj.bgLight,
              color: isDark ? currentThemeObj.textColorDark : currentThemeObj.textColorLight,
              borderBottom: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight,
              borderRadius: '6px',
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '12px',
              fontWeight: 500,
              minHeight: '38px',
              opacity: announcementActive ? 1 : 0.45,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
              <span style={{ display: 'inline-flex', flexShrink: 0 }}>{currentThemeObj.icon}</span>
              <div
                style={{ flex: 1, maxHeight: '60px', overflow: 'hidden' }}
                dangerouslySetInnerHTML={{
                  __html: currentPreviewHtml || '<span style="opacity:0.6; font-style:italic;">(Duyuru içeriği henüz girilmedi...)</span>',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              {announcementMeta.ctaText && (
                <a
                  href={announcementMeta.ctaUrl || '#'}
                  onClick={(e) => e.preventDefault()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '2px 8px',
                    fontSize: '10px',
                    fontWeight: 700,
                    borderRadius: '12px',
                    background: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.08)',
                    color: 'inherit',
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <span>{announcementMeta.ctaText}</span>
                  <ExternalLink size={9} />
                </a>
              )}
              {announcementMeta.isDismissable && (
                <button type="button" style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, padding: '2px', cursor: 'pointer' }} title="Kapat">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* B) SAĞ KENAR / SAĞ REKLAM ÜZERİ KAYAN KART DÜZENİ */
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '10px 0' }}>
            {/* Arka plandaki sağ gökdelen reklam simülasyonu */}
            <div style={{ width: '80px', height: '140px', background: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '4px', border: '1px dashed #64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#64748b', textAlign: 'center', flexShrink: 0 }}>
              Sağ Reklam<br />(120x600)
            </div>

            {/* Kayan Duyuru Kartı */}
            <div
              dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
              style={{
                width: '280px',
                background: isDark ? currentThemeObj.bgDark : currentThemeObj.bgLight,
                color: isDark ? currentThemeObj.textColorDark : currentThemeObj.textColorLight,
                border: isDark ? currentThemeObj.borderDark : currentThemeObj.borderLight,
                borderRadius: '8px',
                padding: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                fontSize: '12px',
                opacity: announcementActive ? 1 : 0.45,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                  {currentThemeObj.icon}
                  <span>Öne Çıkan Duyuru</span>
                </div>
                {announcementMeta.isDismissable && (
                  <button type="button" style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, padding: '2px', cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                )}
              </div>

              <div
                style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '8px' }}
                dangerouslySetInnerHTML={{
                  __html: currentPreviewHtml || '<span style="opacity:0.6; font-style:italic;">(Zengin duyuru içeriği...)</span>',
                }}
              />

              {announcementMeta.ctaText && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '3px 10px', fontSize: '10px', fontWeight: 700, borderRadius: '12px', background: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', color: 'inherit' }}>
                    {announcementMeta.ctaText} ➔
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Yerleşim, Tema ve Etkileşim Seçenekleri */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px', padding: '12px', background: 'var(--bg-secondary, rgba(15, 23, 42, 0.4))', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        {/* Yerleşim Modu */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Duyuru Yerleşimi & Konumu
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setAnnouncementMeta({ ...announcementMeta, placement: 'top_hanging' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 10px',
                borderRadius: '6px',
                border: currentPlacement === 'top_hanging' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: currentPlacement === 'top_hanging' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontWeight: currentPlacement === 'top_hanging' ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <PanelTop size={14} color="var(--accent-primary)" />
              <div>
                <div style={{ fontWeight: 700 }}>Üst Panel Altı Askılı Şerit</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Sabit menünün altında tüm sayfalarda şerit olarak</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setAnnouncementMeta({ ...announcementMeta, placement: 'right_floating' })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 10px',
                borderRadius: '6px',
                border: currentPlacement === 'right_floating' ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                background: currentPlacement === 'right_floating' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '11px',
                fontWeight: currentPlacement === 'right_floating' ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <SidebarClose size={14} color="var(--accent-primary)" />
              <div>
                <div style={{ fontWeight: 700 }}>Sağ Kenar / Sağ Reklam Üzeri Kayan Kart</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Scroll kenarına yapışık, sağ reklamın üzerini örtebilir</div>
              </div>
            </button>
          </div>
        </div>

        {/* Bant Teması */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>Bant Teması</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            {BANNER_THEMES.map((theme) => {
              const isSelected = announcementMeta.bannerType === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setAnnouncementMeta({ ...announcementMeta, bannerType: theme.id })}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '11px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ color: theme.textColorDark }}>{theme.icon}</span>
                  <span>{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Etkileşim ve Tıklanabilir Linkler */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>Etkileşim ve Yönlendirme</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 8px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '11px', color: 'var(--text-primary)', marginBottom: '6px' }}>
            <input
              type="checkbox"
              checked={announcementMeta.isDismissable}
              onChange={(e) => setAnnouncementMeta({ ...announcementMeta, isDismissable: e.target.checked })}
            />
            <span>Ziyaretçi '✕' butonu ile kapatabilsin</span>
          </label>

          <input
            type="text"
            className="form-input"
            placeholder="Kart/Şerit Genel Tıklama URL'si (örn: /apps/deskpilot)"
            value={announcementMeta.targetUrl || ''}
            onChange={(e) => setAnnouncementMeta({ ...announcementMeta, targetUrl: e.target.value })}
            style={{ fontSize: '11px', height: '28px', marginBottom: '6px' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Buton Metni"
              value={announcementMeta.ctaText || ''}
              onChange={(e) => setAnnouncementMeta({ ...announcementMeta, ctaText: e.target.value })}
              style={{ fontSize: '11px', height: '28px' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Buton URL'si"
              value={announcementMeta.ctaUrl || ''}
              onChange={(e) => setAnnouncementMeta({ ...announcementMeta, ctaUrl: e.target.value })}
              style={{ fontSize: '11px', height: '28px' }}
            />
          </div>
        </div>
      </div>

      {/* 4. Reklam Panelleri Standardında Zengin İçerik Editörü */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Duyuru Tasarımı ve İçeriği ({activeLangTab.toUpperCase()}) — Zengin Editör
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Resim, başlık, vurgu kutusu, bağlantı ve simge ekleyebilirsiniz
            </div>
          </div>

          <div style={{ display: 'inline-flex', gap: '4px' }}>
            {(['tr', 'en', 'ar'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveLangTab(lang)}
                className={`admin-btn admin-btn-sm ${activeLangTab === lang ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                style={{ fontSize: '10px', height: '22px', padding: '0 8px' }}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <RichTextEditor
          key={`ann-${activeLangTab}`}
          preset="full"
          minHeight="140px"
          dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
          hideHeader={true}
          value={announcementText[activeLangTab]}
          onChange={(val) => setAnnouncementText((prev) => ({ ...prev, [activeLangTab]: val }))}
          placeholder={
            activeLangTab === 'tr'
              ? 'Duyuru başlığı, açıklaması, resim veya buton tasarımınızı oluşturunuz...'
              : activeLangTab === 'en'
              ? 'Create announcement heading, description, image or button design...'
              : 'أنشئ عنوان الإعلان والوصف والصور وتصميم الأزرار باللغة العربية...'
          }
        />
      </div>
    </div>
  );
};
