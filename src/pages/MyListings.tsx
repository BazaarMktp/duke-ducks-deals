import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMyListings } from "@/hooks/useMyListings";
import { ListingCard } from "@/components/listings/ListingCard";
import { MyListingsHeader } from "@/components/listings/MyListingsHeader";
import { EmptyListingsState } from "@/components/listings/EmptyListingsState";
import { BulkListingWizard } from "@/components/semester/BulkListingWizard";
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

const MyListings = () => {
  const { listings, loading, user, handleDelete, handleStatusToggle, handleMarkAsSold } = useMyListings();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showBulkWizard, setShowBulkWizard] = useState(false);

  // Check URL params for bulk mode
  useEffect(() => {
    if (searchParams.get('bulk') === 'true') {
      setShowBulkWizard(true);
      // Clear the param
      searchParams.delete('bulk');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleBulkSuccess = () => {
    // Refresh listings
    window.location.reload();
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Please sign in to view your listings.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading your listings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <MyListingsHeader />
        <Button 
          onClick={() => setShowBulkWizard(true)}
          variant="outline"
          className="gap-2"
        >
          <Package className="h-4 w-4" />
          Bulk List Items
        </Button>
      </div>

      {listings.length === 0 ? (
        <EmptyListingsState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onDelete={handleDelete}
              onStatusToggle={handleStatusToggle}
              onMarkAsSold={handleMarkAsSold}
              userId={user?.id}
              isAdmin={false}
            />
          ))}
        </div>
      )}

      {showBulkWizard && (
        <BulkListingWizard 
          onClose={() => setShowBulkWizard(false)}
          onSuccess={handleBulkSuccess}
        />
      )}
    </div>
  );
};

export default MyListings;
