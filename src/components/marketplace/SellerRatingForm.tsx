import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSellerRatings } from "@/hooks/useSellerRatings";

interface SellerRatingFormProps {
  sellerId: string;
  listingId?: string;
  sellerName: string;
}

const SellerRatingForm = ({ sellerId, listingId, sellerName }: SellerRatingFormProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { submitRating } = useSellerRatings(sellerId);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    const success = await submitRating(rating, reviewText, listingId);
    setSubmitting(false);
    if (success) {
      setOpen(false);
      setRating(0);
      setReviewText("");
    }
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Star size={14} />
          Rate Seller
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate {sellerName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex justify-center gap-2">
            {stars.map(s => (
              <button
                key={s}
                type="button"
                onMouseEnter={() => setHoveredRating(s)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={s <= displayRating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {displayRating === 0 ? "Tap a star to rate" : 
             displayRating === 1 ? "Poor" : displayRating === 2 ? "Fair" : 
             displayRating === 3 ? "Good" : displayRating === 4 ? "Great" : "Excellent"}
          </p>
          <Textarea
            placeholder="Share your experience (optional)"
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            rows={3}
            maxLength={500}
          />
          <Button onClick={handleSubmit} disabled={rating === 0 || submitting} className="w-full">
            {submitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SellerRatingForm;
