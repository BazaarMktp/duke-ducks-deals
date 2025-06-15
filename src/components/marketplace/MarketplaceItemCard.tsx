import { Link } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, Package } from "lucide-react";
import { MarketplaceListing } from "./types";
import VerifiedBadge from "@/components/common/VerifiedBadge";
import { useUserVerification } from "@/hooks/useUserVerification";

interface MarketplaceItemCardProps {
  listing: MarketplaceListing;
  user: any;
  isFavorite: boolean;
  onToggleFavorite: (listingId: string) => void;
}

const MarketplaceItemCard = ({ listing, user, isFavorite, onToggleFavorite }: MarketplaceItemCardProps) => {
  const { isVerified } = useUserVerification(listing.user_id);

  return (
    <Card 
      className={`hover:shadow-lg transition-shadow ${
        listing.listing_type === 'wanted' ? 'border-blue-200 bg-blue-50/50' : ''
      } ${listing.featured ? 'border-yellow-400 border-2' : ''}`}
    >
      <div className="relative">
        {listing.images && listing.images.length > 0 ? (
          <img 
            src={listing.images[0]} 
            alt={listing.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
         {listing.featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 font-bold">Featured</Badge>
        )}
        {user && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={() => onToggleFavorite(listing.id)}
          >
            <Heart 
              size={16} 
              className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"} 
            />
          </Button>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          {listing.listing_type === 'wanted' && (
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              <Search size={12} className="mr-1" />
              Looking For
            </Badge>
          )}
        </div>
        <Link to={`/marketplace/${listing.id}`}>
          <CardTitle className="text-lg hover:text-blue-600 transition-colors mb-2">
            {listing.listing_type === 'wanted' ? `Looking for: ${listing.title}` : listing.title}
          </CardTitle>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm text-gray-600">by {listing.profiles?.profile_name || 'Unknown'}</p>
          <VerifiedBadge isVerified={isVerified} />
        </div>
        <p className="text-sm mb-3 line-clamp-2">{listing.description}</p>
        <div className="flex justify-between items-center">
          {listing.listing_type === 'offer' ? (
            <p className="text-xl font-bold text-green-600">
              {listing.price ? `$${listing.price}` : 'Contact for price'}
            </p>
          ) : (
            <p className="text-lg font-bold text-blue-600">
              {listing.price ? `Budget: $${listing.price}` : 'Budget: Negotiable'}
            </p>
          )}
          <Link to={`/marketplace/${listing.id}`}>
            <Button size="sm">
              {listing.listing_type === 'wanted' ? 'I Have This' : 'View Details'}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketplaceItemCard;
