import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingPage } from '../components/ui/Loading';
import {
  getToken,
  setToken as saveToken,
  clearToken,
  isTokenExpired,
  setSessionExpiredHandler,
  triggerSessionExpired,
} from '../lib/auth';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  clearSession: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const clearSession = useCallback(() => {
    clearToken();
    setToken(null);
  }, []);

  const login = useCallback((newToken: string) => {
    saveToken(newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    navigate('/', { replace: true });
  }, [clearSession, navigate]);

  useEffect(() => {
    const stored = getToken();
    if (stored && !isTokenExpired(stored)) {
      setToken(stored);
    } else if (stored) {
      clearToken();
    }
    setReady(true);

    setSessionExpiredHandler(() => {
      clearSession();
      navigate('/session-expired', { replace: true });
    });
  }, [clearSession, navigate]);

  useEffect(() => {
    if (!token) return;

    const checkSession = () => {
      if (isTokenExpired(token)) {
        triggerSessionExpired();
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const isAuthenticated = token !== null && !isTokenExpired(token);

  if (!ready) return <LoadingPage message="Starting Second Brain..." />;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
