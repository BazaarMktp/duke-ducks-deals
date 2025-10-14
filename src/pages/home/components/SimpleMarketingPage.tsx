
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stats } from "../types";
import { HeroSection } from "./marketing/HeroSection";
import { HowItWorksSection } from "./marketing/HowItWorksSection";
import { CategoriesSection } from "./marketing/CategoriesSection";
import { FeaturesSection } from "./marketing/FeaturesSection";
import { TestimonialsSection } from "./marketing/TestimonialsSection";
import { CTASection } from "./marketing/CTASection";
import { AnimatedSection } from "@/components/AnimatedSection";


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
    <div className="min-h-screen bg-white">
      <HeroSection stats={stats} />
      <AnimatedSection direction="up" delay={0.1}>
        <HowItWorksSection />
      </AnimatedSection>
      <AnimatedSection direction="up" delay={0.2}>
        <CategoriesSection />
      </AnimatedSection>
      <AnimatedSection direction="left" delay={0.1}>
        <FeaturesSection />
      </AnimatedSection>
      <AnimatedSection direction="right" delay={0.2}>
        <TestimonialsSection stats={stats} />
      </AnimatedSection>
      <AnimatedSection direction="up" delay={0.1}>
        <CTASection />
      </AnimatedSection>
    </div>
  );
};
