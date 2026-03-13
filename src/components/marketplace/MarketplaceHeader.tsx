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
    <div className="mb-1">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            {activeListingType === 'offer' ? 'Marketplace' : 'Wanted'}
          </h1>
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">Made by students, for students.</p>
        </div>
      
        {user && (
          <div className="flex items-center gap-1.5">
            {activeListingType === 'offer' && onSelectTemplate && (
              <QuickSellTemplates onSelectTemplate={onSelectTemplate} />
            )}
            {onCreateListing && (
              <Button 
                size="sm"
                className="flex items-center gap-1 rounded-full px-3 h-8 text-xs"
                onClick={onCreateListing}
              >
                {activeListingType === 'offer' ? (
                  <><Plus size={14} /> Sell</>
                ) : (
                  <><Search size={14} /> Request</>
                )}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplaceHeader;
