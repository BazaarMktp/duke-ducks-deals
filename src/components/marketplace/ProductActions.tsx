import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare } from "lucide-react";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import UnboxedCheckoutDialog from "./UnboxedCheckoutDialog";
import MakeOfferDialog from "./MakeOfferDialog";

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
  listingId?: string;
  sellerId?: string;
  openToNegotiation?: boolean;
}

const ProductActions = ({ 
  user, isFavorite, isOwnProduct, onToggleFavorite, onStartConversation,
  listingType = 'offer', productTitle = '', productPrice = 0,
  isUnboxed = false, listingId, sellerId, openToNegotiation = false
}: ProductActionsProps) => {
  const [showUnboxedDialog, setShowUnboxedDialog] = useState(false);

  if (!user) {
    return (
      <div className="space-y-3">
        <Button asChild className="w-full h-12 rounded-xl text-base font-semibold">
          <Link to="/auth">Sign in to contact</Link>
        </Button>
        <FeedbackButton variant="ghost" className="w-full" />
      </div>
    );
  }

  if (isOwnProduct) {
    return (
      <div className="space-y-3">
        <Button variant="outline" asChild className="w-full h-11 rounded-xl">
          <Link to="/my-listings">Manage {listingType === 'wanted' ? 'Requests' : 'Listings'}</Link>
        </Button>
        <FeedbackButton variant="ghost" className="w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {isUnboxed && listingType === 'offer' ? (
          <Button onClick={() => setShowUnboxedDialog(true)} className="w-full h-12 rounded-xl text-base font-semibold">
            Buy through Unboxed
          </Button>
        ) : (
          <Button onClick={onStartConversation} className="w-full h-12 rounded-xl text-base font-semibold gap-2">
            <MessageSquare size={18} />
            {listingType === 'wanted' ? 'I Can Help!' : 'Message Seller'}
          </Button>
        )}

        <div className="flex gap-2">
          <Button
            onClick={onToggleFavorite}
            variant="outline"
            className={`flex-1 h-11 rounded-xl gap-2 ${isFavorite ? 'text-destructive border-destructive/30' : ''}`}
          >
            <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
            {isFavorite ? 'Saved' : 'Save'}
          </Button>

          {openToNegotiation && listingId && sellerId && listingType === 'offer' && (
            <MakeOfferDialog
              listingId={listingId}
              sellerId={sellerId}
              listingPrice={productPrice}
              listingTitle={productTitle}
            />
          )}
        </div>

        <FeedbackButton variant="ghost" className="w-full text-xs" />
      </div>

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
