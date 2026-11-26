import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  login: (token: string, user: AdminUser) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isTokenExpired = (rawToken: string): boolean => {
  try {
    const payloadStr = rawToken.split('.')[0];
    if (!payloadStr) return true;
    const payload = JSON.parse(atob(payloadStr));
    return Boolean(payload.exp && payload.exp < Math.floor(Date.now() / 1000));
  } catch {
    return true;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('msk_admin_token');
    if (saved && isTokenExpired(saved)) {
      localStorage.removeItem('msk_admin_token');
      localStorage.removeItem('msk_admin_user');
      return null;
    }
    return saved;
  });
  const [user, setUser] = useState<AdminUser | null>(() => {
    const savedToken = localStorage.getItem('msk_admin_token');
    if (!savedToken || isTokenExpired(savedToken)) return null;
    const saved = localStorage.getItem('msk_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('msk_admin_token', token);
    } else {
      localStorage.removeItem('msk_admin_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('msk_admin_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('msk_admin_user');
    }
  }, [user]);

  const login = (newToken: string, newUser: AdminUser) => {
    try {
      localStorage.setItem('msk_admin_token', newToken);
      localStorage.setItem('msk_admin_user', JSON.stringify(newUser));
    } catch {}
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    try {
      localStorage.removeItem('msk_admin_token');
      localStorage.removeItem('msk_admin_user');
    } catch {}
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const handleExpired = () => logout();
    window.addEventListener('msk:auth-expired', handleExpired);
    return () => window.removeEventListener('msk:auth-expired', handleExpired);
  }, []);

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'SUPER_ADMIN') return true;
    if (permission.startsWith('posts.') && user.role === 'CONTENT_EDITOR') return true;
    if (permission.startsWith('messages.') && user.role === 'SUPPORT_AGENT') return true;
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
