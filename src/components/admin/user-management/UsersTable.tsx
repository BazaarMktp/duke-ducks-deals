
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

interface College {
  id: string;
  name: string;
}
interface UsersTableProps {
  users: User[];
  colleges: College[];
  onBanUser: (userId: string, reason: string) => void;
  onUnbanUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UsersTable = ({ users, colleges, onBanUser, onUnbanUser, onDeleteUser }: UsersTableProps) => {
  const getCollegeName = (collegeId: string) => {
    return colleges.find(c => c.id === collegeId)?.name || 'N/A';
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Profile Name</TableHead>
          <TableHead>College</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.profile_name}</TableCell>
            <TableCell>{getCollegeName((user as any).college_id)}</TableCell>
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
