import ProductImageGallery from "@/components/marketplace/ProductImageGallery";
import ProductInfo from "@/components/marketplace/ProductInfo";
import SellerInfo from "@/components/marketplace/SellerInfo";
import ProductActions from "@/components/marketplace/ProductActions";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  user_id: string;
  created_at: string;
  location?: string;
  allow_pickup?: boolean;
  allow_meet_on_campus?: boolean;
  profiles: {
    profile_name: string;
    email: string;
    phone_number?: string;
    avatar_url?: string;
    full_name?: string;
  };
}

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
        />

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
        />

        <ProductActions
          user={user}
          isFavorite={isFavorite}
          isInCart={isInCart}
          isOwnProduct={product.user_id === user?.id}
          onToggleFavorite={onToggleFavorite}
          onAddToCart={onAddToCart}
          onStartConversation={onStartConversation}
        />
      </div>
    </div>
  );
};

export default MarketplaceItemContent;
