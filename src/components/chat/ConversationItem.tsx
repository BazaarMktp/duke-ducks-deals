
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
      className={`p-4 border-b flex justify-between items-center ${
        isSelected ? 'bg-blue-50' : hasUnreadMessages ? 'bg-blue-25 border-l-4 border-blue-500' : ''
      }`}
    >
      <div 
        className="flex-1 cursor-pointer hover:bg-gray-50 rounded p-2" 
        onClick={() => onSelect(conversation.id)}
      >
        <div className="flex items-center justify-between">
          <h4 className={`font-semibold ${hasUnreadMessages ? 'text-blue-700' : ''}`}>
            {conversation.listings?.title || "Admin Message"}
          </h4>
          {hasUnreadMessages && (
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          )}
        </div>
        <p className={`text-sm ${hasUnreadMessages ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
          with {partnerName}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!showArchived && (
            <DropdownMenuItem onClick={() => onArchive(conversation.id)}>
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => onDelete(conversation.id)} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ConversationItem;
