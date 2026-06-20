const TOKEN_KEY = 'token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function getValidToken(): string | null {
  const token = getToken();
  if (!token) return null;
  if (isTokenExpired(token)) {
    clearToken();
    return null;
  }
  return token;
}

let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(handler: () => void): void {
  onSessionExpired = handler;
}

export function triggerSessionExpired(): void {
  clearToken();
  onSessionExpired?.();
}

export function isAuthError(status: number, message?: string, requestUrl?: string): boolean {
  if (status !== 401 && status !== 403) return false;

  const url = requestUrl || '';
  if (url.includes('/login') || url.includes('/signup')) return false;

  const token = getToken();
  if (!token) return false;

  const lower = (message || '').toLowerCase();
  return (
    lower.includes('session expired') ||
    lower.includes('invalid or expired token') ||
    lower.includes('you must login') ||
    lower.includes('must login to continue')
  );
}
