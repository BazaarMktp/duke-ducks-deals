
import { useAuth } from "@/contexts/AuthContext";
import { Dashboard } from "./home/components/Dashboard";
import { MarketingPage } from "./home/components/MarketingPage";
import { useHomeData } from "./home/hooks/useHomeData";

const Home = () => {
  const { user } = useAuth();
  const { featuredListings, featuredRequests, isLoading, stats } = useHomeData(user);

  if (user) {
    return (
      <Dashboard 
        user={user}
        featuredListings={featuredListings}
        featuredRequests={featuredRequests}
        isLoading={isLoading}
        stats={stats}
      />
    );
  }

  return <MarketingPage stats={stats} />;
};

export default Home;
