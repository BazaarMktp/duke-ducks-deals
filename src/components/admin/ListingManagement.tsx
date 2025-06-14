
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useListingManagement } from "./listing-management/useListingManagement";
import ListingSearch from "./listing-management/ListingSearch";
import ListingsTable from "./listing-management/ListingsTable";
import CollegeFilter from "./common/CollegeFilter";

const ListingManagement = () => {
  const {
    listings,
    loading,
    searchTerm,
    setSearchTerm,
    handleDelete,
    handleToggleStatus,
    colleges,
    collegeFilter,
    setCollegeFilter,
  } = useListingManagement();

  if (loading) {
    return <div className="text-center py-8">Loading listings...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Management</CardTitle>
        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4">
          <ListingSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <CollegeFilter
            colleges={colleges}
            selectedCollege={collegeFilter}
            onCollegeChange={setCollegeFilter}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ListingsTable
          listings={listings}
          colleges={colleges}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};

export default ListingManagement;
