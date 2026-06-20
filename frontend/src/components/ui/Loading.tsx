import { Brain } from 'lucide-react';

interface LoadingPageProps {
  message?: string;
}

export const LoadingPage = ({ message = 'Loading...' }: LoadingPageProps) => (
  <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.15),transparent)] pointer-events-none" />
    <div className="relative flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center glow-violet-sm mb-6 animate-pulse">
        <Brain className="w-8 h-8 text-white" />
      </div>
      <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4" />
      <p className="text-sm text-zinc-400 font-medium">{message}</p>
    </div>
  </div>
);

interface LoadingOverlayProps {
  message?: string;
  show?: boolean;
}

export const LoadingOverlay = ({ message = 'Please wait...', show = true }: LoadingOverlayProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12121a]/95 border border-white/10 rounded-2xl px-8 py-6 flex flex-col items-center gap-4 shadow-2xl max-w-xs w-full">
        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-sm text-zinc-300 text-center font-medium">{message}</p>
      </div>
    </div>
  );
};
