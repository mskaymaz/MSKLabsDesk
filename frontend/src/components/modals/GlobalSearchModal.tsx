import React, { useState, useEffect, useRef } from 'react';
import { Search, Inbox, FileText, Users, Settings, ArrowRight } from 'lucide-react';
import type { TabType } from '../Sidebar';

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: TabType) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchItems = [
    { id: 'tickets', title: 'Destek Biletleri & Talepler', icon: Inbox, category: 'Navigasyon' },
    { id: 'posts', title: 'Blog Yazıları & Editör', icon: FileText, category: 'İçerik' },
    { id: 'subscribers', title: 'Bülten Aboneleri', icon: Users, category: 'Topluluk' },
    { id: 'settings', title: 'Sistem & Tema Ayarları', icon: Settings, category: 'Yönetim' },
  ];

  const filteredItems = searchItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }

      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        onNavigate(filteredItems[selectedIndex].id as TabType);
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose, onNavigate]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        zIndex: 'var(--z-modal)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#121826',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          padding: '0',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Search size={20} color="var(--accent-primary)" style={{ marginRight: '12px' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Hızlı arama yapın (Cmd+K / Ctrl+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#FFF',
              fontSize: 'var(--font-md)',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px' }}>
          {filteredItems.length === 0 ? (
            <p style={{ padding: '16px', color: 'var(--text-muted)', fontSize: 'var(--font-sm)', textAlign: 'center' }}>
              Sonuç bulunamadı.
            </p>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as TabType);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: isSelected ? '#FFF' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    marginBottom: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Icon size={18} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                    <div>
                      <div style={{ fontWeight: isSelected ? 700 : 500, fontSize: 'var(--font-sm)' }}>{item.title}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{item.category}</div>
                    </div>
                  </div>
                  <ArrowRight size={16} color={isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
