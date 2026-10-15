import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTheme } from './ThemeContext';
import {
  type ThemeMetrics,
  type CustomizerSection,
  DEFAULT_DARK_METRICS,
  DEFAULT_LIGHT_METRICS,
  AVAILABLE_FONTS,
  clampMetric,
  METRIC_BOUNDS,
} from '../components/customizer/types';

function loadMetricsFromStorage(theme: 'dark' | 'light'): ThemeMetrics {
  const key = theme === 'dark' ? 'msk_customizer_dark' : 'msk_customizer_light';
  const defaults = theme === 'dark' ? DEFAULT_DARK_METRICS : DEFAULT_LIGHT_METRICS;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaults, ...parsed };
    }
  } catch {
    // fallback
  }
  return defaults;
}

function applyMetricsToDOM(metrics: ThemeMetrics) {
  const root = document.documentElement;

  // 1. Genel Renkler
  root.style.setProperty('--accent-primary', metrics.accentPrimary);
  root.style.setProperty('--accent-primary-hover', metrics.accentHover);
  root.style.setProperty('--ring', metrics.accentPrimary);
  root.style.setProperty('--border-focus', metrics.accentPrimary);

  // 2. Buton Rol Renkleri (8-digit hex ile saydamlık)
  const applyBtnColor = (prefix: string, hex: string) => {
    const cleanHex = hex.startsWith('#') && hex.length === 7 ? hex : '#6366f1';
    root.style.setProperty(`--${prefix}-color`, cleanHex);
    root.style.setProperty(`--${prefix}-bg`, `${cleanHex}24`);
    root.style.setProperty(`--${prefix}-border`, `${cleanHex}55`);
    root.style.setProperty(`--${prefix}-hover`, `${cleanHex}40`);
    root.style.setProperty(`--${prefix}-border-hover`, `${cleanHex}88`);
  };
  applyBtnColor('btn-view', metrics.btnViewColor);
  applyBtnColor('btn-success', metrics.btnSuccessColor);
  applyBtnColor('btn-danger', metrics.btnDangerColor);
  applyBtnColor('btn-edit', metrics.btnEditColor);

  // 3. Başlık Tipografisi
  const hFont = AVAILABLE_FONTS.find((f) => f.id === metrics.headingFont) || AVAILABLE_FONTS[0];
  root.style.setProperty('--admin-heading-font', hFont.family);
  root.style.setProperty('--admin-title-size', `${metrics.cardTitleSize}px`);
  root.style.setProperty('--admin-page-title-size', `${metrics.pageTitleSize}px`);
  root.style.setProperty('--admin-title-weight', String(metrics.titleWeight));
  root.style.setProperty('--admin-title-color', metrics.titleColor);

  // 4. Gövde & Açıklama Tipografisi
  const bFont = AVAILABLE_FONTS.find((f) => f.id === metrics.bodyFont) || AVAILABLE_FONTS[0];
  root.style.setProperty('--admin-body-font', bFont.family);
  root.style.setProperty('--font-sans', bFont.family);
  root.style.setProperty('--admin-desc-size', `${metrics.descSize}px`);
  root.style.setProperty('--admin-desc-color', metrics.descColor);
  root.style.setProperty('--admin-meta-size', `${metrics.metaSize}px`);

  // 5. Kartlar
  root.style.setProperty('--admin-card-padding-v', `${metrics.cardPaddingV}px`);
  root.style.setProperty('--admin-card-padding-h', `${metrics.cardPaddingH}px`);
  root.style.setProperty('--admin-card-radius', `${metrics.cardRadius}px`);
  root.style.setProperty('--admin-card-bg', metrics.cardBg);
  root.style.setProperty('--admin-card-border', metrics.cardBorder);

  // 6. Butonlar (Geometrik Emniyet: Maks 12px clamp)
  const safeBtnRadius = Math.min(Math.max(metrics.btnRadius, 0), 12);
  root.style.setProperty('--admin-btn-radius', `${safeBtnRadius}px`);
  root.style.setProperty('--admin-btn-padding-v', `${metrics.btnPaddingV}px`);
  root.style.setProperty('--admin-btn-padding-h', `${metrics.btnPaddingH}px`);
  root.style.setProperty('--admin-btn-font-size', `${metrics.btnFontSize}px`);

  // 7. Rozetler (Geometrik Emniyet: Maks 9px clamp)
  const safeBadgeRadius = Math.min(Math.max(metrics.badgeRadius, 0), 9);
  root.style.setProperty('--admin-badge-radius', `${safeBadgeRadius}px`);
  root.style.setProperty('--admin-badge-padding-v', `${metrics.badgePaddingV}px`);
  root.style.setProperty('--admin-badge-padding-h', `${metrics.badgePaddingH}px`);
  root.style.setProperty('--admin-badge-font-size', `${metrics.badgeFontSize}px`);

  // 8. Token & Takip Kodları (MSK-2026-EZRD, #73_LLUNA)
  root.style.setProperty('--admin-token-size', `${metrics.tokenSize}px`);
  root.style.setProperty('--admin-token-weight', String(metrics.tokenWeight));
  root.style.setProperty('--admin-token-color', metrics.tokenColor);
  root.style.setProperty('--admin-token-spacing', metrics.tokenSpacing);

  // 9. Genel Ölçek
  root.style.fontSize = `${metrics.fontScale}%`;
}

