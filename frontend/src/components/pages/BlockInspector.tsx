import React from 'react';
import {
  SlidersHorizontal,
  X,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Plus,
} from 'lucide-react';
import type { StudioBlock, StudioBlockItem } from '../../types';

export interface BlockInspectorProps {
  block: StudioBlock | null;
  onUpdate: (patch: Partial<StudioBlock>) => void;
  onDelete: (id: string) => void;
  onClone: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onClose: () => void;
  lang: 'tr' | 'en' | 'ar';
}

export const BlockInspector: React.FC<BlockInspectorProps> = ({
  block,
  onUpdate,
  onDelete,
  onClone,
  onMoveUp,
  onMoveDown,
  onClose,
  lang,
}) => {
  if (!block) {
    return (
      <aside
        className="studio-inspector-sidebar"
        style={{
          width: '300px',
          background: 'var(--bg-sidebar)',
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          flexShrink: 0,
        }}
      >
        <SlidersHorizontal size={28} style={{ opacity: 0.4, marginBottom: '12px' }} />
        <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
          Özellik Denetçisi
        </h4>
        <p style={{ margin: 0, fontSize: '11px', lineHeight: 1.5 }}>
          Özelliklerini, boşluklarını ve renklerini düzenlemek için tuval üzerindeki herhangi bir bloğa tıklayın.
        </p>
      </aside>
    );
  }

  const titleField = lang === 'tr' ? 'title_tr' : lang === 'en' ? 'title_en' : 'title_ar';
  const subtitleField = lang === 'tr' ? 'subtitle_tr' : lang === 'en' ? 'subtitle_en' : 'subtitle_ar';
  const contentField = lang === 'tr' ? 'content_tr' : lang === 'en' ? 'content_en' : 'content_ar';

  const currentTitle = block[titleField] || '';
  const currentSubtitle = block[subtitleField] || '';
  const currentContent = block[contentField] || '';

  const addItem = () => {
    const newItem: StudioBlockItem = {
      id: `it_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      title: lang === 'tr' ? 'Yeni Madde Başlığı' : lang === 'en' ? 'New Item Title' : 'عنوان بند جديد',
      text: lang === 'tr' ? 'Açıklama metni buraya yazılır.' : lang === 'en' ? 'Description text goes here.' : 'نص الشرح هنا.',
    };
    onUpdate({ items: [...(block.items || []), newItem] });
  };

  const updateItem = (itemId: string, patch: Partial<StudioBlockItem>) => {
    onUpdate({
      items: (block.items || []).map((it) => (it.id === itemId ? { ...it, ...patch } : it)),
    });
  };

  const removeItem = (itemId: string) => {
    onUpdate({
      items: (block.items || []).filter((it) => it.id !== itemId),
    });
  };

  return (
    <aside
      className="studio-inspector-sidebar"
      style={{
        width: '310px',
        background: 'var(--bg-sidebar)',
        borderLeft: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
      }}
    >
      {/* Üst Denetçi Başlığı */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="admin-badge admin-badge-cyan" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
            {block.type.replace('_', ' ')}
          </span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
            Blok Özellikleri
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="admin-btn-icon"
          title="Kapat"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Denetçi Gövdesi */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Hızlı Eylemler (Taşı, Çoğalt, Sil) */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '8px' }}>
          <button
            type="button"
            onClick={() => onMoveUp(block.id)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ flex: 1, padding: '4px' }}
            title="Yukarı Taşı"
          >
            <ArrowUp size={13} />
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(block.id)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ flex: 1, padding: '4px' }}
            title="Aşağı Taşı"
          >
            <ArrowDown size={13} />
          </button>
          <button
            type="button"
            onClick={() => onClone(block.id)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
            style={{ flex: 1, padding: '4px' }}
            title="Bloğu Çoğalt"
          >
            <Copy size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(block.id)}
            className="admin-btn admin-btn-danger admin-btn-sm"
            style={{ flex: 1, padding: '4px' }}
            title="Bloğu Sil"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* 1. Metin İçerik Alanları */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label className="admin-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            İçerik Metinleri ({lang.toUpperCase()})
          </label>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Blok Başlığı:</span>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => onUpdate({ [titleField]: e.target.value })}
              className="admin-input"
              style={{ fontSize: '12px', marginTop: '2px' }}
              placeholder="Başlık giriniz..."
            />
          </div>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Alt Başlık / Slogan:</span>
            <input
              type="text"
              value={currentSubtitle}
              onChange={(e) => onUpdate({ [subtitleField]: e.target.value })}
              className="admin-input"
              style={{ fontSize: '12px', marginTop: '2px' }}
              placeholder="İsteğe bağlı alt başlık..."
            />
          </div>

          {block.type === 'rich_text' && (
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Metin Gövdesi:</span>
              <textarea
                rows={5}
                value={currentContent}
                onChange={(e) => onUpdate({ [contentField]: e.target.value })}
                className="admin-input"
                style={{ fontSize: '12px', marginTop: '2px', resize: 'vertical' }}
              />
            </div>
          )}

          {block.type === 'ad_hook' && (
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bağlanacak Reklam Yuvası:</span>
              <select
                value={block.ad_slot_key || 'ad_in_content'}
                onChange={(e) => onUpdate({ ad_slot_key: e.target.value })}
                className="admin-select"
                style={{ fontSize: '12px', marginTop: '2px' }}
              >
                <option value="ad_in_content">Sayfa Ortası 1 (ad_in_content)</option>
                <option value="ad_in_content_2">Sayfa Ortası 2 (ad_in_content_2)</option>
                <option value="ad_footer_bottom">Sayfa Sonu Altı (ad_footer_bottom)</option>
              </select>
            </div>
          )}
        </div>

        {/* 2. Maddeler / Kartlar Yöneticisi (Varsa) */}
        {block.items && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="admin-label" style={{ fontSize: '11px', textTransform: 'uppercase', margin: 0 }}>
                Maddeler ({block.items.length})
              </label>
              <button
                type="button"
                onClick={addItem}
                className="admin-btn admin-btn-secondary admin-btn-sm"
                style={{ fontSize: '10px', padding: '2px 6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={11} />
                <span>Ekle</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {block.items.map((item, idx) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: '6px',
                    padding: '8px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)' }}>
                      #{idx + 1}
                    </span>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItem(item.id, { title: e.target.value })}
                      placeholder="Madde başlığı"
                      style={{
                        flex: 1,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        fontSize: '11px',
                        padding: '3px 6px',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="admin-btn-icon"
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <Trash2 size={12} className="text-rose" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={item.text}
                    onChange={(e) => updateItem(item.id, { text: e.target.value })}
                    placeholder="Madde açıklaması..."
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '4px',
                      fontSize: '11px',
                      padding: '3px 6px',
                      color: 'var(--text-primary)',
                      resize: 'vertical',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Tasarım Token'ları (Boşluk, Renk, Yuvarlaklık) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          <label className="admin-label" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Tasarım & Boşluk Ayarları
          </label>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dikey Boşluk (Padding Y):</span>
            <select
              value={block.padding_y || 'md'}
              onChange={(e) => onUpdate({ padding_y: e.target.value as any })}
              className="admin-select"
              style={{ fontSize: '11px', marginTop: '2px' }}
            >
              <option value="none">Sıfır Boşluk (0px)</option>
              <option value="sm">Kompakt (16px)</option>
              <option value="md">Standart (32px)</option>
              <option value="lg">Geniş (48px)</option>
            </select>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Arka Plan Kart Stili:</span>
            <select
              value={block.bg_variant || 'default'}
              onChange={(e) => onUpdate({ bg_variant: e.target.value as any })}
              className="admin-select"
              style={{ fontSize: '11px', marginTop: '2px' }}
            >
              <option value="default">Varsayılan Kart (bg-card)</option>
              <option value="surface">İkincil Yüzey (bg-secondary)</option>
              <option value="gradient">Vurgulu Gradyan</option>
              <option value="muted">Şeffaf / Düz Metin</option>
            </select>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Köşe Yuvarlaklığı:</span>
            <select
              value={block.border_radius || 'md'}
              onChange={(e) => onUpdate({ border_radius: e.target.value as any })}
              className="admin-select"
              style={{ fontSize: '11px', marginTop: '2px' }}
            >
              <option value="none">Keskin (0px)</option>
              <option value="sm">Hafif (6px)</option>
              <option value="md">Standart (12px)</option>
              <option value="lg">Yuvarlak (20px)</option>
            </select>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Metin Hizalama:</span>
            <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
              {(['left', 'center', 'right'] as const).map((al) => (
                <button
                  key={al}
                  type="button"
                  onClick={() => onUpdate({ align: al })}
                  className={`admin-btn admin-btn-sm ${block.align === al ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                  style={{ flex: 1, fontSize: '10px' }}
                >
                  {al === 'left' ? 'Sola' : al === 'center' ? 'Ortala' : 'Sağa'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
