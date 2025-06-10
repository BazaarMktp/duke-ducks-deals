
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, MessageCircle, ArrowLeft, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  user_id: string;
  created_at: string;
  profiles: {
    profile_name: string;
    email: string;
    phone_number?: string;
  };
}

const MarketplaceItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
      if (user) {
        checkFavoriteStatus();
        checkCartStatus();
      }
    }
  }, [id, user]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles!listings_user_id_fkey(profile_name, email, phone_number)
        `)
        .eq('id', id)
        .eq('category', 'marketplace')
        .eq('status', 'active')
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to load product details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !id) return;
    
    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', id)
        .single();
      
      setIsFavorite(!!data);
    } catch (error) {
      // Not a favorite
    }
  };

  const checkCartStatus = async () => {
    if (!user || !id) return;
    
    try {
      const { data } = await supabase
        .from('cart_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('listing_id', id)
        .single();
      
      setIsInCart(!!data);
    } catch (error) {
      // Not in cart
    }
  };

  const toggleFavorite = async () => {
    if (!user || !id) return;

    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);
        setIsFavorite(false);
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, listing_id: id });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addToCart = async () => {
    if (!user || !id) return;

    try {
      await supabase
        .from('cart_items')
        .insert({ user_id: user.id, listing_id: id });
      setIsInCart(true);
      toast({
        title: "Added to cart",
        description: "Item added to your cart successfully.",
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const startConversation = async () => {
    if (!user || !product) return;

    try {
      const { data: existingConv } = await supabase
        .from('conversations')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('seller_id', product.user_id)
        .eq('listing_id', product.id)
        .single();

      let conversationId = existingConv?.id;

      if (!conversationId) {
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            buyer_id: user.id,
            seller_id: product.user_id,
            listing_id: product.id
          })
          .select('id')
          .single();

        if (convError) throw convError;
        conversationId = newConv.id;
      }

      await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          message: "I am interested in this item"
        });

      toast({
        title: "Message sent!",
        description: "Your interest has been sent to the seller.",
      });

    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/marketplace" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
        <ArrowLeft size={20} className="mr-2" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="mb-4">
            <img
              src={product.images?.[currentImageIndex] || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden ${
                    index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
          <p className="text-3xl font-bold text-green-600 mb-6">${product.price}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Seller Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User size={20} className="mr-2" />
                Seller Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{product.profiles.profile_name}</p>
              <p className="text-sm text-gray-600">{product.profiles.email}</p>
              {product.profiles.phone_number && (
                <p className="text-sm text-gray-600">{product.profiles.phone_number}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Listed on {new Date(product.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {user && (
              <Button
                variant="outline"
                onClick={toggleFavorite}
                className={isFavorite ? "text-red-500" : ""}
              >
                <Heart size={16} className={isFavorite ? "fill-current" : ""} />
              </Button>
            )}
            {user && (
              <Button 
                onClick={addToCart}
                disabled={isInCart}
                className="flex-1"
              >
                <ShoppingCart size={16} className="mr-2" />
                {isInCart ? "In Cart" : "Add to Cart"}
              </Button>
            )}
            {user && product.user_id !== user.id && (
              <Button 
                variant="outline" 
                onClick={startConversation}
              >
                <MessageCircle size={16} className="mr-2" />
                Contact Seller
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceItemDetail;
