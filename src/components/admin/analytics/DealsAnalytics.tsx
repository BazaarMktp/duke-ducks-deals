import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Eye, MousePointer, Users } from 'lucide-react';

interface DealAnalytics {
  deal_id: string;
  total_page_visits: number;
  total_deal_clicks: number;
  total_deal_views: number;
  unique_visitors: number;
  latest_activity: string;
  deal_title?: string;
  business_name?: string;
}

export const DealsAnalytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['deal-analytics'],
    queryFn: async () => {
      // Get analytics for all deals
      const { data: analyticsData, error: analyticsError } = await supabase
        .rpc('get_deal_analytics');
      
      if (analyticsError) throw analyticsError;

      // Get deal details to show with analytics
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('id, title, business_name');
        
      if (dealsError) throw dealsError;

      // Combine analytics with deal details
      const combined = analyticsData?.map((analytics: any) => {
        const deal = deals?.find(d => d.id === analytics.deal_id);
        return {
          ...analytics,
          deal_title: deal?.title || 'Unknown Deal',
          business_name: deal?.business_name || 'Unknown Business',
        };
      }) || [];

      return combined as DealAnalytics[];
    },
  });

  // Get overall page visits for Devils Deals page
  const { data: overallStats } = useQuery({
    queryKey: ['deal-page-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deal_metrics')
        .select('*')
        .eq('metric_type', 'page_visit')
        .is('deal_id', null);
      
      if (error) throw error;
      
      return {
        total_page_visits: data.length,
        unique_visitors: new Set(data.map(d => d.user_id).filter(Boolean)).size,
      };
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Devils Deals Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Page Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Page Visits</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats?.total_page_visits || 0}</div>
            <p className="text-xs text-muted-foreground">
              Devils Deals page visits
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats?.unique_visitors || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unique page visitors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Individual Deal Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Deal Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics && analytics.length > 0 ? (
            <div className="space-y-4">
              {analytics
                .sort((a, b) => (b.total_deal_clicks + b.total_deal_views) - (a.total_deal_clicks + a.total_deal_views))
                .map((deal) => (
                <div key={deal.deal_id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{deal.deal_title}</h3>
                      <p className="text-sm text-muted-foreground">{deal.business_name}</p>
                    </div>
                    <Badge variant="outline">
                      {deal.total_deal_clicks + deal.total_deal_views} interactions
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-sm font-medium">{deal.total_deal_views}</div>
                        <div className="text-xs text-muted-foreground">Views</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-sm font-medium">{deal.total_deal_clicks}</div>
                        <div className="text-xs text-muted-foreground">Clicks</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="text-sm font-medium">{deal.unique_visitors}</div>
                        <div className="text-xs text-muted-foreground">Unique Users</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-500" />
                      <div>
                        <div className="text-sm font-medium">
                          {deal.latest_activity ? 
                            new Date(deal.latest_activity).toLocaleDateString() : 
                            'No activity'
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">Last Activity</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No deal analytics available yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};