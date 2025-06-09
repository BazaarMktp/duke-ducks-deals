
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ShoppingCart, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PostingForm from "@/components/PostingForm";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  user_id: string;
  profiles: {
    profile_name: string;
  };
}

const Marketplace = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostingForm, setShowPostingForm] = useState(false);
  const { user } = useAuth();

  const categories = ["All", "Books", "Electronics", "Furniture", "Clothing", "Sports", "Other"];

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchFavorites();
      fetchCart();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(profile_name)
        `)
        .eq('category', 'marketplace')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
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
      if (!cart.includes(id)) {
        await supabase
          .from('cart_items')
          .insert({ user_id: user.id, listing_id: id });
        setCart(prev => [...prev, id]);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    // For now, we'll match all categories since we don't have a category field
    const matchesCategory = selectedCategory === "All";
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        {user && (
          <Button onClick={() => setShowPostingForm(true)}>+ Post Item</Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
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
              <p className="text-sm mb-3 line-clamp-2">{product.description}</p>
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
                    disabled={cart.includes(product.id)}
                  >
                    <ShoppingCart size={16} className="mr-1" />
                    {cart.includes(product.id) ? "In Cart" : "Add to Cart"}
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
        </div>
      )}

      {showPostingForm && (
        <PostingForm
          category="marketplace"
          onClose={() => setShowPostingForm(false)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default Marketplace;
