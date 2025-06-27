
import { useAuth } from "@/contexts/AuthContext";
import { Dashboard } from "./home/components/Dashboard";
import { SimpleMarketingPage } from "./home/components/SimpleMarketingPage";
import { useHomeData } from "./home/hooks/useHomeData";

const Home = () => {
  const { user, loading } = useAuth();
  const { featuredListings, featuredRequests, isLoading, stats } = useHomeData(user);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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

  return <SimpleMarketingPage stats={stats} />;
};

export default Home;
