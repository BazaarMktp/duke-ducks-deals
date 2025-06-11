
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserSearch from "./user-management/UserSearch";
import UsersTable from "./user-management/UsersTable";
import { useUserManagement } from "./user-management/useUserManagement";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { users, loading, banUser, unbanUser, deleteUser } = useUserManagement();

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          users={filteredUsers}
          onBanUser={banUser}
          onUnbanUser={unbanUser}
          onDeleteUser={deleteUser}
        />
      </CardContent>
    </Card>
  );
};

export default UserManagement;
