
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Message } from './types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface MessagePanelProps {
  selectedConversation: string | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (message: string) => void;
  onBack?: () => void;
}

const MessagePanel: React.FC<MessagePanelProps> = ({
  selectedConversation,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {onBack && (
            <button 
              onClick={onBack}
              className="md:hidden p-1 hover:bg-gray-100 rounded"
            >
              ←
            </button>
          )}
          {selectedConversation ? 'Chat' : 'Select a conversation'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[calc(100vh-200px)] md:h-[calc(600px-70px)]">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCurrentUser={message.sender_id === currentUserId}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t">
              <MessageInput onSendMessage={onSendMessage} />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessagePanel;
