import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { SharedBrain } from './components/ShareBrain';
import { ShareHistory } from './components/ShareHistory';
import { SessionExpired } from './components/SessionExpired';
import { LoadingPage } from './components/ui/Loading';
import {
  getValidToken,
  setToken as saveToken,
  clearToken,
  isTokenExpired,
  setSessionExpiredHandler,
} from './lib/auth';

function AppRoutes() {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const validToken = getValidToken();
    setToken(validToken);
    setAuthReady(true);

    setSessionExpiredHandler(() => {
      setToken(null);
      navigate('/session-expired', { replace: true });
    });
  }, [navigate]);

  const handleLogin = (newToken: string) => {
    saveToken(newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    clearToken();
    setToken(null);
    navigate('/', { replace: true });
  };

  const isValidSession = token !== null && !isTokenExpired(token);

  if (!authReady) {
    return <LoadingPage message="Starting Second Brain..." />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          isValidSession ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthForm onLogin={handleLogin} mode="login" />
          )
        }
      />
      <Route
        path="/signup"
        element={
          isValidSession ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthForm onLogin={handleLogin} mode="signup" />
          )
        }
      />
      <Route path="/session-expired" element={<SessionExpired />} />
      <Route
        path="/dashboard"
        element={
          isValidSession ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <Navigate to={token && isTokenExpired(token) ? '/session-expired' : '/login'} replace />
          )
        }
      />
      <Route
        path="/share-history"
        element={
          isValidSession ? (
            <ShareHistory onLogout={handleLogout} />
          ) : (
            <Navigate to={token && isTokenExpired(token) ? '/session-expired' : '/login'} replace />
          )
        }
      />
      <Route path="/brain/:sharelink" element={<SharedBrain />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
