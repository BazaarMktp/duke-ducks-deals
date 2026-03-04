
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageSquare } from "lucide-react";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import UnboxedCheckoutDialog from "./UnboxedCheckoutDialog";

interface ProductActionsProps {
  user: any;
  isFavorite: boolean;
  isOwnProduct: boolean;
  onToggleFavorite: () => void;
  onStartConversation: () => void;
  listingType?: string;
  productTitle?: string;
  productPrice?: number;
  isUnboxed?: boolean;
}

const ProductActions = ({ 
  user, 
  isFavorite, 
  isOwnProduct, 
  onToggleFavorite, 
  onStartConversation,
  listingType = 'offer',
  productTitle = '',
  productPrice = 0,
  isUnboxed = false
}: ProductActionsProps) => {
  const [showUnboxedDialog, setShowUnboxedDialog] = useState(false);
  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">
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
          <p className="text-muted-foreground mb-4">
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
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            {isUnboxed && listingType === 'offer' ? (
              <Button onClick={() => setShowUnboxedDialog(true)} className="w-full bg-primary hover:bg-primary/90">
                Buy through Unboxed
              </Button>
            ) : (
              <Button onClick={onStartConversation} className="w-full">
                <MessageSquare size={16} className="mr-2" />
                {listingType === 'wanted' ? 'I Can Help!' : 'Message Seller'}
              </Button>
            )}

            <Button
              onClick={onToggleFavorite}
              variant="outline"
              className={`w-full ${isFavorite ? 'text-destructive' : ''}`}
            >
              <Heart size={16} className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} />
              {listingType === 'wanted' 
                ? (isFavorite ? 'Remove from Saved' : 'Save Request')
                : (isFavorite ? 'Remove from Favorites' : 'Add to Favorites')
              }
            </Button>

            <FeedbackButton variant="ghost" className="w-full" />
          </div>
        </CardContent>
      </Card>

      <UnboxedCheckoutDialog
        open={showUnboxedDialog}
        onOpenChange={setShowUnboxedDialog}
        productTitle={productTitle}
        productPrice={productPrice}
      />
    </>
  );
};

export default ProductActions;
