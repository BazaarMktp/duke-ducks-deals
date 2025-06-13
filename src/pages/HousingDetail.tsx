import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import HousingImageGallery from "@/components/housing/HousingImageGallery";
import HousingInfo from "@/components/housing/HousingInfo";
import SellerInfo from "@/components/marketplace/SellerInfo";
import HousingActions from "@/components/housing/HousingActions";

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
    avatar_url?: string;
    full_name?: string;
  };
}

const HousingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
          profiles!listings_user_id_fkey(profile_name, email, phone_number, avatar_url, full_name)
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
          message: "Hi, I am interested in this housing listing"
        });

      toast({
        title: "Message sent!",
        description: "Redirecting to chat...",
      });

      navigate('/messages');

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
        <HousingImageGallery
          images={listing.images}
          title={listing.title}
          currentImageIndex={currentImageIndex}
          onImageChange={setCurrentImageIndex}
        />

        <div>
          <HousingInfo
            title={listing.title}
            housingType={listing.housing_type}
            location={listing.location}
            price={listing.price}
            description={listing.description}
          />

          <SellerInfo
            profileName={listing.profiles.profile_name}
            email={listing.profiles.email}
            phoneNumber={listing.profiles.phone_number}
            createdAt={listing.created_at}
            avatarUrl={listing.profiles.avatar_url}
            fullName={listing.profiles.full_name}
            isAuthenticated={!!user}
          />

          <HousingActions
            user={user}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onStartConversation={startConversation}
            isOwner={listing.user_id === user?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default HousingDetail;
