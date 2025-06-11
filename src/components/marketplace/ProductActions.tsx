
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, MessageCircle } from "lucide-react";

interface ProductActionsProps {
  user: any;
  isFavorite: boolean;
  isInCart: boolean;
  isOwnProduct: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onStartConversation: () => void;
}

const ProductActions = ({
  user,
  isFavorite,
  isInCart,
  isOwnProduct,
  onToggleFavorite,
  onAddToCart,
  onStartConversation
}: ProductActionsProps) => {
  return (
    <div className="flex gap-3">
      {user && (
        <Button
          variant="outline"
          onClick={onToggleFavorite}
          className={isFavorite ? "text-red-500" : ""}
        >
          <Heart size={16} className={isFavorite ? "fill-current" : ""} />
        </Button>
      )}
      {user && (
        <Button 
          onClick={onAddToCart}
          disabled={isInCart}
          className="flex-1"
        >
          <ShoppingCart size={16} className="mr-2" />
          {isInCart ? "In Cart" : "Add to Cart"}
        </Button>
      )}
      {user && !isOwnProduct && (
        <Button 
          onClick={onStartConversation}
          variant="outline"
        >
          <MessageCircle size={16} className="mr-2" />
          Contact Now
        </Button>
      )}
    </div>
  );
};

export default ProductActions;
