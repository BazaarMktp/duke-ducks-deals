
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { User } from "./types";
import BanUserDialog from "./BanUserDialog";

interface UserActionsProps {
  user: User;
  onBanUser: (userId: string, reason: string) => void;
  onUnbanUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UserActions = ({ user, onBanUser, onUnbanUser, onDeleteUser }: UserActionsProps) => {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      onDeleteUser(user.id);
    }
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
      <Button
        size="sm"
        variant="destructive"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserActions;
