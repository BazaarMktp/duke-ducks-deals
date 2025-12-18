
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useChatActions } from "@/hooks/useChatActions";

export const useChat = (initialConversationId?: string) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(initialConversationId || null);
  const { user } = useAuth();

  const {
    conversations,
    loading,
    showArchived,
    fetchConversations,
    archiveConversation,
    deleteConversation,
    toggleShowArchived,
    setConversations,
    moveConversationToTop
  } = useConversations();

  const {
    messages,
    sendingMessage,
    sendMessage: originalSendMessage,
    updateMessageLikes
  } = useMessages(selectedConversation);

  const { contactSupport } = useChatActions();

  useEffect(() => {
    if (user) {
      fetchConversations(showArchived);
    }
    
    // Listen for unread message updates to refresh conversations
    const handleUnreadUpdate = () => {
      fetchConversations(showArchived);
    };
    
    window.addEventListener('unread-messages-updated', handleUnreadUpdate);
    
    return () => {
      window.removeEventListener('unread-messages-updated', handleUnreadUpdate);
    };
  }, [user, showArchived, fetchConversations]);

  const handleSelectConversation = (convId: string | null) => {
    setSelectedConversation(convId);
  };

  // Wrap sendMessage to also move conversation to top
  const sendMessage = useCallback(async (message: string, attachments?: any[]) => {
    await originalSendMessage(message, attachments);
    
    // Move the current conversation to the top after sending
    if (selectedConversation) {
      moveConversationToTop(selectedConversation, message.slice(0, 50));
    }
  }, [originalSendMessage, selectedConversation, moveConversationToTop]);

  const handleArchiveConversation = async (conversationId: string) => {
    await archiveConversation(conversationId);
    if (selectedConversation === conversationId) {
      setSelectedConversation(null);
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    await deleteConversation(conversationId);
    if (selectedConversation === conversationId) {
      setSelectedConversation(null);
    }
  };

  const handleToggleShowArchived = () => {
    toggleShowArchived();
    setSelectedConversation(null);
  };

  return {
    user,
    loading,
    conversations,
    selectedConversation,
    messages,
    showArchived,
    sendingMessage,
    handleSelectConversation,
    sendMessage,
    updateMessageLikes,
    archiveConversation: handleArchiveConversation,
    deleteConversation: handleDeleteConversation,
    contactSupport,
    toggleShowArchived: handleToggleShowArchived,
  };
};
