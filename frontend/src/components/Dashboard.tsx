import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Share2, LogOut, Link as LinkIcon, FileText, Video, X, Copy, Check, History } from 'lucide-react';
import { viewContent, createContent, deleteContent, shareBrain } from '../lib/api';
import type { Content } from '../lib/api';
import { ContentCard } from './ContentCard';
import { getLinkPlaceholder, LinkedInIcon, InstagramIcon, TwitterIcon } from '../lib/contentTypes';
import { AppNav, LoadingPage, LoadingOverlay, PageShell, DarkCard, ModalOverlay, btnOutline, btnPrimary, btnDanger, inputDark } from './ui/theme';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [shareHash, setShareHash] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const [newContent, setNewContent] = useState({
    title: '',
    link: '',
    type: 'youtube',
  });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const data = await viewContent();
      setContents(data.content);
    } catch {
      setError('Failed to load content. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('Adding content...');
    setError('');
    try {
      await createContent(newContent.title, newContent.link, newContent.type);
      setNewContent({ title: '', link: '', type: 'youtube' });
      setShowAddModal(false);
      setActionLoading('Refreshing...');
      await fetchContents();
    } catch {
      setError('Failed to add content. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    setActionLoading('Deleting content...');
    try {
      await deleteContent(contentId);
      setContents((prev) => prev.filter((c) => c._id !== contentId));
    } catch {
      setError('Failed to delete content. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleShareBrain = async () => {
    setActionLoading('Creating share link...');
    try {
      const response = await shareBrain(true);
      setShareHash(response.hash || response.message || null);
      setShowShareModal(true);
    } catch {
      setError('Failed to create share link. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/brain/${shareHash}`;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    setActionLoading('Logging out...');
    onLogout();
  };

  if (loading) return <LoadingPage message="Loading your brain..." />;

  const typeBtn = (type: string, active: boolean, activeClass: string, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => setNewContent({ ...newContent, type })}
      className={`flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2.5 rounded-lg border transition-all text-xs sm:text-sm ${
        active
          ? activeClass
          : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/20 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <PageShell>
      <LoadingOverlay show={!!actionLoading} message={actionLoading || 'Please wait...'} />

      <AppNav title="My Second Brain" subtitle="Your personal dashboard">
        <Link to="/share-history" className={btnOutline}>
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">Share History</span>
        </Link>
        <button onClick={handleShareBrain} disabled={!!actionLoading} className={btnOutline}>
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button onClick={() => setShowAddModal(true)} disabled={!!actionLoading} className={btnPrimary}>
          <Plus className="w-4 h-4" />
          <span>Add Content</span>
        </button>
        <button onClick={handleLogout} disabled={!!actionLoading} className={btnDanger}>
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </AppNav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex justify-between items-center gap-4">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-300 hover:text-white shrink-0">Dismiss</button>
          </div>
        )}

        {contents.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
              <FileText className="w-8 sm:w-10 h-8 sm:h-10 text-violet-400" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">No content yet</h2>
            <p className="text-zinc-400 mb-6 px-4">Start building your second brain by adding content</p>
            <button onClick={() => setShowAddModal(true)} className={`${btnPrimary} px-6 py-3 mx-auto`}>
              <Plus className="w-5 h-5" />
              Add Your First Content
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {contents.map((content) => (
              <ContentCard key={content._id} content={content} onDelete={handleDeleteContent} />
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <ModalOverlay onClose={() => !actionLoading && setShowAddModal(false)} closeOnBackdrop={!actionLoading}>
          <DarkCard className="max-w-lg w-full p-4 sm:p-6 my-4 sm:my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Add Content</h2>
              <button
                onClick={() => setShowAddModal(false)}
                disabled={!!actionLoading}
                className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-3">Content Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {typeBtn('youtube', newContent.type === 'youtube', 'border-red-500/50 bg-red-500/10 text-red-400', <Video className="w-4 h-4" />, 'YouTube')}
                  {typeBtn('twitter', newContent.type === 'twitter', 'border-sky-500/50 bg-sky-500/10 text-sky-400', <TwitterIcon className="w-4 h-4" />, 'Twitter')}
                  {typeBtn('linkedin', newContent.type === 'linkedin', 'border-blue-500/50 bg-blue-500/10 text-blue-400', <LinkedInIcon className="w-4 h-4" />, 'LinkedIn')}
                  {typeBtn('instagram', newContent.type === 'instagram', 'border-pink-500/50 bg-pink-500/10 text-pink-400', <InstagramIcon className="w-4 h-4" />, 'Instagram')}
                  {typeBtn('link', newContent.type === 'link', 'border-violet-500/50 bg-violet-500/10 text-violet-400', <LinkIcon className="w-4 h-4" />, 'Link')}
                  {typeBtn('note', newContent.type === 'note', 'border-purple-500/50 bg-purple-500/10 text-purple-400', <FileText className="w-4 h-4" />, 'Note')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className={inputDark}
                  placeholder="Enter title"
                  required
                  disabled={!!actionLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  {newContent.type === 'note' ? 'Content' : 'Link'}
                </label>
                {newContent.type === 'note' ? (
                  <textarea
                    value={newContent.link}
                    onChange={(e) => setNewContent({ ...newContent, link: e.target.value })}
                    className={`${inputDark} resize-none`}
                    placeholder="Write your note here..."
                    rows={4}
                    required
                    disabled={!!actionLoading}
                  />
                ) : (
                  <input
                    type="text"
                    value={newContent.link}
                    onChange={(e) => setNewContent({ ...newContent, link: e.target.value })}
                    className={inputDark}
                    placeholder={getLinkPlaceholder(newContent.type)}
                    required
                    disabled={!!actionLoading}
                  />
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} disabled={!!actionLoading} className={`flex-1 ${btnOutline} justify-center py-3`}>
                  Cancel
                </button>
                <button type="submit" disabled={!!actionLoading} className={`flex-1 ${btnPrimary} justify-center py-3 disabled:opacity-50`}>
                  Add Content
                </button>
              </div>
            </form>
          </DarkCard>
        </ModalOverlay>
      )}

      {showShareModal && shareHash && (
        <ModalOverlay onClose={() => setShowShareModal(false)}>
          <DarkCard className="max-w-md w-full p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Share Your Brain</h2>
              <button onClick={() => setShowShareModal(false)} className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-zinc-400 mb-4 text-sm">
              Share this link with anyone to let them view your content collection
            </p>

            <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-4">
              <p className="text-sm text-violet-300 break-all font-mono">
                {window.location.origin}/brain/{shareHash}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/share-history"
                onClick={() => setShowShareModal(false)}
                className={`flex-1 ${btnOutline} justify-center py-3`}
              >
                <History className="w-4 h-4" />
                View History
              </Link>
              <button onClick={handleCopyLink} className={`flex-1 ${btnPrimary} justify-center py-3`}>
                {copied ? <><Check className="w-5 h-5" />Copied!</> : <><Copy className="w-5 h-5" />Copy Link</>}
              </button>
            </div>
          </DarkCard>
        </ModalOverlay>
      )}
    </PageShell>
  );
};
