
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { HeadphonesIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import ConversationList from "./chat/ConversationList";
import MessagePanelWithInput from "./chat/MessagePanelWithInput";
import FeedbackButton from "./feedback/FeedbackButton";

const ChatInterface = () => {
  const location = useLocation();
  const { conversationId } = location.state || {};
  
  const {
    user,
    loading,
    conversations,
    selectedConversation,
    messages,
    showArchived,
    handleSelectConversation,
    sendMessage,
    updateMessageLikes,
    archiveConversation,
    deleteConversation,
    contactSupport,
    toggleShowArchived,
  } = useChat(conversationId);

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
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Mobile Header */}
      <div className="md:hidden border-b bg-card/50 backdrop-blur-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Messages</h1>
            <div className="flex gap-1">
              <FeedbackButton />
              <Button
                variant="ghost"
                size="sm"
                onClick={contactSupport}
                className="h-8 w-8 p-0"
              >
                <HeadphonesIcon size={14} />
              </Button>
              <Button
                variant={showArchived ? "default" : "ghost"}
                size="sm"
                onClick={toggleShowArchived}
                className="text-xs px-2 py-1 h-7"
              >
                {showArchived ? "Active" : "Archive"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block container mx-auto px-4 py-8">
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
      </div>
      
      {/* Mobile: Full screen chat interface */}
      <div className="flex-1 flex flex-col min-h-0 md:hidden">
        {selectedConversation ? (
          <MessagePanelWithInput
            selectedConversation={selectedConversation}
            messages={messages}
            currentUserId={user.id}
            onSendMessage={sendMessage}
            onLikeUpdate={updateMessageLikes}
            onBack={() => handleSelectConversation(null)}
            renderMode="mobile"
            conversationData={conversations.find(c => c.id === selectedConversation)}
          />
        ) : (
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            currentUserId={user.id}
            showArchived={showArchived}
            onSelectConversation={handleSelectConversation}
            onArchiveConversation={archiveConversation}
            onDeleteConversation={deleteConversation}
          />
        )}
      </div>
      
      {/* Desktop: Show both side by side */}
      <div className="hidden md:flex container mx-auto px-4 pb-6 flex-1 min-h-0">
        <div className="grid md:grid-cols-3 gap-6 flex-1 min-h-0">
          <ConversationList
            conversations={conversations}
            selectedConversation={selectedConversation}
            currentUserId={user.id}
            showArchived={showArchived}
            onSelectConversation={handleSelectConversation}
            onArchiveConversation={archiveConversation}
            onDeleteConversation={deleteConversation}
          />
          <MessagePanelWithInput
            selectedConversation={selectedConversation}
            messages={messages}
            currentUserId={user.id}
            onSendMessage={sendMessage}
            onLikeUpdate={updateMessageLikes}
            renderMode="desktop"
            conversationData={conversations.find(c => c.id === selectedConversation)}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
