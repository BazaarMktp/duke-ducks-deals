
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
    <Link to="/" className="flex items-center gap-2.5">
      <img
        src="/devils-marketplace-logo.png"
        alt="Devil's Marketplace logo"
        className="h-10 w-10 md:h-11 md:w-11 logo-blue"
      />
      <span className="font-bold text-lg md:text-xl text-primary tracking-tight">
        Devil's Marketplace
      </span>
    </Link>
  );
};

export default Logo;
