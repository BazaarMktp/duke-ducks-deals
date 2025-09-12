
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
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative ${
          isCurrentUser
            ? 'bg-blue-500 text-white'
            : isUnread
            ? 'bg-primary/10 text-foreground ring-2 ring-primary/30'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        {isUnread && (
          <div className="absolute -left-2 top-2 w-3 h-3 bg-primary rounded-full"></div>
        )}
        {!isCurrentUser && (
          <p className={`text-xs font-semibold mb-1 ${isAdminSender ? 'text-red-600' : 'text-gray-600'}`}>
            {senderName}
          </p>
        )}
        <p className="text-sm">{message.message}</p>
        <p className={`text-xs mt-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
