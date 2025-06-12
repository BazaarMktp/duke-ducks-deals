
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

interface ServiceInfoProps {
  title: string;
  price: number;
  description: string;
  location?: string;
  createdAt: string;
}

const ServiceInfo = ({ title, price, description, location, createdAt }: ServiceInfoProps) => {
  return (
    <div className="lg:col-span-2">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{title}</h1>
        </div>
        
        <p className="text-3xl font-bold text-green-600 mb-4">${price}/hour</p>
        <Badge variant="outline" className="mb-4">Available</Badge>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{description}</p>
          {location && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Service Area</h4>
              <p className="text-gray-600">{location}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What's Included</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Professional service delivery</li>
            <li>Flexible scheduling</li>
            <li>Quality guarantee</li>
            <li>Direct communication with provider</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceInfo;
