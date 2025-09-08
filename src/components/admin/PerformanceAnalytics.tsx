import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { secureLog } from '@/utils/secureLogger';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

interface WebVitalsData {
  metric_name: string;
  value: number;
  rating: string;
  page_url: string;
  created_at: string;
}

interface ImageMetricsData {
  image_url: string;
  load_time_ms: number;
  page_url: string;
  is_lazy_loaded: boolean;
  created_at: string;
}

const COLORS = {
  good: 'hsl(var(--success))',
  'needs-improvement': 'hsl(var(--warning))',
  poor: 'hsl(var(--destructive))'
};

export const PerformanceAnalytics = () => {
  const [webVitals, setWebVitals] = useState<WebVitalsData[]>([]);
  const [imageMetrics, setImageMetrics] = useState<ImageMetricsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      const [webVitalsResponse, imageMetricsResponse] = await Promise.all([
        supabase
          .from('performance_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000),
        supabase
          .from('image_performance_metrics')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000)
      ]);

      if (webVitalsResponse.error) {
        secureLog.error('Error fetching web vitals', webVitalsResponse.error);
      } else {
        setWebVitals(webVitalsResponse.data || []);
      }

      if (imageMetricsResponse.error) {
        secureLog.error('Error fetching image metrics', imageMetricsResponse.error);
      } else {
        setImageMetrics(imageMetricsResponse.data || []);
      }
    } catch (error) {
      secureLog.error('Error fetching performance data', error);
    } finally {
      setLoading(false);
    }
  };

  const getWebVitalsStats = () => {
    const metrics = ['LCP', 'FCP', 'CLS', 'INP', 'TTFB'];
    return metrics.map(metric => {
      const metricData = webVitals.filter(v => v.metric_name === metric);
      const avgValue = metricData.length > 0 
        ? metricData.reduce((sum, v) => sum + v.value, 0) / metricData.length 
        : 0;
      
      const ratings = metricData.reduce((acc, v) => {
        acc[v.rating] = (acc[v.rating] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        name: metric,
        avgValue: Math.round(avgValue),
        count: metricData.length,
        good: ratings.good || 0,
        'needs-improvement': ratings['needs-improvement'] || 0,
        poor: ratings.poor || 0
      };
    });
  };

  const getImageStats = () => {
    const totalImages = imageMetrics.length;
    const avgLoadTime = totalImages > 0 
      ? Math.round(imageMetrics.reduce((sum, img) => sum + img.load_time_ms, 0) / totalImages)
      : 0;
    const lazyLoadedCount = imageMetrics.filter(img => img.is_lazy_loaded).length;
    
    return {
      totalImages,
      avgLoadTime,
      lazyLoadedCount,
      lazyLoadedPercentage: totalImages > 0 ? Math.round((lazyLoadedCount / totalImages) * 100) : 0
    };
  };

  const getTopSlowImages = () => {
    return imageMetrics
      .sort((a, b) => b.load_time_ms - a.load_time_ms)
      .slice(0, 10)
      .map(img => ({
        url: img.image_url.split('/').pop() || img.image_url,
        loadTime: Math.round(img.load_time_ms),
        page: img.page_url,
        isLazy: img.is_lazy_loaded
      }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const webVitalsStats = getWebVitalsStats();
  const imageStats = getImageStats();
  const topSlowImages = getTopSlowImages();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Performance Analytics</h2>
        <p className="text-muted-foreground">Monitor Web Vitals and image loading performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webVitals.length}</div>
            <p className="text-xs text-muted-foreground">Web Vitals recorded</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Images Tracked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imageStats.totalImages}</div>
            <p className="text-xs text-muted-foreground">Image loads measured</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Image Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imageStats.avgLoadTime}ms</div>
            <p className="text-xs text-muted-foreground">Average load time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lazy Loading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imageStats.lazyLoadedPercentage}%</div>
            <p className="text-xs text-muted-foreground">Images lazy loaded</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="web-vitals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="web-vitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="images">Image Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="web-vitals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Web Vitals Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {webVitalsStats.map((stat) => (
                  <div key={stat.name} className="space-y-2">
                    <h4 className="font-semibold">{stat.name}</h4>
                    <div className="text-2xl font-bold">{stat.avgValue}ms</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Good</span>
                        <span>{stat.good}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Needs Improvement</span>
                        <span>{stat['needs-improvement']}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Poor</span>
                        <span>{stat.poor}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Web Vitals Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={webVitalsStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="good" stackId="a" fill={COLORS.good} />
                    <Bar dataKey="needs-improvement" stackId="a" fill={COLORS['needs-improvement']} />
                    <Bar dataKey="poor" stackId="a" fill={COLORS.poor} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Slowest Loading Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topSlowImages.map((image, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{image.url}</p>
                      <p className="text-xs text-muted-foreground truncate">{image.page}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {image.isLazy && <Badge variant="secondary" className="text-xs">Lazy</Badge>}
                      <Badge variant={image.loadTime > 1000 ? "destructive" : image.loadTime > 500 ? "secondary" : "default"}>
                        {image.loadTime}ms
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Trend analysis will be available once more data is collected</p>
                <p className="text-sm mt-2">Check back after users have browsed the site for a few days</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};