
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
}

const ProductInfo = ({ 
  title, 
  price, 
  description, 
  allowPickup, 
  allowMeetOnCampus,
  location,
  listingType = 'offer',
  openToNegotiation = false,
  userId,
  listingOwnerId,
  isInConversation = false,
  isAdmin = false
}: ProductInfoProps) => {
  const getTransactionMethods = () => {
    const methods = [];
    if (allowPickup) methods.push("Pickup");
    if (allowMeetOnCampus) methods.push("Meet on Campus");
    return methods;
  };

  const transactionMethods = getTransactionMethods();
  
  const displayLocation = getPrivacyAwareLocation(
    location,
    userId,
    listingOwnerId || '',
    isInConversation,
    isAdmin
  );
  
  const isLocationMasked = location && displayLocation !== location;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          {listingType === 'wanted' && (
            <Badge variant="outline" className="text-blue-600 border-blue-300">
              <Search size={12} className="mr-1" />
              Request
            </Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {listingType === 'wanted' ? `Looking for: ${title}` : title}
        </h1>
        <div className="flex items-center gap-3">
          <p className="text-2xl font-medium text-foreground">
            {listingType === 'wanted' 
              ? (price ? `Budget: $${price}` : 'Budget: Negotiable')
              : (price ? `$${price}` : 'Free')
            }
          </p>
          {listingType === 'offer' && openToNegotiation && (
            <Badge variant="outline" className="text-orange-600 border-orange-300">
              <HandCoins size={12} className="mr-1" />
              Open to negotiation
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {displayLocation && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">
              {listingType === 'wanted' ? `Preferred location: ${displayLocation}` : displayLocation}
            </span>
            {isLocationMasked && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Lock size={12} />
                <span>Start a conversation to see full address</span>
              </div>
            )}
          </div>
        )}

        {/* Only show transaction methods for offers */}
        {listingType === 'offer' && transactionMethods.length > 0 && (
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Available Transaction Methods:</h3>
            <div className="flex flex-wrap gap-2">
              {transactionMethods.map((method) => (
                <Badge key={method} variant="secondary" className="flex items-center gap-1">
                  {method === "Pickup" ? (
                    <><Package size={12} />{method}</>
                  ) : (
                    <><Users size={12} />{method}</>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pb-6 border-b border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">
          {listingType === 'wanted' ? 'What I\'m looking for' : 'Description'}
        </h3>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{description}</p>
      </div>

      {listingType === 'wanted' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Responding to this request:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Contact the requester if you have what they're looking for</li>
            <li>• Be clear about the condition and availability of your item</li>
            <li>• Discuss pricing and meeting arrangements</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
