
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ServiceInfo from "@/components/services/ServiceInfo";
import ServiceProvider from "@/components/services/ServiceProvider";
import ServiceActions from "@/components/services/ServiceActions";

interface ServiceListing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  user_id: string;
  created_at: string;
  profiles: {
    profile_name: string;
    email: string;
    phone_number?: string;
  };
}

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchService();
      if (user) {
        checkFavoriteStatus();
      }
    }
  }, [id, user]);

  const fetchService = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(profile_name, email, phone_number)
        `)
        .eq('id', id)
        .eq('category', 'services')
        .eq('status', 'active')
        .single();

      if (error) throw error;
      setService(data);
    } catch (error) {
      // Secure error handling - don't expose sensitive details
      toast({
        title: "Error",
        description: "Failed to load service details.",
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
      // Not a favorite - no action needed
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
      toast({
        title: "Error",
        description: "Failed to update favorites.",
        variant: "destructive",
      });
    }
  };

  const startConversation = async () => {
    if (!user || !service) return;

    try {
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', service.user_id)
        .eq('listing_id', service.id)
        .single();

      let conversationId = existingConv?.id;

      if (!conversationId) {
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            buyer_id: user.id,
            seller_id: service.user_id,
            listing_id: service.id
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
          message: "Hi, I am interested in your service"
        });

      toast({
        title: "Message sent!",
        description: "Redirecting to chat...",
      });

      navigate('/messages');

    } catch (error) {
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
        <div className="text-center">Loading service details...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service not found</h1>
          <Link to="/services">
            <Button>Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/services" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
        <ArrowLeft size={20} className="mr-2" />
        Back to Services
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ServiceInfo
            title={service.title}
            price={service.price}
            description={service.description}
            location={service.location}
            createdAt={service.created_at}
          />

          <div>
            <ServiceProvider
              profileName={service.profiles.profile_name}
              email={service.profiles.email}
              phoneNumber={service.profiles.phone_number}
              createdAt={service.created_at}
            />

            <ServiceActions
              user={user}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onStartConversation={startConversation}
              isOwner={service.user_id === user?.id}
              createdAt={service.created_at}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
