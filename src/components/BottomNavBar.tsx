import { Link, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Plus, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { cn } from "@/lib/utils";

const BottomNavBar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useUnreadMessages();

  const hiddenRoutes = ['/auth', '/email-validation', '/reset-password', '/account-deleted'];
  if (hiddenRoutes.some(route => location.pathname.startsWith(route))) {
    return null;
  }

  const navItems = [
    { icon: Home, label: "Home", path: "/home", requiresAuth: false },
    { icon: ShoppingBag, label: "Browse", path: "/marketplace", requiresAuth: false },
    { icon: Plus, label: "Sell", path: "/create-listing", requiresAuth: true, isCenter: true },
    { icon: MessageCircle, label: "Chat", path: "/messages", requiresAuth: true, badge: unreadCount },
    { icon: User, label: "You", path: user ? "/profile" : "/auth", requiresAuth: false },
  ];

  const isActive = (path: string) => {
    if (path === "/home" && (location.pathname === "/" || location.pathname === "/home")) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <nav 
      className="bottom-nav fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border/50 no-select"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-12 px-1 safe-area-pb">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          const href = item.requiresAuth && !user ? "/auth" : item.path;
          
          if (item.isCenter) {
            return (
              <Link
                key={item.path}
                to={href}
                className="relative -mt-2.5"
                aria-label={item.label}
              >
                <div className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-150",
                  "bg-primary text-primary-foreground",
                  "active:scale-90"
                )}>
                  <Icon size={18} strokeWidth={2.5} />
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 py-1 relative",
                "transition-colors duration-150",
                active ? "text-primary" : "text-muted-foreground"
              )}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              <div className="relative">
                <Icon 
                  size={18} 
                  strokeWidth={active ? 2.5 : 1.8}
                  className={cn(active && "fill-primary/10")}
                />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1.5 min-w-[14px] h-3.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[9px] mt-0.5 leading-none",
                active ? "font-semibold" : "font-medium"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
