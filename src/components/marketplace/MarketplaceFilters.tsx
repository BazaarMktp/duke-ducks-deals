import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";
import MarketplaceTags from "./MarketplaceTags";
import { MarketplaceListing } from "./types";
import { Button } from "@/components/ui/button";
import SaveSearchDialog from "./SaveSearchDialog";
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
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 – $250", min: 100, max: 250 },
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
    setSearchQuery(tag === '' ? '' : tag);
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
    return `$${priceRange.min} – $${priceRange.max}`;
  };

  const hasActiveFilters = priceRange.min !== null || priceRange.max !== null;

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={activeListingType === 'offer' ? "Search items..." : "Search requests..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-11 rounded-xl bg-muted/50 border-border/60 focus:bg-background"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Filter pills row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {activeListingType === 'offer' && (
          <Sheet open={showPriceSheet} onOpenChange={setShowPriceSheet}>
            <SheetTrigger asChild>
              <Button 
                variant={hasActiveFilters ? "default" : "outline"} 
                size="sm"
                className="rounded-full gap-1.5 text-xs shrink-0 h-8"
              >
                <SlidersHorizontal className="h-3 w-3" />
                {getCurrentPriceLabel()}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[380px] rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Filter by Price</SheetTitle>
                <SheetDescription>Select a price range</SheetDescription>
              </SheetHeader>
              <div className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_RANGES.map((range) => (
                    <Button
                      key={range.label}
                      variant={
                        priceRange.min === range.min && priceRange.max === range.max 
                          ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => handlePriceRangeSelect(range)}
                      className="w-full rounded-lg"
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
                <div className="pt-3 border-t border-border">
                  <Label className="text-xs text-muted-foreground">Custom Range</Label>
                  <div className="mt-3 px-2">
                    <Slider
                      value={customPriceRange}
                      onValueChange={setCustomPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>${customPriceRange[0]}</span>
                      <span>${customPriceRange[1]}{customPriceRange[1] === 500 ? '+' : ''}</span>
                    </div>
                  </div>
                  <Button onClick={handleCustomPriceApply} size="sm" className="w-full mt-3 rounded-lg">
                    Apply
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-auto min-w-[110px] h-8 rounded-full text-xs border-border/60">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            {activeListingType === 'offer' && (
              <>
                <SelectItem value="price_low">Price ↑</SelectItem>
                <SelectItem value="price_high">Price ↓</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>

        <SaveSearchDialog
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          priceRange={priceRange}
          listingType={activeListingType}
          onApplySearch={setSearchQuery}
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCategoryFilter(null);
              setPriceRange({ min: null, max: null });
            }}
            className="text-xs text-muted-foreground hover:text-foreground shrink-0 h-8 px-2"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      {/* Tags */}
      {activeListingType === 'offer' && (
        <MarketplaceTags 
          listings={listings} 
          onTagClick={handleTagClick} 
          currentQuery={searchQuery}
        />
      )}
    </div>
  );
};

export default MarketplaceFilters;
