import { useState, useRef, useEffect } from 'react';
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

export const OptimizedImage = ({ 
  src, 
  alt, 
  lazy = true, 
  fallback = "/placeholder.svg",
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
  const imgRef = useRef<HTMLImageElement>(null);

  // Add Supabase image transformation for faster loading
  const getOptimizedSrc = (originalSrc: string): string => {
    // For Supabase storage URLs, we can add transformation parameters
    if (originalSrc.includes('supabase.co/storage/v1/object/public/')) {
      // Add width parameter to resize images on the server side
      const url = new URL(originalSrc);
      // For list views, use smaller images
      if (!priority && lazy) {
        url.searchParams.set('width', '800');
        url.searchParams.set('quality', '80');
      }
      return url.toString();
    }
    return originalSrc;
  };

  // Generate responsive srcset for Supabase images
  const getSrcSet = (originalSrc: string): string | undefined => {
    if (!originalSrc.includes('supabase.co/storage/v1/object/public/')) return undefined;
    const widths = [320, 480, 640, 800, 1024, 1280, 1600];
    const quality = priority ? '85' : '75';
    return widths
      .map((w) => {
        const url = new URL(originalSrc);
        url.searchParams.set('width', String(w));
        url.searchParams.set('quality', quality);
        return `${url.toString()} ${w}w`;
      })
      .join(', ');
  };

  useEffect(() => {
    if (!lazy || priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority]);

  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = getOptimizedSrc(src);
      document.head.appendChild(link);
      
      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [priority, src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div 
      ref={imgRef}
      className={cn("relative overflow-hidden", aspectRatio && `aspect-${aspectRatio}`, className)}
    >
      {!isLoaded && (
        <>
          {blurDataURL ? (
            <img
              src={blurDataURL}
              alt=""
              className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
              aria-hidden="true"
            />
          ) : (
            <div className="absolute inset-0 bg-muted animate-pulse" />
          )}
        </>
      )}
      
      <img
        src={inView ? (error ? fallback : getOptimizedSrc(src)) : (blurDataURL || fallback)}
        alt={alt}
        loading={priority ? "eager" : (lazy ? "lazy" : "eager")}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        srcSet={inView && !error ? getSrcSet(src) : undefined}
        className={cn(
          "w-full h-full object-cover transition-all duration-300",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        )}
        {...props}
      />
    </div>
  );
};