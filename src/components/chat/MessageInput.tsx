
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
    <div className="flex gap-2">
      <Input
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        onKeyPress={handleKeyPress}
        disabled={sending}
      />
      <Button 
        onClick={handleSend} 
        disabled={!newMessage.trim() || sending}
      >
        <Send size={16} />
      </Button>
    </div>
  );
};

export default MessageInput;
