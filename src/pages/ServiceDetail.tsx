
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, ArrowLeft, User, Star, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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
      console.error('Error fetching service:', error);
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
          message: "I am interested in your service"
        });

      toast({
        title: "Message sent!",
        description: "Your interest has been sent to the service provider.",
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
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{service.title}</h1>
            <div className="flex items-center text-yellow-500">
              <Star size={20} className="fill-current" />
              <span className="ml-1 font-medium">4.8</span>
            </div>
          </div>
          
          <p className="text-3xl font-bold text-green-600 mb-4">${service.price}/hour</p>
          <Badge variant="outline" className="mb-4">Available</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Service Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{service.description}</p>
                {service.location && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Service Area</h4>
                    <p className="text-gray-600">{service.location}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Professional service delivery</li>
                  <li>Flexible scheduling</li>
                  <li>Quality guarantee</li>
                  <li>Direct communication with provider</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Provider Info & Actions */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User size={20} className="mr-2" />
                  Service Provider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User size={24} className="text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg">{service.profiles.profile_name}</h3>
                  <p className="text-sm text-gray-600">{service.profiles.email}</p>
                  {service.profiles.phone_number && (
                    <p className="text-sm text-gray-600">{service.profiles.phone_number}</p>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      <Star size={14} className="fill-current text-yellow-500" />
                      <span className="ml-1">4.8 (24 reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response time:</span>
                    <span>Within 2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Member since:</span>
                    <span>{new Date(service.created_at).getFullYear()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              {user && service.user_id !== user.id && (
                <Button 
                  onClick={startConversation}
                  className="w-full"
                  size="lg"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Contact Provider
                </Button>
              )}
              
              {user && (
                <Button
                  variant="outline"
                  onClick={toggleFavorite}
                  className={`w-full ${isFavorite ? "text-red-500" : ""}`}
                >
                  <Heart size={16} className={`mr-2 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center text-xs text-gray-500">
                <Calendar size={12} className="mr-1" />
                Listed on {new Date(service.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
