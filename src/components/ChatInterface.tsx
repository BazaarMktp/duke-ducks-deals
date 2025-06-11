
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Archive, Trash2, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
  profiles: {
    profile_name: string;
  };
}

interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string;
  archived_by_buyer: boolean;
  archived_by_seller: boolean;
  deleted_by_buyer: boolean;
  deleted_by_seller: boolean;
  listings: {
    title: string;
  };
  buyer_profile: {
    profile_name: string;
  };
  seller_profile: {
    profile_name: string;
  };
}

const ChatInterface = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showArchived, setShowArchived] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, showArchived]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async () => {
    if (!user) return;

    try {
      let query = supabase
        .from('conversations')
        .select(`
          id,
          buyer_id,
          seller_id,
          listing_id,
          archived_by_buyer,
          archived_by_seller,
          deleted_by_buyer,
          deleted_by_seller,
          listings(title),
          buyer_profile:profiles!conversations_buyer_id_fkey(profile_name),
          seller_profile:profiles!conversations_seller_id_fkey(profile_name)
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      // Filter out deleted conversations
      if (user.id) {
        // If user is buyer and has deleted the conversation, exclude it
        query = query.not('and', `buyer_id.eq.${user.id},deleted_by_buyer.eq.true`);
        // If user is seller and has deleted the conversation, exclude it
        query = query.not('and', `seller_id.eq.${user.id},deleted_by_seller.eq.true`);
      }

      // Filter archived conversations based on toggle
      if (!showArchived && user.id) {
        // If user is buyer and has archived the conversation, exclude it from active view
        query = query.not('and', `buyer_id.eq.${user.id},archived_by_buyer.eq.true`);
        // If user is seller and has archived the conversation, exclude it from active view  
        query = query.not('and', `seller_id.eq.${user.id},archived_by_seller.eq.true`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedConversation) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          message,
          sender_id,
          created_at,
          profiles!messages_sender_id_fkey(profile_name)
        `)
        .eq('conversation_id', selectedConversation)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    if (!selectedConversation) return;

    const subscription = supabase
      .channel(`messages:conversation_id=eq.${selectedConversation}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${selectedConversation}` },
        (payload) => {
          fetchMessages(); // Refetch to get profile data
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: selectedConversation,
          sender_id: user.id,
          message: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const archiveConversation = async (conversationId: string) => {
    if (!user) return;

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const updateData = conversation.buyer_id === user.id 
        ? { archived_by_buyer: true }
        : { archived_by_seller: true };

      const { error } = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', conversationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Conversation archived successfully.",
      });

      fetchConversations();
      if (selectedConversation === conversationId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error('Error archiving conversation:', error);
      toast({
        title: "Error",
        description: "Failed to archive conversation.",
        variant: "destructive",
      });
    }
  };

  const deleteConversation = async (conversationId: string) => {
    if (!user) return;

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      if (!conversation) return;

      const updateData = conversation.buyer_id === user.id 
        ? { deleted_by_buyer: true }
        : { deleted_by_seller: true };

      const { error } = await supabase
        .from('conversations')
        .update(updateData)
        .eq('id', conversationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Conversation deleted successfully.",
      });

      fetchConversations();
      if (selectedConversation === conversationId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation.",
        variant: "destructive",
      });
    }
  };

  const isConversationArchived = (conversation: Conversation) => {
    if (!user) return false;
    return conversation.buyer_id === user.id 
      ? conversation.archived_by_buyer 
      : conversation.archived_by_seller;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Please sign in to view messages.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button
          variant={showArchived ? "default" : "outline"}
          onClick={() => setShowArchived(!showArchived)}
        >
          {showArchived ? "Show Active" : "Show Archived"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>{showArchived ? "Archived Conversations" : "Active Conversations"}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {conversations.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">
                {showArchived ? "No archived conversations" : "No conversations yet"}
              </p>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 border-b flex justify-between items-center ${
                      selectedConversation === conv.id ? 'bg-blue-50' : ''
                    } ${isConversationArchived(conv) ? 'opacity-75' : ''}`}
                  >
                    <div 
                      className="flex-1"
                      onClick={() => setSelectedConversation(conv.id)}
                    >
                      <h4 className="font-semibold">{conv.listings.title}</h4>
                      <p className="text-sm text-gray-600">
                        with {conv.buyer_id === user.id ? conv.seller_profile.profile_name : conv.buyer_profile.profile_name}
                      </p>
                      {isConversationArchived(conv) && (
                        <p className="text-xs text-gray-500">Archived</p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!isConversationArchived(conv) && (
                          <DropdownMenuItem onClick={() => archiveConversation(conv.id)}>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => deleteConversation(conv.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedConversation ? 'Chat' : 'Select a conversation'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[500px]">
            {selectedConversation ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_id === user.id ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500">Select a conversation to start chatting</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatInterface;
