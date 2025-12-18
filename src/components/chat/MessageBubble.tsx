import React, { useState, useEffect } from 'react';
import { Heart, AlertCircle, Check, CheckCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Message } from './types';
import { formatMessageTime } from '@/utils/timeUtils';
import { useMessageLikes } from '@/hooks/useMessageLikes';
import ProfileAvatar from './ProfileAvatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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

  // Status icon for sent messages
  const StatusIcon = () => {
    if (!isCurrentUser) return null;
    if (message.status === 'pending') {
      return <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />;
    }
    if (message.status === 'failed') {
      return <AlertCircle size={12} className="text-destructive" />;
    }
    return message.is_read ? <CheckCheck size={12} className="text-primary" /> : <Check size={12} />;
  };

  return (
    <div className={`flex items-end gap-2 mb-3 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar for other users */}
      {!isCurrentUser && showAvatar ? (
        <div className="flex-shrink-0 mb-5">
          <ProfileAvatar 
            profileName={senderName}
            avatarUrl={message.profiles?.avatar_url}
            size="sm"
          />
        </div>
      ) : !isCurrentUser ? (
        <div className="w-8" /> // Spacer when avatar is hidden
      ) : null}
      
      <div className={`flex flex-col max-w-[75%] sm:max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        {/* Sender name for non-current user */}
        {!isCurrentUser && showAvatar && senderName && (
          <span className={`text-[11px] mb-1 ml-1 font-medium ${
            isAdminSender ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            {senderName}
          </span>
        )}
        
        {/* Message bubble */}
        <div
          className={`relative px-4 py-2.5 rounded-2xl shadow-sm ${
            isCurrentUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : isUnread
              ? 'bg-accent border-2 border-primary/30 rounded-bl-md'
              : 'bg-muted rounded-bl-md'
          }`}
        >
          {/* Unread indicator */}
          {isUnread && (
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full" />
          )}
          
          {/* Message text */}
          {message.message && (
            <p className={`text-[15px] leading-relaxed break-words whitespace-pre-wrap ${
              isCurrentUser ? '' : 'text-foreground'
            }`}>
              {message.message}
            </p>
          )}
          
          {/* Image Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={`grid gap-1.5 ${message.attachments.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} ${message.message ? 'mt-2' : ''}`}>
              {message.attachments.map((attachment, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(attachment.url)}
                  className="relative overflow-hidden rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <img 
                    src={attachment.url} 
                    alt={attachment.name}
                    className="w-full h-28 object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp, status, and like button */}
        <div className={`flex items-center gap-2 mt-1 px-1 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>{formatMessageTime(message.created_at)}</span>
            <StatusIcon />
          </div>
          
          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={isLoading(message.id)}
            className={`flex items-center gap-0.5 text-[11px] rounded-full px-1.5 py-0.5 transition-all hover:bg-muted ${
              isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'
            } ${isLoading(message.id) ? 'opacity-50' : ''}`}
          >
            <Heart 
              size={11} 
              className={`transition-transform ${isLiked ? 'fill-current scale-110' : ''}`} 
            />
            {likeCount > 0 && (
              <span className="font-medium">{likeCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Image Viewer Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            ✕
          </button>
          <img 
            src={selectedImage || ''} 
            alt="Full size"
            className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageBubble;
