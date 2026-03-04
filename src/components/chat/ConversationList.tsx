import React, { useState, useMemo } from 'react';
import { Conversation } from './types';
import ConversationItem from './ConversationItem';
import { MessageSquare, Archive, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(conv => {
      const partner = conv.buyer_id === currentUserId ? conv.seller_profile : conv.buyer_profile;
      return (
        partner?.profile_name?.toLowerCase().includes(q) ||
        conv.last_message_preview?.toLowerCase().includes(q) ||
        conv.listings?.title?.toLowerCase().includes(q)
      );
    });
  }, [conversations, searchQuery, currentUserId]);

  return (
    <div className="flex flex-col h-full bg-card md:border md:rounded-xl overflow-hidden">
      {/* Header */}
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

      {/* Search */}
      {conversations.length > 3 && (
        <div className="px-3 py-2 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 h-9 text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              {showArchived ? (
                <Archive size={28} className="text-muted-foreground" />
              ) : searchQuery ? (
                <Search size={28} className="text-muted-foreground" />
              ) : (
                <MessageSquare size={28} className="text-muted-foreground" />
              )}
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {searchQuery ? "No results" : showArchived ? "No archived chats" : "No messages yet"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              {searchQuery
                ? "Try a different search term"
                : showArchived 
                ? "Archived conversations will appear here" 
                : "Start chatting by messaging a seller about their listing"
              }
            </p>
          </div>
        ) : (
          <div>
            {filteredConversations.map((conv) => (
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
