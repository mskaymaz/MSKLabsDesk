import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeContext';

export interface CustomizerSettings {
  fontFamily: string;
  accentColor: string;
  cardPadding: 'compact' | 'standard' | 'spacious';
  borderRadius: 'sharp' | 'standard' | 'rounded' | 'pill';
  titleSize: 'small' | 'standard' | 'large';
  titleWeight: '500' | '600' | '700';
  fontScale: 'compact' | 'standard' | 'large';
}

export const DEFAULT_DARK_SETTINGS: CustomizerSettings = {
  fontFamily: 'system',
  accentColor: 'indigo',
  cardPadding: 'standard',
  borderRadius: 'standard',
  titleSize: 'standard',
  titleWeight: '600',
  fontScale: 'standard',
};

export const DEFAULT_LIGHT_SETTINGS: CustomizerSettings = {
  fontFamily: 'system',
  accentColor: 'indigo',
  cardPadding: 'standard',
  borderRadius: 'standard',
  titleSize: 'standard',
  titleWeight: '600',
  fontScale: 'standard',
};

export const FONT_OPTIONS = [
  { id: 'system', label: 'Sistem', family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { id: 'cairo', label: 'Cairo', family: "'Cairo', system-ui, sans-serif" },
  { id: 'inter', label: 'Inter', family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  { id: 'plus-jakarta', label: 'Jakarta', family: "'Plus Jakarta Sans', sans-serif" },
  { id: 'outfit', label: 'Outfit', family: "'Outfit', sans-serif" },
  { id: 'roboto', label: 'Roboto', family: "'Roboto', sans-serif" },
] as const;

export const ACCENT_OPTIONS = [
  { id: 'indigo', label: 'İndigo', hex: '#6366f1', primary: 'hsl(239, 84%, 67%)', hover: 'hsl(243, 75%, 59%)' },
  { id: 'blue', label: 'Mavi', hex: '#3b82f6', primary: 'hsl(217, 91%, 60%)', hover: 'hsl(221, 83%, 53%)' },
  { id: 'emerald', label: 'Zümrüt', hex: '#10b981', primary: 'hsl(160, 84%, 39%)', hover: 'hsl(161, 94%, 30%)' },
  { id: 'amber', label: 'Amber', hex: '#f59e0b', primary: 'hsl(38, 92%, 50%)', hover: 'hsl(32, 95%, 44%)' },
  { id: 'violet', label: 'Mor', hex: '#8b5cf6', primary: 'hsl(263, 70%, 66%)', hover: 'hsl(263, 75%, 58%)' },
  { id: 'rose', label: 'Gül Kurusu', hex: '#f43f5e', primary: 'hsl(346, 84%, 61%)', hover: 'hsl(346, 89%, 52%)' },
] as const;

export const PADDING_OPTIONS = [
  { id: 'compact', label: 'Kompakt (6px 10px)', value: '6px 10px' },
  { id: 'standard', label: 'Standart (8px 12px)', value: '8px 12px' },
  { id: 'spacious', label: 'Ferah (12px 16px)', value: '12px 16px' },
] as const;

export const RADIUS_OPTIONS = [
  { id: 'sharp', label: 'Keskin (4px / 3px)', card: '4px', btn: '3px', badge: '2px' },
  { id: 'standard', label: 'Standart (8px / 6px)', card: '8px', btn: '6px', badge: '4px' },
  { id: 'rounded', label: 'Yumuşak (12px / 8px)', card: '12px', btn: '8px', badge: '6px' },
  { id: 'pill', label: 'Oval (16px / Oval)', card: '16px', btn: '9999px', badge: '9999px' },
] as const;

export const TITLE_SIZE_OPTIONS = [
  { id: 'small', label: 'Küçük (0.82rem)', value: '0.82rem' },
  { id: 'standard', label: 'Standart (0.88rem)', value: '0.88rem' },
  { id: 'large', label: 'Büyük (0.95rem)', value: '0.95rem' },
] as const;

export const TITLE_WEIGHT_OPTIONS = [
  { id: '500', label: '500 (Orta)' },
  { id: '600', label: '600 (Yarı Kalın)' },
  { id: '700', label: '700 (Kalın)' },
] as const;

export const FONT_SCALE_OPTIONS = [
  { id: 'compact', label: '%92', value: '92%' },
  { id: 'standard', label: '%100', value: '100%' },
  { id: 'large', label: '%108', value: '108%' },
] as const;

function loadFromStorage(theme: 'dark' | 'light'): CustomizerSettings {
  const key = theme === 'dark' ? 'msk_customizer_dark' : 'msk_customizer_light';
  const defaults = theme === 'dark' ? DEFAULT_DARK_SETTINGS : DEFAULT_LIGHT_SETTINGS;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return { ...defaults, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return defaults;
}

function applyCustomizerStyles(settings: CustomizerSettings) {
  const root = document.documentElement;

  // Font Ailesi
  const font = FONT_OPTIONS.find((f) => f.id === settings.fontFamily) || FONT_OPTIONS[0];
  root.style.setProperty('--font-sans', font.family);

  // Vurgu Rengi
  const accent = ACCENT_OPTIONS.find((a) => a.id === settings.accentColor) || ACCENT_OPTIONS[0];
  root.style.setProperty('--accent-primary', accent.primary);
  root.style.setProperty('--accent-primary-hover', accent.hover);
  root.style.setProperty('--ring', accent.primary);
  root.style.setProperty('--border-focus', accent.primary);

  // Kart Dolgusu
  const pad = PADDING_OPTIONS.find((p) => p.id === settings.cardPadding) || PADDING_OPTIONS[1];
  root.style.setProperty('--admin-card-padding', pad.value);

  // Yuvarlaklık (Radius)
  const rad = RADIUS_OPTIONS.find((r) => r.id === settings.borderRadius) || RADIUS_OPTIONS[1];
  root.style.setProperty('--admin-card-radius', rad.card);
  root.style.setProperty('--admin-btn-radius', rad.btn);
  root.style.setProperty('--admin-badge-radius', rad.badge);

  // Başlık Boyutu & Ağırlığı
  const size = TITLE_SIZE_OPTIONS.find((s) => s.id === settings.titleSize) || TITLE_SIZE_OPTIONS[1];
  root.style.setProperty('--admin-title-size', size.value);
  root.style.setProperty('--admin-title-weight', settings.titleWeight || '600');

  // Font Ölçeği
  const scale = FONT_SCALE_OPTIONS.find((s) => s.id === settings.fontScale) || FONT_SCALE_OPTIONS[1];
  root.style.fontSize = scale.value;
}

interface CustomizerContextType {
  settings: CustomizerSettings;
  updateSetting: <K extends keyof CustomizerSettings>(key: K, value: CustomizerSettings[K]) => void;
  resetDefaults: () => void;
  isOpen: boolean;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  toggleCustomizer: () => void;
}

const CustomizerContext = createContext<CustomizerContextType | undefined>(undefined);

export const CustomizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<CustomizerSettings>(() => loadFromStorage(theme));

  // Tema değiştiğinde o temanın bağımsız ayarlarını yükle
  useEffect(() => {
    const loaded = loadFromStorage(theme);
    setSettings(loaded);
    applyCustomizerStyles(loaded);
  }, [theme]);

  // Ayar değiştiğinde kaydet ve uygula
  const updateSetting = useCallback(
    <K extends keyof CustomizerSettings>(key: K, value: CustomizerSettings[K]) => {
      setSettings((prev) => {
        const next = { ...prev, [key]: value };
        const storageKey = theme === 'dark' ? 'msk_customizer_dark' : 'msk_customizer_light';
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignore
        }
        applyCustomizerStyles(next);
        return next;
      });
    },
    [theme]
  );

  const resetDefaults = useCallback(() => {
    const defaults = theme === 'dark' ? DEFAULT_DARK_SETTINGS : DEFAULT_LIGHT_SETTINGS;
    const storageKey = theme === 'dark' ? 'msk_customizer_dark' : 'msk_customizer_light';
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setSettings(defaults);
    applyCustomizerStyles(defaults);
  }, [theme]);

  const openCustomizer = () => setIsOpen(true);
  const closeCustomizer = () => setIsOpen(false);
  const toggleCustomizer = () => setIsOpen((prev) => !prev);

  return (
    <CustomizerContext.Provider
      value={{
        settings,
        updateSetting,
        resetDefaults,
        isOpen,
        openCustomizer,
        closeCustomizer,
        toggleCustomizer,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
};

export const useCustomizer = () => {
  const ctx = useContext(CustomizerContext);
  if (!ctx) {
    throw new Error('useCustomizer must be used within CustomizerProvider');
  }
  return ctx;
};
