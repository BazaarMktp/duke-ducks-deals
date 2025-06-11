import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Heart, MessageCircle, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PostingForm from "@/components/PostingForm";

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Services</h1>
        {user && (
          <Button onClick={() => setShowPostingForm(true)}>+ Post Service</Button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Service Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Popular Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {serviceCategories.map((category) => (
            <Card key={category} className="p-4 text-center hover:shadow-md cursor-pointer transition-shadow">
              <Users className="mx-auto mb-2 text-blue-600" size={24} />
              <p className="text-sm font-medium">{category}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <Link to={`/services/${listing.id}`}>
                  <CardTitle className="text-lg hover:text-blue-600 transition-colors">{listing.title}</CardTitle>
                </Link>
                <div className="flex items-center text-yellow-500">
                  <Star size={16} className="fill-current" />
                  <span className="text-sm ml-1">4.8</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">by {listing.profiles?.profile_name}</p>
              <p className="text-sm mb-3 line-clamp-3">{listing.description}</p>
              <div className="flex justify-between items-center mb-3">
                <p className="text-xl font-bold text-green-600">${listing.price}/hour</p>
                <Badge variant="outline">Available</Badge>
              </div>
              <div className="flex gap-2">
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(listing.id)}
                    className={favorites.includes(listing.id) ? "text-red-500" : ""}
                  >
                    <Heart size={16} className={favorites.includes(listing.id) ? "fill-current" : ""} />
                  </Button>
                )}
                <Link to={`/services/${listing.id}`} className="flex-1">
                  <Button size="sm" className="w-full">
                    Contact Provider
                  </Button>
                </Link>
                {user && (
                  <Button variant="outline" size="sm">
                    <MessageCircle size={16} />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No services found matching your criteria.</p>
        </div>
      )}

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
