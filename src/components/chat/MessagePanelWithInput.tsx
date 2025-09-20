import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from './types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import DateSeparator from './DateSeparator';
import NewMessageIndicator from './NewMessageIndicator';
import { useLocation } from 'react-router-dom';
import { shouldShowDateSeparator } from '@/utils/timeUtils';

interface MessagePanelWithInputProps {
  selectedConversation: string | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (message: string) => void;
  onBack?: () => void;
  onLikeUpdate?: (messageId: string, newLikes: string[]) => void;
}

const MessagePanelWithInput: React.FC<MessagePanelWithInputProps> = ({
  selectedConversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  onLikeUpdate,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);
  const location = useLocation();
  const [initialMessage, setInitialMessage] = useState<string>('');

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  };

  useEffect(() => {
    // Check if we have an initial message from navigation state
    if (location.state?.initialMessage && location.state?.conversationId === selectedConversation) {
      setInitialMessage(location.state.initialMessage);
      // Clear the navigation state to prevent re-populating on future visits
      window.history.replaceState({}, document.title);
    }
  }, [location.state, selectedConversation]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive or conversation changes
    if (messages.length > 0) {
      // For first load, scroll immediately to show latest messages
      if (isFirstLoad.current) {
        setTimeout(() => scrollToBottom(), 100);
      } 
      // For new messages, scroll smoothly
      else if (messages.length > previousMessagesLength.current) {
        scrollToBottom();
      }
    }
    
    // Update the previous length and mark that we've loaded at least once
    previousMessagesLength.current = messages.length;
    isFirstLoad.current = false;
  }, [messages]);

  // Reset first load flag when conversation changes
  useEffect(() => {
    isFirstLoad.current = true;
    previousMessagesLength.current = 0;
  }, [selectedConversation]);

  const handleSendMessage = (message: string) => {
    onSendMessage(message);
    setInitialMessage(''); // Clear initial message after sending
  };

  // Find first unread message to show new message indicator
  const firstUnreadIndex = messages.findIndex(msg => !msg.is_read && msg.sender_id !== currentUserId);

  const renderMessages = () => {
    return messages.map((message, index) => {
      const prevMessage = index > 0 ? messages[index - 1] : undefined;
      const nextMessage = index < messages.length - 1 ? messages[index + 1] : undefined;
      
      const showDateSeparator = shouldShowDateSeparator(
        message.created_at, 
        prevMessage?.created_at
      );
      
      const showNewMessageIndicator = firstUnreadIndex === index;
      const showAvatar = !nextMessage || nextMessage.sender_id !== message.sender_id;

      return (
        <React.Fragment key={message.id}>
          {showDateSeparator && (
            <DateSeparator date={message.created_at} />
          )}
          {showNewMessageIndicator && (
            <NewMessageIndicator />
          )}
          <MessageBubble
            message={message}
            isCurrentUser={message.sender_id === currentUserId}
            showAvatar={showAvatar}
            onLikeUpdate={onLikeUpdate}
          />
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden h-full flex flex-col bg-background">
        {selectedConversation ? (
          <div className="h-full flex flex-col">
            {/* Mobile Header with Back Button */}
            <div className="flex items-center gap-3 p-4 border-b bg-background/95 backdrop-blur-sm flex-shrink-0 shadow-sm">
              <button 
                onClick={onBack}
                className="flex items-center justify-center h-10 w-10 hover:bg-muted rounded-full transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              <h2 className="font-semibold text-lg">Chat</h2>
            </div>
            
            {/* Messages Area - Flexible */}
            <div className="flex-1 overflow-y-auto bg-muted/30 relative min-h-0">
              <div className="p-4 pb-6">
                {renderMessages()}
                <div ref={messagesEndRef} className="h-1" />
              </div>
            </div>
            
            {/* Input Area - Fixed at bottom */}
            <div className="flex-shrink-0 p-4 border-t bg-background/95 backdrop-blur-sm shadow-lg">
              <MessageInput 
                onSendMessage={handleSendMessage} 
                initialMessage={initialMessage}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Your Messages</h3>
              <p className="text-muted-foreground">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <Card className="hidden md:block md:col-span-2 bg-card border rounded-lg h-full flex flex-col">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle>
            {selectedConversation ? 'Chat' : 'Select a conversation'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 min-h-0 p-0">
          {selectedConversation ? (
            <>
              {/* Messages Area - Flexible */}
              <div className="flex-1 overflow-y-auto px-4 py-2 relative min-h-0">
                {renderMessages()}
                <div ref={messagesEndRef} className="h-1" />
              </div>
              {/* Input Area - Fixed at bottom */}
              <div className="p-4 border-t bg-muted/20 flex-shrink-0">
                <MessageInput 
                  onSendMessage={handleSendMessage} 
                  initialMessage={initialMessage}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2">Your Messages</h3>
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default MessagePanelWithInput;