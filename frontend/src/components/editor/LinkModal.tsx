import React, { useState, useEffect } from 'react';
import type { Editor } from '@tiptap/react';
import { Link as LinkIcon, Unlink, X } from 'lucide-react';

interface LinkModalProps {
  editor: Editor;
  isOpen: boolean;
  onClose: () => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({ editor, isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const previousUrl = editor.getAttributes('link').href || '';
      setUrl(previousUrl);
      const target = editor.getAttributes('link').target;
      setOpenInNewTab(target === '_blank' || !previousUrl);
    }
  }, [isOpen, editor]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({
          href: url,
          target: openInNewTab ? '_blank' : '_self',
        })
        .run();
    }
    onClose();
  };

  const handleUnlink = () => {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="admin-panel-card"
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--bg-modal, var(--bg-card))',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-xl)',
          padding: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LinkIcon size={18} color="var(--accent-primary)" />
            <h3 className="admin-modal-title" style={{ fontSize: '0.96rem' }}>
              Bağlantı (Link) Ekle / Düzenle
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-refresh admin-btn-sm"
            style={{ width: '26px', height: '26px', padding: 0 }}
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label className="admin-meta-text" style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Bağlantı Adresi (URL) *
            </label>
            <input
              type="url"
              required
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="admin-filter-input"
              style={{ width: '100%', height: '34px', padding: '0 10px' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
            <input
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              style={{ accentColor: 'var(--accent-primary)' }}
            />
            Yeni sekmede aç (`target="_blank"`)
          </label>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            {editor.isActive('link') ? (
              <button
                type="button"
                onClick={handleUnlink}
                className="admin-btn admin-btn-danger admin-btn-sm"
              >
                <Unlink size={13} /> Bağlantıyı Kaldır
              </button>
            ) : <span />}

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={onClose} className="admin-btn admin-btn-view admin-btn-sm">
                Vazgeç
              </button>
              <button type="submit" className="admin-btn admin-btn-primary admin-btn-sm">
                Uygula
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
