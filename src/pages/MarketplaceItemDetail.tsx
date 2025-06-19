
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMarketplaceItem } from "@/hooks/useMarketplaceItem";
import MarketplaceItemHeader from "@/components/marketplace/MarketplaceItemHeader";
import MarketplaceItemContent from "@/components/marketplace/MarketplaceItemContent";

const MarketplaceItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const {
    product,
    loading,
    currentImageIndex,
    setCurrentImageIndex,
    isFavorite,
    isInCart,
    user,
    toggleFavorite,
    addToCart,
    startConversation
  } = useMarketplaceItem(id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product details...</div>
      </div>
    );
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
    <div className="container mx-auto px-4 py-8">
      <MarketplaceItemHeader productId={product.id} />
      <MarketplaceItemContent
        product={product}
        currentImageIndex={currentImageIndex}
        onImageChange={setCurrentImageIndex}
        user={user}
        isFavorite={isFavorite}
        isInCart={isInCart}
        onToggleFavorite={toggleFavorite}
        onAddToCart={addToCart}
        onStartConversation={startConversation}
      />
    </div>
  );
};

export default MarketplaceItemDetail;
