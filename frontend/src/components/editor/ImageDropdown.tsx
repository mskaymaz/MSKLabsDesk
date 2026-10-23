import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import {
  Image as ImageIcon,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Plus,
  Upload,
  Link as LinkIcon,
  Loader2,
} from 'lucide-react';
import { api } from '../../services/api';

interface ImageDropdownProps {
  editor: Editor | null;
}

export const ImageDropdown: React.FC<ImageDropdownProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [layout, setLayout] = useState<'left' | 'right' | 'center' | 'full'>('center');
  const [width, setWidth] = useState('100%');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const formH = 390;
      const formW = 300;
      let top = rect.bottom + 4;
      if (top + formH > window.innerHeight - 16) {
        top = Math.max(60, window.innerHeight - formH - 16);
      }
      const left = Math.max(16, Math.min(window.innerWidth - formW - 16, rect.left));
      setPopoverPos({ top, left });
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen]);

  if (!editor) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Görsel boyutu 5 MB sınırını aşamaz.');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviewSrc(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInsertImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let finalSrc = url.trim();

    if (tab === 'upload') {
      if (!selectedFile) {
        setErrorMsg('Lütfen bilgisayarınızdan bir görsel seçin.');
        return;
      }

      setIsUploading(true);
      try {
        const res = await api.uploadMedia(selectedFile, alt.trim() || selectedFile.name);
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (res.success && res.data?.url && !isLocalhost) {
          finalSrc = res.data.url;
        } else {
          // Yerel dev ortamında CDN URL'i çözümlenemeyeceği için Base64 DataURL ile doğrudan göster
          finalSrc = previewSrc || res.data?.url || '';
        }
      } catch (err: any) {
        // Yerel dev ortamında veya offline durumda kullanıcıyı engellememek için veri URL'i fallback'i
        console.warn('Medya API yükleme uyarısı (yerel veri URL kullanılıyor):', err);
        finalSrc = previewSrc || '';
      } finally {
        setIsUploading(false);
      }
    }

    if (!finalSrc) {
      setErrorMsg('Görsel kaynağı geçersiz.');
      return;
    }

    editor
      .chain()
      .focus()
      .setImageWithLayout({
        src: finalSrc,
        alt: alt.trim() || undefined,
        layout,
        width: layout === 'full' ? '100%' : width,
      })
      .run();

    setUrl('');
    setAlt('');
    setSelectedFile(null);
    setPreviewSrc(null);
    setIsOpen(false);
  };

  const choiceBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '4px 6px',
    fontSize: '11px',
    border: '1px solid var(--border-card)',
    borderRadius: '4px',
    background: active ? 'var(--accent-primary)' : 'var(--bg-secondary)',
    color: active ? '#FFFFFF' : 'var(--text-primary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    justifyContent: 'center',
  });

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        title="Görsel Yerleşim Menüsü"
        style={{
          padding: '4px 8px',
          border: '1px solid var(--border-card)',
          borderRadius: '4px',
          background: 'transparent',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          height: '26px',
          fontSize: '12px',
        }}
      >
        <ImageIcon size={14} />
        <span>Görsel</span>
        <ChevronDown size={11} style={{ opacity: 0.7 }} />
      </button>

      {isOpen && (
        <form
          onSubmit={handleInsertImage}
          style={{
            position: 'fixed',
            top: popoverPos ? `${popoverPos.top}px` : '100px',
            left: popoverPos ? `${popoverPos.left}px` : '100px',
            width: '300px',
            maxHeight: 'calc(100vh - 90px)',
            overflowY: 'auto',
            background: 'var(--bg-card, #1F2937)',
            border: '1px solid var(--border-card-hover, rgba(99, 102, 241, 0.4))',
            borderRadius: '8px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
            zIndex: 10002,
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Başlık ve Kapat Butonu */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>Görsel Ekle / Yerleştir</span>
            <button type="button" onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', lineHeight: 1, padding: '2px' }} title="Kapat">✕</button>
          </div>

          {/* Üst Sekmeler: Dosya Yükle / URL */}
          <div style={{ display: 'flex', gap: '3px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
            <button
              type="button"
              onClick={() => setTab('upload')}
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: tab === 'upload' ? 700 : 500,
                border: 'none',
                borderRadius: '4px',
                background: tab === 'upload' ? 'var(--accent-primary)' : 'transparent',
                color: tab === 'upload' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <Upload size={12} /> Bilgisayardan Seç
            </button>
            <button
              type="button"
              onClick={() => setTab('url')}
              style={{
                flex: 1,
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: tab === 'url' ? 700 : 500,
                border: 'none',
                borderRadius: '4px',
                background: tab === 'url' ? 'var(--accent-primary)' : 'transparent',
                color: tab === 'url' ? '#FFFFFF' : 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <LinkIcon size={12} /> Web Bağlantısı (URL)
            </button>
          </div>

          {/* Dosya Yükleme Alanı */}
          {tab === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '1px dashed var(--border-card)',
                  borderRadius: '6px',
                  padding: '12px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'var(--bg-secondary)',
                }}
              >
                {previewSrc ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                    <img
                      src={previewSrc}
                      alt="Önizleme"
                      style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, display: 'block', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                        {selectedFile?.name}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {selectedFile ? (selectedFile.size / 1024).toFixed(0) + ' KB' : ''}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <Upload size={16} style={{ color: 'var(--accent-cyan)' }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      Görsel seçmek için tıklayın
                    </span>
                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                      PNG, JPEG, WebP, SVG (Azami 5 MB)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <input
              type="url"
              placeholder="Görsel Bağlantısı (https://...)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="admin-filter-input"
              style={{ width: '100%', height: '28px', padding: '0 8px', fontSize: '12px' }}
            />
          )}

          <input
            type="text"
            placeholder="Açıklama / Alt Metin (İsteğe bağlı)"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="admin-filter-input"
            style={{ width: '100%', height: '28px', padding: '0 8px', fontSize: '12px' }}
          />

          {/* Metin Sarma & Yerleşim */}
          <div>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              METİN YERLEŞİMİ (WORD SARMA)
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <button
                type="button"
                style={choiceBtnStyle(layout === 'left')}
                onClick={() => setLayout('left')}
                title="Metni Saran - Sola Yaslı"
              >
                <AlignLeft size={11} /> Sola Sar
              </button>
              <button
                type="button"
                style={choiceBtnStyle(layout === 'right')}
                onClick={() => setLayout('right')}
                title="Metni Saran - Sağa Yaslı"
              >
                <AlignRight size={11} /> Sağa Sar
              </button>
              <button
                type="button"
                style={choiceBtnStyle(layout === 'center')}
                onClick={() => setLayout('center')}
                title="Satır Açan Blok - Ortalı"
              >
                <AlignCenter size={11} /> Ortalı Blok
              </button>
              <button
                type="button"
                style={choiceBtnStyle(layout === 'full')}
                onClick={() => setLayout('full')}
                title="Tam Genişlik"
              >
                <Maximize2 size={11} /> Tam Genişlik
              </button>
            </div>
          </div>

          {/* Boyutlandırma */}
          {layout !== 'full' && (
            <div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                GENİŞLİK
              </span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {['25%', '50%', '75%', '100%'].map((w) => (
                  <button
                    key={w}
                    type="button"
                    style={{ ...choiceBtnStyle(width === w), flex: 1 }}
                    onClick={() => setWidth(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <span style={{ fontSize: '11px', color: 'var(--danger, #EF4444)', display: 'block' }}>
              {errorMsg}
            </span>
          )}

          <button
            type="submit"
            disabled={isUploading}
            style={{
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: 600,
              background: 'var(--accent-primary)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '4px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '4px',
            }}
          >
            {isUploading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Yükleniyor...</span>
              </>
            ) : (
              <>
                <Plus size={13} />
                <span>{tab === 'upload' ? 'Yükle & Belgeye Ekle' : 'Belgeye Ekle'}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
