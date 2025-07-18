
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

interface MarketplaceHeaderProps {
  user: any;
  activeListingType: 'offer' | 'wanted';
}

const MarketplaceHeader = ({ user, activeListingType }: MarketplaceHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {activeListingType === 'offer' ? 'Marketplace' : 'Wanted Items'}
        </h1>
        <p className="text-gray-600 mt-2">
          {activeListingType === 'offer' 
            ? 'Buy and sell items with fellow Duke students'
            : 'See what items Duke students are looking for'
          }
        </p>
      </div>
      
      {user && (
        <Link to="/create-listing">
          <Button className="flex items-center gap-2">
            {activeListingType === 'offer' ? (
              <>
                <Plus size={16} />
                Create Listing
              </>
            ) : (
              <>
                <Search size={16} />
                Post Request
              </>
            )}
          </Button>
        </Link>
      )}
    </div>
  );
};

export default MarketplaceHeader;
