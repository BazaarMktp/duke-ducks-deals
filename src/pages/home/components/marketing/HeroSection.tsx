
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative bg-blue-600 text-white py-20">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('/lovable-uploads/b78b0861-a175-4fd0-835e-08d13103ea11.png')`
        }}
      />
      
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to <span className="text-yellow-300">Bazaar</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Your campus marketplace for buying and selling. 
          Connect with fellow students and make campus life easier.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/marketplace">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <ShoppingCart size={20} className="mr-2" />
              Browse Marketplace
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700 bg-transparent">
              Join Bazaar
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
