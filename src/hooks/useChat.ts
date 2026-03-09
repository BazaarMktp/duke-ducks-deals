
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
    moveConversationToTop,
    clearUnreadCount
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
      fetchConversations(showArchived, true);
    }
  }, [user, showArchived, fetchConversations]);

  const handleSelectConversation = useCallback((convId: string | null) => {
    setSelectedConversation(convId);
    // Immediately clear unread badge in the conversation list
    if (convId) {
      clearUnreadCount(convId);
    }
  }, [clearUnreadCount]);

  // Wrap sendMessage to also move conversation to top
  const sendMessage = useCallback(async (message: string, attachments?: any[]) => {
    await originalSendMessage(message, attachments);
    
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
