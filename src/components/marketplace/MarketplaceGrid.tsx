
import { useEffect, useRef, useCallback } from "react";
import MarketplaceItemCard from "./MarketplaceItemCard";
import MarketplaceItemSkeleton from "./MarketplaceItemSkeleton";
import { MarketplaceListing } from "./types";
import { useConversation } from "@/hooks/useConversation";
import { Loader2 } from "lucide-react";

interface MarketplaceGridProps {
  listings: MarketplaceListing[];
  user: any;
  favorites: string[];
  onToggleFavorite: (listingId: string) => void;
  loading: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  activeListingType: 'offer' | 'wanted';
}

const MarketplaceGrid = ({ 
  listings, 
  user, 
  favorites, 
  onToggleFavorite, 
  loading,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  activeListingType 
}: MarketplaceGridProps) => {
  const { startConversation } = useConversation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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

  // Infinite scroll with IntersectionObserver
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !loadingMore && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, loadingMore, onLoadMore]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  // Show skeleton while initial loading
  if (loading) {
    return <MarketplaceItemSkeleton count={8} />;
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {activeListingType === 'offer' 
            ? "No marketplace items found matching your criteria."
            : "No wanted items found matching your criteria."
          }
        </p>
      </div>
    );
  }

  return (
    <>
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
      
      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
        {loadingMore && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more...</span>
          </div>
        )}
        {!hasMore && listings.length > 0 && (
          <p className="text-sm text-muted-foreground">You've seen all items</p>
        )}
      </div>
    </>
  );
};

export default MarketplaceGrid;
