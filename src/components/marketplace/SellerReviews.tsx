import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSellerRatings } from "@/hooks/useSellerRatings";
import { formatDistanceToNow } from "date-fns";

interface SellerReviewsProps {
  sellerId: string;
}

const SellerReviews = ({ sellerId }: SellerReviewsProps) => {
  const { ratings, averageRating, totalRatings, loading } = useSellerRatings(sellerId);

  if (loading || totalRatings === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          Seller Reviews
          <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            {averageRating} ({totalRatings})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ratings.slice(0, 5).map(r => (
          <div key={r.id} className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={r.reviewer?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {r.reviewer?.profile_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium">{r.reviewer?.profile_name || 'User'}</span>
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={10} className={i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20"} />
                  ))}
                </div>
              </div>
              {r.review_text && <p className="text-sm text-muted-foreground">{r.review_text}</p>}
              <p className="text-[10px] text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SellerReviews;
