
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  ShoppingCart, 
  MapPin, 
  Users, 
  Gift, 
  MessageCircle,
  Heart,
  Menu,
  X,
  User
} from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Will be managed by auth context later

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Housing", href: "/housing", icon: MapPin },
    { name: "Services", href: "/services", icon: Users },
    { name: "Donations", href: "/donations", icon: Gift },
    { name: "Messages", href: "/messages", icon: MessageCircle },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DM</span>
            </div>
            <span className="font-bold text-xl text-gray-900">Duke Marketplace</span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Heart size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <ShoppingCart size={16} />
            </Button>
            {isLoggedIn ? (
              <Button variant="ghost" size="sm">
                <User size={16} />
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Login</Button>
                <Button size="sm">Sign Up</Button>
              </div>
            )}
          </div>

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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon size={16} />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {!isLoggedIn && (
                <>
                  <Button variant="outline" className="w-full">Login</Button>
                  <Button className="w-full">Sign Up</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
