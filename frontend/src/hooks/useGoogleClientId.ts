import { useEffect, useState } from 'react';
import { getAuthConfig } from '../lib/api';

export function useGoogleClientId(): string {
  const envClientId = (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined)?.trim() || '';
  const [clientId, setClientId] = useState(envClientId);

  useEffect(() => {
    if (envClientId) return;

    getAuthConfig()
      .then((config) => {
        if (config.googleClientId) {
          setClientId(config.googleClientId);
        }
      })
      .catch(() => {
        // ignore — button will show setup message
      });
  }, [envClientId]);

  return clientId;
}
