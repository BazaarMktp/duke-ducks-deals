
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/useFavorites";
import { useCartItem } from "@/hooks/useCartItem";
import { useConversation } from "@/hooks/useConversation";
import { Product } from "@/types/marketplace";

export const useMarketplaceItem = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  const { isFavorite, checkFavoriteStatus, toggleFavorite } = useFavorites(id);
  const { isInCart, checkCartStatus, addToCart } = useCartItem(id);
  const { startConversation: startConv } = useConversation();

  useEffect(() => {
    if (id) {
      fetchProduct();
      if (user) {
        checkFavoriteStatus();
        checkCartStatus();
      }
    }
  }, [id, user, checkFavoriteStatus, checkCartStatus]);

  const fetchProduct = async () => {
    try {
      const profileFields = user
        ? 'profile_name, email, phone_number, avatar_url, full_name, created_at'
        : 'profile_name, avatar_url, created_at';

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(${profileFields})
        `)
        .eq('id', id)
        .eq('category', 'marketplace')
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      const normalized = data && (data as any).profiles
        ? {
            ...(data as any),
            profiles: {
              profile_name: (data as any).profiles.profile_name,
              email: (data as any).profiles.email ?? '',
              phone_number: (data as any).profiles.phone_number,
              avatar_url: (data as any).profiles.avatar_url,
              full_name: (data as any).profiles.full_name,
              created_at: (data as any).profiles.created_at,
            },
          }
        : (data as any);
      setProduct(normalized as Product | null);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startConversation = () => {
    if (product) {
      startConv(product);
    }
  };

  return {
    product,
    loading,
    currentImageIndex,
    setCurrentImageIndex,
    isFavorite,
    isInCart,
    user,
    toggleFavorite,
    addToCart,
    startConversation
  };
};
