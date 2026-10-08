import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 'var(--z-toast)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px',
        width: '100%',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: '#121826',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-lg)',
            color: '#FFF',
          }}
        >
          {toast.type === 'success' && <CheckCircle size={20} color="var(--accent-emerald)" />}
          {toast.type === 'error' && <XCircle size={20} color="var(--danger)" />}
          {toast.type === 'warning' && <AlertTriangle size={20} color="var(--accent-amber)" />}
          {toast.type === 'info' && <Info size={20} color="var(--accent-cyan)" />}
          <div style={{ flex: 1 }}>
            {toast.title && <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>{toast.title}</div>}
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>{toast.message}</div>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              minWidth: '32px',
              minHeight: '32px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
