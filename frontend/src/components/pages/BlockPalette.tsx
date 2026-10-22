import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Layers,
  HelpCircle,
  Mail,
  Send,
  Table,
  Megaphone,
  Plus,
  Search,
} from 'lucide-react';
import type { StudioBlockType } from '../../types';

export interface BlockTemplateDef {
  type: StudioBlockType;
  title: string;
  category: 'core' | 'content' | 'marketing' | 'ads';
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export const BLOCK_TEMPLATES: BlockTemplateDef[] = [
  {
    type: 'hero',
    title: 'Hero / Karşılama Başlığı',
    category: 'core',
    description: 'Büyük başlık, slogan, arka plan ve aksiyon butonları.',
    icon: Sparkles,
  },
  {
    type: 'features_grid',
    title: '3\'lü / 4\'lü Özellik Kartları',
    category: 'content',
    description: 'Vizyon, ilkeler veya yetenekler ızgarası.',
    icon: Layers,
  },
  {
    type: 'faq_accordion',
    title: 'SSS Akordeon Listesi',
    category: 'content',
    description: 'Açılır-kapanır soru ve cevap blokları.',
    icon: HelpCircle,
  },
  {
    type: 'contact_card',
    title: 'İletişim & Destek Kutusu',
    category: 'content',
    description: 'E-posta, doğrudan iletişim kanalları ve bilgi kutusu.',
    icon: Mail,
  },
  {
    type: 'cta_banner',
    title: 'Eylem Çağrısı (CTA Şeridi)',
    category: 'marketing',
    description: 'Sayfa sonunda kullanıcıyı aksiyona sevk eden vurgulu şerit.',
    icon: Send,
  },
  {
    type: 'comparison_table',
    title: 'Karşılaştırma / Veri Tablosu',
    category: 'marketing',
    description: 'Özellik veya sürüm karşılaştırma tablosu.',
    icon: Table,
  },
  {
    type: 'rich_text',
    title: 'Serbest Zengin Metin',
    category: 'core',
    description: 'Paragraflar, başlıklar ve serbest format metin alanı.',
    icon: FileText,
  },
  {
    type: 'ad_hook',
    title: 'Sayfa Ortası Reklam Yuvası',
    category: 'ads',
    description: '8 yuvalı reklam sisteminden sayfa ortası reklam kancası.',
    icon: Megaphone,
  },
];

export interface BlockPaletteProps {
  onAddBlock: (type: StudioBlockType) => void;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<'all' | 'core' | 'content' | 'marketing' | 'ads'>('all');

  const filtered = BLOCK_TEMPLATES.filter((tmpl) => {
    const matchesSearch = tmpl.title.toLowerCase().includes(search.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'all' || tmpl.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <aside
      className="studio-palette-sidebar"
      style={{
        width: '270px',
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
      }}
    >
      {/* Palet Başlığı ve Arama */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 10px 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={15} className="text-cyan" />
          <span>Bileşen Kütüphanesi</span>
        </h3>

        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: '8px', top: '9px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bileşen ara..."
            className="admin-input"
            style={{ paddingLeft: '28px', fontSize: '11px', paddingBottom: '4px', paddingTop: '4px' }}
          />
        </div>

        {/* Kategori Filtresi */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '10px', overflowX: 'auto' }}>
          {(['all', 'core', 'content', 'marketing', 'ads'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCat(cat)}
              className={`admin-btn admin-btn-sm ${selectedCat === cat ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
              style={{ fontSize: '10px', padding: '2px 8px', textTransform: 'capitalize' }}
            >
              {cat === 'all' ? 'Tümü' : cat === 'core' ? 'Temel' : cat === 'content' ? 'İçerik' : cat === 'marketing' ? 'Aksiyon' : 'Reklam'}
            </button>
          ))}
        </div>
      </div>

      {/* Şablon Kartları Listesi */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.type}
              onClick={() => onAddBlock(item.type)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}
              className="palette-item-card"
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: 'var(--accent-primary)',
                }}
              >
                <Icon size={16} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.title}
                  </span>
                  <Plus size={13} className="text-cyan" />
                </div>
                <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
