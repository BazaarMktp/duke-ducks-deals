
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Logo = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Hide logo on home page when user is not logged in (marketing page)
  if (location.pathname === "/home" && !user) {
    return null;
  }

  return (
    <Link to="/" className="flex items-center">
      <span className="font-bold text-xl text-primary">Devils Marketplace</span>
    </Link>
  );
};

export default Logo;
