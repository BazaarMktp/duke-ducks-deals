
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, MapPin, Package, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { MarketplaceListing } from "./types";

interface MarketplaceItemCardProps {
  listing: MarketplaceListing;
  onToggleFavorite: (listingId: string) => void;
  onStartConversation: (listing: MarketplaceListing) => void;
  isFavorite: boolean;
  isAuthenticated: boolean;
}

const MarketplaceItemCard = ({
  listing,
  onToggleFavorite,
  onStartConversation,
  isFavorite,
  isAuthenticated,
}: MarketplaceItemCardProps) => {
  // Determine display image
  const displayImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : "/placeholder.svg";

  // Extract first name from profile
  const getDisplayName = () => {
    if (listing.profiles?.profile_name) {
      return listing.profiles.profile_name;
    }
    return 'Unknown';
  };

  const getTransactionMethods = () => {
    const methods = [];
    if (listing.allow_pickup) methods.push("Pickup");
    if (listing.allow_meet_on_campus) methods.push("Meet on Campus");
    return methods;
  };

  const transactionMethods = getTransactionMethods();

  return (
    <Card 
      key={listing.id} 
      className={`group hover:shadow-lg transition-all duration-200 ${
        listing.listing_type === 'wanted' ? 'border-blue-200 bg-blue-50/30' : ''
      } ${listing.featured ? 'ring-2 ring-yellow-400' : ''}`}
    >
      <CardContent className="p-0">
        {/* Image Section */}
        <Link to={`/marketplace/${listing.id}`}>
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            <img
              src={displayImage}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {listing.featured && (
              <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 font-semibold">
                Featured
              </Badge>
            )}
            {listing.listing_type === 'wanted' && (
              <Badge variant="outline" className="absolute top-2 right-2 bg-blue-100 text-blue-700 border-blue-300">
                Looking For
              </Badge>
            )}
          </div>
        </Link>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          <div>
            <Link to={`/marketplace/${listing.id}`}>
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                {listing.title}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground">by {getDisplayName()}</p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <p className={`text-xl font-bold ${
              listing.listing_type === 'wanted' ? 'text-blue-600' : 'text-green-600'
            }`}>
              {listing.price ? `$${listing.price}` : 'Free'}
            </p>
          </div>

          {/* Transaction Methods */}
          {listing.listing_type === 'offer' && transactionMethods.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {transactionMethods.map((method) => (
                <Badge key={method} variant="secondary" className="text-xs">
                  {method === "Pickup" ? (
                    <><Package size={12} className="mr-1" />{method}</>
                  ) : (
                    <><Users size={12} className="mr-1" />{method}</>
                  )}
                </Badge>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onToggleFavorite(listing.id);
                }}
                className={isFavorite ? "text-red-500 border-red-200" : ""}
              >
                <Heart size={16} className={isFavorite ? "fill-current" : ""} />
              </Button>
            )}
            
            <Link to={`/marketplace/${listing.id}`} className="flex-1">
              <Button size="sm" className="w-full">
                {listing.listing_type === 'wanted' ? 'I Have This' : 'View Details'}
              </Button>
            </Link>
            
            {isAuthenticated && listing.user_id !== listing.user_id && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onStartConversation(listing);
                }}
              >
                <MessageCircle size={16} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceItemCard;
