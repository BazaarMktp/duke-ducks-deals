import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ListingTypeToggle from "@/components/services/ListingTypeToggle";
import { useMarketplace } from "@/hooks/useMarketplace";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import { UnifiedListingCreation } from "@/components/listings/UnifiedListingCreation";
import { ListingTemplate } from "@/components/listings/QuickSellTemplates";
import { Helmet } from "react-helmet-async";

const Marketplace = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeListingType, setActiveListingType] = useState<'offer' | 'wanted'>('offer');
  const [showPostingForm, setShowPostingForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ListingTemplate | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{ min: number | null; max: number | null }>({ 
    min: null, max: null 
  });

  const { 
    listings, loading, loadingMore, hasMore, favorites, toggleFavorite, loadMore
  } = useMarketplace(user, searchQuery, sortBy, activeListingType, categoryFilter, priceRange);

  const handleSelectTemplate = (template: ListingTemplate) => {
    setSelectedTemplate(template);
    setShowPostingForm(true);
  };

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-6xl">
      <Helmet>
        <title>Devil's Marketplace | Buy & Sell on Campus</title>
        <meta name="description" content="Student marketplace for buying and selling textbooks, electronics, furniture and more." />
        <link rel="canonical" href="https://devilsmarketplace.lovable.app/marketplace" />
      </Helmet>
      <h1 className="sr-only">Devil's Marketplace - Buy and Sell on Campus</h1>
      
      <MarketplaceHeader 
        user={user} 
        activeListingType={activeListingType}
        onCreateListing={() => setShowPostingForm(true)}
        onSelectTemplate={handleSelectTemplate}
      />

      <ListingTypeToggle 
        activeType={activeListingType}
        onTypeChange={setActiveListingType}
        category="marketplace"
      />

      <MarketplaceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        activeListingType={activeListingType}
        listings={listings}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />

      <div className="mt-4">
        <MarketplaceGrid
          listings={listings}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          onLoadMore={loadMore}
          user={user}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          activeListingType={activeListingType}
          categoryFilter={categoryFilter}
        />
      </div>

      {showPostingForm && (
        <UnifiedListingCreation
          category="marketplace"
          listingType={activeListingType}
          onClose={() => { setShowPostingForm(false); setSelectedTemplate(null); }}
          onSuccess={() => { setShowPostingForm(false); setSelectedTemplate(null); }}
        />
      )}
    </div>
  );
};

export default Marketplace;
