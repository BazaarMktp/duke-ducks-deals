
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, MapPin, Users, Gift } from "lucide-react";

const Home = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const addToCart = (id: string) => {
    setCart(prev => [...prev, id]);
  };

  // Sample data - will be replaced with real data from Supabase
  const featuredProducts = [
    { id: "1", title: "Calculus Textbook", price: 45, category: "Books", image: "/placeholder.svg" },
    { id: "2", title: "Mini Fridge", price: 120, category: "Furniture", image: "/placeholder.svg" },
    { id: "3", title: "Desk Lamp", price: 25, category: "Electronics", image: "/placeholder.svg" }
  ];

  const featuredHousing = [
    { id: "1", title: "Room in East Campus", price: 800, type: "Sublease", image: "/placeholder.svg" },
    { id: "2", title: "Looking for Roommate", price: 600, type: "Roommate", image: "/placeholder.svg" }
  ];

  const featuredServices = [
    { id: "1", title: "Math Tutoring", price: 30, category: "Academic", provider: "Sarah M." },
    { id: "2", title: "Guitar Lessons", price: 25, category: "Music", provider: "Jake L." }
  ];

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
          <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
            Get Started
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <ShoppingCart className="mx-auto mb-2 text-blue-600" size={24} />
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-sm text-muted-foreground">Items Listed</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <MapPin className="mx-auto mb-2 text-green-600" size={24} />
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Housing Posts</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="mx-auto mb-2 text-purple-600" size={24} />
              <p className="text-2xl font-bold">89</p>
              <p className="text-sm text-muted-foreground">Services</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Gift className="mx-auto mb-2 text-orange-600" size={24} />
              <p className="text-2xl font-bold">2,456</p>
              <p className="text-sm text-muted-foreground">Donations</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Products */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{product.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                  <p className="text-xl font-bold text-green-600 mb-3">${product.price}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleFavorite(product.id)}
                      className={favorites.includes(product.id) ? "text-red-500" : ""}
                    >
                      <Heart size={16} className={favorites.includes(product.id) ? "fill-current" : ""} />
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(product.id)}
                      className="flex-1"
                    >
                      <ShoppingCart size={16} className="mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Housing */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Housing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredHousing.map((housing) => (
              <Card key={housing.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <img 
                    src={housing.image} 
                    alt={housing.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{housing.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">{housing.type}</p>
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

        {/* Featured Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2">{service.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-2">{service.category}</p>
                  <p className="text-sm mb-2">by {service.provider}</p>
                  <p className="text-xl font-bold text-green-600 mb-3">${service.price}/hour</p>
                  <Button className="w-full">Contact Provider</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
