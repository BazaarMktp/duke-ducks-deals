
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FeedbackButton from "@/components/feedback/FeedbackButton";

export const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-secondary to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-primary-foreground/90 leading-relaxed">
            Join students already using Bazaar to buy and sell on campus
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-scale-in">
          <Link to="/auth?mode=signup">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-lg px-8 py-4 text-lg font-semibold"
            >
              Sign Up Today
            </Button>
          </Link>
          <FeedbackButton 
            variant="outline" 
            className="border-2 border-white/80 text-white hover:bg-white hover:text-primary bg-transparent hover:scale-105 transition-all duration-300 px-6 py-3" 
          />
        </div>
        
        {/* Trust indicator */}
        <div className="mt-12 animate-fade-in">
          <p className="text-primary-foreground/70 text-sm">
            Trusted by students across campuses nationwide
          </p>
        </div>
      </div>
    </section>
  );
};
