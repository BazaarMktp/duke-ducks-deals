
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isCurrentUser }) => {
  const [isAdminSender, setIsAdminSender] = useState(false);

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

  const senderName = isAdminSender ? 'Admin' : message.profiles?.profile_name;

  const isUnread = !message.is_read && !isCurrentUser;

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[280px] sm:max-w-xs lg:max-w-md px-4 py-3 rounded-2xl relative shadow-sm ${
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
              : isCurrentUser 
                ? 'text-primary-foreground/80' 
                : 'text-muted-foreground'
          }`}>
            {senderName}
          </p>
        )}
        <p className="text-sm leading-relaxed break-words">{message.message}</p>
        <p className={`text-xs mt-2 ${
          isCurrentUser 
            ? 'text-primary-foreground/70' 
            : 'text-muted-foreground/70'
        }`}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
