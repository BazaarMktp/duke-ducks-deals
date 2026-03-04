import { Star } from "lucide-react";
import { useSellerRatings } from "@/hooks/useSellerRatings";

interface SellerRatingDisplayProps {
  sellerId: string;
  compact?: boolean;
}

const SellerRatingDisplay = ({ sellerId, compact = false }: SellerRatingDisplayProps) => {
  const { averageRating, totalRatings } = useSellerRatings(sellerId);

  if (totalRatings === 0) {
    if (compact) return null;
    return <span className="text-xs text-muted-foreground">No ratings yet</span>;
  }

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Star size={12} className="fill-yellow-400 text-yellow-400" />
        <span className="text-xs font-medium">{averageRating}</span>
        <span className="text-xs text-muted-foreground">({totalRatings})</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {stars.map(s => (
          <Star
            key={s}
            size={14}
            className={s <= Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}
          />
        ))}
      </div>
      <span className="text-sm font-medium">{averageRating}</span>
      <span className="text-xs text-muted-foreground">({totalRatings} {totalRatings === 1 ? 'review' : 'reviews'})</span>
    </div>
  );
};

export default SellerRatingDisplay;
