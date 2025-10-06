import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Eye, ExternalLink, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BusinessAd {
  id: string;
  title: string;
  description: string;
  ad_type: string;
  image_url: string | null;
  link_url: string | null;
  approval_status: string;
  is_active: boolean;
  created_at: string;
  starts_at: string;
  ends_at: string | null;
  impressions: number;
  clicks: number;
  business_profiles: {
    business_name: string;
    business_email: string;
    business_phone: string | null;
    business_website: string | null;
  };
}

export const BusinessAdsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAd, setSelectedAd] = useState<BusinessAd | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: pendingAds, isLoading: loadingPending } = useQuery({
    queryKey: ['pending-business-ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_ads')
        .select(`
          *,
          business_profiles (
            business_name,
            business_email,
            business_phone,
            business_website
          )
        `)
        .eq('approval_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BusinessAd[];
    },
  });

  const { data: approvedAds, isLoading: loadingApproved } = useQuery({
    queryKey: ['approved-business-ads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_ads')
        .select(`
          *,
          business_profiles (
            business_name,
            business_email,
            business_phone,
            business_website
          )
        `)
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as BusinessAd[];
    },
  });

  const approveAdMutation = useMutation({
    mutationFn: async (adId: string) => {
      const { error } = await supabase
        .from('business_ads')
        .update({
          approval_status: 'approved',
          is_active: true,
          approved_at: new Date().toISOString(),
          approved_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', adId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Ad approved and activated successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['pending-business-ads'] });
      queryClient.invalidateQueries({ queryKey: ['approved-business-ads'] });
      setPreviewOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to approve ad',
        variant: 'destructive',
      });
    },
  });

  const rejectAdMutation = useMutation({
    mutationFn: async (adId: string) => {
      const { error } = await supabase
        .from('business_ads')
        .update({
          approval_status: 'rejected',
          is_active: false,
        })
        .eq('id', adId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Ad rejected successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['pending-business-ads'] });
      setPreviewOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reject ad',
        variant: 'destructive',
      });
    },
  });

  const toggleAdActiveMutation = useMutation({
    mutationFn: async ({ adId, isActive }: { adId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('business_ads')
        .update({ is_active: !isActive })
        .eq('id', adId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Ad status updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['approved-business-ads'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update ad status',
        variant: 'destructive',
      });
    },
  });

  const handlePreview = (ad: BusinessAd) => {
    setSelectedAd(ad);
    setPreviewOpen(true);
  };

  if (loadingPending && loadingApproved) {
    return <div className="text-center py-8">Loading business ads...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Pending Ads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Pending Approval ({pendingAds?.length || 0})
          </CardTitle>
          <CardDescription>
            Review and approve promotional ads submitted by businesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingAds && pendingAds.length > 0 ? (
            <div className="space-y-4">
              {pendingAds.map((ad) => (
                <div key={ad.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{ad.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ad.business_profiles.business_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ad.business_profiles.business_email}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                      {ad.ad_type}
                    </Badge>
                  </div>

                  <p className="text-sm line-clamp-2">{ad.description}</p>

                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreview(ad)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => approveAdMutation.mutate(ad.id)}
                      disabled={approveAdMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectAdMutation.mutate(ad.id)}
                      disabled={rejectAdMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No pending ads to review
            </p>
          )}
        </CardContent>
      </Card>

      {/* Approved Ads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Approved Ads
          </CardTitle>
          <CardDescription>
            Manage active and approved promotional ads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvedAds && approvedAds.length > 0 ? (
            <div className="space-y-4">
              {approvedAds.map((ad) => (
                <div key={ad.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{ad.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ad.business_profiles.business_name}
                      </p>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Badge variant={ad.is_active ? "default" : "secondary"}>
                        {ad.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">{ad.ad_type}</Badge>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>👁️ {ad.impressions} views</span>
                    <span>🖱️ {ad.clicks} clicks</span>
                    <span>
                      📈 {ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : 0}% CTR
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreview(ad)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant={ad.is_active ? "secondary" : "default"}
                      onClick={() => toggleAdActiveMutation.mutate({ adId: ad.id, isActive: ad.is_active })}
                      disabled={toggleAdActiveMutation.isPending}
                    >
                      {ad.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No approved ads yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ad Preview</DialogTitle>
            <DialogDescription>
              Review the advertisement details before approval
            </DialogDescription>
          </DialogHeader>

          {selectedAd && (
            <div className="space-y-6">
              {/* Business Info */}
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Business Information</h3>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {selectedAd.business_profiles.business_name}</p>
                  <p><strong>Email:</strong> {selectedAd.business_profiles.business_email}</p>
                  {selectedAd.business_profiles.business_phone && (
                    <p><strong>Phone:</strong> {selectedAd.business_profiles.business_phone}</p>
                  )}
                  {selectedAd.business_profiles.business_website && (
                    <p>
                      <strong>Website:</strong>{' '}
                      <a
                        href={selectedAd.business_profiles.business_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {selectedAd.business_profiles.business_website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Ad Details */}
              <div>
                <h3 className="font-semibold mb-2">Advertisement</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Title</p>
                    <p className="text-lg font-semibold">{selectedAd.title}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p>{selectedAd.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ad Type</p>
                    <Badge>{selectedAd.ad_type}</Badge>
                  </div>
                  {selectedAd.image_url && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Image</p>
                      <img
                        src={selectedAd.image_url}
                        alt={selectedAd.title}
                        className="rounded-lg max-w-full h-auto border"
                      />
                    </div>
                  )}
                  {selectedAd.link_url && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Destination URL</p>
                      <a
                        href={selectedAd.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {selectedAd.link_url}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedAd.approval_status === 'pending' && (
                <div className="flex gap-3 border-t pt-4">
                  <Button
                    className="flex-1"
                    onClick={() => approveAdMutation.mutate(selectedAd.id)}
                    disabled={approveAdMutation.isPending}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Activate
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => rejectAdMutation.mutate(selectedAd.id)}
                    disabled={rejectAdMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};