import React, { useRef, useEffect, useState } from 'react';
import { Message } from './types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import DateSeparator from './DateSeparator';
import NewMessageIndicator from './NewMessageIndicator';
import { useLocation } from 'react-router-dom';
import { shouldShowDateSeparator } from '@/utils/timeUtils';
import { ArrowLeft, MessageCircle, MoreVertical } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import { Button } from '@/components/ui/button';

interface MessagePanelWithInputProps {
  selectedConversation: string | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (message: string, attachments?: any[]) => void;
  onBack?: () => void;
  onLikeUpdate?: (messageId: string, newLikes: string[]) => void;
  renderMode?: 'mobile' | 'desktop';
  conversationData?: {
    buyer_id: string;
    seller_id: string;
    buyer_profile?: { profile_name?: string; avatar_url?: string };
    seller_profile?: { profile_name?: string; avatar_url?: string };
    listings?: { title?: string } | null;
  } | null;
}

const MessagePanelWithInput: React.FC<MessagePanelWithInputProps> = ({
  selectedConversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
  onLikeUpdate,
  renderMode = 'mobile',
  conversationData,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef<number>(0);
  const isFirstLoad = useRef<boolean>(true);
  const location = useLocation();
  const [initialMessage, setInitialMessage] = useState<string>('');

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  useEffect(() => {
    // Check if we have an initial message from navigation state
    if (location.state?.initialMessage && location.state?.conversationId === selectedConversation) {
      setInitialMessage(location.state.initialMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location.state, selectedConversation]);

  useEffect(() => {
    if (messages.length > 0) {
      if (isFirstLoad.current) {
        // Instant scroll on first load
        setTimeout(() => scrollToBottom('auto'), 50);
      } else if (messages.length > previousMessagesLength.current) {
        // Smooth scroll for new messages
        scrollToBottom('smooth');
      }
    }
    
    previousMessagesLength.current = messages.length;
    isFirstLoad.current = false;
  }, [messages]);

  useEffect(() => {
    isFirstLoad.current = true;
    previousMessagesLength.current = 0;
  }, [selectedConversation]);

  const handleSendMessage = (message: string, attachments?: any[]) => {
    onSendMessage(message, attachments);
    setInitialMessage('');
  };

  // Get partner info
  const getPartnerInfo = () => {
    if (!conversationData) return { name: 'Chat', avatar: undefined };
    
    const isBuyer = conversationData.buyer_id === currentUserId;
    const partner = isBuyer ? conversationData.seller_profile : conversationData.buyer_profile;
    
    return {
      name: partner?.profile_name || 'User',
      avatar: partner?.avatar_url
    };
  };

  const partner = getPartnerInfo();
  const listingTitle = conversationData?.listings?.title;

  // Find first unread message
  const firstUnreadIndex = messages.findIndex(msg => !msg.is_read && msg.sender_id !== currentUserId);

  const renderMessages = () => {
    if (messages.length === 0) {
      return (
        <div className="flex items-center justify-center h-full px-6">
          <div className="max-w-sm w-full text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
              <MessageCircle size={36} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start the conversation</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {listingTitle 
                ? `Send a message about "${listingTitle}"`
                : "Say hello and start chatting!"
              }
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1.5 bg-muted rounded-full text-xs">💬 Be friendly</span>
              <span className="px-3 py-1.5 bg-muted rounded-full text-xs">🤝 Stay safe</span>
              <span className="px-3 py-1.5 bg-muted rounded-full text-xs">⚡ Respond quickly</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="px-4 py-4">
        {messages.map((message, index) => {
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
              {showDateSeparator && <DateSeparator date={message.created_at} />}
              {showNewMessageIndicator && <NewMessageIndicator />}
              <MessageBubble
                message={message}
                isCurrentUser={message.sender_id === currentUserId}
                showAvatar={showAvatar}
                onLikeUpdate={onLikeUpdate}
              />
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} className="h-1" />
      </div>
    );
  };

  // Empty state when no conversation selected
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-5">
        <MessageCircle size={40} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
      <p className="text-muted-foreground max-w-[250px]">
        Select a conversation from the list to start chatting
      </p>
    </div>
  );

  if (renderMode === 'mobile') {
    return (
      <div className="h-full flex flex-col bg-background">
        {selectedConversation ? (
          <>
            {/* Mobile Header */}
            <div className="flex items-center gap-3 px-2 py-3 border-b bg-background/95 backdrop-blur-sm flex-shrink-0 sticky top-0 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="h-10 w-10 rounded-full"
              >
                <ArrowLeft size={20} />
              </Button>
              
              <ProfileAvatar 
                profileName={partner.name}
                avatarUrl={partner.avatar}
                size="md"
              />
              
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-base truncate">{partner.name}</h2>
                {listingTitle && (
                  <p className="text-xs text-muted-foreground truncate">{listingTitle}</p>
                )}
              </div>
              
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <MoreVertical size={20} />
              </Button>
            </div>
            
            {/* Messages Area */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto bg-background min-h-0"
            >
              {renderMessages()}
            </div>
            
            {/* Input Area */}
            <div className="flex-shrink-0 p-3 pb-[max(env(safe-area-inset-bottom),12px)] border-t bg-background">
              <MessageInput 
                onSendMessage={handleSendMessage} 
                initialMessage={initialMessage}
              />
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    );
  }

  // Desktop mode
  return (
    <div className="md:col-span-2 h-full flex flex-col bg-card border rounded-xl overflow-hidden">
      {selectedConversation ? (
        <>
          {/* Desktop Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-muted/30 flex-shrink-0">
            <ProfileAvatar 
              profileName={partner.name}
              avatarUrl={partner.avatar}
              size="md"
            />
            
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate">{partner.name}</h2>
              {listingTitle && (
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  <MessageCircle size={10} />
                  {listingTitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto min-h-0"
          >
            {renderMessages()}
          </div>
          
          {/* Input Area */}
          <div className="flex-shrink-0 p-4 border-t bg-background/50">
            <MessageInput 
              onSendMessage={handleSendMessage} 
              initialMessage={initialMessage}
            />
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default MessagePanelWithInput;
