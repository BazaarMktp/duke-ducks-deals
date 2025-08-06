import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { User } from "./types";

interface AdminMessageDialogProps {
  user: User;
}

const AdminMessageDialog = ({ user }: AdminMessageDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { user: adminUser } = useAuth();
  const { toast } = useToast();

  const sendMessage = async () => {
    if (!adminUser || !subject.trim() || !message.trim()) return;

    setSending(true);
    try {
      // Create a support ticket as a way to send a message to the user
      // This leverages the existing support ticket system for admin-to-user communication
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          subject: `Admin Message: ${subject}`,
          message: `Message from Admin:\n\n${message}`,
          status: 'closed', // Mark as closed since this is an admin message, not a request for support
          priority: 'medium'
        });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: `Message sent successfully to ${user.profile_name}`,
      });

      // Reset form and close dialog
      setSubject("");
      setMessage("");
      setIsOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message to {user.profile_name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              placeholder="Enter message subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={sending}
            >
              Cancel
            </Button>
            <Button
              onClick={sendMessage}
              disabled={!subject.trim() || !message.trim() || sending}
            >
              {sending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminMessageDialog;