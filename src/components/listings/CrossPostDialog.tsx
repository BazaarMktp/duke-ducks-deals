import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface CrossPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingUrl: string;
  listingTitle: string;
  listingPrice: string;
  userName: string;
}

export const CrossPostDialog = ({
  open,
  onOpenChange,
  listingUrl,
  listingTitle,
  listingPrice,
  userName
}: CrossPostDialogProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    whatsapp: false,
    facebook: false,
    dukeList: false
  });

  const shareMessage = `🎯 ${listingTitle}
💰 $${listingPrice}
📱 Posted by ${userName} on Bazaar Marketplace

Check it out: ${listingUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    toast.success('Message copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const encodedMessage = encodeURIComponent(shareMessage);
    
    // For Duke List email, create a properly formatted email URL
    const emailSubject = encodeURIComponent(`${listingTitle} - $${listingPrice}`);
    const emailBody = encodeURIComponent(shareMessage);
    
    const urls = {
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(listingUrl)}&quote=${encodedMessage}`,
      dukeList: `mailto:?subject=${emailSubject}&body=${emailBody}`
    };

    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Listing</DialogTitle>
          <DialogDescription>
            Cross-post to other Duke platforms to reach more people
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm whitespace-pre-line">{shareMessage}</p>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Message
              </>
            )}
          </Button>

          <div className="space-y-3">
            <Label className="text-base font-medium">Quick Share</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="whatsapp"
                checked={selectedPlatforms.whatsapp}
                onCheckedChange={(checked) => 
                  setSelectedPlatforms(prev => ({ ...prev, whatsapp: checked as boolean }))
                }
              />
              <Label htmlFor="whatsapp" className="flex-1">WhatsApp Groups</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('whatsapp')}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="facebook"
                checked={selectedPlatforms.facebook}
                onCheckedChange={(checked) => 
                  setSelectedPlatforms(prev => ({ ...prev, facebook: checked as boolean }))
                }
              />
              <Label htmlFor="facebook" className="flex-1">Facebook Groups</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('facebook')}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="dukeList"
                checked={selectedPlatforms.dukeList}
                onCheckedChange={(checked) => 
                  setSelectedPlatforms(prev => ({ ...prev, dukeList: checked as boolean }))
                }
              />
              <Label htmlFor="dukeList" className="flex-1">Duke List (Email)</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleShare('dukeList')}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Your listing will always show "Posted by {userName} on Bazaar Marketplace"
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
