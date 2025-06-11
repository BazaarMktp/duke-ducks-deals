
import { WelcomeSection } from "./WelcomeSection";
import { QuickActions } from "./QuickActions";
import { FeaturedItems } from "./FeaturedItems";
import { FeaturedRequests } from "./FeaturedRequests";
import { StatsSection } from "./StatsSection";
import { useHomeData } from "../hooks/useHomeData";

interface DashboardProps {
  user: any;
}

export const Dashboard = ({ user }: DashboardProps) => {
  const { featuredListings, featuredRequests, isLoading, stats } = useHomeData(user);

  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeSection user={user} />
      <QuickActions />
      <FeaturedItems featuredListings={featuredListings} isLoading={isLoading} />
      <FeaturedRequests featuredRequests={featuredRequests} />
      <StatsSection stats={stats} />
    </div>
  );
};
