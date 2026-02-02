
import { Button } from "@/components/ui/button";
import { Package, Search, Home, Users } from "lucide-react";

interface ListingTypeToggleProps {
  activeType: 'offer' | 'wanted';
  onTypeChange: (type: 'offer' | 'wanted') => void;
  category?: 'marketplace' | 'housing' | 'services';
}

const ListingTypeToggle = ({ activeType, onTypeChange, category = 'services' }: ListingTypeToggleProps) => {
  const getLabels = () => {
    switch (category) {
      case 'marketplace':
        return {
          offer: 'Browse Items',
          wanted: 'Browse Requests'
        };
      case 'housing':
        return {
          offer: 'Browse Housing',
          wanted: 'Browse Requests'
        };
      case 'services':
      default:
        return {
          offer: 'Browse Services',
          wanted: 'Browse Requests'
        };
    }
  };

  const getIcons = () => {
    switch (category) {
      case 'marketplace':
        return {
          offer: Package,
          wanted: Search
        };
      case 'housing':
        return {
          offer: Home,
          wanted: Search
        };
      case 'services':
      default:
        return {
          offer: Users,
          wanted: Search
        };
    }
  };

  const labels = getLabels();
  const icons = getIcons();
  const OfferIcon = icons.offer;
  const WantedIcon = icons.wanted;

  return (
    <div className="flex bg-gray-100 p-1 rounded-lg w-fit mx-auto my-8">
      <Button
        variant={activeType === 'offer' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('offer')}
        className="flex items-center gap-2"
      >
        <OfferIcon size={16} />
        {labels.offer}
      </Button>
      <Button
        variant={activeType === 'wanted' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onTypeChange('wanted')}
        className="flex items-center gap-2"
      >
        <WantedIcon size={16} />
        {labels.wanted}
      </Button>
    </div>
  );
};

export default ListingTypeToggle;
