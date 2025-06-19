
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import VerifiedBadge from "@/components/common/VerifiedBadge";
import { Calendar, Clock, Phone } from "lucide-react";

interface SellerInfoProps {
  profileName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  avatarUrl?: string;
  fullName?: string;
  isAuthenticated: boolean;
  userId: string;
  listingCreatedAt: string;
  listingType?: string;
}

const SellerInfo = ({ 
  profileName, 
  email, 
  phoneNumber, 
  createdAt, 
  avatarUrl, 
  fullName, 
  isAuthenticated, 
  userId, 
  listingCreatedAt,
  listingType = 'offer'
}: SellerInfoProps) => {
  const displayName = fullName || profileName;
  const memberSince = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
  
  const listingDate = new Date(listingCreatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">
          {listingType === 'wanted' ? 'Requester Information' : 'Seller Information'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{displayName}</h4>
              <VerifiedBadge isVerified={true} />
            </div>
            {isAuthenticated && (
              <p className="text-sm text-gray-600 mb-2">{email}</p>
            )}
            <div className="space-y-1">
              <p className="text-sm text-gray-500">
                <Calendar size={14} className="inline mr-2" />
                Member since {memberSince}
              </p>
              <p className="text-sm text-gray-500">
                <Clock size={14} className="inline mr-2" />
                {listingType === 'wanted' ? 'Request' : 'Listing'} posted on {listingDate}
              </p>
              {isAuthenticated && phoneNumber && (
                <p className="text-sm text-gray-500">
                  <Phone size={14} className="inline mr-2" />
                  {phoneNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerInfo;
