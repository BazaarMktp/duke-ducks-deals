
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "./types";
import UserActions from "./UserActions";

interface UsersTableProps {
  users: User[];
  onBanUser: (userId: string, reason: string) => void;
  onUnbanUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UsersTable = ({ users, onBanUser, onUnbanUser, onDeleteUser }: UsersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Profile Name</TableHead>
          <TableHead>Full Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.profile_name}</TableCell>
            <TableCell>{user.full_name}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.is_banned 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {user.is_banned ? 'Banned' : 'Active'}
              </span>
            </TableCell>
            <TableCell>
              <UserActions
                user={user}
                onBanUser={onBanUser}
                onUnbanUser={onUnbanUser}
                onDeleteUser={onDeleteUser}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
