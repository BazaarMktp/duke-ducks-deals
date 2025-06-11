
import { useAuth } from "@/contexts/AuthContext";
import { Dashboard } from "./home/components/Dashboard";
import { MarketingPage } from "./home/components/MarketingPage";
import { useHomeData } from "./home/hooks/useHomeData";

const Home = () => {
  const { user } = useAuth();
  const { stats } = useHomeData(user);

  if (user) {
    return <Dashboard user={user} />;
  }

  return <MarketingPage stats={stats} />;
};

export default Home;
