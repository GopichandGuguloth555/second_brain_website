import { Brain, BookOpen, Share2, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/50 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Second Brain
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(6,182,212,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.1),transparent_50%)]" />

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-300">Your Personal Knowledge Hub</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Build Your
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">
                  Second Brain
                </span>
              </h1>

              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Capture, organize, and share everything that matters. Store videos, articles, tweets, and notes in one beautiful place.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-2 text-lg font-semibold"
                >
                  Start Building Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm text-slate-200 rounded-xl hover:bg-slate-800 transition-all border border-slate-700 text-lg font-semibold"
                >
                  Sign In
                </Link>
              </div>
            </div>

          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Powerful features to organize your digital life
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<BookOpen className="w-6 h-6" />}
                title="Rich Content"
                description="Save YouTube videos, articles, tweets, and personal notes"
                gradient="from-cyan-500 to-blue-500"
              />
              <FeatureCard
                icon={<Brain className="w-6 h-6" />}
                title="Smart Organization"
                description="Organize content with tags and categories effortlessly"
                gradient="from-blue-500 to-violet-500"
              />
              <FeatureCard
                icon={<Share2 className="w-6 h-6" />}
                title="Easy Sharing"
                description="Share your entire knowledge base with a single link"
                gradient="from-violet-500 to-pink-500"
              />
              <FeatureCard
                icon={<Lock className="w-6 h-6" />}
                title="Secure & Private"
                description="Your data is encrypted and stored securely"
                gradient="from-pink-500 to-rose-500"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-12 shadow-2xl">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-slate-400 mb-8">
                Join thousands building their second brain today
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-xl shadow-cyan-500/20 text-lg font-semibold"
              >
                Create Your Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500">
            &copy; 2025 Second Brain. Built with care for knowledge seekers.
          </p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard = ({ icon, title, description, gradient }: FeatureCardProps) => {
  return (
    <div className="group relative bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-900/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className={`inline-flex p-3 bg-gradient-to-br ${gradient} rounded-lg shadow-lg mb-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
