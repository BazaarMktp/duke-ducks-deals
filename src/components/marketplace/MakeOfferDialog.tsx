import { useState } from "react";
import { DollarSign, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useListingOffers } from "@/hooks/useListingOffers";

interface MakeOfferDialogProps {
  listingId: string;
  sellerId: string;
  listingPrice: number | null;
  listingTitle: string;
}

const MakeOfferDialog = ({ listingId, sellerId, listingPrice, listingTitle }: MakeOfferDialogProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { makeOffer } = useListingOffers(listingId);

  const suggestedOffers = listingPrice ? [
    Math.round(listingPrice * 0.8),
    Math.round(listingPrice * 0.85),
    Math.round(listingPrice * 0.9),
  ].filter(p => p > 0) : [];

  const handleSubmit = async () => {
    const offerAmount = parseFloat(amount);
    if (isNaN(offerAmount) || offerAmount <= 0) return;
    setSubmitting(true);
    const success = await makeOffer(sellerId, offerAmount, message);
    setSubmitting(false);
    if (success) {
      setOpen(false);
      setAmount("");
      setMessage("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <DollarSign size={16} />
          Make Offer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make an Offer</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1 truncate">{listingTitle}</p>
            {listingPrice && (
              <p className="text-lg font-bold">Listed at ${listingPrice}</p>
            )}
          </div>

          {suggestedOffers.length > 0 && (
            <div className="flex gap-2">
              {suggestedOffers.map(price => (
                <button
                  key={price}
                  onClick={() => setAmount(price.toString())}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    amount === price.toString()
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  ${price}
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-1.5 block">Your offer</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                min="1"
                step="1"
                placeholder="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Textarea
            placeholder="Add a message (optional)"
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={2}
            maxLength={300}
          />

          <Button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0 || submitting}
            className="w-full gap-2"
          >
            <Send size={16} />
            {submitting ? "Sending..." : `Send Offer${amount ? ` — $${amount}` : ""}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferDialog;
