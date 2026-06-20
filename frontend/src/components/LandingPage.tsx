import { useState } from 'react';
import {
  Brain,
  ArrowRight,
  Youtube,
  FileText,
  Link2,
  Share2,
  Sparkles,
  Zap,
  LayoutGrid,
  Menu,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LinkedInIcon, InstagramIcon, TwitterIcon } from '../lib/contentTypes';

const NAV_LINKS = ['Features', 'How it Works', 'Sharing'];

const FLOATING_CARDS = [
  { label: 'YouTube', icon: Youtube, color: 'text-red-400', position: 'top-[18%] left-[8%] sm:left-[12%]', delay: 'animate-float' },
  { label: 'Twitter', icon: TwitterIcon, color: 'text-sky-400', position: 'top-[12%] right-[8%] sm:right-[14%]', delay: 'animate-float-delayed' },
  { label: 'LinkedIn', icon: LinkedInIcon, color: 'text-blue-400', position: 'top-[42%] left-[4%] sm:left-[6%]', delay: 'animate-float-slow' },
  { label: 'Instagram', icon: InstagramIcon, color: 'text-pink-400', position: 'top-[38%] right-[4%] sm:right-[8%]', delay: 'animate-float' },
  { label: 'Notes', icon: FileText, color: 'text-violet-400', position: 'bottom-[28%] left-[10%] sm:left-[16%]', delay: 'animate-float-delayed' },
  { label: 'Links', icon: Link2, color: 'text-emerald-400', position: 'bottom-[32%] right-[10%] sm:right-[16%]', delay: 'animate-float-slow' },
];

const FEATURES = [
  {
    icon: LayoutGrid,
    title: 'All Content, One Place',
    description: 'Save YouTube, Twitter, LinkedIn, Instagram posts, links, and notes in one dashboard.',
  },
  {
    icon: Sparkles,
    title: 'Smart Organization',
    description: 'Categorize everything by type so you can find what you need instantly.',
  },
  {
    icon: Share2,
    title: 'One-Link Sharing',
    description: 'Share your entire knowledge collection with anyone using a single public link.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Add, browse, and delete content in seconds with a clean, intuitive interface.',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Create an account',
    desc: 'Sign up in seconds and access your personal dashboard.',
  },
  {
    step: '02',
    title: 'Add your content',
    desc: 'Choose a content type and paste the URL. YouTube, Twitter, LinkedIn, Instagram, links, and notes are all supported.',
  },
  {
    step: '03',
    title: 'Share with anyone',
    desc: 'Generate a public link and share your entire brain collection with the world.',
  },
];

const EMBED_GUIDES = [
  {
    platform: 'Twitter / X',
    icon: TwitterIcon,
    color: 'text-sky-400',
    border: 'border-sky-500/20 bg-sky-500/5',
    steps: [
      'Open the tweet you want to save on twitter.com or x.com.',
      'Click the share icon on the tweet and select "Copy link to post".',
      'In Second Brain, choose Twitter as the content type and paste the URL.',
      'The tweet will be saved and linked — click Open to view it on X.',
    ],
    example: 'https://x.com/username/status/1234567890123456789',
  },
  {
    platform: 'LinkedIn',
    icon: LinkedInIcon,
    color: 'text-blue-400',
    border: 'border-blue-500/20 bg-blue-500/5',
    steps: [
      'Open the LinkedIn post you want to save.',
      'Click the three dots (•••) on the post and select "Copy link to post".',
      'In Second Brain, choose LinkedIn as the content type and paste the URL.',
      'The post will embed automatically if the link contains an activity ID.',
    ],
    example: 'https://www.linkedin.com/posts/username_activity-7123456789012345678-AbCd',
  },
  {
    platform: 'Instagram',
    icon: InstagramIcon,
    color: 'text-pink-400',
    border: 'border-pink-500/20 bg-pink-500/5',
    steps: [
      'Open the Instagram post or reel in your browser.',
      'Copy the URL from the address bar (must include /p/ or /reel/).',
      'In Second Brain, choose Instagram as the content type and paste the link.',
      'The post will display as an embedded preview on your dashboard.',
    ],
    example: 'https://www.instagram.com/p/ABC123xyz/ or /reel/ABC123xyz/',
  },
];

