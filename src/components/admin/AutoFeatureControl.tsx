import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles, TrendingUp, Clock, DollarSign } from "lucide-react";

interface FeaturedListing {
  id: string;
  title: string;
  price: number;
  category: string;
  created_at: string;
  profiles: {
    profile_name: string;
  };
}

interface AutoFeatureResponse {
  success: boolean;
  message: string;
  featuredCount: number;
  featuredListings: FeaturedListing[];
  timestamp: string;
}

export const AutoFeatureControl = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([]);
  const [featuredCount, setFeaturedCount] = useState<number>(0);

  const runAutoFeature = async () => {
    setIsRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke('auto-feature-listings', {
        body: {}
      });

      if (error) throw error;

      const response = data as AutoFeatureResponse;
      
      if (response.success) {
        toast.success(response.message);
        setLastRun(response.timestamp);
        setFeaturedListings(response.featuredListings);
        setFeaturedCount(response.featuredCount);
      } else {
        throw new Error(response.message || 'Auto-featuring failed');
      }
    } catch (error) {
      console.error('Error running auto-feature:', error);
      toast.error('Failed to run auto-featuring process');
    } finally {
      setIsRunning(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'marketplace':
        return <DollarSign className="h-4 w-4" />;
      case 'housing':
        return <TrendingUp className="h-4 w-4" />;
      case 'services':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Automated Featuring Control
          </CardTitle>
          <CardDescription>
            Automatically feature the most desirable listings based on engagement, recency, and price competitiveness
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Algorithm considers: Engagement (40%), Recency (30%), Price (20%), Diversity (10%)
              </p>
              {lastRun && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last run: {formatDate(lastRun)} • Featured {featuredCount} items
                </p>
              )}
            </div>
            <Button 
              onClick={runAutoFeature} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isRunning ? 'Running...' : 'Run Auto-Feature'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {featuredListings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Currently Featured Items ({featuredListings.length})</CardTitle>
            <CardDescription>
              Items automatically selected by the desirability algorithm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {featuredListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(listing.category)}
                    <div>
                      <p className="font-medium">{listing.title}</p>
                      <p className="text-sm text-muted-foreground">
                        by {listing.profiles?.profile_name} • {formatDate(listing.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{listing.category}</Badge>
                    <span className="font-semibold">
                      {listing.price ? `$${listing.price}` : 'Free'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Featuring Strategy</CardTitle>
          <CardDescription>How items are automatically selected for featuring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Engagement Metrics (40%)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Favorites: 3 points each</li>
                <li>• Messages/Inquiries: 5 points each</li>
                <li>• Views: 1 point each</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Recency Boost (30%)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• New items (&lt; 7 days) get priority</li>
                <li>• Linear decay over time</li>
                <li>• Keeps marketplace fresh</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Price Competitiveness (20%)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reasonably priced items favored</li>
                <li>• Sweet spot around $20-50</li>
                <li>• Free items get moderate boost</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Diversity Factor (10%)</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Random element for variety</li>
                <li>• Prevents same items always winning</li>
                <li>• Ensures category distribution</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};