
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";
import MarketplaceTags from "./MarketplaceTags";
import CategoryFilter from "./CategoryFilter";
import { MarketplaceListing } from "./types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface MarketplaceFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  activeListingType: 'offer' | 'wanted';
  listings: MarketplaceListing[];
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  priceRange: { min: number | null; max: number | null };
  setPriceRange: (range: { min: number | null; max: number | null }) => void;
}

const PRICE_RANGES = [
  { label: "Any Price", min: null, max: null },
  { label: "Under $25", min: null, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100 - $250", min: 100, max: 250 },
  { label: "$250+", min: 250, max: null },
];

const MarketplaceFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  sortBy, 
  setSortBy, 
  activeListingType, 
  listings,
  categoryFilter,
  setCategoryFilter,
  priceRange,
  setPriceRange
}: MarketplaceFiltersProps) => {
  const [customPriceRange, setCustomPriceRange] = useState([0, 500]);
  const [showPriceSheet, setShowPriceSheet] = useState(false);

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handlePriceRangeSelect = (range: { min: number | null; max: number | null }) => {
    setPriceRange(range);
    setShowPriceSheet(false);
  };

  const handleCustomPriceApply = () => {
    setPriceRange({ 
      min: customPriceRange[0] === 0 ? null : customPriceRange[0], 
      max: customPriceRange[1] === 500 ? null : customPriceRange[1] 
    });
    setShowPriceSheet(false);
  };

  const getCurrentPriceLabel = () => {
    if (priceRange.min === null && priceRange.max === null) return "Price";
    if (priceRange.min === null && priceRange.max) return `Under $${priceRange.max}`;
    if (priceRange.min && priceRange.max === null) return `$${priceRange.min}+`;
    return `$${priceRange.min} - $${priceRange.max}`;
  };

  const hasActiveFilters = priceRange.min !== null || priceRange.max !== null || categoryFilter !== null;

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <CategoryFilter 
        selectedCategory={categoryFilter} 
        onCategoryChange={setCategoryFilter} 
      />

      {/* Search and Sort Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={activeListingType === 'offer' ? "Search marketplace items..." : "Search wanted items..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {/* Price Filter Button */}
        {activeListingType === 'offer' && (
          <Sheet open={showPriceSheet} onOpenChange={setShowPriceSheet}>
            <SheetTrigger asChild>
              <Button 
                variant={priceRange.min !== null || priceRange.max !== null ? "default" : "outline"} 
                className="gap-2 min-w-[120px]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {getCurrentPriceLabel()}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[400px]">
              <SheetHeader>
                <SheetTitle>Filter by Price</SheetTitle>
                <SheetDescription>Select a price range</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                {/* Quick select buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_RANGES.map((range) => (
                    <Button
                      key={range.label}
                      variant={
                        priceRange.min === range.min && priceRange.max === range.max 
                          ? "default" 
                          : "outline"
                      }
                      onClick={() => handlePriceRangeSelect(range)}
                      className="w-full"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>

                {/* Custom range slider */}
                <div className="pt-4 border-t">
                  <Label className="text-sm text-muted-foreground">Custom Range</Label>
                  <div className="mt-3 px-2">
                    <Slider
                      value={customPriceRange}
                      onValueChange={setCustomPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>${customPriceRange[0]}</span>
                      <span>${customPriceRange[1]}{customPriceRange[1] === 500 ? '+' : ''}</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleCustomPriceApply} 
                    className="w-full mt-4"
                  >
                    Apply Custom Range
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
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

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCategoryFilter(null);
              setPriceRange({ min: null, max: null });
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all filters
          </Button>
        </div>
      )}
      
      {/* Tags - only show when no category selected */}
      {activeListingType === 'offer' && !categoryFilter && (
        <MarketplaceTags listings={listings} onTagClick={handleTagClick} />
      )}
    </div>
  );
};

export default MarketplaceFilters;
