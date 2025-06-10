
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, ArrowLeft, User, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface HousingListing {
  id: string;
  title: string;
  description: string;
  price: number;
  housing_type: string;
  location: string;
  images: string[];
  user_id: string;
  created_at: string;
  profiles: {
    profile_name: string;
    email: string;
    phone_number?: string;
  };
}

const HousingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<HousingListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchListing();
      if (user) {
        checkFavoriteStatus();
      }
    }
  }, [id, user]);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(profile_name, email, phone_number)
        `)
        .eq('id', id)
        .eq('category', 'housing')
        .eq('status', 'active')
        .single();

      if (error) throw error;
      setListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast({
        title: "Error",
        description: "Failed to load listing details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !id) return;
    
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', id)
        .single();
      
      setIsFavorite(!!data);
    } catch (error) {
      // Not a favorite
    }
  };

  const toggleFavorite = async () => {
    if (!user || !id) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const startConversation = async () => {
    if (!user || !listing) return;

    try {
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', listing.user_id)
        .eq('listing_id', listing.id)
        .single();

      let conversationId = existingConv?.id;

      if (!conversationId) {
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            buyer_id: user.id,
            seller_id: listing.user_id,
            listing_id: listing.id
          })
          .select('id')
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
      }

      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          message: "I am interested in this housing listing"
        });

      toast({
        title: "Message sent!",
        description: "Your interest has been sent to the poster.",
      });

    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading listing details...</div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <Link to="/housing">
            <Button>Back to Housing</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/housing" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
        <ArrowLeft size={20} className="mr-2" />
        Back to Housing
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="mb-4">
            <img
              src={listing.images?.[currentImageIndex] || "/placeholder.svg"}
              alt={listing.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {listing.images && listing.images.length > 1 && (
            <div className="flex gap-2">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${listing.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Listing Details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <Badge variant="secondary">
              {listing.housing_type?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          </div>
          
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={16} className="mr-1" />
            {listing.location}
          </div>
          
          <p className="text-3xl font-bold text-green-600 mb-6">${listing.price}/month</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{listing.description}</p>
          </div>

          {/* Poster Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User size={20} className="mr-2" />
                Posted by
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{listing.profiles.profile_name}</p>
              <p className="text-sm text-gray-600">{listing.profiles.email}</p>
              {listing.profiles.phone_number && (
                <p className="text-sm text-gray-600">{listing.profiles.phone_number}</p>
              )}
              <div className="flex items-center text-xs text-gray-500 mt-2">
                <Calendar size={12} className="mr-1" />
                Listed on {new Date(listing.created_at).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {user && (
              <Button
                variant="outline"
                onClick={toggleFavorite}
                className={isFavorite ? "text-red-500" : ""}
              >
                <Heart size={16} className={isFavorite ? "fill-current" : ""} />
              </Button>
            )}
            {user && listing.user_id !== user.id && (
              <Button 
                onClick={startConversation}
                className="flex-1"
              >
                <MessageCircle size={16} className="mr-2" />
                Contact About Housing
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousingDetail;
