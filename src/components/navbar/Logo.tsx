import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Logo = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  if (location.pathname === "/home" && !user) {
    return null;
  }

  return (
    <Link to="/" className="flex items-center gap-2 shrink-0">
      <img
        src="/devils-marketplace-logo.png"
        alt="Devil's Marketplace logo"
        className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 logo-blue"
      />
      <span className="font-bold text-sm sm:text-base md:text-xl text-primary tracking-tight leading-tight">
        Devil's Marketplace
      </span>
    </Link>
  );
};

export default Logo;
