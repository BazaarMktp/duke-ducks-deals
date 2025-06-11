import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Heart, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PostingForm from "@/components/PostingForm";

interface HousingListing {
  id: string;
  title: string;
  description: string;
  price: number;
  housing_type: string;
  location: string;
  images: string[];
  user_id: string;
  profiles: {
    profile_name: string;
  };
}

const Housing = () => {
  const [listings, setListings] = useState<HousingListing[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostingForm, setShowPostingForm] = useState(false);
  const { user } = useAuth();

  const housingTypes = ["All", "sublease", "for_rent", "roommate_wanted"];

  useEffect(() => {
    fetchHousingListings();
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchHousingListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(profile_name)
        `)
        .eq('category', 'housing')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching housing listings:', error);
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

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All" || listing.housing_type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading housing listings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Housing</h1>
        {user && (
          <Button onClick={() => setShowPostingForm(true)}>+ Post Housing</Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {housingTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
            >
              {type === "All" ? "All" : type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
            </Button>
          ))}
        </div>
      </div>

      {/* Simple Map Placeholder */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2" size={20} />
            Map View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Interactive map coming soon!</p>
          </div>
        </CardContent>
      </Card>

      {/* Housing Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-0">
              <Link to={`/housing/${listing.id}`}>
                <img 
                  src={listing.images?.[0] || "/placeholder.svg"} 
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded-t-lg hover:opacity-90 transition-opacity"
                />
              </Link>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/housing/${listing.id}`}>
                  <CardTitle className="text-lg hover:text-blue-600 transition-colors">{listing.title}</CardTitle>
                </Link>
                <Badge variant="secondary">
                  {listing.housing_type?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">by {listing.profiles?.profile_name}</p>
              <p className="text-sm text-muted-foreground mb-2 flex items-center">
                <MapPin size={14} className="mr-1" />
                {listing.location}
              </p>
              <p className="text-sm mb-3 line-clamp-2">{listing.description}</p>
              <p className="text-xl font-bold text-green-600 mb-3">${listing.price}/month</p>
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
                <Link to={`/housing/${listing.id}`} className="flex-1">
                  <Button size="sm" className="w-full">
                    View Details
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
          <p className="text-gray-500">No housing listings found matching your criteria.</p>
        </div>
      )}

      {showPostingForm && (
        <PostingForm
          category="housing"
          onClose={() => setShowPostingForm(false)}
          onSuccess={fetchHousingListings}
        />
      )}
    </div>
  );
};

export default Housing;
