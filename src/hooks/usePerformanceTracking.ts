import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';

interface WebVitalsMetric {
  name: 'LCP' | 'FCP' | 'CLS' | 'INP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

// Define thresholds for Web Vitals metrics
const getMetricRating = (name: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
  switch (name) {
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'INP':
      return value <= 200 ? 'good' : value <= 500 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
    default:
      return 'needs-improvement';
  }
};

export const usePerformanceTracking = () => {
  const { user } = useAuth();

  const trackWebVitals = async (metric: WebVitalsMetric) => {
    try {
      const { error } = await supabase
        .from('performance_metrics')
        .insert({
          user_id: user?.id || null,
          page_url: window.location.href,
          metric_name: metric.name,
          value: metric.value,
          rating: metric.rating,
          user_agent: navigator.userAgent,
          connection_type: (navigator as any).connection?.effectiveType || 'unknown'
        });

      if (error) {
        secureLog.error('Failed to track web vitals', error);
      } else {
        secureLog.info(`Web Vital tracked: ${metric.name} = ${metric.value}ms (${metric.rating})`);
      }
    } catch (error) {
      secureLog.error('Error tracking web vitals', error);
    }
  };

  const trackImagePerformance = async (imageUrl: string, loadTimeMs: number, sizeBytes?: number, isLazyLoaded = false) => {
    try {
      const { error } = await supabase
        .from('image_performance_metrics')
        .insert({
          user_id: user?.id || null,
          image_url: imageUrl,
          image_size_bytes: sizeBytes || null,
          load_time_ms: loadTimeMs,
          page_url: window.location.href,
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight,
          is_lazy_loaded: isLazyLoaded
        });

      if (error) {
        secureLog.error('Failed to track image performance', error);
      } else {
        secureLog.info(`Image performance tracked: ${imageUrl} loaded in ${loadTimeMs}ms`);
      }
    } catch (error) {
      secureLog.error('Error tracking image performance', error);
    }
  };

  useEffect(() => {
    // Track Web Vitals using the new web-vitals API
    if ('web-vitals' in window || typeof window !== 'undefined') {
      // LCP - Largest Contentful Paint
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        if (lastEntry.startTime) {
          const metric: WebVitalsMetric = {
            name: 'LCP',
            value: lastEntry.startTime,
            rating: getMetricRating('LCP', lastEntry.startTime)
          };
          trackWebVitals(metric);
        }
      });

      try {
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        secureLog.warn('LCP observer not supported');
      }

      // FCP - First Contentful Paint
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcpEntry = entries[0];
        
        if (fcpEntry.startTime) {
          const metric: WebVitalsMetric = {
            name: 'FCP',
            value: fcpEntry.startTime,
            rating: getMetricRating('FCP', fcpEntry.startTime)
          };
          trackWebVitals(metric);
          fcpObserver.disconnect();
        }
      });

      try {
        fcpObserver.observe({ type: 'paint', buffered: true });
      } catch (e) {
        secureLog.warn('FCP observer not supported');
      }

      // TTFB - Time to First Byte
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry && navigationEntry.responseStart) {
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        const metric: WebVitalsMetric = {
          name: 'TTFB',
          value: ttfb,
          rating: getMetricRating('TTFB', ttfb)
        };
        trackWebVitals(metric);
      }

      return () => {
        observer.disconnect();
        fcpObserver.disconnect();
      };
    }
  }, [user]);

  return { trackImagePerformance };
};