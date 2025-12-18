import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { HeadphonesIcon, Archive, MessageSquare, Loader2 } from "lucide-react";
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={28} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Sign in to view messages</h2>
          <p className="text-muted-foreground">You need to be logged in to access your conversations.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] md:h-auto md:min-h-[calc(100vh-4rem)] bg-background">
      {/* Mobile Header - Only show when not in a conversation */}
      {!selectedConversation && (
        <div className="md:hidden border-b bg-background sticky top-0 z-20">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <MessageSquare size={22} className="text-primary" />
              Messages
            </h1>
            <div className="flex items-center gap-1">
              <FeedbackButton />
              <Button
                variant="ghost"
                size="icon"
                onClick={contactSupport}
                className="h-9 w-9"
              >
                <HeadphonesIcon size={18} />
              </Button>
              <Button
                variant={showArchived ? "default" : "ghost"}
                size="sm"
                onClick={toggleShowArchived}
                className="h-9 px-3"
              >
                <Archive size={16} className="mr-1.5" />
                {showArchived ? "Active" : "Archive"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden md:block border-b bg-background/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare size={26} className="text-primary" />
              Messages
            </h1>
            <div className="flex items-center gap-2">
              <FeedbackButton />
              <Button
                variant="outline"
                size="sm"
                onClick={contactSupport}
                className="gap-2"
              >
                <HeadphonesIcon size={16} />
                Support
              </Button>
              <Button
                variant={showArchived ? "default" : "outline"}
                size="sm"
                onClick={toggleShowArchived}
                className="gap-2"
              >
                <Archive size={16} />
                {showArchived ? "Show Active" : "Show Archived"}
              </Button>
            </div>
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
      
      {/* Desktop: Side by side layout */}
      <div className="hidden md:block flex-1 min-h-0">
        <div className="container mx-auto px-4 py-4 h-[calc(100vh-8rem)]">
          <div className="grid md:grid-cols-3 gap-4 h-full">
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
    </div>
  );
};

export default ChatInterface;
