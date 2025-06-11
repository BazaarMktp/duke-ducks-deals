
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const EmptyListingsState = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <p className="text-gray-500 mb-4">You haven't created any listings yet.</p>
      <Button onClick={() => navigate('/create-listing')}>
        <Plus size={16} className="mr-1" />
        Create Your First Listing
      </Button>
    </div>
  );
};
