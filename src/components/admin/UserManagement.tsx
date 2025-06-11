
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserSearch from "./user-management/UserSearch";
import UsersTable from "./user-management/UsersTable";
import { useUserManagement } from "./user-management/useUserManagement";

const UserManagement = () => {
  const { 
    users, 
    loading, 
    searchTerm,
    setSearchTerm,
    handleBanUser, 
    handleUnbanUser, 
    handleDeleteUser 
  } = useUserManagement();

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <UserSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
      </CardHeader>
      <CardContent>
        <UsersTable
          users={users}
          onBanUser={handleBanUser}
          onUnbanUser={handleUnbanUser}
          onDeleteUser={handleDeleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
