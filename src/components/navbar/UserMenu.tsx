
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, ListFilter, LogOut, Shield, Heart, ShoppingCart, MessageCircle } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

interface UserMenuProps {
  user: any;
  onSignOut: () => void;
  unreadMessages: number;
}

const UserMenu = ({ user, onSignOut, unreadMessages }: UserMenuProps) => {
  const { isAdmin } = useAdmin();

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

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.slice(0, 2).toUpperCase();
  };

  if (!user) {
    return (
      <div className="hidden md:flex items-center space-x-2">
        <Link to="/auth" state={{ from: 'login' }}>
          <Button variant="outline">Login</Button>
        </Link>
        <Link to="/auth" state={{ from: 'signup' }}>
          <Button>Sign Up</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-1">
      {user && (
        <Link to="/messages" className="relative">
          <Button variant="ghost" size="sm" className="p-2">
            <MessageCircle size={20} />
            {unreadMessages > 0 && (
              <>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
                <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                  NEW
                </span>
              </>
            )}
          </Button>
        </Link>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{getUserInitials()}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{getUserDisplayName()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center space-x-2">
              <User size={16} />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/my-listings" className="flex items-center space-x-2">
              <ListFilter size={16} />
              <span>My Listings</span>
            </Link>
          </DropdownMenuItem>
           <DropdownMenuItem asChild>
            <Link to="/messages" className="flex items-center space-x-2">
              <MessageCircle size={16} />
              <span className="flex-grow">Messages</span>
              {unreadMessages > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/favorites" className="flex items-center space-x-2">
              <Heart size={16} />
              <span>Favorites</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/cart" className="flex items-center space-x-2">
              <ShoppingCart size={16} />
              <span>Cart</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/settings" className="flex items-center space-x-2">
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin" className="flex items-center space-x-2">
                  <Shield size={16} />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onSignOut} className="flex items-center space-x-2">
            <LogOut size={16} />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;
