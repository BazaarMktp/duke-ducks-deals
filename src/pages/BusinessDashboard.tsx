import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Building2, Package, TrendingUp, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BusinessAdUpload } from '@/components/business/BusinessAdUpload';
import { BusinessAdsList } from '@/components/business/BusinessAdsList';
import { BusinessDealsList } from '@/components/business/BusinessDealsList';
import { Helmet } from 'react-helmet-async';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAdUpload, setShowAdUpload] = useState(false);

  const { data: businessProfile, isLoading } = useQuery({
    queryKey: ['business-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: stats } = useQuery({
    queryKey: ['business-stats', businessProfile?.id],
    queryFn: async () => {
      const [adsResult, dealsResult] = await Promise.all([
        supabase
          .from('business_ads')
          .select('id, impressions, clicks, approval_status')
          .eq('business_id', businessProfile!.id),
        supabase
          .from('deals')
          .select('id')
          .eq('created_by', user!.id),
      ]);

      return {
        totalAds: adsResult.data?.length || 0,
        activeAds: adsResult.data?.filter(ad => ad.approval_status === 'approved').length || 0,
        totalImpressions: adsResult.data?.reduce((sum, ad) => sum + (ad.impressions || 0), 0) || 0,
        totalClicks: adsResult.data?.reduce((sum, ad) => sum + (ad.clicks || 0), 0) || 0,
        totalDeals: dealsResult.data?.length || 0,
      };
    },
    enabled: !!businessProfile,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (!businessProfile) {
    navigate('/business-onboarding');
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Business Dashboard – Devil's Deals | Bazaar</title>
        <meta name="description" content="Manage your business deals and promotional ads on Devil's Deals" />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{businessProfile.business_name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant={businessProfile.is_verified ? 'default' : 'secondary'}>
                  {businessProfile.verification_status}
                </Badge>
                {businessProfile.is_verified && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Verified Business
                  </Badge>
                )}
              </div>
            </div>
            <Button onClick={() => navigate('/business-onboarding')}>
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Ads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalAds || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">{stats?.activeAds || 0} active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalDeals || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalImpressions || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalClicks || 0}</div>
              {stats?.totalImpressions > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {((stats.totalClicks / stats.totalImpressions) * 100).toFixed(2)}% CTR
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="deals" className="space-y-4">
          <TabsList>
            <TabsTrigger value="deals">
              <Package className="w-4 h-4 mr-2" />
              My Deals
            </TabsTrigger>
            <TabsTrigger value="ads">
              <TrendingUp className="w-4 h-4 mr-2" />
              Promotional Ads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deals" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Deals</CardTitle>
                    <CardDescription>Manage your deals on Devil's Deals</CardDescription>
                  </div>
                  <Button onClick={() => navigate('/devils-deals')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Deal
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <BusinessDealsList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ads" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Promotional Ads</CardTitle>
                    <CardDescription>Upload and manage your promotional materials</CardDescription>
                  </div>
                  <Button onClick={() => setShowAdUpload(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Ad
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <BusinessAdsList businessId={businessProfile.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <BusinessAdUpload
          open={showAdUpload}
          onOpenChange={setShowAdUpload}
          businessId={businessProfile.id}
        />
      </div>
    </>
  );
}