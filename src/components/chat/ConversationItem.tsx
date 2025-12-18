import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Archive, Trash2, MoreHorizontal, MessageCircle } from "lucide-react";
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
  const listingTitle = conversation.listings?.title;

  return (
    <div
      className={`group flex items-center gap-3 p-3 sm:p-4 transition-all cursor-pointer relative border-b border-border/50 last:border-b-0 ${
        isSelected 
          ? 'bg-primary/10 border-l-4 border-l-primary' 
          : 'hover:bg-muted/50 border-l-4 border-l-transparent'
      }`}
      onClick={() => onSelect(conversation.id)}
    >
      {/* Profile Avatar with unread indicator */}
      <div className="relative flex-shrink-0">
        <ProfileAvatar 
          profileName={partnerName}
          avatarUrl={partnerProfile?.avatar_url}
          size="md"
          showOnline={false}
        />
        {hasUnreadMessages && (
          <div className="absolute -top-1 -right-1 min-w-5 h-5 bg-primary rounded-full flex items-center justify-center px-1">
            <span className="text-[10px] font-bold text-primary-foreground">
              {conversation.unread_count! > 9 ? '9+' : conversation.unread_count}
            </span>
          </div>
        )}
      </div>

      {/* Conversation Content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <h4 className={`font-semibold text-sm truncate ${
            hasUnreadMessages ? 'text-foreground' : 'text-foreground/80'
          }`}>
            {partnerName}
          </h4>
          {conversation.last_message_at && (
            <span className={`text-[11px] flex-shrink-0 ${
              hasUnreadMessages ? 'text-primary font-semibold' : 'text-muted-foreground'
            }`}>
              {formatInstagramTime(conversation.last_message_at)}
            </span>
          )}
        </div>
        
        {/* Listing title */}
        {listingTitle && (
          <p className="text-[11px] text-muted-foreground truncate mb-0.5 flex items-center gap-1">
            <MessageCircle size={10} className="flex-shrink-0" />
            <span className="truncate">{listingTitle}</span>
          </p>
        )}
        
        {/* Last Message Preview */}
        <p className={`text-sm truncate ${
          hasUnreadMessages ? 'font-medium text-foreground/90' : 'text-muted-foreground'
        }`}>
          {conversation.last_message_preview || 'Start a conversation...'}
        </p>
      </div>
      
      {/* Action Menu - Always visible on mobile, hover on desktop */}
      <div className="flex-shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
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
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ConversationItem;
