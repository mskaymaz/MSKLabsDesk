import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language } from '../i18n/translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, any>) => string;
  dir: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getNestedValue(obj: any, path: string): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  // Try direct key match first (flat key)
  if (typeof obj[path] === 'string') return obj[path];

  // Try dot path lookup
  const parts = path.split('.');
  let curr = obj;
  for (const part of parts) {
    if (curr && typeof curr === 'object' && part in curr) {
      curr = curr[part];
    } else {
      return undefined;
    }
  }
  return typeof curr === 'string' ? curr : undefined;
}

function interpolate(text: string, params?: Record<string, any>): string {
  if (!params || typeof params !== 'object') return text;
  let result = text;
  for (const [k, v] of Object.entries(params)) {
    const val = v !== undefined && v !== null ? String(v) : '';
    result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), val);
    result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), val);
  }
  return result;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('msk_admin_lang') as Language;
    return (saved && ['tr', 'en', 'ar'].includes(saved)) ? saved : 'tr';
  });

  const dir: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('msk_admin_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    if (dir === 'rtl') {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    let raw = getNestedValue(translations[language], key);
    if (!raw && language !== 'tr') {
      raw = getNestedValue(translations.tr, key);
    }
    if (!raw) {
      if (import.meta.env?.DEV) {
        console.warn(`[i18n] Missing key: "${key}" in lang "${language}"`);
      }
      raw = key;
    }
    return interpolate(raw, params);
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};
