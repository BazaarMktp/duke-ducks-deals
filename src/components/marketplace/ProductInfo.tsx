import { Badge } from "@/components/ui/badge";
import { Package, Users, MapPin, Search, HandCoins, Lock } from "lucide-react";
import { getPrivacyAwareLocation } from "@/utils/locationPrivacy";

interface ProductInfoProps {
  title: string;
  price: number;
  description: string;
  allowPickup?: boolean;
  allowMeetOnCampus?: boolean;
  location?: string;
  listingType?: string;
  openToNegotiation?: boolean;
  userId?: string;
  listingOwnerId?: string;
  isInConversation?: boolean;
  isAdmin?: boolean;
  isUnboxed?: boolean;
}

const ProductInfo = ({ 
  title, price, description, allowPickup, allowMeetOnCampus, location,
  listingType = 'offer', openToNegotiation = false, userId, listingOwnerId,
  isInConversation = false, isAdmin = false, isUnboxed = false
}: ProductInfoProps) => {
  const transactionMethods = [
    ...(allowPickup ? ["Pickup"] : []),
    ...(allowMeetOnCampus ? ["Meet on Campus"] : []),
  ];
  
  const displayLocation = getPrivacyAwareLocation(
    location, userId, listingOwnerId || '', isInConversation, isAdmin
  );
  const isLocationMasked = location && displayLocation !== location;

  return (
    <div className="space-y-5">
      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {listingType === 'wanted' && (
          <Badge variant="secondary" className="gap-1">
            <Search size={12} /> Request
          </Badge>
        )}
        {isUnboxed && listingType === 'offer' && (
          <Badge className="bg-primary text-primary-foreground">Unboxed</Badge>
        )}
        {openToNegotiation && listingType === 'offer' && (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <HandCoins size={12} /> Negotiable
          </Badge>
        )}
      </div>

      {/* Title & Price */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {listingType === 'wanted' ? `Looking for: ${title}` : title}
        </h1>
        <p className="text-2xl font-bold text-foreground">
          {listingType === 'wanted' 
            ? (price ? `Budget: $${price}` : 'Budget: Negotiable')
            : (price ? `$${price}` : 'Free')
          }
        </p>
      </div>

      {/* Location */}
      {displayLocation && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin size={15} />
          <span className="text-sm">
            {listingType === 'wanted' ? `Preferred: ${displayLocation}` : displayLocation}
          </span>
          {isLocationMasked && (
            <span className="flex items-center gap-1 text-xs">
              <Lock size={11} /> Message for full address
            </span>
          )}
        </div>
      )}

      {/* Transaction Methods */}
      {listingType === 'offer' && transactionMethods.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {transactionMethods.map((method) => (
            <Badge key={method} variant="secondary" className="gap-1 font-normal">
              {method === "Pickup" ? <Package size={12} /> : <Users size={12} />}
              {method}
            </Badge>
          ))}
        </div>
      )}

      {/* Description */}
      <div className="pt-4 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-2">
          {listingType === 'wanted' ? "What I'm looking for" : 'Description'}
        </h3>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{description}</p>
      </div>

      {listingType === 'wanted' && (
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
          <h4 className="font-medium text-foreground mb-2 text-sm">Responding to this request</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Contact the requester if you have what they're looking for</li>
            <li>• Be clear about condition and availability</li>
            <li>• Discuss pricing and meeting arrangements</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
