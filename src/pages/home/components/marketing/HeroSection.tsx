
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <section className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-muted" />
      
      {/* Product cards floating around */}
      <div className="absolute top-20 left-10 animate-pulse">
        <div className="bg-card rounded-lg shadow-lg p-4 w-48">
          <div className="bg-muted rounded-md h-32 mb-3" />
          <Badge className="bg-hot-deal text-white text-xs mb-2">Hot deal</Badge>
          <h3 className="font-semibold text-sm">JBL Speaker</h3>
          <p className="text-lg font-bold">$65</p>
        </div>
      </div>
      
      <div className="absolute top-32 right-16 animate-pulse delay-1000">
        <div className="bg-card rounded-lg shadow-lg p-4 w-48">
          <div className="bg-muted rounded-md h-32 mb-3" />
          <Badge className="bg-hot-deal text-white text-xs mb-2">Hot deal</Badge>
          <h3 className="font-semibold text-sm">Coffee Machine</h3>
          <p className="text-lg font-bold">$45</p>
        </div>
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 pt-20 pb-16 text-center">
        {/* Testimonial */}
        <div className="mb-12">
          <blockquote className="text-muted-foreground italic mb-2">
            "Saved $500 on textbooks this semester!"
          </blockquote>
          <cite className="text-sm text-muted-foreground">— Sarah M.</cite>
        </div>

        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-brand-blue mb-4">
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

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span>4.9/5 Student Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👥</span>
            <span>150+ Students</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚚</span>
            <span>Same day delivery and pick up</span>
          </div>
        </div>
      </div>
    </section>
  );
};
