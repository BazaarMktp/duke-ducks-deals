
import { Link } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
  MessageCircle,
  Percent
} from "lucide-react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const { user } = useAuth();
  const { unreadCount } = useUnreadMessages();
  
  const navigation = [
    { name: "Home", href: "/home", icon: Home, showWhenLoggedOut: true },
    { name: "Blue Devil's Marketplace", href: "/marketplace", icon: ShoppingCart, showWhenLoggedOut: true },
    { name: "Devil's Deals", href: "/devils-deals", icon: Percent, showWhenLoggedOut: true },
    { name: "Messages", href: "/messages", icon: MessageCircle, showWhenLoggedOut: false },
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
            {item.name === "Messages" && user && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
            )}
          </Link>
        ))}
    </div>
  );
};

export default Navigation;
