
import { Badge } from "@/components/ui/badge";
import { Package, Users, MapPin } from "lucide-react";

interface ProductInfoProps {
  title: string;
  price: number;
  description: string;
  allowPickup?: boolean;
  allowMeetOnCampus?: boolean;
  location?: string;
}

const ProductInfo = ({ 
  title, 
  price, 
  description, 
  allowPickup, 
  allowMeetOnCampus,
  location 
}: ProductInfoProps) => {
  const getTransactionMethods = () => {
    const methods = [];
    if (allowPickup) methods.push("Pickup");
    if (allowMeetOnCampus) methods.push("Meet on Campus");
    return methods;
  };

  const transactionMethods = getTransactionMethods();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-2xl font-bold text-green-600">
          {price ? `$${price}` : 'Free'}
        </p>
      </div>

      <div className="space-y-3">
        {location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} />
            <span className="text-sm">{location}</span>
          </div>
        )}

        {transactionMethods.length > 0 && (
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

      <div>
        <h3 className="font-medium text-gray-900 mb-2">Description</h3>
        <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;
