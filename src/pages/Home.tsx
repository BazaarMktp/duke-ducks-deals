
import { useAuth } from "@/contexts/AuthContext";
import { Dashboard } from "./home/components/Dashboard";
import { SimpleMarketingPage } from "./home/components/SimpleMarketingPage";
import { useHomeData } from "./home/hooks/useHomeData";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const { user, loading } = useAuth();
  const { featuredListings, featuredRequests, isLoading, stats } = useHomeData(user);

  // Show loading state while auth is being determined
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Bazaar Duke — Home</title>
          <meta name="description" content="Bazaar Duke connects students to buy, sell, and trade on campus." />
          <link rel="canonical" href="https://bazaar.lovable.app/home" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (user) {
    return (
      <>
        <Helmet>
          <title>Bazaar Duke — Dashboard</title>
          <meta name="description" content="Your personalized Bazaar Duke dashboard with featured listings and stats." />
          <link rel="canonical" href="https://bazaar.lovable.app/home" />
        </Helmet>
        <Dashboard 
          user={user}
          featuredListings={featuredListings}
          featuredRequests={featuredRequests}
          isLoading={isLoading}
          stats={stats}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Bazaar Duke — Home</title>
        <meta name="description" content="Explore Duke's student marketplace: browse, buy, and sell with peers." />
        <link rel="canonical" href="https://bazaar.lovable.app/home" />
      </Helmet>
      <SimpleMarketingPage stats={stats} />
    </>
  );
};

export default Home;
