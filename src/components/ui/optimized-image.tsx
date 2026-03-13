import { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  lazy?: boolean;
  fallback?: string;
  aspectRatio?: string;
  priority?: boolean;
  blurDataURL?: string;
  sizes?: string;
}

/**
 * Build a Supabase-transformed URL with the given width & quality.
 * Returns the original URL untouched for non-Supabase sources.
 */
const supabaseUrl = (src: string, width: number, quality: number): string => {
  if (!src.includes('supabase.co/storage/v1/object/public/')) return src;
  try {
    const url = new URL(src);
    url.searchParams.set('width', String(width));
    url.searchParams.set('quality', String(quality));
    return url.toString();
  } catch {
    return src;
  }
};

/** Responsive srcSet for Supabase images */
const buildSrcSet = (src: string, quality: number): string | undefined => {
  if (!src.includes('supabase.co/storage/v1/object/public/')) return undefined;
  return [240, 320, 480, 640, 800]
    .map((w) => `${supabaseUrl(src, w, quality)} ${w}w`)
    .join(', ');
};

/** Tiny 20px-wide thumbnail URL used as blur-up placeholder */
const tinyThumbUrl = (src: string): string | undefined => {
  if (!src.includes('supabase.co/storage/v1/object/public/')) return undefined;
  return supabaseUrl(src, 20, 20);
};

export const OptimizedImage = memo(({
  src,
  alt,
  lazy = true,
  fallback = '/placeholder.svg',
  aspectRatio,
  className,
  priority = false,
  blurDataURL,
  sizes,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(!lazy || priority);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine placeholder: prefer supplied blurDataURL, else generate a tiny Supabase thumb
  const placeholder = blurDataURL || tinyThumbUrl(src);

  const quality = priority ? 80 : 70;
  const optimizedSrc = supabaseUrl(src, priority ? 800 : 480, quality);

  // ---- IntersectionObserver for lazy loading ----
  useEffect(() => {
    if (!lazy || priority) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy, priority]);

  // ---- Preload critical images ----
  useEffect(() => {
    if (!priority || !src) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = optimizedSrc;
    document.head.appendChild(link);
    return () => {
      document.head.contains(link) && document.head.removeChild(link);
    };
  }, [priority, optimizedSrc]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden',
        aspectRatio && `aspect-${aspectRatio}`,
        className,
      )}
      style={!priority && lazy ? { contentVisibility: 'auto' } : undefined}
    >
      {/* Blur-up placeholder layer */}
      {!isLoaded && (
        placeholder ? (
          <img
            src={placeholder}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg"
          />
        ) : (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )
      )}

      {/* Main image */}
      {inView && (
        <img
          src={error ? fallback : optimizedSrc}
          srcSet={!error ? buildSrcSet(src, quality) : undefined}
          sizes={sizes || '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          onError={() => { setError(true); setIsLoaded(true); }}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
          )}
          // iOS WebKit: force rasterisation to avoid blank-image rendering bugs
          style={{ WebkitTransform: 'translateZ(0)' }}
          {...props}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';
