
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Listing } from "../types";

interface FeaturedItemsProps {
  featuredListings: (Listing & { seller?: string })[];
  isLoading: boolean;
}

export const FeaturedItems = ({ featuredListings, isLoading }: FeaturedItemsProps) => {
  return (
    <section className="py-4 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">Featured Marketplace Items</h2>
          <Link to="/marketplace">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : featuredListings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No marketplace items available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {featuredListings.map((item) => (
              <Link key={item.id} to={`/marketplace/${item.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="h-48 bg-muted overflow-hidden rounded-t-lg relative">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-1 text-foreground">{item.title}</h3>
                    <p className="text-primary font-bold mb-1">
                      {item.price !== undefined ? `$${item.price.toFixed(2)}` : 'Contact for price'}
                    </p>
                    <p className="text-sm text-muted-foreground">by {item.seller || 'Unknown'}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
