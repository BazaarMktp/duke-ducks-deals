import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface SellerRating {
  id: string;
  seller_id: string;
  reviewer_id: string;
  listing_id: string | null;
  rating: number;
  review_text: string | null;
  created_at: string;
  reviewer?: { profile_name: string; avatar_url: string | null };
}

export const useSellerRatings = (sellerId: string | null) => {
  const [ratings, setRatings] = useState<SellerRating[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRatings = useCallback(async () => {
    if (!sellerId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('seller_ratings')
        .select(`
          id, seller_id, reviewer_id, listing_id, rating, review_text, created_at,
          reviewer:profiles!seller_ratings_reviewer_id_fkey(profile_name, avatar_url)
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const typedData = (data || []) as unknown as SellerRating[];
      setRatings(typedData);
      setTotalRatings(typedData.length);
      if (typedData.length > 0) {
        const avg = typedData.reduce((sum, r) => sum + r.rating, 0) / typedData.length;
        setAverageRating(Math.round(avg * 10) / 10);
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  const submitRating = async (rating: number, reviewText: string, listingId?: string) => {
    if (!user || !sellerId) return false;
    try {
      const { error } = await supabase
        .from('seller_ratings')
        .insert({
          seller_id: sellerId,
          reviewer_id: user.id,
          listing_id: listingId || null,
          rating,
          review_text: reviewText.trim() || null,
        });

      if (error) {
        if (error.code === '23505') {
          toast({ title: "Already rated", description: "You've already rated this transaction.", variant: "destructive" });
        } else {
          throw error;
        }
        return false;
      }

      toast({ title: "Rating submitted", description: "Thanks for your feedback!" });
      fetchRatings();
      return true;
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({ title: "Error", description: "Failed to submit rating.", variant: "destructive" });
      return false;
    }
  };

  return { ratings, averageRating, totalRatings, loading, submitRating };
};
