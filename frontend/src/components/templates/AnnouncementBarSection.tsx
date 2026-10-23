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
} from 'lucide-react';
import { Switch } from '../ui/Input';
import { RichTextEditor } from '../ui/RichTextEditor';

export interface AnnouncementMeta {
  bannerType: 'info' | 'success' | 'warning' | 'purple';
  isDismissable: boolean;
  ctaText?: string;
  ctaUrl?: string;
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
  {
    id: 'info' as const,
    name: 'Bilgi (Mavi)',
    bgDark: 'linear-gradient(90deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)',
    bgLight: 'linear-gradient(90deg, #eff6ff 0%, #dbeafe 50%, #eff6ff 100%)',
    textColorDark: '#93c5fd',
    textColorLight: '#1e40af',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    icon: <Info size={14} />,
  },
  {
    id: 'success' as const,
    name: 'Kampanya (Yeşil)',
    bgDark: 'linear-gradient(90deg, #022c22 0%, #065f46 50%, #022c22 100%)',
    bgLight: 'linear-gradient(90deg, #ecfdf5 0%, #d1fae5 50%, #ecfdf5 100%)',
    textColorDark: '#6ee7b7',
    textColorLight: '#065f46',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    icon: <CheckCircle2 size={14} />,
  },
  {
    id: 'warning' as const,
    name: 'Uyarı (Sarı)',
    bgDark: 'linear-gradient(90deg, #451a03 0%, #78350f 50%, #451a03 100%)',
    bgLight: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)',
    textColorDark: '#fde047',
    textColorLight: '#92400e',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    icon: <AlertTriangle size={14} />,
  },
  {
    id: 'purple' as const,
    name: 'Lansman (Mor)',
    bgDark: 'linear-gradient(90deg, #2e1065 0%, #581c87 50%, #2e1065 100%)',
    bgLight: 'linear-gradient(90deg, #faf5ff 0%, #ede9fe 50%, #faf5ff 100%)',
    textColorDark: '#d8b4fe',
    textColorLight: '#5b21b6',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    icon: <Flame size={14} />,
  },
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
  const [previewTheme, setPreviewTheme] = useState<'dark' | 'light'>('dark');

  const currentThemeObj =
    BANNER_THEMES.find((b) => b.id === announcementMeta.bannerType) || BANNER_THEMES[0];

  const currentPreviewHtml = announcementText[activeLangTab];

  return (
    <div className="admin-list-card" style={{ padding: '18px' }}>
      {/* 1. Üst Bar: Başlık ve Kaydet */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle, #334155)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Megaphone size={18} color="var(--accent-amber, #f59e0b)" />
          <div>
            <h2 className="admin-card-title" style={{ margin: 0, fontSize: '14px' }}>Çok Dilli Site Üst Duyuru Bandı</h2>
            <p style={{ margin: '1px 0 0', fontSize: '11px', color: 'var(--text-secondary)' }}>
              Web sitesinin en üstünde tüm sayfalarda ziyaretçilere gösterilecek zengin duyuru şeridi
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
      <div style={{ background: previewTheme === 'dark' ? '#0B0F19' : '#F1F5F9', border: '1px solid var(--border-subtle, #334155)', borderRadius: '8px', padding: '10px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
            <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
            <span>Canlı Şerit Önizlemesi</span>
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
              onClick={() => setPreviewTheme(previewTheme === 'dark' ? 'light' : 'dark')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 7px', fontSize: '10px', border: '1px solid var(--border-subtle)', borderRadius: '4px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              {previewTheme === 'dark' ? <Sun size={11} /> : <Moon size={11} />}
              <span>{previewTheme === 'dark' ? 'Açık' : 'Koyu'}</span>
            </button>
          </div>
        </div>

        <div
          dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
          style={{
            background: previewTheme === 'dark' ? currentThemeObj.bgDark : currentThemeObj.bgLight,
            color: previewTheme === 'dark' ? currentThemeObj.textColorDark : currentThemeObj.textColorLight,
            border: currentThemeObj.border,
            borderRadius: '6px',
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            fontSize: '12px',
            fontWeight: 500,
            minHeight: '34px',
            opacity: announcementActive ? 1 : 0.45,
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
            <span style={{ display: 'inline-flex', flexShrink: 0 }}>{currentThemeObj.icon}</span>
            <div
              style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              dangerouslySetInnerHTML={{
                __html: currentPreviewHtml || '<span style="opacity: 0.6; font-style: italic;">(Duyuru metni henüz girilmedi...)</span>',
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
                  background: previewTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
                  color: 'inherit',
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                }}
              >
                <span>{announcementMeta.ctaText}</span>
                <ExternalLink size={9} />
              </a>
            )}

            {announcementMeta.isDismissable && (
              <button
                type="button"
                style={{ background: 'transparent', border: 'none', color: 'inherit', opacity: 0.7, cursor: 'pointer', padding: '2px', display: 'flex' }}
                title="Kapat"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Tema ve Etkileşim Seçenekleri */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '16px', padding: '12px', background: 'var(--bg-secondary, rgba(15, 23, 42, 0.4))', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
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
                    padding: '5px 8px',
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

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>Etkileşim ve Buton</label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 8px', background: 'var(--bg-card)', borderRadius: '6px', border: '1px solid var(--border-subtle)', cursor: 'pointer', fontSize: '11px', color: 'var(--text-primary)', marginBottom: '6px' }}>
            <input
              type="checkbox"
              checked={announcementMeta.isDismissable}
              onChange={(e) => setAnnouncementMeta({ ...announcementMeta, isDismissable: e.target.checked })}
            />
            <span>Ziyaretçi '✕' butonu ile bandı kapatabilsin</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Buton Metni (İsteğe bağlı)"
              value={announcementMeta.ctaText || ''}
              onChange={(e) => setAnnouncementMeta({ ...announcementMeta, ctaText: e.target.value })}
              style={{ fontSize: '11px', height: '28px' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Hedef URL (/blog/duyuru)"
              value={announcementMeta.ctaUrl || ''}
              onChange={(e) => setAnnouncementMeta({ ...announcementMeta, ctaUrl: e.target.value })}
              style={{ fontSize: '11px', height: '28px' }}
            />
          </div>
        </div>
      </div>

      {/* 4. Zengin Metin Duyuru Editörü */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Duyuru Metni ({activeLangTab.toUpperCase()}) — WYSIWYG Standart Editör
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
                {lang === 'tr' ? 'TR (Türkçe)' : lang === 'en' ? 'EN (English)' : 'AR (العربية)'}
              </button>
            ))}
          </div>
        </div>

        <RichTextEditor
          key={`ann-${activeLangTab}`}
          preset="inline"
          minHeight="48px"
          dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
          hideHeader={true}
          hideFooter={true}
          value={announcementText[activeLangTab]}
          onChange={(val) => setAnnouncementText((prev) => ({ ...prev, [activeLangTab]: val }))}
          placeholder={
            activeLangTab === 'tr'
              ? 'Türkçe duyuru metnini yazınız (Kalın, italik, bağlantı, yazı rengi veya sembol kullanabilirsiniz)...'
              : activeLangTab === 'en'
              ? 'Write announcement in English (Supports bold, italic, links, font colors and symbols)...'
              : 'اكتب نص الإعلان باللغة العربية (يدعم الخط العريض والمائل والروابط والألوان والرموز)...'
          }
        />
      </div>
    </div>
  );
};
