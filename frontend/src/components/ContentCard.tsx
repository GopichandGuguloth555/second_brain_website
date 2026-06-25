import { useState } from 'react';
import { ExternalLink, Video, FileText, Link as LinkIcon, Trash2, AlertTriangle } from 'lucide-react';
import {
  getYouTubeEmbedUrl,
  getTwitterEmbedUrl,
  getInstagramEmbedUrl,
  getLinkedInEmbedUrl,
  getOpenUrl,
  getDisplayLink,
  isEmbedHtml,
  LinkedInIcon,
  InstagramIcon,
  TwitterIcon,
} from '../lib/contentTypes';
import { EmbedFrame } from './EmbedFrame';
import { DarkCard, btnOutline, btnDanger } from './ui/theme';

interface ContentCardProps {
  content: {
    _id: string;
    title: string;
    link: string;
    type: string;
  };
  onDelete?: (id: string) => Promise<void> | void;
}

export const ContentCard = ({ content, onDelete }: ContentCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openUrl = getOpenUrl(content.link);
  const displayLink = getDisplayLink(content.link);
  const hideRawLink = content.type !== 'note' && isEmbedHtml(content.link);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'youtube':
        return <Video className="w-5 h-5 text-white" />;
      case 'twitter':
        return <TwitterIcon className="w-5 h-5 text-white" />;
      case 'linkedin':
        return <LinkedInIcon className="w-5 h-5 text-white" />;
      case 'instagram':
        return <InstagramIcon className="w-5 h-5 text-white" />;
      case 'note':
        return <FileText className="w-5 h-5 text-white" />;
      default:
        return <LinkIcon className="w-5 h-5 text-white" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'youtube':
        return 'from-red-500/80 to-pink-600/80';
      case 'twitter':
        return 'from-sky-500/80 to-blue-600/80';
      case 'linkedin':
        return 'from-blue-600/80 to-blue-800/80';
      case 'instagram':
        return 'from-pink-500/80 to-purple-600/80';
      case 'note':
        return 'from-violet-500/80 to-purple-600/80';
      default:
        return 'from-violet-600/80 to-purple-700/80';
    }
  };

  const renderFallback = (label: string) => (
    <div className="relative w-full bg-white/5 rounded-lg p-4 mb-4 border border-amber-500/20">
      <p className="text-amber-400/90 text-xs mb-2">
        Could not embed — paste the post URL (not embed HTML)
      </p>
      <p className="text-zinc-400 text-sm">{label}</p>
      <a
        href={openUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1 mt-2"
      >
        View original <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );

  const renderContent = () => {
    const title = content.title || 'Untitled';

    switch (content.type.toLowerCase()) {
      case 'youtube': {
        const embedUrl = getYouTubeEmbedUrl(content.link);
        return embedUrl ? (
          <EmbedFrame src={embedUrl} title={title} heightClass="h-48 sm:h-52" />
        ) : renderFallback('YouTube video');
      }
      case 'twitter': {
        const embedUrl = getTwitterEmbedUrl(content.link);
        return embedUrl ? (
          <EmbedFrame src={embedUrl} title={title} heightClass="h-[420px] sm:h-[480px]" />
        ) : renderFallback('Twitter / X post');
      }
      case 'linkedin': {
        const embedUrl = getLinkedInEmbedUrl(content.link);
        return embedUrl ? (
          <EmbedFrame src={embedUrl} title={title} heightClass="h-[480px] sm:h-[520px]" />
        ) : renderFallback('LinkedIn post');
      }
      case 'instagram': {
        const embedUrl = getInstagramEmbedUrl(content.link);
        return embedUrl ? (
          <EmbedFrame src={embedUrl} title={title} heightClass="h-80 sm:h-96" />
        ) : renderFallback('Instagram post');
      }
      case 'note':
        return (
          <div className="bg-white/5 rounded-lg p-4 mb-4 border border-white/10">
            <p className="text-zinc-300 text-sm whitespace-pre-wrap line-clamp-6">{content.link}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete(content._id);
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white/[0.03] rounded-xl border border-white/10 p-4 sm:p-6 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all group">
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className={`p-3 bg-gradient-to-br ${getTypeColor(content.type)} rounded-lg shadow-sm border border-white/10 shrink-0`}>
            {getTypeIcon(content.type)}
          </div>
          {onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}
        </div>

        {renderContent()}

        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {content.title || 'Untitled'}
        </h3>

        {content.type !== 'note' && !hideRawLink && (
          <p className="text-sm text-zinc-500 mb-4 line-clamp-2 break-all">{displayLink}</p>
        )}

        {content.type !== 'note' && hideRawLink && (
          <p className="text-xs text-zinc-500 mb-4 truncate">{displayLink}</p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full capitalize">
            {content.type}
          </span>
          {content.type !== 'note' && (
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-violet-400 hover:text-violet-300 transition-colors text-sm font-medium"
            >
              Open
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <DarkCard className="max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Delete content?</h3>
            </div>
            <p className="text-zinc-400 text-sm mb-2">
              Are you sure you want to delete <span className="text-white font-medium">&quot;{content.title || 'Untitled'}&quot;</span>?
            </p>
            <p className="text-zinc-500 text-xs mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className={`flex-1 ${btnOutline} justify-center py-2.5 disabled:opacity-50`}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className={`flex-1 ${btnDanger} justify-center py-2.5 bg-red-500/20 border-red-500/40 disabled:opacity-50`}
              >
                {deleting ? (
                  <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </DarkCard>
        </div>
      )}
    </>
  );
};
