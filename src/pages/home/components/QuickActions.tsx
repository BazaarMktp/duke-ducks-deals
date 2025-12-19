
import { Link } from "react-router-dom";
import { Plus, Search, Heart } from "lucide-react";

const FlipCard = ({ 
  to, 
  icon: Icon, 
  title, 
  description, 
  iconColor, 
  bgColor,
  state 
}: { 
  to: string; 
  icon: any; 
  title: string; 
  description: string; 
  iconColor: string; 
  bgColor: string;
  state?: any;
}) => {
  return (
    <Link to={to} state={state}>
      <div className="group h-24 [perspective:1000px]">
        <div className="relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          {/* Front Face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card shadow-sm [backface-visibility:hidden]">
            <div className={`${iconColor} w-10 h-10 rounded-full flex items-center justify-center`}>
              <Icon size={20} />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          </div>
          
          {/* Back Face */}
          <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${bgColor} p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]`}>
            <p className="text-primary-foreground text-center text-sm font-medium">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const QuickActions = () => {
  return (
    <section className="py-3 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-3 text-center text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
          <FlipCard
            to="/create-listing"
            icon={Plus}
            title="Create Listing"
            description="Post items you're offering"
            iconColor="bg-primary/15 text-primary"
            bgColor="bg-primary"
          />
          
          <FlipCard
            to="/create-listing"
            state={{ listingType: 'wanted' }}
            icon={Search}
            title="Create Request"
            description="Post what you're looking for"
            iconColor="bg-secondary/20 text-secondary-foreground"
            bgColor="bg-secondary"
          />
          
          <FlipCard
            to="/favorites"
            icon={Heart}
            title="Favorites"
            description="View your saved items"
            iconColor="bg-accent/25 text-accent-foreground"
            bgColor="bg-accent"
          />
        </div>
      </div>
    </section>
  );
};
