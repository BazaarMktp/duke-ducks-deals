
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { HeadphonesIcon } from "lucide-react";
import ConversationList from "./chat/ConversationList";
import MessagePanel from "./chat/MessagePanel";
import FeedbackButton from "./feedback/FeedbackButton";

const ChatInterface = () => {
  const {
    user,
    loading,
    conversations,
    selectedConversation,
    messages,
    showArchived,
    handleSelectConversation,
    sendMessage,
    archiveConversation,
    deleteConversation,
    contactSupport,
    toggleShowArchived,
  } = useChat();

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
        <div className="flex gap-2">
          <FeedbackButton />
          <Button
            variant="outline"
            onClick={contactSupport}
            className="flex items-center gap-2"
          >
            <HeadphonesIcon size={16} />
            Contact Support
          </Button>
          <Button
            variant={showArchived ? "default" : "outline"}
            onClick={toggleShowArchived}
          >
            {showArchived ? "Show Active" : "Show Archived"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          currentUserId={user.id}
          showArchived={showArchived}
          onSelectConversation={handleSelectConversation}
          onArchiveConversation={archiveConversation}
          onDeleteConversation={deleteConversation}
        />
        <MessagePanel
          selectedConversation={selectedConversation}
          messages={messages}
          currentUserId={user.id}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
