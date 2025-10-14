
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface MarketplaceHeaderProps {
  user: any;
  activeListingType: 'offer' | 'wanted';
  onCreateListing?: () => void;
}

const MarketplaceHeader = ({ user, activeListingType, onCreateListing }: MarketplaceHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">
          {activeListingType === 'offer' ? 'Marketplace' : 'Wanted Items'}
        </h1>
        <p className="text-primary/70 mt-2">
          {activeListingType === 'offer' 
            ? 'Buy and sell with fellow Duke students — safe, verified, and made by Duke students.'
            : 'See what items Duke students are looking for'
          }
        </p>
      </div>
      
      {user && onCreateListing && (
        <Button 
          className="flex items-center gap-2"
          onClick={onCreateListing}
        >
          {activeListingType === 'offer' ? (
            <>
              <Plus size={16} />
              Create Listing
            </>
          ) : (
            <>
              <Search size={16} />
              Create Request
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default MarketplaceHeader;
