
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useCartItem = (listingId: string | undefined) => {
  const [isInCart, setIsInCart] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const checkCartStatus = useCallback(async () => {
    if (!user || !listingId) return;
    
    try {
      const { data } = await supabase
        .from('cart_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', listingId)
        .single();
      
      setIsInCart(!!data);
    } catch (error) {
      // Not in cart
    }
  }, [user, listingId]);

  const addToCart = useCallback(async () => {
    if (!user || !listingId) return;

    try {
      await supabase
        .from('cart_items')
        .insert({ user_id: user.id, listing_id: listingId });
      setIsInCart(true);
      toast({
        title: "Added to cart",
        description: "Item added to your cart successfully.",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }, [user, listingId, toast]);

  return {
    isInCart,
    checkCartStatus,
    addToCart
  };
};
