import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Search } from "lucide-react";
import { ServiceListing } from "./types";

interface ServicesListProps {
  listings: ServiceListing[];
  user: any;
  favorites: string[];
  onToggleFavorite: (listingId: string) => void;
  onStartConversation: (listing: ServiceListing) => void;
}

const ServicesList = ({ 
  listings, 
  user, 
  favorites, 
  onToggleFavorite, 
  onStartConversation 
}: ServicesListProps) => {
  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No services found matching your criteria.</p>
      </div>
    );
  }

  return (
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
            } ${listing.featured ? 'border-yellow-400 border-2' : ''}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {listing.featured && (
                      <Badge className="bg-yellow-400 text-yellow-900 font-bold">Featured</Badge>
                    )}
                    {listing.listing_type === 'wanted' && (
                      <Badge variant="outline" className="text-blue-600 border-blue-300">
                        <Search size={12} className="mr-1" />
                        Looking For
                      </Badge>
                    )}
                  </div>
                  <Link to={`/services/${listing.id}`}>
                    <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                      {listing.listing_type === 'wanted' ? `Looking for: ${listing.title}` : listing.title}
                    </CardTitle>
                  </Link>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">by {getDisplayName()}</p>
              <p className="text-sm mb-3 line-clamp-3">{listing.description}</p>
              <div className="flex justify-between items-center mb-3">
                {listing.listing_type === 'offer' ? (
                  <>
                    <p className="text-xl font-bold text-green-600">${listing.price}/hour</p>
                    <Badge variant="outline">Available</Badge>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-bold text-blue-600">
                      {listing.price ? `Budget: $${listing.price}` : 'Budget: Negotiable'}
                    </p>
                    <Badge variant="outline" className="text-blue-600 border-blue-300">Wanted</Badge>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleFavorite(listing.id)}
                    className={favorites.includes(listing.id) ? "text-red-500" : ""}
                  >
                    <Heart size={16} className={favorites.includes(listing.id) ? "fill-current" : ""} />
                  </Button>
                )}
                <Link to={`/services/${listing.id}`} className="flex-1">
                  <Button size="sm" className="w-full">
                    {listing.listing_type === 'wanted' ? 'I Can Help' : 'Contact Provider'}
                  </Button>
                </Link>
                {user && listing.user_id !== user.id && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onStartConversation(listing)}
                  >
                    <MessageCircle size={16} />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ServicesList;
