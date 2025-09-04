
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
      <img 
        src="/lovable-uploads/010f2159-7ae2-4e7e-a71a-681407407a54.png" 
        alt="Bazaar Logo" 
        className="h-12 w-auto"
      />
    </Link>
  );
};

export default Logo;
