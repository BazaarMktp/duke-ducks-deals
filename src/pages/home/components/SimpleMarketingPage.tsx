
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stats } from "../types";
import { HeroSection } from "./marketing/HeroSection";
import { FeaturedProductsSection } from "./marketing/FeaturedProductsSection";
import { StatsSection } from "./marketing/StatsSection";
import { FeaturesSection } from "./marketing/FeaturesSection";
import { CTASection } from "./marketing/CTASection";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <FeaturedProductsSection featuredProducts={featuredProducts} />
      <StatsSection stats={stats} />
      <FeaturesSection />
      <CTASection />
    </div>
  );
};
