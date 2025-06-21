
import { WelcomeSection } from "./WelcomeSection";
import { QuickActions } from "./QuickActions";
import { FeaturedItems } from "./FeaturedItems";
import { FeaturedRequests } from "./FeaturedRequests";
import { StatsSection } from "./StatsSection";
import { Stats, Listing } from "../types";

interface DashboardProps {
  user: any;
  featuredListings: (Listing & { seller?: string })[];
  featuredRequests: (Listing & { requester?: string })[];
  isLoading: boolean;
  stats: Stats;
}

export const Dashboard = ({ 
  user, 
  featuredListings, 
  featuredRequests, 
  isLoading, 
  stats 
}: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeSection user={user} />
      <FeaturedItems featuredListings={featuredListings} isLoading={isLoading} />
      <QuickActions />
      <FeaturedRequests featuredRequests={featuredRequests} />
      <StatsSection stats={stats} />
    </div>
  );
};
