import React, { useState, useRef, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import {
  LayoutGrid,
  ChevronDown,
  Columns2,
  Columns3,
  HelpCircle,
  Info,
  Lightbulb,
  AlertTriangle,
} from 'lucide-react';

interface ComponentDropdownProps {
  editor: Editor;
}

export const ComponentDropdown: React.FC<ComponentDropdownProps> = ({ editor }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const insert2ColGrid = () => {
    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: 'gridBlock',
          attrs: { cols: 2 },
          content: [
            {
              type: 'gridColumn',
              content: [
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Özellik Başlığı 1' }] },
                { type: 'paragraph', content: [{ type: 'text', text: 'Açıklama metnini buraya yazınız...' }] },
              ],
            },
            {
              type: 'gridColumn',
              content: [
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Özellik Başlığı 2' }] },
                { type: 'paragraph', content: [{ type: 'text', text: 'Açıklama metnini buraya yazınız...' }] },
              ],
            },
          ],
        },
        { type: 'paragraph' },
      ])
      .run();
    setIsOpen(false);
  };

  const insert3ColGrid = () => {
    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: 'gridBlock',
          attrs: { cols: 3 },
          content: [
            {
              type: 'gridColumn',
              content: [
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Özellik 1' }] },
                { type: 'paragraph', content: [{ type: 'text', text: 'Kısa açıklama...' }] },
              ],
            },
            {
              type: 'gridColumn',
              content: [
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Özellik 2' }] },
                { type: 'paragraph', content: [{ type: 'text', text: 'Kısa açıklama...' }] },
              ],
            },
            {
              type: 'gridColumn',
              content: [
                { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Özellik 3' }] },
                { type: 'paragraph', content: [{ type: 'text', text: 'Kısa açıklama...' }] },
              ],
            },
          ],
        },
        { type: 'paragraph' },
      ])
      .run();
    setIsOpen(false);
  };

  const insertAccordion = () => {
    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: 'details',
          content: [
            { type: 'detailsSummary', content: [{ type: 'text', text: 'Sıkça Sorulan Soru Başlığı?' }] },
            { type: 'paragraph', content: [{ type: 'text', text: 'Sorunun ayrıntılı cevabını buraya yazınız...' }] },
          ],
        },
        { type: 'paragraph' },
      ])
      .run();
    setIsOpen(false);
  };

  const insertCallout = (type: 'info' | 'tip' | 'warning') => {
    editor
      .chain()
      .focus()
      .insertContent([
        {
          type: 'callout',
          attrs: { type },
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text:
                    type === 'warning'
                      ? 'Uyarı: Dikkat edilmesi gereken önemli bir detay...'
                      : type === 'tip'
                      ? 'İpucu: Kullanıcı deneyimini artıran bir pratik öneri...'
                      : 'Bilgi: Bu alana ilişkin genel açıklama notu...',
                },
              ],
            },
          ],
        },
        { type: 'paragraph' },
      ])
      .run();
    setIsOpen(false);
  };

  const menuItemStyle: React.CSSProperties = {
    padding: '6px 10px',
    textAlign: 'left',
    border: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="admin-btn admin-btn-secondary admin-btn-sm"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          height: '24px',
          padding: '0 6px',
          fontSize: '11px',
          fontWeight: 600,
          background: isOpen ? 'var(--accent-primary)' : 'transparent',
          color: isOpen ? '#FFFFFF' : 'var(--text-primary)',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        title="Bileşen Ekle (2'li / 3'lü Kartlar, SSS Akordeon, Vurgu Kutusu)"
      >
        <LayoutGrid size={13} />
        <span>Bileşen</span>
        <ChevronDown size={10} style={{ opacity: 0.7 }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 110,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: '6px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            padding: '4px',
            width: '190px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', padding: '4px 8px 2px' }}>
            Çoklu Kartlar
          </div>
          <button type="button" onClick={insert2ColGrid} style={menuItemStyle}>
            <Columns2 size={13} className="text-cyan" />
            <span>2'li Kart Düzeni</span>
          </button>
          <button type="button" onClick={insert3ColGrid} style={menuItemStyle}>
            <Columns3 size={13} className="text-cyan" />
            <span>3'lü Kart Düzeni</span>
          </button>

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '3px 0' }} />

          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', padding: '4px 8px 2px' }}>
            Akordeon & Açılır Yapılar
          </div>
          <button type="button" onClick={insertAccordion} style={menuItemStyle}>
            <HelpCircle size={13} style={{ color: '#10B981' }} />
            <span>SSS Akordeon Bloğu</span>
          </button>

          <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '3px 0' }} />

          <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', padding: '4px 8px 2px' }}>
            Vurgu / Callout Kutuları
          </div>
          <button type="button" onClick={() => insertCallout('info')} style={menuItemStyle}>
            <Info size={13} style={{ color: '#0284C7' }} />
            <span>Bilgi Kutusu</span>
          </button>
          <button type="button" onClick={() => insertCallout('tip')} style={menuItemStyle}>
            <Lightbulb size={13} style={{ color: '#10B981' }} />
            <span>İpucu Kutusu</span>
          </button>
          <button type="button" onClick={() => insertCallout('warning')} style={menuItemStyle}>
            <AlertTriangle size={13} style={{ color: '#EAB308' }} />
            <span>Uyarı Kutusu</span>
          </button>
        </div>
      )}
    </div>
  );
};
