
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, MapPin, Users, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  housing_type?: string;
  images: string[];
  profiles: {
    profile_name: string;
  };
}

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Listing[]>([]);
  const [featuredHousing, setFeaturedHousing] = useState<Listing[]>([]);
  const [featuredServices, setFeaturedServices] = useState<Listing[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalListings: 0,
    housingPosts: 0,
    services: 0,
    donations: 2456
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedListings();
    fetchStats();
    if (user) {
      fetchFavorites();
      fetchCart();
    }
  }, [user]);

  const fetchFeaturedListings = async () => {
    try {
      // Fetch featured products
      const { data: products } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(profile_name)
        `)
        .eq('category', 'marketplace')
        .eq('status', 'active')
        .limit(3)
        .order('created_at', { ascending: false });

      // Fetch featured housing
      const { data: housing } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(profile_name)
        `)
        .eq('category', 'housing')
        .eq('status', 'active')
        .limit(2)
        .order('created_at', { ascending: false });

      // Fetch featured services
      const { data: services } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(profile_name)
        `)
        .eq('category', 'services')
        .eq('status', 'active')
        .limit(2)
        .order('created_at', { ascending: false });

      setFeaturedProducts(products || []);
      setFeaturedHousing(housing || []);
      setFeaturedServices(services || []);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { count: totalListings } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      const { count: housingPosts } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('category', 'housing')
        .eq('status', 'active');

      const { count: services } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('category', 'services')
        .eq('status', 'active');

      const { count: donations } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalListings: totalListings || 0,
        housingPosts: housingPosts || 0,
        services: services || 0,
        donations: donations || 2456
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFavorites = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setFavorites(data?.map(fav => fav.listing_id) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('listing_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setCart(data?.map(item => item.listing_id) || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    if (!user) return;

    try {
      if (favorites.includes(id)) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);
        setFavorites(prev => prev.filter(item => item !== id));
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: id });
        setFavorites(prev => [...prev, id]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addToCart = async (id: string) => {
    if (!user) return;

    try {
      await supabase
        .from('cart_items')
        .insert({ user_id: user.id, listing_id: id });
      setCart(prev => [...prev, id]);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <img 
          src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=400&fit=crop"
          alt="Duke University Campus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Duke Marketplace</h1>
          <p className="text-xl md:text-2xl mb-6">Buy, Sell, Share - Built for Blue Devils</p>
          {user ? (
            <Link to="/marketplace">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                Start Shopping
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <ShoppingCart className="mx-auto mb-2 text-blue-600" size={24} />
              <p className="text-2xl font-bold">{stats.totalListings}</p>
              <p className="text-sm text-muted-foreground">Items Listed</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <MapPin className="mx-auto mb-2 text-green-600" size={24} />
              <p className="text-2xl font-bold">{stats.housingPosts}</p>
              <p className="text-sm text-muted-foreground">Housing Posts</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="mx-auto mb-2 text-purple-600" size={24} />
              <p className="text-2xl font-bold">{stats.services}</p>
              <p className="text-sm text-muted-foreground">Services</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Gift className="mx-auto mb-2 text-orange-600" size={24} />
              <p className="text-2xl font-bold">{stats.donations}</p>
              <p className="text-sm text-muted-foreground">Donations</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Featured Products</h2>
              <Link to="/marketplace">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <img 
                      src={product.images?.[0] || "/placeholder.svg"} 
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">by {product.profiles?.profile_name}</p>
                    <p className="text-xl font-bold text-green-600 mb-3">${product.price}</p>
                    <div className="flex gap-2">
                      {user && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFavorite(product.id)}
                          className={favorites.includes(product.id) ? "text-red-500" : ""}
                        >
                          <Heart size={16} className={favorites.includes(product.id) ? "fill-current" : ""} />
                        </Button>
                      )}
                      {user && (
                        <Button 
                          size="sm" 
                          onClick={() => addToCart(product.id)}
                          className="flex-1"
                        >
                          <ShoppingCart size={16} className="mr-1" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Featured Housing */}
        {featuredHousing.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Featured Housing</h2>
              <Link to="/housing">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredHousing.map((housing) => (
                <Card key={housing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="p-0">
                    <img 
                      src={housing.images?.[0] || "/placeholder.svg"} 
                      alt={housing.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2">{housing.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-2">
                      {housing.housing_type?.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xl font-bold text-green-600 mb-3">${housing.price}/month</p>
                    <Button className="w-full">
                      <MapPin size={16} className="mr-1" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Featured Services */}
        {featuredServices.length > 0 && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Featured Services</h2>
              <Link to="/services">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                    <p className="text-sm mb-2">by {service.profiles?.profile_name}</p>
                    <p className="text-xl font-bold text-green-600 mb-3">${service.price}/hour</p>
                    <Button className="w-full">Contact Provider</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
