import React from 'react';
import { Conversation } from './types';
import ConversationItem from './ConversationItem';
import { MessageSquare, Archive } from 'lucide-react';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  currentUserId: string;
  showArchived: boolean;
  onSelectConversation: (id: string | null) => void;
  onArchiveConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  currentUserId,
  showArchived,
  onSelectConversation,
  onArchiveConversation,
  onDeleteConversation,
}) => {
  return (
    <div className="flex flex-col h-full bg-card md:border md:rounded-xl overflow-hidden">
      {/* Header - Hidden on mobile (shown in parent) */}
      <div className="hidden md:flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          {showArchived ? (
            <>
              <Archive size={18} className="text-muted-foreground" />
              Archived
            </>
          ) : (
            <>
              <MessageSquare size={18} className="text-primary" />
              Messages
            </>
          )}
        </h2>
        {conversations.length > 0 && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {conversations.length}
          </span>
        )}
      </div>
      
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              {showArchived ? (
                <Archive size={28} className="text-muted-foreground" />
              ) : (
                <MessageSquare size={28} className="text-muted-foreground" />
              )}
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {showArchived ? "No archived chats" : "No messages yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              {showArchived 
                ? "Archived conversations will appear here" 
                : "Start chatting by messaging a seller about their listing"
              }
            </p>
          </div>
        ) : (
          <div>
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                currentUserId={currentUserId}
                isSelected={selectedConversation === conv.id}
                showArchived={showArchived}
                onSelect={onSelectConversation}
                onArchive={onArchiveConversation}
                onDelete={onDeleteConversation}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
