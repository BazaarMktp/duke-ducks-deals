import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Plus, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { cn } from "@/lib/utils";

const BottomNavBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useUnreadMessages();

  // Hide on auth pages
  const hiddenRoutes = ['/auth', '/email-validation', '/reset-password', '/account-deleted'];
  if (hiddenRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  const navItems = [
    { icon: Home, label: "Home", path: "/home", requiresAuth: false },
    { icon: ShoppingBag, label: "Browse", path: "/marketplace", requiresAuth: false },
    { icon: Plus, label: "Sell", path: "/create-listing", requiresAuth: true, isCenter: true },
    { icon: MessageCircle, label: "Messages", path: "/messages", requiresAuth: true, badge: unreadCount },
    { icon: User, label: "Profile", path: user ? "/profile" : "/auth", requiresAuth: false },
  ];

  const isActive = (path: string) => {
    if (path === "/home" && (location.pathname === "/" || location.pathname === "/home")) {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t border-border shadow-lg"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-16 px-2 safe-area-pb">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const href = item.requiresAuth && !user ? "/auth" : item.path;
          
          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                to={href}
                className="relative -mt-4"
                aria-label={item.label}
              >
                <div className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-200",
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                  "active:scale-95"
                )}>
                  <Icon size={24} strokeWidth={2} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-2 relative",
                "transition-colors duration-200",
                active 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <div className="relative">
                <Icon 
                  size={22} 
                  strokeWidth={active ? 2.5 : 2}
                  className="transition-all duration-200"
                />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] mt-1 font-medium",
                active && "font-semibold"
              )}>
                {item.label}
              </span>
              {active && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
