
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  ShoppingCart, 
  MapPin, 
  Users, 
  Gift, 
  MessageCircle,
  LogOut,
  User,
  ListFilter,
  Heart
} from "lucide-react";

interface MobileMenuProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

const MobileMenu = ({ user, isOpen, onClose, onSignOut }: MobileMenuProps) => {
  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Housing", href: "/housing", icon: MapPin },
    { name: "Services", href: "/services", icon: Users },
    { name: "Donations", href: "/donations", icon: Gift },
    { name: "Messages", href: "/messages", icon: MessageCircle },
  ];

  // Get user's first name or fallback to profile name/email
  const getUserDisplayName = () => {
    // First try to get first name from full_name
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    // Fallback to profile_name
    if (user?.user_metadata?.profile_name) {
      return user.user_metadata.profile_name;
    }
    // Final fallback to email prefix
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  // Get user's initials for avatar fallback
  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.slice(0, 2).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 space-y-2">
      {user && (
        <div className="flex items-center space-x-2 py-2 border-b">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-700">Hi, {getUserDisplayName()}</span>
        </div>
      )}
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600 transition-colors"
          onClick={onClose}
        >
          <item.icon size={16} />
          <span>{item.name}</span>
        </Link>
      ))}
      {user && (
        <>
          <Link
            to="/profile"
            className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={onClose}
          >
            <User size={16} />
            <span>Profile</span>
          </Link>
          <Link
            to="/my-listings"
            className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={onClose}
          >
            <ListFilter size={16} />
            <span>My Listings</span>
          </Link>
          <Link
            to="/favorites"
            className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={onClose}
          >
            <Heart size={16} />
            <span>Favorites</span>
          </Link>
          <Link
            to="/cart"
            className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={onClose}
          >
            <ShoppingCart size={16} />
            <span>Cart</span>
          </Link>
        </>
      )}
      <div className="pt-4 space-y-2">
        {user ? (
          <Button variant="outline" className="w-full" onClick={onSignOut}>
            <LogOut size={16} className="mr-2" />
            Sign Out
          </Button>
        ) : (
          <>
            <Link to="/auth" onClick={onClose}>
              <Button variant="outline" className="w-full">Login</Button>
            </Link>
            <Link to="/auth" onClick={onClose}>
              <Button className="w-full">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
