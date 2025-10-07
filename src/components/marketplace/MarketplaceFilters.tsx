
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { useAIAnalysis } from "@/hooks/useAIAnalysis";
import { useState } from 'react';
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
  const { enhancedSearch } = useAIAnalysis();
  const [isEnhancedSearch, setIsEnhancedSearch] = useState(false);

  const handleEnhancedSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsEnhancedSearch(true);
    try {
      const searchParams = await enhancedSearch(searchQuery);
      
      // Update search term to just keywords if they're different
      if (searchParams.keywords && searchParams.keywords !== searchQuery) {
        setSearchQuery(searchParams.keywords);
      }
      
    } catch (error) {
      console.error('Enhanced search failed:', error);
    } finally {
      setIsEnhancedSearch(false);
    }
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  return (
    <div>

    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder={activeListingType === 'offer' ? "Search marketplace items (try 'cheap textbooks under $50')..." : "Search wanted items..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleEnhancedSearch()}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleEnhancedSearch}
          disabled={!searchQuery.trim() || isEnhancedSearch}
          className="shrink-0"
        >
          <Sparkles className="w-4 h-4 mr-1" />
          {isEnhancedSearch ? 'Analyzing...' : 'Smart Search'}
        </Button>
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
    
    <MarketplaceTags listings={listings} onTagClick={handleTagClick} />
    </div>
  );
};

export default MarketplaceFilters;
