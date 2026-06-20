import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Copy, Check, ExternalLink, ArrowLeft, Trash2 } from 'lucide-react';
import { getShareStatus, shareBrain } from '../lib/api';
import type { ShareStatus } from '../lib/api';
import { AppNav, LoadingPage, LoadingOverlay, PageShell, DarkCard, btnOutline, btnPrimary, btnDanger } from './ui/theme';

interface ShareHistoryProps {
  onLogout: () => void;
}

export const ShareHistory = ({ onLogout }: ShareHistoryProps) => {
  const [status, setStatus] = useState<ShareStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = async () => {
    try {
      const data = await getShareStatus();
      setStatus(data);
    } catch {
      setError('Failed to load share status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const shareLink = status?.hash
    ? `${window.location.origin}/brain/${status.hash}`
    : null;

  const handleCopy = () => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateLink = async () => {
    setActionLoading('Creating share link...');
    try {
      await shareBrain(true);
      setLoading(true);
      await fetchStatus();
    } catch {
      setError('Failed to create share link.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevoke = async () => {
    setActionLoading('Removing share link...');
    try {
      await shareBrain(false);
      setStatus({ shared: false, hash: null, createdAt: null });
    } catch {
      setError('Failed to remove share link.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = () => {
    setActionLoading('Logging out...');
    onLogout();
  };

  if (loading) return <LoadingPage message="Loading share history..." />;

  return (
    <PageShell>
      <LoadingOverlay show={!!actionLoading} message={actionLoading || 'Please wait...'} />

      <AppNav title="Share History" subtitle="Manage your shared brain links">
        <Link to="/dashboard" className={btnOutline}>
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <button onClick={handleLogout} disabled={!!actionLoading} className={btnDanger}>
          Logout
        </button>
      </AppNav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex justify-between items-center gap-4">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-300 hover:text-white shrink-0">Dismiss</button>
          </div>
        )}

        <DarkCard className="p-4 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-violet-500/10 border border-violet-500/20 rounded-xl shrink-0">
              <Share2 className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Your Shared Brain Links</h2>
              <p className="text-zinc-400 text-sm">Manage links you share with others</p>
            </div>
          </div>

          {status?.shared && shareLink ? (
            <div className="space-y-4">
              <div className="p-4 sm:p-5 bg-violet-500/5 rounded-xl border border-violet-500/20">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
                    Active Link
                  </span>
                  {status.createdAt && (
                    <span className="text-xs text-zinc-500">
                      Created {new Date(status.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-violet-300 break-all font-mono bg-black/30 p-3 rounded-lg border border-white/5 mb-4">
                  {shareLink}
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                  <button onClick={handleCopy} disabled={!!actionLoading} className={`${btnPrimary} justify-center`}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </button>
                  <a href={shareLink} target="_blank" rel="noopener noreferrer" className={`${btnOutline} justify-center`}>
                    <ExternalLink className="w-4 h-4" />
                    Preview
                  </a>
                  <button onClick={handleRevoke} disabled={!!actionLoading} className={`${btnDanger} justify-center disabled:opacity-50`}>
                    <Trash2 className="w-4 h-4" />
                    Stop Sharing
                  </button>
                </div>
              </div>

              <p className="text-sm text-zinc-500">
                Anyone with this link can view your shared content collection. They cannot edit or delete your content.
              </p>
            </div>
          ) : (
            <div className="text-center py-10 sm:py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
                <Share2 className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No active share link</h3>
              <p className="text-zinc-400 mb-6 max-w-sm mx-auto px-4">
                Create a share link to let others view your brain collection via a public URL.
              </p>
              <button onClick={handleCreateLink} disabled={!!actionLoading} className={`${btnPrimary} px-6 py-3 mx-auto`}>
                <Share2 className="w-5 h-5" />
                Create Share Link
              </button>
            </div>
          )}
        </DarkCard>
      </main>
    </PageShell>
  );
};
