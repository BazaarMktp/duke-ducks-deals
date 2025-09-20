
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from './types';
import { formatMessageTime } from '@/utils/timeUtils';
import { useMessageLikes } from '@/hooks/useMessageLikes';
import ProfileAvatar from './ProfileAvatar';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  showAvatar?: boolean;
  onLikeUpdate?: (messageId: string, newLikes: string[]) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isCurrentUser, 
  showAvatar = true, 
  onLikeUpdate 
}) => {
  const [isAdminSender, setIsAdminSender] = useState(false);
  const { user } = useAuth();
  const { toggleLike, isLoading } = useMessageLikes();

  useEffect(() => {
    const checkIfAdmin = async () => {
      try {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', message.sender_id)
          .eq('role', 'admin');
        
        setIsAdminSender(data && data.length > 0);
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkIfAdmin();
  }, [message.sender_id]);

  const handleLike = async () => {
    if (!user) return;
    
    const newLikes = await toggleLike(message.id, message.likes);
    if (newLikes && onLikeUpdate) {
      onLikeUpdate(message.id, newLikes);
    }
  };

  const senderName = isAdminSender ? 'Admin' : message.profiles?.profile_name;
  const isUnread = !message.is_read && !isCurrentUser;
  const likes = message.likes || [];
  const isLiked = user ? likes.includes(user.id) : false;
  const likeCount = likes.length;

  return (
    <div className={`flex items-end gap-2 mb-4 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar for other users */}
      {!isCurrentUser && showAvatar && (
        <ProfileAvatar 
          profileName={senderName}
          avatarUrl={message.profiles?.avatar_url}
          size="sm"
        />
      )}
      
      <div className={`flex flex-col max-w-[280px] sm:max-w-xs lg:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-2xl relative shadow-sm break-words ${
            isCurrentUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : isUnread
              ? 'bg-accent text-accent-foreground ring-2 ring-primary/20 border-l-4 border-primary shadow-md'
              : 'bg-card text-card-foreground border rounded-bl-md'
          }`}
        >
          {isUnread && (
            <div className="absolute -left-2 top-3 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          )}
          
          {!isCurrentUser && senderName && (
            <p className={`text-xs font-medium mb-2 ${
              isAdminSender 
                ? 'text-destructive' 
                : 'text-muted-foreground'
            }`}>
              {senderName}
            </p>
          )}
          
          <p className="text-sm leading-relaxed">{message.message}</p>
        </div>

        {/* Timestamp and Like button */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(message.created_at)}
          </span>
          
          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={isLoading(message.id)}
            className={`flex items-center gap-1 text-xs rounded-full px-2 py-1 transition-all hover:bg-muted/50 ${
              isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
          >
            <Heart 
              size={12} 
              className={`transition-all ${isLiked ? 'fill-current scale-110' : ''}`} 
            />
            {likeCount > 0 && (
              <span className={`font-medium ${isLiked ? 'text-red-500' : ''}`}>
                {likeCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
