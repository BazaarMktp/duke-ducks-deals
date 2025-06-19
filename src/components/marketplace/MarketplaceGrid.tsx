
import MarketplaceItemCard from "./MarketplaceItemCard";
import { MarketplaceListing } from "./types";

interface MarketplaceGridProps {
  listings: MarketplaceListing[];
  user: any;
  favorites: string[];
  onToggleFavorite: (listingId: string) => void;
  loading: boolean;
  activeListingType: 'offer' | 'wanted';
}

const MarketplaceGrid = ({ listings, user, favorites, onToggleFavorite, loading, activeListingType }: MarketplaceGridProps) => {
  const handleStartConversation = (listing: MarketplaceListing) => {
    // This function will be implemented when needed
    console.log('Starting conversation for listing:', listing.id);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {activeListingType === 'offer' 
            ? "No marketplace items found matching your criteria."
            : "No wanted items found matching your criteria."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <MarketplaceItemCard 
          key={listing.id}
          listing={listing}
          user={user}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onStartConversation={handleStartConversation}
        />
      ))}
    </div>
  );
};

export default MarketplaceGrid;
