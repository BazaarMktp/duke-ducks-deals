import { Bell, Check, CheckCheck, MessageCircle, Heart, Star, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'message': return <MessageCircle size={16} className="text-primary" />;
    case 'favorite': return <Heart size={16} className="text-red-500" />;
    case 'rating': return <Star size={16} className="text-yellow-500" />;
    case 'listing': return <Package size={16} className="text-green-500" />;
    default: return <Bell size={16} className="text-muted-foreground" />;
  }
};

const NotificationItem = ({ notification, onRead }: { notification: Notification; onRead: (id: string, link?: string | null) => void }) => (
  <button
    onClick={() => onRead(notification.id, notification.link)}
    className={`w-full text-left px-4 py-3 border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors flex items-start gap-3 ${
      !notification.is_read ? 'bg-primary/5' : ''
    }`}
  >
    <div className="mt-0.5 flex-shrink-0">
      {getNotificationIcon(notification.type)}
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm ${!notification.is_read ? 'font-semibold' : 'font-medium'} truncate`}>
        {notification.title}
      </p>
      <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
      <p className="text-[10px] text-muted-foreground mt-1">
        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
      </p>
    </div>
    {!notification.is_read && (
      <div className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0" />
    )}
  </button>
);

const NotificationCenter = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleRead = (id: string, link?: string | null) => {
    markAsRead(id);
    if (link) navigate(link);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7 gap-1">
              <CheckCheck size={14} />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              <Bell size={24} className="mx-auto mb-2 opacity-50" />
              No notifications yet
            </div>
          ) : (
            notifications.map(n => (
              <NotificationItem key={n.id} notification={n} onRead={handleRead} />
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
