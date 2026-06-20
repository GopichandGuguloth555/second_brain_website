import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, LogIn, Brain } from 'lucide-react';
import { clearToken } from '../lib/auth';
import { PageShell, DarkCard, btnPrimary } from './ui/theme';

export const SessionExpired = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    clearToken();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      navigate('/login', { replace: true });
      return;
    }

    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <PageShell>
      <div className="min-h-screen flex items-center justify-center p-4">
        <DarkCard className="max-w-md w-full p-8 sm:p-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl mb-6">
            <Clock className="w-8 h-8 text-amber-400" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Session Expired
          </h1>

          <p className="text-zinc-400 mb-2 leading-relaxed">
            Your session has ended for security reasons. Please log in again to continue using Second Brain.
          </p>

          <p className="text-sm text-violet-400 mb-8">
            Redirecting to login in <span className="font-semibold text-white">{countdown}</span> seconds…
          </p>

          <button
            onClick={() => navigate('/login', { replace: true })}
            className={`${btnPrimary} w-full justify-center py-3`}
          >
            <LogIn className="w-5 h-5" />
            Log In Now
          </button>

          <button
            onClick={() => navigate('/', { replace: true })}
            className="mt-4 flex items-center justify-center gap-2 w-full text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Brain className="w-4 h-4" />
            Back to Home
          </button>
        </DarkCard>
      </div>
    </PageShell>
  );
};
