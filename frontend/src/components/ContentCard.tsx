import { X, ExternalLink, Video, FileText, Link as LinkIcon } from 'lucide-react';

interface ContentCardProps {
  content: {
    _id: string;
    title: string;
    link: string;
    type: string;
  };
  onDelete: (id: string) => void;
}

export const ContentCard = ({ content, onDelete }: ContentCardProps) => {
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const getTwitterEmbedUrl = (url: string) => {
    const tweetId = url.match(/status\/(\d+)/)?.[1];
    return tweetId;
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'youtube':
        return <Video className="w-5 h-5 text-white" />;
      case 'twitter':
        return <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
      case 'note':
        return <FileText className="w-5 h-5 text-white" />;
      default:
        return <LinkIcon className="w-5 h-5 text-white" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'youtube':
        return 'from-red-500 to-pink-500';
      case 'twitter':
        return 'from-blue-500 to-cyan-500';
      case 'note':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-cyan-500 to-blue-500';
    }
  };

  const renderContent = () => {
    switch (content.type.toLowerCase()) {
      case 'youtube': {
        const embedUrl = getYouTubeEmbedUrl(content.link);
        if (embedUrl) {
          return (
            <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden mb-4">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          );
        }
        break;
      }
      case 'twitter': {
        const tweetId = getTwitterEmbedUrl(content.link);
        if (tweetId) {
          return (
            <div className="relative w-full bg-slate-900 rounded-lg p-4 mb-4">
              <p className="text-slate-400 text-sm">Twitter Post</p>
              <a
                href={content.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 mt-2"
              >
                View on Twitter <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          );
        }
        break;
      }
      case 'note':
        return (
          <div className="bg-slate-900/50 rounded-lg p-4 mb-4 border border-slate-700">
            <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-6">{content.link}</p>
          </div>
        );
    }
    return null;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 bg-gradient-to-br ${getTypeColor(content.type)} rounded-lg shadow-lg`}>
          {getTypeIcon(content.type)}
        </div>
        <button
          onClick={() => onDelete(content._id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {renderContent()}

      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
        {content.title || 'Untitled'}
      </h3>

      {content.type !== 'note' && (
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 break-all">
          {content.link}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 bg-slate-700/50 px-3 py-1 rounded-full">
          {content.type}
        </span>
        {content.type !== 'note' && (
          <a
            href={content.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
          >
            Open
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};
