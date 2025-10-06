import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const PromoAdsDisplay: React.FC = () => {
  const { data: ads } = useQuery({
    queryKey: ['promo-ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_ads')
        .select(`
          *,
          business_profiles!inner(business_name, business_logo_url)
        `)
        .eq('approval_status', 'approved')
        .eq('is_active', true)
        .or('ends_at.is.null,ends_at.gt.' + new Date().toISOString())
        .order('display_priority', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const trackImpressionMutation = useMutation({
    mutationFn: async (adId: string) => {
      const { data: currentAd } = await supabase
        .from('business_ads')
        .select('impressions')
        .eq('id', adId)
        .single();

      await supabase
        .from('business_ads')
        .update({ impressions: (currentAd?.impressions || 0) + 1 })
        .eq('id', adId);
    },
  });

  const trackClickMutation = useMutation({
    mutationFn: async (adId: string) => {
      const { data: currentAd } = await supabase
        .from('business_ads')
        .select('clicks')
        .eq('id', adId)
        .single();

      await supabase
        .from('business_ads')
        .update({ clicks: (currentAd?.clicks || 0) + 1 })
        .eq('id', adId);
    },
  });

  useEffect(() => {
    ads?.forEach(ad => {
      trackImpressionMutation.mutate(ad.id);
    });
  }, [ads]);

  if (!ads || ads.length === 0) return null;

  return (
    <div className="mb-8 space-y-4">
      {ads.map((ad) => (
        <Card 
          key={ad.id}
          className="overflow-hidden border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5"
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              {ad.image_url && (
                <img
                  src={ad.image_url}
                  alt={ad.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {ad.business_profiles?.business_logo_url && (
                        <img
                          src={ad.business_profiles.business_logo_url}
                          alt={ad.business_profiles.business_name}
                          className="w-6 h-6 object-cover rounded"
                        />
                      )}
                      <span className="text-xs text-muted-foreground">
                        Sponsored by {ad.business_profiles?.business_name}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{ad.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ad.description}</p>
                  </div>
                </div>
                {ad.link_url && (
                  <Button
                    onClick={() => {
                      trackClickMutation.mutate(ad.id);
                      window.open(ad.link_url!, '_blank');
                    }}
                    className="mt-3"
                    size="sm"
                  >
                    Learn More
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};