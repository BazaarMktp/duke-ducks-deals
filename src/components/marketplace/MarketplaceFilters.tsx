
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";
import MarketplaceTags from "./MarketplaceTags";
import { MarketplaceListing } from "./types";

interface MarketplaceFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  activeListingType: 'offer' | 'wanted';
  listings: MarketplaceListing[];
}

const MarketplaceFilters = ({ searchQuery, setSearchQuery, sortBy, setSortBy, activeListingType, listings }: MarketplaceFiltersProps) => {
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div>

    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder={activeListingType === 'offer' ? "Search marketplace items..." : "Search wanted items..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          {activeListingType === 'offer' && (
            <>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
    
    {activeListingType === 'offer' && (
      <MarketplaceTags listings={listings} onTagClick={handleTagClick} />
    )}
    </div>
  );
};

export default MarketplaceFilters;
