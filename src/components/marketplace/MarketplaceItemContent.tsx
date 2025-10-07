
import ProductImageGallery from "@/components/marketplace/ProductImageGallery";
import ProductInfo from "@/components/marketplace/ProductInfo";
import SellerInfo from "@/components/marketplace/SellerInfo";
import ProductActions from "@/components/marketplace/ProductActions";
import { Product } from "@/types/marketplace";

interface MarketplaceItemContentProps {
  product: Product;
  currentImageIndex: number;
  onImageChange: (index: number) => void;
  user: any;
  isFavorite: boolean;
  isInCart: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onStartConversation: () => void;
}

const MarketplaceItemContent = ({
  product,
  currentImageIndex,
  onImageChange,
  user,
  isFavorite,
  isInCart,
  onToggleFavorite,
  onAddToCart,
  onStartConversation
}: MarketplaceItemContentProps) => {
  // Check if this is a microwave listing for Unboxed service
  const isMicrowave = product.title.toLowerCase().includes('microwave');

  // For requests (wanted), we don't show images and use a single column layout
  if (product.listing_type === 'wanted') {
    return (
      <div className="max-w-4xl mx-auto">
        <ProductInfo
          title={product.title}
          price={product.price}
          description={product.description}
          location={product.location}
          allowPickup={product.allow_pickup}
          allowMeetOnCampus={product.allow_meet_on_campus}
          listingType={product.listing_type}
          openToNegotiation={product.open_to_negotiation}
          userId={user?.id}
          listingOwnerId={product.user_id}
          isInConversation={false} // TODO: Add conversation detection
          isAdmin={false} // TODO: Add admin detection
          isUnboxed={isMicrowave}
        />

        <div className="mb-6">
          <ProductActions
            user={user}
            isFavorite={isFavorite}
            isInCart={isInCart}
            isOwnProduct={product.user_id === user?.id}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            onStartConversation={onStartConversation}
            listingType={product.listing_type}
            productTitle={product.title}
            productPrice={product.price || 0}
            isUnboxed={isMicrowave}
          />
        </div>

        <SellerInfo
          profileName={product.profiles.profile_name}
          email={product.profiles.email}
          phoneNumber={product.profiles.phone_number}
          createdAt={product.profiles.created_at}
          avatarUrl={product.profiles.avatar_url}
          fullName={product.profiles.full_name}
          isAuthenticated={!!user}
          userId={product.user_id}
          listingCreatedAt={product.created_at}
          listingType={product.listing_type}
          isOwnListing={product.user_id === user?.id}
        />
      </div>
    );
  }

  // For offers, use the two-column layout with images
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <ProductImageGallery
        images={product.images}
        title={product.title}
        currentImageIndex={currentImageIndex}
        onImageChange={onImageChange}
      />

      <div>
        <ProductInfo
          title={product.title}
          price={product.price}
          description={product.description}
          location={product.location}
          allowPickup={product.allow_pickup}
          allowMeetOnCampus={product.allow_meet_on_campus}
          listingType={product.listing_type}
          openToNegotiation={product.open_to_negotiation}
          userId={user?.id}
          listingOwnerId={product.user_id}
          isInConversation={false} // TODO: Add conversation detection
          isAdmin={false} // TODO: Add admin detection
          isUnboxed={isMicrowave}
        />

        <div className="mb-6">
          <ProductActions
            user={user}
            isFavorite={isFavorite}
            isInCart={isInCart}
            isOwnProduct={product.user_id === user?.id}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            onStartConversation={onStartConversation}
            listingType={product.listing_type}
            productTitle={product.title}
            productPrice={product.price || 0}
            isUnboxed={isMicrowave}
          />
        </div>

        <SellerInfo
          profileName={product.profiles.profile_name}
          email={product.profiles.email}
          phoneNumber={product.profiles.phone_number}
          createdAt={product.profiles.created_at}
          avatarUrl={product.profiles.avatar_url}
          fullName={product.profiles.full_name}
          isAuthenticated={!!user}
          userId={product.user_id}
          listingCreatedAt={product.created_at}
          listingType={product.listing_type}
          isOwnListing={product.user_id === user?.id}
        />
      </div>
    </div>
  );
};

export default MarketplaceItemContent;
