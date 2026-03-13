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
        profile_name: listing.profiles?.profile_name || 'Student',
        avatar_url: listing.profiles?.avatar_url,
        created_at: listing.created_at,
      },
    } as any);
  };

  useEffect(() => {
    return () => { observerRef.current?.disconnect(); };
  }, []);

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
    const categoryLabels: Record<string, string> = {
      microwave: 'Microwaves', fridge: 'Fridges', furniture: 'Furniture',
      'dorm decor': 'Dorm Decor', books: 'Books', clothes: 'Clothes', technology: 'Technology',
    };
    const categoryName = categoryFilter ? categoryLabels[categoryFilter] || categoryFilter : null;

    return (
      <div className="text-center py-12">
        <PackageOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground font-medium">
          {categoryName
            ? `No items found in ${categoryName}`
            : activeListingType === 'offer' 
              ? "No items found"
              : "No requests found"
          }
        </p>
        <p className="text-xs text-muted-foreground/60 mt-0.5">
          {categoryName ? "Try a different category or check back later" : "Try adjusting your filters"}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
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
      
      <div ref={loadMoreCallbackRef} className="w-full py-4 flex justify-center">
        {loadingMore && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs">Loading more...</span>
          </div>
        )}
        {!hasMore && listings.length > 0 && (
          <p className="text-[10px] text-muted-foreground/50">You've seen all items</p>
        )}
      </div>
    </>
  );
};

export default MarketplaceGrid;
