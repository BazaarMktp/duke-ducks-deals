import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { MarketplaceListing } from "./types";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { generateBlurDataURL } from "@/utils/imageUtils";
import AnimatedHeart from "@/components/ui/animated-heart";
import { Badge } from "@/components/ui/badge";

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
}: MarketplaceItemCardProps) => {
  const getDisplayName = () => {
    if (!user) return "Bazaar Member";
    if (!listing.profiles) return "Anonymous";
    const fullName = listing.profiles.full_name;
    if (fullName) return fullName.split(" ")[0];
    return listing.profiles.profile_name || "Anonymous";
  };

  const isSold = listing.status === 'sold' || listing.sold_at;
  const isNew = new Date(listing.created_at) > new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  const isFavorite = favorites.includes(listing.id);

  const timeAgo = () => {
    const diff = Date.now() - new Date(listing.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
  };

  if (listing.listing_type === 'wanted') {
    return (
      <Link to={`/marketplace/${listing.id}`} className="block group">
        <div className="bg-card rounded-xl border border-border/60 p-4 hover:shadow-md transition-all duration-200 hover:border-primary/20 relative">
          {user && (
            <div className="absolute top-3 right-3 z-10" onClick={(e) => e.preventDefault()}>
              <AnimatedHeart
                isFavorite={isFavorite}
                onClick={() => onToggleFavorite(listing.id)}
                size={18}
              />
            </div>
          )}
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 mb-2 text-xs font-medium">
            Wanted
          </Badge>
          <h3 className="font-semibold text-sm line-clamp-2 text-foreground mb-1">
            {listing.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{listing.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {listing.price ? `Budget: $${listing.price}` : 'Negotiable'}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo()}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/marketplace/${listing.id}`} className="block group">
      <div className="bg-card rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 border border-border/40 hover:border-border relative">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-muted relative">
          <OptimizedImage
            src={listing.images?.[0] || "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            lazy={true}
            blurDataURL={generateBlurDataURL()}
            aspectRatio="square"
          />

          {/* Overlay badges */}
          {isSold && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground font-bold text-sm px-4 py-1.5 rounded-full">
                SOLD
              </span>
            </div>
          )}

          {/* Favorite button */}
          {user && !isSold && (
            <div
              className="absolute top-2.5 right-2.5 z-10 bg-background/80 backdrop-blur-sm rounded-full p-1.5 shadow-sm"
              onClick={(e) => e.preventDefault()}
            >
              <AnimatedHeart
                isFavorite={isFavorite}
                onClick={() => onToggleFavorite(listing.id)}
                size={18}
              />
            </div>
          )}

          {/* Status badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            {listing.featured && (
              <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Featured
              </span>
            )}
            {!listing.featured && isNew && !isSold && (
              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                New
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-baseline justify-between gap-2 mb-0.5">
            <span className="text-base font-bold text-foreground">
              {listing.price ? `$${listing.price}` : 'Free'}
            </span>
            {listing.open_to_negotiation && (
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full whitespace-nowrap">
                OBO
              </span>
            )}
          </div>
          <h3 className="text-sm text-foreground line-clamp-1 mb-1">
            {listing.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{getDisplayName()}</span>
            {listing.profiles?.is_verified && (
              <BadgeCheck size={12} className="text-primary" />
            )}
            <span className="mx-0.5">·</span>
            <span>{timeAgo()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MarketplaceItemCard;
