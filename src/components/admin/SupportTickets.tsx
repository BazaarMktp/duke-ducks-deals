
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { MessageSquare } from "lucide-react";

interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  profiles: {
    profile_name: string;
    email: string;
  };
}

interface SupportResponse {
  id: string;
  message: string;
  is_admin_response: boolean;
  created_at: string;
  responder_id: string;
}

const SupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responses, setResponses] = useState<SupportResponse[]>([]);
  const [newResponse, setNewResponse] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(`
          id,
          subject,
          message,
          status,
          priority,
          created_at,
          profiles!support_tickets_user_id_fkey(profile_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to fetch support tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchResponses = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('support_responses')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setResponses(data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
      toast.error('Failed to fetch responses');
    }
  };

  const sendResponse = async () => {
    if (!selectedTicket || !newResponse.trim()) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('support_responses')
        .insert({
          ticket_id: selectedTicket.id,
          responder_id: userData.user.id,
          message: newResponse,
          is_admin_response: true
        });

      if (error) throw error;

      // Update ticket status to in_progress
      await supabase
        .from('support_tickets')
        .update({ 
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedTicket.id);

      toast.success('Response sent successfully');
      setNewResponse("");
      fetchResponses(selectedTicket.id);
      fetchTickets();
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast.success(`Ticket ${status} successfully`);
      fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Failed to update ticket status');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading support tickets...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.subject}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{ticket.profiles?.profile_name}</div>
                    <div className="text-sm text-gray-500">{ticket.profiles?.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(ticket.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            fetchResponses(ticket.id);
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{ticket.subject}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded">
                            <p className="font-medium">Original Message:</p>
                            <p className="mt-2">{ticket.message}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              From: {ticket.profiles?.profile_name} ({ticket.profiles?.email})
                            </p>
                          </div>
                          
                          <div className="space-y-3">
                            {responses.map((response) => (
                              <div 
                                key={response.id}
                                className={`p-3 rounded ${
                                  response.is_admin_response 
                                    ? 'bg-blue-50 ml-4' 
                                    : 'bg-gray-50 mr-4'
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <p>{response.message}</p>
                                  <span className="text-xs text-gray-500">
                                    {response.is_admin_response ? 'Admin' : 'User'}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(response.created_at).toLocaleString()}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-3">
                            <Textarea
                              placeholder="Type your response..."
                              value={newResponse}
                              onChange={(e) => setNewResponse(e.target.value)}
                            />
                            <div className="flex space-x-2">
                              <Button 
                                onClick={sendResponse}
                                disabled={!newResponse.trim()}
                              >
                                Send Response
                              </Button>
                              {ticket.status !== 'closed' && (
                                <Button
                                  variant="outline"
                                  onClick={() => updateTicketStatus(ticket.id, 'closed')}
                                >
                                  Close Ticket
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {ticket.status === 'open' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTicketStatus(ticket.id, 'in_progress')}
                      >
                        Start
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SupportTickets;
