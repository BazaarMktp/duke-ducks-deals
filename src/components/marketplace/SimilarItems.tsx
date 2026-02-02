
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface SimilarItem {
  id: string;
  title: string;
  price: number | null;
  images: string[] | null;
}

interface SimilarItemsProps {
  currentProductId: string;
  currentProductTitle: string;
  category?: string;
}

const SimilarItems = ({ currentProductId, currentProductTitle, category }: SimilarItemsProps) => {
  const [items, setItems] = useState<SimilarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarItems = async () => {
      try {
        // Extract keywords from title for basic similarity
        const keywords = currentProductTitle
          .toLowerCase()
          .split(' ')
          .filter(word => word.length > 3)
          .slice(0, 3);

        let query = supabase
          .from('listings')
          .select('id, title, price, images')
          .eq('category', 'marketplace')
          .eq('status', 'active')
          .eq('listing_type', 'offer')
          .neq('id', currentProductId)
          .limit(4);

        // Try to find items with similar keywords in title
        if (keywords.length > 0) {
          const searchPattern = keywords.map(k => `title.ilike.%${k}%`).join(',');
          query = query.or(searchPattern);
        }

        const { data, error } = await query;

        if (error) throw error;

        // If we don't have enough similar items, fetch random recent items
        if (!data || data.length < 4) {
          const { data: fallbackData } = await supabase
            .from('listings')
            .select('id, title, price, images')
            .eq('category', 'marketplace')
            .eq('status', 'active')
            .eq('listing_type', 'offer')
            .neq('id', currentProductId)
            .order('created_at', { ascending: false })
            .limit(4);

          setItems(fallbackData || []);
        } else {
          setItems(data);
        }
      } catch (error) {
        console.error('Error fetching similar items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarItems();
  }, [currentProductId, currentProductTitle]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Similar Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-32 w-full" />
              <CardContent className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-5 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <Link key={item.id} to={`/marketplace/${item.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
              <div className="h-32 bg-muted overflow-hidden">
                {item.images && item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">No image</span>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.title}</h3>
                <p className="text-primary font-bold">
                  {item.price !== null ? `$${item.price}` : 'Free'}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarItems;
