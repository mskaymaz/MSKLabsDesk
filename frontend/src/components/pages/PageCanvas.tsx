import React from 'react';
import type { PageFormData } from '../../types';
import { RichTextEditor } from '../ui/RichTextEditor';
import { CanvasSideAd } from './CanvasSideAd';

export interface PageCanvasProps {
  formData: PageFormData;
  activeTab: 'tr' | 'en' | 'ar';
  device: 'desktop' | 'tablet' | 'mobile';
  canvasTheme: 'light' | 'dark';
  canvasZoom: 'fit' | '100' | '75';
  canvasWidth?: '900' | '1024' | '1160' | '1200' | 'custom';
  customWidthPx?: number;
  showSideAds?: boolean;
  onContentChange: (val: string) => void;
  editorRef?: React.MutableRefObject<any>;
}

export const PageCanvas: React.FC<PageCanvasProps> = ({
  formData,
  activeTab,
  device,
  canvasTheme,
  canvasZoom,
  canvasWidth = '900',
  customWidthPx = 900,
  showSideAds = true,
  onContentChange,
  editorRef,
}) => {
  const isRtl = activeTab === 'ar';
  const desktopWidth = canvasWidth === 'custom' ? `${customWidthPx || 900}px` : `${canvasWidth}px`;
  const fixedWidth =
    device === 'mobile' ? '390px' : device === 'tablet' ? '768px' : desktopWidth;

  const currentContent =
    activeTab === 'tr' ? formData.content_tr : activeTab === 'en' ? formData.content_en : formData.content_ar;

  const scaleStyle: React.CSSProperties =
    canvasZoom === '75'
      ? { transform: 'scale(0.75)', transformOrigin: 'top center', marginBottom: '-25%' }
      : canvasZoom === 'fit'
      ? { transform: 'scale(0.85)', transformOrigin: 'top center', marginBottom: '-15%' }
      : {};

  return (
    <main
      className="studio-center-stage"
      data-theme={canvasTheme}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: canvasTheme === 'dark' ? '#090d16' : '#e2e8f0',
        overflow: 'hidden',
        position: 'relative',
        transition: 'background 0.2s ease',
      }}
    >
      {/* Tuval Kaydırma Sahnesi (Word / TipTap Paper Stage) */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          position: 'relative',
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '24px',
            ...scaleStyle,
          }}
        >
          {/* Sol Dikey Reklam Kanadı (120x600 Gökdelen) */}
          {device === 'desktop' && showSideAds && (
            <CanvasSideAd side="left" canvasTheme={canvasTheme} />
          )}

          {/* Merkez Sayfa Tuvali (Tam Biçimlendirilebilir Word Kağıt Tuvali) */}
          <div
            className="word-paper-canvas"
            data-theme={canvasTheme}
            style={{
              width: fixedWidth,
              minWidth: fixedWidth,
              maxWidth: fixedWidth,
              flexShrink: 0,
              background: canvasTheme === 'dark' ? '#0f172a' : '#ffffff',
              color: canvasTheme === 'dark' ? '#f8fafc' : '#0f172a',
              border: canvasTheme === 'dark' ? '1px solid #334155' : '1px solid #cbd5e1',
              borderRadius: device === 'desktop' ? '12px' : '18px',
              boxShadow:
                canvasTheme === 'dark'
                  ? '0 25px 50px -12px rgba(0,0,0,0.8)'
                  : '0 20px 45px -10px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              padding: device === 'mobile' ? '16px' : '28px 36px',
              minHeight: '750px',
              transition: 'background 0.2s ease, border-color 0.2s ease',
            }}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Zengin Metin Editörü: Başlık, Özet ve İçerik Tüm Araçlarla Doğrudan Düzenlenebilir */}
            <RichTextEditor
              value={currentContent || ''}
              onChange={onContentChange}
              dir={isRtl ? 'rtl' : 'ltr'}
              editorRef={editorRef}
              hideHeader={true}
            />
          </div>

          {/* Sağ Dikey Reklam Kanadı (120x600 Gökdelen) */}
          {device === 'desktop' && showSideAds && (
            <CanvasSideAd side="right" canvasTheme={canvasTheme} />
          )}
        </div>
      </div>
    </main>
  );
};
