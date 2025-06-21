
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useFeedback = () => {
  const [sending, setSending] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const sendFeedback = async (message: string): Promise<boolean> => {
    setSending(true);
    try {
      // Create a support ticket for the feedback
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user?.id || null,
          subject: user ? 'User Feedback' : 'Anonymous Feedback',
          message: message,
          priority: 'medium',
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: "Feedback sent!",
        description: "Thank you for your feedback. Our team will review it soon.",
      });

      return true;
    } catch (error) {
      console.error('Error sending feedback:', error);
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSending(false);
    }
  };

  return {
    sendFeedback,
    sending
  };
};
