import React, { useState } from 'react';
import { Eye, Edit3 } from 'lucide-react';

export interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [isPreview, setIsPreview] = useState(false);

  const sanitizeHTML = (html: string) => {
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, 'blocked:')
      .replace(/on\w+="[^"]*"/gi, '');
  };

  return (
    <div style={{ marginBottom: 'var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
        {label && (
          <label style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-cyan)',
            fontSize: 'var(--font-xs)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            minHeight: '36px',
          }}
        >
          {isPreview ? <Edit3 size={14} /> : <Eye size={14} />}
          <span>{isPreview ? 'Editör Modu' : 'Önizleme'}</span>
        </button>
      </div>

      {isPreview ? (
        <div
          style={{
            minHeight: '160px',
            padding: '12px 16px',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 'var(--font-sm)',
            overflowY: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHTML(value || '<p style="color:var(--text-muted)">İçerik boş...</p>') }}
        />
      ) : (
        <textarea
          rows={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={!!error}
          style={{
            width: '100%',
            padding: '12px 16px',
            background: 'rgba(0,0,0,0.3)',
            border: error ? '1px solid var(--danger)' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontFamily: 'monospace',
            fontSize: 'var(--font-sm)',
            outline: 'none',
          }}
        />
      )}

      {error && (
        <span style={{ display: 'block', color: 'var(--danger)', fontSize: 'var(--font-xs)', marginTop: 'var(--space-1)' }}>
          {error}
        </span>
      )}
    </div>
  );
};
