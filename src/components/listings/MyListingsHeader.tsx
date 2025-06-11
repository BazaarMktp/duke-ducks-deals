
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const MyListingsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">My Listings</h1>
      <div className="flex gap-2">
        <Button onClick={() => navigate('/create-listing')} size="sm">
          <Plus size={16} className="mr-1" />
          Create Listing
        </Button>
      </div>
    </div>
  );
};
