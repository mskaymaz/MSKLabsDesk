import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyle = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          color: '#FFFFFF',
          border: 'none',
          boxShadow: 'var(--shadow-sm)',
        };
      case 'secondary':
        return {
          background: 'rgba(255, 255, 255, 0.05)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        };
      case 'danger':
        return {
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#FCA5A5',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        };
      case 'success':
        return {
          background: 'rgba(16, 185, 129, 0.15)',
          color: '#6EE7B7',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: 'none',
        };
    }
  };

  const getSizeStyle = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { minHeight: '36px', padding: '6px 12px', fontSize: 'var(--font-xs)' };
      case 'lg':
        return { minHeight: '48px', padding: '12px 24px', fontSize: 'var(--font-md)' };
      default:
        return { minHeight: '44px', padding: '10px 18px', fontSize: 'var(--font-sm)' };
    }
  };

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        fontWeight: 'var(--font-weight-semibold)',
        borderRadius: 'var(--radius-md)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        transition: 'all 0.2s ease',
        minWidth: '44px',
        outline: 'none',
        fontFamily: 'inherit',
        ...getVariantStyle(),
        ...getSizeStyle(),
        ...style,
      }}
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {loading ? (
        <span
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};

export const IconButton: React.FC<ButtonProps> = ({ children, style, ...props }) => {
  return (
    <Button
      style={{
        padding: '8px',
        minWidth: '44px',
        minHeight: '44px',
        borderRadius: 'var(--radius-md)',
        ...style,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
