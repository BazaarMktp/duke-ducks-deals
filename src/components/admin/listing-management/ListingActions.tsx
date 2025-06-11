
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ListingActionsProps {
  listingId: string;
  status: string;
  onToggleStatus: (listingId: string, currentStatus: string) => void;
  onDelete: (listingId: string) => void;
}

const ListingActions = ({ listingId, status, onToggleStatus, onDelete }: ListingActionsProps) => {
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      onDelete(listingId);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onToggleStatus(listingId, status)}
      >
        {status === 'active' ? 'Deactivate' : 'Activate'}
      </Button>
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

export default ListingActions;
