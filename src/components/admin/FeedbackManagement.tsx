import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, User, UserX } from "lucide-react";

interface FeedbackTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  user_id: string;
  user_profile?: {
    profile_name: string;
    email: string;
  };
  is_anonymous: boolean;
}

const FeedbackManagement = () => {
  const [feedbackTickets, setFeedbackTickets] = useState<FeedbackTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<FeedbackTicket | null>(null);
  const [response, setResponse] = useState("");

  useEffect(() => {
    fetchFeedbackTickets();
  }, []);

  const fetchFeedbackTickets = async () => {
    try {
      // Get only feedback tickets (subject contains "Feedback")
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('support_tickets')
        .select('*')
        .or('subject.ilike.%feedback%,subject.ilike.%Feedback%')
        .order('created_at', { ascending: false });

      if (ticketsError) throw ticketsError;

      const ticketsWithProfiles = await Promise.all(
        (ticketsData || []).map(async (ticket) => {
          const isAnonymous = ticket.subject.toLowerCase().includes('anonymous');
          let profileData = null;

          if (!isAnonymous && ticket.user_id) {
            const { data } = await supabase
              .from('profiles')
              .select('profile_name, email')
              .eq('id', ticket.user_id)
              .single();
            profileData = data;
          }

          return {
            ...ticket,
            user_profile: profileData || { profile_name: 'Anonymous', email: 'Not provided' },
            is_anonymous: isAnonymous
          };
        })
      );

      setFeedbackTickets(ticketsWithProfiles);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success(`Feedback status updated to ${newStatus}`);
      fetchFeedbackTickets();
    } catch (error) {
      console.error('Error updating feedback status:', error);
      toast.error('Failed to update feedback status');
    }
  };

  const sendResponse = async () => {
    if (!selectedTicket || !response.trim()) return;

    try {
      const { error } = await supabase
        .from('support_responses')
        .insert({
          ticket_id: selectedTicket.id,
          responder_id: (await supabase.auth.getUser()).data.user?.id,
          message: response,
          is_admin_response: true
        });

      if (error) throw error;

      toast.success('Response sent successfully');
      setResponse("");
      setSelectedTicket(null);
      
      if (selectedTicket.status === 'open') {
        await updateTicketStatus(selectedTicket.id, 'reviewed');
      }
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    }
  };

  const filteredTickets = feedbackTickets.filter(ticket =>
    ticket.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.user_profile?.profile_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading feedback...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          User Feedback ({feedbackTickets.length})
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No feedback submitted yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ticket.is_anonymous ? (
                        <UserX className="h-4 w-4 text-gray-400" />
                      ) : (
                        <User className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="text-sm">
                        {ticket.is_anonymous ? 'Anonymous' : 'User'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.user_profile?.profile_name}</div>
                      {!ticket.is_anonymous && (
                        <div className="text-sm text-gray-500">{ticket.user_profile?.email}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={ticket.message}>
                      {ticket.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        ticket.status === 'open' ? 'destructive' :
                        ticket.status === 'reviewed' ? 'default' : 'secondary'
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedTicket(ticket)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            {ticket.is_anonymous ? 'Anonymous' : 'User'} Feedback
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium">Feedback:</h4>
                            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                              {ticket.message}
                            </p>
                          </div>
                          {!ticket.is_anonymous && (
                            <div>
                              <h4 className="font-medium">From:</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {ticket.user_profile?.profile_name} ({ticket.user_profile?.email})
                              </p>
                            </div>
                          )}
                          <div className="space-y-2">
                            <label htmlFor="response" className="text-sm font-medium">
                              Admin Note (Internal):
                            </label>
                            <Textarea
                              id="response"
                              placeholder="Add internal notes about this feedback..."
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              rows={3}
                            />
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={sendResponse}
                              disabled={!response.trim()}
                            >
                              Add Note
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateTicketStatus(ticket.id, 'reviewed')}
                            >
                              Mark as Reviewed
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => updateTicketStatus(ticket.id, 'closed')}
                            >
                              Archive
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackManagement;