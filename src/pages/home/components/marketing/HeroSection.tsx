
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  return (
    <section className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-muted" />
      
      {/* Background mock listings - behind text */}
      <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
        {/* Top left listing */}
        <div className="absolute top-20 left-16 animate-pulse opacity-70">
          <div className="bg-card rounded-xl shadow-lg p-4 w-48 border border-border">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=120&fit=crop&crop=center" 
              alt="MacBook Pro" 
              className="w-full h-28 object-cover rounded-lg mb-3"
            />
            <Badge className="bg-hot-deal text-white text-xs mb-2 rounded-full px-2 py-1">Hot deal</Badge>
            <h3 className="font-semibold text-sm text-foreground mb-1">MacBook Pro</h3>
            <p className="text-lg font-bold text-foreground">$899</p>
          </div>
        </div>

        {/* Top right listing */}
        <div className="absolute top-32 right-20 animate-pulse delay-500 opacity-70">
          <div className="bg-card rounded-xl shadow-lg p-4 w-48 border border-border">
            <img 
              src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=120&fit=crop&crop=center" 
              alt="Textbooks" 
              className="w-full h-28 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-sm text-foreground mb-1">Biology Textbook</h3>
            <p className="text-lg font-bold text-foreground">$45</p>
          </div>
        </div>

        {/* Center left listing */}
        <div className="absolute top-64 left-8 animate-pulse delay-1000 opacity-60">
          <div className="bg-card rounded-xl shadow-lg p-4 w-48 border border-border">
            <img 
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&h=120&fit=crop&crop=center" 
              alt="Coffee Mug" 
              className="w-full h-28 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-sm text-foreground mb-1">Coffee Mug Set</h3>
            <p className="text-lg font-bold text-foreground">$15</p>
          </div>
        </div>

        {/* Center right listing */}
        <div className="absolute top-56 right-12 animate-pulse delay-700 opacity-60">
          <div className="bg-card rounded-xl shadow-lg p-4 w-48 border border-border">
            <img 
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=120&fit=crop&crop=center" 
              alt="Desk Lamp" 
              className="w-full h-28 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-sm text-foreground mb-1">Desk Lamp</h3>
            <p className="text-lg font-bold text-foreground">$25</p>
          </div>
        </div>

        {/* Bottom left listing */}
        <div className="absolute bottom-40 left-20 animate-pulse delay-300 opacity-70">
          <div className="bg-card rounded-xl shadow-lg p-4 w-48 border border-border">
            <img 
              src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=120&fit=crop&crop=center" 
              alt="Sneakers" 
              className="w-full h-28 object-cover rounded-lg mb-3"
            />
            <Badge className="bg-success text-white text-xs mb-2 rounded-full px-2 py-1">Great deal</Badge>
            <h3 className="font-semibold text-sm text-foreground mb-1">Nike Sneakers</h3>
            <p className="text-lg font-bold text-foreground">$75</p>
          </div>
        </div>

        {/* Bottom right listing */}
        <div className="absolute bottom-52 right-16 animate-pulse delay-800 opacity-60">
          <div className="bg-card rounded-xl shadow-lg p-4 w-48 border border-border">
            <img 
              src="https://images.unsplash.com/photo-1721322800607-80022131f5a1?w=200&h=120&fit=crop&crop=center" 
              alt="Mini Fridge" 
              className="w-full h-28 object-cover rounded-lg mb-3"
            />
            <h3 className="font-semibold text-sm text-foreground mb-1">Mini Fridge</h3>
            <p className="text-lg font-bold text-foreground">$120</p>
          </div>
        </div>

        {/* Additional scattered listings */}
        <div className="absolute top-80 left-60 animate-pulse delay-1200 opacity-50">
          <div className="bg-card rounded-xl shadow-lg p-4 w-44 border border-border">
            <img 
              src="https://images.unsplash.com/photo-1588200908342-23b585c03e26?w=200&h=120&fit=crop&crop=center" 
              alt="Plant" 
              className="w-full h-24 object-cover rounded-lg mb-2"
            />
            <h3 className="font-semibold text-xs text-foreground mb-1">Dorm Plant</h3>
            <p className="text-sm font-bold text-foreground">$8</p>
          </div>
        </div>

        <div className="absolute top-96 right-40 animate-pulse delay-1500 opacity-50">
          <div className="bg-card rounded-xl shadow-lg p-4 w-44 border border-border">
            <img 
              src="https://images.unsplash.com/photo-1587037805535-5604dc617685?w=200&h=120&fit=crop&crop=center" 
              alt="Bluetooth Speaker" 
              className="w-full h-24 object-cover rounded-lg mb-2"
            />
            <h3 className="font-semibold text-xs text-foreground mb-1">JBL Speaker</h3>
            <p className="text-sm font-bold text-foreground">$65</p>
          </div>
        </div>
      </div>

      {/* Foreground featured items - more prominent */}
      <div className="hidden lg:block absolute inset-0 z-5">
        {/* Left side testimonial */}
        <div className="absolute top-48 left-8">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg p-4 max-w-xs shadow-xl border border-border">
            <blockquote className="text-sm text-foreground italic mb-2">
              "Saved $500 on textbooks this semester!"
            </blockquote>
            <cite className="text-xs text-muted-foreground">— Sarah M.</cite>
          </div>
        </div>

        {/* Featured JBL Speaker card */}
        <div className="absolute top-80 left-8 animate-pulse">
          <div className="bg-card rounded-xl shadow-xl p-4 w-52 border border-border ring-2 ring-primary/20">
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
        
        {/* Featured Coffee Machine card */}
        <div className="absolute top-40 right-8 animate-pulse delay-1000">
          <div className="bg-card rounded-xl shadow-xl p-4 w-52 border border-border ring-2 ring-primary/20">
            <img 
              src="https://images.unsplash.com/photo-1576175219775-c39bWxqyV10?w=200&h=120&fit=crop&crop=center" 
              alt="Coffee Machine" 
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
            <Badge className="bg-hot-deal text-white text-xs mb-2 rounded-full px-2 py-1">Hot deal</Badge>
            <h3 className="font-semibold text-sm text-foreground mb-1">Coffee Machine</h3>
            <p className="text-lg font-bold text-foreground">$45</p>
          </div>
        </div>

        {/* Bottom stats card */}
        <div className="absolute bottom-32 left-8">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg p-4 shadow-xl border border-border">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">150+</div>
              <div className="text-sm text-muted-foreground">Happy Students</div>
            </div>
          </div>
        </div>

        {/* Right side testimonial */}
        <div className="absolute bottom-32 right-8">
          <div className="bg-card/95 backdrop-blur-sm rounded-lg p-4 max-w-xs shadow-xl border border-border">
            <blockquote className="text-sm text-foreground italic mb-2">
              "Everything I need for campus life in one place"
            </blockquote>
            <cite className="text-xs text-muted-foreground">— Alex K.</cite>
          </div>
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
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-4 leading-tight">
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
