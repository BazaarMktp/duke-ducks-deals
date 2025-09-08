import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FavoriteListing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  housing_type: string;
  location: string;
  images: string[];
  profiles: {
    profile_name: string;
  };
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchFavorites = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          listing_id,
          listings!inner(
            id,
            title,
            description,
            price,
            category,
            housing_type,
            location,
            images,
            profiles!listings_user_id_fkey(profile_name)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const favoritesData = data?.map(fav => ({
        id: fav.listings.id,
        title: fav.listings.title,
        description: fav.listings.description,
        price: fav.listings.price,
        category: fav.listings.category,
        housing_type: fav.listings.housing_type,
        location: fav.listings.location,
        images: fav.listings.images || [],
        profiles: fav.listings.profiles
      })) || [];

      setFavorites(favoritesData);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error",
        description: "Failed to load favorites.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchFavorites();

    const channel = supabase
      .channel('favorites-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favorites',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchFavorites()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchFavorites]);

  const removeFavorite = async (listingId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('listing_id', listingId);

      setFavorites(prev => prev.filter(fav => fav.id !== listingId));
      
      toast({
        title: "Removed from favorites",
        description: "Item removed from your favorites.",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Please sign in to view your favorites.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Favorites</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No favorites yet. Start browsing to add items!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <img 
                  src={listing.images?.[0] || "/placeholder.svg"} 
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                  loading="lazy"
                  decoding="async"
                />
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg">{listing.title}</CardTitle>
                  <Badge variant="secondary">
                    {listing.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">by {listing.profiles?.profile_name}</p>
                {listing.location && (
                  <p className="text-sm text-muted-foreground mb-2 flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {listing.location}
                  </p>
                )}
                <p className="text-sm mb-3 line-clamp-2">{listing.description}</p>
                {listing.price && (
                  <p className="text-xl font-bold text-green-600 mb-3">
                    ${listing.price}{listing.category === 'housing' ? '/month' : listing.category === 'services' ? '/hour' : ''}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFavorite(listing.id)}
                    className="text-red-500"
                  >
                    <Heart size={16} className="fill-current" />
                  </Button>
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
