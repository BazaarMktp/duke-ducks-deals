
import { Link } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
  Percent
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const { user } = useAuth();
  
  const navigation = [
    { name: "Home", href: "/home", icon: Home, showWhenLoggedOut: true },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart, showWhenLoggedOut: true },
    { name: "Devil's Deals", href: "/devils-deals", icon: Percent, showWhenLoggedOut: true },
  ];

  return (
    <div className="hidden md:flex items-center space-x-6">
      {navigation
        .filter(item => user || item.showWhenLoggedOut)
        .map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors relative"
          >
            <item.icon size={16} />
            <span>{item.name}</span>
          </Link>
        ))}
    </div>
  );
};

export default Navigation;
