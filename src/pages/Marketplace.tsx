
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ListingTypeToggle from "@/components/services/ListingTypeToggle";
import { useMarketplace } from "@/hooks/useMarketplace";
import MarketplaceHeader from "@/components/marketplace/MarketplaceHeader";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import MarketplaceGrid from "@/components/marketplace/MarketplaceGrid";
import { Helmet } from "react-helmet-async";

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
        <Helmet>
          <title>Bazaar Duke Marketplace | Buy & Sell on Campus</title>
          <meta name="description" content="Buy and sell items on Duke's student marketplace. Browse offers and wanted posts." />
          <link rel="canonical" href="https://bazaar.lovable.app/marketplace" />
        </Helmet>
        <h1 className="sr-only">Bazaar Duke Marketplace - Buy and Sell on Campus</h1>
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
