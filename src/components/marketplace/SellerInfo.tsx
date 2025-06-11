
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

interface SellerInfoProps {
  profileName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

const SellerInfo = ({ profileName, email, phoneNumber, createdAt }: SellerInfoProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User size={20} className="mr-2" />
          Seller Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium">{profileName}</p>
        <p className="text-sm text-gray-600">{email}</p>
        {phoneNumber && (
          <p className="text-sm text-gray-600">{phoneNumber}</p>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Listed on {new Date(createdAt).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
};

export default SellerInfo;
