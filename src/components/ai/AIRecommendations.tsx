import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useGeminiAI } from '@/hooks/useGeminiAI';
import { useAuth } from '@/contexts/AuthContext';
import MarketplaceItemCard from '@/components/marketplace/MarketplaceItemCard';

export const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { getRecommendations, loading } = useGeminiAI();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadRecommendations();
    }
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;
    try {
      const recs = await getRecommendations(user.id);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      // Fail silently - don't block page render
    }
  };

  if (!user || recommendations.length === 0) return null;

  return (
    <Card className="mb-8 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Recommended For You
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Finding perfect matches...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 6).map((listing) => (
              <MarketplaceItemCard
                key={listing.id}
                listing={listing}
                favorites={[]}
                onToggleFavorite={() => {}}
                onStartConversation={() => {}}
                user={user}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
