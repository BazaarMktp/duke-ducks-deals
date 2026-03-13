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
      className="bottom-nav fixed bottom-0 left-0 right-0 z-50 lg:hidden no-select safe-area-left safe-area-right"
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Floating center action button – positioned above the bar */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-5 z-10">
        <Link
          to={navItems[2].requiresAuth && !user ? "/auth" : navItems[2].path}
          aria-label="Sell"
          className="block"
        >
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-full",
            "bg-primary text-primary-foreground",
            "shadow-[0_2px_12px_-2px_hsl(var(--primary)/0.45)]",
            "transition-transform duration-150 active:scale-90"
          )}>
            <Plus size={22} strokeWidth={2.5} />
          </div>
        </Link>
      </div>

      {/* Tab bar surface */}
      <div className="bg-background/95 backdrop-blur-xl border-t border-border/40 shadow-[0_-1px_3px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-end justify-around px-2 pt-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom,6px))]">
          {navItems.map((item) => {
            if (item.isCenter) {
              /* Invisible spacer keeping the center slot open */
              return <div key={item.path} className="flex-1" />;
            }

            const Icon = item.icon;
            const active = isActive(item.path);
            const href = item.requiresAuth && !user ? "/auth" : item.path;

            return (
              <Link
                key={item.path}
                to={href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 min-h-[44px] relative",
                  "transition-colors duration-150",
                  active ? "text-primary" : "text-muted-foreground"
                )}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                <div className="relative">
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.2 : 1.6}
                    className={cn(active && "fill-primary/10")}
                  />
                  {typeof item.badge === 'number' && item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-[16px] h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] mt-0.5 leading-none",
                  active ? "font-semibold" : "font-normal"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavBar;
