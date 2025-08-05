
import { useMyListings } from "@/hooks/useMyListings";
import { ListingCard } from "@/components/listings/ListingCard";
import { MyListingsHeader } from "@/components/listings/MyListingsHeader";
import { EmptyListingsState } from "@/components/listings/EmptyListingsState";

const MyListings = () => {
  const { listings, loading, user, handleDelete, handleStatusToggle, handleMarkAsSold } = useMyListings();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Please sign in to view your listings.</p>
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
      <MyListingsHeader />

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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
