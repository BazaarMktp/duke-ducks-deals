
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface WelcomeSectionProps {
  user: any;
}

export const WelcomeSection = ({ user }: WelcomeSectionProps) => {
  return (
    <section className="relative bg-blue-600 py-8 border-b">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: `url('/lovable-uploads/b78b0861-a175-4fd0-835e-08d13103ea11.png')`
        }}
      />
      <div className="container relative mx-auto px-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {user.user_metadata?.profile_name || user.email?.split('@')[0]}!
            </h1>
            <p className="text-blue-100 mt-2">What would you like to do today?</p>
          </div>
          <Button className="flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50">
            <Plus size={16} />
            <span>Create Listing</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
