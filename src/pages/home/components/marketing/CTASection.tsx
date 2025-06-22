
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import FeedbackButton from "@/components/feedback/FeedbackButton";

export const CTASection = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join students already using Bazaar to buy and sell on campus
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Link to="/auth">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Sign Up Today
            </Button>
          </Link>
          <FeedbackButton 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent" 
          />
        </div>
      </div>
    </section>
  );
};
