
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Ban } from "lucide-react";
import { User } from "./types";

interface BanUserDialogProps {
  user: User;
  onBanUser: (userId: string, reason: string) => void;
}

const BanUserDialog = ({ user, onBanUser }: BanUserDialogProps) => {
  const [banReason, setBanReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleBan = () => {
    onBanUser(user.id, banReason);
    setBanReason("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Ban className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User: {user.email}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Reason for ban..."
            value={banReason}
            onChange={(e) => setBanReason(e.target.value)}
          />
          <div className="flex space-x-2">
            <Button
              onClick={handleBan}
              disabled={!banReason.trim()}
            >
              Ban User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BanUserDialog;
