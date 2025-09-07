
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Search, BadgeCheck } from "lucide-react";
import { MarketplaceListing } from "./types";

interface MarketplaceItemCardProps {
  listing: MarketplaceListing;
  user: any;
  favorites: string[];
  onToggleFavorite: (listingId: string) => void;
  onStartConversation: (listing: MarketplaceListing) => void;
}

const MarketplaceItemCard = ({ 
  listing, 
  user, 
  favorites, 
  onToggleFavorite, 
  onStartConversation 
}: MarketplaceItemCardProps) => {
  // Extract display name from profile based on user login status
  const getDisplayName = () => {
    // If user is not logged in, show generic "Bazaar Member"
    if (!user) {
      return "Bazaar Member";
    }
    
    // If user is logged in but no profile data, show Anonymous
    if (!listing.profiles) return "Anonymous";
    
    const fullName = listing.profiles.full_name;
    const profileName = listing.profiles.profile_name;
    
    // For logged-in users, show first name only
    if (fullName) {
      return fullName.split(" ")[0];
    }
    
    // Fallback to profile name
    if (profileName) {
      return profileName;
    }
    
    return "Anonymous";
  };

  return (
    <Card 
      className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20 overflow-hidden ${
        listing.listing_type === 'wanted' ? 'border-blue-200 bg-blue-50/50' : ''
      } ${listing.featured ? 'border-yellow-400 border-2' : ''}`}
    >
      <CardContent className="p-0 h-full flex flex-col">
        {/* Only show image for offers, not for requests */}
        {listing.listing_type === 'offer' && (
          <Link to={`/marketplace/${listing.id}`}>
            <div className="h-32 sm:h-48 overflow-hidden rounded-t-lg bg-gray-50 relative flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
              <img
                src={listing.images?.[0] || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-full object-contain hover:scale-105 transition-transform bg-gray-50"
              />
            </div>
          </Link>
        )}
        
        <div className={`p-2 sm:p-4 flex-1 flex flex-col ${listing.listing_type === 'wanted' ? 'pt-3 sm:pt-6' : ''}`}>
          <div className="flex justify-between items-start mb-2 sm:mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 flex-wrap">
                {listing.featured && (
                  <Badge className="bg-yellow-400 text-yellow-900 font-bold text-xs">Featured</Badge>
                )}
                {listing.listing_type === 'wanted' && (
                  <Badge variant="outline" className="text-blue-600 border-blue-300 text-xs">
                    <Search size={10} className="mr-1" />
                    Looking For
                  </Badge>
                )}
              </div>
              <Link to={`/marketplace/${listing.id}`}>
                <h3 className="font-semibold text-sm sm:text-lg hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                  {listing.listing_type === 'wanted' ? `Looking for: ${listing.title}` : listing.title}
                </h3>
              </Link>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 truncate flex items-center gap-1">
                <span>by {getDisplayName()}</span>
                {listing.profiles?.is_verified && (
                  <BadgeCheck size={14} className="text-blue-600" />
                )}
              </p>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2 sm:mb-3 flex-wrap gap-1">
            {listing.listing_type === 'offer' ? (
              <>
                <p className="text-lg sm:text-xl font-medium text-foreground">
                  {listing.price ? `$${listing.price}` : 'Free'}
                </p>
                <Badge variant="outline" className="text-xs">Available</Badge>
              </>
            ) : (
              <>
                <p className="text-sm sm:text-lg font-medium text-blue-600">
                  {listing.price ? `Budget: $${listing.price}` : 'Budget: Negotiable'}
                </p>
                <Badge variant="outline" className="text-blue-600 border-blue-300 text-xs">Wanted</Badge>
              </>
            )}
          </div>
          
          <div className="flex gap-1 sm:gap-2 mt-auto">
            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleFavorite(listing.id)}
                className={`flex-shrink-0 p-1 sm:p-2 ${favorites.includes(listing.id) ? "text-red-500" : ""}`}
              >
                <Heart size={14} className={favorites.includes(listing.id) ? "fill-current" : ""} />
              </Button>
            )}
            <Link to={`/marketplace/${listing.id}`} className="flex-1 min-w-0">
              <Button size="sm" className="w-full text-xs sm:text-sm px-1 sm:px-3 opacity-[98%] hover:opacity-100 transition-opacity">
                {listing.listing_type === 'wanted' ? 'I Can Help' : 'View Details'}
              </Button>
            </Link>
            {user && listing.user_id !== user.id && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onStartConversation(listing)}
                className="flex-shrink-0 p-1 sm:p-2"
              >
                <MessageCircle size={14} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceItemCard;
