/** Extract the first URL from pasted embed HTML or return trimmed input */
export function normalizeContentLink(input: string): string {
  const trimmed = input.trim();
  if (trimmed.includes('<') || trimmed.includes('&lt;')) {
    const hrefMatch = trimmed.match(/href=["'](https?:\/\/[^"']+)["']/i);
    if (hrefMatch) return hrefMatch[1];
    const urlMatch = trimmed.match(/https?:\/\/[^\s"'<>]+/i);
    if (urlMatch) return urlMatch[0].replace(/&amp;/g, '&');
  }
  return trimmed;
}

export function getYouTubeEmbedUrl(input: string): string | null {
  const link = normalizeContentLink(input);
  const videoId = link.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export function getTwitterTweetId(input: string): string | null {
  const link = normalizeContentLink(input);
  const match =
    link.match(/(?:twitter|x)\.com\/[^/]+\/status\/(\d+)/i) ||
    link.match(/status\/(\d+)/);
  return match?.[1] ?? null;
}

export function getTwitterEmbedUrl(input: string): string | null {
  const tweetId = getTwitterTweetId(input);
  if (!tweetId) return null;
  return `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}&theme=dark&dnt=true`;
}

export function getInstagramEmbedUrl(input: string): string | null {
  const link = normalizeContentLink(input);
  const postMatch = link.match(/instagram\.com\/p\/([A-Za-z0-9_-]+)/);
  if (postMatch) return `https://www.instagram.com/p/${postMatch[1]}/embed`;
  const reelMatch = link.match(/instagram\.com\/reel\/([A-Za-z0-9_-]+)/);
  if (reelMatch) return `https://www.instagram.com/reel/${reelMatch[1]}/embed`;
  return null;
}

export function getLinkedInEmbedUrl(input: string): string | null {
  const link = normalizeContentLink(input);

  const iframeMatch = input.match(/src=["'](https:\/\/www\.linkedin\.com\/embed\/[^"']+)["']/i);
  if (iframeMatch) return iframeMatch[1].replace(/&amp;/g, '&');

  if (link.includes('linkedin.com/embed/')) {
    return link.split(/[\s"']/)[0];
  }

  const urnMatch = link.match(/urn:li:(activity|share|ugcPost):(\d+)/);
  if (urnMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:${urnMatch[1]}:${urnMatch[2]}`;
  }

  const activityMatch = link.match(/activity-(\d+)/);
  if (activityMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityMatch[1]}`;
  }

  const feedMatch = link.match(/linkedin\.com\/feed\/update\/(urn:li:[^/?#\s]+)/);
  if (feedMatch) {
    return `https://www.linkedin.com/embed/feed/update/${feedMatch[1]}`;
  }

  return null;
}

export function getOpenUrl(input: string): string {
  const normalized = normalizeContentLink(input);
  if (normalized.startsWith('http')) return normalized;
  return input;
}

export function getDisplayLink(input: string): string {
  const open = getOpenUrl(input);
  if (open.length > 80) return `${open.slice(0, 77)}...`;
  return open;
}

export function isEmbedHtml(input: string): boolean {
  return input.trim().includes('<') || input.includes('blockquote') || input.includes('&lt;');
}

export function getLinkPlaceholder(type: string): string {
  switch (type) {
    case 'youtube':
      return 'https://youtube.com/watch?v=...';
    case 'twitter':
      return 'Paste tweet URL (not embed HTML): https://x.com/user/status/...';
    case 'linkedin':
      return 'Paste post URL: https://www.linkedin.com/posts/...activity-...';
    case 'instagram':
      return 'https://www.instagram.com/p/... or /reel/...';
    default:
      return 'https://example.com';
  }
}

export const LinkedInIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export const InstagramIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

export const TwitterIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
