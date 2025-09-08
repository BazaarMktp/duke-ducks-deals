import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, MapPin, Plus, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ListingTypeToggle from "@/components/services/ListingTypeToggle";

// Define valid housing types
type HousingType = "sublease" | "for_rent" | "roommate_wanted";

const Housing = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [housingTypeFilter, setHousingTypeFilter] = useState<"all" | HousingType>("all");
  const [favorites, setFavorites] = useState([]);
  const [activeListingType, setActiveListingType] = useState<'offer' | 'wanted'>('offer');

  useEffect(() => {
    fetchListings();
    if (user) {
      fetchFavorites();
    }
  }, [user, searchQuery, sortBy, housingTypeFilter, activeListingType]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('listings')
        .select(`
          *,
          profiles(profile_name, full_name)
        `)
        .eq('category', 'housing')
        .eq('status', 'active')
        .eq('listing_type', activeListingType);

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`);
      }

      if (housingTypeFilter !== 'all') {
        query = query.eq('housing_type', housingTypeFilter);
      }

      const orderColumn = sortBy === 'price_low' ? 'price' : 
                         sortBy === 'price_high' ? 'price' : 'created_at';
      const ascending = sortBy === 'price_low' ? true : 
                       sortBy === 'price_high' ? false : false;

      const { data, error } = await query.order(orderColumn, { ascending });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error("Failed to load housing listings");
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
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

  const toggleFavorite = async (listingId) => {
    if (!user) {
      toast.error("Please log in to save favorites");
      return;
    }

    try {
      const isFavorited = favorites.includes(listingId);
      
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', listingId);
        
        setFavorites(prev => prev.filter(id => id !== listingId));
        toast.success("Removed from favorites");
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: listingId });
        
        setFavorites(prev => [...prev, listingId]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("Failed to update favorites");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {activeListingType === 'offer' ? 'Housing' : 'Housing Requests'}
          </h1>
          <p className="text-gray-600 mt-2">
            {activeListingType === 'offer' 
              ? 'Find housing, subletting, and roommates at Duke'
              : 'See what housing Duke students are looking for'
            }
          </p>
        </div>
        
        {user && (
          <Link to="/create-listing">
            <Button className="flex items-center gap-2">
              {activeListingType === 'offer' ? (
                <>
                  <Plus size={16} />
                  Post Housing
                </>
              ) : (
                <>
                  <Search size={16} />
                  Create Request
                </>
              )}
            </Button>
          </Link>
        )}
      </div>

      {/* Listing Type Toggle */}
      <ListingTypeToggle 
        activeType={activeListingType}
        onTypeChange={setActiveListingType}
        category="housing"
      />

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder={activeListingType === 'offer' ? "Search housing..." : "Search housing requests..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={housingTypeFilter} onValueChange={(value: "all" | HousingType) => setHousingTypeFilter(value)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Housing Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sublease">Sublease</SelectItem>
            <SelectItem value="for_rent">For Rent</SelectItem>
            <SelectItem value="roommate_wanted">Roommate Wanted</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            {activeListingType === 'offer' && (
              <>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {activeListingType === 'offer' 
              ? "No housing listings found matching your criteria."
              : "No housing requests found matching your criteria."
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            // Extract first name from full_name or fallback to profile_name
            const getDisplayName = () => {
              if (listing.profiles?.full_name) {
                return listing.profiles.full_name.split(' ')[0];
              }
              return listing.profiles?.profile_name || 'Unknown';
            };

            return (
              <Card 
                key={listing.id} 
                className={`hover:shadow-lg transition-shadow ${
                  listing.listing_type === 'wanted' ? 'border-blue-200 bg-blue-50/50' : ''
                }`}
              >
                <div className="relative">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <Home className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  {user && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => toggleFavorite(listing.id)}
                    >
                      <Heart 
                        size={16} 
                        className={favorites.includes(listing.id) ? "fill-red-500 text-red-500" : "text-gray-600"} 
                      />
                    </Button>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {listing.listing_type === 'wanted' && (
                        <Badge variant="outline" className="text-blue-600 border-blue-300">
                          <Search size={12} className="mr-1" />
                          Looking For
                        </Badge>
                      )}
                      {listing.housing_type && (
                        <Badge variant="secondary">
                          {listing.housing_type.replace('_', ' ')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Link to={`/housing/${listing.id}`}>
                    <CardTitle className="text-lg hover:text-blue-600 transition-colors mb-2">
                      {listing.listing_type === 'wanted' ? `Looking for: ${listing.title}` : listing.title}
                    </CardTitle>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">by {getDisplayName()}</p>
                  {listing.location && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin size={14} className="mr-1" />
                      {listing.location}
                    </div>
                  )}
                  <p className="text-sm mb-3 line-clamp-2">{listing.description}</p>
                  <div className="flex justify-between items-center">
                    {listing.listing_type === 'offer' ? (
                      <p className="text-xl font-bold text-green-600">
                        {listing.price ? `$${listing.price}/month` : 'Contact for price'}
                      </p>
                    ) : (
                      <p className="text-lg font-bold text-blue-600">
                        {listing.price ? `Budget: $${listing.price}/month` : 'Budget: Negotiable'}
                      </p>
                    )}
                    <Link to={`/housing/${listing.id}`}>
                      <Button size="sm">
                        {listing.listing_type === 'wanted' ? 'I Can Help' : 'View Details'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Housing;
