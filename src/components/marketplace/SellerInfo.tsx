
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SellerInfoProps {
  profileName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  avatarUrl?: string;
  fullName?: string;
}

const SellerInfo = ({ 
  profileName, 
  email, 
  phoneNumber, 
  createdAt, 
  avatarUrl,
  fullName 
}: SellerInfoProps) => {
  // Get first name from full_name or fallback to profile_name
  const getFirstName = () => {
    if (fullName) {
      return fullName.split(' ')[0];
    }
    return profileName;
  };

  const getInitials = () => {
    const firstName = getFirstName();
    return firstName.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User size={20} className="mr-2" />
          Seller Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <Avatar className="w-16 h-16 mx-auto mb-3">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-lg">{getFirstName()}</h3>
          <p className="text-sm text-gray-600">{email}</p>
          {phoneNumber && (
            <p className="text-sm text-gray-600">{phoneNumber}</p>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Listed on {new Date(createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default SellerInfo;
