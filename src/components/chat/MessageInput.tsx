
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  initialMessage?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, initialMessage }) => {
  const [newMessage, setNewMessage] = useState(initialMessage || "");
  const [sending, setSending] = useState(false);

  // Update message when initialMessage prop changes
  React.useEffect(() => {
    if (initialMessage) {
      setNewMessage(initialMessage);
    }
  }, [initialMessage]);

  const handleSend = async () => {
    if (newMessage.trim() && !sending) {
      setSending(true);
      try {
        await onSendMessage(newMessage.trim());
        setNewMessage("");
      } finally {
        setSending(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !sending) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-3 items-center px-4">
      <div className="flex-1">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={handleKeyPress}
          disabled={sending}
          className="rounded-full border-2 px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
      </div>
      <Button 
        onClick={handleSend} 
        disabled={!newMessage.trim() || sending}
        size="icon"
        className="rounded-full h-10 w-10 shrink-0 shadow-md hover:shadow-lg transition-all"
      >
        <Send size={18} />
      </Button>
    </div>
  );
};

export default MessageInput;
