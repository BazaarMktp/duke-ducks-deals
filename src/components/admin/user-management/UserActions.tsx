
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { User } from "./types";
import BanUserDialog from "./BanUserDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserActionsProps {
  user: User;
  onBanUser: (userId: string, reason: string) => void;
  onUnbanUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UserActions = ({ user, onBanUser, onUnbanUser, onDeleteUser }: UserActionsProps) => {
  const handleDelete = () => {
    onDeleteUser(user.id);
  };

  return (
    <div className="flex space-x-2">
      {user.is_banned ? (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUnbanUser(user.id)}
        >
          Unban
        </Button>
      ) : (
        <BanUserDialog user={user} onBanUser={onBanUser} />
      )}
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete user "{user.email}"? This will permanently remove their profile and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserActions;
