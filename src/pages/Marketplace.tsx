
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ListingTypeToggle from "@/components/services/ListingTypeToggle";
import { useMarketplace } from "@/hooks/useMarketplace";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";

const Marketplace = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeListingType, setActiveListingType] = useState<'offer' | 'wanted'>('offer');

  const { listings, loading, favorites, toggleFavorite } = useMarketplace(
    user,
    searchQuery,
    sortBy,
    activeListingType
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <MarketplaceHeader user={user} activeListingType={activeListingType} />

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
      />

      <MarketplaceGrid
        listings={listings}
        loading={loading}
        user={user}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        activeListingType={activeListingType}
      />
    </div>
  );
};

export default Marketplace;
