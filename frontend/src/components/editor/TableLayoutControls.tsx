import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { parseCellStyle, getTableStyle, updateTableStyle } from './tableStyleHelper';

interface TableLayoutControlsProps {
  editor: Editor;
}

export const TableLayoutControls: React.FC<TableLayoutControlsProps> = ({ editor }) => {
  const [tableWidth, setTableWidth] = useState<string>('100%');
  const [tableAlign, setTableAlign] = useState<'left' | 'center' | 'right'>('left');

  useEffect(() => {
    const syncStyles = () => {
      const tStyle = getTableStyle(editor);
      const parsedTable = parseCellStyle(tStyle);
      setTableWidth(parsedTable['width'] || '100%');
      const ml = parsedTable['margin-left'];
      const mr = parsedTable['margin-right'];
      if (mr === '0' || mr === '0px') {
        setTableAlign('right');
      } else if (ml === '0' || ml === '0px') {
        setTableAlign('left');
      } else if (ml === 'auto' && mr === 'auto') {
        setTableAlign('center');
      } else {
        setTableAlign('left');
      }
    };

    syncStyles();
    editor.on('selectionUpdate', syncStyles);
    return () => {
      editor.off('selectionUpdate', syncStyles);
    };
  }, [editor]);

  const applyTableLayout = (w = tableWidth, a = tableAlign) => {
    setTableWidth(w);
    setTableAlign(a);

    const cleanW = w.endsWith('%') || w.endsWith('px') ? w : `${w}%`;
    const ml = a === 'center' || a === 'right' ? 'auto' : '0';
    const mr = a === 'center' || a === 'left' ? 'auto' : '0';

    updateTableStyle(editor, {
      width: cleanW,
      'margin-left': ml,
      'margin-right': mr,
      'margin-top': '18px',
      'margin-bottom': '18px',
      margin: null,
      display: 'table',
    });
  };

  const miniBtn = (active: boolean): React.CSSProperties => ({
    padding: '3px 6px',
    fontSize: '10px',
    fontWeight: active ? 700 : 500,
    border: '1px solid var(--border-card)',
    borderRadius: '3px',
    background: active ? 'var(--accent-primary)' : 'var(--bg-secondary)',
    color: active ? '#FFFFFF' : 'var(--text-secondary)',
    cursor: 'pointer',
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    display: 'inline-flex',
    alignItems: 'center',
  });

  return (
    <div style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
        Tablo Genişliği ve Hizalama
      </span>

      {/* Hazır Genişlikler */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '5px' }}>
        {[
          { label: 'Tam (%100)', val: '100%' },
          { label: '2/3 (%66)', val: '66.6%' },
          { label: 'Yarım (%50)', val: '50%' },
          { label: '3/4 (%75)', val: '75%' },
        ].map((item) => (
          <button
            key={item.val}
            type="button"
            style={miniBtn(tableWidth === item.val)}
            onClick={() => applyTableLayout(item.val, tableAlign)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Serbest Genişlik & Hizalama Seçici */}
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Örn: 66% veya 650px"
          value={tableWidth}
          onChange={(e) => setTableWidth(e.target.value)}
          onBlur={() => applyTableLayout(tableWidth, tableAlign)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyTableLayout(tableWidth, tableAlign);
          }}
          style={{
            flex: 1,
            fontSize: '11px',
            padding: '3px 6px',
            borderRadius: '3px',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontWeight: 600,
          }}
          title="Özel genişlik girip Enter'a basabilirsiniz"
        />

        {/* Hizalama Butonları */}
        <div style={{ display: 'flex', gap: '2px', borderLeft: '1px solid var(--border-card)', paddingLeft: '5px' }}>
          <button
            type="button"
            onClick={() => applyTableLayout(tableWidth, 'left')}
            style={miniBtn(tableAlign === 'left')}
            title="Tabloyu Sola Yasla"
          >
            <AlignLeft size={12} />
          </button>
          <button
            type="button"
            onClick={() => applyTableLayout(tableWidth, 'center')}
            style={miniBtn(tableAlign === 'center')}
            title="Tabloyu Ortala"
          >
            <AlignCenter size={12} />
          </button>
          <button
            type="button"
            onClick={() => applyTableLayout(tableWidth, 'right')}
            style={miniBtn(tableAlign === 'right')}
            title="Tabloyu Sağa Yasla"
          >
            <AlignRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};
