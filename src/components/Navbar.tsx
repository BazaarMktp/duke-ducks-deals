
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
  User,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Marketplace", href: "/marketplace", icon: ShoppingCart },
    { name: "Housing", href: "/housing", icon: MapPin },
    { name: "Services", href: "/services", icon: Users },
    { name: "Donations", href: "/donations", icon: Gift },
    { name: "Messages", href: "/messages", icon: MessageCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/ab5a5857-7332-4da1-b76a-f8de90b92080.png" 
              alt="Bazaar Logo" 
              className="h-8 w-auto"
            />
            <span className="font-bold text-xl text-gray-900">Bazaar</span>
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
            {user ? (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <User size={16} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">Sign Up</Button>
                </Link>
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
              {user ? (
                <Button variant="outline" className="w-full" onClick={handleSignOut}>
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
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
