import React from 'react';
import { Info, CheckCircle2, AlertTriangle, Flame, Palette } from 'lucide-react';

export interface AnnouncementItem {
  id: string;
  title: string;
  content_tr: string;
  content_en?: string;
  content_ar?: string;
  bannerType: 'info' | 'success' | 'warning' | 'purple' | 'custom';
  customBg?: string;
  customText?: string;
  placement?: 'top_hanging' | 'right_floating' | 'left_floating';
  sizePreset?: 'compact' | 'standard' | 'large';
  customHeight?: number;
  paddingY?: number;
  cardWidth?: number;
  cardHeight?: number;
  topOffset?: number;
  sideOffset?: number;
  tabText?: string;
  autoCollapseDelay?: number;
  opacity?: number;
  bgOpacity?: number;
  textOpacity?: number;
  glassEffect?: 'none' | 'blur';
  isDismissable: boolean;
  ctaText?: string;
  ctaUrl?: string;
  targetUrl?: string;
  isActive: boolean;
  displayMode?: 'static' | 'ticker' | 'rotator';
  tickerDirection?: 'rtl' | 'ltr';
  tickerSpeed?: 'slow' | 'normal' | 'fast';
}

export interface AnnouncementMeta {
  bannerType: 'info' | 'success' | 'warning' | 'purple' | 'custom';
  customBg?: string;
  customText?: string;
  placement?: 'top_hanging' | 'right_floating' | 'left_floating';
  sizePreset?: 'compact' | 'standard' | 'large';
  customHeight?: number;
  paddingY?: number;
  cardWidth?: number;
  cardHeight?: number;
  topOffset?: number;
  sideOffset?: number;
  tabText?: string;
  autoCollapseDelay?: number;
  opacity?: number;
  bgOpacity?: number;
  textOpacity?: number;
  glassEffect?: 'none' | 'blur';
  isDismissable: boolean;
  ctaText?: string;
  ctaUrl?: string;
  targetUrl?: string;
  displayMode?: 'static' | 'ticker' | 'rotator';
  tickerDirection?: 'rtl' | 'ltr';
  tickerSpeed?: 'slow' | 'normal' | 'fast';
  items?: AnnouncementItem[];
  activeItemId?: string;
}

export interface BannerThemeItem {
  id: 'info' | 'success' | 'warning' | 'purple' | 'custom';
  name: string;
  bgDark: string;
  bgLight: string;
  textColorDark: string;
  textColorLight: string;
  borderDark: string;
  borderLight: string;
  icon: React.ReactNode;
}

export const BANNER_THEMES: BannerThemeItem[] = [
  { id: 'info', name: 'Bilgi (Mavi)', bgDark: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,58,138,0.95) 100%)', bgLight: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', textColorDark: '#bfdbfe', textColorLight: '#1e40af', borderDark: '1px solid rgba(59, 130, 246, 0.4)', borderLight: '1px solid #bfdbfe', icon: React.createElement(Info, { size: 14 }) },
  { id: 'success', name: 'Kampanya (Yeşil)', bgDark: 'linear-gradient(135deg, rgba(2,44,34,0.95) 0%, rgba(6,95,70,0.95) 100%)', bgLight: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', textColorDark: '#a7f3d0', textColorLight: '#166534', borderDark: '1px solid rgba(168, 85, 247, 0.4)', borderLight: '1px solid #bbf7d0', icon: React.createElement(CheckCircle2, { size: 14 }) },
  { id: 'warning', name: 'Uyarı (Sarı)', bgDark: 'linear-gradient(135deg, rgba(69,26,3,0.95) 0%, rgba(120,53,15,0.95) 100%)', bgLight: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', textColorDark: '#fef08a', textColorLight: '#92400e', borderDark: '1px solid rgba(245, 158, 11, 0.4)', borderLight: '1px solid #fde68a', icon: React.createElement(AlertTriangle, { size: 14 }) },
  { id: 'purple', name: 'Lansman (Mor)', bgDark: 'linear-gradient(135deg, rgba(46,16,101,0.95) 0%, rgba(88,28,135,0.95) 100%)', bgLight: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)', textColorDark: '#e9d5ff', textColorLight: '#6b21a8', borderDark: '1px solid rgba(168, 85, 247, 0.4)', borderLight: '1px solid #e9d5ff', icon: React.createElement(Flame, { size: 14 }) },
  { id: 'custom', name: 'Özel Renk', bgDark: '#1e293b', bgLight: '#f8fafc', textColorDark: '#f8fafc', textColorLight: '#0f172a', borderDark: '1px solid #475569', borderLight: '1px solid #cbd5e1', icon: React.createElement(Palette, { size: 14 }) },
];

export const getSizeMetrics = (meta: Partial<AnnouncementMeta & AnnouncementItem>, placement: string = 'top_hanging') => {
  const p = meta.sizePreset || 'standard';
  const defaultY = p === 'compact' ? 1 : p === 'large' ? 3 : 2;
  const padY = meta.paddingY !== undefined ? meta.paddingY : defaultY;

  if (placement === 'top_hanging') {
    const minHeight = meta.customHeight || (p === 'compact' ? 26 : p === 'large' ? 48 : 34);
    const padX = p === 'compact' ? 10 : p === 'large' ? 16 : 12;
    const fontSize = p === 'compact' ? '11px' : p === 'large' ? '14px' : '12px';
    return { minHeight: `${minHeight}px`, padding: `${padY}px ${padX}px`, fontSize, width: '100%', padY };
  }
  const width = meta.cardWidth || (p === 'compact' ? 260 : p === 'large' ? 380 : 310);
  const height = meta.cardHeight ? `${meta.cardHeight}px` : 'auto';
  const topOffset = meta.topOffset ?? 110;
  const sideOffset = meta.sideOffset ?? 5;
  const tabText = meta.tabText || 'SİZİN İÇİN';
  const autoCollapseDelay = meta.autoCollapseDelay ?? 4;
  const padX = p === 'compact' ? 10 : p === 'large' ? 16 : 12;
  const cardPadY = meta.paddingY !== undefined ? meta.paddingY : (p === 'compact' ? 8 : p === 'large' ? 14 : 10);
  const fontSize = p === 'compact' ? '11px' : p === 'large' ? '14px' : '12px';
  const glassEffect = meta.glassEffect || 'none';
  return { width: `${width}px`, height, topOffset, sideOffset, tabText, autoCollapseDelay, glassEffect, padding: `${cardPadY}px ${padX}px`, fontSize, minHeight: 'auto', padY: cardPadY };
};
