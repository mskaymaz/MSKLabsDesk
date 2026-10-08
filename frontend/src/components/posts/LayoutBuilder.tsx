import React from 'react';
import { ArrowUp, ArrowDown, Trash2, Plus, AlertCircle } from 'lucide-react';

export interface LayoutBlock {
  block_id: string;
  block_type: string;
  order: number;
  schema_version: number;
  payload: Record<string, any>;
}

export interface LayoutBuilderProps {
  blocks: LayoutBlock[];
  onChange: (blocks: LayoutBlock[]) => void;
  isRtl?: boolean;
}

const ALLOWED_TYPES = [
  'Hero',
  'Heading',
  'RichText',
  'Image',
  'Gallery',
  'Quote',
  'Video',
  'Audio',
  'CTA',
  'RelatedPosts',
  'Advertisement',
];

export const LayoutBuilder: React.FC<LayoutBuilderProps> = ({ blocks, onChange, isRtl = false }) => {
  const addBlock = (type: string) => {
    const newBlock: LayoutBlock = {
      block_id: `block_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      block_type: type,
      order: blocks.length,
      schema_version: 1,
      payload: type === 'Heading' ? { level: 2, text: '' } : type === 'Hero' ? { title: '', subtitle: '' } : {},
    };
    onChange([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    const updated = blocks
      .filter((b) => b.block_id !== id)
      .map((b, idx) => ({ ...b, order: idx }));
    onChange(updated);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= blocks.length) return;

    const copy = [...blocks];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    const reordered = copy.map((b, idx) => ({ ...b, order: idx }));
    onChange(reordered);
  };

  const updatePayload = (id: string, key: string, val: any) => {
    const updated = blocks.map((b) => {
      if (b.block_id === id) {
        return { ...b, payload: { ...b.payload, [key]: val } };
      }
      return b;
    });
    onChange(updated);
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ color: '#FFF', fontSize: '0.95rem', fontWeight: 700 }}>Modüler Düzen Oluşturucu (Layout Builder)</h4>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{blocks.length} Blok Mevcut</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
        {ALLOWED_TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => addBlock(t)}
            style={{
              padding: '4px 10px',
              fontSize: '0.75rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '4px',
              color: '#FFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Plus size={12} /> + {t}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {blocks.map((block, idx) => {
          const isUnknown = !ALLOWED_TYPES.includes(block.block_type);

          return (
            <div
              key={block.block_id}
              style={{
                background: isUnknown ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.04)',
                border: isUnknown ? '1px solid var(--danger)' : '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.85rem' }}>
                  #{idx + 1} {isUnknown ? `Unknown: ${block.block_type}` : block.block_type} (v{block.schema_version})
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 'up')}
                    disabled={idx === 0}
                    aria-label="Yukarı Taşı"
                    style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', opacity: idx === 0 ? 0.3 : 1 }}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(idx, 'down')}
                    disabled={idx === blocks.length - 1}
                    aria-label="Aşağı Taşı"
                    style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer', opacity: idx === blocks.length - 1 ? 0.3 : 1 }}
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(block.block_id)}
                    aria-label="Blok Sil"
                    style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {isUnknown ? (
                <div style={{ color: 'var(--danger)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={16} /> UnknownBlockFallback: Tanınmayan blok tipi güvenli şekilde izole edildi.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Başlık / Metin / URL"
                    value={block.payload.text || block.payload.title || block.payload.url || ''}
                    onChange={(e) => updatePayload(block.block_id, 'text', e.target.value)}
                    style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#FFF', fontSize: '0.8rem' }}
                  />
                  <input
                    type="text"
                    placeholder="Açıklama / Payload"
                    value={block.payload.subtitle || block.payload.html || ''}
                    onChange={(e) => updatePayload(block.block_id, 'subtitle', e.target.value)}
                    style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: '#FFF', fontSize: '0.8rem' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
