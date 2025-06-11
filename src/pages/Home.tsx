import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, MapPin, Users, Gift, TrendingUp, MessageCircle, Plus, Loader2, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Define the structure of a listing
type Listing = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  category: 'marketplace' | 'housing' | 'services';
  images?: string[];
  user_id: string;
  created_at: string;
  featured: boolean;
  listing_type: 'offer' | 'wanted';
};

// Define the structure of a user profile
type Profile = {
  id: string;
  profile_name?: string;
  full_name?: string;
};

// Define the structure for stats
type Stats = {
  activeListings: number;
  totalUsers: number;
  totalDonations: number;
};

const Home = () => {
  const { user } = useAuth();
  const [featuredListings, setFeaturedListings] = useState<(Listing & { seller?: string })[]>([]);
  const [featuredRequests, setFeaturedRequests] = useState<(Listing & { requester?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [stats, setStats] = useState<Stats>({
    activeListings: 0,
    totalUsers: 0,
    totalDonations: 0
  });

  const categories = [
    {
      title: "Marketplace",
      description: "Buy and sell items with fellow students",
      icon: ShoppingCart,
      href: "/marketplace",
      color: "bg-blue-500"
    },
    {
      title: "Housing",
      description: "Find housing, subletting, and roommates",
      icon: MapPin,
      href: "/housing",
      color: "bg-green-500"
    },
    {
      title: "Services",
      description: "Offer or find tutoring and other services",
      icon: Users,
      href: "/services",
      color: "bg-purple-500"
    },
    {
      title: "Donations",
      description: "Donate items to those in need",
      icon: Gift,
      href: "/donations",
      color: "bg-orange-500"
    }
  ];

  // Fetch featured listings when component mounts
  useEffect(() => {
    if (user) {
      fetchFeaturedListings();
      fetchFeaturedRequests();
    }
    fetchStats();
  }, [user]);

  // Set up real-time subscription for listings updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('listings-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'listings'
        },
        (payload) => {
          console.log('Listings changed:', payload);
          // Refetch featured listings when any listing changes
          fetchFeaturedListings();
          fetchStats(); // Also update stats
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Fetch profiles for all user IDs in the listings
  useEffect(() => {
    if (featuredListings.length > 0 || featuredRequests.length > 0) {
      fetchSellerProfiles();
    }
  }, [featuredListings, featuredRequests]);

  const fetchStats = async () => {
    try {
      // Fetch active listings count
      const { count: listingsCount } = await supabase
        .from('listings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Fetch total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch donations count
      const { count: donationsCount } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true });

      setStats({
        activeListings: listingsCount || 0,
        totalUsers: usersCount || 0,
        totalDonations: donationsCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFeaturedListings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .eq('listing_type', 'offer')
        .eq('category', 'marketplace')
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setFeaturedListings(data || []);
    } catch (error) {
      console.error('Error fetching featured listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .eq('listing_type', 'wanted')
        .in('category', ['marketplace', 'housing', 'services'])
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) throw error;
      setFeaturedRequests(data || []);
    } catch (error) {
      console.error('Error fetching featured requests:', error);
    }
  };

  const fetchSellerProfiles = async () => {
    try {
      // Extract unique user IDs from both listings and requests
      const userIds = [...new Set([
        ...featuredListings.map(item => item.user_id),
        ...featuredRequests.map(item => item.user_id)
      ])];
      
      if (userIds.length === 0) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, profile_name, full_name')
        .in('id', userIds);

      if (error) throw error;

      // Create a map of user_id to profile information
      const profileMap: Record<string, Profile> = {};
      data?.forEach(profile => {
        profileMap[profile.id] = profile;
      });

      setProfiles(profileMap);
      
      // Update featuredListings with seller names
      setFeaturedListings(prev => 
        prev.map(listing => {
          const profile = profileMap[listing.user_id];
          const sellerName = profile?.profile_name || profile?.full_name || 'Unknown seller';
          return { ...listing, seller: sellerName };
        })
      );

      // Update featuredRequests with requester names
      setFeaturedRequests(prev => 
        prev.map(request => {
          const profile = profileMap[request.user_id];
          const requesterName = profile?.profile_name || profile?.full_name || 'Unknown requester';
          return { ...request, requester: requesterName };
        })
      );
    } catch (error) {
      console.error('Error fetching seller profiles:', error);
    }
  };

  const statsDisplay = [
    { label: "Active Listings", value: stats.activeListings.toString() },
    { label: "Students", value: stats.totalUsers.toString() },
    { label: "Donations", value: stats.totalDonations.toString() }
  ];

  // If user is logged in, show the dashboard view
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Welcome Section with Background Image */}
        <section className="relative bg-blue-600 py-8 border-b">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: `url('/lovable-uploads/b78b0861-a175-4fd0-835e-08d13103ea11.png')`
            }}
          />
          <div className="container relative mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, {user.user_metadata?.profile_name || user.email?.split('@')[0]}!
                </h1>
                <p className="text-blue-100 mt-2">What would you like to do today?</p>
              </div>
              <Button className="flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50">
                <Plus size={16} />
                <span>Create Listing</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <Link key={index} to={category.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <category.icon className="text-white" size={24} />
                      </div>
                      <h3 className="font-semibold text-sm">{category.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Items */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Featured Marketplace Items</h2>
              <Link to="/marketplace">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : featuredListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-gray-500">No marketplace items available at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredListings.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-100">
                      {item.images && item.images.length > 0 ? (
                        <img 
                          src={item.images[0]} 
                          alt={item.title}
                          className="w-full h-full object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                      <p className="text-blue-600 font-bold mb-1">
                        {item.price !== undefined ? `$${item.price.toFixed(2)}` : 'Contact for price'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description || 'No description available'}</p>
                      <p className="text-sm text-gray-500">by {item.seller || 'Unknown'}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Requests */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Requests</h2>
              <div className="flex gap-2">
                <Link to="/marketplace">
                  <Button variant="outline" size="sm">Marketplace</Button>
                </Link>
                <Link to="/housing">
                  <Button variant="outline" size="sm">Housing</Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" size="sm">Services</Button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Quick Stats */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Bazaar Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {statsDisplay.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Marketing homepage for non-authenticated users
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        {/* Background Image with Opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('/lovable-uploads/b78b0861-a175-4fd0-835e-08d13103ea11.png')`
          }}
        />
        
        {/* Content */}
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to <span className="text-yellow-300">Bazaar</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your campus marketplace for buying, selling, housing, services, and donations. 
            Connect with fellow students and make campus life easier.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/marketplace">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Shopping
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Join Bazaar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsDisplay.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for campus life, all in one place
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link key={index} to={category.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <category.icon className="text-white" size={32} />
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-center">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Bazaar?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Easy to Use</h3>
              <p className="text-gray-600">Simple and intuitive interface designed for students</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Campus Community</h3>
              <p className="text-gray-600">Connect with verified students from your campus</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Give Back</h3>
              <p className="text-gray-600">Donate items to help fellow students in need</p>
            </div>
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
            Join thousands of students already using Bazaar to simplify their campus experience
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Sign Up Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
