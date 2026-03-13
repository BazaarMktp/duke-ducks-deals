import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
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

const SORT_LABELS: Record<string, string> = {
  newest: "Newest",
  oldest: "Oldest",
  price_low: "Price ↑",
  price_high: "Price ↓",
};

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
    setCategoryFilter(tag === '' ? null : tag);
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
  const hasPriceFilter = hasActiveFilters;

  return (
    <div className="space-y-2 sticky top-11 sm:top-12 md:top-14 z-40 bg-background pb-1 -mx-2 px-2 sm:-mx-3 sm:px-3 md:-mx-4 md:px-4">
      {/* Search bar */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder={activeListingType === 'offer' ? "Search items..." : "Search requests..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-8 h-10 rounded-xl bg-card border-border/80 shadow-sm text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary/30 focus-visible:border-primary/40 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-full hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      
      {/* Filter controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {/* Price filter */}
        {activeListingType === 'offer' && (
          <Sheet open={showPriceSheet} onOpenChange={setShowPriceSheet}>
            <SheetTrigger asChild>
              <button 
                className={`inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-medium border transition-all shrink-0 ${
                  hasPriceFilter
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-foreground border-border/80 hover:border-primary/40'
                }`}
              >
                <SlidersHorizontal className="h-3 w-3" />
                {getCurrentPriceLabel()}
              </button>
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

        {/* Sort */}
        <div className="relative shrink-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-7 w-auto min-w-[80px] rounded-full text-[11px] font-medium bg-card border-border/80 hover:border-primary/40 transition-all gap-1 px-2.5 focus:ring-primary/30">
              <div className="flex items-center gap-1">
                <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                <span>{SORT_LABELS[sortBy] || "Sort"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              {activeListingType === 'offer' && (
                <>
                  <SelectItem value="price_low">Price: Low → High</SelectItem>
                  <SelectItem value="price_high">Price: High → Low</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Saved searches */}
        <SaveSearchDialog
          searchQuery={searchQuery}
          categoryFilter={categoryFilter}
          priceRange={priceRange}
          listingType={activeListingType}
          onApplySearch={setSearchQuery}
        />

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setCategoryFilter(null);
              setPriceRange({ min: null, max: null });
            }}
            className="inline-flex items-center gap-0.5 h-7 px-2 rounded-full text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>
      
      {/* Category tags */}
      {activeListingType === 'offer' && (
        <MarketplaceTags 
          listings={listings} 
          onTagClick={handleTagClick} 
          currentCategory={categoryFilter}
        />
      )}
    </div>
  );
};

export default MarketplaceFilters;
