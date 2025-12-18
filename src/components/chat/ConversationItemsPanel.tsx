import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Package, ExternalLink } from 'lucide-react';
import { useConversationItems } from '@/hooks/useConversationItems';
import { ConversationItemReference } from './types';
import { Link } from 'react-router-dom';

interface ConversationItemsPanelProps {
  conversationId: string | null;
}

const ConversationItemsPanel: React.FC<ConversationItemsPanelProps> = ({ conversationId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { itemReferences, loading, fetchItemReferences } = useConversationItems();

  useEffect(() => {
    if (conversationId) {
      fetchItemReferences(conversationId);
    }
  }, [conversationId, fetchItemReferences]);

  if (!conversationId || loading || itemReferences.length === 0) {
    return null;
  }

  const ItemCard = ({ item }: { item: ConversationItemReference }) => {
    const listing = item.listing;
    if (!listing) return null;

    const imageUrl = listing.images?.[0];
    const isSold = listing.status === 'sold';

    return (
      <Link
        to={`/marketplace/${listing.id}`}
        className={`flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors ${isSold ? 'opacity-60' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={20} className="text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{listing.title}</p>
          <div className="flex items-center gap-2">
            {listing.price !== null && (
              <span className="text-xs text-primary font-semibold">
                ${listing.price}
              </span>
            )}
            {isSold && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                Sold
              </span>
            )}
            {item.is_primary && (
              <span className="text-xs text-muted-foreground">• Original</span>
            )}
          </div>
        </div>
        <ExternalLink size={14} className="text-muted-foreground flex-shrink-0" />
      </Link>
    );
  };

  return (
    <div className="border-b bg-muted/20">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <Package size={14} />
          <span>Items ({itemReferences.length})</span>
        </div>
        {isExpanded ? (
          <ChevronUp size={16} className="text-muted-foreground" />
        ) : (
          <ChevronDown size={16} className="text-muted-foreground" />
        )}
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-3 space-y-2 max-h-48 overflow-y-auto">
          {itemReferences.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationItemsPanel;
