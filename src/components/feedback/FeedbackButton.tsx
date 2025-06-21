
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useFeedback } from "@/hooks/useFeedback";

interface FeedbackButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

const FeedbackButton = ({ 
  variant = "outline", 
  size = "sm", 
  className = "" 
}: FeedbackButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { user } = useAuth();
  const { sendFeedback, sending } = useFeedback();

  const handleSubmit = async () => {
    if (!feedback.trim()) return;
    
    const success = await sendFeedback(feedback.trim());
    if (success) {
      setFeedback("");
      setIsOpen(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey && !sending) {
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <MessageSquare size={16} className="mr-2" />
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Feedback</DialogTitle>
          <DialogDescription>
            Help us improve! Your feedback goes directly to our team.
            {user ? "" : " You can send feedback anonymously or sign in for a response."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Tell us what you think, report issues, or suggest improvements..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            onKeyDown={handleKeyPress}
            className="min-h-[120px]"
            disabled={sending}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              Ctrl+Enter to send quickly
            </p>
            <Button 
              onClick={handleSubmit}
              disabled={!feedback.trim() || sending}
              size="sm"
            >
              <Send size={14} className="mr-2" />
              {sending ? "Sending..." : "Send Feedback"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackButton;
