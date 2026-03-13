import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Logo = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (location.pathname === "/home" && !user) {
    return null;
  }

  return (
    <Link to="/" className="flex items-center gap-3 shrink-0">
      <img
        src="/devils-marketplace-logo.png"
        alt="Devil's Marketplace logo"
        className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 logo-blue"
      />
      <span className="font-bold text-lg sm:text-xl md:text-2xl text-primary tracking-tight leading-tight">
        Devil's Marketplace
      </span>
    </Link>
  );
};

export default Logo;
