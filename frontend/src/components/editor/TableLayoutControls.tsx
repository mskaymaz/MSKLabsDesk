import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { AlignLeft, AlignCenter, AlignRight, Check } from 'lucide-react';
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
      const margin = parsedTable['margin'] || '';
      if (margin.includes('0 18px auto') || margin.includes('0 auto')) {
        setTableAlign('right');
      } else if (margin.includes('auto 18px 0')) {
        setTableAlign('left');
      } else if (margin.includes('auto')) {
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

    let marginStyle = '18px 0';
    if (a === 'center') {
      marginStyle = '18px auto';
    } else if (a === 'right') {
      marginStyle = '18px 0 18px auto';
    } else {
      marginStyle = '18px auto 18px 0';
    }

    const cleanW = w.endsWith('%') || w.endsWith('px') ? w : `${w}%`;
    updateTableStyle(editor, {
      width: cleanW,
      margin: marginStyle,
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
  });

  return (
    <div style={{ paddingBottom: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
        Tablo Genişliği ve Hizalama
      </span>

      {/* Hazır Genişlikler */}
      <div style={{ display: 'flex', gap: '3px', marginBottom: '4px' }}>
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
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Örn: 66% veya 650px"
          value={tableWidth}
          onChange={(e) => setTableWidth(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') applyTableLayout(tableWidth, tableAlign);
          }}
          style={{
            flex: 1,
            fontSize: '11px',
            padding: '2px 5px',
            borderRadius: '3px',
            border: '1px solid var(--border-card)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontWeight: 600,
          }}
        />
        <button
          type="button"
          onClick={() => applyTableLayout(tableWidth, tableAlign)}
          className="admin-btn admin-btn-secondary admin-btn-xs"
          title="Tablo genişliğini uygula"
        >
          <Check size={11} /> Uygula
        </button>

        {/* Hizalama Butonları */}
        <div style={{ display: 'flex', gap: '2px', borderLeft: '1px solid var(--border-card)', paddingLeft: '4px' }}>
          <button
            type="button"
            onClick={() => applyTableLayout(tableWidth, 'left')}
            style={miniBtn(tableAlign === 'left')}
            title="Tabloyu Sola Yasla"
          >
            <AlignLeft size={11} />
          </button>
          <button
            type="button"
            onClick={() => applyTableLayout(tableWidth, 'center')}
            style={miniBtn(tableAlign === 'center')}
            title="Tabloyu Ortala"
          >
            <AlignCenter size={11} />
          </button>
          <button
            type="button"
            onClick={() => applyTableLayout(tableWidth, 'right')}
            style={miniBtn(tableAlign === 'right')}
            title="Tabloyu Sağa Yasla"
          >
            <AlignRight size={11} />
          </button>
        </div>
      </div>
    </div>
  );
};
