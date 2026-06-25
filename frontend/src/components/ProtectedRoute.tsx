import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isTokenExpired } from '../lib/auth';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    if (token && isTokenExpired(token)) {
      return <Navigate to="/session-expired" replace state={{ from: location }} />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
