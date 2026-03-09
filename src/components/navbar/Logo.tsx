
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
    <Link to="/" className="flex items-center gap-2">
      <img
        src="/devils-marketplace-logo.png"
        alt="Devil's Marketplace logo"
        className="h-8 w-8"
      />
      <span className="font-bold text-xl text-foreground">Devil's Marketplace</span>
    </Link>
  );
};

export default Logo;
