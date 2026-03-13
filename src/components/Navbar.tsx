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
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border/60 sticky top-0 z-50 safe-area-top safe-area-left safe-area-right" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="relative flex justify-between items-center h-11 sm:h-12 md:h-14">
          <Logo />
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <Navigation />
          </div>
          <div className="flex items-center gap-1.5">
            <UserMenu user={user} onSignOut={handleSignOut} unreadMessages={unreadCount} />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </Button>
          </div>
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
