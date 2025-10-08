
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Listing } from "../types";

interface FeaturedRequestsProps {
  featuredRequests: (Listing & { requester?: string })[];
}

export const FeaturedRequests = ({ featuredRequests }: FeaturedRequestsProps) => {
  return (
    <section className="py-8 bg-background">
      <div className="px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recent Requests</h2>
          <div className="flex gap-2">
            <Link to="/marketplace">
              <Button variant="outline" size="sm">Marketplace</Button>
            </Link>
          </div>
        </div>
        
        {featuredRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No requests available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredRequests.map((request) => (
              <Card key={request.id} className="hover:shadow-lg transition-shadow border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Search size={12} className="text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">
                      {request.category.charAt(0).toUpperCase() + request.category.slice(1)} Request
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-1">Looking for: {request.title}</h3>
                  <p className="text-blue-600 font-bold mb-1">
                    {request.price ? `Budget: $${request.price}` : 'Budget: Negotiable'}
                  </p>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{request.description || 'No description available'}</p>
                  <p className="text-sm text-gray-500">by {request.requester || 'Unknown'}</p>
                  <Link to={`/${request.category}/${request.id}`} className="block mt-3">
                    <Button size="sm" className="w-full">I Can Help</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