interface CustomizerContextType {
  metrics: ThemeMetrics;
  updateMetric: <K extends keyof ThemeMetrics>(key: K, value: ThemeMetrics[K]) => void;
  resetDefaults: () => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => void;
  isOpen: boolean;
  openCustomizer: () => void;
  closeCustomizer: () => void;
  toggleCustomizer: () => void;
  activeSection: CustomizerSection;
  setActiveSection: (sec: CustomizerSection) => void;
}

const CustomizerContext = createContext<CustomizerContextType | undefined>(undefined);

export const CustomizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<CustomizerSection>('colors');
  const [metrics, setMetrics] = useState<ThemeMetrics>(() => loadMetricsFromStorage(theme));

  // Tema değiştiğinde o temanın bağımsız ayarlarını yükle ve DOM'a uygula
  useEffect(() => {
    const loaded = loadMetricsFromStorage(theme);
    setMetrics(loaded);
    applyMetricsToDOM(loaded);
  }, [theme]);

  // Ayar değiştiğinde kaydet ve uygula
  const updateMetric = useCallback(
    <K extends keyof ThemeMetrics>(key: K, value: ThemeMetrics[K]) => {
      setMetrics((prev) => {
        let finalVal = value;
        if (typeof value === 'number' && key in METRIC_BOUNDS) {
          finalVal = clampMetric(key as any, value) as any;
        }
        const next = { ...prev, [key]: finalVal };
        const storageKey = theme === 'dark' ? 'msk_customizer_dark' : 'msk_customizer_light';
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          // ignore
        }
        applyMetricsToDOM(next);
        return next;
      });
    },
    [theme]
  );

  const resetDefaults = useCallback(() => {
    const defaults = theme === 'dark' ? DEFAULT_DARK_METRICS : DEFAULT_LIGHT_METRICS;
    const storageKey = theme === 'dark' ? 'msk_customizer_dark' : 'msk_customizer_light';
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
    setMetrics(defaults);
    applyMetricsToDOM(defaults);
  }, [theme]);

  const exportJSON = useCallback(() => {
    const jsonStr = JSON.stringify(metrics, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `msklabs-theme-${theme}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [metrics, theme]);

  const importJSON = useCallback(
    (jsonString: string) => {
      const parsed = JSON.parse(jsonString);
      const defaults = theme === 'dark' ? DEFAULT_DARK_METRICS : DEFAULT_LIGHT_METRICS;
      const merged: ThemeMetrics = { ...defaults, ...parsed };

      // Geometrik sınırları doğrula
      for (const [k] of Object.entries(METRIC_BOUNDS)) {
        if (typeof (merged as any)[k] === 'number') {
          (merged as any)[k] = clampMetric(k as any, (merged as any)[k]);
        }
      }

      setMetrics(merged);
      const storageKey = theme === 'dark' ? 'msk_customizer_dark' : 'msk_customizer_light';
      try {
        localStorage.setItem(storageKey, JSON.stringify(merged));
      } catch {
        // ignore
      }
      applyMetricsToDOM(merged);
    },
    [theme]
  );

  return (
    <CustomizerContext.Provider
      value={{
        metrics,
        updateMetric,
        resetDefaults,
        exportJSON,
        importJSON,
        isOpen,
        openCustomizer: () => setIsOpen(true),
        closeCustomizer: () => setIsOpen(false),
        toggleCustomizer: () => setIsOpen((prev) => !prev),
        activeSection,
        setActiveSection,
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
