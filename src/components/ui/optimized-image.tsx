import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePerformanceTracking } from '@/hooks/usePerformanceTracking';

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
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);
  const { trackImagePerformance } = usePerformanceTracking();

  // Generate WebP source if supported
  const getOptimizedSrc = (originalSrc: string): string => {
    if (originalSrc.includes('supabase') && !originalSrc.includes('.webp')) {
      return originalSrc;
    }
    return originalSrc;
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
      { rootMargin: '100px' }
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
    if (loadStartTime) {
      const loadTime = performance.now() - loadStartTime;
      trackImagePerformance(src, loadTime, undefined, lazy);
    }
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (inView && !loadStartTime) {
      setLoadStartTime(performance.now());
    }
  }, [inView, loadStartTime]);

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
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
        )}
        {...props}
      />
    </div>
  );
};