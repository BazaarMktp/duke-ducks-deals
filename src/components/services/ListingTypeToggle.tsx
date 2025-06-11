
import { Button } from "@/components/ui/button";
import { Package, Search } from "lucide-react";

interface ListingTypeToggleProps {
  activeType: 'offer' | 'wanted';
  onTypeChange: (type: 'offer' | 'wanted') => void;
}

const ListingTypeToggle = ({ activeType, onTypeChange }: ListingTypeToggleProps) => {
  return (
    <div className="flex bg-gray-100 p-1 rounded-lg w-fit mx-auto mb-6">
      <Button
        variant={activeType === 'offer' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('offer')}
        className="flex items-center gap-2"
      >
        <Package size={16} />
        Browse Services
      </Button>
      <Button
        variant={activeType === 'wanted' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('wanted')}
        className="flex items-center gap-2"
      >
        <Search size={16} />
        Browse Requests
      </Button>
    </div>
  );
};

export default ListingTypeToggle;
