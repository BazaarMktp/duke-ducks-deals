
import MarketplaceItemCard from "./MarketplaceItemCard";
import { MarketplaceListing } from "./types";
import { useConversation } from "@/hooks/useConversation";

interface MarketplaceGridProps {
  listings: MarketplaceListing[];
  user: any;
  favorites: string[];
  onToggleFavorite: (listingId: string) => void;
  loading: boolean;
  activeListingType: 'offer' | 'wanted';
}

const MarketplaceGrid = ({ listings, user, favorites, onToggleFavorite, loading, activeListingType }: MarketplaceGridProps) => {
  const { startConversation } = useConversation();

  const handleStartConversation = (listing: MarketplaceListing) => {
    // Map listing to the minimal Product shape required by startConversation
    startConversation({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      images: listing.images,
      user_id: listing.user_id,
      created_at: listing.created_at,
      listing_type: listing.listing_type,
      profiles: {
        profile_name: listing.profiles?.profile_name || 'Bazaar Member',
        avatar_url: listing.profiles?.avatar_url,
        created_at: listing.created_at,
      },
    } as any);
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
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
