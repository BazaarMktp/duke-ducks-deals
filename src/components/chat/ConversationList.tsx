
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Conversation } from './types';
import ConversationItem from './ConversationItem';

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
    <Card className="md:col-span-1 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-xl">
          {showArchived ? "Archived Conversations" : "Messages"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto min-h-0">
        {conversations.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {showArchived ? "No archived conversations" : "No messages yet"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {showArchived 
                ? "Your archived conversations will appear here" 
                : "Start a conversation by messaging someone about their listing"
              }
            </p>
          </div>
        ) : (
          <div className="divide-y">
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
      </CardContent>
    </Card>
  );
};

export default ConversationList;
