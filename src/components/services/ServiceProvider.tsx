
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ServiceProviderProps {
  profileName: string;
  email: string;
  phoneNumber?: string;
  createdAt: string;
  avatarUrl?: string;
  fullName?: string;
}

const ServiceProvider = ({ 
  profileName, 
  email, 
  phoneNumber, 
  createdAt, 
  avatarUrl,
  fullName 
}: ServiceProviderProps) => {
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
          Service Provider
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
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Rating:</span>
            <span>No reviews yet</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Response time:</span>
            <span>New provider</span>
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
