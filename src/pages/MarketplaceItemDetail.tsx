import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ProductImageGallery from "@/components/marketplace/ProductImageGallery";
import ProductInfo from "@/components/marketplace/ProductInfo";
import SellerInfo from "@/components/marketplace/SellerInfo";
import ProductActions from "@/components/marketplace/ProductActions";

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
    avatar_url?: string;
    full_name?: string;
  };
}

const MarketplaceItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
          profiles!listings_user_id_fkey(profile_name, email, phone_number, avatar_url, full_name)
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
          message: "Hi, I am interested in this item"
        });

      toast({
        title: "Message sent!",
        description: "Redirecting to chat...",
      });

      navigate('/messages');

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
        <ProductImageGallery
          images={product.images}
          title={product.title}
          currentImageIndex={currentImageIndex}
          onImageChange={setCurrentImageIndex}
        />

        <div>
          <ProductInfo
            title={product.title}
            price={product.price}
            description={product.description}
          />

          <SellerInfo
            profileName={product.profiles.profile_name}
            email={product.profiles.email}
            phoneNumber={product.profiles.phone_number}
            createdAt={product.created_at}
            avatarUrl={product.profiles.avatar_url}
            fullName={product.profiles.full_name}
            isAuthenticated={!!user}
          />

          <ProductActions
            user={user}
            isFavorite={isFavorite}
            isInCart={isInCart}
            isOwnProduct={product.user_id === user?.id}
            onToggleFavorite={toggleFavorite}
            onAddToCart={addToCart}
            onStartConversation={startConversation}
          />
        </div>
      </div>
    </div>
  );
};

export default MarketplaceItemDetail;
