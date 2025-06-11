
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart,
  ShoppingCart,
  LogOut,
  User,
  Settings,
  ListFilter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserMenuProps {
  user: any;
  onSignOut: () => void;
}

const UserMenu = ({ user, onSignOut }: UserMenuProps) => {
  // Get user's profile name or email for greeting
  const getUserDisplayName = () => {
    if (user?.user_metadata?.profile_name) {
      return user.user_metadata.profile_name;
    }
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

  if (!user) {
    return (
      <div className="hidden md:flex space-x-2">
        <Link to="/auth">
          <Button variant="outline" size="sm">Login</Button>
        </Link>
        <Link to="/auth">
          <Button size="sm">Sign Up</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-3">
      <Link to="/favorites">
        <Button variant="ghost" size="sm">
          <Heart size={16} />
        </Button>
      </Link>
      <Link to="/cart">
        <Button variant="ghost" size="sm">
          <ShoppingCart size={16} />
        </Button>
      </Link>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Hi, {getUserDisplayName()}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center w-full">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/my-listings" className="flex items-center w-full">
                  <ListFilter size={16} className="mr-2" />
                  My Listings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center w-full">
                  <Settings size={16} className="mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onSignOut} className="flex items-center">
                <LogOut size={16} className="mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
