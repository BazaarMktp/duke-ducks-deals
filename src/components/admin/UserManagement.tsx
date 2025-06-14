
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserSearch from "./user-management/UserSearch";
import UsersTable from "./user-management/UsersTable";
import { useUserManagement } from "./user-management/useUserManagement";
import CollegeFilter from "./common/CollegeFilter";

const UserManagement = () => {
  const { 
    users, 
    loading, 
    searchTerm,
    setSearchTerm,
    handleBanUser, 
    handleUnbanUser, 
    handleDeleteUser,
    colleges,
    collegeFilter,
    setCollegeFilter,
  } = useUserManagement();

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4">
          <UserSearch 
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
        <UsersTable
          users={users}
          colleges={colleges}
          onBanUser={handleBanUser}
          onUnbanUser={handleUnbanUser}
          onDeleteUser={handleDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
