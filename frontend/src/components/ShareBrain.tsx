import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brain, FileText, ArrowLeft } from 'lucide-react';
import { getSharedBrain } from '../lib/api';
import type { SharedBrain as SharedBrainType } from '../lib/api';
import { ContentCard } from './ContentCard';
import { AppNav, LoadingPage, PageShell, DarkCard, btnOutline, btnPrimary } from './ui/theme';

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
      } catch {
        setError('Failed to load shared brain. Invalid or expired link.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedBrain();
  }, [sharelink]);

  if (loading) return <LoadingPage message="Loading shared brain..." />;

  if (error || !brainData) {
    return (
      <PageShell>
        <div className="min-h-screen flex items-center justify-center p-4">
          <DarkCard className="text-center p-10 max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
              <Brain className="w-10 h-10 text-violet-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Brain Not Found</h2>
            <p className="text-zinc-400 mb-6">{error}</p>
            <button onClick={() => navigate('/')} className={`${btnPrimary} px-6 py-3 mx-auto`}>
              <ArrowLeft className="w-5 h-5" />
              Go Home
            </button>
          </DarkCard>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <AppNav title={`${brainData.userName}'s Brain`} subtitle="Shared knowledge collection">
        <button onClick={() => navigate('/')} className={btnOutline}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </AppNav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {brainData.content.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-violet-500/10 border border-violet-500/20 rounded-full mb-4">
              <FileText className="w-10 h-10 text-violet-400" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No content yet</h2>
            <p className="text-zinc-400">This brain is empty at the moment</p>
          </div>
        ) : (
          <>
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Shared Content Collection
              </h2>
              <p className="text-zinc-400">
                {brainData.content.length} {brainData.content.length === 1 ? 'item' : 'items'} in this brain
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {brainData.content.map((content) => (
                <ContentCard key={content._id} content={content} />
              ))}
            </div>
          </>
        )}
      </main>
    </PageShell>
  );
};
