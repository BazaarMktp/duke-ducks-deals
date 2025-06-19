
import { Link } from "react-router-dom";
import { 
  Home, 
  ShoppingCart, 
  MessageCircle,
  Gift
} from "lucide-react";

const Navigation = () => {
  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Donations", href: "/donations", icon: Gift },
    { name: "Messages", href: "/messages", icon: MessageCircle },
  ];

  return (
    <div className="hidden md:flex items-center space-x-6">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <item.icon size={16} />
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Navigation;
