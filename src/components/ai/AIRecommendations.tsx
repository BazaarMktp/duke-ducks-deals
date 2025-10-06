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
    <div className="mb-8 rounded-xl bg-gradient-to-br from-primary/5 via-background to-accent/5 border border-primary/10 backdrop-blur-sm">
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-primary/70" />
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Curated For You
          </h3>
        </div>
        
        {loading ? (
          <div className="text-center py-12 text-muted-foreground/60 text-sm">
            Finding perfect matches...
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {recommendations.slice(0, 4).map((listing) => (
              <div key={listing.id} className="flex-shrink-0 w-64">
                <MarketplaceItemCard
                  listing={listing}
                  favorites={[]}
                  onToggleFavorite={() => {}}
                  onStartConversation={() => {}}
                  user={user}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
