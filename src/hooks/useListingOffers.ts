import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface ListingOffer {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  status: 'pending' | 'accepted' | 'declined' | 'countered' | 'expired';
  counter_amount: number | null;
  message: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  buyer?: { profile_name: string; avatar_url: string | null };
  seller?: { profile_name: string; avatar_url: string | null };
  listing?: { title: string; price: number | null; images: string[] | null };
}

export const useListingOffers = (listingId?: string) => {
  const [offers, setOffers] = useState<ListingOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchOffers = useCallback(async () => {
    if (!listingId || !user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listing_offers')
        .select(`
          *,
          buyer:profiles!listing_offers_buyer_id_fkey(profile_name, avatar_url),
          seller:profiles!listing_offers_seller_id_fkey(profile_name, avatar_url)
        `)
        .eq('listing_id', listingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers((data || []) as unknown as ListingOffer[]);
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  }, [listingId, user]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const makeOffer = async (sellerId: string, amount: number, message?: string) => {
    if (!user || !listingId) return false;
    try {
      const { error } = await supabase.from('listing_offers').insert({
        listing_id: listingId,
        buyer_id: user.id,
        seller_id: sellerId,
        amount,
        message: message?.trim() || null,
      });
      if (error) throw error;
      toast({ title: "Offer sent!", description: `Your offer of $${amount} has been sent.` });
      fetchOffers();
      return true;
    } catch (error: any) {
      console.error('Error making offer:', error);
      toast({ title: "Error", description: "Failed to send offer.", variant: "destructive" });
      return false;
    }
  };

  const respondToOffer = async (offerId: string, action: 'accepted' | 'declined', counterAmount?: number) => {
    if (!user) return false;
    try {
      const updateData: any = { 
        status: counterAmount ? 'countered' : action, 
        updated_at: new Date().toISOString() 
      };
      if (counterAmount) updateData.counter_amount = counterAmount;

      const { error } = await supabase
        .from('listing_offers')
        .update(updateData)
        .eq('id', offerId);
      if (error) throw error;
      
      const msg = counterAmount ? `Counter offer of $${counterAmount} sent.` : `Offer ${action}.`;
      toast({ title: "Done", description: msg });
      fetchOffers();
      return true;
    } catch (error) {
      console.error('Error responding to offer:', error);
      toast({ title: "Error", description: "Failed to respond.", variant: "destructive" });
      return false;
    }
  };

  return { offers, loading, makeOffer, respondToOffer, refetch: fetchOffers };
};

// Hook for fetching all offers for the current user (my offers)
export const useMyOffers = () => {
  const [offers, setOffers] = useState<ListingOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMyOffers = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('listing_offers')
        .select(`
          *,
          buyer:profiles!listing_offers_buyer_id_fkey(profile_name, avatar_url),
          seller:profiles!listing_offers_seller_id_fkey(profile_name, avatar_url),
          listing:listings!listing_offers_listing_id_fkey(title, price, images)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOffers((data || []) as unknown as ListingOffer[]);
    } catch (error) {
      console.error('Error fetching my offers:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyOffers();
  }, [fetchMyOffers]);

  return { offers, loading, refetch: fetchMyOffers };
};
