import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, Link as LinkIcon, FileText, Video, ExternalLink, ArrowLeft } from 'lucide-react';
import { getSharedBrain } from '../lib/api';
import type { SharedBrain as SharedBrainType } from '../lib/api';

export const SharedBrain = () => {
  const { sharelink } = useParams<{ sharelink: string }>();
  const navigate = useNavigate();
  const [brainData, setBrainData] = useState<SharedBrainType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedBrain = async () => {
      if (!sharelink) return;

      try {
        const data = await getSharedBrain(sharelink);
        setBrainData(data);
      } catch (err) {
        setError('Failed to load shared brain. Invalid or expired link.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedBrain();
  }, [sharelink]);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      default:
        return <LinkIcon className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
        return 'from-red-500 to-pink-500';
      case 'document':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-cyan-500 to-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !brainData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full mb-4">
            <Brain className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Brain Not Found</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{brainData.userName}'s Brain</h1>
                <p className="text-xs text-slate-400">Shared knowledge collection</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-200 rounded-lg hover:bg-slate-700 transition-all border border-slate-600"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {brainData.content.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800/50 rounded-full mb-4">
              <FileText className="w-10 h-10 text-slate-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-300 mb-2">No content yet</h2>
            <p className="text-slate-500">This brain is empty at the moment</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Shared Content Collection
              </h2>
              <p className="text-slate-400">
                {brainData.content.length} {brainData.content.length === 1 ? 'item' : 'items'} in this brain
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brainData.content.map((content) => (
                <div
                  key={content._id}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${getTypeColor(content.type)} rounded-lg shadow-lg`}>
                      {getTypeIcon(content.type)}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {content.title || 'Untitled'}
                  </h3>

                  <p className="text-sm text-slate-400 mb-4 line-clamp-2 break-all">
                    {content.link}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">
                      {content.type}
                    </span>
                    <a
                      href={content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                    >
                      Open
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};
