
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Home, 
  ShoppingCart, 
  MessageCircle, 
  User, 
  Settings,
  Heart,
  Package,
  LogOut
} from "lucide-react";

interface MobileMenuProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  unreadMessages: number;
}

const MobileMenu = ({ user, isOpen, onClose, onSignOut, unreadMessages }: MobileMenuProps) => {
  if (!isOpen) return null;

  const navigation = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
  ];

  return (
    <div className="md:hidden border-t bg-white">
      <div className="px-4 py-4 space-y-3">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 py-2"
            onClick={onClose}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
        
        {user && (
          <>
            <Separator className="my-4" />
            <Link
              to="/messages"
              className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 py-2 relative"
              onClick={onClose}
            >
              <MessageCircle size={20} />
              <span>Messages</span>
              {unreadMessages > 0 && (
                <span className="absolute top-1 left-3 bg-red-500 text-white text-xs rounded-full w-2 h-2"></span>
              )}
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 py-2"
              onClick={onClose}
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
            <Link
              to="/favorites"
              className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 py-2"
              onClick={onClose}
            >
              <Heart size={20} />
              <span>Favorites</span>
            </Link>
            <Link
              to="/my-listings"
              className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 py-2"
              onClick={onClose}
            >
              <Package size={20} />
              <span>My Listings</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-3 text-gray-600 hover:text-blue-600 py-2"
              onClick={onClose}
            >
              <Settings size={20} />
              <span>Settings</span>
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full justify-start px-0 py-2 h-auto text-gray-600 hover:text-red-600"
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </Button>
          </>
        )}
        
        {!user && (
          <>
            <Separator className="my-4" />
            <Link to="/auth" onClick={onClose}>
              <Button className="w-full">Sign In</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
