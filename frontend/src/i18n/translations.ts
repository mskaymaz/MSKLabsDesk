import type { Language, NamespaceTranslations } from './types';
import { trDict } from './locales/tr';
import { enDict } from './locales/en';
import { arDict } from './locales/ar';

export type { Language, NamespaceTranslations };

function createMergedDictionary(dict: NamespaceTranslations) {
  return {
    ...dict,
    logout: dict.common.logout,
    search: dict.common.search,
    filter: dict.common.filter,
    all: dict.common.all,
    save: dict.common.save,
    close: dict.common.close,
    cancel: dict.common.cancel,
    submit: dict.common.submit,
    copy: dict.common.copy,
    copied: dict.common.copied,
    status: dict.common.status,
    actions: dict.common.actions,
    loading: dict.common.loading,
    success: dict.common.success,
    error: dict.common.error,
    couponModalTitle: 'Hediye / Teşekkür Kuponu Tanımla',
    couponCode: 'Kupon Kodu',
    couponDiscount: 'İndirim / Hediye Oranı',
    generateCoupon: 'Kupon Oluştur & Gönder',
  };
}

export const translations: Record<Language, any> = {
  tr: createMergedDictionary(trDict),
  en: createMergedDictionary(enDict),
  ar: createMergedDictionary(arDict),
};
