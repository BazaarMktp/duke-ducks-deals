import { Check, X, DollarSign, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useListingOffers, ListingOffer } from "@/hooks/useListingOffers";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface OffersPanelProps {
  listingId: string;
  sellerId: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  countered: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  expired: 'bg-muted text-muted-foreground',
};

const OfferItem = ({ offer, isSeller, onRespond }: { 
  offer: ListingOffer; 
  isSeller: boolean; 
  onRespond: (id: string, action: 'accepted' | 'declined', counter?: number) => Promise<boolean>;
}) => {
  const [counterAmount, setCounterAmount] = useState("");
  const [showCounter, setShowCounter] = useState(false);
  const [responding, setResponding] = useState(false);

  const handleAction = async (action: 'accepted' | 'declined') => {
    setResponding(true);
    await onRespond(offer.id, action);
    setResponding(false);
  };

  const handleCounter = async () => {
    const amount = parseFloat(counterAmount);
    if (isNaN(amount) || amount <= 0) return;
    setResponding(true);
    await onRespond(offer.id, 'declined', amount);
    setResponding(false);
    setShowCounter(false);
  };

  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">
            {isSeller ? offer.buyer?.profile_name : 'Your offer'}
          </span>
          <Badge variant="secondary" className={statusColors[offer.status]}>
            {offer.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">${offer.amount}</span>
          {offer.counter_amount && (
            <>
              <ArrowRight size={14} className="text-muted-foreground" />
              <span className="font-bold text-lg text-primary">${offer.counter_amount}</span>
            </>
          )}
        </div>
        {offer.message && (
          <p className="text-sm text-muted-foreground mt-1">"{offer.message}"</p>
        )}
        <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
          <Clock size={10} />
          {formatDistanceToNow(new Date(offer.created_at), { addSuffix: true })}
        </p>
      </div>

      {isSeller && offer.status === 'pending' && (
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <Button size="sm" variant="default" onClick={() => handleAction('accepted')} disabled={responding} className="h-8 gap-1">
            <Check size={14} /> Accept
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowCounter(!showCounter)} disabled={responding} className="h-8 gap-1">
            <DollarSign size={14} /> Counter
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleAction('declined')} disabled={responding} className="h-8 gap-1 text-destructive">
            <X size={14} /> Decline
          </Button>
        </div>
      )}

      {showCounter && (
        <div className="flex items-center gap-2">
          <div className="relative">
            <DollarSign className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
            <Input
              type="number"
              value={counterAmount}
              onChange={e => setCounterAmount(e.target.value)}
              className="pl-6 h-8 w-24 text-sm"
              placeholder="0"
            />
          </div>
          <Button size="sm" onClick={handleCounter} disabled={responding} className="h-8">Send</Button>
        </div>
      )}
    </div>
  );
};

const OffersPanel = ({ listingId, sellerId }: OffersPanelProps) => {
  const { offers, loading, respondToOffer } = useListingOffers(listingId);
  const { user } = useAuth();

  if (loading || offers.length === 0) return null;

  const isSeller = user?.id === sellerId;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign size={18} className="text-primary" />
          Offers ({offers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {offers.map(offer => (
          <OfferItem
            key={offer.id}
            offer={offer}
            isSeller={isSeller}
            onRespond={respondToOffer}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default OffersPanel;
