
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import VerifiedBadge from "@/components/common/VerifiedBadge";
import { useUserVerification } from "@/hooks/useUserVerification";

interface SellerInfoProps {
  profileName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  avatarUrl?: string;
  fullName?: string;
  isAuthenticated: boolean;
  userId?: string;
}

const SellerInfo = ({ 
  profileName, 
  email, 
  phoneNumber, 
  createdAt, 
  avatarUrl, 
  fullName, 
  isAuthenticated,
  userId 
}: SellerInfoProps) => {
  const { isVerified } = useUserVerification(userId);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Seller Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {profileName ? profileName.slice(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold">{fullName || profileName}</p>
              <VerifiedBadge isVerified={isVerified} showText />
            </div>
            <p className="text-sm text-gray-600">@{profileName}</p>
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Email:</span> {email}
            </p>
          </div>
        )}
        
        <p className="text-xs text-gray-500 mt-4">
          Member since {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
};

export default SellerInfo;
