
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations } from "@/hooks/useConversations";
import { useMessages } from "@/hooks/useMessages";
import { useChatActions } from "@/hooks/useChatActions";

export const useChat = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { user } = useAuth();

  const {
    conversations,
    loading,
    showArchived,
    fetchConversations,
    archiveConversation,
    deleteConversation,
    toggleShowArchived,
    setConversations
  } = useConversations();

  const {
    messages,
    sendingMessage,
    sendMessage
  } = useMessages(selectedConversation);

  const { contactSupport } = useChatActions();

  useEffect(() => {
    if (user) {
      fetchConversations(showArchived);
    }
  }, [user, showArchived, fetchConversations]);

  const handleSelectConversation = (convId: string) => {
    setSelectedConversation(convId);
  };

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
    archiveConversation: handleArchiveConversation,
    deleteConversation: handleDeleteConversation,
    contactSupport,
    toggleShowArchived: handleToggleShowArchived,
  };
};
