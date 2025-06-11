
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Star, Calendar } from "lucide-react";

interface ServiceProviderProps {
  profileName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
}

const ServiceProvider = ({ profileName, email, phoneNumber, createdAt }: ServiceProviderProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User size={20} className="mr-2" />
          Service Provider
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <User size={24} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-lg">{profileName}</h3>
          <p className="text-sm text-gray-600">{email}</p>
          {phoneNumber && (
            <p className="text-sm text-gray-600">{phoneNumber}</p>
          )}
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Rating:</span>
            <div className="flex items-center">
              <Star size={14} className="fill-current text-yellow-500" />
              <span className="ml-1">4.8 (24 reviews)</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Response time:</span>
            <span>Within 2 hours</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Member since:</span>
            <span>{new Date(createdAt).getFullYear()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceProvider;
