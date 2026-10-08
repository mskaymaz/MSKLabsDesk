import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertOctagon, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
          }}
        >
          <AlertOctagon size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, marginBottom: '8px' }}>
            Bir Hata Oluştu
          </h2>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '24px' }}>
            Beklenmeyen bir hata meydana geldi. Sistem güvenliği nedeniyle teknik detaylar gizlenmiştir.
          </p>
          <Button onClick={() => window.location.reload()} icon={<RefreshCw size={16} />}>
            Sayfayı Yenile
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      style={{
        background: 'rgba(239, 68, 68, 0.9)',
        color: '#FFF',
        padding: '8px 16px',
        fontSize: 'var(--font-xs)',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        position: 'sticky',
        top: 0,
        zIndex: 1200,
      }}
    >
      <WifiOff size={16} />
      <span>İnternet bağlantısı kesildi. Çevrimdışı moddasınız.</span>
      <button
        onClick={() => window.location.reload()}
        style={{ background: 'white', color: '#000', border: 'none', borderRadius: '4px', padding: '2px 8px', fontSize: '10px', cursor: 'pointer', marginLeft: '12px' }}
      >
        Yeniden Dene
      </button>
    </div>
  );
};
