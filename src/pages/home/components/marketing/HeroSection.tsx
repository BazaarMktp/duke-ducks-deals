
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <section className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-muted" />
      
      {/* Product cards floating around - hidden on mobile */}
      <div className="hidden lg:block absolute top-20 left-10 animate-pulse">
        <div className="bg-card rounded-xl shadow-lg p-4 w-52 border border-border">
          <img 
            src="https://images.unsplash.com/photo-1587037805535-5604dc617685?w=200&h=120&fit=crop&crop=center" 
            alt="JBL Speaker" 
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          <Badge className="bg-hot-deal text-white text-xs mb-2 rounded-full px-2 py-1">Hot deal</Badge>
          <h3 className="font-semibold text-sm text-foreground mb-1">JBL Speaker</h3>
          <p className="text-lg font-bold text-foreground">$65</p>
        </div>
      </div>
      
      <div className="hidden lg:block absolute top-32 right-16 animate-pulse delay-1000">
        <div className="bg-card rounded-xl shadow-lg p-4 w-52 border border-border">
          <img 
            src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=200&h=120&fit=crop&crop=center" 
            alt="Coffee Machine" 
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
          <Badge className="bg-hot-deal text-white text-xs mb-2 rounded-full px-2 py-1">Hot deal</Badge>
          <h3 className="font-semibold text-sm text-foreground mb-1">Coffee Machine</h3>
          <p className="text-lg font-bold text-foreground">$45</p>
        </div>
      </div>

      {/* Testimonial on left side - hidden on mobile */}
      <div className="hidden lg:block absolute top-48 left-16">
        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 max-w-xs shadow-lg border border-border">
          <blockquote className="text-sm text-foreground italic mb-2">
            "Saved $500 on textbooks this semester!"
          </blockquote>
          <cite className="text-xs text-muted-foreground">— Sarah M.</cite>
        </div>
      </div>

      {/* Stats floating card - hidden on mobile */}
      <div className="hidden lg:block absolute bottom-32 left-12">
        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">150+</div>
            <div className="text-sm text-muted-foreground">Happy Students</div>
          </div>
        </div>
      </div>

      {/* Another testimonial on right side - hidden on mobile */}
      <div className="hidden lg:block absolute bottom-48 right-12">
        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-4 max-w-xs shadow-lg border border-border">
          <blockquote className="text-sm text-foreground italic mb-2">
            "Everything I need for campus life in one place"
          </blockquote>
          <cite className="text-xs text-muted-foreground">— Alex K.</cite>
        </div>
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 pt-20 pb-16 text-center">
        {/* Mobile testimonial - visible only on mobile */}
        <div className="lg:hidden mb-8">
          <blockquote className="text-muted-foreground italic mb-2">
            "Saved $500 on textbooks this semester!"
          </blockquote>
          <cite className="text-sm text-muted-foreground">— Sarah M.</cite>
        </div>

        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-brand-blue mb-4 leading-tight">
            Buy and Sell <br />
            <span className="text-primary">Anything</span> <br />
            on Campus
          </h1>
        </div>

        {/* Email signup */}
        <div className="max-w-md mx-auto mb-8">
          <div className="flex gap-2">
            <Input 
              type="email" 
              placeholder="Email address *" 
              className="flex-1"
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Get started
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
            By entering my email and clicking "get started", I agree to receive updates from Bazaar about student deals, new products, and campus delivery. Message frequency varies. Reply STOP to unsubscribe. Terms and privacy policy.
          </p>
        </div>

        {/* Stats - responsive layout */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-sm">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>4.9/5 Student Rating</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">👥</span>
            <span>150+ Students</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🚚</span>
            <span>Same day delivery and pick up</span>
          </div>
        </div>

        {/* Mobile testimonial 2 - visible only on mobile */}
        <div className="lg:hidden mt-12">
          <blockquote className="text-muted-foreground italic mb-2">
            "Everything I need for campus life in one place"
          </blockquote>
          <cite className="text-sm text-muted-foreground">— Alex K.</cite>
        </div>
      </div>
    </section>
  );
};
