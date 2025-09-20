
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, Trash2, MoreVertical } from "lucide-react";
import { Conversation } from './types';
import ProfileAvatar from './ProfileAvatar';
import { formatInstagramTime } from '@/utils/timeUtils';

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: string;
  isSelected: boolean;
  showArchived: boolean;
  onSelect: (id: string | null) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  currentUserId,
  isSelected,
  showArchived,
  onSelect,
  onArchive,
  onDelete,
}) => {
  const partnerProfile = conversation.buyer_id === currentUserId
    ? conversation.seller_profile
    : conversation.buyer_profile;
  
  const partnerName = partnerProfile?.profile_name === 'Admin' ? 'Admin' : (partnerProfile?.profile_name || 'Unknown User');
  const hasUnreadMessages = conversation.unread_count && conversation.unread_count > 0;

  return (
    <div
      className={`flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer relative ${
        isSelected ? 'bg-muted' : ''
      }`}
      onClick={() => onSelect(conversation.id)}
    >
      {/* Profile Avatar */}
      <ProfileAvatar 
        profileName={partnerName}
        avatarUrl={partnerProfile?.avatar_url}
        size="md"
        showOnline={false}
      />

      {/* Conversation Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className={`font-semibold text-sm truncate ${
            hasUnreadMessages ? 'text-foreground' : 'text-foreground/80'
          }`}>
            {partnerName}
          </h4>
          <div className="flex items-center gap-2">
            {conversation.last_message_at && (
              <span className={`text-xs ${
                hasUnreadMessages ? 'text-primary font-medium' : 'text-muted-foreground'
              }`}>
                {formatInstagramTime(conversation.last_message_at)}
              </span>
            )}
            {hasUnreadMessages && (
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {/* Last Message Preview */}
            <p className={`text-sm truncate ${
              hasUnreadMessages ? 'font-medium text-foreground/90' : 'text-muted-foreground'
            }`}>
              {conversation.last_message_preview || 
               `About: ${conversation.listings?.title || 'Admin Message'}`}
            </p>
          </div>
          
          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 hover:opacity-100">
                <MoreVertical size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {!showArchived && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onArchive(conversation.id);
                }}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(conversation.id);
                }} 
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
