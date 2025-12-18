
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Home, 
  ShoppingCart, 
  MessageCircle, 
  User, 
  Settings,
  Heart,
  Package,
  LogOut,
  Percent
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
    { name: "Devil's Deals", href: "/devils-deals", icon: Percent },
  ];

  return (
    <div className="md:hidden border-t border-border bg-background" role="menu">
      <div className="px-4 py-4 space-y-3">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-foreground">Theme</span>
          <ThemeToggle />
        </div>
        
        <Separator />
        
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center space-x-3 text-muted-foreground hover:text-primary py-2 transition-colors"
            onClick={onClose}
            role="menuitem"
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
              className="flex items-center space-x-3 text-muted-foreground hover:text-primary py-2 relative transition-colors"
              onClick={onClose}
              role="menuitem"
            >
              <MessageCircle size={20} />
              <span>Messages</span>
              {unreadMessages > 0 && (
                <>
                  <span className="bg-destructive text-destructive-foreground text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center ml-auto">
                    {unreadMessages}
                  </span>
                  <span className="absolute -top-1 left-16 bg-primary text-primary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                    NEW
                  </span>
                </>
              )}
            </Link>
            <Link
              to="/profile"
              className="flex items-center space-x-3 text-muted-foreground hover:text-primary py-2 transition-colors"
              onClick={onClose}
              role="menuitem"
            >
              <User size={20} />
              <span>Profile</span>
            </Link>
            <Link
              to="/favorites"
              className="flex items-center space-x-3 text-muted-foreground hover:text-primary py-2 transition-colors"
              onClick={onClose}
              role="menuitem"
            >
              <Heart size={20} />
              <span>Favorites</span>
            </Link>
            <Link
              to="/my-listings"
              className="flex items-center space-x-3 text-muted-foreground hover:text-primary py-2 transition-colors"
              onClick={onClose}
              role="menuitem"
            >
              <Package size={20} />
              <span>My Listings</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-3 text-muted-foreground hover:text-primary py-2 transition-colors"
              onClick={onClose}
              role="menuitem"
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
              className="w-full justify-start px-0 py-2 h-auto text-muted-foreground hover:text-destructive"
              role="menuitem"
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
