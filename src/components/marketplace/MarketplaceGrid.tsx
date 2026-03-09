import { useEffect, useRef, useCallback } from "react";
import MarketplaceItemCard from "./MarketplaceItemCard";
import MarketplaceItemSkeleton from "./MarketplaceItemSkeleton";
import { MarketplaceListing } from "./types";
import { useConversation } from "@/hooks/useConversation";
import { Loader2, PackageOpen } from "lucide-react";

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
  categoryFilter?: string | null;
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
  activeListingType,
  categoryFilter = null,
}: MarketplaceGridProps) => {
  const { startConversation } = useConversation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Use refs to avoid stale closures in IntersectionObserver callback
  const hasMoreRef = useRef(hasMore);
  const loadingMoreRef = useRef(loadingMore);
  const onLoadMoreRef = useRef(onLoadMore);
  
  hasMoreRef.current = hasMore;
  loadingMoreRef.current = loadingMore;
  onLoadMoreRef.current = onLoadMore;

  const handleStartConversation = (listing: MarketplaceListing) => {
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

  // Clean up observer on unmount
  useEffect(() => {
    return () => { observerRef.current?.disconnect(); };
  }, []);

  // Callback ref: attaches/detaches the IntersectionObserver when the sentinel mounts/unmounts
  const loadMoreCallbackRef = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) observerRef.current.disconnect();

    if (!node) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMoreRef.current && !loadingMoreRef.current && onLoadMoreRef.current) {
          onLoadMoreRef.current();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );
    observerRef.current.observe(node);
  }, []);

  if (loading) {
    return <MarketplaceItemSkeleton count={8} />;
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <PackageOpen className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">
          {activeListingType === 'offer' 
            ? "No items found"
            : "No requests found"
          }
        </p>
        <p className="text-sm text-muted-foreground/60 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
      
      <div ref={loadMoreCallbackRef} className="w-full py-8 flex justify-center">
        {loadingMore && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">Loading more...</span>
          </div>
        )}
        {!hasMore && listings.length > 0 && (
          <p className="text-xs text-muted-foreground/50">You've seen all items</p>
        )}
      </div>
    </>
  );
};

export default MarketplaceGrid;
