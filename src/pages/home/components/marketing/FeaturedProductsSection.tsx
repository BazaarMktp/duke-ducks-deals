
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturedProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  profiles: {
    profile_name: string;
  } | null;
}

interface FeaturedProductsSectionProps {
  featuredProducts: FeaturedProduct[];
}

export const FeaturedProductsSection = ({ featuredProducts }: FeaturedProductsSectionProps) => {
  if (featuredProducts.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Available Now</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Check out some of the great items your fellow students are selling
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-100 overflow-hidden rounded-t-lg relative">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-t-lg">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-1">{product.title}</h3>
                <p className="text-blue-600 font-bold mb-1">
                  {product.price ? `$${product.price.toFixed(2)}` : 'Free'}
                </p>
                <p className="text-sm text-gray-500">by {product.profiles?.profile_name || 'Unknown'}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/marketplace">
            <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              View All Items
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
