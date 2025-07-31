
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
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>{showArchived ? "Archived Conversations" : "Active Conversations"}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto h-[calc(100vh-200px)] md:h-[calc(600px-70px)]">
        {conversations.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">
            {showArchived ? "No archived conversations" : "No conversations yet"}
          </p>
        ) : (
          <div className="space-y-2">
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
