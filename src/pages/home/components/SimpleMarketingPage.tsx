
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, TrendingUp } from "lucide-react";
import { Stats } from "../types";
import FeedbackButton from "@/components/feedback/FeedbackButton";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SimpleMarketingPageProps {
  stats: Stats;
}

interface FeaturedProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  profiles: {
    profile_name: string;
  } | null;
}

export const SimpleMarketingPage = ({ stats }: SimpleMarketingPageProps) => {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('id, title, price, images, profiles(profile_name)')
          .eq('status', 'active')
          .eq('category', 'marketplace')
          .eq('listing_type', 'offer')
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const statsDisplay = [
    { label: "Students", value: stats.totalUsers.toString(), icon: Users },
    { label: "Active Listings", value: stats.activeListings.toString(), icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('/lovable-uploads/b78b0861-a175-4fd0-835e-08d13103ea11.png')`
          }}
        />
        
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">Bazaar</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your campus marketplace for buying and selling. 
            Connect with fellow students and make campus life easier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <ShoppingCart size={20} className="mr-2" />
                Browse Marketplace
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 bg-transparent">
                Join Bazaar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
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
                  <div className="h-48 bg-gray-100">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover rounded-t-lg"
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
      )}

      {/* Stats Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            {statsDisplay.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <stat.icon className="text-blue-600" size={32} />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Bazaar?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The easiest way to buy and sell on campus
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-blue-600" size={32} />
                </div>
                <CardTitle>Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Simple and intuitive interface designed for students</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-green-600" size={32} />
                </div>
                <CardTitle>Campus Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Connect with verified students from your campus</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="text-blue-600" size={32} />
                </div>
                <CardTitle>Safe Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Secure transactions within your trusted campus network</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join students already using Bazaar to buy and sell on campus
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Sign Up Today
              </Button>
            </Link>
            <FeedbackButton variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" />
          </div>
        </div>
      </section>
    </div>
  );
};
