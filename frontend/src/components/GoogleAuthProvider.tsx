import { useEffect, useState, type ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { LoadingPage } from './ui/Loading';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

interface AuthConfigResponse {
  googleEnabled: boolean;
  googleClientId: string | null;
  demoEnabled: boolean;
  sessionExpiryMinutes: number;
}

interface GoogleAuthProviderProps {
  children: ReactNode;
}

export const GoogleAuthProvider = ({ children }: GoogleAuthProviderProps) => {
  const envClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() || '';
  const [clientId, setClientId] = useState(envClientId);
  const [loading, setLoading] = useState(!envClientId);

  useEffect(() => {
    if (envClientId) return;

    axios
      .get<AuthConfigResponse>(`${API_BASE_URL}/auth/config`)
      .then((res) => {
        if (res.data.googleClientId) {
          setClientId(res.data.googleClientId);
        }
      })
      .catch(() => {
        // Backend offline — Google login stays disabled until env or backend is available
      })
      .finally(() => setLoading(false));
  }, [envClientId]);

  if (loading) {
    return <LoadingPage message="Loading..." />;
  }

  if (!clientId) {
    return <>{children}</>;
  }

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>;
};
