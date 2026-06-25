interface EmbedFrameProps {
  src: string;
  title: string;
  heightClass?: string;
}

export const EmbedFrame = ({ src, title, heightClass = 'h-52 sm:h-64' }: EmbedFrameProps) => (
  <div className={`relative w-full ${heightClass} bg-black/40 rounded-lg overflow-hidden mb-4 border border-white/10`}>
    <iframe
      src={src}
      className="w-full h-full border-0"
      allowFullScreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      title={title}
      loading="lazy"
    />
  </div>
);
