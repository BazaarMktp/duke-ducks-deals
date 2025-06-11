
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface HousingInfoProps {
  title: string;
  housingType: string;
  location: string;
  price: number;
  description: string;
}

const HousingInfo = ({ 
  title, 
  housingType, 
  location, 
  price, 
  description 
}: HousingInfoProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Badge variant="secondary">
          {housingType?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
        </Badge>
      </div>
      
      <div className="flex items-center text-gray-600 mb-4">
        <MapPin size={16} className="mr-1" />
        {location}
      </div>
      
      <p className="text-3xl font-bold text-green-600 mb-6">${price}/month</p>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Description</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default HousingInfo;
