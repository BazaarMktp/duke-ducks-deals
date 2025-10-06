import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye } from 'lucide-react';
import { formatDate } from 'date-fns';

interface BusinessAdsListProps {
  businessId: string;
}

export const BusinessAdsList: React.FC<BusinessAdsListProps> = ({ businessId }) => {
  const { data: ads, isLoading } = useQuery({
    queryKey: ['business-ads', businessId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_ads')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading ads...</p>;
  }

  if (!ads || ads.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No ads yet. Upload your first promotional ad!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ads.map((ad) => (
        <div key={ad.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">{ad.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{ad.description}</p>
            </div>
            <Badge
              variant={
                ad.approval_status === 'approved'
                  ? 'default'
                  : ad.approval_status === 'rejected'
                  ? 'destructive'
                  : 'secondary'
              }
            >
              {ad.approval_status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{ad.impressions || 0} views</span>
            </div>
            <div className="flex items-center gap-1">
              <ExternalLink className="w-4 h-4" />
              <span>{ad.clicks || 0} clicks</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {ad.ad_type}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};