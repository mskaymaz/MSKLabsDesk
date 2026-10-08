import React from 'react';

export const Skeleton: React.FC<{ width?: string; height?: string; borderRadius?: string }> = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
}) => (
  <div
    style={{
      width,
      height,
      borderRadius,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
      backgroundSize: '200% 100%',
      animation: 'skeletonPulse 1.5s infinite',
    }}
  />
);

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--border-subtle)',
    }}
  >
    {icon && <div style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>{icon}</div>}
    <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
      {title}
    </h4>
    {description && (
      <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '16px' }}>
        {description}
      </p>
    )}
    {action}
  </div>
);

export interface TabsProps {
  tabs: Array<{ id: string; label: string; icon?: React.ReactNode }>;
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => (
  <div
    role="tablist"
    style={{
      display: 'flex',
      gap: '4px',
      background: 'rgba(0,0,0,0.3)',
      padding: '4px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
    }}
  >
    {tabs.map((tab) => (
      <button
        key={tab.id}
        role="tab"
        aria-selected={activeTab === tab.id}
        onClick={() => onChange(tab.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: 'var(--radius-sm)',
          border: 'none',
          background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
          color: activeTab === tab.id ? '#FFF' : 'var(--text-secondary)',
          fontWeight: 600,
          fontSize: 'var(--font-sm)',
          cursor: 'pointer',
          minHeight: '44px',
          fontFamily: 'inherit',
        }}
      >
        {tab.icon}
        <span>{tab.label}</span>
      </button>
    ))}
  </div>
);

export const StatusBadge: React.FC<{ status: string; label?: string }> = ({ status, label }) => {
  const getStyle = () => {
    switch (status.toLowerCase()) {
      case 'new':
      case 'pending':
      case 'draft':
        return { bg: 'rgba(245, 158, 11, 0.15)', color: '#FDE047', border: 'rgba(245, 158, 11, 0.3)' };
      case 'resolved':
      case 'approved':
      case 'published':
      case 'active':
        return { bg: 'rgba(16, 185, 129, 0.15)', color: '#6EE7B7', border: 'rgba(16, 185, 129, 0.3)' };
      case 'stale':
      case 'warning':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#FCA5A5', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(99, 102, 241, 0.15)', color: '#A5B4FC', border: 'rgba(99, 102, 241, 0.3)' };
    }
  };

  const s = getStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--font-xs)',
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {label || status.toUpperCase()}
    </span>
  );
};

export const DeviceFrame: React.FC<{ children: React.ReactNode; device?: 'mobile' | 'tablet' | 'desktop' }> = ({
  children,
  device = 'desktop',
}) => {
  const widthMap = { mobile: '360px', tablet: '768px', desktop: '100%' };
  return (
    <div
      style={{
        width: widthMap[device],
        margin: '0 auto',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'var(--bg-secondary)',
      }}
    >
      {children}
    </div>
  );
};
