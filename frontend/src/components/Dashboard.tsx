import { useState, useEffect } from 'react';
import { Plus, Share2, LogOut, Link as LinkIcon, FileText, Video, X, Copy, Check } from 'lucide-react';
import { viewContent, createContent, deleteContent, shareBrain} from '../lib/api';
import type { Content } from '../lib/api';
import { ContentCard } from './ContentCard';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard = ({ onLogout }: DashboardProps) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [shareHash, setShareHash] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

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
    } catch (error) {
      console.error('Failed to fetch contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createContent(newContent.title, newContent.link, newContent.type);
      setNewContent({ title: '', link: '', type: 'youtube' });
      setShowAddModal(false);
      fetchContents();
    } catch (error) {
      console.error('Failed to add content:', error);
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      await deleteContent(contentId);
      fetchContents();
    } catch (error) {
      console.error('Failed to delete content:', error);
    }
  };

  const handleShareBrain = async () => {
    try {
      const response = await shareBrain(true);
      setShareHash(response.hash || response.message);
      setShowShareModal(true);
    } catch (error) {
      console.error('Failed to share brain:', error);
    }
  };

  const handleCopyLink = () => {
    const shareLink = `${window.location.origin}/brain/${shareHash}`;
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              My Second Brain
            </h1>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <button
                onClick={handleShareBrain}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-200 rounded-lg hover:bg-slate-700 transition-all border border-slate-600"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Content</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {contents.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-4">
              <FileText className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">No content yet</h2>
            <p className="text-slate-500 mb-6">Start building your second brain by adding content</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-5 h-5" />
              Add Your First Content
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <ContentCard
                key={content._id}
                content={content}
                onDelete={handleDeleteContent}
              />
            ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-700 my-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Add Content</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddContent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Content Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewContent({ ...newContent, type: 'youtube' })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      newContent.type === 'youtube'
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : 'border-slate-600 bg-slate-900/50 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <span className="font-medium">YouTube</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewContent({ ...newContent, type: 'twitter' })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      newContent.type === 'twitter'
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-slate-600 bg-slate-900/50 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    <span className="font-medium">Twitter</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewContent({ ...newContent, type: 'link' })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      newContent.type === 'link'
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-slate-600 bg-slate-900/50 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <LinkIcon className="w-5 h-5" />
                    <span className="font-medium">Link</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewContent({ ...newContent, type: 'note' })}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      newContent.type === 'note'
                        ? 'border-green-500 bg-green-500/10 text-green-400'
                        : 'border-slate-600 bg-slate-900/50 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">Note</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newContent.title}
                  onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {newContent.type === 'note' ? 'Content' : 'Link'}
                </label>
                {newContent.type === 'note' ? (
                  <textarea
                    value={newContent.link}
                    onChange={(e) => setNewContent({ ...newContent, link: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    placeholder="Write your note here..."
                    rows={4}
                    required
                  />
                ) : (
                  <input
                    type={newContent.type === 'note' ? 'text' : 'url'}
                    value={newContent.link}
                    onChange={(e) => setNewContent({ ...newContent, link: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    placeholder={
                      newContent.type === 'youtube'
                        ? 'https://youtube.com/watch?v=...'
                        : newContent.type === 'twitter'
                        ? 'https://twitter.com/user/status/...'
                        : 'https://example.com'
                    }
                    required
                  />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
                >
                  Add Content
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showShareModal && shareHash && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Share Your Brain</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-400 mb-4">
              Share this link with anyone to let them view your content collection
            </p>

            <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-300 break-all">
                {window.location.origin}/brain/{shareHash}
              </p>
            </div>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
