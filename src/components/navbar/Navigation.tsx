
import { Link } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
  MessageCircle
} from "lucide-react";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const Navigation = () => {
  const { unreadCount } = useUnreadMessages();
  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Messages", href: "/messages", icon: MessageCircle },
  ];

  return (
    <div className="hidden md:flex items-center space-x-6">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors relative"
        >
          <item.icon size={16} />
          <span>{item.name}</span>
          {item.name === "Messages" && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
          )}
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
