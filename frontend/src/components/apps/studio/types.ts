import type { AppItem } from '../../../types';

export type StudioSectionType = 
  | 'header'          // İkon, İsim (TR/EN/AR), Platform, Kategoriler
  | 'description'     // Tanıtım açıklaması (TR/EN/AR)
  | 'features'        // 3xN Özellik kartları
  | 'store_links'     // Mağaza linkleri & indirme kanalları
  | 'guide'           // Kullanım kılavuzu PDF & buton ayarları
  | 'versions';       // Sürüm yönetimi

export type CanvasLang = 'tr' | 'en' | 'ar';

export interface AppStudioState {
  app: AppItem;
  canvasLang: CanvasLang;
  activeSection: StudioSectionType;
  isDirty: boolean;
  isSaving: boolean;
}