export const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cookieAccepted, setCookieAccepted] = useState(
    () => localStorage.getItem('cookies-accepted') === 'true'
  );

  const acceptCookies = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setCookieAccepted(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center glow-violet-sm group-hover:scale-105 transition-transform">
                <Brain className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
              </div>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">Second Brain</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-white rounded-full btn-gradient hover:scale-105 transition-transform"
              >
                Sign Up
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-zinc-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-white/5 mt-2 pt-4 space-y-3">
              {NAV_LINKS.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-zinc-400 hover:text-white py-2 transition-colors"
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm text-zinc-300 border border-white/10 rounded-lg hover:bg-white/5"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 text-sm font-semibold text-white rounded-lg btn-gradient"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center pt-20 sm:pt-24 pb-20 sm:pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(124,58,237,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,rgba(139,92,246,0.08),transparent)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-[55%] animate-beam-pulse">
          <div className="absolute inset-0 bg-gradient-to-t from-violet-500 via-violet-400/60 to-transparent blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-violet-400 via-white/40 to-transparent blur-md scale-x-[8]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl" />
        </div>

        <div className="absolute inset-0 pointer-events-none hidden sm:block">
          {FLOATING_CARDS.map(({ label, icon: Icon, color, position, delay }) => (
            <div key={label} className={`absolute ${position} ${delay}`}>
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl glow-violet-sm">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-sm font-medium text-zinc-300">{label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full mb-8">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-medium text-violet-300 tracking-wide uppercase">
              Your Personal Knowledge Hub
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 px-2">
            The{' '}
            <span className="text-gradient-violet">content creation</span>
            <br />
            cheat code.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Capture everything that inspires you — videos, social posts, articles, and notes —
            then share your entire brain with the world in one click.
          </p>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold text-white rounded-full btn-gradient hover:scale-105 transition-all glow-violet"
          >
            Start Your Second Brain
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(124,58,237,0.1),transparent)]" />
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Everything you need to{' '}
              <span className="text-gradient-violet">organize your mind</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto">
              A powerful yet simple tool for creators, learners, and thinkers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-600/20 border border-violet-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-zinc-400">Three simple steps to build your second brain</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="text-5xl font-extrabold text-violet-500/20 mb-4">{step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-10 px-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">How to embed Twitter, LinkedIn & Instagram</h3>
            <p className="text-zinc-400 text-sm">Follow these steps to save social posts to your brain</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {EMBED_GUIDES.map(({ platform, icon: Icon, color, border, steps, example }) => (
              <div key={platform} className={`rounded-2xl border p-6 ${border}`}>
                <div className="flex items-center gap-3 mb-4">
                  <Icon className={`w-6 h-6 ${color}`} />
                  <h4 className="text-lg font-semibold text-white">{platform}</h4>
                </div>
                <ol className="space-y-2.5 mb-4">
                  {steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-zinc-400">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-violet-400 font-medium">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                  <p className="text-[10px] uppercase tracking-wide text-zinc-500 mb-1">Example URL</p>
                  <p className="text-xs text-zinc-400 font-mono break-all">{example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="sharing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-violet-500/10 to-transparent border border-violet-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)]" />
            <div className="relative">
              <Share2 className="w-10 h-10 text-violet-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Share your brain with{' '}
                <span className="text-gradient-violet">one link</span>
              </h2>
              <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
                Generate a unique share link and let anyone view your curated content collection — no account needed.
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-full btn-gradient hover:scale-105 transition-all"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-300">Second Brain</span>
          </div>
          <p className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} Second Brain. Built for knowledge seekers.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Login</Link>
            <Link to="/signup" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>

      {!cookieAccepted && (
        <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 p-4 rounded-2xl bg-[#16161f]/95 backdrop-blur-xl border border-white/10 shadow-2xl">
          <p className="text-sm text-zinc-400 mb-4">
            We use cookies to improve your experience. By continuing, you agree to our cookie policy.
          </p>
          <div className="flex gap-3">
            <button onClick={acceptCookies} className="flex-1 py-2.5 text-sm font-semibold text-white rounded-full btn-gradient">
              Accept
            </button>
            <button onClick={acceptCookies} className="flex-1 py-2.5 text-sm font-medium text-zinc-400 border border-white/10 rounded-full hover:bg-white/5 transition-colors">
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
