
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "./navbar/Logo";
import Navigation from "./navbar/Navigation";
import UserMenu from "./navbar/UserMenu";
import MobileMenu from "./navbar/MobileMenu";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { unreadCount } = useUnreadMessages();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleMobileMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="relative flex justify-between items-center h-16">
          <Logo />
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Navigation />
          </div>
          <UserMenu user={user} onSignOut={handleSignOut} unreadMessages={unreadCount} />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <MobileMenu 
          user={user}
          isOpen={isMenuOpen}
          onClose={handleMobileMenuClose}
          onSignOut={handleSignOut}
          unreadMessages={unreadCount}
        />
      </div>
    </nav>
  );
};

export default Navbar;
