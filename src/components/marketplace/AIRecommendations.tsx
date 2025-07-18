import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIRecommendationsProps {
  listingId: string;
}

export const AIRecommendations = ({ listingId }: AIRecommendationsProps) => {
  const { recommendations, loading, trackRecommendationClick } = useAIRecommendations(listingId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations.length) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Similar Items You Might Like
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((item) => (
            <Link
              key={item.id}
              to={`/marketplace/${item.id}`}
              onClick={() => trackRecommendationClick(item.id)}
              className="block"
            >
              <div className="flex gap-4 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="h-16 w-16 rounded-md overflow-hidden bg-muted">
                  {item.images?.[0] && (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium line-clamp-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-semibold text-primary">
                      ${item.price}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {Math.round(item.similarity * 100)}% match
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};