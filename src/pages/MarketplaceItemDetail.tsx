
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMarketplaceItem } from "@/hooks/useMarketplaceItem";
import MarketplaceItemHeader from "@/components/marketplace/MarketplaceItemHeader";
import MarketplaceItemContent from "@/components/marketplace/MarketplaceItemContent";
import SimilarItems from "@/components/marketplace/SimilarItems";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const MarketplaceItemDetailSkeleton = () => (
  <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
    <div className="flex items-center gap-2 mb-6">
      <Skeleton className="h-9 w-9" />
      <Skeleton className="h-6 w-32" />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <Skeleton className="w-full aspect-square rounded-lg mb-4" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-16 h-16 rounded" />
          ))}
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

const MarketplaceItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    product,
    loading,
    currentImageIndex,
    setCurrentImageIndex,
    isFavorite,
    user,
    toggleFavorite,
    startConversation
  } = useMarketplaceItem(id);

  if (loading) {
    return <MarketplaceItemDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
      <MarketplaceItemHeader productId={product.id} />
      <MarketplaceItemContent
        product={product}
        currentImageIndex={currentImageIndex}
        onImageChange={setCurrentImageIndex}
        user={user}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onStartConversation={startConversation}
      />
      
      {product.listing_type === 'offer' && (
        <SimilarItems 
          currentProductId={product.id}
          currentProductTitle={product.title}
        />
      )}
      
      {user && product.user_id !== user.id && product.listing_type === 'offer' && (
        <div className="fixed bottom-14 left-0 right-0 p-3 bg-background/95 backdrop-blur-md border-t md:hidden z-40">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="flex-1">
              <p className="font-bold text-lg">
                {product.price !== null ? `$${product.price}` : 'Free'}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">{product.title}</p>
            </div>
            <Button onClick={startConversation} className="px-6 h-11 rounded-xl font-semibold">
              Message Seller
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceItemDetail;
