import ProductImageGallery from "@/components/marketplace/ProductImageGallery";
import ProductInfo from "@/components/marketplace/ProductInfo";
import SellerInfo from "@/components/marketplace/SellerInfo";
import ProductActions from "@/components/marketplace/ProductActions";
import SellerRatingDisplay from "@/components/marketplace/SellerRatingDisplay";
import SellerRatingForm from "@/components/marketplace/SellerRatingForm";
import SellerReviews from "@/components/marketplace/SellerReviews";
import OffersPanel from "@/components/marketplace/OffersPanel";
import { Product } from "@/types/marketplace";

interface MarketplaceItemContentProps {
  product: Product;
  currentImageIndex: number;
  onImageChange: (index: number) => void;
  user: any;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onStartConversation: () => void;
}

const MarketplaceItemContent = ({
  product, currentImageIndex, onImageChange, user,
  isFavorite, onToggleFavorite, onStartConversation
}: MarketplaceItemContentProps) => {
  const isMicrowave = product.title.toLowerCase().includes('microwave');

  if (product.listing_type === 'wanted') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <ProductInfo
          title={product.title} price={product.price} description={product.description}
          location={product.location} allowPickup={product.allow_pickup}
          allowMeetOnCampus={product.allow_meet_on_campus} listingType={product.listing_type}
          openToNegotiation={product.open_to_negotiation} userId={user?.id}
          listingOwnerId={product.user_id} isInConversation={false} isAdmin={false}
          isUnboxed={isMicrowave}
        />
        <ProductActions
          user={user} isFavorite={isFavorite} isOwnProduct={product.user_id === user?.id}
          onToggleFavorite={onToggleFavorite} onStartConversation={onStartConversation}
          listingType={product.listing_type} productTitle={product.title}
          productPrice={product.price || 0} isUnboxed={isMicrowave}
        />
        <SellerInfo
          profileName={product.profiles.profile_name} email={product.profiles.email}
          phoneNumber={product.profiles.phone_number} createdAt={product.profiles.created_at}
          avatarUrl={product.profiles.avatar_url} fullName={product.profiles.full_name}
          isAuthenticated={!!user} userId={product.user_id}
          listingCreatedAt={product.created_at} listingType={product.listing_type}
          isOwnListing={product.user_id === user?.id}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      {/* Left: Images (3/5 width on desktop) */}
      <div className="lg:col-span-3">
        <ProductImageGallery
          images={product.images} title={product.title}
          currentImageIndex={currentImageIndex} onImageChange={onImageChange}
        />
      </div>

      {/* Right: Info + Actions (2/5 width on desktop) */}
      <div className="lg:col-span-2 space-y-5">
        <ProductInfo
          title={product.title} price={product.price} description={product.description}
          location={product.location} allowPickup={product.allow_pickup}
          allowMeetOnCampus={product.allow_meet_on_campus} listingType={product.listing_type}
          openToNegotiation={product.open_to_negotiation} userId={user?.id}
          listingOwnerId={product.user_id} isInConversation={false} isAdmin={false}
          isUnboxed={isMicrowave}
        />

        <ProductActions
          user={user} isFavorite={isFavorite} isOwnProduct={product.user_id === user?.id}
          onToggleFavorite={onToggleFavorite} onStartConversation={onStartConversation}
          listingType={product.listing_type} productTitle={product.title}
          productPrice={product.price || 0} isUnboxed={isMicrowave}
          listingId={product.id} sellerId={product.user_id}
          openToNegotiation={product.open_to_negotiation}
        />

        {product.open_to_negotiation && (
          <OffersPanel listingId={product.id} sellerId={product.user_id} />
        )}

        <SellerInfo
          profileName={product.profiles.profile_name} email={product.profiles.email}
          phoneNumber={product.profiles.phone_number} createdAt={product.profiles.created_at}
          avatarUrl={product.profiles.avatar_url} fullName={product.profiles.full_name}
          isAuthenticated={!!user} userId={product.user_id}
          listingCreatedAt={product.created_at} listingType={product.listing_type}
          isOwnListing={product.user_id === user?.id}
        />

        {/* Ratings */}
        <div className="flex items-center gap-3">
          <SellerRatingDisplay sellerId={product.user_id} />
          {user && product.user_id !== user.id && (
            <SellerRatingForm 
              sellerId={product.user_id} 
              listingId={product.id}
              sellerName={product.profiles.profile_name}
            />
          )}
        </div>
        <SellerReviews sellerId={product.user_id} />
      </div>
    </div>
  );
};

export default MarketplaceItemContent;
