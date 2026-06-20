import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import type { ReactNode } from 'react';
import { LoadingPage } from './Loading';

interface AppNavProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export const AppNav = ({ title, subtitle, children }: AppNavProps) => (
  <nav className="sticky top-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center glow-violet-sm group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-white" />
            </div>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-xs text-zinc-500">{subtitle}</p>}
          </div>
        </div>
        {children && (
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {children}
          </div>
        )}
      </div>
    </div>
  </nav>
);

export const LoadingScreen = () => <LoadingPage />;

// Re-export from Loading component
export { LoadingPage, LoadingOverlay } from './Loading';

export const PageShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-[#0a0a0f] text-white">
    <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(124,58,237,0.12),transparent)] pointer-events-none" />
    <div className="relative">{children}</div>
  </div>
);

export const DarkCard = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

export const ModalOverlay = ({
  children,
  onClose,
  closeOnBackdrop = true,
}: {
  children: ReactNode;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
}) => (
  <div
    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
    onClick={closeOnBackdrop && onClose ? onClose : undefined}
  >
    <div onClick={(e) => e.stopPropagation()} className="w-full flex justify-center">{children}</div>
  </div>
);

export const btnOutline = 'flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 border border-white/10 rounded-lg hover:bg-white/5 hover:text-white transition-all';
export const btnPrimary = 'flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg btn-gradient hover:scale-[1.02] transition-all';
export const btnDanger = 'flex items-center gap-2 px-4 py-2 text-sm text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all';
export const inputDark = 'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all';
