import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  quantity: number;
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    images: string[];
    user_id: string;
    profiles: {
      profile_name: string;
    };
  };
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchCartItems = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          listings!inner(
            id,
            title,
            description,
            price,
            category,
            images,
            user_id,
            profiles!listings_user_id_fkey(profile_name)
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartData = data?.map(item => ({
        id: item.id,
        quantity: item.quantity,
        listing: {
          id: item.listings.id,
          title: item.listings.title,
          description: item.listings.description,
          price: item.listings.price,
          category: item.listings.category,
          images: item.listings.images || [],
          user_id: item.listings.user_id,
          profiles: item.listings.profiles
        }
      })) || [];

      setCartItems(cartData);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      toast({
        title: "Error",
        description: "Failed to load cart items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetchCartItems();

    const channel = supabase
      .channel('cart-items-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cart_items',
          filter: `user_id=eq.${user.id}`,
        },
        () => fetchCartItems()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    }
  }, [user, fetchCartItems]);

  const removeFromCart = async (cartItemId: string) => {
    try {
      await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      setCartItems(prev => prev.filter(item => item.id !== cartItemId));
      
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart.",
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      // Create conversations for each unique seller
      const sellers = [...new Set(cartItems.map(item => item.listing.user_id))];
      
      for (const sellerId of sellers) {
        const sellerItems = cartItems.filter(item => item.listing.user_id === sellerId);
        const firstItem = sellerItems[0];
        
        // Check if conversation already exists
        const { data: existingConv } = await supabase
          .from('conversations')
          .select('id')
          .eq('buyer_id', user!.id)
          .eq('seller_id', sellerId)
          .eq('listing_id', firstItem.listing.id)
          .single();

        let conversationId = existingConv?.id;

        if (!conversationId) {
          // Create new conversation
          const { data: newConv, error: convError } = await supabase
            .from('conversations')
            .insert({
              buyer_id: user!.id,
              seller_id: sellerId,
              listing_id: firstItem.listing.id
            })
            .select('id')
            .single();

          if (convError) throw convError;
          conversationId = newConv.id;
        }

        // Send message
        const itemsList = sellerItems.map(item => `- ${item.listing.title} (${item.quantity}x)`).join('\n');
        const message = `I am interested in the following items:\n${itemsList}`;

        await supabase
          .from('messages')
          .insert({
            conversation_id: conversationId,
            sender_id: user!.id,
            message
          });
      }

      // Clear cart
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user!.id);

      setCartItems([]);

      toast({
        title: "Messages sent!",
        description: "Your interest has been sent to the sellers. Check your messages for replies.",
      });

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to send messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.listing.price * item.quantity), 0);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Please sign in to view your cart.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading cart...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Your cart is empty. Start shopping to add items!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img 
                      src={item.listing.images?.[0] || "/placeholder.svg"} 
                      alt={item.listing.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{item.listing.title}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {item.listing.profiles?.profile_name}</p>
                      <Badge variant="secondary" className="mb-2">{item.listing.category}</Badge>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-green-600">${item.listing.price}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Items ({cartItems.length})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  <MessageCircle size={16} className="mr-2" />
                  Contact Sellers
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  This will send "I am interested" messages to all sellers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
