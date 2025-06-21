
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, ShoppingCart, MessageSquare } from "lucide-react";
import FeedbackButton from "@/components/feedback/FeedbackButton";

interface ProductActionsProps {
  user: any;
  isFavorite: boolean;
  isInCart: boolean;
  isOwnProduct: boolean;
  onToggleFavorite: () => void;
  onAddToCart: () => void;
  onStartConversation: () => void;
  listingType?: string;
}

const ProductActions = ({ 
  user, 
  isFavorite, 
  isInCart, 
  isOwnProduct, 
  onToggleFavorite, 
  onAddToCart, 
  onStartConversation,
  listingType = 'offer'
}: ProductActionsProps) => {
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            {listingType === 'wanted' ? 'Sign in to respond to this request' : 'Sign in to contact the seller'}
          </p>
          <Button asChild className="w-full mb-3">
            <Link to="/auth">Sign In</Link>
          </Button>
          <FeedbackButton variant="ghost" className="w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isOwnProduct) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            This is your {listingType === 'wanted' ? 'request' : 'listing'}
          </p>
          <Button variant="outline" asChild className="w-full mb-3">
            <Link to="/my-listings">Manage {listingType === 'wanted' ? 'Requests' : 'Listings'}</Link>
          </Button>
          <FeedbackButton variant="ghost" className="w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          {listingType === 'offer' && (
            <>
              <Button
                onClick={onToggleFavorite}
                variant="outline"
                className={`w-full ${isFavorite ? 'text-red-500' : ''}`}
              >
                <Heart size={16} className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              
              <Button
                onClick={onAddToCart}
                disabled={isInCart}
                variant="outline"
                className="w-full"
              >
                <ShoppingCart size={16} className="mr-2" />
                {isInCart ? 'Already in Cart' : 'Add to Cart'}
              </Button>
            </>
          )}
          
          <Button onClick={onStartConversation} className="w-full">
            <MessageSquare size={16} className="mr-2" />
            {listingType === 'wanted' ? 'I Can Help!' : 'Message Seller'}
          </Button>

          {listingType === 'wanted' && (
            <Button
              onClick={onToggleFavorite}
              variant="outline"
              className={`w-full ${isFavorite ? 'text-red-500' : ''}`}
            >
              <Heart size={16} className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Remove from Saved' : 'Save Request'}
            </Button>
          )}

          <FeedbackButton variant="ghost" className="w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductActions;
