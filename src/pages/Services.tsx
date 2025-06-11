
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PostingForm from "@/components/PostingForm";
import ServicesHeader from "@/components/services/ServicesHeader";
import ServicesSearch from "@/components/services/ServicesSearch";
import ServicesCategories from "@/components/services/ServicesCategories";
import ServicesList from "@/components/services/ServicesList";

interface ServiceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  user_id: string;
  profiles: {
    profile_name: string;
  };
}

const Services = () => {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostingForm, setShowPostingForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const serviceCategories = ["Academic", "Music", "Tutoring", "Tech", "Design", "Other"];

  useEffect(() => {
    fetchServiceListings();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchServiceListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(profile_name)
        `)
        .eq('category', 'services')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching service listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(fav => fav.listing_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (listingId: string) => {
    if (!user) return;

    try {
      if (favorites.includes(listingId)) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
        setFavorites(prev => prev.filter(id => id !== listingId));
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: listingId });
        setFavorites(prev => [...prev, listingId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const startConversation = async (listing: ServiceListing) => {
    if (!user) return;

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
          message: "I am interested"
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

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ServicesHeader 
        user={user} 
        onPostService={() => setShowPostingForm(true)} 
      />

      <ServicesSearch 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ServicesCategories categories={serviceCategories} />

      <ServicesList
        listings={filteredListings}
        user={user}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onStartConversation={startConversation}
      />

      {showPostingForm && (
        <PostingForm
          category="services"
          onClose={() => setShowPostingForm(false)}
          onSuccess={fetchServiceListings}
        />
      )}
    </div>
  );
};

export default Services;
