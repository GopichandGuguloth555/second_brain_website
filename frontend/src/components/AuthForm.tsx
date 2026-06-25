import { useState, useEffect } from 'react';
import { LogIn, UserPlus, Brain, ArrowLeft, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { login, signup, googleLogin, demoLogin, getAuthConfig } from '../lib/api';
import type { AuthConfig } from '../lib/api';
import { GoogleSignInButton } from './GoogleSignInButton';
import { PageShell, DarkCard, inputDark, LoadingOverlay } from './ui/theme';

interface AuthFormProps {
  onLogin: (token: string) => void;
  mode?: 'login' | 'signup';
}

export const AuthForm = ({ onLogin, mode = 'login' }: AuthFormProps) => {
  const navigate = useNavigate();
  const isLogin = mode === 'login';
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authConfig, setAuthConfig] = useState<AuthConfig | null>(null);

  useEffect(() => {
    getAuthConfig().then(setAuthConfig).catch(() => {
      setAuthConfig({ googleEnabled: false, demoEnabled: false, sessionExpiryMinutes: 30 });
    });
  }, []);

  const finishLogin = (token: string) => {
    onLogin(token);
    navigate('/dashboard', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await login(userName, password);
        finishLogin(data.token);
      } else {
        await signup(userName, password);
        const data = await login(userName, password);
        finishLogin(data.token);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string) => {
    setError('');
    setLoading(true);
    try {
      const data = await googleLogin(credential);
      finishLogin(data.token);
    } catch {
      setError('Google sign-in failed. Make sure GOOGLE_CLIENT_ID is set in backend/.env too.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const data = await demoLogin();
      finishLogin(data.token);
    } catch {
      setError('Demo login is not available.');
    } finally {
      setLoading(false);
    }
  };

  const showDemo = authConfig?.demoEnabled ?? true;

  return (
    <PageShell>
      <LoadingOverlay
        show={loading}
        message={isLogin ? 'Signing you in...' : 'Creating your account...'}
      />

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-6 sm:mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl mb-4 glow-violet-sm">
              <Brain className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Second Brain</h1>
            <p className="text-zinc-400 text-sm sm:text-base">Your personal knowledge repository</p>
            <p className="text-xs text-violet-400/80 mt-2">Sessions expire after 30 minutes for security</p>
          </div>

          <DarkCard className="p-6 sm:p-8">
            <div className="flex gap-2 mb-6">
              <Link
                to="/login"
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-center text-sm ${
                  isLogin
                    ? 'btn-gradient text-white'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all text-center text-sm ${
                  !isLogin
                    ? 'btn-gradient text-white'
                    : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                Sign Up
              </Link>
            </div>

            <div className="space-y-3 mb-6">
              <GoogleSignInButton
                label={isLogin ? 'signin' : 'signup'}
                onSuccess={handleGoogleSuccess}
                onError={setError}
              />

              {showDemo && (
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-all text-sm font-medium disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  Try Demo Account
                </button>
              )}

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-zinc-500">or continue with email</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={inputDark}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputDark}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient text-white py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>
          </DarkCard>
        </div>
      </div>
    </PageShell>
  );
};
