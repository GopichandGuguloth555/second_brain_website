import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LandingPage } from './components/LandingPage';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './components/Dashboard';
import { SharedBrain } from './components/ShareBrain';
import { ShareHistory } from './components/ShareHistory';
import { SessionExpired } from './components/SessionExpired';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

function AppRoutes() {
  const { login, logout } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthForm onLogin={login} mode="login" />} />
      <Route path="/signup" element={<AuthForm onLogin={login} mode="signup" />} />
      <Route path="/session-expired" element={<SessionExpired />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/share-history"
        element={
          <ProtectedRoute>
            <ShareHistory onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route path="/brain/:sharelink" element={<SharedBrain />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  const content = (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );

  if (!googleClientId) {
    return content;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {content}
    </GoogleOAuthProvider>
  );
}

export default App;
