
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListingManagement } from "./listing-management/useListingManagement";
import ListingSearch from "./listing-management/ListingSearch";
import ListingsTable from "./listing-management/ListingsTable";

const ListingManagement = () => {
  const {
    listings,
    loading,
    searchTerm,
    setSearchTerm,
    deleteListing,
    toggleListingStatus,
  } = useListingManagement();

  if (loading) {
    return <div className="text-center py-8">Loading listings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Management</CardTitle>
        <ListingSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </CardHeader>
      <CardContent>
        <ListingsTable
          listings={listings}
          onToggleStatus={toggleListingStatus}
          onDelete={deleteListing}
        />
      </CardContent>
    </Card>
  );
};

export default ListingManagement;
