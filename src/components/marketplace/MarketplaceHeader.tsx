import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import QuickSellTemplates, { ListingTemplate } from "@/components/listings/QuickSellTemplates";

interface MarketplaceHeaderProps {
  user: any;
  activeListingType: 'offer' | 'wanted';
  onCreateListing?: () => void;
  onSelectTemplate?: (template: ListingTemplate) => void;
}

const MarketplaceHeader = ({ user, activeListingType, onCreateListing, onSelectTemplate }: MarketplaceHeaderProps) => {
  return (
    <div className="mb-2 space-y-0.5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground">
          {activeListingType === 'offer' ? 'Marketplace' : 'Wanted'}
        </h1>
      
      {user && (
        <div className="flex items-center gap-2">
          {activeListingType === 'offer' && onSelectTemplate && (
            <QuickSellTemplates onSelectTemplate={onSelectTemplate} />
          )}
          {onCreateListing && (
            <Button 
              size="sm"
              className="flex items-center gap-1.5 rounded-full px-4"
              onClick={onCreateListing}
            >
              {activeListingType === 'offer' ? (
                <><Plus size={16} /> Sell</>
              ) : (
                <><Search size={16} /> Request</>
              )}
            </Button>
          )}
        </div>
      )}
      </div>
      <p className="text-xs tracking-wide text-muted-foreground">Made by students, for students.</p>
    </div>
  );
};

export default MarketplaceHeader;
